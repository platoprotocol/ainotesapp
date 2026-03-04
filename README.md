# Logan's List

A cloud-based AI notes app — write, organize, and supercharge your notes with AI.

## Features

- Create and edit notes with real-time auto-save
- AI actions: summarize, improve, expand, generate titles, smart tags
- AI chat panel to ask questions about any note
- Voice-to-text transcription via Whisper
- Auto-generated summaries for long notes
- Client-side search across all notes
- Free tier (20 AI requests/month) and Pro tier (unlimited) via Stripe
- Dark mode support

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database & Auth:** Supabase
- **AI:** OpenAI (GPT-4o-mini + Whisper)
- **Payments:** Stripe
- **Styling:** Tailwind CSS v4

## Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd ainotes

# 2. Configure environment variables
cp .env.example .env.local
# Fill in all values in .env.local

# 3. Install dependencies
npm install

# 4. Run database migrations
# Apply the SQL files in /migrations via the Supabase dashboard or CLI

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to get started.
