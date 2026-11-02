'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { searchJobsClient } from '../../lib/clientJobBoard';
import JobCard from '../../components/jobs/JobCard';
import EmptyState from '../../components/jobs/EmptyState';
import { JobListSkeleton } from '../../components/jobs/Skeletons';

// Rendered when the server-side fetch produced no jobs. Refetches from the
// visitor's browser (which passes Cloudflare) and renders the list; shows the
// regular empty state only when the client fetch is empty too.
export default function JobsClientFallback({ q = '', type = '', sort = 'recent', publicS3 = '' }) {
  const [state, setState] = useState({ status: 'loading', items: [], total: 0 });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading', items: [], total: 0 });
    (async () => {
      try {
        const res = await searchJobsClient({ q, employmentType: type, sort, page: 1, limit: 50 });
        const items = Array.isArray(res?.items) ? res.items : [];
        if (!cancelled) setState({ status: 'done', items, total: Number(res?.total) || items.length });
      } catch {
        if (!cancelled) setState({ status: 'error', items: [], total: 0 });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [q, type, sort]);

  if (state.status === 'loading') return <JobListSkeleton count={5} />;

  if (state.items.length === 0) {
    const filtered = Boolean(q || type);
    return (
      <EmptyState
        title={state.status === 'error' ? 'Couldn’t load jobs right now' : filtered ? 'No jobs match that search' : 'No open positions right now'}
        text={
          state.status === 'error'
            ? 'Please refresh the page to try again.'
            : filtered
              ? 'Try another word, or clear the filters to see every open position.'
              : 'New positions are added every week. Browse the company boards to see who is hiring.'
        }
      >
        {filtered ? (
          <Link href="/jobs" className="jb-btn jb-btn--outline jb-btn--sm">
            Clear filters
          </Link>
        ) : (
          <Link href="/boards" className="jb-btn jb-btn--outline jb-btn--sm">
            Browse company boards
          </Link>
        )}
      </EmptyState>
    );
  }

  const n = state.total;
  return (
    <>
      <p className="jb-results" style={{ marginBottom: 14 }} aria-live="polite">
        <b>{n.toLocaleString('en-US')}</b> {n === 1 ? 'job' : 'jobs'}
        {q ? ` for “${q}”` : ''}
      </p>
      <div className="jb-list jb-rise">
        {state.items.map((job) => (
          <JobCard key={job._id} job={job} publicS3={publicS3} />
        ))}
      </div>
    </>
  );
}
