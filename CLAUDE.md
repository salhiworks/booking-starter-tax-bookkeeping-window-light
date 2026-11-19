# Bookkeeping & Tax Consultation "Window Light" Starter — project rules

A one-page booking website for an independent bookkeeping and tax consultation practice run by one
consultant who sees one client at a time at one office, shipped as **Footing Bookkeeping & Tax** (a
fictional practice in Kansas City: a free introductory consultation, a small business
bookkeeping consultation, a monthly books review, a tax preparation consultation, a self-employed tax
planning discussion and a financial records organization session — one client and one service per
appointment, at one fixed office address) for the owner to make their own. Its identity lives in
`src/site.config.ts`; `CUSTOMIZE.md` is the prompt that personalizes it. Built around
**@profitstudio/booking-engine** **2.0.0-beta.3** (pinned; lock in `booking-engine.lock.json`). The
engine owns booking; this project owns the public design.

Read before changing anything:
- `BOOKING_ENGINE.md` — the engine's rules (engine-owned; `npx booking-engine sync` replaces it).
- `node_modules/@profitstudio/booking-engine/docs/INTEGRATION.md` — the full contract. It wins on technical points.
- `DESIGN.md` — the visual system. `PHOTOS.md` — photo sources and licences.

## The Live Demo layer — leave it alone

- `src/demo/` is the public Live Demo's in-browser engine and sample data. Only
  `npm run dev:demo` / `npm run build:demo` use it (`vite --mode demo` defines
  `__BOOKING_DEMO__`); in every other build it is compiled out. Never read, edit
  or "fix" it while customizing the website.
- Keep the `__BOOKING_DEMO__ ? … : …` branches as they are: the demo wording
  (no email is sent) must stay true in the demo, and the real wording in production.
- `src/demo/engine/` is vendored from the Niche Pack workspace — edit it there.
- `src/admin-main.tsx` passes `emailDelivery={__BOOKING_DEMO__ ? 'none' : undefined}`:
  only the demo's dashboard says no email is sent. Never set it on a real site.

## Engine boundaries (from BOOKING_ENGINE.md)

- All booking data goes through the ONE instance in `src/lib/engine.ts`. Never import
  `@supabase/supabase-js` for booking data, call `booking_*` RPCs or write SQL for booking tables.
- Never edit `supabase/migrations/*_booking_engine_*.sql`, `supabase/functions/booking-mailer/`,
  `booking-engine.lock.json` or `node_modules`.
- Only the publishable key may reach the website (`VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY`,
  both or neither). Never a secret/`service_role` key, never an email provider key, in any file or `VITE_` variable.
- Show only the slots `getAvailability()` returns; send `slot.startsAt` back unchanged; show dates and
  times in `business.timezone`. Never compute availability in the browser — the calendar only reshapes
  engine data with the engine's helpers (`monthGrid`, `groupSlotsByPartOfDay`, `isFewLeft`, `nextAvailableDay`…).
- Label slot times with the server's business-local `slot.time` / `confirmation.time` via `formatClockTime`.
- Book in two steps: `requestBooking()` → code step → `verifyBooking()`. "Send a new code" =
  `resendVerificationCode()`; "Choose another time" = await `cancelBookingRequest()`, then reload availability.
- Handle `ok: false` on every call. Show success only after `verifyBooking()` returned `ok: true`
  (pending → "Request received — we'll check the calendar and confirm the time shortly.",
  confirmed → "Your appointment is booked."). Preview answers `PREVIEW_MODE`: say so honestly, never a success screen.
- `business.policies.onlineBookingEnabled === false` (or `BOOKING_DISABLED`) → contact details instead of the flow.
- The engine sends every booking email. Never add an email service to the website.
- Keep the packaged dashboard on `/admin/` (`admin/index.html` → `src/admin-main.tsx`). Never fork or restyle it:
  `src/admin-theme.css` sets only `--pbe-accent` / `--pbe-accent-text` per mode.

## What the engine does not do — never fake it

**One booking = one consultation at the desk: a reserved block of the one consultant's time, for ONE
client (a person, or one small business), for one service, on one calendar, at the office's fixed
address.** Its length is the time at the desk; the buffer after it is the consultant's notes. Fees
are paid at the office — never online, no deposits. Bookings confirm on the code (`autoConfirm: true`
in the preset); the owner may switch to reviewing requests in the dashboard, and the flow then says
"request".

**An appointment fee is not an engagement.** The fee buys that conversation only. Preparing or
filing a return, ongoing or catch-up bookkeeping, payroll and anything done on the client's behalf
are separate engagements, quoted in writing after an appointment only if the client asks — nothing
starts until the client agrees. The scope band under the fee cards ("A consultation, not a contract"), the FAQ
and the descriptions say so. Never word a service, fee or button as if booking
included preparation, filing or ongoing work.

**Never promise an outcome.** No promised refund, savings, deduction, penalty relief, "maximize",
"audit-proof" or any result. No tax-law rules, thresholds or filing deadlines in the copy: they
change, and they depend on the client and the jurisdiction. Questions about legal disputes,
representation or investments go elsewhere (the practice section and FAQ say so).

**No sensitive data, no documents.** The booking form asks for a name, an email and an optional
phone number — nothing else. Never add a field for a Social Security or taxpayer identification
number, bank or card details, income, returns, statements, pay slips, passwords or logins, and never
a file upload. The notes field is **Anything we should know (optional)** with the helper "For example
what kind of business you have, or the question you'd most like answered. Please don't write Social
Security or taxpayer numbers, account numbers, passwords or figures here." The privacy card ("What to expect") says
how documents are handled if a client goes on to work with the practice: agreed separately, through a
separate secure method — never through this website, the booking form or ordinary email. Never build,
simulate or imply a document portal, secure file transfer, accounting software, tax filing or
financial-record management: the engine provides none of them.

**Kinds are read from names.** "Introductory Consultation", "Small Business Bookkeeping
Consultation", "Monthly Books Review", "Tax Preparation Consultation", "Self-Employed Tax Planning
Discussion" and "Financial Records Organization Session" are ordinary engine services; the website
only reads their KIND (intro · books · review · tax · planning · records) from the words in the name
(`src/lib/services.ts`, in that test order: intro, planning, review, records, tax, books) — to group
the booking sheet (not sure yet? · consultations), to list the introduction first, and to label each
appointment. "Where do things stand?" links each answer to an appointment with `serviceFor` (the exact
name, else a name containing the owner's words from the start of a word, else the first appointment of
the kind the words name; with none, no Book button). Its Book writes `Where things stand: "<answer>"`
into the booking note.

**Honest practice.** Never invent the consultant's name, licences or credentials (CPA, EA, PTIN
claims, memberships), years in practice, awards, press, reviews, testimonials, client logos, client
results or savings figures. The *Good for:* line names a situation ("a new business") — never an
outcome. Every stock photo is labelled and never presented as the consultant, the office or a client.

A new booking feature needs a new engine version — never custom database code or browser-side logic:

- deposits or any online payment; subscriptions, retainers or packages;
- several consultants, group bookings, linked or recurring bookings, waitlists;
- client accounts, document uploads or exchange, intake questionnaires, engagement letters, e-signatures;
- tax filing, bookkeeping software, financial records of any kind.

Proposed engine work: `docs/ENGINE-PROPOSAL-tax-bookkeeping.md` in the Niche Pack workspace.

## Where things live

| What | Where |
|---|---|
| Engine instance (preview: name, `America/Chicago`, placeholder contact) | `src/lib/engine.ts` |
| This site's preset (sample appointments, hours, policies; "clients"/"appointments") — also the dashboard's starter set | `src/lib/preset.ts` (`sitePreset`) |
| Kind (intro · books · review · tax · planning · records · other) from the name, its label (`KIND_LABEL`), page order (`indexOrder`), booking-sheet groups (`kinds`), `serviceFor` (words → appointment), "Good for:" parsing, length and fee terms | `src/lib/services.ts` |
| What the owner can edit (every text and photo — name and descriptor, hero (headline, one sentence, buttons, photo), "Where do things stand?" (answers → appointments, why, topics, photo), the fees' words, the scope band (two lists, the line under them, background photo), the practice (text, who for, who not for, photo), what to expect (steps, never asked for, documents, photo), questions & policies, booking words and photo, office note and photo, logo, accent colour) | `src/content/site.ts` (`defineSiteContent`) |
| Content store + brand → CSS variable (`--accent`) | `src/lib/content.ts` |
| Design tokens — the ONLY file with raw colours, fonts, sizes, spacing (and the light shaft) | `src/styles/tokens.css` |
| Base / page / booking styles (tokens only) | `src/styles/base.css`, `site.css`, `booking.css` (note: booking.css owns `.sheet` (the booking dialog), `.rail`, `.parts`, `.part`, `.pick`, `.time`, `.summary` — the page uses its own names: `.hero__shaft`, `.facts`, `.fact`, `.chips`, `.answer`, `.match`, `.cards`, `.card`, `.scope`, `.pills`, `.steps`, `.step`, `.privacy`, `.struck`) |
| Sections | `src/components/*.tsx` (Header (the mark and name; transparent over the night first screen), Hero `#top` (live facts, open now, the photo), Where `#where` (answer pills as a tab list + the suggestion card), Services `#fees` (cards) with the scope band `#scope`, Practice `#practice`, Expect `#process` (steps) with the privacy card `#privacy`, GoodToKnow `#questions`, BookingSection `#book`, Visit `#visit` (the office), Footer (the name set large)); the mark `Mark.tsx` (a window with a band of light), emphasis `Emphasis.tsx` (italic, lit), section labels `SectionLabel.tsx`; scroll reveals `src/lib/reveal.ts` (`data-reveal`); the section list for header, phone menu and footer is `src/lib/nav.ts` |
| Booking sheet (a modal `<dialog>` at `#book`; Back/Esc/✕ close it) + the `#book` band | `src/App.tsx` (open/close + history, `startBooking(serviceId, note)`), `src/components/booking/BookingSheet.tsx`, `BookingSection.tsx`, `src/lib/dialog.ts` |
| Booking flow | `src/components/booking/` (BookingFlow = state + engine calls, root `#book-flow`; DayPicker, TimePicker, DetailsForm, CodeStep, Summary, Done) |
| "Open now" + hours changes | `src/lib/useOpening.ts`, `src/lib/hours.ts` |
| Photo variant map | `public/photos/`, `src/content/photoVariants.ts` (generated by `concepts/tax-bookkeeping-window-light/photo-pipeline/photos.mjs`) |
| Content baked into `index.html` at build | `vite.config.ts` (`publishedSiteContent`) |

## Rules for future changes

- **Content fields:** render values as text (never `dangerouslySetInnerHTML`), images from the resolved
  `src`/`alt`. Never rename or reuse a field id on a live site — add a new id. Services, fees,
  lengths, hours, the address, phone and email are NOT content: they come from the engine.
- `src/content/site.ts` is also imported by `vite.config.ts` (Node): keep it free of local imports.
- **Every Book button** calls `startBooking()` (App): it opens the sheet, or — while online booking is off,
  unconfigured or failing — leads to the `#book` section and its contact details. A card's, a fact's
  or a suggestion's Book passes THAT service's engine id — never a stored price or id.
- **Lengths and fees:** always from the engine (`minutesLabel`, `durationLabel`, `priceLabel`, `priceTerms`).
  Never hard-code a service, length, fee or id in copy (questions, answers and steps included).
- **Sample photos:** every photo carries a "Sample photo" label until the owner replaces that field
  (`ownerFields`). Never present a stock photograph as the consultant, the office or a client.
- **Default photos:** add variants to `public/photos/` via the photo pipeline, keep the default `src`
  in `site.ts` equal to a key in `photoVariants.ts`, record the source in `PHOTOS.md`. If the
  first-screen default changes, update the `<link rel="preload">` in `index.html` (`imagesizes` must
  match `HERO_SIZES` in `src/components/Hero.tsx`).
- **Policies:** Questions shows a "Sample policies" label until the owner edits `faq.items`.
- **Copy:** short, calm, plain ("bring your numbers into the light"); a sentence where one will do. No
  "maximize your refund", "save thousands", "guaranteed", "certified", "IRS-approved", "audit-proof",
  "stress-free taxes", no pressure, no promised outcomes, no fake urgency, no deadlines.
- **Style:** plain CSS with the tokens; no UI kit. 44 px tap targets, visible focus, the
  `prefers-reduced-motion` path, every text/background pair at 4.5:1 (`contrast.mjs` in the concept
  folder). The accent is owner-editable and is a LIGHT colour that always carries ink text (the editor
  checks 4.5:1 against ink): buttons on night, the lit italic words on night, the band behind italic
  words on plaster, the chosen answer, day and time — never text on the plaster pages. The night bands
  and plaster pages are fixed.
- **Composition (DESIGN.md):** night, plaster, linen, one accent (low sun); Red Hat Display large and
  light for headings (its italic for emphasis); Red Hat Text for reading and labels; Red Hat Mono for
  figures; the light shaft as the one ornament; the window as the mark; every section inside the one
  centred shell (`.shell`, `--page-max`) except the practice photograph, which bleeds to the edge. The
  first screen on wide screens is exactly one screen tall. Motion — the shaft settling, italic bands
  drawing in, strike lines — is off under `prefers-reduced-motion`; never hide content without
  `html.js-reveal`.
- The public site stays one page (sections + in-page booking flow); no client-side path routes.

## Commands

```bash
npm run dev                              # http://localhost:5301 (preview mode without a backend)
npm run build                            # tsc -b && vite build (multi-page: / and /admin/)
npm run lint                             # oxlint (supabase/functions is ignored)
npm run dev:demo                         # the Live Demo: in-browser engine + dashboard, nothing sent
npm run build:demo                       # the public Live Demo build — never the production site
npx booking-engine doctor                # project check
npx booking-engine doctor --dist dist    # after a build: scans the output for secrets
```

Connecting a backend (Supabase, email) follows INTEGRATION.md §11 — only with the owner's go-ahead.
