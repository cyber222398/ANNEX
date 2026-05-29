"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Boxes,
  Command,
  Download,
  File,
  FileText,
  FolderOpen,
  GalleryHorizontal,
  Image as ImageIcon,
  Layers3,
  Maximize2,
  PanelTop,
  Search,
  Sparkles,
  SquareArrowOutUpRight,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { ImageViewer } from "@/components/image-viewer";
import { PdfReader } from "@/components/pdf-reader";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import type { AnnexItem } from "@/lib/annexes";
import { cn } from "@/lib/utils";

type AnnexStats = {
  total: number;
  documents: number;
  schematics: number;
  photos: number;
  totalSize: string;
};

type AnnexPortalProps = {
  annexes: AnnexItem[];
  stats: AnnexStats;
};

const categories = ["All", "Documents", "Schematics", "Photos", "Data"] as const;

const accentClasses: Record<AnnexItem["accent"], string> = {
  blue: "from-blue-500/22 to-blue-500/0 text-blue-500",
  emerald: "from-emerald-500/22 to-emerald-500/0 text-emerald-500",
  amber: "from-amber-500/24 to-amber-500/0 text-amber-500",
  rose: "from-rose-500/22 to-rose-500/0 text-rose-500",
  violet: "from-violet-500/22 to-violet-500/0 text-violet-500",
};

const typeIcons: Record<AnnexItem["kind"], typeof FileText> = {
  pdf: FileText,
  schematic: Layers3,
  image: ImageIcon,
  document: File,
  other: Boxes,
};

export function AnnexPortal({ annexes, stats }: AnnexPortalProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [selectedAnnex, setSelectedAnnex] = useState<AnnexItem | null>(null);

  const filteredAnnexes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return annexes.filter((annex) => {
      const matchesCategory =
        category === "All" ||
        annex.category === category ||
        (category === "Photos" && annex.category === "Data");

      const haystack = [
        annex.title,
        annex.description,
        annex.fileName,
        annex.category,
        annex.extension,
        ...annex.tags,
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [annexes, category, query]);

  const documents = annexes.filter((annex) => annex.category === "Documents").slice(0, 4);
  const schematics = annexes.filter((annex) => annex.category === "Schematics").slice(0, 4);
  const photos = annexes.filter((annex) => annex.category === "Photos" || annex.category === "Data").slice(0, 4);
  const quickAccess = annexes.slice(0, 5);
  const heroMetricCards: Array<{ label: string; value: number; Icon: LucideIcon }> = [
    { label: "PDF", value: stats.documents, Icon: FileText },
    { label: "SVG", value: stats.schematics, Icon: Layers3 },
    { label: "Media", value: stats.photos, Icon: GalleryHorizontal },
  ];

  return (
    <main className="page-grid min-h-screen overflow-hidden text-[var(--foreground)]">
      <div className="noise text-[var(--foreground)]" />

      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/72 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <a href="#top" className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-[var(--foreground)] text-[var(--background)] shadow-lg">
              <FolderOpen className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold tracking-tight">Annex Portal</span>
              <span className="block truncate text-xs text-[var(--muted-foreground)]">Ouansimi companion archive</span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 md:flex">
            {["Annexes", "Documents", "Schematics", "Photos", "Search"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="rounded-full px-4 py-2 text-xs font-medium text-[var(--muted-foreground)] transition hover:bg-[var(--surface-strong)] hover:text-[var(--foreground)]"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild className="hidden sm:inline-flex">
              <a href="#annexes">
                <Zap />
                Explore
              </a>
            </Button>
          </div>
        </div>
      </header>

      <section id="top" className="mx-auto grid max-w-7xl gap-10 px-4 pb-14 pt-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-20 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="flex flex-col justify-center"
        >
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--muted-foreground)] backdrop-blur-xl">
            <Sparkles className="size-3.5 text-[var(--accent-blue)]" />
            Premium annex companion for the existing report
          </div>
          <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            Every annex, drawing and document in one calm reading space.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-[var(--muted-foreground)]">
            A modern portal for the examiner to browse referenced files without turning the report into a website.
          </p>

          <div className="mt-8 max-w-2xl rounded-[28px] border border-[var(--border)] bg-[var(--surface-strong)] p-2 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <div className="flex items-center gap-3 rounded-[22px] bg-[var(--surface-muted)] px-4 py-3">
              <Search className="size-5 text-[var(--muted-foreground)]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search annexes, SCADA captures, schematics..."
                className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[var(--muted-foreground)]"
              />
              <Command className="hidden size-4 text-[var(--muted-foreground)] sm:block" />
            </div>
          </div>

          <div className="mt-7 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Annexes" value={stats.total} />
            <Stat label="Documents" value={stats.documents} />
            <Stat label="Schematics" value={stats.schematics} />
            <Stat label="Size" value={stats.totalSize} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08, ease: "easeOut" }}
          className="relative min-h-[520px]"
        >
          <div className="glass-panel absolute inset-x-0 top-10 rounded-[36px] p-4 sm:p-5">
            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-strong)] p-3">
              <div className="mb-3 flex items-center justify-between px-2 py-1">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-rose-400" />
                  <span className="size-2.5 rounded-full bg-amber-400" />
                  <span className="size-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs text-[var(--muted-foreground)]">
                  Annex Explorer
                </span>
              </div>

              <div className="grid gap-3">
                {(quickAccess.length ? quickAccess : fallbackPreviewItems).slice(0, 4).map((annex, index) => (
                  <button
                    key={annex.id}
                    onClick={() => {
                      if ("downloadUrl" in annex) {
                        setSelectedAnnex(annex);
                      }
                    }}
                    className="group grid grid-cols-[72px_1fr_auto] items-center gap-4 rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-3 text-left transition hover:-translate-y-0.5 hover:bg-[var(--surface-strong)]"
                  >
                    <MiniPreview annex={annex} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{annex.title}</span>
                      <span className="mt-1 block truncate text-xs text-[var(--muted-foreground)]">{annex.description}</span>
                    </span>
                    <ArrowUpRight className="size-4 text-[var(--muted-foreground)] transition group-hover:text-[var(--foreground)]" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="soft-card absolute bottom-0 left-4 right-4 rounded-[30px] p-5 shadow-2xl lg:left-10 lg:right-10">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Instant file index</span>
              <span className="rounded-full bg-emerald-500/12 px-3 py-1 text-xs font-medium text-emerald-500">Live</span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {heroMetricCards.map(({ label, value, Icon }) => (
                <div key={label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                  <Icon className="mb-3 size-5 text-[var(--accent-blue)]" />
                  <p className="text-2xl font-semibold">{value}</p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section id="summary" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <InfoTile icon={BookOpen} title="Companion only" text="The PDF report remains the source document. This site organizes the referenced evidence." />
          <InfoTile icon={PanelTop} title="Examiner first" text="Search, previews and direct actions keep the annex workflow fast during review." />
          <InfoTile icon={SquareArrowOutUpRight} title="File driven" text="Drop files into public/annexes and the explorer indexes them automatically." />
        </div>
      </section>

      <section id="annexes" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Annexes"
          title="Annex Explorer"
          text="Browse PDFs, drawings, photos, captures and documentation from a single responsive index."
        />

        <div id="search" className="mt-8 flex flex-col gap-4 rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-3 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, file type, tag or description"
              className="h-12 w-full rounded-full border border-[var(--border)] bg-[var(--surface-strong)] pl-11 pr-4 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-[var(--ring)]"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={cn(
                  "h-11 shrink-0 rounded-full px-4 text-sm font-medium transition",
                  category === item
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {filteredAnnexes.length ? (
          <motion.div layout className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredAnnexes.map((annex) => {
                const openAnnex = () => setSelectedAnnex(annex);

                return (
                  <motion.div key={annex.id} layout>
                    <AnnexCard annex={annex} onOpen={openAnnex} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="mt-8 rounded-[32px] border border-dashed border-[var(--border)] bg-[var(--surface)] p-12 text-center">
            <Search className="mx-auto mb-4 size-8 text-[var(--muted-foreground)]" />
            <p className="text-lg font-semibold">No annex matched this search.</p>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">Add files to public/annexes or clear the current filters.</p>
          </div>
        )}
      </section>

      <LibrarySection id="documents" eyebrow="Documents" title="PDFs and technical documentation" annexes={documents} onOpen={setSelectedAnnex} />
      <LibrarySection id="schematics" eyebrow="Schematics" title="Large drawings and electrical plans" annexes={schematics} onOpen={setSelectedAnnex} />
      <LibrarySection id="photos" eyebrow="Photos" title="Photos, SCADA captures and visual evidence" annexes={photos} onOpen={setSelectedAnnex} />

      <section id="quick-access" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="glass-panel grid gap-8 rounded-[36px] p-6 md:grid-cols-[0.9fr_1.1fr] md:p-8">
          <div>
            <p className="mb-3 text-sm font-medium text-[var(--accent-blue)]">Quick Access</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">The most important annexes stay one click away.</h2>
          </div>
          <div className="grid gap-3">
            {quickAccess.map((annex) => {
              const Icon = typeIcons[annex.kind];

              return (
                <button
                  key={annex.id}
                  onClick={() => setSelectedAnnex(annex)}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 text-left transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-muted)]">
                      <Icon className="size-4 text-[var(--accent-blue)]" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{annex.title}</span>
                      <span className="block truncate text-xs text-[var(--muted-foreground)]">{annex.description}</span>
                    </span>
                  </span>
                  <ArrowUpRight className="size-4 text-[var(--muted-foreground)] transition group-hover:text-[var(--foreground)]" />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-[var(--border)] px-4 py-10 text-sm text-[var(--muted-foreground)] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>Ouansimi Annex Portal</p>
        <p>Files are indexed from /public/annexes.</p>
      </footer>

      <AnimatePresence>
        {selectedAnnex && <AnnexViewer annex={selectedAnnex} onClose={() => setSelectedAnnex(null)} />}
      </AnimatePresence>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 backdrop-blur-xl">
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs font-medium text-[var(--muted-foreground)]">{label}</p>
    </div>
  );
}

function InfoTile({ icon: Icon, title, text }: { icon: typeof BookOpen; title: string; text: string }) {
  return (
    <div className="soft-card rounded-[28px] p-6 transition hover:-translate-y-1">
      <Icon className="mb-5 size-6 text-[var(--accent-blue)]" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{text}</p>
    </div>
  );
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="max-w-3xl">
      <p className="mb-3 text-sm font-medium text-[var(--accent-blue)]">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">{title}</h2>
      <p className="mt-4 text-lg leading-8 text-[var(--muted-foreground)]">{text}</p>
    </div>
  );
}

function AnnexCard({ annex, onOpen }: { annex: AnnexItem; onOpen: () => void }) {
  const Icon = typeIcons[annex.kind];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="group soft-card overflow-hidden rounded-[30px] transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <button onClick={onOpen} className="block w-full text-left">
        <AnnexPreview annex={annex} />
      </button>
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-medium text-[var(--muted-foreground)]">
                <Icon className="size-3.5" />
                {annex.extension}
              </span>
              <span className="rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-medium text-[var(--muted-foreground)]">
                {annex.size}
              </span>
            </div>
            <h3 className="truncate text-xl font-semibold tracking-tight">{annex.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted-foreground)]">{annex.description}</p>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {annex.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--muted-foreground)]">
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button size="sm" variant="secondary" onClick={onOpen}>
            <SquareArrowOutUpRight />
            Open
          </Button>
          <Button asChild size="sm" variant="secondary">
            <a href={annex.downloadUrl} download>
              <Download />
              Download
            </a>
          </Button>
          <Button size="sm" variant="secondary" onClick={onOpen}>
            <Maximize2 />
            Fullscreen
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

function AnnexPreview({ annex }: { annex: AnnexItem }) {
  const Icon = typeIcons[annex.kind];

  if ((annex.kind === "image" || annex.kind === "schematic") && annex.href) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--surface-muted)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={annex.href} alt={annex.description} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-transparent" />
      </div>
    );
  }

  return (
    <div className={cn("relative aspect-[16/10] overflow-hidden bg-gradient-to-br p-5", accentClasses[annex.accent])}>
      <div className="absolute inset-0 preview-grid opacity-60" />
      <div className="relative flex h-full flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <Icon className="size-7" />
          <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs font-semibold">{annex.extension}</span>
        </div>
        <div className="space-y-2">
          <div className="h-2 w-3/4 rounded-full bg-[var(--foreground)]/18" />
          <div className="h-2 rounded-full bg-[var(--foreground)]/10" />
          <div className="h-2 w-1/2 rounded-full bg-[var(--foreground)]/10" />
        </div>
      </div>
    </div>
  );
}

function MiniPreview({ annex }: { annex: Pick<AnnexItem, "kind" | "href" | "description" | "extension" | "accent"> }) {
  const Icon = typeIcons[annex.kind];

  if (annex.kind === "image" || annex.kind === "schematic") {
    return (
      <span className="block aspect-square overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={annex.href} alt={annex.description} className="h-full w-full object-cover" />
      </span>
    );
  }

  return (
    <span className={cn("flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br", accentClasses[annex.accent])}>
      <Icon className="size-6" />
    </span>
  );
}

function LibrarySection({
  id,
  eyebrow,
  title,
  annexes,
  onOpen,
}: {
  id: string;
  eyebrow: string;
  title: string;
  annexes: AnnexItem[];
  onOpen: (annex: AnnexItem) => void;
}) {
  if (!annexes.length) {
    return null;
  }

  return (
    <section id={id} className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading eyebrow={eyebrow} title={title} text="Curated from the same auto-generated annex index." />
        <Button asChild variant="secondary">
          <a href="#annexes">
            View all
            <ArrowUpRight />
          </a>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {annexes.map((annex) => {
          const Icon = typeIcons[annex.kind];

          return (
            <button
              key={annex.id}
              onClick={() => onOpen(annex)}
              className="group soft-card rounded-[28px] p-4 text-left transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <MiniPreview annex={annex} />
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-[var(--muted-foreground)]">
                <Icon className="size-3.5" />
                {annex.extension} · {annex.size}
              </div>
              <h3 className="mt-2 truncate text-base font-semibold">{annex.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--muted-foreground)]">{annex.description}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function AnnexViewer({ annex, onClose }: { annex: AnnexItem; onClose: () => void }) {
  if (annex.kind === "pdf") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <PdfReader annex={annex} onClose={onClose} />
      </motion.div>
    );
  }

  if (annex.kind === "image" || annex.kind === "schematic") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <ImageViewer annex={annex} onClose={onClose} />
      </motion.div>
    );
  }

  const Icon = typeIcons[annex.kind];

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-black/42 p-4 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="soft-card w-full max-w-lg rounded-[32px] p-6"
        initial={{ scale: 0.96, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 16 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-[var(--surface-muted)]">
            <Icon className="size-7 text-[var(--accent-blue)]" />
          </span>
          <Button size="icon" variant="ghost" onClick={onClose} title="Close">
            <X />
          </Button>
        </div>
        <h3 className="text-2xl font-semibold tracking-tight">{annex.title}</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{annex.description}</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button asChild variant="secondary">
            <a href={annex.href} target="_blank" rel="noreferrer">
              <SquareArrowOutUpRight />
              Open
            </a>
          </Button>
          <Button asChild>
            <a href={annex.downloadUrl} download>
              <Download />
              Download
            </a>
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

const fallbackPreviewItems = [
  {
    id: "fallback-a",
    title: "Annexe A",
    description: "Poste principal 60/22 kV",
    kind: "pdf",
    href: "",
    extension: "PDF",
    accent: "blue",
  },
  {
    id: "fallback-b",
    title: "Annexe B",
    description: "Schemas electriques",
    kind: "schematic",
    href: "",
    extension: "SVG",
    accent: "emerald",
  },
  {
    id: "fallback-e",
    title: "Annexe E",
    description: "Courbes SCADA",
    kind: "image",
    href: "",
    extension: "PNG",
    accent: "amber",
  },
  {
    id: "fallback-f",
    title: "Annexe F",
    description: "Centrale de mesure",
    kind: "document",
    href: "",
    extension: "DOC",
    accent: "rose",
  },
] satisfies Array<Pick<AnnexItem, "id" | "title" | "description" | "kind" | "href" | "extension" | "accent">>;
