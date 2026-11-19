import type { Business, Service } from '@profitstudio/booking-engine';
import type { StartBooking } from '../App';
import { bookLink } from '../lib/bookLink';
import type { SiteValues } from '../lib/content';
import type { Resource } from '../lib/resource';
import { KIND_LABEL, durationSpoken, indexOrder, kindOf, minutesLabel, priceTerms, splitDescription } from '../lib/services';
import { Emphasis } from './Emphasis';
import { Notice } from './Notice';
import { SectionLabel } from './SectionLabel';

const lines = (text: string) =>
  text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

interface ServicesProps {
  values: SiteValues;
  ownerFields: string[];
  services: Resource<Service[]>;
  business: Business | null;
  onRetry: () => void;
  onBook: StartBooking;
}

/**
 * Consultations & fees — one card per engine service, in page order: the fee large, the kind, the
 * name, the description's first part (its "Good for" stays in the booking sheet), the time at the desk
 * and Book. The free introduction is the dark card that starts the row. Under the cards, on a dark band
 * over the wide photograph, the line between a consultation and an engagement: what the fee covers ·
 * what is quoted separately, only if asked. Every figure is live from the engine.
 */
export function Services({ values, ownerFields, services, business, onRetry, onBook }: ServicesProps) {
  const locale = business?.locale ?? 'en-US';
  const left = lines(values['scope.left']);
  const right = lines(values['scope.right']);
  const photo = values['scope.photo'];
  return (
    <section className="fees section" id="fees" aria-labelledby="fees-title">
      <div className="shell">
        <header className="fees__head">
          <div>
            <SectionLabel n="02">Consultations &amp; fees</SectionLabel>
            <h2 id="fees-title" className="section-title" data-reveal="">
              <Emphasis text={values['fees.title']} />
            </h2>
          </div>
          {values['fees.intro'] && <p className="section-intro">{values['fees.intro']}</p>}
        </header>

        {services.status === 'loading' && (
          <div className="cards cards--loading" aria-busy="true">
            <p className="sr-only" role="status">
              Loading appointments…
            </p>
            <span className="skeleton skeleton--block" aria-hidden="true" />
            <span className="skeleton skeleton--block" aria-hidden="true" />
            <span className="skeleton skeleton--block" aria-hidden="true" />
          </div>
        )}
        {services.status === 'error' && services.error.code !== 'NOT_CONFIGURED' && (
          <Notice tone="error" action={{ label: 'Try again', onClick: onRetry }}>
            <p>We couldn’t load the appointments just now.</p>
          </Notice>
        )}
        {services.status === 'ready' && services.data.length > 0 && (
          <ul className="cards" role="list">
            {indexOrder(services.data).map((s) => {
              const kind = kindOf(s);
              const price = priceTerms(s, locale);
              return (
                <li className={`card${kind === 'intro' ? ' card--start' : ''}`} key={s.id} data-reveal="">
                  <a className="card__link" href="#book" onClick={bookLink(onBook, s.id)}>
                    <span className="card__shaft" aria-hidden="true" />
                    <span className="card__top">
                      <span className="card__kind">{kind === 'intro' ? 'Start here' : KIND_LABEL[kind]}</span>
                      <span className="card__fee">
                        {price.kind === 'from' && <span className="card__from">from </span>}
                        {price.amount}
                      </span>
                    </span>
                    <span className="card__name">{s.name}</span>
                    {s.description && <span className="card__text">{splitDescription(s.description).lead}</span>}
                    <span className="card__foot">
                      <span className="card__time">
                        <span aria-hidden="true">{minutesLabel(s.durationMinutes)}</span>
                        <span className="sr-only">{durationSpoken(s.durationMinutes)} at the desk</span>
                      </span>
                      <span className="card__book">
                        Book<span className="sr-only"> {s.name}</span> <span aria-hidden="true">→</span>
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
        {values['fees.footnote'] && <p className="fees__foot">{values['fees.footnote']}</p>}
      </div>

      <div className={`scope${photo ? ' scope--photo' : ''}`} id="scope" aria-labelledby="scope-title">
        {photo && (
          <div className="scope__bg" aria-hidden="true">
            <img src={photo.src} alt="" width={photo.width ?? 1440} height={photo.height ?? 720} loading="lazy" decoding="async" />
            {!ownerFields.includes('scope.photo') && <span className="photo-label">Sample photo</span>}
          </div>
        )}
        <div className="shell scope__inner">
          <h2 id="scope-title" className="scope__title" data-reveal="">
            <Emphasis text={values['scope.title']} />
          </h2>
          <div className="scope__cols" data-reveal="">
            <div className="scope__col">
              <h3>{values['scope.leftTitle']}</h3>
              <ul role="list" className="scope__list scope__list--yes">
                {left.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
            <div className="scope__col">
              <h3>{values['scope.rightTitle']}</h3>
              <ul role="list" className="scope__list scope__list--quoted">
                {right.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          </div>
          {values['scope.note'] && <p className="scope__note">{values['scope.note']}</p>}
        </div>
      </div>
    </section>
  );
}
