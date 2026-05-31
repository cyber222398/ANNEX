import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createCanvas, DOMMatrix, ImageData, loadImage, Path2D } from "@napi-rs/canvas";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const annexRoot = path.join(projectRoot, "public", "annexes");
const outputRoot = path.join(projectRoot, "public", "annex-thumbnails");

const thumbnailWidth = 1200;
const thumbnailHeight = 750;

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
  ".html",
  ".htm",
]);

const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean);

globalThis.DOMMatrix ??= DOMMatrix;
globalThis.ImageData ??= ImageData;
globalThis.Path2D ??= Path2D;

function walkFiles(directory) {
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

function getAnnexId(relativePath) {
  return relativePath.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function isReportFile(filePath) {
  return /rapport/i.test(path.basename(filePath)) && path.extname(filePath).toLowerCase() === ".pdf";
}

function assetPathForDirectory(directory) {
  return `${directory.replaceAll("\\", "/")}/`;
}

function getChromePath() {
  return chromeCandidates.find((candidate) => candidate && fs.existsSync(candidate));
}

function drawThumbnailBackground(context) {
  context.fillStyle = "#e5e7eb";
  context.fillRect(0, 0, thumbnailWidth, thumbnailHeight);

  context.strokeStyle = "rgba(15, 23, 42, 0.08)";
  context.lineWidth = 1;

  for (let x = 0; x <= thumbnailWidth; x += 48) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, thumbnailHeight);
    context.stroke();
  }

  for (let y = 0; y <= thumbnailHeight; y += 48) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(thumbnailWidth, y);
    context.stroke();
  }
}

async function renderPdf(filePath, outputPath) {
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(fs.readFileSync(filePath)),
    disableWorker: true,
    cMapPacked: true,
    cMapUrl: assetPathForDirectory(path.join(projectRoot, "node_modules", "pdfjs-dist", "cmaps")),
    standardFontDataUrl: assetPathForDirectory(path.join(projectRoot, "node_modules", "pdfjs-dist", "standard_fonts")),
  });

  const document = await loadingTask.promise;
  const page = await document.getPage(1);
  const baseViewport = page.getViewport({ scale: 1 });
  const padding = 58;
  const scale = Math.min(
    (thumbnailWidth - padding * 2) / baseViewport.width,
    (thumbnailHeight - padding * 2) / baseViewport.height,
  );
  const viewport = page.getViewport({ scale });
  const pageCanvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  const pageContext = pageCanvas.getContext("2d");

  pageContext.fillStyle = "#ffffff";
  pageContext.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

  await page.render({
    canvas: pageCanvas,
    canvasContext: pageContext,
    viewport,
  }).promise;

  const thumbnail = createCanvas(thumbnailWidth, thumbnailHeight);
  const context = thumbnail.getContext("2d");
  const x = Math.round((thumbnailWidth - pageCanvas.width) / 2);
  const y = Math.round((thumbnailHeight - pageCanvas.height) / 2);

  drawThumbnailBackground(context);
  context.save();
  context.shadowColor = "rgba(15, 23, 42, 0.24)";
  context.shadowBlur = 28;
  context.shadowOffsetY = 18;
  context.fillStyle = "#ffffff";
  context.fillRect(x, y, pageCanvas.width, pageCanvas.height);
  context.restore();
  context.drawImage(pageCanvas, x, y);

  fs.writeFileSync(outputPath, thumbnail.toBuffer("image/png"));
  await page.cleanup();
  await document.cleanup();
  await loadingTask.destroy();
}

async function renderHtml(filePath, outputPath) {
  const chromePath = getChromePath();

  if (!chromePath) {
    renderFallback(filePath, outputPath, "HTML");
    return;
  }

  await new Promise((resolve, reject) => {
    const child = spawn(chromePath, [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--allow-file-access-from-files",
      "--run-all-compositor-stages-before-draw",
      `--window-size=${thumbnailWidth},${thumbnailHeight}`,
      `--screenshot=${outputPath}`,
      pathToFileURL(filePath).href,
    ]);

    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0 && fs.existsSync(outputPath)) {
        resolve();
        return;
      }

      reject(new Error(stderr.trim() || `Chrome exited with code ${code}`));
    });
  });
}

async function renderImage(filePath, outputPath) {
  const image = await loadImage(filePath);
  const thumbnail = createCanvas(thumbnailWidth, thumbnailHeight);
  const context = thumbnail.getContext("2d");
  const scale = Math.max(thumbnailWidth / image.width, thumbnailHeight / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  const x = (thumbnailWidth - width) / 2;
  const y = (thumbnailHeight - height) / 2;

  context.fillStyle = "#0f172a";
  context.fillRect(0, 0, thumbnailWidth, thumbnailHeight);
  context.drawImage(image, x, y, width, height);
  fs.writeFileSync(outputPath, thumbnail.toBuffer("image/png"));
}

function renderFallback(filePath, outputPath, extension) {
  const thumbnail = createCanvas(thumbnailWidth, thumbnailHeight);
  const context = thumbnail.getContext("2d");
  const fileName = path.basename(filePath);

  drawThumbnailBackground(context);
  context.fillStyle = "#ffffff";
  context.fillRect(86, 72, thumbnailWidth - 172, thumbnailHeight - 144);
  context.strokeStyle = "#cbd5e1";
  context.lineWidth = 4;
  context.strokeRect(86, 72, thumbnailWidth - 172, thumbnailHeight - 144);
  context.fillStyle = "#0f172a";
  context.font = "700 54px Arial";
  context.fillText(extension.toUpperCase(), 130, 170);
  context.font = "500 34px Arial";
  context.fillText(fileName.slice(0, 44), 130, 250);

  fs.writeFileSync(outputPath, thumbnail.toBuffer("image/png"));
}

async function main() {
  fs.mkdirSync(outputRoot, { recursive: true });

  const files = walkFiles(annexRoot)
    .filter((file) => supportedExtensions.has(path.extname(file).toLowerCase()))
    .filter((file) => !isReportFile(file))
    .filter((file) => !path.basename(file).startsWith("."))
    .sort((a, b) =>
      path
        .relative(annexRoot, a)
        .localeCompare(path.relative(annexRoot, b), undefined, { numeric: true, sensitivity: "base" }),
    );
  const expectedOutputs = new Set();

  for (const file of files) {
    const relative = path.relative(annexRoot, file).replaceAll(path.sep, "/");
    const id = getAnnexId(relative);
    const extension = path.extname(file).toLowerCase();
    const outputPath = path.join(outputRoot, `${id}.png`);
    expectedOutputs.add(path.basename(outputPath));

    if (extension === ".pdf") {
      await renderPdf(file, outputPath);
    } else if (extension === ".html" || extension === ".htm") {
      await renderHtml(file, outputPath);
    } else if ([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".tif", ".tiff"].includes(extension)) {
      await renderImage(file, outputPath);
    } else {
      renderFallback(file, outputPath, extension.replace(".", ""));
    }

    console.log(`Generated ${path.relative(projectRoot, outputPath)} from ${relative}`);
  }

  for (const thumbnail of fs.readdirSync(outputRoot, { withFileTypes: true })) {
    if (thumbnail.isFile() && thumbnail.name.endsWith(".png") && !expectedOutputs.has(thumbnail.name)) {
      fs.unlinkSync(path.join(outputRoot, thumbnail.name));
      console.log(`Removed stale ${path.join("public", "annex-thumbnails", thumbnail.name)}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
