'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button, InputSearch } from '../components';

export default function HomeSearchClient() {
  const router = useRouter();
  const [q, setQ] = useState('');

  return (
    <form
      className="flex gap-2 flex-wrap align-center"
      onSubmit={(e) => {
        e.preventDefault();
        const value = String(q || '').trim();
        router.push(value ? `/search?q=${encodeURIComponent(value)}&type=jobs` : '/search');
      }}
    >
      <div className="flex-1 w-min-260-px">
        <InputSearch placeholder="Search jobs or companies" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <Button label="Search" variant="filled" type="brand" />
    </form>
  );
}
