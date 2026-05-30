# AZNAG AYOUB - Stage de fin d'etude Annexes

Site personnel de soutenance developed by AZNAG AYOUB. The report remains a PDF; this website is only a companion space for the examiner to consult information, annexes, schematics, PDFs, technical drawings, SCADA captures, photos, and documentation referenced in the rapport de stage.

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
