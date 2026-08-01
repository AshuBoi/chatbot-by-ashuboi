# AshuBoi ChatterBot

Portfolio chatbot built with **Next.js App Router** and the **OpenAI Chat Completions API**.

## Features

- Clean chat UI with loading + error states
- Server-side API route (`POST /api`) — API key never exposed to the browser
- Modern `openai` Node SDK (replaces broken legacy `Configuration` / `OpenAIApi` usage)
- Dependency upgrades to address known npm audit vulnerabilities

## Setup

```bash
cp .env.example .env.local
# put a real OPENAI_API_KEY in .env.local
npm install
npm run dev
```

Open [http://localhost:3005](http://localhost:3005).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server on port **3005** |
| `npm run build` | Production build |
| `npm start` | Start production server on **3005** |
| `npm run lint` | ESLint |

## Security notes

- Do **not** commit `.env.local`, `openapi.env`, or `.env.txt`
- Rotate any key that was previously checked into the repo
- The chat API validates input and returns structured errors when the key is missing

## Deploy (free)

Deploy on [Vercel](https://vercel.com):

1. Import this GitHub repo
2. Add `OPENAI_API_KEY` (and optional `OPENAI_MODEL`) in project env vars
3. Deploy
