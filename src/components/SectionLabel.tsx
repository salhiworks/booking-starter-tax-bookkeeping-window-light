/**
 * A section's label: its number and name, small, with a short line of light before it (decorative).
 * One per section, in order.
 */
export function SectionLabel({ n, children, tone }: { n?: string; children: string; tone?: 'night' }) {
  return (
    <p className={`label${tone ? ` label--${tone}` : ''}`} data-reveal="">
      <span className="label__beam" aria-hidden="true" />
      {n && (
        <span className="label__n" aria-hidden="true">
          {n}
        </span>
      )}
      <span className="label__text">{children}</span>
    </p>
  );
}
