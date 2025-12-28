import { NextResponse } from 'next/server';
import axios from 'axios';

const normalizeBaseUrl = (baseUrl) => {
  const trimmed = String(baseUrl || '').trim().replace(/\/+$/, '');
  return trimmed.replace(/\/job-board$/, '');
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const companyPublicUrl = searchParams.get('companyPublicUrl') || 'hg';

  const apiBase = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  const ssrToken = process.env.FORK_JOBS_SSR_TOKEN || process.env.JOBS_SSR_TOKEN;

  if (!apiBase) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Missing API base URL (API_URL or NEXT_PUBLIC_API_URL).',
      },
      { status: 500 }
    );
  }

  const base = normalizeBaseUrl(apiBase);
  const url = `${base}/job-board?companyPublicUrl=${encodeURIComponent(companyPublicUrl)}`;

  const headers = {
    Accept: 'application/json',
    'User-Agent':
      'Mozilla/5.0 (compatible; ForkJobsSSR/1.0; +https://jobs.forkhr.com)',
    ...(ssrToken ? { 'x-fork-jobs-ssr-token': ssrToken } : {}),
  };

  try {
    const res = await axios.get(url, { headers, validateStatus: () => true });
    const dataPreview =
      typeof res.data === 'string'
        ? res.data.slice(0, 400)
        : res.data;

    return NextResponse.json({
      ok: res.status >= 200 && res.status < 300,
      url,
      status: res.status,
      hasSsrToken: Boolean(ssrToken),
      dataPreview,
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        url,
        hasSsrToken: Boolean(ssrToken),
        error: e?.message || 'Request failed',
        status: e?.response?.status,
      },
      { status: 500 }
    );
  }
}
