'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { searchJobsClient } from '../../lib/clientJobBoard';

const formatPay = (job) => {
  if (!job.payRateFrom || job.payRateFrom <= 0) return null;
  let pay = `$${job.payRateFrom}`;
  if (job.payRateTo > job.payRateFrom) pay += `–$${job.payRateTo}`;
  if (job.payType === 'hourly') pay += '/hr';
  else if (job.payType === 'salary') pay += '/yr';
  return pay;
};

const formatLocation = (loc) => {
  if (!loc) return null;
  const parts = [loc.city, loc.state].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : loc.name || null;
};

// Rendered when the server-side fetch produced no jobs. Refetches from the
// visitor's browser (which passes Cloudflare) and renders the list; shows the
// regular empty state only when the client fetch is empty too.
export default function JobsClientFallback({ q = '', type = '', sort = 'recent' }) {
  const [state, setState] = useState({ status: 'loading', items: [] });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await searchJobsClient({ q, employmentType: type, sort, page: 1, limit: 50 });
        if (!cancelled) setState({ status: 'done', items: Array.isArray(res?.items) ? res.items : [] });
      } catch {
        if (!cancelled) setState({ status: 'error', items: [] });
      }
    })();
    return () => { cancelled = true; };
  }, [q, type, sort]);

  if (state.status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0', color: '#8A8480', fontSize: 14 }}>
        Loading jobs…
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0', color: '#8A8480' }}>
        <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
          {state.status === 'error' ? 'Couldn’t load jobs right now' : 'No jobs found'}
        </p>
        <p style={{ fontSize: 14 }}>
          {state.status === 'error' ? 'Please try refreshing the page.' : 'Try adjusting your search or filters.'}
        </p>
        <Link href="/jobs" style={{ fontSize: 14, color: '#2A2623', textDecoration: 'underline', textDecorationColor: '#CCC5B6' }}>
          Clear all filters
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {state.items.map((job) => {
        const loc = formatLocation(job.location);
        const pay = formatPay(job);
        const jobType = job.employmentType === 'full-time' ? 'Full-time' : job.employmentType === 'part-time' ? 'Part-time' : null;
        const boardSlug = job.company?.publicUrl || job.company?._id;
        return (
          <div
            key={job._id}
            className="bg-tertiary-hover"
            style={{
              background: '#fff',
              border: '1px solid #E2DDD2',
              borderRadius: 12,
              padding: 16,
              color: 'inherit',
            }}
          >
            <Link href={`/jobs/${job._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <h2 className="text-ellipsis-1" style={{ fontSize: 20, fontWeight: 500, color: '#2A2623', margin: '0 0 4px' }}>
                {job.title}
              </h2>
              {job.company?.name && (
                <p style={{ fontSize: 12, color: '#6B6560', margin: '0 0 12px' }}>
                  <span className="weight-600">{job.company.name}</span>
                  {job.category ? <span className="text-secondary"> / {job.category}</span> : null}
                </p>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 12, color: '#6B6560' }}>
                {loc && <span>{loc}</span>}
                {pay && <span>{pay}</span>}
                {jobType && <span>{jobType}</span>}
              </div>
            </Link>
            {boardSlug && (
              <div className="pt-2 mt-2 flex justify-end" style={{ borderTop: '1px solid #EEEBE3' }}>
                <Link
                  href={`/${boardSlug}/${job._id}#application-form`}
                  className="btn btn-xs px-3 btn-brand btn-filled"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  APPLY NOW
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
