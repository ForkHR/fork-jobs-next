import axios from 'axios';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const normalizeBaseUrl = (baseUrl) => {
  const trimmed = String(baseUrl || '').trim().replace(/\/+$/, '');
  return trimmed.replace(/\/job-board$/, '');
};

export async function generateMetadata() {
  return {
    title: 'Debug - Job Board',
    robots: { index: false, follow: false },
  };
}

export default async function DebugJobBoardPage({ searchParams }) {
  const companyPublicUrl = (await searchParams)?.companyPublicUrl || 'hg';

  const apiBase = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  const ssrToken = process.env.FORK_JOBS_SSR_TOKEN || process.env.JOBS_SSR_TOKEN;

  if (!apiBase) {
    return (
      <pre style={{ padding: 16, whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(
          {
            ok: false,
            error: 'Missing API base URL (API_URL or NEXT_PUBLIC_API_URL).',
          },
          null,
          2
        )}
      </pre>
    );
  }

  const base = normalizeBaseUrl(apiBase);
  const url = `${base}/job-board?companyPublicUrl=${encodeURIComponent(companyPublicUrl)}`;

  const headers = {
    Accept: 'application/json',
    'User-Agent': 'Mozilla/5.0 (compatible; ForkJobsSSR/1.0; +https://jobs.forkhr.com)',
    ...(ssrToken ? { 'x-fork-jobs-ssr-token': ssrToken } : {}),
  };

  try {
    const res = await axios.get(url, { headers, validateStatus: () => true });

    const responseHeaders = {
      server: res.headers?.server,
      'content-type': res.headers?.['content-type'],
      'cf-ray': res.headers?.['cf-ray'],
      'cf-cache-status': res.headers?.['cf-cache-status'],
      'cf-mitigated': res.headers?.['cf-mitigated'],
      'cf-chl-out': res.headers?.['cf-chl-out'],
    };

    return (
      <pre style={{ padding: 16, whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(
          {
            ok: res.status >= 200 && res.status < 300,
            url,
            status: res.status,
            hasSsrToken: Boolean(ssrToken),
            sentHeaderNames: Object.keys(headers),
            responseHeaders,
          },
          null,
          2
        )}
      </pre>
    );
  } catch (e) {
    return (
      <pre style={{ padding: 16, whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(
          {
            ok: false,
            url,
            hasSsrToken: Boolean(ssrToken),
            sentHeaderNames: Object.keys(headers),
            error: e?.message || 'Request failed',
            status: e?.response?.status,
          },
          null,
          2
        )}
      </pre>
    );
  }
}
