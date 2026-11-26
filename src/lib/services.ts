import { formatMoney } from '@profitstudio/booking-engine';
import type { Service } from '@profitstudio/booking-engine';

/**
 * The practice's appointments. The engine (2.0.0) has no service categories and no per-service
 * metadata, and a service's id is a database UUID this site cannot know when it is built — so everything
 * is read from the service's own engine data:
 *
 *   1. its KIND (intro · books · review · tax · planning · records), from its NAME, else its
 *      description, else "other" — it groups the booking sheet, labels each appointment on the fee
 *      schedule and lets "Where do things stand?" point at an appointment by kind;
 *   2. who it is GOOD FOR: the part after "Good for:" in the description;
 *   3. its LENGTH: the time at the desk; its PRICE: the fee for THAT appointment, paid at the office —
 *      never online, and never the price of bookkeeping, tax preparation or filing (those are separate
 *      engagements, quoted in writing only if the client asks).
 *
 * The site never invents an appointment: an owner who renames, removes or adds services sees exactly
 * the engine's list. Stable categories need an engine version — see docs/ENGINE-PROPOSAL-tax-bookkeeping.md
 * in the Niche Pack workspace.
 */
export type SessionKind = 'intro' | 'books' | 'review' | 'tax' | 'planning' | 'records' | 'other';

/** Checked in this order: "Self-Employed Tax Planning" is planning before "tax" means a tax appointment. */
const KINDS: { id: Exclude<SessionKind, 'other'>; test: RegExp }[] = [
  { id: 'intro', test: /\b(intro\w*|discovery|first (call|chat|conversation|meeting)|get acquainted|hello)\b/i },
  { id: 'planning', test: /\b(plann\w*|self[- ]employed|freelanc\w*|estimated|year ahead)\b/i },
  { id: 'review', test: /\b(review\w*|check[- ]?in|second look|health check)\b/i },
  { id: 'records', test: /\b(records?|organi[sz]\w*|paperwork|receipts?|filing system|declutter)\b/i },
  { id: 'tax', test: /\b(tax\w*|returns?|filing)\b/i },
  { id: 'books', test: /\b(bookkeep\w*|books|ledger|accounts?|payroll|setup|set[- ]up)\b/i },
];

export const KIND_LABEL: Record<SessionKind, string> = {
  intro: 'To begin',
  books: 'Bookkeeping',
  review: 'Review',
  tax: 'Tax',
  planning: 'Planning',
  records: 'Records',
  other: 'Appointment',
};

const norm = (s: string | null | undefined) => (s ?? '').trim().replace(/\s+/g, ' ');

function kindFromText(text: string): SessionKind | null {
  for (const k of KINDS) if (k.test.test(text)) return k.id;
  return null;
}

/** "Monthly Books Review" → review; "Tax Preparation Consultation" → tax; "Gift Chat" → other. */
export function kindOf(service: Pick<Service, 'name' | 'description'>): SessionKind {
  return kindFromText(service.name) ?? kindFromText(lead(service.description)) ?? 'other';
}

/**
 * The name the page sets large: without the words every appointment shares ("Tax Preparation
 * Consultation" → "Tax Preparation"; "Monthly Books Review" stays whole). The full name stays in the
 * booking sheet, the summary and every email. A name that is nothing but shared words stays whole.
 */
export function shortName(name: string): string {
  const stripped = norm(
    name
      .replace(/\b(consultation|appointment|booking|session|discussion)\b/gi, ' ')
      .replace(/\s*[—–\-·:|/(),&]+\s*$/g, '')
      .replace(/^\s*[—–\-·:|/(),&]+\s*/g, ''),
  );
  return stripped.length >= 3 ? stripped : norm(name);
}

/** For the booking sheet: the introductory conversation first, then the appointments. */
export interface Kind {
  id: 'start' | 'sessions' | 'next';
  label: string;
  services: Service[];
}

export function kinds(services: readonly Service[]): Kind[] {
  const list = indexOrder(services);
  const intro = list.filter((s) => kindOf(s) === 'intro');
  const rest = list.filter((s) => kindOf(s) !== 'intro');
  const groups: Kind[] = [];
  if (intro.length) groups.push({ id: 'start', label: 'Not sure yet?', services: intro });
  if (rest.length) groups.push({ id: 'sessions', label: 'Consultations', services: rest });
  return groups;
}

/** The services in page order: the owner's order, with the introductory conversation first. */
export function indexOrder(services: readonly Service[]): Service[] {
  const rank = (s: Service) => (kindOf(s) === 'intro' ? 0 : 1);
  return services.map((s, i) => ({ s, i })).sort((a, b) => rank(a.s) - rank(b.s) || a.i - b.i).map((x) => x.s);
}

/** The first service of a kind, in page order. */
export function firstOfKind(services: readonly Service[], kind: SessionKind): Service | null {
  return indexOrder(services).find((s) => kindOf(s) === kind) ?? null;
}

/** Lower-case words, accents and punctuation dropped: "Self-Employed Tax" → "self employed tax". */
const words = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

/**
 * The appointment the owner's words point at ("Monthly Books Review", or just "Review"): 1. a service
 * with exactly that name; 2. a service whose name contains those words, from the start of a word; 3. the
 * first service of the kind those words name. Null when nothing matches — no Book button then.
 */
export function serviceFor(services: readonly Service[], sessionWords: string): Service | null {
  const want = words(sessionWords);
  if (!want) return null;
  const list = indexOrder(services);
  const exact = list.find((s) => words(s.name) === want);
  if (exact) return exact;
  const startOfWord = new RegExp(`(^| )${want.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}( |$)`);
  const partial = list.find((s) => startOfWord.test(words(s.name)));
  if (partial) return partial;
  const kind = kindFromText(sessionWords);
  return kind ? firstOfKind(list, kind) : null;
}

export interface Described {
  lead: string;
  /** "A new business…" — the part after "Good for:", or null. */
  goodFor: string | null;
}

const GOOD_FOR = /(?:^|[\s.])(?:good for|best for|ideal for)\s*:\s*/i;

function lead(description: string | null | undefined): string {
  return splitDescription(description).lead;
}

/** "…next steps. Good for: a new business" → { lead: "…next steps.", goodFor: "A new business" }. */
export function splitDescription(description: string | null | undefined): Described {
  const text = (description ?? '').trim();
  const m = GOOD_FOR.exec(text);
  if (!m) return { lead: text, goodFor: null };
  const raw = text.slice(m.index + m[0].length).trim().replace(/\.$/, '');
  return {
    lead: text.slice(0, m.index + (m[0].startsWith('.') ? 1 : 0)).trim(),
    goodFor: raw ? raw[0].toUpperCase() + raw.slice(1) : null,
  };
}

/** Kept for the shared booking flow: every appointment is at the office, so there is no format to show. */
export function formatOf(_service: Pick<Service, 'description'>): { kind: 'studio'; label: string } | null {
  return null;
}

/** The booking sheet shows the appointment's full name. */
export function splitName(name: string): { base: string; size: string | null } {
  return { base: name, size: null };
}

export type Role = SessionKind;
export function roleOf(service: Pick<Service, 'name'>): Role {
  return kindOf({ name: service.name, description: null });
}

/** "45 min", "1 h 30 min", "2 h" — the appointment's length, straight from the engine. */
export function durationLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

/** "20 min", "60 min", "90 min", then "2 h". */
export function minutesLabel(minutes: number): string {
  return minutes <= 90 ? `${minutes} min` : durationLabel(minutes);
}

/** The same, for screen readers. */
export function durationSpoken(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${minutes} minutes`;
  const hours = `${h} hour${h > 1 ? 's' : ''}`;
  return m ? `${hours} ${m} minutes` : hours;
}

/** What the booking's LENGTH means: the time at the desk with the consultant. */
export interface TimeTerms {
  role: Role;
  label: string;
  note: string | null;
}

export function timeTerms(service: Pick<Service, 'name' | 'description'>): TimeTerms {
  const role = kindOf(service);
  if (role === 'intro') return { role, label: 'At the desk', note: 'A conversation — no documents, no figures' };
  return { role, label: 'At the desk', note: null };
}

type PriceInput = Pick<Service, 'priceCents' | 'priceFrom' | 'currency' | 'name' | 'description'>;

/** Whole dollars print without ".00" — "$150", not "$150.00". */
const money = (cents: number, currency: string, locale: string) => formatMoney(cents, currency, locale).replace(/([.,])00(?!\d)/, '');

/**
 * What the engine's price MEANS here — the fee for THIS appointment, paid at the office:
 *   free    → no charge (the introductory conversation)
 *   from    → a starting fee (the owner's choice; the fee is agreed before the appointment starts)
 *   fixed   → the appointment fee
 *   request → no fee shown: ask the practice
 * Never the price of ongoing bookkeeping, a prepared return or filing.
 */
export interface PriceTerms {
  kind: 'free' | 'from' | 'fixed' | 'request';
  label: string;
  amount: string;
  note: string | null;
}

export function priceTerms(service: PriceInput, locale: string): PriceTerms {
  if (service.priceCents === null) return { kind: 'request', label: 'Fee', amount: 'Ask us', note: null };
  if (service.priceCents === 0) return { kind: 'free', label: 'Fee', amount: 'Free', note: 'No charge' };
  const amount = money(service.priceCents, service.currency, locale);
  if (service.priceFrom) return { kind: 'from', label: 'Fee from', amount, note: 'The fee is agreed with you before we start' };
  return { kind: 'fixed', label: 'Fee', amount, note: null };
}

/** One line: "$150", "from $90", "Free", "Ask us". */
export function priceLabel(service: PriceInput, locale: string): string {
  const t = priceTerms(service, locale);
  if (t.kind === 'from') return `from ${t.amount}`;
  return t.amount;
}

/** The lowest priced service in a list, or null. */
export function cheapest(services: readonly Service[]): Service | null {
  const priced = services.filter((s) => s.priceCents !== null && s.priceCents > 0);
  priced.sort((a, b) => (a.priceCents ?? 0) - (b.priceCents ?? 0));
  return priced[0] ?? null;
}
