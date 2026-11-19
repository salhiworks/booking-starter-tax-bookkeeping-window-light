import type { Business, Service } from '@profitstudio/booking-engine';
import type { StartBooking } from '../../App';
import type { SiteValues } from '../../lib/content';
import { engine } from '../../lib/engine';
import type { Resource } from '../../lib/resource';
import { Emphasis } from '../Emphasis';
import { bookLink } from '../../lib/bookLink';
import { Notice } from '../Notice';
import { ContactInstead } from './ContactInstead';
import { SectionLabel } from '../SectionLabel';
import { Photo } from '../Photo';

interface BookingSectionProps {
  values: SiteValues;
  ownerFields?: string[];
  business: Resource<Business>;
  services: Resource<Service[]>;
  onRetry: () => void;
  onBook: StartBooking;
}

/**
 * #book on the page: how booking works and the button that opens the booking
 * sheet — or, while online booking is not possible, why, with the office's
 * contact details. Every Book button lands here in that case.
 */
export function BookingSection({ values, ownerFields = [], business, services, onRetry, onBook }: BookingSectionProps) {
  const photo = values['book.photo'];
  return (
    <section id="book" className={`book section${photo ? '' : ' book--text'}`} aria-labelledby="book-title">
      <div className="shell">
        <SectionLabel n="06">Book</SectionLabel>
        <div className="book__stage">
          {photo && (
            <figure className="book__photo" data-reveal="">
              <Photo image={photo} sizes="(min-width: 960px) min(100vw, 104rem), 100vw" />
              {!ownerFields.includes('book.photo') && <span className="photo-label">Sample photo</span>}
            </figure>
          )}
          <div className="book__card">
            <header className="book__head">
              <h2 id="book-title" className="section-title book__title" data-reveal="">
                <Emphasis text={values['book.title']} />
              </h2>
              {values['book.intro'] && <p className="book__intro">{values['book.intro']}</p>}
            </header>
            <div className="book__body">
              <BookingBody business={business} services={services} onRetry={onRetry} onBook={onBook} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BookingBody({ business, services, onRetry, onBook }: Omit<BookingSectionProps, 'values'>) {
  const notConfigured =
    engine.mode === 'unconfigured' ||
    (business.status === 'error' && business.error.code === 'NOT_CONFIGURED') ||
    (services.status === 'error' && services.error.code === 'NOT_CONFIGURED');
  if (notConfigured) {
    return (
      <ContactInstead
        business={business.status === 'ready' ? business.data : null}
        title="Online booking is not available yet"
        text="We're setting up online booking. In the meantime, please call or email the office to book an appointment."
      />
    );
  }

  if (business.status === 'loading' || services.status === 'loading') {
    return (
      <div className="book__loading" aria-busy="true">
        <p className="sr-only" role="status">
          Loading…
        </p>
        <span className="skeleton skeleton--row" aria-hidden="true" />
        <span className="skeleton skeleton--row" aria-hidden="true" />
        <span className="skeleton skeleton--row" aria-hidden="true" />
      </div>
    );
  }

  const failed = business.status === 'error' ? business.error : services.status === 'error' ? services.error : null;
  if (failed) {
    if (failed.code === 'SCHEMA_MISSING' || failed.code === 'SCHEMA_INCOMPATIBLE') {
      return (
        <ContactInstead
          business={business.status === 'ready' ? business.data : null}
          title="Online booking is temporarily unavailable"
          text="Please call or email the office and we'll find you a time."
        />
      );
    }
    return (
      <Notice tone="error" action={{ label: 'Try again', onClick: onRetry }}>
        <p>{failed.code === 'NETWORK' ? "We couldn't reach the booking system. Please check your connection." : "We couldn't load the booking calendar just now."}</p>
      </Notice>
    );
  }

  if (business.status !== 'ready' || services.status !== 'ready') return null;

  if (!business.data.policies.onlineBookingEnabled) {
    return (
      <ContactInstead
        business={business.data}
        title="Book by phone or email for now"
        text="Online booking is switched off at the moment. Call or email the office and we'll find you a time."
      />
    );
  }

  if (services.data.length === 0) {
    return (
      <ContactInstead
        business={business.data}
        title="Online booking opens soon"
        text="Appointments aren't listed online yet. Call or email the office and we'll find you a time."
      />
    );
  }

  return (
    <div className="book__how">
      <ol className="book__steps">
        <li>
          <span className="book__n" aria-hidden="true">1</span>
          <span className="book__step">Choose an appointment</span>
          <span className="book__text">The free introduction or a consultation — each with its real length and fee, paid at the office.</span>
        </li>
        <li>
          <span className="book__n" aria-hidden="true">2</span>
          <span className="book__step">Pick a time</span>
          <span className="book__text">Only times the consultant is really free are shown, in the office’s local time.</span>
        </li>
        <li>
          <span className="book__n" aria-hidden="true">3</span>
          {business.data.policies.autoConfirm ? (
            <>
              <span className="book__step">Confirm it’s you</span>
              <span className="book__text">
                {__BOOKING_DEMO__
                  ? 'In this demo no email is sent: any 6 digits confirm it.'
                  : 'We email you a 6-digit code — no account, no password.'}
              </span>
            </>
          ) : (
            <>
              {/* The consultant confirms each booking: the last step sends a request, and says so. */}
              <span className="book__step">Send your request</span>
              <span className="book__text">
                {__BOOKING_DEMO__
                  ? 'In this demo no email is sent: any 6 digits send it, and you confirm it yourself in the dashboard.'
                  : 'A 6-digit email code sends it — no account needed. The consultant reads your request and confirms by email.'}
              </span>
            </>
          )}
        </li>
      </ol>
      <a className="btn btn--primary btn--large" href="#book" onClick={bookLink(onBook)}>
        Choose an appointment
        <span className="btn__arrow" aria-hidden="true">
          →
        </span>
      </a>
    </div>
  );
}
