import {
  getCompanyJobsCached,
  searchJobListingsCached,
  searchJobBoardCompaniesCached,
} from '../lib/jobBoardData';
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
      signal: AbortSignal.timeout(10_000),
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
      priority: 0.8,
    },
    {
      url: `${siteUrl}/jobs`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/boards`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // --- Fetch all job listings for individual /jobs/:id pages ---
  try {
    let page = 1;
    const limit = 50;
    let hasMore = true;

    while (hasMore && page <= 100) {
      const data = await searchJobListingsCached({ page, limit, sort: 'recent' });
      const listings = Array.isArray(data?.listings) ? data.listings : [];

      for (const listing of listings) {
        const id = listing?._id;
        if (!id) continue;

        const lastModified = asDateOrNow(listing?.updatedAt || listing?.createdAt, now);

        entries.push({
          url: `${siteUrl}/jobs/${encodeURIComponent(String(id))}`,
          lastModified,
          changeFrequency: 'daily',
          priority: 0.9,
        });
      }

      hasMore = listings.length === limit;
      page++;
    }
  } catch {
    // If the search API fails, continue with what we have
  }

  // --- Fetch companies for /boards/:slug pages ---
  try {
    let page = 1;
    const limit = 50;
    let hasMore = true;

    while (hasMore && page <= 50) {
      const data = await searchJobBoardCompaniesCached({ page, limit, sort: 'jobs' });
      const companies = Array.isArray(data?.companies)
        ? data.companies
        : Array.isArray(data?.items)
          ? data.items
          : [];

      for (const company of companies) {
        const slug = company?.companyPublicUrl || company?.publicUrl;
        if (!slug) continue;

        entries.push({
          url: `${siteUrl}/boards/${encodeURIComponent(slug)}`,
          lastModified: now,
          changeFrequency: 'daily',
          priority: 0.7,
        });

        // Also add individual job listing pages within this board
        try {
          const boardData = await getCompanyJobsCached(slug);
          const listings = Array.isArray(boardData?.listings) ? boardData.listings : [];

          for (const listing of listings) {
            const listingId = listing?._id;
            if (!listingId) continue;

            const lastModified = asDateOrNow(listing?.updatedAt || listing?.createdAt, now);

            entries.push({
              url: `${siteUrl}/boards/${encodeURIComponent(slug)}/${encodeURIComponent(String(listingId))}`,
              lastModified,
              changeFrequency: 'daily',
              priority: 0.7,
            });
          }
        } catch {
          // keep the board page in the sitemap
        }
      }

      hasMore = companies.length === limit;
      page++;
    }
  } catch {
    // If the companies API fails, continue
  }

  // --- Legacy branded company boards ---
  const fromEnv = parseCompanyPublicUrls();
  let companyPublicUrls = fromEnv;

  if (companyPublicUrls.length === 0) {
    try {
      companyPublicUrls = await fetchAvailableCompanyPublicUrls();
    } catch {
      companyPublicUrls = [];
    }
  }

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
      // keep the company page in the sitemap
    }
  }

  return entries;
}
