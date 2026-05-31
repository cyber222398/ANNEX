import fs from "node:fs";
import path from "node:path";
import { formatBytes, titleFromFilename } from "@/lib/utils";

export type AnnexKind = "pdf" | "schematic" | "image" | "document" | "other";

export type AnnexItem = {
  id: string;
  title: string;
  description: string;
  fileName: string;
  href: string;
  downloadUrl: string;
  thumbnailUrl?: string;
  extension: string;
  kind: AnnexKind;
  category: "Documents" | "Schematics" | "Photos" | "Data" | "Other";
  size: string;
  sizeBytes: number;
  updatedAt: string;
  tags: string[];
  priority: number;
  pageCount?: number;
  previewPages?: Array<{
    src: string;
    width: number;
    height: number;
  }>;
};

export type ReportFile = {
  title: string;
  fileName: string;
  href: string;
  downloadUrl: string;
  size: string;
  sizeBytes: number;
  updatedAt: string;
};

const ANNEX_ROOT = path.join(process.cwd(), "public", "annexes");
const THUMBNAIL_ROOT = path.join(process.cwd(), "public", "annex-thumbnails");
const ANNEX_PAGE_MANIFEST = path.join(process.cwd(), "public", "annex-pages", "manifest.json");

const supportedExtensions = new Set([
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".svg",
  ".tif",
  ".tiff",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".csv",
  ".txt",
  ".html",
  ".htm",
]);

const knownAnnexes: Array<{
  match: RegExp;
  description: string;
  tags: string[];
  priority: number;
  category?: AnnexItem["category"];
}> = [
  {
    match: /poste\s*60\s*kv|60\s*kv|poste\s*principal|60[-_\s]?22/i,
    description: "Poste principal 60/22 kV",
    tags: ["poste principal", "60/22 kV", "distribution"],
    priority: 10,
    category: "Schematics",
  },
  {
    match: /poste\s*mine/i,
    description: "Distribution electrique - poste mine",
    tags: ["distribution", "poste mine", "electricite"],
    priority: 20,
    category: "Schematics",
  },
  {
    match: /poste\s*jour/i,
    description: "Distribution electrique - poste jour",
    tags: ["distribution", "poste jour", "electricite"],
    priority: 30,
    category: "Schematics",
  },
  {
    match: /poste\s*n[-_\s]?400|n[-_\s]?400/i,
    description: "Distribution electrique - poste fond N-400",
    tags: ["distribution", "poste fond", "N-400"],
    priority: 40,
    category: "Schematics",
  },
  {
    match: /appel\s*de\s*courant|scada|skip|courbe|courant/i,
    description: "Courbes SCADA du skip",
    tags: ["SCADA", "skip", "courbes"],
    priority: 50,
    category: "Data",
  },
  {
    match: /armoire\s*de\s*puissance|puissance/i,
    description: "Schemas armoire puissance",
    tags: ["armoire", "puissance", "schema"],
    priority: 60,
    category: "Schematics",
  },
  {
    match: /pm710|circuit/i,
    description: "Circuit PM710",
    tags: ["PM710", "circuit", "mesure"],
    priority: 70,
    category: "Schematics",
  },
  {
    match: /tambour|akka|moteur|mcc/i,
    description: "Documentation dessin tambour",
    tags: ["tambour", "dessin", "documentation"],
    priority: 80,
    category: "Documents",
  },
  {
    match: /plan\s*reducteur|reducteur/i,
    description: "Documentation dessin reducteur",
    tags: ["reducteur", "dessin", "documentation"],
    priority: 90,
    category: "Documents",
  },
];

function walkFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return walkFiles(absolute);
    }

    return [absolute];
  });
}

function classifyAnnex(extension: string, filename: string): Pick<AnnexItem, "kind" | "category"> {
  const lowerName = filename.toLowerCase();

  if (extension === ".pdf") {
    return {
      kind: "pdf",
      category:
        lowerName.includes("schema") ||
        lowerName.includes("poste") ||
        lowerName.includes("pm710") ||
        lowerName.includes("circuit")
          ? "Schematics"
          : "Documents",
    };
  }

  if (extension === ".svg" || lowerName.includes("schema") || lowerName.includes("schematic")) {
    return { kind: "schematic", category: "Schematics" };
  }

  if ([".png", ".jpg", ".jpeg", ".webp", ".gif", ".tif", ".tiff"].includes(extension)) {
    return lowerName.includes("scada") || lowerName.includes("courbe")
      ? { kind: "image", category: "Data" }
      : { kind: "image", category: "Photos" };
  }

  if ([".doc", ".docx", ".xls", ".xlsx", ".csv", ".txt", ".html", ".htm"].includes(extension)) {
    return { kind: "document", category: "Documents" };
  }

  return { kind: "other", category: "Other" };
}

function getKnownMetadata(filename: string) {
  return knownAnnexes.find((annex) => annex.match.test(filename));
}

function isReportFile(filename: string) {
  return /rapport/i.test(filename) && path.extname(filename).toLowerCase() === ".pdf";
}

function encodePublicPath(relativePath: string) {
  return relativePath.split("/").map(encodeURIComponent).join("/");
}

function getAnnexLabel(index: number) {
  let value = index + 1;
  let label = "";

  while (value > 0) {
    value -= 1;
    label = String.fromCharCode(65 + (value % 26)) + label;
    value = Math.floor(value / 26);
  }

  return label;
}

function getAnnexId(relativePath: string) {
  return relativePath.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getThumbnailUrl(id: string) {
  const thumbnailPath = path.join(THUMBNAIL_ROOT, `${id}.png`);
  return fs.existsSync(thumbnailPath) ? `/annex-thumbnails/${id}.png` : undefined;
}

function getAnnexPageManifest(): Record<string, { pages?: AnnexItem["previewPages"] }> {
  if (!fs.existsSync(ANNEX_PAGE_MANIFEST)) {
    return {};
  }

  try {
    return JSON.parse(fs.readFileSync(ANNEX_PAGE_MANIFEST, "utf8")) as Record<string, { pages?: AnnexItem["previewPages"] }>;
  } catch {
    return {};
  }
}

export function getAnnexes(): AnnexItem[] {
  const pageManifest = getAnnexPageManifest();
  const files = walkFiles(ANNEX_ROOT)
    .filter((file) => supportedExtensions.has(path.extname(file).toLowerCase()))
    .filter((file) => !isReportFile(path.basename(file)))
    .filter((file) => !path.basename(file).startsWith("."))
    .sort((a, b) =>
      (getKnownMetadata(path.basename(a))?.priority ?? 500) - (getKnownMetadata(path.basename(b))?.priority ?? 500) ||
      path.basename(a).localeCompare(path.basename(b), undefined, { numeric: true, sensitivity: "base" }),
    );

  return files.map((absolute, index) => {
    const relative = path.relative(ANNEX_ROOT, absolute).replaceAll(path.sep, "/");
    const fileName = path.basename(absolute);
    const extension = path.extname(absolute).toLowerCase();
    const metadata = getKnownMetadata(fileName);
    const stat = fs.statSync(absolute);
    const baseClassification = classifyAnnex(extension, fileName);
    const classified = metadata?.category ? { ...baseClassification, category: metadata.category } : baseClassification;
    const readableName = titleFromFilename(fileName);
    const encodedRelative = encodePublicPath(relative);
    const href = `/annexes/${encodedRelative}`;
    const id = getAnnexId(relative);
    const previewPages = pageManifest[id]?.pages?.filter((page) => page.src && page.width > 0 && page.height > 0);

    return {
      id,
      title: `Annexe ${getAnnexLabel(index)}`,
      description: metadata?.description ?? readableName,
      fileName,
      href,
      downloadUrl: href,
      thumbnailUrl: getThumbnailUrl(id),
      extension: extension.replace(".", "").toUpperCase(),
      kind: classified.kind,
      category: classified.category,
      size: formatBytes(stat.size),
      sizeBytes: stat.size,
      updatedAt: stat.mtime.toISOString(),
      tags: metadata?.tags ?? [classified.category.toLowerCase(), extension.replace(".", "")],
      priority: metadata?.priority ?? 500 + index,
      pageCount: previewPages?.length || undefined,
      previewPages: previewPages?.length ? previewPages : undefined,
    } satisfies AnnexItem;
  });
}

export function getReportFile(): ReportFile | null {
  const report = walkFiles(ANNEX_ROOT)
    .filter((file) => isReportFile(path.basename(file)))
    .sort((a, b) => path.basename(a).localeCompare(path.basename(b), undefined, { numeric: true, sensitivity: "base" }))
    .at(0);

  if (!report) {
    return null;
  }

  const relative = path.relative(ANNEX_ROOT, report).replaceAll(path.sep, "/");
  const fileName = path.basename(report);
  const stat = fs.statSync(report);
  const href = `/annexes/${encodePublicPath(relative)}`;

  return {
    title: "Rapport de SFE 2026",
    fileName,
    href,
    downloadUrl: href,
    size: formatBytes(stat.size),
    sizeBytes: stat.size,
    updatedAt: stat.mtime.toISOString(),
  };
}

export function getAnnexStats(annexes: AnnexItem[]) {
  const totalBytes = annexes.reduce((sum, annex) => sum + annex.sizeBytes, 0);

  return {
    total: annexes.length,
    documents: annexes.filter((annex) => annex.category === "Documents").length,
    schematics: annexes.filter((annex) => annex.category === "Schematics").length,
    photos: annexes.filter((annex) => annex.category === "Photos" || annex.category === "Data").length,
    totalSize: formatBytes(totalBytes),
  };
}
