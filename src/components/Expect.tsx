import type { SiteValues } from '../lib/content';
import { Emphasis } from './Emphasis';
import { Photo } from './Photo';
import { SectionLabel } from './SectionLabel';

const lines = (text: string) =>
  text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

/**
 * What to expect: the steps as large numbered columns, then — over the corner of a wide photograph — a
 * dark card of what is never asked for online (each line struck through with one line of light) and how
 * documents move if the client goes on to work with the practice. The site collects no documents and
 * offers no portal.
 */
export function Expect({ values, ownerFields }: { values: SiteValues; ownerFields: string[] }) {
  const steps = values['expect.steps'];
  const never = lines(values['expect.never']);
  const photo = values['expect.photo'];
  return (
    <section className="expect section" id="process" aria-labelledby="expect-title">
      <div className="shell">
        <SectionLabel n="04">What to expect</SectionLabel>
        <h2 id="expect-title" className="section-title" data-reveal="">
          <Emphasis text={values['expect.title']} />
        </h2>
        {steps.length > 0 && (
          <ol className="steps" role="list">
            {steps.map((s, i) => (
              <li className="step" key={`${i}-${s.title}`} data-reveal="">
                <span className="step__n" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="step__title">
                  <span className="sr-only">Step {i + 1}: </span>
                  {s.title}
                </h3>
                {s.text && <p className="step__text">{s.text}</p>}
              </li>
            ))}
          </ol>
        )}
        <div className={`privacy${photo ? '' : ' privacy--text'}`} id="privacy">
          {photo && (
            <figure className="privacy__photo" data-reveal="">
              <Photo image={photo} sizes="(min-width: 960px) 62vw, 100vw" />
              {!ownerFields.includes('expect.photo') && <figcaption className="photo-label">Sample photo</figcaption>}
            </figure>
          )}
          <div className="privacy__card" data-reveal="">
            <h3 className="privacy__title">{values['expect.neverTitle']}</h3>
            {never.length > 0 && (
              <ul className="struck" role="list" aria-label="Never asked for online">
                {never.map((l) => (
                  <li key={l}>
                    <span className="struck__text">{l}</span>
                  </li>
                ))}
              </ul>
            )}
            {values['expect.documents'] && <p className="privacy__docs">{values['expect.documents']}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
