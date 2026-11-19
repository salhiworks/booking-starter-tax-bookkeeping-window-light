# Window Light — the design system

**The idea.** A quiet room in late afternoon: low sun falls through a tall window across plaster —
the moment things become clear. "Bring your numbers into the light." The site feels like a boutique
advisory studio, not accounting software: cinematic photography of one person working in warm light,
large light type, generous space, very little text.

## Colour (`src/styles/tokens.css`)

| Token | Value | Role |
|---|---|---|
| `--spruce` (night) | `#17120e` | The room at dusk — first screen, suggestion card, the free-introduction card, scope band, privacy card, booking band, footer |
| `--paper` (plaster) | `#efe8dd` | The reading pages |
| `--paper-2` | `#e6ddcf` | Deeper plaster — fees, questions |
| `--raised` (linen) | `#faf6ef` | Cards, answers, questions, the booking card and sheet |
| `--ink` / `--ink-soft` / `--muted` | `#1b1612` / `#3b322a` / `#635649` | Text (15.4 · 10.9 · 5.9 : 1 on plaster) |
| `--accent` (low sun) | `#f2b27a` | **Owner-editable.** The light itself: main buttons on night, the lit italic words, the band behind italics on plaster, the chosen answer, day and time. A LIGHT colour carrying ink text (checked at 4.5:1 against ink). |

Contrast (rendered audit, page and sheet): lowest 5.28:1.

## Type

- **Red Hat Display** — headings set large, light (300) and tight (−0.035 to −0.05em); its italic for emphasis.
- **Red Hat Text** — reading text, buttons, small spaced capitals for labels.
- **Red Hat Mono** — figures: times at the desk, fees in the suggestion, line numbers.

## The one ornament: the shaft

A soft diagonal band of low sun (`--shaft`). It crosses the first screen from the photograph over the
words, lies across the suggestion card and the free-introduction card, sweeps across a consultation
card on hover and lights the footer name. Italic words on plaster get a short band of the same light
behind them; on night they are the light. The mark is a tall window with one band of light across it.

## Sections (7)

1. **First screen (night)** — kicker, "Bring your numbers into the *light.*", one sentence, Book a
   consultation, Find the right appointment, three live facts (Free 20-min introduction · from $110
   consultations · open now); the tall portrait beside it fills the screen's height.
2. **Where do things stand?** — the visitor's words as large pills; the suggestion on a dark card
   (kind, name, why, three topics, live length and fee, Book with the answer in the note); a portrait
   beside them from 1200 px.
3. **Consultations & fees** — six cards (fee large, kind, name, one line, time, Book); the free
   introduction is the dark card that starts the row; a swipeable row on phones. Then the **scope
   band** over the sunlit wall: your fee covers · quoted separately, if you ask · nothing ongoing
   starts without a written quote and your yes.
4. **The practice** — a wide photograph to the screen's edge; one desk, one client at a time; who it
   works with as pills; one line on who is better served elsewhere.
5. **What to expect** — three large steps; a wide photograph with the privacy card over its corner
   (never asked for online, struck through with light; how documents move if you work together).
6. **Questions** — six short answers, labelled "Sample policies" until edited.
7. **Book (night)** → **The office** → **Footer (night)**, the name set huge in a shaft of light.

## Motion

The shaft settles in on the first screen; italic bands draw in as headings arrive; the suggestion card
settles; strike lines are drawn through; cards lift on hover. All off under `prefers-reduced-motion`
(nothing hidden without `html.js-reveal`).

## Layout

One centred shell (`--page-max: 104rem`); the practice photograph bleeds to the screen's left edge.
Breakpoints: 640 (cards in two columns, steps in three), 960 (header nav, the height-aware first
screen, three-column cards), 1200 (the recommendation's photograph), 1600 (wider first-screen
photograph); short laptops and short phones tighten the first screen. The header is transparent
over the night first screen and frosted plaster once scrolled. 44 px targets everywhere.
