/** The page's sections, in order — the header, the phone menu and the footer all list these. */
export const NAV: readonly { href: string; label: string; header?: false }[] = [
  { href: '#where', label: 'Which appointment' },
  { href: '#fees', label: 'Fees' },
  { href: '#practice', label: 'The practice' },
  { href: '#process', label: 'What to expect' },
  { href: '#questions', label: 'Questions', header: false },
  { href: '#visit', label: 'The office' },
];
