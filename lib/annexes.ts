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
};

const ANNEX_ROOT = path.join(process.cwd(), "public", "annexes");
const THUMBNAIL_ROOT = path.join(process.cwd(), "public", "annex-thumbnails");

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
}> = [
  {
    match: /60\s*kv|poste\s*principal|60[-_\s]?22/i,
    description: "Poste principal 60/22 kV",
    tags: ["poste", "60/22 kV", "distribution"],
  },
  {
    match: /schema|schematics?|electrique|armoire|poste/i,
    description: "Schemas electriques et plans de raccordement",
    tags: ["schema", "electrique", "plan"],
  },
  {
    match: /tambour|moteur|mcc/i,
    description: "Documentation moteur et tambour",
    tags: ["moteur", "MCC", "documentation"],
  },
  {
    match: /plan\s*reducteur|reducteur/i,
    description: "Plan reducteur",
    tags: ["reducteur", "plan", "mecanique"],
  },
  {
    match: /pm710|circuit/i,
    description: "Schema PM710",
    tags: ["PM710", "schema", "mesure"],
  },
  {
    match: /appel\s*de\s*courant|courant/i,
    description: "Appel de courant",
    tags: ["courant", "mesure", "demarrage"],
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

export function getAnnexes(): AnnexItem[] {
  const files = walkFiles(ANNEX_ROOT)
    .filter((file) => supportedExtensions.has(path.extname(file).toLowerCase()))
    .filter((file) => !path.basename(file).startsWith("."))
    .sort((a, b) =>
      path
        .relative(ANNEX_ROOT, a)
        .localeCompare(path.relative(ANNEX_ROOT, b), undefined, { numeric: true, sensitivity: "base" }),
    );

  return files.map((absolute, index) => {
    const relative = path.relative(ANNEX_ROOT, absolute).replaceAll(path.sep, "/");
    const fileName = path.basename(absolute);
    const extension = path.extname(absolute).toLowerCase();
    const metadata = getKnownMetadata(fileName);
    const stat = fs.statSync(absolute);
    const classified = classifyAnnex(extension, fileName);
    const readableName = titleFromFilename(fileName);
    const encodedRelative = encodePublicPath(relative);
    const href = `/annexes/${encodedRelative}`;
    const id = getAnnexId(relative);

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
      priority: index + 1,
      pageCount: classified.kind === "pdf" ? 12 : undefined,
    } satisfies AnnexItem;
  });
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
