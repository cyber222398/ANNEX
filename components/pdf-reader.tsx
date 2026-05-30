"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Expand,
  FileSearch,
  Maximize2,
  Minus,
  PanelLeft,
  Plus,
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

export function PdfReader({ annex, onClose }: PdfReaderProps) {
  const pageCount = annex.pageCount ?? 12;
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [fit, setFit] = useState<"custom" | "width" | "page">("width");
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const shellRef = useRef<HTMLDivElement>(null);

  const pdfSrc = useMemo(() => {
    const hash = new URLSearchParams();
    hash.set("page", String(page));

    if (fit === "width") {
      hash.set("view", "FitH");
    } else if (fit === "page") {
      hash.set("view", "Fit");
    } else {
      hash.set("zoom", String(zoom));
    }

    if (appliedSearch.trim()) {
      hash.set("search", appliedSearch.trim());
    }

    return `${annex.href}#${hash.toString()}`;
  }, [annex.href, appliedSearch, fit, page, zoom]);

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
                <p className="truncate text-xs text-[var(--muted-foreground)]">{annex.description}</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
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
            <form
              className="relative max-w-xl flex-1"
              onSubmit={(event) => {
                event.preventDefault();
                setAppliedSearch(search);
              }}
            >
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search in PDF"
                className="h-10 w-full rounded-xl border border-[#27272A] bg-black pl-10 pr-4 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-white/30"
              />
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

          <main className="min-h-0 bg-[var(--surface-muted)] p-3 lg:p-5">
            <iframe
              key={pdfSrc}
              title={annex.title}
              src={pdfSrc}
              className="h-full min-h-[60vh] w-full rounded-[28px] border border-[var(--border)] bg-white shadow-2xl"
            />
          </main>
        </div>
      </div>
    </div>
  );
}
