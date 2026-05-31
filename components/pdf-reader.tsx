"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
type FitMode = "custom" | "width" | "page";
type PdfJsModule = typeof import("pdfjs-dist/legacy/build/pdf.mjs");
type PDFDocumentProxy = import("pdfjs-dist/legacy/build/pdf.mjs").PDFDocumentProxy;
type PDFDocumentLoadingTask = ReturnType<PdfJsModule["getDocument"]>;
type PDFPageProxy = import("pdfjs-dist/legacy/build/pdf.mjs").PDFPageProxy;
type RenderTask = import("pdfjs-dist/legacy/build/pdf.mjs").RenderTask;
type PreviewPage = NonNullable<AnnexItem["previewPages"]>[number];

let pdfJsPromise: Promise<PdfJsModule> | null = null;

function getPdfJs() {
  pdfJsPromise ??= import("pdfjs-dist/legacy/build/pdf.mjs").then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.min.mjs", import.meta.url).toString();
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

function getPreviewBasePageSize(pages: PreviewPage[]) {
  if (!pages.length) {
    return { width: 612, height: 792 };
  }

  return pages.reduce(
    (largest, page) => ({
      width: Math.max(largest.width, page.width),
      height: Math.max(largest.height, page.height),
    }),
    { width: 1, height: 1 },
  );
}

export function PdfReader({ annex, onClose }: PdfReaderProps) {
  const previewPages = useMemo(() => annex.previewPages ?? [], [annex.previewPages]);
  const hasPreviewPages = previewPages.length > 0;
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [loadState, setLoadState] = useState<LoadState>(hasPreviewPages ? "ready" : "loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(previewPages.length || 1);
  const [zoom, setZoom] = useState(100);
  const [fit, setFit] = useState<FitMode>("width");
  const [scale, setScale] = useState(1);
  const [search, setSearch] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [resizeToken, setResizeToken] = useState(0);
  const [basePageSize, setBasePageSize] = useState(getPreviewBasePageSize(previewPages));

  const shellRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const loadPdf = useCallback(() => {
    let cancelled = false;
    let loadingTask: PDFDocumentLoadingTask | null = null;

    setErrorMessage("");
    setSearchMessage("");
    setPdfDoc(null);
    setPage(1);

    if (previewPages.length) {
      setPageCount(previewPages.length);
      setBasePageSize(getPreviewBasePageSize(previewPages));
      setLoadState("ready");
      return () => {
        cancelled = true;
      };
    }

    setLoadState("loading");

    getPdfJs()
      .then((pdfjs) => {
        if (cancelled) {
          return null;
        }

        loadingTask = pdfjs.getDocument({
          url: annex.href,
          canvasMaxAreaInBytes: -1,
          isImageDecoderSupported: false,
          isOffscreenCanvasSupported: false,
        });
        return loadingTask.promise;
      })
      .then(async (document) => {
        if (!document) {
          return;
        }

        if (cancelled) {
          void document.cleanup();
          return;
        }

        const firstPage = await document.getPage(1);
        const viewport = firstPage.getViewport({ scale: 1 });

        if (!cancelled) {
          setPdfDoc(document);
          setPageCount(document.numPages);
          setBasePageSize({ width: viewport.width, height: viewport.height });
          setLoadState("ready");
        }
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
  }, [annex.href, previewPages]);

  useEffect(() => loadPdf(), [loadPdf]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowRight" || event.key === "PageDown") {
        scrollToPage(Math.min(pageCount, page + 1));
      }

      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        scrollToPage(Math.max(1, page - 1));
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
  }, [onClose, page, pageCount]);

  useEffect(() => {
    function handleResize() {
      setResizeToken((current) => current + 1);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || loadState !== "ready") {
      return;
    }

    const horizontalPadding = window.innerWidth < 640 ? 24 : 64;
    const verticalPadding = window.innerWidth < 640 ? 24 : 64;
    const availableWidth = Math.max(280, viewport.clientWidth - horizontalPadding);
    const availableHeight = Math.max(360, viewport.clientHeight - verticalPadding);
    const fitWidthScale = availableWidth / basePageSize.width;
    const fitPageScale = Math.min(fitWidthScale, availableHeight / basePageSize.height);
    const nextScale = fit === "width" ? fitWidthScale : fit === "page" ? fitPageScale : zoom / 100;

    setScale(Math.max(hasPreviewPages ? 0.05 : 0.2, Math.min(nextScale, 4)));
  }, [basePageSize.height, basePageSize.width, fit, hasPreviewPages, loadState, resizeToken, zoom]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || loadState !== "ready") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => ({
            pageNumber: Number((entry.target as HTMLElement).dataset.pageNumber),
            top: Math.abs(entry.boundingClientRect.top - viewport.getBoundingClientRect().top),
          }))
          .sort((a, b) => a.top - b.top);

        if (visible[0]?.pageNumber) {
          setPage(visible[0].pageNumber);
        }
      },
      { root: viewport, threshold: 0.42 },
    );

    Object.values(pageRefs.current).forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [loadState, pageCount]);

  function scrollToPage(pageNumber: number) {
    pageRefs.current[pageNumber]?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

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
          setSearchMessage(`Found on page ${pageNumber}`);
          scrollToPage(pageNumber);
          return;
        }
      }

      setSearchMessage("No result found");
    } catch (error: unknown) {
      setSearchMessage(getErrorMessage(error));
    }
  }

  const pageNumbers = useMemo(() => Array.from({ length: pageCount }, (_, index) => index + 1), [pageCount]);
  const progress = Math.round((page / pageCount) * 100);

  return (
    <div ref={shellRef} className="fixed inset-0 z-50 h-[100dvh] bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex h-full flex-col">
        <div className="shrink-0 border-b border-[var(--border)] bg-[var(--surface-strong)]/92 px-3 py-3 backdrop-blur-xl lg:px-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
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

            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
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
                className="hidden sm:inline-flex"
                onClick={() => shellRef.current?.requestFullscreen?.()}
              >
                <Maximize2 />
              </Button>
              <Button size="icon" variant="ghost" title="Close" onClick={onClose}>
                <X />
              </Button>
            </div>
          </div>

          <div
            className={cn(
              "mt-3 grid gap-3 xl:items-center",
              !hasPreviewPages && "xl:grid-cols-[minmax(240px,1fr)_auto]",
            )}
          >
            {!hasPreviewPages && (
              <form className="relative min-w-0" onSubmit={handleSearch}>
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
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" variant={fit === "width" ? "default" : "secondary"} onClick={() => setFit("width")}>
                <Expand />
                Width
              </Button>
              <Button size="sm" variant={fit === "page" ? "default" : "secondary"} onClick={() => setFit("page")}>
                <FileSearch />
                Page
              </Button>
              <div className="flex shrink-0 items-center rounded-xl border border-[#27272A] bg-black p-1">
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
              <div className="flex shrink-0 items-center rounded-xl border border-[#27272A] bg-black p-1">
                <Button size="icon" variant="ghost" title="Previous page" onClick={() => scrollToPage(Math.max(1, page - 1))}>
                  <ChevronLeft />
                </Button>
                <span className="min-w-20 text-center text-xs font-semibold">
                  {page} / {pageCount}
                </span>
                <Button size="icon" variant="ghost" title="Next page" onClick={() => scrollToPage(Math.min(pageCount, page + 1))}>
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#27272A]">
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
              {pageNumbers.map((pageNumber) => {
                const isActive = pageNumber === page;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => scrollToPage(pageNumber)}
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

          <main
            ref={viewportRef}
            className="viewer-scrollbar min-h-0 overflow-auto bg-[var(--surface-muted)] p-3 overscroll-contain sm:p-5"
          >
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
              <div className="mx-auto flex w-max max-w-full flex-col items-center gap-4 pb-8 sm:gap-6">
                {hasPreviewPages
                  ? previewPages.map((previewPage, index) => {
                      const pageNumber = index + 1;

                      return (
                        <PdfImagePage
                          key={previewPage.src}
                          page={previewPage}
                          pageNumber={pageNumber}
                          scale={scale}
                          setPageRef={(element) => {
                            pageRefs.current[pageNumber] = element;
                          }}
                        />
                      );
                    })
                  : pdfDoc &&
                    pageNumbers.map((pageNumber) => (
                      <PdfPage
                        key={pageNumber}
                        pageNumber={pageNumber}
                        pdfDoc={pdfDoc}
                        root={viewportRef.current}
                        scale={scale}
                        setPageRef={(element) => {
                          pageRefs.current[pageNumber] = element;
                        }}
                      />
                    ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function PdfImagePage({
  page,
  pageNumber,
  scale,
  setPageRef,
}: {
  page: PreviewPage;
  pageNumber: number;
  scale: number;
  setPageRef: (element: HTMLDivElement | null) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const displayWidth = Math.max(160, Math.floor(page.width * scale));

  useEffect(() => {
    setPageRef(wrapperRef.current);
    return () => setPageRef(null);
  }, [setPageRef]);

  return (
    <div ref={wrapperRef} data-page-number={pageNumber} className="scroll-mt-4">
      <div className="mb-2 flex items-center justify-between px-1 text-xs font-semibold text-[var(--muted-foreground)]">
        <span>Page {pageNumber}</span>
      </div>
      <div className="relative rounded-xl bg-white shadow-2xl ring-1 ring-black/10 sm:rounded-2xl">
        <img
          src={page.src}
          width={page.width}
          height={page.height}
          alt={`Page ${pageNumber}`}
          loading={pageNumber <= 2 ? "eager" : "lazy"}
          decoding="async"
          className="block h-auto max-w-none rounded-xl bg-white sm:rounded-2xl"
          style={{ width: `${displayWidth}px` }}
        />
      </div>
    </div>
  );
}

function PdfPage({
  pageNumber,
  pdfDoc,
  root,
  scale,
  setPageRef,
}: {
  pageNumber: number;
  pdfDoc: PDFDocumentProxy;
  root: HTMLElement | null;
  scale: number;
  setPageRef: (element: HTMLDivElement | null) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const [hasBeenNearViewport, setHasBeenNearViewport] = useState(pageNumber === 1);
  const [renderState, setRenderState] = useState<"idle" | "rendering" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setPageRef(wrapperRef.current);
    return () => setPageRef(null);
  }, [setPageRef]);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element || !root || hasBeenNearViewport) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setHasBeenNearViewport(true);
        }
      },
      { root, rootMargin: "900px 0px", threshold: 0.01 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasBeenNearViewport, root]);

  useEffect(() => {
    if (!hasBeenNearViewport) {
      return;
    }

    let cancelled = false;

    async function renderPage() {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      renderTaskRef.current?.cancel();
      setRenderState("rendering");
      setErrorMessage("");

      try {
        const pdfPage: PDFPageProxy = await pdfDoc.getPage(pageNumber);
        const viewport = pdfPage.getViewport({ scale });
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Canvas rendering is not available in this browser.");
        }

        const outputScale = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;
        context.setTransform(outputScale, 0, 0, outputScale, 0, 0);
        context.clearRect(0, 0, viewport.width, viewport.height);
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, viewport.width, viewport.height);

        const renderTask = pdfPage.render({
          background: "rgb(255, 255, 255)",
          canvas,
          canvasContext: context,
          viewport,
        });
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
  }, [hasBeenNearViewport, pageNumber, pdfDoc, scale]);

  return (
    <div ref={wrapperRef} data-page-number={pageNumber} className="scroll-mt-4">
      <div className="mb-2 flex items-center justify-between px-1 text-xs font-semibold text-[var(--muted-foreground)]">
        <span>Page {pageNumber}</span>
        {renderState === "rendering" && (
          <span className="inline-flex items-center gap-1">
            <Loader2 className="size-3 animate-spin" />
            Rendering
          </span>
        )}
      </div>
      <div className="relative rounded-xl bg-white shadow-2xl ring-1 ring-black/10 sm:rounded-2xl">
        {!hasBeenNearViewport && <div className="h-[520px] w-[min(78vw,760px)] rounded-xl bg-white sm:rounded-2xl" />}
        {renderState === "error" && (
          <div className="grid h-[520px] w-[min(78vw,760px)] place-items-center rounded-xl bg-white p-8 text-center text-black sm:rounded-2xl">
            <div>
              <FileSearch className="mx-auto mb-3 size-7" />
              <p className="font-semibold">Page could not be rendered</p>
              <p className="mt-2 text-sm text-black/60">{errorMessage}</p>
            </div>
          </div>
        )}
        <canvas ref={canvasRef} className={cn("block rounded-xl bg-white sm:rounded-2xl", !hasBeenNearViewport && "hidden")} />
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
