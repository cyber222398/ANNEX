import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas, DOMMatrix, ImageData, Path2D } from "@napi-rs/canvas";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const annexRoot = path.join(projectRoot, "public", "annexes");
const outputRoot = path.join(projectRoot, "public", "annex-pages");
const targetLongEdge = 2200;

globalThis.DOMMatrix ??= DOMMatrix;
globalThis.ImageData ??= ImageData;
globalThis.Path2D ??= Path2D;

function walkFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(absolute) : [absolute];
  });
}

function getAnnexId(relativePath) {
  return relativePath.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function isReportFile(filePath) {
  return /rapport/i.test(path.basename(filePath)) && path.extname(filePath).toLowerCase() === ".pdf";
}

function assetPathForDirectory(directory) {
  return `${directory.replaceAll("\\", "/")}/`;
}

async function renderPdf(filePath) {
  const relative = path.relative(annexRoot, filePath).replaceAll(path.sep, "/");
  const id = getAnnexId(relative);
  const outputDirectory = path.join(outputRoot, id);

  fs.mkdirSync(outputDirectory, { recursive: true });

  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(fs.readFileSync(filePath)),
    disableWorker: true,
    cMapPacked: true,
    cMapUrl: assetPathForDirectory(path.join(projectRoot, "node_modules", "pdfjs-dist", "cmaps")),
    standardFontDataUrl: assetPathForDirectory(path.join(projectRoot, "node_modules", "pdfjs-dist", "standard_fonts")),
  });

  const document = await loadingTask.promise;
  const pages = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = Math.min(3, targetLongEdge / Math.max(baseViewport.width, baseViewport.height));
    const viewport = page.getViewport({ scale });
    const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    const context = canvas.getContext("2d");
    const filename = `page-${String(pageNumber).padStart(3, "0")}.png`;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      background: "rgb(255, 255, 255)",
      canvas,
      canvasContext: context,
      viewport,
    }).promise;

    fs.writeFileSync(path.join(outputDirectory, filename), canvas.toBuffer("image/png"));
    pages.push({
      src: `/annex-pages/${id}/${filename}`,
      width: canvas.width,
      height: canvas.height,
    });

    await page.cleanup();
  }

  await document.cleanup();
  await loadingTask.destroy();

  return [id, { pages }];
}

async function main() {
  const pdfFiles = walkFiles(annexRoot)
    .filter((file) => path.extname(file).toLowerCase() === ".pdf")
    .filter((file) => !isReportFile(file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

  fs.mkdirSync(outputRoot, { recursive: true });

  const manifest = {};

  for (const filePath of pdfFiles) {
    const [id, entry] = await renderPdf(filePath);
    manifest[id] = entry;
    console.log(`Rendered ${entry.pages.length} page(s): ${path.relative(projectRoot, filePath)}`);
  }

  fs.writeFileSync(path.join(outputRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
