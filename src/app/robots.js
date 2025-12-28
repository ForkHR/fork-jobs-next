import { getSiteUrl } from '../lib/siteUrl';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function robots() {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/debug', '/__debug', '/api/debug', '/api/__debug'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
