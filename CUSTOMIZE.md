# Make this starter yours — the Claude Code prompt

Fill in the four lines at the top, then paste the whole prompt into a Claude Code session opened in
this folder. It changes identity and words only, so it finishes in one short session.

```text
Customize this bookkeeping & tax consultation starter for my practice.

Practice name: <YOUR PRACTICE NAME>
City and area: <CITY, AREA, STATE>
Time zone (IANA): <e.g. America/Chicago>
How I work, in a few words: <e.g. one office above a bakery, weekdays plus a late Tuesday, small businesses and freelancers>

Follow CLAUDE.md (already loaded in this session — no need to open it again).
Open and change only these files; don't explore the rest of the project:
1. src/site.config.ts — name, timezone, and fictional previewContact details in my city.
2. index.html and admin/index.html — the practice name, city and description in <title>,
   the meta description and the og tags.
3. src/content/site.ts — rewrite every DEFAULT text for my practice: the name and the line beside
   it, what I do and where, the headline (short — it is set very large), introduction, main button,
   second link, "Where do things stand?" (heading, line and the answers — each in the visitor's
   words, naming one of my appointments by its name or a word from it, why, and two or three short
   topics), the fees heading, line and small print, "Consultation or engagement" (both lists and the
   line under them), the practice (my own words; who I usually work with and who is better served
   elsewhere), "What to expect" (three steps, what is never asked for online and how documents are
   handled if we work together — keep it TRUE for my practice), the questions & policies (my real policies —
   cancellations, payment, scope), the booking heading and introduction, the office note, the
   footer line and the search title and description.
   Keep field ids, types, limits and photos. Keep the sample photos (they stay labelled "Sample
   photo" until I upload my own).
   Keep the honesty rules: one booking is one appointment for one client at my one office; an
   appointment fee is the fee for that conversation — never for bookkeeping, tax preparation or
   filing, which are separate engagements quoted in writing only if the client asks; never promise
   a refund, savings, a deduction or any outcome; no tax-law rules or deadlines; no credentials
   (CPA, EA, licences), years in business, memberships, awards, reviews, testimonials or client
   results unless I tell you they are true; never ask for Social Security or taxpayer numbers,
   account details, returns, statements or passwords; nothing is paid online and there are no
   deposits; no appointment lengths or fees written into the copy.
   Keep the copy SHORT — a sentence where the sample has one.
4. Only if low sun clearly doesn't fit my brand (otherwise skip this step): change the default of
   brand.accent in src/content/site.ts (a LIGHT, warm colour that keeps ink text at 4.5:1 — a pale
   brass, a soft rose, a light sage) and both colours in src/admin-theme.css. The night bands and
   plaster pages are part of the design and stay.

Do not change the layout, the booking flow, src/lib/engine.ts, src/lib/preset.ts,
src/lib/services.ts, src/demo/, supabase/, booking-engine.lock.json or package.json. Do not invent
appointments, fees, opening hours or credentials I haven't told you about — appointments, fees and
hours are set in the dashboard. When done, run npm run build and fix any error, then show me the
result with npm run dev.
```

## After the prompt

- **Your appointments:** dashboard → Services. One booking is one appointment with you, for one
  service and one client. The time shown is the time at the desk.
  - **Kinds.** The page reads each appointment's kind from the words in its name (then its
    description): *introductory, discovery, first call* → **To begin** (its own group in the
    booking sheet, listed first); *planning, self-employed, freelancer* → **Planning**; *review,
    check-in, second look* → **Review**; *records, organization, paperwork, receipts* →
    **Records**; *tax, return* → **Tax**; *bookkeeping, books, accounts, setup* → **Bookkeeping**.
    Anything else is a plain appointment.
  - **Descriptions.** Keep them to one or two short sentences: the cards show the part before
    "Good for:", and the booking sheet shows all of it.
  - **Fees.** A fixed fee is the appointment; tick "from" if the fee is agreed before you start; 0
    is shown as *Free* (the introduction). Nothing is paid online. The fee is never the price of
    preparing a return or keeping books — say so in your descriptions if it helps.
  - **Who it's for.** End a description with `Good for:` — `Good for: a new business`. Describe a
    situation, never a promised result.
- **Where do things stand?:** Website → that section. Each answer names an appointment by its exact
  name or a word from it ("Review"); the dark card shows that appointment's live length and fee and a
  Book button that writes the visitor's words into the booking note. An answer whose appointment you
  no longer offer shows no Book button.
- **Headings:** wrap a word or two in *asterisks* to set them in italic, lit by your accent (a band
  of light behind them on plaster; the light itself on the dark bands).
- **Photos:** Website → each section. Use only your own photos. The "Sample photo" label disappears
  from each one you replace.
- **Documents:** this website collects none and must not. If you exchange documents with clients,
  agree a separate secure method with them in writing — the booking system is not a document portal.
- **Online booking:** dashboard → Settings, once email sending works (see BOOKING_ENGINE.md).
