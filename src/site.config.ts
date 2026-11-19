/**
 * This website's identity — the ONE place for its name, time zone and the
 * placeholder contact details shown in preview mode (`npm run dev` without
 * Supabase). Everything the owner manages (appointments, fees, hours, real
 * contact details, text and photos) lives in the dashboard at /admin/.
 */
export const SITE = {
  /** The business name. The dashboard's Business page overrides it once connected. */
  name: 'Footing Bookkeeping & Tax',
  /** IANA time zone of the business. */
  timezone: 'America/Chicago',
  /** Fictional contact details for preview mode only. */
  previewContact: {
    email: 'hello@footing-books.example',
    phone: '+1 816-555-0142',
    address: '1814 Baltimore Avenue, Suite 302 (third floor), Kansas City, MO 64108',
  },
};
