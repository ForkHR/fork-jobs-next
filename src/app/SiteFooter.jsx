'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoFullSvg } from '../assets/img/logo';
import { HOW_TO_POST_URL, POST_JOB_URL, REGISTER_URL } from '../components/jobs/EmployerBand';

const columns = [
  {
    title: 'Job seekers',
    links: [
      { label: 'Browse jobs', href: '/jobs' },
      { label: 'Company boards', href: '/boards' },
      { label: 'Part-time jobs', href: '/jobs?type=part-time' },
      { label: 'Full-time jobs', href: '/jobs?type=full-time' },
      { label: 'How it works', href: '/#how-it-works' },
    ],
  },
  {
    title: 'Employers',
    links: [
      { label: 'Create your job board', href: REGISTER_URL, external: true },
      { label: 'Post a job', href: POST_JOB_URL, external: true },
      { label: 'Hiring on Fork', href: 'https://forkhr.com/hiring', external: true },
      { label: 'How to post a job', href: HOW_TO_POST_URL, external: true },
      { label: 'Employer sign in', href: 'https://app.forkhr.com/login', external: true },
    ],
  },
  {
    title: 'Fork',
    links: [
      { label: 'forkhr.com', href: 'https://forkhr.com', external: true },
      { label: 'Products', href: 'https://forkhr.com/products', external: true },
      { label: 'Pricing', href: 'https://forkhr.com/pricing', external: true },
      { label: 'Privacy policy', href: 'https://forkhr.com/privacy-policy', external: true },
      { label: 'Terms of service', href: 'https://forkhr.com/terms-of-service', external: true },
    ],
  },
];

export default function SiteFooter() {
  const pathname = usePathname();

  // A company's own board (/<company>) carries no site chrome.
  const isBrandedBoard =
    pathname &&
    pathname !== '/' &&
    !pathname.startsWith('/jobs') &&
    !pathname.startsWith('/boards') &&
    !pathname.startsWith('/company') &&
    !pathname.startsWith('/search') &&
    !pathname.startsWith('/debug') &&
    !pathname.startsWith('/__debug');

  if (isBrandedBoard) return null;

  return (
    <footer className="jb jb-footer">
      <div className="jb-wrap">
        <div className="jb-footer__grid">
          <div className="jb-footer__brand">
            <Link href="/" aria-label="Fork Jobs home">
              {logoFullSvg}
            </Link>
            <p className="jb-footer__tagline">
              Job boards run by the businesses themselves. Search the openings, apply in minutes and hear back from the
              person doing the hiring.
            </p>
            <div className="jb-footer__actions">
              <Link href="/jobs" className="jb-btn jb-btn--ink jb-btn--sm">
                Browse jobs
              </Link>
              <a href={POST_JOB_URL} target="_blank" rel="noopener noreferrer" className="jb-btn jb-btn--outline jb-btn--sm">
                Post a job
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    {l.external ? (
                      <a href={l.href} target="_blank" rel="noopener noreferrer">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href}>{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="jb-footer__bottom">
          <p>© {new Date().getFullYear()} Fork Workforce Inc. All rights reserved.</p>
          <nav aria-label="Legal">
            <a href="https://forkhr.com/privacy-policy" target="_blank" rel="noopener noreferrer">
              Privacy
            </a>
            <a href="https://forkhr.com/terms-of-service" target="_blank" rel="noopener noreferrer">
              Terms
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
