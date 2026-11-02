'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { searchCompaniesClient } from '../../lib/clientJobBoard';
import CompanyCard from '../../components/jobs/CompanyCard';
import EmptyState from '../../components/jobs/EmptyState';
import { CompanyListSkeleton } from '../../components/jobs/Skeletons';

// Rendered when the server-side fetch produced no companies. Refetches from
// the visitor's browser (which passes Cloudflare).
export default function BoardsClientFallback({ q = '', sort = 'jobs', publicS3 = '' }) {
  const [state, setState] = useState({ status: 'loading', items: [] });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading', items: [] });
    (async () => {
      try {
        const res = await searchCompaniesClient({ q, sort, page: 1, limit: 50 });
        if (!cancelled) setState({ status: 'done', items: Array.isArray(res?.items) ? res.items : [] });
      } catch {
        if (!cancelled) setState({ status: 'error', items: [] });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [q, sort]);

  if (state.status === 'loading') return <CompanyListSkeleton count={6} />;

  if (state.items.length === 0) {
    return (
      <EmptyState
        title={state.status === 'error' ? 'Couldn’t load the boards right now' : q ? 'No companies match that name' : 'No company boards yet'}
        text={
          state.status === 'error'
            ? 'Please refresh the page to try again.'
            : q
              ? 'Try another spelling, or browse every open position instead.'
              : 'Businesses that post openings on Fork show up here.'
        }
      >
        {q ? (
          <Link href="/boards" className="jb-btn jb-btn--outline jb-btn--sm">
            Clear search
          </Link>
        ) : (
          <Link href="/jobs" className="jb-btn jb-btn--outline jb-btn--sm">
            Browse jobs
          </Link>
        )}
      </EmptyState>
    );
  }

  return (
    <div className="jb-grid jb-grid--3 jb-rise">
      {state.items.map((company) => (
        <CompanyCard key={company._id} company={company} publicS3={publicS3} />
      ))}
    </div>
  );
}
