'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import SearchBox, { SortSelect } from '../../components/jobs/SearchBox';

const TYPES = [
  ['', 'All jobs'],
  ['full-time', 'Full-time'],
  ['part-time', 'Part-time'],
];

const SORTS = [
  ['recent', 'Most recent'],
  ['created', 'Newest posted'],
];

export default function JobsSearchFilters({ initialValues, totalResults }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef(null);

  const [q, setQ] = useState(initialValues?.q || '');
  const [employmentType, setEmploymentType] = useState(initialValues?.employmentType || '');
  const [sort, setSort] = useState(initialValues?.sort || 'recent');

  const pushParams = useCallback(
    (overrides = {}) => {
      const params = new URLSearchParams();
      const vals = { q, employmentType, sort, ...overrides };
      if (vals.q) params.set('q', vals.q);
      if (vals.employmentType) params.set('type', vals.employmentType);
      if (vals.sort && vals.sort !== 'recent') params.set('sort', vals.sort);
      // Back to page 1 on every filter change.
      const qs = params.toString();
      router.push(`/jobs${qs ? `?${qs}` : ''}`, { scroll: false });
    },
    [q, employmentType, sort, router]
  );

  const handleSearch = (value) => {
    setQ(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => pushParams({ q: value }), 400);
  };

  const handleType = (value) => {
    setEmploymentType(value);
    pushParams({ employmentType: value });
  };

  const handleSort = (value) => {
    setSort(value);
    pushParams({ sort: value });
  };

  // Follow the URL on back / forward.
  useEffect(() => {
    setQ(searchParams.get('q') || '');
    setEmploymentType(searchParams.get('type') || '');
    setSort(searchParams.get('sort') || 'recent');
  }, [searchParams]);

  const filtered = Boolean(q || employmentType);
  const n = Number(totalResults) || 0;

  return (
    <div className="jb-toolbar">
      <SearchBox value={q} onChange={handleSearch} placeholder="Search by job title or keyword" label="Search jobs" />

      <div className="jb-toolbar__row">
        <div className="jb-chips" role="group" aria-label="Employment type">
          {TYPES.map(([value, label]) => (
            <button
              key={value || 'all'}
              type="button"
              className={`jb-chip${employmentType === value ? ' jb-chip--on' : ''}`}
              aria-pressed={employmentType === value}
              onClick={() => handleType(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <SortSelect value={sort} onChange={handleSort} options={SORTS} />
      </div>

      {n > 0 && (
        <p className="jb-results" aria-live="polite">
          <b>{n.toLocaleString('en-US')}</b> {n === 1 ? 'job' : 'jobs'}
          {q ? ` for “${q}”` : ''}
          {filtered && <Link href="/jobs">Clear filters</Link>}
        </p>
      )}
    </div>
  );
}
