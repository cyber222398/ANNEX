"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Expand,
  ExternalLink,
  FileSearch,
  Loader2,
  Maximize2,
  Minus,
  PanelLeft,
  Plus,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnnexItem } from "@/lib/annexes";
import { cn } from "@/lib/utils";

type PdfReaderProps = {
  annex: AnnexItem;
  onClose: () => void;
};

type LoadState = "loading" | "ready" | "error";
type RenderState = "idle" | "rendering" | "error";
type PdfJsModule = typeof import("pdfjs-dist");
type PDFDocumentProxy = import("pdfjs-dist").PDFDocumentProxy;
type PDFDocumentLoadingTask = ReturnType<PdfJsModule["getDocument"]>;
type PDFPageProxy = import("pdfjs-dist").PDFPageProxy;
type RenderTask = import("pdfjs-dist").RenderTask;

let pdfJsPromise: Promise<PdfJsModule> | null = null;

function getPdfJs() {
  pdfJsPromise ??= import("pdfjs-dist").then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
    return pdfjs;
  });

  return pdfJsPromise;
}

function isTextItem(item: unknown): item is { str: string } {
  return typeof item === "object" && item !== null && "str" in item && typeof (item as { str: unknown }).str === "string";
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "The PDF could not be loaded.";
}

export function PdfReader({ annex, onClose }: PdfReaderProps) {
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [renderState, setRenderState] = useState<RenderState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [fit, setFit] = useState<"custom" | "width" | "page">("width");
  const [search, setSearch] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [resizeToken, setResizeToken] = useState(0);

  const shellRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);

  const loadPdf = useCallback(() => {
    let cancelled = false;
    let loadingTask: PDFDocumentLoadingTask | null = null;

    setLoadState("loading");
    setRenderState("idle");
    setErrorMessage("");
    setSearchMessage("");
    setPdfDoc(null);
    setPage(1);

    getPdfJs()
      .then((pdfjs) => {
        if (cancelled) {
          return null;
        }

        loadingTask = pdfjs.getDocument({ url: annex.href });
        return loadingTask.promise;
      })
      .then((document) => {
        if (!document) {
          return;
        }

        if (cancelled) {
          void document.cleanup();
          return;
        }

        setPdfDoc(document);
        setPageCount(document.numPages);
        setLoadState("ready");
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        setLoadState("error");
        setErrorMessage(getErrorMessage(error));
      });

    return () => {
      cancelled = true;
      void loadingTask?.destroy();
    };
  }, [annex.href]);

  useEffect(() => loadPdf(), [loadPdf]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowRight") {
        setPage((current) => Math.min(pageCount, current + 1));
      }

      if (event.key === "ArrowLeft") {
        setPage((current) => Math.max(1, current - 1));
      }

      if (event.key === "+" || event.key === "=") {
        setFit("custom");
        setZoom((current) => Math.min(220, current + 10));
      }

      if (event.key === "-") {
        setFit("custom");
        setZoom((current) => Math.max(50, current - 10));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, pageCount]);

  useEffect(() => {
    function handleResize() {
      setResizeToken((current) => current + 1);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!pdfDoc || loadState !== "ready") {
      return;
    }

    let cancelled = false;

    async function renderPage() {
      const canvas = canvasRef.current;
      const viewportElement = viewportRef.current;

      if (!canvas || !viewportElement || !pdfDoc) {
        return;
      }

      renderTaskRef.current?.cancel();
      setRenderState("rendering");

      try {
        const pdfPage: PDFPageProxy = await pdfDoc.getPage(page);
        const baseViewport = pdfPage.getViewport({ scale: 1 });
        const availableWidth = Math.max(viewportElement.clientWidth - 48, 320);
        const availableHeight = Math.max(viewportElement.clientHeight - 48, 420);
        const fitWidthScale = availableWidth / baseViewport.width;
        const fitPageScale = Math.min(fitWidthScale, availableHeight / baseViewport.height);
        const scale = fit === "width" ? fitWidthScale : fit === "page" ? fitPageScale : zoom / 100;
        const safeScale = Math.max(0.2, Math.min(scale, 4));
        const viewport = pdfPage.getViewport({ scale: safeScale });
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Canvas rendering is not available in this browser.");
        }

        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;
        context.setTransform(outputScale, 0, 0, outputScale, 0, 0);
        context.clearRect(0, 0, viewport.width, viewport.height);

        const renderTask = pdfPage.render({ canvas, canvasContext: context, viewport });
        renderTaskRef.current = renderTask;
        await renderTask.promise;

        if (!cancelled) {
          setRenderState("idle");
        }
      } catch (error: unknown) {
        if (cancelled || (error instanceof Error && error.name === "RenderingCancelledException")) {
          return;
        }

        setRenderState("error");
        setErrorMessage(getErrorMessage(error));
      }
    }

    void renderPage();

    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
    };
  }, [fit, loadState, page, pdfDoc, resizeToken, zoom]);

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = search.trim().toLowerCase();
    if (!query || !pdfDoc) {
      setSearchMessage("");
      return;
    }

    setSearchMessage("Searching...");

    try {
      for (let pageNumber = 1; pageNumber <= pdfDoc.numPages; pageNumber += 1) {
        const pdfPage = await pdfDoc.getPage(pageNumber);
        const textContent = await pdfPage.getTextContent();
        const text = textContent.items
          .map((item) => (isTextItem(item) ? item.str : ""))
          .join(" ")
          .toLowerCase();

        if (text.includes(query)) {
          setPage(pageNumber);
          setSearchMessage(`Found on page ${pageNumber}`);
          return;
        }
      }

      setSearchMessage("No result found");
    } catch (error: unknown) {
      setSearchMessage(getErrorMessage(error));
    }
  }

  const progress = Math.round((page / pageCount) * 100);

  return (
    <div ref={shellRef} className="fixed inset-0 z-50 bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex h-full flex-col">
        <div className="flex flex-col gap-3 border-b border-[var(--border)] bg-[var(--surface-strong)]/88 px-3 py-3 backdrop-blur-xl lg:px-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowSidebar((current) => !current)}
                title="Thumbnails"
              >
                <PanelLeft />
              </Button>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{annex.title}</p>
                <p className="truncate text-xs text-[var(--muted-foreground)]">{annex.fileName}</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button asChild size="icon" variant="ghost" title="Open original PDF">
                <a href={annex.href} target="_blank" rel="noreferrer">
                  <ExternalLink />
                </a>
              </Button>
              <Button asChild size="icon" variant="ghost" title="Download">
                <a href={annex.downloadUrl} download>
                  <Download />
                </a>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                title="Fullscreen"
                onClick={() => shellRef.current?.requestFullscreen?.()}
              >
                <Maximize2 />
              </Button>
              <Button size="icon" variant="ghost" title="Close" onClick={onClose}>
                <X />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <form className="relative max-w-xl flex-1" onSubmit={handleSearch}>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search in PDF"
                className="h-10 w-full rounded-xl border border-[#27272A] bg-black pl-10 pr-4 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-white/30"
              />
              {searchMessage && (
                <span className="absolute left-3 top-full mt-1 text-xs text-[#A1A1AA]">{searchMessage}</span>
              )}
            </form>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant={fit === "width" ? "default" : "secondary"}
                onClick={() => setFit("width")}
              >
                <Expand />
                Fit width
              </Button>
              <Button
                size="sm"
                variant={fit === "page" ? "default" : "secondary"}
                onClick={() => setFit("page")}
              >
                <FileSearch />
                Fit page
              </Button>
              <div className="flex items-center rounded-xl border border-[#27272A] bg-black p-1">
                <Button
                  size="icon"
                  variant="ghost"
                  title="Zoom out"
                  onClick={() => {
                    setFit("custom");
                    setZoom((current) => Math.max(50, current - 10));
                  }}
                >
                  <Minus />
                </Button>
                <span className="w-14 text-center text-xs font-semibold">{fit === "custom" ? `${zoom}%` : "Auto"}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  title="Zoom in"
                  onClick={() => {
                    setFit("custom");
                    setZoom((current) => Math.min(220, current + 10));
                  }}
                >
                  <Plus />
                </Button>
              </div>
              <div className="flex items-center rounded-xl border border-[#27272A] bg-black p-1">
                <Button
                  size="icon"
                  variant="ghost"
                  title="Previous page"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  <ChevronLeft />
                </Button>
                <span className="min-w-20 text-center text-xs font-semibold">
                  {page} / {pageCount}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  title="Next page"
                  onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </div>

          <div className="h-1 overflow-hidden rounded-full bg-[#27272A]">
            <div className="h-full rounded-full bg-white transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[auto_1fr]">
          <aside
            className={cn(
              "viewer-scrollbar hidden w-64 overflow-y-auto border-r border-[var(--border)] bg-[var(--surface)]/76 p-3 backdrop-blur-xl lg:block",
              !showSidebar && "lg:hidden",
            )}
          >
            <div className="grid gap-3">
              {Array.from({ length: pageCount }, (_, index) => {
                const pageNumber = index + 1;
                const isActive = pageNumber === page;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={cn(
                      "group rounded-2xl border p-2 text-left transition-all",
                      isActive
                        ? "border-white bg-white/10"
                        : "border-[#27272A] bg-[#111111] hover:-translate-y-0.5 hover:border-[#3F3F46]",
                    )}
                  >
                    <div className="preview-grid aspect-[4/5] rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
                      <div className="mb-3 h-2 w-16 rounded-full bg-[var(--foreground)]/18" />
                      <div className="space-y-1.5">
                        <div className="h-1.5 rounded-full bg-[var(--foreground)]/14" />
                        <div className="h-1.5 rounded-full bg-[var(--foreground)]/10" />
                        <div className="h-1.5 w-2/3 rounded-full bg-[var(--foreground)]/10" />
                      </div>
                    </div>
                    <p className="mt-2 text-center text-xs font-semibold text-[var(--muted-foreground)]">Page {pageNumber}</p>
                  </button>
                );
              })}
            </div>
          </aside>

          <main ref={viewportRef} className="viewer-scrollbar relative min-h-0 overflow-auto bg-[var(--surface-muted)] p-3 lg:p-5">
            {loadState === "loading" && (
              <PdfStatus
                icon={<Loader2 className="size-6 animate-spin" />}
                title="Loading PDF"
                message="Preparing the document renderer..."
              />
            )}

            {loadState === "error" && (
              <PdfError
                title="PDF could not be loaded"
                message={errorMessage}
                href={annex.href}
                downloadUrl={annex.downloadUrl}
                onRetry={loadPdf}
              />
            )}

            {loadState === "ready" && (
              <div className="flex min-h-full items-start justify-center">
                <div className="relative">
                  {renderState === "rendering" && (
                    <div className="absolute inset-0 z-10 grid place-items-center rounded-2xl bg-black/45 backdrop-blur-sm">
                      <Loader2 className="size-6 animate-spin text-white" />
                    </div>
                  )}

                  {renderState === "error" ? (
                    <PdfError
                      title="Page could not be rendered"
                      message={errorMessage}
                      href={annex.href}
                      downloadUrl={annex.downloadUrl}
                      onRetry={() => setResizeToken((current) => current + 1)}
                    />
                  ) : (
                    <canvas ref={canvasRef} className="rounded-2xl bg-white shadow-2xl" />
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function PdfStatus({ icon, title, message }: { icon: React.ReactNode; title: string; message: string }) {
  return (
    <div className="grid min-h-full place-items-center p-6">
      <div className="max-w-md rounded-2xl border border-[#27272A] bg-[#111111] p-8 text-center">
        <div className="mx-auto mb-4 grid size-12 place-items-center rounded-xl border border-[#27272A] bg-black text-white">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-[#A1A1AA]">{message}</p>
      </div>
    </div>
  );
}

function PdfError({
  title,
  message,
  href,
  downloadUrl,
  onRetry,
}: {
  title: string;
  message: string;
  href: string;
  downloadUrl: string;
  onRetry: () => void;
}) {
  return (
    <div className="grid min-h-full place-items-center p-6">
      <div className="max-w-lg rounded-2xl border border-[#27272A] bg-[#111111] p-8 text-center">
        <div className="mx-auto mb-4 grid size-12 place-items-center rounded-xl border border-[#27272A] bg-black text-white">
          <FileSearch className="size-6" />
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-[#A1A1AA]">{message}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={onRetry} variant="secondary">
            <RotateCcw />
            Retry
          </Button>
          <Button asChild variant="secondary">
            <a href={href} target="_blank" rel="noreferrer">
              <ExternalLink />
              Open original
            </a>
          </Button>
          <Button asChild>
            <a href={downloadUrl} download>
              <Download />
              Download
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
