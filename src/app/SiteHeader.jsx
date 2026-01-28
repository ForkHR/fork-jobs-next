'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import './SiteHeader.css';

import { logoFullSvg } from '../assets/img/logo';
import { Button, InputSearch } from '../components';
import { arrowRightShortIcon } from '../assets/img/icons';

export default function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);

  const [q, setQ] = useState('');

  useEffect(() => {
    if (pathname !== '/search') return;
    try {
      const sp = new URLSearchParams(window.location.search);
      setQ(sp.get('q') || '');
    } catch {
      setQ('');
    }
  }, [pathname]);

  return (
    pathname === '/' &&
    <header className="jobs-site-header">
      <div className="jobs-site-header__wrap">
        <div className={`jobs-site-header__bar${isScrolled ? ' jobs-site-header__bar--scrolled' : ''}`}>
          <Link href="/" className="jobs-site-header__logo" aria-label="Fork Jobs home">
            {logoFullSvg}
          </Link>
          <div className="jobs-site-header__actions flex-1 justify-end flex">
            <Button
              label="Sign in"
              variant="text"
              type="secondary"
              to="https://app.forkhr.com/login"
              target="_blank"
              iconRight={arrowRightShortIcon}
              textNoWrap
            />
            <Button
              label="Get started"
              variant="filled"
              type="brand"
              to="https://app.forkhr.com/register"
              target="_blank"
              textNoWrap
            />
          </div>
        </div>
      </div>
    </header>
  );
}
