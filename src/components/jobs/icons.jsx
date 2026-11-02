// Stroke icons (Lucide paths) for the public pages, drawn inline so they take the text colour.

const base = (size) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  focusable: 'false',
});

export const SearchIcon = ({ size = 18 }) => (
  <svg {...base(size)}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);

export const MapPinIcon = ({ size = 16 }) => (
  <svg {...base(size)}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
);

export const BanknoteIcon = ({ size = 16 }) => (
  <svg {...base(size)}><rect width="20" height="12" x="2" y="6" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>
);

export const ClockIcon = ({ size = 16 }) => (
  <svg {...base(size)}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
);

export const BriefcaseIcon = ({ size = 16 }) => (
  <svg {...base(size)}><rect width="20" height="14" x="2" y="6" rx="2" /><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>
);

export const TagIcon = ({ size = 16 }) => (
  <svg {...base(size)}><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" /><circle cx="7.5" cy="7.5" r=".5" fill="currentColor" /></svg>
);

export const CalendarIcon = ({ size = 16 }) => (
  <svg {...base(size)}><path d="M8 2v4M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></svg>
);

export const BuildingIcon = ({ size = 16 }) => (
  <svg {...base(size)}><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4" /></svg>
);

export const UsersIcon = ({ size = 16 }) => (
  <svg {...base(size)}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);

export const ArrowRightIcon = ({ size = 16 }) => (
  <svg {...base(size)}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
);

export const ArrowUpRightIcon = ({ size = 16 }) => (
  <svg {...base(size)}><path d="M7 7h10v10M7 17 17 7" /></svg>
);

export const ChevronLeftIcon = ({ size = 18 }) => (
  <svg {...base(size)}><path d="m15 18-6-6 6-6" /></svg>
);

export const ChevronRightIcon = ({ size = 18 }) => (
  <svg {...base(size)}><path d="m9 18 6-6-6-6" /></svg>
);

export const ChevronDownIcon = ({ size = 16 }) => (
  <svg {...base(size)}><path d="m6 9 6 6 6-6" /></svg>
);

export const CheckIcon = ({ size = 16 }) => (
  <svg {...base(size)}><path d="M20 6 9 17l-5-5" /></svg>
);

export const ShareIcon = ({ size = 16 }) => (
  <svg {...base(size)}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" /></svg>
);

export const XIcon = ({ size = 16 }) => (
  <svg {...base(size)}><path d="M18 6 6 18M6 6l12 12" /></svg>
);

export const MenuIcon = ({ size = 20 }) => (
  <svg {...base(size)}><path d="M4 6h16M4 12h16M4 18h16" /></svg>
);

export const SparklesIcon = ({ size = 16 }) => (
  <svg {...base(size)}><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" /></svg>
);

export const SearchXIcon = ({ size = 22 }) => (
  <svg {...base(size)}><path d="m13.5 8.5-5 5M8.5 8.5l5 5" /><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);
