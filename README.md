# Ouansimi Annex Portal

Modern companion website for the annexes referenced by the existing internship report. The report remains a PDF; this portal is only for browsing supporting files such as PDFs, electrical schematics, drawings, SCADA captures, photos, and technical documentation.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Framer Motion
- Lucide React

## Annex Management

Add files to:

```text
public/annexes/
```

Supported files are discovered automatically at runtime:

- `.pdf`
- `.svg`
- `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.tif`, `.tiff`
- `.doc`, `.docx`, `.xls`, `.xlsx`, `.csv`, `.txt`

Examples:

```text
public/annexes/annexe-a-poste-principal-60-22-kv.pdf
public/annexes/annexe-b-schemas-electriques.svg
public/annexes/annexe-e-courbes-scada.png
```

## Run Locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build

```bash
npm run build
```
