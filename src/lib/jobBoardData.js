import axios from 'axios';
import http from 'node:http';
import https from 'node:https';

const getApiBaseUrl = () => {
  const base = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://app.forkhr.com/api";
  if (!base) {
    throw new Error('Missing API base URL. Set API_URL (server) or NEXT_PUBLIC_API_URL.');
  }

  const trimmed = String(base).trim().replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(trimmed)) {
    throw new Error(`Invalid API base URL: "${trimmed}". It must start with http(s)://`);
  }

  // Tolerate misconfig like `.../api/job-board`
  return trimmed.replace(/\/job-board$/, '');
};

const getServerRequestHeaders = () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  const ssrToken = process.env.FORK_JOBS_SSR_TOKEN || process.env.JOBS_SSR_TOKEN;

  return {
    Accept: 'application/json',
    'User-Agent': 'Mozilla/5.0 (compatible; ForkJobsSSR/1.0; +https://jobs.forkhr.com)',
    ...(siteUrl ? { Referer: siteUrl } : {}),
    ...(ssrToken ? { 'x-fork-jobs-ssr-token': ssrToken } : {}),
  };
};

const toAxiosLikeHttpError = (status, url, bodyPreview) => {
  const error = new Error(`Request failed with status ${status} for ${url}`);
  error.status = status;
  error.response = { status };
  error.url = url;
  if (bodyPreview !== undefined) error.bodyPreview = bodyPreview;
  return error;
};

const SSR_FETCH_TIMEOUT_MS = 10_000; // 10s – fail fast so the page can render a fallback

// keepAlive off: warm lambda instances were reusing sockets the Heroku
// router / Cloudflare had already closed, so the first request after idle
// failed and pages rendered empty. A fresh connection per request avoids it.
const ssrHttpAgent = new http.Agent({ keepAlive: false });
const ssrHttpsAgent = new https.Agent({ keepAlive: false });

// Uses axios (not native fetch): Cloudflare's bot protection challenges
// undici's TLS fingerprint from datacenter IPs (e.g. Vercel), while axios's
// Node http client passes — the /api/debug/job-board route proved this.
const fetchJsonOnce = async (url) => {
  const res = await axios.get(url, {
    headers: getServerRequestHeaders(),
    timeout: SSR_FETCH_TIMEOUT_MS,
    validateStatus: () => true,
    responseType: 'text',
    transformResponse: [(data) => data],
    httpAgent: ssrHttpAgent,
    httpsAgent: ssrHttpsAgent,
  });

  const text = typeof res.data === 'string' ? res.data : '';
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    throw toAxiosLikeHttpError(res.status, url, text?.slice?.(0, 400));
  }

  if (res.status < 200 || res.status >= 300) {
    throw toAxiosLikeHttpError(res.status, url, json);
  }

  return json;
};

const fetchJsonNoStore = async (url) => {
  let lastErr;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      return await fetchJsonOnce(url);
    } catch (err) {
      lastErr = err;
      const preview = typeof err?.bodyPreview === 'string' ? err.bodyPreview.slice(0, 200) : '';
      console.error(`[ssr-fetch] attempt ${attempt} failed: ${err?.message}`, preview);
      if (attempt === 1) await new Promise((r) => setTimeout(r, 300));
    }
  }
  throw lastErr;
};

const fetchCompanyJobsServer = async (companyPublicUrl) => {
  const base = getApiBaseUrl();
  const url = `${base}/job-board?companyPublicUrl=${encodeURIComponent(companyPublicUrl)}`;

  return fetchJsonNoStore(url);
};

const normalizeJobBoardResponse = (res) => {
  if (!res) return res;
  if (res?.company || res?.listings) return res;
  if (res?.data && (res.data.company || res.data.listings)) return res.data;
  return res;
};

const fetchAvailableJobBoardsServer = async () => {
  const base = getApiBaseUrl();
  const url = `${base}/job-board/available`;

  return fetchJsonNoStore(url);
};

export const getAvailableJobBoardsCached = async () => {
  const res = await fetchAvailableJobBoardsServer();
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  return [];
};

export const searchJobListingsCached = async (params = {}) => {
  const base = getApiBaseUrl();
  const url = new URL(`${base}/job-board/search`);
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    url.searchParams.set(k, String(v));
  });

  const res = await fetchJsonNoStore(url.toString());
  const data = res?.data || res;
  const items = Array.isArray(data?.items) ? data.items : [];

  // If the search endpoint returned results, use them directly
  if (items.length > 0) return data;

  // Fallback: aggregate jobs from all companies
  console.log('[searchJobListings] /job-board/search returned 0 items, using company aggregation fallback');
  return aggregateJobsFromCompanies(params);
};

export const searchJobBoardCompaniesCached = async (params = {}) => {
  const base = getApiBaseUrl();
  const url = new URL(`${base}/job-board/companies/search`);
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    url.searchParams.set(k, String(v));
  });

  const res = await fetchJsonNoStore(url.toString());
  return res?.data || res;
};

export const getJobListingByIdCached = async (listingId) => {
  const base = getApiBaseUrl();
  const url = `${base}/job-board/listing/${encodeURIComponent(listingId)}`;

  const res = await fetchJsonNoStore(url);
  if (res?.data?.company || res?.data?.listing) return res.data;
  return res;
};

export const getCompanyJobsCached = async (companyPublicUrl) => {
  const res = await fetchCompanyJobsServer(companyPublicUrl);
  return normalizeJobBoardResponse(res);
};

/**
 * Fallback: fetch all companies, then fetch each company's listings,
 * flatten into a single list, apply filters/sort/pagination client-side.
 */
const aggregateJobsFromCompanies = async (params = {}) => {
  const { q, employmentType, sort = 'recent', page = 1, limit = 20 } = params;

  // 1. Get all companies with job boards
  const companiesRes = await searchJobBoardCompaniesCached({ limit: 100 });
  const companies = Array.isArray(companiesRes?.items) ? companiesRes.items : [];

  if (companies.length === 0) {
    return { items: [], total: 0, page: 1, pages: 1 };
  }

  // 2. Fetch listings for each company (batched to avoid overwhelming the API)
  const allListings = [];
  const CONCURRENCY = 6;
  const batches = [];
  for (let i = 0; i < companies.length; i += CONCURRENCY) {
    batches.push(companies.slice(i, i + CONCURRENCY));
  }
  const settled = [];
  for (const batch of batches) {
    const results = await Promise.allSettled(
      batch.map(async (company) => {
      const publicUrl = company.publicUrl || company._id;
      try {
        const data = await getCompanyJobsCached(publicUrl);
        const listings = Array.isArray(data?.listings) ? data.listings : [];
        return listings
          .filter((l) => l?.status === 'active' || !l?.status) // only active
          .map((l) => ({
            ...l,
            company: {
              _id: company._id,
              name: company.name,
              publicUrl: company.publicUrl,
              logo: company.logo,
              brandColor: company.brandColor,
            },
          }));
      } catch (err) {
        console.error(`[aggregateJobs] Failed to fetch jobs for ${publicUrl}:`, err?.message);
        return [];
      }
    })
    );
    settled.push(...results);
  }

  for (const result of settled) {
    if (result.status === 'fulfilled' && Array.isArray(result.value)) {
      allListings.push(...result.value);
    }
  }

  // 3. Filter
  let filtered = allListings;

  if (q) {
    const lower = q.toLowerCase();
    filtered = filtered.filter(
      (j) =>
        j.title?.toLowerCase().includes(lower) ||
        j.company?.name?.toLowerCase().includes(lower) ||
        j.location?.city?.toLowerCase().includes(lower) ||
        j.category?.toLowerCase().includes(lower)
    );
  }

  if (employmentType) {
    filtered = filtered.filter((j) => j.employmentType === employmentType);
  }

  // 4. Sort
  if (sort === 'recent' || !sort) {
    filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  // 5. Paginate
  const total = filtered.length;
  const pages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + limit);

  return { items: paged, total, page, pages };
};

export const getCompanyAndListingCached = async (companyPublicUrl, listingId) => {
  const data = await getCompanyJobsCached(companyPublicUrl);
  const listings = Array.isArray(data?.listings) ? data.listings : [];
  const listing = listings.find((l) => l?._id === listingId);

  return {
    company: data?.company,
    listings,
    listing,
  };
};
