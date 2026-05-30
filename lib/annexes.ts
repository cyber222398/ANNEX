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
  extension: string;
  kind: AnnexKind;
  category: "Documents" | "Schematics" | "Photos" | "Data" | "Other";
  size: string;
  sizeBytes: number;
  updatedAt: string;
  tags: string[];
  priority: number;
  pageCount?: number;
};

const ANNEX_ROOT = path.join(process.cwd(), "public", "annexes");

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
  title: string;
  description: string;
  tags: string[];
  priority: number;
}> = [
  {
    match: /annexe[-_\s]?a|poste[-_\s]?principal|60[-_\s]?22/i,
    title: "Annexe A",
    description: "Poste principal 60/22 kV",
    tags: ["poste", "60/22 kV", "distribution"],
    priority: 10,
  },
  {
    match: /annexe[-_\s]?b|schema|schematics?|electrique/i,
    title: "Annexe B",
    description: "Schemas electriques et plans de raccordement",
    tags: ["schema", "electrique", "plan"],
    priority: 20,
  },
  {
    match: /annexe[-_\s]?c|moteur|mcc/i,
    title: "Annexe C",
    description: "Documentation moteur MCC",
    tags: ["moteur", "MCC", "documentation"],
    priority: 30,
  },
  {
    match: /annexe[-_\s]?d|dcreg4/i,
    title: "Annexe D",
    description: "Documentation DCREG4",
    tags: ["DCREG4", "variateur", "documentation"],
    priority: 40,
  },
  {
    match: /annexe[-_\s]?e|scada|courbe/i,
    title: "Annexe E",
    description: "Courbes SCADA et captures d'exploitation",
    tags: ["SCADA", "courbes", "capture"],
    priority: 50,
  },
  {
    match: /annexe[-_\s]?f|centrale[-_\s]?de[-_\s]?mesure|mesure/i,
    title: "Annexe F",
    description: "Centrale de mesure",
    tags: ["mesure", "energie", "instrumentation"],
    priority: 60,
  },
  {
    match: /annexe[-_\s]?g|transformateur|courant|tc/i,
    title: "Annexe G",
    description: "Transformateurs de courant",
    tags: ["TC", "transformateur", "protection"],
    priority: 70,
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
    return { kind: "pdf", category: "Documents" };
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

export function getAnnexes(): AnnexItem[] {
  const files = walkFiles(ANNEX_ROOT)
    .filter((file) => supportedExtensions.has(path.extname(file).toLowerCase()))
    .filter((file) => !path.basename(file).startsWith("."));

  return files
    .map((absolute, index) => {
      const relative = path.relative(ANNEX_ROOT, absolute).replaceAll(path.sep, "/");
      const fileName = path.basename(absolute);
      const extension = path.extname(absolute).toLowerCase();
      const metadata = getKnownMetadata(fileName);
      const stat = fs.statSync(absolute);
      const classified = classifyAnnex(extension, fileName);
      const readableName = titleFromFilename(fileName);

      return {
        id: relative.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        title: metadata?.title ?? readableName,
        description: metadata?.description ?? `${classified.category} reference file`,
        fileName,
        href: `/annexes/${relative}`,
        downloadUrl: `/annexes/${relative}`,
        extension: extension.replace(".", "").toUpperCase(),
        kind: classified.kind,
        category: classified.category,
        size: formatBytes(stat.size),
        sizeBytes: stat.size,
        updatedAt: stat.mtime.toISOString(),
        tags: metadata?.tags ?? [classified.category.toLowerCase(), extension.replace(".", "")],
        priority: metadata?.priority ?? 500 + index,
        pageCount: classified.kind === "pdf" ? 12 : undefined,
      } satisfies AnnexItem;
    })
    .sort((a, b) => a.priority - b.priority || a.fileName.localeCompare(b.fileName));
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
