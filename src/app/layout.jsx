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

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'Fork Jobs',
    template: '%s - Powered by forkhr.com',
  },
  description: 'Company job boards powered by Fork.',
  applicationName: 'Fork Jobs',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
