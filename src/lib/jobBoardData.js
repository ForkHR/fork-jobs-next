const getApiBaseUrl = () => {
  const base = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
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

const fetchCompanyJobsServer = async (companyPublicUrl) => {
  const base = getApiBaseUrl();
  const url = `${base}/job-board?companyPublicUrl=${encodeURIComponent(companyPublicUrl)}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getServerRequestHeaders(),
    cache: 'no-store',
  });

  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    throw toAxiosLikeHttpError(res.status, url, text?.slice?.(0, 400));
  }

  if (!res.ok) {
    throw toAxiosLikeHttpError(res.status, url, json);
  }

  return json;
};

const normalizeJobBoardResponse = (res) => {
  if (!res) return res;
  if (res?.company || res?.listings) return res;
  if (res?.data && (res.data.company || res.data.listings)) return res.data;
  return res;
};

export const getCompanyJobsCached = async (companyPublicUrl) => {
  const res = await fetchCompanyJobsServer(companyPublicUrl);
  return normalizeJobBoardResponse(res);
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
