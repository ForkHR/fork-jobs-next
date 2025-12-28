import { getCompanyJobsCached } from '../lib/jobBoardData';
import { getSiteUrl } from '../lib/siteUrl';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const parseCompanyPublicUrls = () => {
  const raw =
    process.env.SITEMAP_COMPANY_PUBLIC_URLS ||
    process.env.NEXT_PUBLIC_SITEMAP_COMPANY_PUBLIC_URLS ||
    '';

  const urls = String(raw)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return Array.from(new Set(urls));
};

export default async function sitemap() {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const entries = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.1,
    },
  ];

  const companyPublicUrls = parseCompanyPublicUrls();
  if (companyPublicUrls.length === 0) return entries;

  for (const companyPublicUrl of companyPublicUrls) {
    const companySlug = encodeURIComponent(companyPublicUrl);

    entries.push({
      url: `${siteUrl}/${companySlug}`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.6,
    });

    try {
      const data = await getCompanyJobsCached(companyPublicUrl);
      const listings = Array.isArray(data?.listings) ? data.listings : [];

      for (const listing of listings) {
        const listingId = listing?._id;
        if (!listingId) continue;

        const lastModified = listing?.updatedAt || listing?.createdAt || now;

        entries.push({
          url: `${siteUrl}/${companySlug}/${encodeURIComponent(String(listingId))}`,
          lastModified,
          changeFrequency: 'daily',
          priority: 0.7,
        });
      }
    } catch {
      // If the API is unreachable (WAF/403/etc.), still keep the company page in the sitemap.
    }
  }

  return entries;
}
