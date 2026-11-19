import { defineSiteContent } from '@profitstudio/booking-engine';

/**
 * What the owner may change in the dashboard (Website). The defaults are the
 * website's own copy and photos: until the owner publishes, the page shows
 * exactly these. Appointments, fees, lengths, hours, the address, phone and
 * email are NOT here — they come from the engine.
 *
 * Never rename or reuse a field id once the site is live: the owner's text is
 * stored under it. Add a new id instead.
 *
 * This file is also imported by vite.config.ts (Node), so it imports nothing
 * local. Default photo `src` values are keys of src/content/photoVariants.ts.
 *
 * Headings may wrap words in *asterisks*: those words are set in italic, lit
 * by a soft band of window light behind them.
 *
 * Copy rules (CLAUDE.md): an appointment fee is the fee for the conversation,
 * never for bookkeeping, tax preparation or filing; no promised refund,
 * savings, deduction or outcome; no invented licence, credential, years,
 * reviews or client results; no tax-law rules or deadlines. Never ask for a
 * Social Security or taxpayer number, bank details, returns, statements or
 * passwords — online or in the booking note.
 */
const SAMPLE_HELP =
  'A “Sample photo” label stays on it until you replace it with your own photo — use only photos you took or have the right to use. Never present a stock photo as you, your office or a client.';

type Img = { src: string; alt: string; width: number; height: number };
const P = (name: string, alt: string): Img => ({ src: `/photos/${name}-800.webp`, alt, width: 800, height: 1000 });
const L = (name: string, alt: string): Img => ({ src: `/photos/${name}-960.webp`, alt, width: 960, height: 640 });
const LIGHT_WALL_ALT = 'Late sun casting two bright window shapes across a plaster wall above a wooden shelf.';
const EMPHASIS = 'Wrap a word or two in *asterisks* to set them in italic, with a soft band of light behind them.';
const LINES = 'One per line.';

export const siteContent = defineSiteContent({
  sections: [
    {
      id: 'brand',
      label: 'Brand',
      description: 'Your name or logo and the accent colour.',
      fields: [
        {
          type: 'text',
          id: 'brand.wordmark',
          label: 'Name',
          help: 'Shown beside the mark in the header and very large in the footer. One short word reads best.',
          default: 'Footing',
          maxLength: 20,
          required: true,
        },
        { type: 'text', id: 'brand.descriptor', label: 'Line beside the name', help: 'Two or three words.', default: 'Bookkeeping & tax', maxLength: 28 },
        {
          type: 'image',
          id: 'brand.logo',
          label: 'Logo',
          help: 'Optional. A wide logo on a transparent background, drawn for a light background. It replaces the mark and name in the header.',
          default: null,
          aspectRatio: 4,
        },
        {
          type: 'color',
          id: 'brand.accent',
          label: 'Accent colour',
          help: 'The light in the design: the main buttons on dark sections, the glow behind italic words, the chosen answer, day and time. It carries dark text, so pick a LIGHT, warm colour — low sun (the original), a pale brass, a soft rose. Dark colours are refused.',
          default: '#f2b27a',
          contrastWith: '#1b1612',
          minContrast: 4.5,
        },
      ],
    },
    {
      id: 'hero',
      label: 'First screen',
      description: 'The headline, one sentence and the main photograph. The facts beside the button come from your Services.',
      fields: [
        { type: 'text', id: 'hero.kicker', label: 'What you do', default: 'Bookkeeping & tax consultations', maxLength: 44 },
        { type: 'text', id: 'hero.place', label: 'Where you are', default: 'Kansas City', maxLength: 40 },
        { type: 'text', id: 'hero.title', label: 'Headline', help: `Short — it is set very large. ${EMPHASIS}`, default: 'Bring your numbers into the *light.*', maxLength: 56, required: true },
        {
          type: 'longText',
          id: 'hero.lede',
          label: 'One sentence',
          default: 'Unhurried, one-to-one consultations for freelancers and small businesses.',
          maxLength: 140,
          rows: 2,
        },
        { type: 'text', id: 'hero.cta', label: 'Main button', default: 'Book a consultation', maxLength: 28, required: true },
        { type: 'text', id: 'hero.secondary', label: 'Second link', help: 'Leads to “Where do things stand?”.', default: 'Find the right appointment', maxLength: 32 },
        {
          type: 'image',
          id: 'hero.photo',
          label: 'Main photo (portrait 4:5)',
          help: `Portrait (4:5), shown tall beside the headline. Warm window light reads best. ${SAMPLE_HELP}`,
          default: {
            src: '/photos/hero-light-1200.webp',
            alt: 'A man in glasses and a linen shirt, in profile, turned toward a shaft of window light on a dark wall.',
            width: 1200,
            height: 1500,
          },
          aspectRatio: 4 / 5,
        },
      ],
    },
    {
      id: 'where',
      label: 'Where do things stand?',
      description: 'Visitors pick the line that sounds like them and see the appointment that fits, with its live length and fee. Each answer names one of your appointments (or a word from its name).',
      fields: [
        { type: 'text', id: 'where.title', label: 'Heading', help: EMPHASIS, default: 'Where do things *stand?*', maxLength: 48, required: true },
        { type: 'text', id: 'where.intro', label: 'Line under the heading', default: 'Pick the one that sounds like you.', maxLength: 90 },
        {
          type: 'list',
          id: 'where.answers',
          label: 'Answers',
          help: 'Up to seven, in the visitor’s own words.',
          itemLabel: 'Answer',
          maxItems: 7,
          fields: [
            { type: 'text', id: 'answer', label: 'What the visitor says', default: '', maxLength: 48, required: true },
            { type: 'text', id: 'service', label: 'Appointment', help: 'The name of one of your appointments, or a word from it.', default: '', maxLength: 60, required: true },
            { type: 'text', id: 'why', label: 'Why this one', default: '', maxLength: 110 },
            { type: 'longText', id: 'covers', label: 'Topics (one per line, two or three words each)', default: '', maxLength: 120, rows: 3 },
          ],
          default: [
            { answer: 'I just started working for myself.', service: 'Self-Employed Tax Planning Discussion', why: 'Set good habits in your first year, before tax time.', covers: 'Records to keep\nSetting tax aside\nQuestions for your preparer' },
            { answer: 'My books are months behind.', service: 'Small Business Bookkeeping Consultation', why: 'See where things stand and agree a realistic way to catch up.', covers: 'Where they stand\nA monthly routine\nIs help worth it?' },
            { answer: 'I keep my own books.', service: 'Monthly Books Review', why: 'A second pair of eyes on one month, on your own laptop.', covers: 'Categories\nReconciliations\nYour saved-up questions' },
            { answer: 'I want my return prepared.', service: 'Tax Preparation Consultation', why: 'Talk it through first. A written quote follows only if you want one.', covers: 'Your situation\nRecords needed\nHow it would work' },
            { answer: 'It’s all in a shoebox.', service: 'Financial Records Organization Session', why: 'Leave with a simple system you’ll actually keep.', covers: 'Folders that make sense\nWhat to keep\nA monthly habit' },
            { answer: 'I’m not sure yet.', service: 'Introductory Consultation', why: 'Twenty free minutes. No documents, no figures.', covers: 'What’s going on\nWhich appointment\nWhat help could look like' },
          ],
        },
        {
          type: 'image',
          id: 'where.photo',
          label: 'Photo (portrait 4:5)',
          help: `Shown beside the answers on wide screens. Remove it for text only. ${SAMPLE_HELP}`,
          default: P('where-thought', 'A man in glasses and a linen shirt sits back at his desk, one hand at his glasses, thinking.'),
          aspectRatio: 4 / 5,
        },
      ],
    },
    {
      id: 'fees',
      label: 'Consultations & fees',
      description: 'The words around your appointments. Names, descriptions, lengths and fees are edited in Services — keep descriptions to a sentence or two.',
      fields: [
        { type: 'text', id: 'fees.title', label: 'Heading', help: EMPHASIS, default: 'Consultations *& fees.*', maxLength: 44, required: true },
        { type: 'text', id: 'fees.intro', label: 'Line under the heading', default: 'One conversation, one client, one clear fee.', maxLength: 90 },
        { type: 'text', id: 'fees.footnote', label: 'Small print', default: 'Paid at the office by card or check. Nothing is paid online; no deposits.', maxLength: 140 },
      ],
    },
    {
      id: 'scope',
      label: 'Consultation or engagement',
      description: 'What an appointment fee covers, and what is only ever quoted separately — two short lists over a wide photograph.',
      fields: [
        { type: 'text', id: 'scope.title', label: 'Heading', help: EMPHASIS, default: 'A consultation, *not a contract.*', maxLength: 56, required: true },
        { type: 'text', id: 'scope.leftTitle', label: 'Left list title', default: 'Your fee covers', maxLength: 32, required: true },
        { type: 'longText', id: 'scope.left', label: 'Left list', help: LINES, default: 'Your time at the desk\nPlain-English answers\nWritten next steps', maxLength: 200, rows: 4 },
        { type: 'text', id: 'scope.rightTitle', label: 'Right list title', default: 'Quoted separately, if you ask', maxLength: 40, required: true },
        { type: 'longText', id: 'scope.right', label: 'Right list', help: LINES, default: 'Return preparation & filing\nOngoing bookkeeping\nPayroll', maxLength: 200, rows: 4 },
        { type: 'text', id: 'scope.note', label: 'The line under both', default: 'Nothing ongoing starts without a written quote and your yes.', maxLength: 110 },
        {
          type: 'image',
          id: 'scope.photo',
          label: 'Background photo (wide)',
          help: `Wide (2:1), shown darkened behind the two lists. Remove it for a plain dark band. ${SAMPLE_HELP}`,
          default: { src: '/photos/light-wall-1440.webp', alt: LIGHT_WALL_ALT, width: 1440, height: 720 },
          aspectRatio: 2,
        },
      ],
    },
    {
      id: 'practice',
      label: 'The practice',
      description: 'Who you are and who you work with, in a few words.',
      fields: [
        { type: 'text', id: 'practice.title', label: 'Heading', help: EMPHASIS, default: 'One desk. *One client at a time.*', maxLength: 56, required: true },
        {
          type: 'longText',
          id: 'practice.text',
          label: 'A few sentences',
          help: 'In your own words. Add qualifications only if you hold them — the sample says none.',
          default: 'An independent practice above a print shop in the Crossroads. The door is closed, the pace is yours, and no question is too basic.',
          maxLength: 260,
          rows: 3,
        },
        { type: 'longText', id: 'practice.for', label: 'Who you work with', help: LINES, default: 'Freelancers\nSole proprietors\nSmall teams\nSide businesses', maxLength: 160, rows: 4 },
        { type: 'text', id: 'practice.not', label: 'Who is better served elsewhere', default: 'Legal disputes and investment advice are best taken to an attorney or licensed adviser.', maxLength: 140 },
        {
          type: 'image',
          id: 'practice.photo',
          label: 'Photo (wide)',
          help: `Wide (3:2). Your desk or office reads best. ${SAMPLE_HELP}`,
          default: L('practice-desk', 'Seen from behind, a man works at a wooden desk by a tall window, a brass lamp beside him.'),
          aspectRatio: 3 / 2,
        },
      ],
    },
    {
      id: 'expect',
      label: 'What to expect',
      description: 'Three steps from booking to afterwards, and what is never asked for online.',
      fields: [
        { type: 'text', id: 'expect.title', label: 'Heading', help: EMPHASIS, default: 'Three steps, *no surprises.*', maxLength: 56, required: true },
        {
          type: 'list',
          id: 'expect.steps',
          label: 'Steps',
          help: 'Up to four, in order. Keep each to a sentence.',
          itemLabel: 'Step',
          maxItems: 4,
          fields: [
            { type: 'text', id: 'title', label: 'Title', default: '', maxLength: 28, required: true },
            { type: 'text', id: 'text', label: 'Sentence', default: '', maxLength: 110 },
          ],
          default: [
            { title: 'Book online', text: 'Pick a time. A code from your email confirms it — no account.' },
            { title: 'Sit down together', text: 'Bring your questions. Show only what you choose to.' },
            { title: 'Decide what’s next', text: 'Leave with next steps. Any further help is quoted first.' },
          ],
        },
        { type: 'text', id: 'expect.neverTitle', label: 'Privacy heading', default: 'Never asked for online', maxLength: 40 },
        { type: 'longText', id: 'expect.never', label: 'Never asked for', help: LINES, default: 'Social Security or tax ID numbers\nBank or card details\nReturns or statements\nPasswords', maxLength: 200, rows: 4 },
        {
          type: 'text',
          id: 'expect.documents',
          label: 'If documents are needed',
          default: 'If we work together, documents move through a separate secure method agreed in writing — never this website or email.',
          maxLength: 170,
        },
        {
          type: 'image',
          id: 'expect.photo',
          label: 'Photo (wide)',
          help: `Wide (3:2). Remove it for text only. ${SAMPLE_HELP}`,
          default: L('expect-reading', 'A man reads a large folded sheet at a desk with a brass lamp, books and papers around him.'),
          aspectRatio: 3 / 2,
        },
      ],
    },
    {
      id: 'faq',
      label: 'Questions',
      description: 'Short answers and policies. Until you edit them they are labelled “Sample policies”.',
      fields: [
        { type: 'text', id: 'faq.title', label: 'Heading', help: EMPHASIS, default: 'Fair *questions.*', maxLength: 44, required: true },
        {
          type: 'list',
          id: 'faq.items',
          label: 'Questions',
          itemLabel: 'Question',
          maxItems: 10,
          fields: [
            { type: 'text', id: 'question', label: 'Question', default: '', maxLength: 90, required: true },
            { type: 'longText', id: 'answer', label: 'Answer', default: '', maxLength: 400, rows: 3 },
          ],
          default: [
            { question: 'Does a consultation include preparing my return?', answer: 'No. The fee covers the conversation. Preparation, filing and bookkeeping are quoted separately, only if you ask.' },
            { question: 'Can you tell me how much I’ll save?', answer: 'No one can honestly promise that. We explain how things work; outcomes depend on your situation.' },
            { question: 'What should I bring?', answer: 'Your questions. A laptop or a few sample papers if useful — nothing is handed over or kept.' },
            { question: 'Can I send documents beforehand?', answer: 'Please don’t. If we work together, a secure method is agreed in writing first.' },
            { question: 'Do you give legal or investment advice?', answer: 'No — those belong with an attorney or a licensed adviser.' },
            { question: 'Cancelling or paying?', answer: 'Please give 24 hours’ notice. Fees are paid at the office by card or check, never online.' },
          ],
        },
      ],
    },
    {
      id: 'book',
      label: 'Booking',
      description: 'The closing booking band and the top of the booking sheet.',
      fields: [
        { type: 'text', id: 'book.title', label: 'Heading', help: EMPHASIS, default: 'Put it on the *calendar.*', maxLength: 56, required: true },
        { type: 'text', id: 'book.intro', label: 'Line under the heading', default: 'A 6-digit code from your email confirms it. No account, nothing to pay online.', maxLength: 120 },
        {
          type: 'image',
          id: 'book.photo',
          label: 'Photo (wide)',
          help: `Wide (3:2), shown in the closing booking band. Remove it for text only. ${SAMPLE_HELP}`,
          default: L('book-still', 'Late sun falls across a plaster wall onto a wooden shelf with a small empty frame and a white cup.'),
          aspectRatio: 3 / 2,
        },
      ],
    },
    {
      id: 'visit',
      label: 'The office',
      description: 'Hours, address, phone and email come from your Business settings. Add how to find the office.',
      fields: [
        { type: 'text', id: 'visit.title', label: 'Heading', help: EMPHASIS, default: 'Find *the office.*', maxLength: 44, required: true },
        {
          type: 'longText',
          id: 'visit.note',
          label: 'Finding the office',
          default: 'Third floor above the print shop, Suite 302. Metered parking on Baltimore Avenue; the streetcar stops two blocks away.',
          maxLength: 240,
          rows: 3,
        },
        {
          type: 'image',
          id: 'visit.photo',
          label: 'Photo (portrait 4:5)',
          help: `Portrait (4:5). Your office reads best. ${SAMPLE_HELP}`,
          default: P('visit-room', 'A quiet room with white wainscot, a wooden desk with a brass lamp and a man resting in a chair beside it.'),
          aspectRatio: 4 / 5,
        },
      ],
    },
    {
      id: 'footer',
      label: 'Footer',
      fields: [{ type: 'text', id: 'footer.tagline', label: 'Line under the name', default: 'Bookkeeping & tax consultations, one client at a time.', maxLength: 90 }],
    },
    {
      id: 'seo',
      label: 'Search & sharing',
      description: 'Search engines and link previews show new text after the website is next deployed.',
      fields: [
        {
          type: 'text',
          id: 'seo.title',
          label: 'Page title',
          help: 'Search engines and link previews show new text after the website is next deployed.',
          default: 'Footing — bookkeeping & tax consultations in Kansas City',
          maxLength: 80,
          required: true,
        },
        {
          type: 'longText',
          id: 'seo.description',
          label: 'Page description',
          help: 'One or two sentences for search results. Updated after the next deploy.',
          default: 'Unhurried, one-to-one bookkeeping and tax consultations in Kansas City for freelancers and small businesses. Clear fees. Book online.',
          maxLength: 180,
          rows: 3,
          required: true,
        },
      ],
    },
  ],
});
