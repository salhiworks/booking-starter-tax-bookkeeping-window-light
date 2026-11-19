import { weekdayOf } from '@profitstudio/booking-engine';
import type { Business } from '@profitstudio/booking-engine';
import type { SiteValues } from '../lib/content';
import { weeklyRows } from '../lib/hours';
import type { OpeningInfo } from '../lib/useOpening';
import type { Resource } from '../lib/resource';
import { telHref } from '../lib/contact';
import { engine } from '../lib/engine';
import { Notice } from './Notice';
import { SectionLabel } from './SectionLabel';
import { Photo } from './Photo';
import { Emphasis } from './Emphasis';

/** The Live Demo and preview mode show a fictional practice: say so next to its details. */
const SAMPLE_BUSINESS = __BOOKING_DEMO__ || engine.mode === 'preview';

interface VisitProps {
  values: SiteValues;
  ownerFields: string[];
  business: Resource<Business>;
  opening: OpeningInfo;
  onRetry: () => void;
}

export function Visit({ values, ownerFields, business, opening, onRetry }: VisitProps) {
  const photo = values['visit.photo'];
  return (
    <section id="visit" className={`visit section${photo ? '' : ' visit--text'}`} aria-labelledby="visit-title">
      <div className="shell">
        <SectionLabel n="07">The office</SectionLabel>
        <div className="visit__layout">
          {photo && (
            <figure className="visit__photo" data-reveal="">
              <Photo image={photo} sizes="(min-width: 1080px) 26vw, (min-width: 640px) 50vw, 92vw" />
              {!ownerFields.includes('visit.photo') && <figcaption className="photo-label">Sample photo</figcaption>}
            </figure>
          )}
          <div className="visit__inner">
            <header className="visit__head">
              <h2 id="visit-title" className="section-title" data-reveal="">
                <Emphasis text={values['visit.title']} />
              </h2>
              {SAMPLE_BUSINESS && (
                <p className="sample-note">
                  <span className="tag">Sample</span>
                  {__BOOKING_DEMO__ ? 'This demo shows a fictional practice' : 'Preview shows a fictional practice'} — its address, phone and email are
                  examples.
                </p>
              )}
            </header>
            <div className="visit__grid">
              <BusinessColumns business={business} opening={opening} onRetry={onRetry} />
              {values['visit.note'] && (
                <div className="visit__col">
                  <h3>Finding it</h3>
                  <p className="prewrap">{values['visit.note']}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BusinessColumns({ business, opening, onRetry }: Omit<VisitProps, 'values' | 'ownerFields'>) {
  if (business.status === 'loading') {
    return (
      <>
        <div className="visit__col" aria-busy="true">
          <h3>Office hours</h3>
          <span className="skeleton skeleton--row" />
          <span className="skeleton skeleton--row" />
        </div>
        <div className="visit__col" aria-busy="true">
          <h3>Find us</h3>
          <span className="skeleton skeleton--row" />
        </div>
      </>
    );
  }
  if (business.status === 'error') {
    if (business.error.code === 'NOT_CONFIGURED') {
      return (
        <div className="visit__col">
          <h3>Office hours</h3>
          <p className="quiet-state">Office hours and contact details will be listed here soon.</p>
        </div>
      );
    }
    return (
      <div className="visit__col">
        <Notice tone="error" action={{ label: 'Try again', onClick: onRetry }}>
          <p>We couldn't load the hours just now.</p>
        </Notice>
      </div>
    );
  }

  const b = business.data;
  const rows = weeklyRows(b.openingHours, b.locale);
  const todayWeekday = opening.today ? weekdayOf(opening.today) : null;
  const { address, phone, email } = b.contact;
  return (
    <>
      <div className="visit__col">
        <h3>Office hours</h3>
        {opening.status && (
          <p className="open-status" data-open={opening.status.open}>
            <span className="open-status__dot" aria-hidden="true" />
            {opening.status.text}
          </p>
        )}
        <dl className="hours">
          {rows.map((row) => {
            const isToday = todayWeekday !== null && row.weekdays.includes(todayWeekday);
            return (
              <div className={`hours__row ${isToday ? 'hours__row--today' : ''}`} key={row.label}>
                <dt>
                  {row.label}
                  {isToday && <span className="sr-only"> (today)</span>}
                </dt>
                <dd>{row.hours}</dd>
              </div>
            );
          })}
        </dl>
        {opening.changes.length > 0 && (
          <div className="hours-changes">
            <h4>Changes in the next two weeks</h4>
            <ul role="list">
              {opening.changes.map((change) => (
                <li key={change.date}>
                  <span>{change.label}</span> <span>{change.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="visit__col">
        <h3>Address</h3>
        <address className="contact">
          <span className="contact__name">{b.name}</span>
          {address && <span className="prewrap">{address}</span>}
          {phone && (
            <a href={telHref(phone)}>
              <span className="sr-only">Phone: </span>
              {phone}
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`}>
              <span className="sr-only">Email: </span>
              {email}
            </a>
          )}
        </address>
        {address && (
          <a
            className="link-button contact__directions"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Get directions<span className="sr-only"> (opens a map in a new tab)</span>
          </a>
        )}
      </div>
    </>
  );
}
