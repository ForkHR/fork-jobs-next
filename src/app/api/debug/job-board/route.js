import { NextResponse } from 'next/server';
import axios from 'axios';
import { searchJobListingsCached, searchJobBoardCompaniesCached } from '../../../../lib/jobBoardData';

const normalizeBaseUrl = (baseUrl) => {
  const trimmed = String(baseUrl || '').trim().replace(/\/+$/, '');
  return trimmed.replace(/\/job-board$/, '');
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const companyPublicUrl = searchParams.get('companyPublicUrl') || 'hg';

  // ?mode=layer runs the real data-layer calls the pages use, so their
  // failure mode is observable in the response instead of only in logs.
  if (searchParams.get('mode') === 'layer') {
    // Replay the pages' exact data-layer calls. Params override the defaults,
    // e.g. ?mode=layer&limit=20&page=1&sort=recent mirrors /jobs,
    // ?mode=layer&csort=jobs&climit=24&cpage=1 mirrors /boards.
    const searchArgs = {
      limit: Number(searchParams.get('limit')) || 8,
      sort: searchParams.get('sort') || 'recent',
    };
    if (searchParams.get('page')) searchArgs.page = Number(searchParams.get('page'));
    if (searchParams.get('q')) searchArgs.q = searchParams.get('q');
    if (searchParams.get('employmentType')) searchArgs.employmentType = searchParams.get('employmentType');

    const companiesArgs = { limit: Number(searchParams.get('climit')) || 100 };
    if (searchParams.get('csort')) companiesArgs.sort = searchParams.get('csort');
    if (searchParams.get('cpage')) companiesArgs.page = Number(searchParams.get('cpage'));

    const errInfo = (e) => ({
      message: e?.message,
      status: e?.status,
      bodyPreview: typeof e?.bodyPreview === 'string' ? e.bodyPreview.slice(0, 300) : e?.bodyPreview,
    });

    const out = { searchArgs, companiesArgs, search: null, companies: null, errors: {} };
    const t0 = Date.now();
    try {
      const res = await searchJobListingsCached(searchArgs);
      out.search = { items: res?.items?.length ?? 0, total: res?.total ?? 0 };
    } catch (e) {
      out.errors.search = errInfo(e);
    }
    try {
      const res = await searchJobBoardCompaniesCached(companiesArgs);
      out.companies = { items: res?.items?.length ?? 0 };
    } catch (e) {
      out.errors.companies = errInfo(e);
    }
    out.elapsedMs = Date.now() - t0;
    return NextResponse.json(out);
  }

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

  // ?ua=chrome sends a plain browser UA instead of the SSR bot-style UA,
  // to test whether Cloudflare's challenge keys on the User-Agent.
  const uaOverride =
    searchParams.get('ua') === 'chrome'
      ? 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
      : null;

  const headers = {
    Accept: 'application/json',
    'User-Agent': uaOverride || 'Mozilla/5.0 (compatible; ForkJobsSSR/1.0; +https://jobs.forkhr.com)',
    ...(ssrToken ? { 'x-fork-jobs-ssr-token': ssrToken } : {}),
  };

  try {
    const res = await axios.get(url, { headers, timeout: 10_000, validateStatus: () => true });
    const dataPreview = typeof res.data === 'string' ? res.data.slice(0, 400) : res.data;

    const responseHeaders = {
      server: res.headers?.server,
      'content-type': res.headers?.['content-type'],
      'cf-ray': res.headers?.['cf-ray'],
      'cf-cache-status': res.headers?.['cf-cache-status'],
      'cf-mitigated': res.headers?.['cf-mitigated'],
      'cf-chl-out': res.headers?.['cf-chl-out'],
    };

    return NextResponse.json({
      ok: res.status >= 200 && res.status < 300,
      url,
      status: res.status,
      hasSsrToken: Boolean(ssrToken),
      sentHeaderNames: Object.keys(headers),
      responseHeaders,
      dataPreview,
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        url,
        hasSsrToken: Boolean(ssrToken),
        sentHeaderNames: Object.keys(headers),
        error: e?.message || 'Request failed',
        status: e?.response?.status,
      },
      { status: 500 }
    );
  }
}
