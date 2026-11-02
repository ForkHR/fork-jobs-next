'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import './SiteHeader.css';

import { logoFullSvg } from '../assets/img/logo';
import { ArrowUpRightIcon, MenuIcon, XIcon } from '../components/jobs/icons';
import { POST_JOB_URL } from '../components/jobs/EmployerBand';

const LOGIN_URL = 'https://app.forkhr.com/login';
const EMPLOYERS_URL = 'https://forkhr.com/hiring';

export default function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), []);

  if (isBrandedBoard) return null;

  const isActive = (path) => (path === '/' ? pathname === '/' : pathname.startsWith(path));
  const linkClass = (path) => `jb-header__link${isActive(path) ? ' jb-header__link--active' : ''}`;
  const menuClass = (path) => `jb-menu__link${isActive(path) ? ' jb-menu__link--active' : ''}`;

  return (
    <>
      <header className={`jb jb-header${isScrolled ? ' jb-header--scrolled' : ''}${mobileOpen ? ' jb-header--open' : ''}`}>
        <div className="jb-wrap jb-header__bar">
          <Link href="/" className="jb-header__logo" aria-label="Fork Jobs home">
            {logoFullSvg}
          </Link>

          <nav className="jb-header__nav" aria-label="Main">
            <Link href="/jobs" className={linkClass('/jobs')}>
              Jobs
            </Link>
            <Link href="/boards" className={linkClass('/boards')}>
              Companies
            </Link>
            <a href={EMPLOYERS_URL} target="_blank" rel="noopener noreferrer" className="jb-header__link">
              For employers
              <ArrowUpRightIcon size={13} />
            </a>
          </nav>

          <div className="jb-header__actions">
            <a href={LOGIN_URL} target="_blank" rel="noopener noreferrer" className="jb-btn jb-btn--ghost jb-btn--sm">
              Sign in
            </a>
            <a href={POST_JOB_URL} target="_blank" rel="noopener noreferrer" className="jb-btn jb-btn--ink jb-btn--sm">
              Post a job
            </a>
          </div>

          <button
            type="button"
            className="jb-header__burger"
            onClick={toggleMobile}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="jb-mobile-menu"
          >
            {mobileOpen ? <XIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </header>

      <div id="jb-mobile-menu" className={`jb jb-menu${mobileOpen ? ' jb-menu--open' : ''}`} aria-hidden={!mobileOpen}>
        <nav className="jb-menu__nav" aria-label="Main">
          <Link href="/jobs" className={menuClass('/jobs')} onClick={toggleMobile}>
            Jobs
          </Link>
          <Link href="/boards" className={menuClass('/boards')} onClick={toggleMobile}>
            Companies
          </Link>
          <a href={EMPLOYERS_URL} target="_blank" rel="noopener noreferrer" className="jb-menu__link" onClick={toggleMobile}>
            For employers
            <ArrowUpRightIcon size={18} />
          </a>
        </nav>
        <p className="jb-menu__hint">Every listing is posted by the business itself. Apply straight to the employer, no account needed.</p>
        <div className="jb-menu__footer">
          <a href={LOGIN_URL} target="_blank" rel="noopener noreferrer" className="jb-btn jb-btn--outline">
            Sign in
          </a>
          <a href={POST_JOB_URL} target="_blank" rel="noopener noreferrer" className="jb-btn jb-btn--ink">
            Post a job
          </a>
        </div>
      </div>
    </>
  );
}
