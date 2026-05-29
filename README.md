# Ouansimi Mine Extraction Study

Interactive React/Vite study console for the Ouansimi mine extraction project. The app includes dashboard navigation, equipment and transmission sections, calculation views, documentation tabs, validation UI, and print/export support for the academic report.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Motion
- Lucide React

## Run Locally

Prerequisites:

- Node.js
- npm

Install dependencies:

```bash
npm install
```

Create a local environment file from the example:

```bash
cp .env.example .env.local
```

Set your Gemini API key in `.env.local`:

```env
GEMINI_API_KEY="your_api_key_here"
APP_URL="http://localhost:3000"
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```
