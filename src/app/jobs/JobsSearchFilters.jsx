'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useRef, useState, useEffect } from 'react';
import { Button, Dropdown, InputSearch } from '../../components';

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
      // Reset to page 1 on filter change
      router.push(`/jobs?${params.toString()}`, { scroll: false });
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

  // Sync with URL on back/forward
  useEffect(() => {
    setQ(searchParams.get('q') || '');
    setEmploymentType(searchParams.get('type') || '');
    setSort(searchParams.get('sort') || 'recent');
  }, [searchParams]);

  return (
    <div className="jobs-filters">
        <InputSearch
          placeholder="Search jobs by title or keyword"
          value={q}
          onChange={(e) => handleSearch(e.target.value)}
          clearable
          className="mb-2"
        />

      <div className="jobs-filters__row">
        <div className="fs-12 weight-500 px-2">
          {totalResults} results for {q ? `"${q}"` : 'all jobs'}
        </div>
      <Dropdown
        widthUnset
        closeOnSelect
        label={sort === 'recent' ? 'Most Recent' : sort === 'created' ? 'Date Created' : 'Sort'}
      >
        <Button
          variant="text"
          fullWidth
          label="Most recent"
          className="w-100 justify-start"
          borderRadius="md"
          type={sort === 'recent' ? 'brand' : 'secondary'}
          onClick={() => {
            handleSort('recent');
          }}
        />
        <Button
          variant="text"
          fullWidth
          label="Date created"
          className="w-100 justify-start"
          borderRadius="md"
          type={sort === 'created' ? 'brand' : 'secondary'}
          onClick={() => {
            handleSort('created');
          }}
        />
      </Dropdown>
      </div>

      <style jsx>{`
        .jobs-filters {
          margin-bottom: 12px;
        }
        .jobs-filters__search {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 16px;
          margin-bottom: 12px;
          transition: border-color 0.2s;
        }
        .jobs-filters__search:focus-within {
          border-color: #000000;
        }
        .jobs-filters__input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 15px;
          font-family: inherit;
          color: #000000;
          background: transparent;
        }
        .jobs-filters__input::placeholder {
          color: #94a3b8;
        }
        .jobs-filters__row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .jobs-filters__chips {
          display: flex;
          gap: 8px;
        }
        .jobs-filter-chip {
          padding: 6px 14px;
          font-size: 13px;
          font-weight: 500;
          font-family: inherit;
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          background: #fff;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s;
        }
        .jobs-filter-chip:hover {
          border-color: #cbd5e1;
        }
        .jobs-filter-chip--active {
          background: #000000;
          color: #fff;
          border-color: #000000;
        }
        .jobs-filters__select {
          padding: 6px 12px;
          font-size: 13px;
          font-weight: 500;
          font-family: inherit;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          background: #fff;
          color: #475569;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
