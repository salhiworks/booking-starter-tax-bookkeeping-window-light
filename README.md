# Bookkeeping & Tax Consultation Booking Website — "Window Light" Starter

A finished, premium booking website for an independent bookkeeping and tax consultation practice run
by one consultant, one client at a time, ready to make your own with Claude Code and publish on
Hostinger. It ships as **Footing Bookkeeping & Tax**, a fictional practice in Kansas City:

- a one-page website built on **window light** — a quiet room in late afternoon, low sun across
  plaster: a dark first screen with a very large, light headline ("Bring your numbers into the
  *light.*"), **Book a consultation**, live facts (the free introduction, consultations from the
  lowest fee, open now) and a tall cinematic portrait; **where do things stand?** — pick the line
  that sounds like you and a dark card suggests the appointment with its live length and fee (Book
  writes your words into the note); **consultations & fees** as six cards (a swipeable row on
  phones) and a band that draws the line between a consultation and an engagement; the practice; what
  to expect in three steps with what is never asked for online; short questions (sample policies,
  labelled); booking; the office; the name set huge in the footer — from 320 px phones to ultrawide;
- online booking — **one appointment per booking** (one client, one service), a day and time,
  contact details and an optional note (never numbers, accounts or documents), and an emailed
  6-digit code;
- the owner dashboard at `/admin/` — appointments, services and fees, hours and closures, email
  health, and the website's own text, photos and accent colour.

The look — *Window Light*: warm night bands and plaster pages, one light accent (low sun) that carries
ink text; Red Hat Display set large and light, Red Hat Text, Red Hat Mono for figures; one ornament,
a soft shaft of light.

Booking runs on [`@profitstudio/booking-engine`](https://www.npmjs.com/package/@profitstudio/booking-engine)
**2.0.1** (pinned) with your own Supabase project and Resend for email.

## 1. Try it (no accounts needed)

```bash
npm install
npm run dev:demo   # the full Live Demo: book, then manage it at /admin/
npm run dev        # preview mode: the website with sample times, nothing saved
```

In the Live Demo everything stays in your browser — nothing is sent anywhere.

## 2. Make it yours with Claude Code

Open this folder in a Claude Code session and paste the prompt in
[`CUSTOMIZE.md`](CUSTOMIZE.md), filled in with your business. Claude edits a short list of files
(name, city, words, colours) — the booking system, the dashboard and the layout stay as they are.

Appointments, fees, hours and contact details are **not** code: you set them in the dashboard once
the booking backend is connected. The page reads each appointment's kind from the words in its name
(to begin · bookkeeping · review · tax · planning · records — see `CUSTOMIZE.md`). **Your own
photographs** go in the dashboard → Website. Each sample photo stays labelled "Sample photo" until you
replace it. Licences, credentials (CPA, EA…), memberships and years in practice are yours to add if
they are true: the starter invents none, and it never shows a review, a testimonial or a client
result it doesn't have.

**A booking is one consultation at the desk.** The booking engine books single appointments on one
calendar — one consultant, one client, one service, at one office. An appointment fee is the fee for
that conversation: preparing or filing a return, ongoing bookkeeping and anything done on a client's
behalf are separate engagements, quoted in writing only if the client asks. The site promises no
refund, savings or outcome and gives no tax-law rules or deadlines. The booking form asks only for a
name, an email and (optionally) a phone number, and its note asks clients not to write tax numbers,
account numbers, passwords or figures. The engine does not take payments or deposits, store or
exchange documents, file anything, or schedule several consultants (see *What the engine does not
do* in `CLAUDE.md`).

## 3. Connect real bookings

You need a free Supabase project and a Resend account for booking emails.

```bash
cp .env.example .env.local    # your Supabase Project URL + Publishable key (Windows Command Prompt: copy .env.example .env.local)
npx supabase@2 login          # once, in your own terminal
npx booking-engine connect --admin you@example.com
```

`connect` links the project, sets up the database and the booking-email function, and tells you
exactly what is left for you to do (your dashboard login and the two email secrets). Full steps:
the Profit Studio guide *Build a Premium Booking Website with Claude Code*, Step 3, or
`node_modules/@profitstudio/booking-engine/docs/INTEGRATION.md` §11.

Never put a Supabase **Secret** key or your Resend API key in `.env.local`, in a prompt or in
Hostinger — the Resend key lives only in Supabase's Edge Function secrets.

## 4. Publish on Hostinger

Push this project to a private GitHub repository, then in Hostinger create a **Web App** from it
(Websites → Create site → Web App → Import Git Repository):

| Setting | Value |
|---|---|
| Framework | Vite |
| Build command | `npm run build` (never `build:demo`) |
| Output directory | `dist` |
| Node.js | 22 or newer |
| Environment variables | `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (public values only) |

`dist/` contains the website and `dist/admin/` the dashboard. Every push to `main` redeploys.

## What is in this folder

| | |
|---|---|
| `src/site.config.ts` | The business name, time zone and preview contact details |
| `src/content/site.ts` | Everything the owner can edit in the dashboard → Website, with its default text and photos |
| `src/styles/tokens.css` | The design's colours, type, the light shaft and spacing (one file); `DESIGN.md` explains the system |
| `src/components/` | The website (`Hero` with the live facts, `Where` (where do things stand?), `Services` (cards + the scope band), `Practice`, `Expect` (steps + privacy), `GoodToKnow`, `Visit`…), the ornament pieces (`Mark.tsx`, `SectionLabel.tsx`, `Emphasis.tsx`) and the booking flow (`src/components/booking/`) |
| `src/lib/preset.ts` | The sample appointments and hours used by preview mode and offered in a new dashboard |
| `src/lib/services.ts` | How appointments find their kind (by the words in their names), how the page's words find an appointment, "Good for:", lengths and fees |
| `admin/` + `src/admin-main.tsx` | The packaged dashboard, mounted at `/admin/` |
| `src/demo/` | The Live Demo's in-browser engine and sample data — used only by `dev:demo` / `build:demo`; a normal build contains none of it |
| `supabase/` | The engine's database migrations and email function (managed by `npx booking-engine`; do not edit) |
| `CLAUDE.md`, `BOOKING_ENGINE.md` | Rules Claude Code follows in this project |
| `PHOTOS.md` | The Pexels photos (Pexels License), credited file by file |

## Commands

```bash
npm run dev          # preview mode (sample data) until .env.local exists — http://localhost:5301
npm run dev:demo     # the Live Demo (in-browser data, dashboard included)
npm run build        # production build → dist/
npm run build:demo   # the public Live Demo build → dist/ (never deploy this as your site)
npx booking-engine doctor             # checks versions, engine files and keys
npx booking-engine doctor --dist dist # after a build: also scans the output for secrets
```

## Licence

The code is MIT-licensed — see [`LICENSE`](LICENSE) (Copyright (c) 2026 Youssef Es-salhi).
Photographs and other third-party assets keep their own terms, listed in [`ASSETS.md`](ASSETS.md)
(the photographs file by file in [`PHOTOS.md`](PHOTOS.md)).
