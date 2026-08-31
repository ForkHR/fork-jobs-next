'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { searchJobsClient } from '../lib/clientJobBoard';
import styles from './page.module.css';

const timeAgo = (dateStr) => {
  if (!dateStr) return null;
  const then = new Date(dateStr).getTime();
  if (Number.isNaN(then)) return null;
  const days = Math.floor((Date.now() - then) / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return weeks === 1 ? 'Last week' : `${weeks} weeks ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatAmount = (n) => (n >= 1000 ? `${Math.round(n / 1000)}k` : String(n));

const formatPay = (job) => {
  if (!job.payRateFrom || job.payRateFrom <= 0) return null;
  let pay = `$${formatAmount(job.payRateFrom)}`;
  if (job.payRateTo > job.payRateFrom) pay += `–$${formatAmount(job.payRateTo)}`;
  if (job.payType === 'hourly') pay += '/hr';
  else if (job.payType === 'salary') pay += '/yr';
  return pay;
};

// Rendered when the server couldn't load recent jobs. Refetches from the
// visitor's browser and renders the same rows as the server list.
export default function HomeJobsFallback({ publicS3 = '' }) {
  const [state, setState] = useState({ status: 'loading', items: [] });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await searchJobsClient({ limit: 8, sort: 'recent' });
        if (!cancelled) setState({ status: 'done', items: Array.isArray(res?.items) ? res.items : [] });
      } catch {
        if (!cancelled) setState({ status: 'error', items: [] });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (state.status === 'loading') {
    return <p style={{ color: '#8A8480', fontSize: 14, margin: 0 }}>Loading the latest openings…</p>;
  }

  if (state.items.length === 0) {
    return <p style={{ color: '#8A8480', fontSize: 14, margin: 0 }}>New positions are added daily — check back soon.</p>;
  }

  return (
    <ul className={styles.jobList}>
      {state.items.map((job) => {
        const pay = formatPay(job);
        const ago = timeAgo(job.createdAt);
        const city = job.location?.city
          ? `${job.location.city}${job.location.state ? `, ${job.location.state}` : ''}`
          : null;
        const logoUrl =
          job.company?.logo && publicS3 ? `${String(publicS3).replace(/\/+$/, '')}/${job.company.logo}` : null;
        return (
          <li key={job._id}>
            <Link href={`/jobs/${job._id}`} className={styles.jobRow}>
              {logoUrl ? (
                <img src={logoUrl} alt="" width={40} height={40} loading="lazy" className={styles.jobLogo} />
              ) : (
                <span className={styles.jobLogoFallback} aria-hidden="true">
                  {job.company?.name?.charAt(0) || '·'}
                </span>
              )}
              <span className={styles.jobMain}>
                <span className={styles.jobTitle}>{job.title}</span>
                <span className={styles.jobCompany}>
                  {job.company?.name}
                  {city ? ` · ${city}` : ''}
                  {job.employmentType
                    ? ` · ${job.employmentType === 'full-time' ? 'Full-time' : 'Part-time'}`
                    : ''}
                </span>
              </span>
              <span className={styles.jobSide}>
                {pay && <span className={styles.jobPay}>{pay}</span>}
                {ago && <span className={styles.jobAgo}>{ago}</span>}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
