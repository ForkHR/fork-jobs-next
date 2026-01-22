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

const getForkAppBaseUrl = () => {
  const explicit =
    process.env.FORKHR_APP_URL ||
    process.env.NEXT_PUBLIC_FORKHR_APP_URL ||
    process.env.FORK_APP_URL ||
    process.env.NEXT_PUBLIC_FORK_APP_URL;

  return String(explicit || 'https://app.forkhr.com')
    .trim()
    .replace(/\/+$/, '');
};

const joinUrl = (base, path) => {
  const cleanBase = String(base || '').trim().replace(/\/+$/, '');
  const cleanPath = String(path || '').trim().replace(/^\/+/, '');
  return `${cleanBase}/${cleanPath}`;
};

const asDateOrNow = (value, now) => {
  if (!value) return now;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? now : d;
};

const fetchAvailableCompanyPublicUrls = async () => {
  const explicitUrl =
    process.env.AVAILABLE_COMPANIES_URL ||
    process.env.FORK_AVAILABLE_COMPANIES_URL ||
    process.env.NEXT_PUBLIC_AVAILABLE_COMPANIES_URL ||
    process.env.NEXT_PUBLIC_FORK_AVAILABLE_COMPANIES_URL;

  const base = getForkAppBaseUrl();
  const urlPrimary = explicitUrl
    ? String(explicitUrl).trim()
    : joinUrl(base, '/api/job-board/available');
  const urlFallback = explicitUrl ? null : joinUrl(base, '/jobs-board/available');

  const ssrToken = process.env.FORK_JOBS_SSR_TOKEN || process.env.JOBS_SSR_TOKEN;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;

  const headers = {
    Accept: 'application/json',
    'User-Agent': 'Mozilla/5.0 (compatible; ForkJobsSitemap/1.0; +https://jobs.forkhr.com)',
    ...(siteUrl ? { Referer: String(siteUrl).trim() } : {}),
    ...(ssrToken ? { 'x-fork-jobs-ssr-token': String(ssrToken).trim() } : {}),
  };

  const tryFetchJson = async (url) => {
    const res = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const text = await res.text().catch(() => '');
    try {
      return text ? JSON.parse(text) : null;
    } catch {
      return null;
    }
  };

  let json = await tryFetchJson(urlPrimary);
  if (!json && urlFallback) {
    json = await tryFetchJson(urlFallback);
  }

  if (!json) return [];

  const data =
    (Array.isArray(json?.data) && json.data) ||
    (Array.isArray(json) && json) ||
    (Array.isArray(json?.data?.data) && json.data.data) ||
    [];

  const ids = data
    .map((item) => (typeof item === 'string' ? item : item?._id || item?.id || item?.companyPublicUrl))
    .filter(Boolean)
    .map((v) => String(v).trim())
    .filter(Boolean);

  return Array.from(new Set(ids));
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

  const fromEnv = parseCompanyPublicUrls();
  let companyPublicUrls = fromEnv;

  if (companyPublicUrls.length === 0) {
    try {
      companyPublicUrls = await fetchAvailableCompanyPublicUrls();
    } catch {
      companyPublicUrls = [];
    }
  }

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

        const lastModified = asDateOrNow(listing?.updatedAt || listing?.createdAt, now);

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
