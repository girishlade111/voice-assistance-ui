# Voice Assistance UI — AI Travel Assistant

A conversational travel-planning UI with an AI voice assistant that helps you discover attractions, hotels, and restaurants within your budget. Uses the browser's built-in **Web Speech API** for voice input (SpeechRecognition) and voice output (SpeechSynthesis) — no API keys or backend required.

## What it does

- Guides you through a step-by-step conversation: destination → budget → preferences → results.
- Listens to your voice answers and speaks responses back (multilingual, via the language selector).
- Generates mock travel recommendations: attraction cards, hotel cards, and restaurant cards with ratings and prices.
- Keeps a conversation history sidebar and a map-style results view.

## Features

- Voice mode powered by the Web Speech API (recognition + speech synthesis), free and client-side
- Typed fallback input for browsers without SpeechRecognition
- Multi-language support via the language selector
- Budget-aware recommendation flow
- Rich result cards: attractions, hotels, restaurants (with map-view layout)
- Conversation history panel
- Dark gradient travel-themed design, responsive

## Tech stack

- **Framework:** Next.js 15.2 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui primitives
- **Voice:** Web Speech API (SpeechRecognition / speechSynthesis) — browser-native
- **Icons:** Lucide React
- **Observability:** `@vercel/analytics`

## Quick start

Requirements: Node.js 18+. Voice features work best in Chrome/Edge.

```bash
npm install          # or: pnpm install
npm run dev          # open http://localhost:3000
```

Static production build:

```bash
npm run build        # outputs to out/
npx serve out
```

## Environment variables

None. Recommendations are generated client-side (mock/demo data); the voice features use browser APIs only.

## Project structure

```
app/
  page.tsx            # landing hero + <VoiceAssistant />
  layout.tsx          # root layout, fonts, theme provider
  globals.css
components/
  voice-assistant.tsx      # conversation engine, voice I/O, state machine
  language-selector.tsx    # speech language picker
  conversation-history.tsx # transcript sidebar
  attraction-card.tsx      # attraction result card
  hotel-card.tsx           # hotel result card
  restaurant-card.tsx      # restaurant result card
  map-view.tsx             # results map layout
  ui/                      # shadcn/ui primitives
lib/utils.ts
public/               # static assets
```

## Deployment

Fully static — no API routes, no server actions, no env vars. `next.config.mjs` sets `output: 'export'`; `npm run build` produces a deployable `out/` directory for GitHub Pages, Vercel, Netlify, or any static host.

**Note:** `basePath: '/voice-assistance-ui'` is set because this copy is deployed to GitHub Pages under the repo subpath. Remove the `basePath` line when deploying to a root domain.

## License

Free to use and adapt.

---
Built by Girish Lade · https://ladestack.in
