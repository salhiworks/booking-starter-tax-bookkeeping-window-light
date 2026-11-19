/**
 * The practice's mark: a window — a tall rounded frame — with one band of low sun falling across it.
 * Decorative (the name beside it is the text).
 */
export function Mark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" focusable="false">
      <rect x="7" y="3.5" width="18" height="25" rx="9" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path className="mark__light" d="M9.2 22.5 22.8 9.3v6.4L13.6 24.6c-1.9-.2-3.4-.9-4.4-2.1Z" />
    </svg>
  );
}
