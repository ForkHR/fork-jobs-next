'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import SearchBox from '../../components/jobs/SearchBox';

const SORTS = [
  ['jobs', 'Most openings'],
  ['name', 'A to Z'],
];

export default function BoardsSearchFilters({ initialValues, totalResults }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef(null);

  const [q, setQ] = useState(initialValues?.q || '');
  const [sort, setSort] = useState(initialValues?.sort || 'jobs');

  const pushParams = useCallback(
    (overrides = {}) => {
      const params = new URLSearchParams();
      const vals = { q, sort, ...overrides };
      if (vals.q) params.set('q', vals.q);
      if (vals.sort && vals.sort !== 'jobs') params.set('sort', vals.sort);
      const qs = params.toString();
      router.push(`/boards${qs ? `?${qs}` : ''}`, { scroll: false });
    },
    [q, sort, router]
  );

  const handleSearch = (value) => {
    setQ(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => pushParams({ q: value }), 400);
  };

  const handleSort = (value) => {
    setSort(value);
    pushParams({ sort: value });
  };

  useEffect(() => {
    setQ(searchParams.get('q') || '');
    setSort(searchParams.get('sort') || 'jobs');
  }, [searchParams]);

  const n = Number(totalResults) || 0;

  return (
    <div className="jb-toolbar">
      <SearchBox value={q} onChange={handleSearch} placeholder="Search by company name" label="Search companies" />

      <div className="jb-toolbar__row">
        <div className="jb-chips" role="group" aria-label="Sort">
          {SORTS.map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`jb-chip${sort === value ? ' jb-chip--on' : ''}`}
              aria-pressed={sort === value}
              onClick={() => handleSort(value)}
            >
              {label}
            </button>
          ))}
        </div>
        {n > 0 && (
          <p className="jb-results" aria-live="polite">
            <b>{n.toLocaleString('en-US')}</b> {n === 1 ? 'company' : 'companies'}
            {q ? ` for “${q}”` : ''}
            {q && <Link href="/boards">Clear</Link>}
          </p>
        )}
      </div>
    </div>
  );
}
