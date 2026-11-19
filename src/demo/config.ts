import type { DemoConfig } from './engine';
import { sitePreset } from '../lib/preset';

/**
 * The public Live Demo's sample business (`npm run dev:demo` / `npm run build:demo`).
 * Only demo builds read this file. Customizing the real website? Leave src/demo/ alone.
 * Sample notes are ordinary scheduling notes — never tax numbers, account details or figures.
 */
export const demoConfig: DemoConfig = {
  id: 'tax-bookkeeping-window-light',
  preset: sitePreset,
  business: {
    name: 'Footing Bookkeeping & Tax',
    timezone: 'America/Chicago',
    email: 'hello@footing-books.example',
    phone: '+1 816-555-0142',
    address: '1814 Baltimore Avenue, Suite 302 (third floor), Kansas City, MO 64108',
  },
  ownerEmail: 'owner@footing-books.example',
  referencePrefix: 'FT',
  sampleNotes: [
    'First year freelancing as a photographer — not sure what to keep track of.',
    'Small bakery, two years open. I keep the books myself and fell behind in spring.',
    'I’ll bring my laptop with the bookkeeping software open.',
  ],
  // The site caches published content under this key (createSiteContentStore's default).
  resetKeys: ['pbe-site-content'],
  customers: [
    { name: 'Renata Alvarez', email: 'renata.alvarez@example.com', phone: '+1 816 555 0112' },
    { name: 'Owen Fairbanks', email: 'owen.fairbanks@example.com', phone: '+1 816 555 0126' },
    { name: 'Mei Lin Zhao', email: 'meilin.zhao@example.com', phone: '+1 816 555 0133' },
    { name: 'DeShawn Price', email: 'deshawn.price@example.com', phone: '+1 816 555 0148' },
    { name: 'Clara Novak', email: 'clara.novak@example.com', phone: '+1 816 555 0150' },
    { name: 'Tomás Herrera', email: 'tomas.herrera@example.com', phone: '+1 816 555 0161' },
    { name: 'Abigail Stone', email: 'abigail.stone@example.com', phone: '+1 816 555 0174' },
    { name: 'Farid Rahimi', email: 'farid.rahimi@example.com', phone: '+1 816 555 0187' },
    { name: 'Molly Brennan', email: 'molly.brennan@example.com', phone: '+1 816 555 0195' },
    { name: 'Ike Okafor', email: 'ike.okafor@example.com', phone: '+1 816 555 0109' },
  ],
};
