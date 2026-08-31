import axios from 'axios';

// Browser-side data access for the job board. Production SSR requests from
// Vercel are 403-challenged by Cloudflare in front of app.forkhr.com, but
// requests from real visitors' browsers pass. These helpers let pages fill
// themselves in from the client when the server render came back empty.

const getBase = () => {
  const base = process.env.NEXT_PUBLIC_API_URL || 'https://app.forkhr.com/api';
  return String(base).trim().replace(/\/+$/, '').replace(/\/job-board$/, '');
};

const TIMEOUT_MS = 15_000;

const getJson = async (url) => {
  const res = await axios.get(url, { timeout: TIMEOUT_MS });
  return res.data;
};

const buildUrl = (path, params = {}) => {
  const url = new URL(`${getBase()}${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    url.searchParams.set(k, String(v));
  });
  return url.toString();
};

export const searchCompaniesClient = async (params = {}) => {
  const res = await getJson(buildUrl('/job-board/companies/search', params));
  return res?.data || res;
};

export const getCompanyJobsClient = async (publicUrl) => {
  const res = await getJson(buildUrl('/job-board', { companyPublicUrl: publicUrl }));
  if (res?.company || res?.listings) return res;
  if (res?.data && (res.data.company || res.data.listings)) return res.data;
  return res;
};

export const getListingByIdClient = async (listingId) => {
  const res = await getJson(`${getBase()}/job-board/listing/${encodeURIComponent(listingId)}`);
  if (res?.data?.company || res?.data?.listing) return res.data;
  return res;
};

// Mirrors the server's searchJobListingsCached: try /job-board/search, and
// fall back to aggregating each company's board when it returns 0 items.
export const searchJobsClient = async (params = {}) => {
  const { q, employmentType, sort = 'recent', page = 1, limit = 20 } = params;

  try {
    const res = await getJson(buildUrl('/job-board/search', { q, employmentType, sort, page, limit }));
    const data = res?.data || res;
    if (Array.isArray(data?.items) && data.items.length > 0) return data;
  } catch {
    // fall through to aggregation
  }

  const companiesRes = await searchCompaniesClient({ limit: 100 });
  const companies = Array.isArray(companiesRes?.items) ? companiesRes.items : [];
  if (companies.length === 0) return { items: [], total: 0, page: 1, pages: 1 };

  const settled = await Promise.allSettled(
    companies.map(async (company) => {
      const data = await getCompanyJobsClient(company.publicUrl || company._id);
      const listings = Array.isArray(data?.listings) ? data.listings : [];
      return listings
        .filter((l) => l?.status === 'active' || !l?.status)
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
    })
  );

  let filtered = settled.flatMap((r) => (r.status === 'fulfilled' && Array.isArray(r.value) ? r.value : []));

  if (q) {
    const lower = String(q).toLowerCase();
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

  if (sort === 'recent' || !sort) {
    filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  const total = filtered.length;
  const pages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  return { items: filtered.slice(start, start + limit), total, page, pages };
};
