import Script from 'next/script';
import Providers from './providers';
import { getSiteUrl } from '../lib/siteUrl';

import 'react-datepicker/dist/react-datepicker.css';

import '../utilities/Common.css';
import '../utilities/Layout.css';
import '../utilities/Sizes.css';
import '../utilities/Text.css';
import '../utilities/ReactDatepicker.css';
import '../index.css';

import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'Fork Jobs — Company Job Boards Powered by ForkHR',
    template: '%s — Fork Jobs',
  },
  description:
    'Discover open job listings on company-powered job boards. Browse barista jobs, restaurant jobs, retail positions, and more — apply directly.',
  applicationName: 'Fork Jobs',
  keywords: [
    'jobs',
    'hiring',
    'job board',
    'barista jobs',
    'restaurant jobs',
    'retail jobs',
    'apply for jobs',
    'local jobs',
    'fork',
    'forkhr',
  ],
  authors: [{ name: 'Fork', url: 'https://forkhr.com' }],
  creator: 'ForkHR',
  openGraph: {
    type: 'website',
    siteName: 'Fork Jobs',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <SiteHeader />
          {children}
          <SiteFooter />
        </Providers>
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
