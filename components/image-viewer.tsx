"use client";

import { PointerEvent, WheelEvent, useEffect, useRef, useState } from "react";
import { Download, Maximize2, Minus, Move, Plus, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnnexItem } from "@/lib/annexes";

type ImageViewerProps = {
  annex: AnnexItem;
  onClose: () => void;
};

export function ImageViewer({ annex, onClose }: ImageViewerProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number; originX: number; originY: number } | null>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "+" || event.key === "=") {
        setZoom((current) => Math.min(8, current + 0.25));
      }

      if (event.key === "-") {
        setZoom((current) => Math.max(0.35, current - 0.25));
      }

      if (event.key === "0") {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    const direction = event.deltaY > 0 ? -0.12 : 0.12;
    setZoom((current) => Math.min(10, Math.max(0.25, current + direction)));
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragStart({
      x: event.clientX,
      y: event.clientY,
      originX: position.x,
      originY: position.y,
    });
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragStart) {
      return;
    }

    setPosition({
      x: dragStart.originX + event.clientX - dragStart.x,
      y: dragStart.originY + event.clientY - dragStart.y,
    });
  }

  return (
    <div ref={shellRef} className="fixed inset-0 z-50 bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex h-full flex-col">
        <div className="flex flex-col gap-3 border-b border-[var(--border)] bg-[var(--surface-strong)]/88 px-3 py-3 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between lg:px-5">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{annex.title}</p>
            <p className="truncate text-xs text-[var(--muted-foreground)]">{annex.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-xl border border-[#27272A] bg-black p-1">
              <Button size="icon" variant="ghost" title="Zoom out" onClick={() => setZoom((current) => Math.max(0.25, current - 0.25))}>
                <Minus />
              </Button>
              <span className="w-16 text-center text-xs font-semibold">{Math.round(zoom * 100)}%</span>
              <Button size="icon" variant="ghost" title="Zoom in" onClick={() => setZoom((current) => Math.min(10, current + 0.25))}>
                <Plus />
              </Button>
            </div>
            <Button
              size="icon"
              variant="secondary"
              title="Reset"
              onClick={() => {
                setZoom(1);
                setPosition({ x: 0, y: 0 });
              }}
            >
              <RotateCcw />
            </Button>
            <Button asChild size="icon" variant="secondary" title="Download">
              <a href={annex.downloadUrl} download>
                <Download />
              </a>
            </Button>
            <Button size="icon" variant="secondary" title="Fullscreen" onClick={() => shellRef.current?.requestFullscreen?.()}>
              <Maximize2 />
            </Button>
            <Button size="icon" variant="secondary" title="Close" onClick={onClose}>
              <X />
            </Button>
          </div>
        </div>

        <div
          className="relative min-h-0 flex-1 cursor-grab overflow-hidden bg-[var(--surface-muted)] active:cursor-grabbing"
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={() => setDragStart(null)}
          onPointerCancel={() => setDragStart(null)}
        >
          <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-xl border border-[#27272A] bg-[#111111] px-3 py-2 text-xs font-semibold text-[#A1A1AA] backdrop-blur-xl">
            <Move className="size-3.5" />
            Pan
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={annex.href}
            alt={annex.description}
            draggable={false}
            className="absolute left-1/2 top-1/2 max-h-none max-w-none select-none rounded-[24px] shadow-2xl transition-transform duration-100"
            style={{
              transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${zoom})`,
              transformOrigin: "center center",
              width: annex.kind === "schematic" ? "min(1400px, 88vw)" : "min(1200px, 86vw)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
