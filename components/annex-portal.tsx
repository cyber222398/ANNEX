"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Database,
  Download,
  File,
  FileText,
  Gauge,
  HardDrive,
  Image as ImageIcon,
  Layers3,
  Maximize2,
  Menu,
  MonitorSmartphone,
  MoreHorizontal,
  Network,
  Search,
  Server,
  Settings,
  Shield,
  SquareArrowOutUpRight,
  X,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { ImageViewer } from "@/components/image-viewer";
import { PdfReader } from "@/components/pdf-reader";
import { ThemeToggle } from "@/components/theme-toggle";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { AnnexItem, ReportFile } from "@/lib/annexes";
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
  report: ReportFile | null;
};

type Category = "All" | "Documents" | "Schematics" | "Photos" | "Data";

const categories: Category[] = ["All", "Documents", "Schematics", "Photos", "Data"];

const navItems = [
  { label: "Accueil", href: "#home" },
  { label: "Objectif", href: "#features" },
  { label: "Contexte", href: "#solutions" },
  { label: "Documents", href: "#documentation" },
  { label: "AZNAG AYOUB", href: "#contact" },
];

const typeIcons: Record<AnnexItem["kind"], LucideIcon> = {
  pdf: FileText,
  schematic: Network,
  image: ImageIcon,
  document: File,
  other: Boxes,
};

const featureCards: Array<{
  icon: LucideIcon;
  title: string;
  description: string;
  metric: string;
}> = [
  {
    icon: Database,
    title: "Annexes du rapport",
    description: "Les fichiers ajoutes au dossier des annexes apparaissent automatiquement dans cette interface de soutenance.",
    metric: "Mise a jour simple",
  },
  {
    icon: FileText,
    title: "Lecture des documents",
    description: "Les PDF et documentations techniques peuvent etre consultes directement pendant la presentation.",
    metric: "Consultation rapide",
  },
  {
    icon: Network,
    title: "Schemas et captures",
    description: "Les schemas, plans, captures SCADA et images techniques restent accessibles avec zoom et plein ecran.",
    metric: "Zoom detaille",
  },
  {
    icon: Shield,
    title: "Rapport conserve en PDF",
    description: "Ce site ne remplace pas le rapport. Il sert uniquement d'espace personnel pour ses annexes.",
    metric: "Annexes seulement",
  },
  {
    icon: MonitorSmartphone,
    title: "Support pour l'examinateur",
    description: "Monsieur l'examinateur peut trouver rapidement une annexe, l'ouvrir ou la telecharger.",
    metric: "Soutenance",
  },
  {
    icon: Settings,
    title: "Interface personnelle",
    description: "Une interface claire pour accompagner la soutenance du stage de fin d'etude.",
    metric: "AZNAG AYOUB",
  },
];

const infrastructureCoverage: Array<{ label: string; value: number; icon: LucideIcon }> = [
  { label: "Electrique", value: 84, icon: Zap },
  { label: "Commande", value: 68, icon: Cpu },
  { label: "Mesure", value: 74, icon: Gauge },
  { label: "Documents", value: 92, icon: FileText },
];

export function AnnexPortal({ annexes, stats, report }: AnnexPortalProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All");
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

  const documents = annexes.filter((annex) => annex.category === "Documents");
  const schematics = annexes.filter((annex) => annex.category === "Schematics");
  const photos = annexes.filter((annex) => annex.category === "Photos" || annex.category === "Data");
  const quickAccess = annexes.slice(0, 5);

  return (
    <TooltipProvider delayDuration={120}>
      <main className="site-grid min-h-screen bg-black text-white">
        <SiteHeader report={report} />

        <HeroSection
          annexes={annexes}
          stats={stats}
          query={query}
          report={report}
          setQuery={setQuery}
          onOpen={setSelectedAnnex}
        />

        <ProjectSummary stats={stats} />

        <FeaturesSection />

        <DashboardPreview stats={stats} annexes={annexes.slice(0, 4)} />

        <AnnexExplorer
          annexes={filteredAnnexes}
          category={category}
          query={query}
          setCategory={setCategory}
          setQuery={setQuery}
          onOpen={setSelectedAnnex}
        />

        <LibrarySection
          id="documents"
          eyebrow="Documents"
          title="PDF et references techniques"
          description="Bibliotheque personnelle pour les PDF, fiches techniques et documents cites dans le rapport de stage."
          annexes={documents.slice(0, 4)}
          onOpen={setSelectedAnnex}
        />

        <LibrarySection
          id="schematics"
          eyebrow="Schematics"
          title="Schemas consultables en detail"
          description="Les schemas electriques et dessins techniques peuvent etre ouverts en plein ecran et zoomes."
          annexes={schematics.slice(0, 4)}
          onOpen={setSelectedAnnex}
        />

        <LibrarySection
          id="photos"
          eyebrow="Photos"
          title="Captures et elements visuels"
          description="Les captures SCADA, photos et images du stage sont regroupees pour une consultation rapide."
          annexes={photos.slice(0, 4)}
          onOpen={setSelectedAnnex}
        />

        <DocumentationSection />

        <QuickAccess annexes={quickAccess} onOpen={setSelectedAnnex} />

        <SiteFooter />

        <AnimatePresence>
          {selectedAnnex && <AnnexViewer annex={selectedAnnex} onClose={() => setSelectedAnnex(null)} />}
        </AnimatePresence>
      </main>
    </TooltipProvider>
  );
}

function SiteHeader({ report }: { report: ReportFile | null }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-[72px] border-b border-transparent transition-all duration-300",
        scrolled && "border-[#27272A] bg-black/75 backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-lg border border-[#27272A] bg-white text-black">
            <Layers3 className="size-4" strokeWidth={2} />
          </span>
          <span className="text-sm font-semibold tracking-tight">Soutenance</span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-[#A1A1AA] transition hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          {report && (
            <Button asChild variant="secondary">
              <a href={report.downloadUrl} download>
                <Download />
                Rapport
              </a>
            </Button>
          )}
          <Button asChild variant="ghost">
            <a href="#annexes">Acces annexes</a>
          </Button>
          <Button asChild>
            <a href="#dashboard">Soutenance</a>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="secondary" aria-label="Open navigation">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="mb-10 flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-lg border border-[#27272A] bg-white text-black">
                  <Layers3 className="size-4" />
                </span>
                <span className="text-sm font-semibold">Soutenance</span>
              </div>
              <nav className="grid gap-2">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="rounded-xl px-3 py-3 text-sm font-semibold text-[#A1A1AA] transition hover:bg-white/10 hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="mt-8 grid gap-3">
                {report && (
                  <Button asChild variant="secondary">
                    <a href={report.downloadUrl} download>
                      <Download />
                      Rapport
                    </a>
                  </Button>
                )}
                <Button asChild variant="secondary">
                  <a href="#annexes">Acces annexes</a>
                </Button>
                <Button asChild>
                  <a href="#dashboard">Soutenance</a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function HeroSection({
  annexes,
  stats,
  query,
  report,
  setQuery,
  onOpen,
}: {
  annexes: AnnexItem[];
  stats: AnnexStats;
  query: string;
  report: ReportFile | null;
  setQuery: (query: string) => void;
  onOpen: (annex: AnnexItem) => void;
}) {
  const previewAnnexes = annexes.slice(0, 4);

  return (
    <section id="home" className="hero-gradient border-b border-[#27272A]">
      <div className="mx-auto max-w-[1200px] px-4 pb-24 pt-20 sm:px-6 lg:px-8 lg:pb-32">
        <motion.div
          className="mx-auto flex max-w-5xl flex-col items-center text-center"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
        >
          <FadeUp>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#27272A] bg-[#0A0A0A] px-4 py-2 text-sm text-[#A1A1AA]">
              <SparkIcon />
              Site personnel de soutenance - Stage de fin d'etude
            </div>
          </FadeUp>

          <FadeUp>
            <h1 className="max-w-5xl text-balance text-[36px] font-bold leading-[1.05] tracking-[-0.04em] md:text-[48px] lg:text-[72px]">
              Informations et annexes du rapport de stage, reunies pour la soutenance.
            </h1>
          </FadeUp>

          <FadeUp>
            <p className="mt-6 max-w-3xl text-base leading-[1.7] text-[#A1A1AA] md:text-lg">
              Ce site est un espace personnel developpe par AZNAG AYOUB pour aider l'examinateur a consulter les
              documents, schemas, captures et annexes cites dans le rapport de stage.
            </p>
          </FadeUp>

          <FadeUp>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
              <Button asChild>
                <a href="#annexes">
                  Consulter les annexes
                  <ArrowRight />
                </a>
              </Button>
              {report && (
                <Button asChild variant="secondary">
                  <a href={report.downloadUrl} download>
                    Telecharger le rapport
                    <Download />
                  </a>
                </Button>
              )}
              <Button asChild variant="secondary">
                <a href="#documentation">
                  Documents
                  <BookOpen />
                </a>
              </Button>
            </div>
          </FadeUp>
        </motion.div>

        <motion.div
          className="mx-auto mt-16 max-w-6xl overflow-hidden rounded-2xl border border-[#27272A] bg-[#0A0A0A]"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
        >
          <div className="flex h-12 items-center justify-between border-b border-[#27272A] px-4">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[#3F3F46]" />
              <span className="size-2.5 rounded-full bg-[#3F3F46]" />
              <span className="size-2.5 rounded-full bg-[#3F3F46]" />
            </div>
            <span className="text-sm text-[#71717A]">Stage de fin d'etude / Annexes</span>
          </div>

          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="border-b border-[#27272A] p-6 lg:border-b-0 lg:border-r">
              <div className="flex items-center gap-3 rounded-xl border border-[#27272A] bg-[#111111] px-4 py-3">
                <Search className="size-4 text-[#71717A]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Rechercher annexes, SCADA, schemas..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#71717A]"
                />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <HeroMetric icon={Database} label="Indexed files" value={stats.total} />
                <HeroMetric icon={FileText} label="Documents" value={stats.documents} />
                <HeroMetric icon={Network} label="Schematics" value={stats.schematics} />
                <HeroMetric icon={HardDrive} label="Archive size" value={stats.totalSize} />
              </div>
            </div>

            <div className="p-6">
              <div className="grid gap-3">
                {previewAnnexes.map((annex) => (
                  <button
                    key={annex.id}
                    onClick={() => onOpen(annex)}
                    className="group grid grid-cols-[44px_1fr_auto] items-center gap-4 rounded-xl border border-[#27272A] bg-[#111111] p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#3F3F46]"
                  >
                    <AnnexIcon annex={annex} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-white">{annex.title}</span>
                      <span className="mt-1 block truncate text-sm text-[#71717A]">{annex.description}</span>
                    </span>
                    <ChevronRight className="size-4 text-[#71717A] transition group-hover:text-white" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectSummary({ stats }: { stats: AnnexStats }) {
  const items = [
    { label: "Annexes disponibles", value: stats.total, icon: Database },
    { label: "Documents techniques", value: stats.documents, icon: FileText },
    { label: "Schemas et captures", value: stats.schematics + stats.photos, icon: MonitorSmartphone },
  ];

  return (
    <section id="solutions" className="mx-auto max-w-[1200px] px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
        <SectionHeading
          eyebrow="Contexte"
          title="Un support personnel pour la soutenance du rapport de stage."
          description="Le rapport reste sous forme de PDF. Ce site rassemble uniquement les informations utiles, les annexes et les documents techniques pour faciliter la consultation pendant la soutenance."
        />

        <div className="grid gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <Card key={item.label} className="card-hover">
              <CardHeader>
                <item.icon className="size-5 text-white" strokeWidth={1.75} />
                <CardTitle>{item.value}</CardTitle>
                <CardDescription>{item.label}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="border-y border-[#27272A] bg-[#0A0A0A]">
      <div className="mx-auto max-w-[1200px] px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Objectif"
          title="Prepare pour une consultation claire pendant la soutenance."
          description="L'objectif est de permettre a l'examinateur de retrouver rapidement une annexe, un schema ou une documentation du rapport."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((feature) => (
            <Card key={feature.title} className="card-hover">
              <CardHeader>
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl border border-[#27272A] bg-black">
                  <feature.icon className="size-5 text-white" strokeWidth={1.75} />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="inline-flex rounded-lg border border-[#27272A] px-3 py-1 text-sm text-[#A1A1AA]">
                  {feature.metric}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardPreview({ stats, annexes }: { stats: AnnexStats; annexes: AnnexItem[] }) {
  const metrics = [
    { label: "Etat du support", value: "Pret", icon: Activity },
    { label: "Documents", value: stats.documents, icon: FileText },
    { label: "Elements visuels", value: stats.photos + stats.schematics, icon: BarChart3 },
    { label: "Taille archive", value: stats.totalSize, icon: Server },
  ];

  return (
    <section id="dashboard" className="mx-auto max-w-[1200px] px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Apercu soutenance"
        title="Un resume visuel des annexes et documents disponibles."
        description="Cette zone presente l'etat des fichiers, les familles de documents et les annexes importantes du rapport de stage."
      />

      <div className="mt-12 overflow-hidden rounded-2xl border border-[#27272A] bg-[#0A0A0A]">
        <div className="flex h-14 items-center justify-between border-b border-[#27272A] px-5">
          <div className="flex items-center gap-3">
            <Gauge className="size-5 text-white" />
            <span className="text-sm font-semibold">Archive de soutenance</span>
          </div>
          <span className="rounded-lg border border-[#27272A] px-3 py-1 text-sm text-[#A1A1AA]">Pret</span>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1fr_380px]">
          <div className="border-b border-[#27272A] p-6 lg:border-b-0 lg:border-r">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <Card key={metric.label}>
                  <CardHeader className="p-4">
                    <metric.icon className="size-4 text-[#A1A1AA]" />
                    <p className="text-2xl font-bold tracking-[-0.02em]">{metric.value}</p>
                    <p className="text-sm text-[#71717A]">{metric.label}</p>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Activite des annexes</CardTitle>
                  <CardDescription>Fichiers classes par importance pour la soutenance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-56 items-end gap-3 border-b border-l border-[#27272A] px-4 pb-4">
                    {[44, 76, 52, 88, 63, 94, 72, 80].map((height, index) => (
                      <div key={index} className="flex flex-1 items-end">
                        <div className="w-full rounded-t-lg bg-white/80" style={{ height: `${height}%` }} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Couverture technique</CardTitle>
                  <CardDescription>Documents classes par domaine technique</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {infrastructureCoverage.map(({ label, value, icon: Icon }) => (
                    <div key={label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-[#A1A1AA]">
                          <Icon className="size-4" />
                          {label}
                        </span>
                        <span className="text-white">{value}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#27272A]">
                        <div className="h-full rounded-full bg-white" style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="p-6">
            <Card>
              <CardHeader>
                <CardTitle>Annexes principales</CardTitle>
                <CardDescription>Etat des annexes importantes du rapport</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                {annexes.map((annex) => (
                  <div key={annex.id} className="rounded-xl border border-[#27272A] bg-black p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold">{annex.title}</span>
                      <span className="flex items-center gap-1.5 text-sm text-[#A1A1AA]">
                        <CheckCircle2 className="size-4" />
                        Pret
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-[#71717A]">
                      <span className="truncate">{annex.description}</span>
                      <span className="ml-3 shrink-0">{annex.extension}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnnexExplorer({
  annexes,
  category,
  query,
  setCategory,
  setQuery,
  onOpen,
}: {
  annexes: AnnexItem[];
  category: Category;
  query: string;
  setCategory: (category: Category) => void;
  setQuery: (query: string) => void;
  onOpen: (annex: AnnexItem) => void;
}) {
  return (
    <section id="annexes" className="border-y border-[#27272A] bg-[#0A0A0A]">
      <div className="mx-auto max-w-[1200px] px-4 py-24 sm:px-6 lg:px-8">
        <div id="search" className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <SectionHeading
            eyebrow="Annexes"
            title="Explorateur d'annexes"
            description="Rechercher par titre, type de fichier, tag ou description. Chaque annexe peut etre ouverte, telechargee ou affichee en plein ecran."
          />

          <div className="rounded-2xl border border-[#27272A] bg-[#111111] p-3">
            <div className="flex items-center gap-3 rounded-xl border border-[#27272A] bg-black px-4 py-3">
              <Search className="size-4 text-[#71717A]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher annexes, schemas, PDF..."
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#71717A]"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-[#71717A] transition hover:text-white">
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <Tabs value={category} onValueChange={(value) => setCategory(value as Category)} className="mt-8">
          <TabsList className="max-w-full overflow-x-auto">
            {categories.map((item) => (
              <TabsTrigger key={item} value={item}>
                {item}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((item) => (
            <TabsContent key={item} value={item}>
              {annexes.length ? (
                <motion.div layout className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {annexes.map((annex) => (
                      <motion.div
                        key={annex.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        <AnnexCard annex={annex} onOpen={() => onOpen(annex)} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <Card>
                  <CardHeader className="items-center py-16 text-center">
                    <Search className="size-8 text-[#71717A]" />
                    <CardTitle>Aucune annexe ne correspond a cette recherche.</CardTitle>
                    <CardDescription>Ajouter les fichiers dans public/annexes ou vider les filtres actuels.</CardDescription>
                  </CardHeader>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

function AnnexCard({ annex, onOpen }: { annex: AnnexItem; onOpen: () => void }) {
  const Icon = typeIcons[annex.kind];

  return (
    <Card className="card-hover h-full overflow-hidden">
      <button onClick={onOpen} className="group block w-full text-left">
        <AnnexPreview annex={annex} />
      </button>

      <CardHeader>
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-lg border border-[#27272A] px-3 py-1 text-sm text-[#A1A1AA]">
            <Icon className="size-4" />
            {annex.extension}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" aria-label="Annex actions">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onOpen}>
                <SquareArrowOutUpRight className="size-4" />
                Ouvrir
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={annex.downloadUrl} download>
                  <Download className="size-4" />
                  Telecharger
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onOpen}>
                <Maximize2 className="size-4" />
                Plein ecran
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardTitle>{annex.title}</CardTitle>
        <CardDescription>{annex.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-6 flex flex-wrap gap-2">
          {annex.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-lg border border-[#27272A] px-2.5 py-1 text-sm text-[#71717A]">
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="subtle" onClick={onOpen}>
                <SquareArrowOutUpRight />
                Ouvrir
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ouvrir le lecteur</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild size="sm" variant="subtle">
                <a href={annex.downloadUrl} download>
                  <Download />
                  Telecharger
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Telecharger le fichier</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="subtle" onClick={onOpen}>
                <Maximize2 />
                Plein ecran
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mode plein ecran</TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
}

function LibrarySection({
  id,
  eyebrow,
  title,
  description,
  annexes,
  onOpen,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  annexes: AnnexItem[];
  onOpen: (annex: AnnexItem) => void;
}) {
  if (!annexes.length) {
    return null;
  }

  return (
    <section id={id} className="mx-auto max-w-[1200px] px-4 py-24 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <Button asChild variant="secondary">
          <a href="#annexes">
            Voir tout
            <ArrowRight />
          </a>
        </Button>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {annexes.map((annex) => (
          <button key={annex.id} onClick={() => onOpen(annex)} className="group text-left">
            <Card className="card-hover h-full overflow-hidden">
              <AnnexPreview annex={annex} />
              <CardHeader>
                <CardTitle className="truncate">{annex.title}</CardTitle>
                <CardDescription>{annex.description}</CardDescription>
              </CardHeader>
            </Card>
          </button>
        ))}
      </div>
    </section>
  );
}

function DocumentationSection() {
  return (
    <section id="documentation" className="border-y border-[#27272A] bg-[#0A0A0A]">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <SectionHeading
          eyebrow="Documents"
          title="Gestion simple des annexes du rapport."
          description="Le site est personnel et base sur les fichiers. Il suffit d'ajouter les annexes dans le dossier dedie pour les rendre consultables."
        />

        <Card>
          <CardContent className="p-6">
            <Accordion type="single" collapsible defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger>Comment ajouter une nouvelle annexe ?</AccordionTrigger>
                <AccordionContent>
                  Placer le fichier dans <code className="rounded bg-black px-1.5 py-1 text-white">public/annexes</code>.
                  Les PDF, SVG, images et documents courants sont indexes automatiquement.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Est-ce que ce site remplace le rapport ?</AccordionTrigger>
                <AccordionContent>
                  Non. Le rapport de stage reste un PDF. Ce site aide seulement l'examinateur a consulter les annexes,
                  informations et documents references dans ce rapport.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Quels types de fichiers sont acceptes ?</AccordionTrigger>
                <AccordionContent>
                  Les fichiers PDF, SVG, PNG, JPG, WEBP, GIF, TIFF, DOC, DOCX, XLS, XLSX, CSV et TXT sont pris en
                  charge par l'index automatique.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function QuickAccess({ annexes, onOpen }: { annexes: AnnexItem[]; onOpen: (annex: AnnexItem) => void }) {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-24 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-[#27272A] bg-[#111111] p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeading
            eyebrow="Acces rapide"
            title="Les annexes importantes restent accessibles rapidement."
            description="Un index compact pour les fichiers que l'examinateur peut vouloir consulter en premier pendant la soutenance."
          />

          <div className="grid gap-3">
            {annexes.map((annex) => (
              <button
                key={annex.id}
                onClick={() => onOpen(annex)}
                className="group grid grid-cols-[44px_1fr_auto] items-center gap-4 rounded-xl border border-[#27272A] bg-black p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#3F3F46]"
              >
                <AnnexIcon annex={annex} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{annex.title}</span>
                  <span className="block truncate text-sm text-[#71717A]">{annex.description}</span>
                </span>
                <ChevronRight className="size-4 text-[#71717A] transition group-hover:text-white" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-[#27272A] bg-black">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 py-12 text-sm text-[#71717A] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="font-semibold text-white">Stage de fin d'etude - Annexes</p>
          <p className="mt-1">Website developed by AZNAG AYOUB for the stage de fin d'etude soutenance.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <a href="#features" className="transition hover:text-white">
            Objectif
          </a>
          <a href="#documentation" className="transition hover:text-white">
            Documents
          </a>
          <a href="#annexes" className="transition hover:text-white">
            Annexes
          </a>
        </div>
      </div>
    </footer>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="mb-4 text-sm font-semibold text-[#A1A1AA]">{eyebrow}</p>
      <h2 className="text-balance text-[32px] font-bold leading-tight tracking-[-0.03em] sm:text-[40px]">{title}</h2>
      <p className="mt-4 text-base leading-[1.7] text-[#A1A1AA]">{description}</p>
    </div>
  );
}

function HeroMetric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-[#27272A] bg-black p-4">
      <Icon className="mb-4 size-5 text-[#A1A1AA]" strokeWidth={1.75} />
      <p className="text-2xl font-bold tracking-[-0.02em]">{value}</p>
      <p className="mt-1 text-sm text-[#71717A]">{label}</p>
    </div>
  );
}

function AnnexIcon({ annex }: { annex: AnnexItem }) {
  const Icon = typeIcons[annex.kind];

  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-[#27272A] bg-black text-white">
      <Icon className="size-5" strokeWidth={1.75} />
    </span>
  );
}

function AnnexPreview({ annex }: { annex: AnnexItem }) {
  const Icon = typeIcons[annex.kind];

  if (annex.thumbnailUrl) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden border-b border-[#27272A] bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={annex.thumbnailUrl}
          alt={`Apercu ${annex.title} - ${annex.description}`}
          loading="lazy"
          className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/86 via-black/40 to-transparent p-4 pt-10">
          <span className="truncate text-sm font-semibold text-white">{annex.title}</span>
          <span className="shrink-0 rounded-lg border border-white/20 bg-black/50 px-2 py-1 text-xs font-semibold text-white">
            {annex.extension}
          </span>
        </div>
      </div>
    );
  }

  if (annex.kind === "image" || annex.kind === "schematic") {
    return (
      <div className="relative aspect-[16/10] overflow-hidden border-b border-[#27272A] bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={annex.href}
          alt={annex.description}
          loading="lazy"
          className="h-full w-full object-cover grayscale transition duration-300 group-hover:scale-[1.02] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>
    );
  }

  return (
    <div className="preview-grid aspect-[16/10] border-b border-[#27272A] bg-black p-6">
      <div className="flex h-full flex-col justify-between rounded-xl border border-[#27272A] bg-[#111111] p-5">
        <div className="flex items-center justify-between">
          <Icon className="size-7 text-white" strokeWidth={1.75} />
          <span className="rounded-lg border border-[#27272A] px-2 py-1 text-sm text-[#A1A1AA]">{annex.extension}</span>
        </div>
        <div className="space-y-2">
          <div className="h-2 w-3/4 rounded-full bg-white/20" />
          <div className="h-2 rounded-full bg-white/10" />
          <div className="h-2 w-1/2 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
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
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-lg rounded-2xl border border-[#27272A] bg-[#111111] p-6 text-white"
        initial={{ scale: 0.98, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.98, y: 16 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-8 flex items-start justify-between gap-4">
          <span className="grid size-12 place-items-center rounded-xl border border-[#27272A] bg-black">
            <Icon className="size-6" />
          </span>
          <Button size="icon" variant="ghost" onClick={onClose} title="Close">
            <X />
          </Button>
        </div>
        <h3 className="text-xl font-semibold">{annex.title}</h3>
        <p className="mt-3 text-base leading-[1.7] text-[#A1A1AA]">{annex.description}</p>
        <div className="mt-8 grid grid-cols-2 gap-3">
          <Button asChild variant="secondary">
            <a href={annex.href} target="_blank" rel="noreferrer">
              <SquareArrowOutUpRight />
              Ouvrir
            </a>
          </Button>
          <Button asChild>
            <a href={annex.downloadUrl} download>
              <Download />
              Telecharger
            </a>
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FadeUp({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function SparkIcon() {
  return (
    <span className="relative flex size-2.5">
      <span className="absolute inline-flex h-full w-full rounded-full bg-white/40 opacity-75" />
      <span className="relative inline-flex size-2.5 rounded-full bg-white" />
    </span>
  );
}
