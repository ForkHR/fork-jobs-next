'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { searchJobsClient } from '../lib/clientJobBoard';
import JobCard from '../components/jobs/JobCard';
import EmptyState from '../components/jobs/EmptyState';
import { JobListSkeleton } from '../components/jobs/Skeletons';

// Rendered when the server couldn't load recent jobs. Refetches from the
// visitor's browser and renders the same cards as the server list.
export default function HomeJobsFallback({ publicS3 = '', limit = 6 }) {
  const [state, setState] = useState({ status: 'loading', items: [] });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await searchJobsClient({ limit, sort: 'recent' });
        if (!cancelled) setState({ status: 'done', items: Array.isArray(res?.items) ? res.items : [] });
      } catch {
        if (!cancelled) setState({ status: 'error', items: [] });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  if (state.status === 'loading') return <JobListSkeleton count={limit} grid />;

  if (state.items.length === 0) {
    return (
      <EmptyState
        title={state.status === 'error' ? 'Couldn’t load the latest openings' : 'No openings right now'}
        text={
          state.status === 'error'
            ? 'Please refresh the page to try again.'
            : 'New positions are added every week. Browse the company boards to see who is hiring.'
        }
      >
        <Link href="/boards" className="jb-btn jb-btn--outline jb-btn--sm">
          Browse company boards
        </Link>
      </EmptyState>
    );
  }

  return (
    <div className="jb-grid jb-rise">
      {state.items.map((job) => (
        <JobCard key={job._id} job={job} publicS3={publicS3} />
      ))}
    </div>
  );
}
