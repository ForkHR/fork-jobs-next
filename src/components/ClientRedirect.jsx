'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Client-side redirect for pages whose server-side data fetch failed:
// the destination page loads its data from the visitor's browser instead.
export default function ClientRedirect({ to }) {
  const router = useRouter();

  useEffect(() => {
    if (to) router.replace(to);
  }, [to, router]);

  return (
    <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', color: '#8A8480', fontSize: 14 }}>
      Loading…
    </main>
  );
}
