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
 * The practice: a wide photograph running to the screen's edge, and beside it a short statement, who
 * usually sits across the desk (as quiet pills) and, in one line, who is better served elsewhere. No
 * credentials, years or reviews unless the owner adds their own.
 */
export function Practice({ values, ownerFields }: { values: SiteValues; ownerFields: string[] }) {
  const photo = values['practice.photo'];
  const forList = lines(values['practice.for']);
  return (
    <section className={`practice section${photo ? '' : ' practice--text'}`} id="practice" aria-labelledby="practice-title">
      <div className="practice__grid">
        {photo && (
          <figure className="practice__photo" data-reveal="">
            <Photo image={photo} sizes="(min-width: 960px) 58vw, 100vw" />
            {!ownerFields.includes('practice.photo') && <figcaption className="photo-label">Sample photo</figcaption>}
          </figure>
        )}
        <div className="practice__body">
          <SectionLabel n="03">The practice</SectionLabel>
          <h2 id="practice-title" className="section-title" data-reveal="">
            <Emphasis text={values['practice.title']} />
          </h2>
          {values['practice.text'] && <p className="practice__text">{values['practice.text']}</p>}
          {forList.length > 0 && (
            <ul className="pills" role="list" aria-label="Works with">
              {forList.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          )}
          {values['practice.not'] && <p className="practice__not">{values['practice.not']}</p>}
        </div>
      </div>
    </section>
  );
}
