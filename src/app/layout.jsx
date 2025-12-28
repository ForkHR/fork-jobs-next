import Script from 'next/script';
import Providers from './providers';

import 'react-datepicker/dist/react-datepicker.css';

import '../utilities/Common.css';
import '../utilities/Layout.css';
import '../utilities/Sizes.css';
import '../utilities/Text.css';
import '../utilities/ReactDatepicker.css';
import '../index.css';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Fork Jobs',
    template: '%s | Fork Jobs',
  },
  description: 'Company job boards powered by Fork.',
  applicationName: 'Fork Jobs',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
