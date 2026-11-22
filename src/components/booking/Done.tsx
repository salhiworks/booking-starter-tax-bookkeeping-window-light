import type { RefObject } from 'react';
import { roleOf } from '../../lib/services';
import { formatClockTime, formatDate, timeZoneLabel } from '@profitstudio/booking-engine';
import type { BookingConfirmation, Business, Service } from '@profitstudio/booking-engine';
import { ContactInstead } from './ContactInstead';
import { INACTIVE_TITLE, answerOf, inactiveNext } from '../../lib/bookingStatus';

export type Outcome =
  | { kind: 'booked'; confirmation: BookingConfirmation; email: string }
  | { kind: 'preview' }
  | { kind: 'limit' };

interface DoneProps {
  outcome: Outcome;
  business: Business;
  /** The service as listed when it was booked (for where it happens), or null. */
  service?: Service | null;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onAgain: () => void;
}

/** Shown only after verifyBooking answered ok: true — or, honestly, after PREVIEW_MODE. */
export function Done({ outcome, business, service = null, headingRef, onAgain }: DoneProps) {
  if (outcome.kind === 'preview') {
    return (
      <div className="done done--preview">
        <h2 className="step-title" tabIndex={-1} ref={headingRef} data-step-heading="">
          Preview — nothing was saved
        </h2>
        <p>
          This site is running on sample data, so no email was sent and no appointment was stored. Once the practice's booking system is
          connected, clients see their confirmation here.
        </p>
        <button type="button" className="button button--quiet" onClick={onAgain}>
          Start again
        </button>
      </div>
    );
  }

  if (outcome.kind === 'limit') {
    return (
      <div className="done">
        <h2 className="step-title" tabIndex={-1} ref={headingRef} data-step-heading="">
          You already have appointments booked with us
        </h2>
        <ContactInstead
          business={business}
          title="Let's find a time together"
          text="This email address already has as many upcoming appointments as we can hold online, so we couldn't add another and the time was released. Call or email the office and we'll gladly help."
        />
      </div>
    );
  }

  const { confirmation, email } = outcome;
  // Only 'confirmed' is booked and only 'pending' is a request; the flow never brings anything else here.
  const answer = answerOf(confirmation);
  if (answer === 'inactive') {
    return (
      <div className="done">
        <h2 className="step-title" tabIndex={-1} ref={headingRef} data-step-heading="">
          {INACTIVE_TITLE}
        </h2>
        <ContactInstead business={business} title="Contact us" text={inactiveNext(confirmation.reference)} />
        <button type="button" className="button button--quiet" onClick={onAgain}>
          Choose a new time
        </button>
      </div>
    );
  }
  const pending = answer === 'pending';
  const { locale } = business;
  return (
    <div className="done">
      <p className="done__mark" aria-hidden="true" />
      <h2 className="step-title" tabIndex={-1} ref={headingRef} data-step-heading="">
        {pending ? 'Request received — we’ll check the calendar and confirm the time shortly.' : 'Your appointment is booked.'}
      </h2>
      <p>
        {__BOOKING_DEMO__ ? (
          // Live Demo build only: no email exists to promise.
          <>
            This is a demo, so no email is sent.{' '}
            {pending ? 'Your request is waiting in the demo dashboard — confirm it there as the consultant.' : 'Your appointment is in the demo dashboard.'}{' '}
            <a href="/admin/#bookings">Open the demo dashboard</a>
          </>
        ) : pending ? (
          `We're holding the time for you while the consultant reviews your request. We'll email ${email} as soon as it's confirmed.`
        ) : (
          `A confirmation is on its way to ${email}.`
        )}
      </p>
      <p className="done__note">{doneNote(confirmation.serviceName, pending, service && service.name === confirmation.serviceName ? service : null)}</p>
      <dl className="done__details">
        <div>
          <dt>Appointment</dt>
          <dd>{confirmation.serviceName}</dd>
        </div>
        <div>
          <dt>Date</dt>
          <dd>{formatDate(confirmation.date, locale, { weekday: 'long', month: 'long', day: 'numeric' })}</dd>
        </div>
        <div>
          <dt>Time</dt>
          <dd>
            {formatClockTime(confirmation.time, locale)}{' '}
            <span className="summary__zone">{timeZoneLabel(confirmation.timezone, locale)}</span>
          </dd>
        </div>
        <div>
          <dt>Reference</dt>
          <dd className="done__reference">{confirmation.reference}</dd>
        </div>
      </dl>
      <button type="button" className="button button--quiet" onClick={onAgain}>
        Book another appointment
      </button>
    </div>
  );
}

/**
 * What this booking is: always ONE appointment at the desk — one consultant, one client — at the office.
 * Nothing is paid online. The note gives practical preparation only: it never promises an outcome, and
 * it never asks the client to send numbers or documents.
 */
function doneNote(serviceName: string, pending: boolean, _service: Service | null): string {
  const role = roleOf({ name: serviceName });
  const until = pending ? 'Until it’s confirmed, this is a request — not a confirmed time. ' : '';
  const prep =
    role === 'intro'
      ? 'Come with a few words about what’s going on — no documents or figures needed. '
      : 'Bring your questions, written down. If it helps, bring your laptop or a few sample papers — nothing has to be handed over, and please don’t email documents ahead. ';
  return `${until}${prep}Nothing is paid online: the fee covers this appointment only and is paid at the office.`;
}
