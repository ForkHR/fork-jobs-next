'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Dropdown, InputSearch } from '../../components';

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
      router.push(`/boards?${params.toString()}`, { scroll: false });
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

  return (
    <div className="jobs-filters">
      <InputSearch
        placeholder="Search company name"
        value={q}
        onChange={(e) => handleSearch(e.target.value)}
        clearable
        className="mb-2"
      />

      <div className="jobs-filters__row">
        <div className="fs-12 weight-500 px-2">
          {totalResults} results for {q ? `"${q}"` : 'all boards'}
        </div>
        <Dropdown
          widthUnset
          closeOnSelect
          label={sort === 'jobs' ? 'Most Jobs' : sort === 'name' ? 'Name' : 'Sort'}
        >
          <Button
            variant="text"
            fullWidth
            label="Most jobs"
            className="w-100 justify-start"
            borderRadius="md"
            type={sort === 'jobs' ? 'brand' : 'secondary'}
            onClick={() => {
              handleSort('jobs');
            }}
          />
          <Button
            variant="text"
            fullWidth
            label="Name"
            className="w-100 justify-start"
            borderRadius="md"
            type={sort === 'name' ? 'brand' : 'secondary'}
            onClick={() => {
              handleSort('name');
            }}
          />
        </Dropdown>
      </div>

      <style jsx>{`
        .jobs-filters {
          margin-bottom: 12px;
        }
        .jobs-filters__row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
}
