import type { Business, Service } from '@profitstudio/booking-engine';
import type { StartBooking } from '../App';
import { bookLink } from '../lib/bookLink';
import type { SiteValues } from '../lib/content';
import type { Resource } from '../lib/resource';
import { durationSpoken, indexOrder, kindOf, minutesLabel, priceLabel } from '../lib/services';
import type { OpeningInfo } from '../lib/useOpening';
import { Emphasis } from './Emphasis';
import { Photo } from './Photo';

/** imagesizes must match the preload in index.html. */
export const HERO_SIZES = '(min-width: 960px) 42vw, 100vw';

interface HeroProps {
  values: SiteValues;
  ownerFields: string[];
  services: Resource<Service[]>;
  business: Business | null;
  opening: OpeningInfo;
  onBook: StartBooking;
}

/**
 * The first screen, at dusk: a warm near-black room. The headline set very large and light, its
 * emphasised word lit by a band of low sun; one sentence; the main action; and three live facts (the
 * free introduction, the lowest consultation fee — both from the engine — and the open status). Beside
 * it the tall photograph runs to the screen's edge, and one soft shaft of light crosses from it over the
 * words. Phones: words, action and facts first, then the photograph.
 */
export function Hero({ values, ownerFields, services, business, opening, onBook }: HeroProps) {
  const photo = values['hero.photo'];
  const own = ownerFields.includes('hero.photo');
  const kicker = values['hero.kicker'].trim();
  const place = values['hero.place'].trim();
  const secondary = values['hero.secondary'].trim();
  return (
    <section className={`hero${photo ? '' : ' hero--no-photo'}`} id="top" aria-labelledby="hero-title">
      <span className="hero__shaft" aria-hidden="true" />
      <div className="hero__grid">
        <div className="hero__text">
          <p className="hero__kicker">
            {kicker && <span>{kicker}</span>}
            {place && <span className="hero__place">{place}</span>}
          </p>
          <h1 id="hero-title" className="hero__title">
            <Emphasis text={values['hero.title']} />
          </h1>
          {values['hero.lede'] && <p className="hero__lede">{values['hero.lede']}</p>}
          <div className="hero__actions">
            <a className="btn btn--light btn--large" href="#book" onClick={bookLink(onBook)}>
              {values['hero.cta']}
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </a>
            {secondary && (
              <a className="text-link text-link--night" href="#where">
                {secondary}
              </a>
            )}
          </div>
          <Facts services={services} business={business} opening={opening} onBook={onBook} />
        </div>
        {photo && (
          <figure className="hero__figure">
            <Photo image={photo} sizes={HERO_SIZES} priority className="frame--hero" />
            {!own && <figcaption className="photo-label">Sample photo</figcaption>}
          </figure>
        )}
      </div>
    </section>
  );
}

/**
 * Three live facts under the action: the free introduction (if offered) and the lowest priced
 * consultation — each a link that opens that appointment — then today's open status.
 */
function Facts({ services, business, opening, onBook }: { services: Resource<Service[]>; business: Business | null; opening: OpeningInfo; onBook: StartBooking }) {
  if (services.status === 'loading') return <div className="facts facts--loading" aria-hidden="true" />;
  const locale = business?.locale ?? 'en-US';
  const list = services.status === 'ready' ? indexOrder(services.data) : [];
  const intro = list.find((s) => kindOf(s) === 'intro' && s.priceCents === 0) ?? null;
  const priced = list.filter((s) => (s.priceCents ?? 0) > 0).sort((a, b) => (a.priceCents ?? 0) - (b.priceCents ?? 0))[0] ?? null;
  return (
    <ul className="facts" role="list">
      {intro && (
        <li>
          <a className="fact" href="#book" onClick={bookLink(onBook, intro.id)}>
            <span className="fact__value">Free</span>
            <span className="fact__term">
              <span aria-hidden="true">{minutesLabel(intro.durationMinutes)} introduction</span>
              <span className="sr-only">
                {durationSpoken(intro.durationMinutes)} — book {intro.name}
              </span>
            </span>
          </a>
        </li>
      )}
      {priced && (
        <li>
          <a className="fact" href="#book" onClick={bookLink(onBook, priced.id)}>
            <span className="fact__value">
              <span className="fact__from">from </span>
              {priceLabel(priced, locale)}
            </span>
            <span className="fact__term">
              Consultations<span className="sr-only"> — book {priced.name}</span>
            </span>
          </a>
        </li>
      )}
      {opening.status && (
        <li className="fact fact--status" data-open={opening.status.open}>
          <span className="fact__dot" aria-hidden="true" />
          <span className="fact__term">{opening.status.text}</span>
        </li>
      )}
    </ul>
  );
}
