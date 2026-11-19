import type { Preset } from '@profitstudio/booking-engine';

/**
 * Footing's own preset (INTEGRATION.md §5): the sample appointments, hours and policies preview mode
 * shows, and the starter set the dashboard offers an owner who has no services yet
 * (<BookingAdmin presets>). Prices are in US dollars, in cents.
 *
 * WHAT A BOOKING IS HERE. One booking = ONE appointment at the consultant's desk: a reserved block of
 * the one consultant's time, for ONE client (a person or one small business), for one service, on the
 * practice's one calendar, at its fixed office. Its length is the time at the desk; the buffer after it
 * is the consultant's notes and a clear desk for the next client.
 *
 * WHAT A PRICE IS HERE. The engine has one price per service: the fee for THAT appointment — the
 * conversation itself — paid at the office, never online, no deposits. It is NEVER the price of
 * bookkeeping, tax preparation or filing: those are separate engagements, quoted in writing after an
 * appointment, only if the client asks, and nothing starts until the client agrees to it. Free is the
 * introductory conversation.
 *
 * Honest practice: a description says what the appointment COVERS, never an outcome — no promised
 * refund, savings, deduction, penalty relief or result. No invented licence, credential (CPA, EA…),
 * years, reviews or client results; no tax-law rules or deadlines (they change, and depend on the
 * client). Nobody is asked for a Social Security or taxpayer number, bank details, returns, statements
 * or passwords to book. A description may end with "Good for: …" — who it usually suits. The website
 * shows it as its own line.
 *
 * The website reads each appointment's KIND (intro · books · review · tax · planning · records) from its
 * name (src/lib/services.ts) — to group the booking sheet, to label each appointment on the fee schedule
 * and to answer "Where do things stand?".
 */
export const sitePreset = {
  id: 'tax-bookkeeping',
  label: 'Tax & Bookkeeping Consultant',
  terminology: { customer: 'client', customers: 'clients', booking: 'appointment', bookings: 'appointments' },
  previewBusiness: {
    name: 'Sample Bookkeeping & Tax Practice',
    currency: 'USD',
    locale: 'en-US',
    contact: {
      email: 'hello@example.com',
      phone: '+1 816-555-0100',
      address: '100 Example Street, Kansas City, MO',
    },
  },
  policies: {
    slotIntervalMinutes: 15,
    minNoticeMinutes: 1440,
    maxAdvanceDays: 60,
    autoConfirm: true,
    requirePhone: false,
    pendingHoldMinutes: 720,
    verificationWindowMinutes: 15,
  },
  // One consultant, one desk: weekday office hours, a later Tuesday for people who work nine to five,
  // a short Friday; closed at weekends.
  workingHours: [
    { weekday: 1, start: '09:00', end: '17:00' },
    { weekday: 2, start: '11:00', end: '19:00' },
    { weekday: 3, start: '09:00', end: '17:00' },
    { weekday: 4, start: '09:00', end: '17:00' },
    { weekday: 5, start: '09:00', end: '13:00' },
  ],
  services: [
    {
      name: 'Introductory Consultation',
      description:
        'Twenty free minutes to talk through what you need and which appointment, if any, would help. No documents or figures. Good for: not sure where to start',
      durationMinutes: 20,
      bufferAfterMinutes: 10,
      priceCents: 0,
      priceFrom: false,
    },
    {
      name: 'Small Business Bookkeeping Consultation',
      description:
        'How your books are kept today, and a simple monthly routine you can keep. You leave with written next steps. Good for: a new business, books that fell behind',
      durationMinutes: 60,
      bufferAfterMinutes: 15,
      priceCents: 15000,
      priceFrom: false,
    },
    {
      name: 'Monthly Books Review',
      description:
        'One month of the books you keep yourself, reviewed together on your own laptop. Nothing is copied or kept. Good for: owners who do their own bookkeeping',
      durationMinutes: 45,
      bufferAfterMinutes: 15,
      priceCents: 11000,
      priceFrom: false,
    },
    {
      name: 'Tax Preparation Consultation',
      description:
        'What preparing your return would involve and which records it needs. If you want it prepared, a separate written quote follows. Good for: a first self-employed return',
      durationMinutes: 45,
      bufferAfterMinutes: 15,
      priceCents: 12000,
      priceFrom: false,
    },
    {
      name: 'Self-Employed Tax Planning Discussion',
      description:
        'What to keep track of, setting money aside for tax, and what to ask whoever prepares your return. General planning — no promised savings. Good for: a first year freelancing',
      durationMinutes: 60,
      bufferAfterMinutes: 15,
      priceCents: 15000,
      priceFrom: false,
    },
    {
      name: 'Financial Records Organization Session',
      description:
        'A hands-on session to set up a simple system for receipts, invoices and statements. Bring a sample; nothing is kept. Good for: the shoebox year',
      durationMinutes: 90,
      bufferAfterMinutes: 15,
      priceCents: 18000,
      priceFrom: false,
    },
  ],
} satisfies Preset;
