'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import './SiteHeader.css';

import { logoFullSvg } from '../assets/img/logo';
import { Button, InputSearch } from '../components';
import { searchIcon } from '../assets/img/icons';

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  // Don't show the global header on branded company boards
  // (they have their own branded header via jobBoardClient)
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
    setSearchQuery(searchParams?.get('q') || '');
  }, [searchParams]);

  if (isBrandedBoard) return null;

  return (
    <header className="jobs-site-header">
      <div className="jobs-site-header__wrap">
          <div className={`jobs-site-header__bar${isScrolled ? ' jobs-site-header__bar--scrolled' : ''}`}>
            <Link href="/" className="jobs-site-header__logo" aria-label="Fork Jobs home">
              {logoFullSvg}
            </Link>
            <div className="flex justify-end flex-1 gap-2">
              <Button
                label="Boards"
                to="/boards"
                type="secondary"
                variant={pathname.startsWith('/boards') ? 'filled' : 'text'}
              />
              <Button
                label="Jobs"
                to="/jobs"
                type="secondary"
                variant={pathname.startsWith('/jobs') ? 'filled' : 'text'}
              />
            </div>
          </div>
      </div>
    </header>
  );
}
