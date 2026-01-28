'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button, InputSearch } from '../../components';

export default function SearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQ = searchParams.get('q') || '';
  const initialType = searchParams.get('type') || 'jobs';

  const [q, setQ] = useState(initialQ);
  const [type, setType] = useState(initialType === 'companies' ? 'companies' : 'jobs');

  const nextHref = useMemo(() => {
    const sp = new URLSearchParams(searchParams.toString());
    if (q) sp.set('q', q);
    else sp.delete('q');
    sp.set('type', type);
    sp.delete('page');
    return `/search?${sp.toString()}`;
  }, [q, type, searchParams]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 flex-wrap">
        <Button
          label="Jobs"
          variant={type === 'jobs' ? 'filled' : 'outline'}
          type={type === 'jobs' ? 'brand' : 'secondary'}
          onClick={() => {
            setType('jobs');
            const sp = new URLSearchParams(searchParams.toString());
            sp.set('type', 'jobs');
            sp.delete('page');
            router.push(`/search?${sp.toString()}`);
          }}
        />
        <Button
          label="Companies"
          variant={type === 'companies' ? 'filled' : 'outline'}
          type={type === 'companies' ? 'brand' : 'secondary'}
          onClick={() => {
            setType('companies');
            const sp = new URLSearchParams(searchParams.toString());
            sp.set('type', 'companies');
            sp.delete('page');
            router.push(`/search?${sp.toString()}`);
          }}
        />
      </div>

      <form
        className="flex gap-2 flex-wrap align-center"
        onSubmit={(e) => {
          e.preventDefault();
          router.push(nextHref);
        }}
      >
        <div className="flex-1 w-min-260-px">
          <InputSearch placeholder={type === 'jobs' ? 'Search jobs' : 'Search companies'} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Button label="Search" variant="filled" type="brand" />
      </form>
    </div>
  );
}
