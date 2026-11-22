import { useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { Business, Service } from '@profitstudio/booking-engine';
import type { StartBooking } from '../App';
import { bookLink } from '../lib/bookLink';
import type { SiteValues } from '../lib/content';
import type { Resource } from '../lib/resource';
import { KIND_LABEL, durationSpoken, kindOf, minutesLabel, priceTerms, serviceFor } from '../lib/services';
import { Emphasis } from './Emphasis';
import { Photo } from './Photo';
import { SectionLabel } from './SectionLabel';

interface WhereProps {
  values: SiteValues;
  ownerFields: string[];
  services: Resource<Service[]>;
  business: Business | null;
  onBook: StartBooking;
}

/** The answer's words as a booking-note line, so the consultant knows where to start. */
const whereNote = (answer: string) => `Where things stand: “${answer.trim()}”`;

/**
 * "Where do things stand?" — the visitor's own words as a set of large pills (a tab list: arrow keys,
 * Home, End); choosing one lights it. Beside them, on a dark card crossed by a shaft of light, the
 * appointment that answers it (`serviceFor`: the owner names it)
 * with its LIVE length and fee, why, what you'd go through, and Book — which writes the visitor's line
 * into the booking note. Once the services are loaded, an answer whose appointment isn't offered
 * (renamed or removed in the dashboard) is left out — never shown under a name that no longer exists —
 * and without any, the section is hidden. Nothing here promises an outcome.
 */
export function Where({ values, ownerFields, services, business, onBook }: WhereProps) {
  const list = services.status === 'ready' ? services.data : [];
  const answers =
    services.status === 'ready' ? values['where.answers'].filter((a) => serviceFor(list, a.service) !== null) : values['where.answers'];
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const photo = values['where.photo'];
  if (answers.length === 0) return null;
  const index = Math.min(active, answers.length - 1);
  const item = answers[index];
  const service = serviceFor(list, item.service);
  const locale = business?.locale ?? 'en-US';
  const covers = item.covers
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = answers.length - 1;
    const moves: Record<string, number> = {
      ArrowDown: index === last ? 0 : index + 1,
      ArrowRight: index === last ? 0 : index + 1,
      ArrowUp: index === 0 ? last : index - 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    if (!(e.key in moves)) return;
    e.preventDefault();
    const next = moves[e.key];
    setActive(next);
    tabs.current[next]?.focus();
  };

  // On narrow screens the suggestion sits under the list: bring its top into view when it is below the fold.
  const revealMatch = () =>
    requestAnimationFrame(() => {
      const panel = document.getElementById(`${id}-panel`);
      if (!panel || window.matchMedia('(min-width: 960px)').matches) return;
      const top = panel.getBoundingClientRect().top;
      if (top > window.innerHeight * 0.7) {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        panel.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
      }
    });

  const price = service ? priceTerms(service, locale) : null;
  return (
    <section className={`where section${photo ? ' where--photo' : ''}`} id="where" aria-labelledby="where-title">
      <div className="shell where__grid">
        {photo && (
          <figure className="where__photo" data-reveal="">
            <Photo image={photo} sizes="(min-width: 1200px) 22vw, 40vw" />
            {!ownerFields.includes('where.photo') && <figcaption className="photo-label">Sample photo</figcaption>}
          </figure>
        )}
        <div className="where__ask">
          <SectionLabel n="01">Which appointment</SectionLabel>
          <h2 id="where-title" className="section-title" data-reveal="">
            <Emphasis text={values['where.title']} />
          </h2>
          {values['where.intro'] && <p className="section-intro">{values['where.intro']}</p>}
          <div className="chips" role="tablist" aria-orientation="vertical" aria-label="Where things stand">
            {answers.map((a, i) => (
              <button
                key={`${i}-${a.answer}`}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${id}-tab-${i}`}
                aria-selected={i === index}
                aria-controls={`${id}-panel`}
                tabIndex={i === index ? 0 : -1}
                className="answer"
                onClick={() => {
                  setActive(i);
                  revealMatch();
                }}
                onKeyDown={onKey}
              >
                <span className="answer__dot" aria-hidden="true" />
                <span className="answer__text">{a.answer}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="recon__match" id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${index}`}>
          <div className="match" key={index}>
            <span className="match__shaft" aria-hidden="true" />
            <p className="match__kind">
              <span aria-hidden="true">We’d suggest · </span>
              {service ? KIND_LABEL[kindOf(service)] : 'Appointment'}
            </p>
            <h3 className="match__name">{service ? service.name : item.service}</h3>
            {item.why && <p className="match__why">{item.why}</p>}
            {covers.length > 0 && (
              <ul className="match__covers" role="list" aria-label="What you’d cover">
                {covers.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            )}
            {service && price && (
              <div className="match__foot">
                <dl className="match__figures">
                  <div>
                    <dt>At the desk</dt>
                    <dd>
                      <span aria-hidden="true">{minutesLabel(service.durationMinutes)}</span>
                      <span className="sr-only">{durationSpoken(service.durationMinutes)}</span>
                    </dd>
                  </div>
                  <div>
                    <dt>{price.label}</dt>
                    <dd>{price.amount}</dd>
                  </div>
                </dl>
                <a className="btn btn--light" href="#book" onClick={bookLink(onBook, service.id, whereNote(item.answer))}>
                  Book this<span className="sr-only">: {service.name}</span>
                  <span className="btn__arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
