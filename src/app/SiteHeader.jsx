'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import './SiteHeader.css';

import { logoFullSvg } from '../assets/img/logo';

export default function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), []);

  if (isBrandedBoard) return null;

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <>
      <header className="site-header">
        <div className="site-header__wrap">
          <div className={`site-header__bar${isScrolled ? ' site-header__bar--scrolled' : ''}`}>
            {/* Logo */}
            <Link href="/" className="site-header__logo" aria-label="Fork Jobs home">
              {logoFullSvg}
            </Link>

            {/* Desktop Nav */}
            <nav className="site-header__nav">
              <Link
                href="/jobs"
                className={`site-header__link${isActive('/jobs') ? ' site-header__link--active' : ''}`}
              >
                Browse Jobs
              </Link>
              <Link
                href="/boards"
                className={`site-header__link${isActive('/boards') ? ' site-header__link--active' : ''}`}
              >
                Browse Boards
              </Link>
              <a
                href="https://forkhr.com"
                target="_blank"
                rel="noopener noreferrer"
                className="site-header__link"
              >
                For Employers
              </a>
            </nav>

            {/* Desktop Actions */}
            <div className="site-header__actions">
              <a
                href="https://app.forkhr.com/login"
                target="_blank"
                rel="noopener noreferrer"
                className="site-header__sign-in"
              >
                Sign in
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
              <a
                href="https://app.forkhr.com/hiring?new-job-listing=true"
                target="_blank"
                rel="noopener noreferrer"
                className="site-header__cta"
              >
                Post a Job
              </a>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="site-header__hamburger"
              onClick={toggleMobile}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <span className={`site-header__hamburger-line${mobileOpen ? ' site-header__hamburger-line--open' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div className={`site-mobile-menu${mobileOpen ? ' site-mobile-menu--open' : ''}`}>
        <div className="site-mobile-menu__backdrop" onClick={toggleMobile} />
        <div className="site-mobile-menu__panel">
          <div className="site-mobile-menu__header">
            <Link href="/" className="site-header__logo" aria-label="Fork Jobs home" onClick={toggleMobile}>
              {logoFullSvg}
            </Link>
            <button className="site-mobile-menu__close" onClick={toggleMobile} aria-label="Close menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <nav className="site-mobile-menu__nav">
            <Link
              href="/jobs"
              className={`site-mobile-menu__link${isActive('/jobs') ? ' site-mobile-menu__link--active' : ''}`}
              onClick={toggleMobile}
            >
              Browse Jobs
            </Link>
            <Link
              href="/boards"
              className={`site-mobile-menu__link${isActive('/boards') ? ' site-mobile-menu__link--active' : ''}`}
              onClick={toggleMobile}
            >
              Browse Boards
            </Link>
            <a
              href="https://forkhr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="site-mobile-menu__link"
              onClick={toggleMobile}
            >
              For Employers
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </nav>
          <div className="site-mobile-menu__footer">
            <a
              href="https://app.forkhr.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="site-mobile-menu__btn site-mobile-menu__btn--ghost"
            >
              Sign in
            </a>
            <a
              href="https://app.forkhr.com/hiring?new-job-listing=true"
              target="_blank"
              rel="noopener noreferrer"
              className="site-mobile-menu__btn site-mobile-menu__btn--filled"
            >
              Post a Job
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
