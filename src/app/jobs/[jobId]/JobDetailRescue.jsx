'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getListingByIdClient } from '../../../lib/clientJobBoard';

// Rendered when the server-side listing fetch failed for a non-404 reason.
// Resolves the listing from the visitor's browser and forwards them to the
// company-board version of the page, which loads client-side.
export default function JobDetailRescue({ jobId }) {
  const router = useRouter();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getListingByIdClient(jobId);
        const listing = data?.listing;
        const company = data?.company || listing?.company;
        const boardSlug = company?.publicUrl || company?._id;
        if (!cancelled && listing && boardSlug) {
          router.replace(`/${boardSlug}/${listing._id || jobId}`);
          return;
        }
        if (!cancelled) setFailed(true);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => { cancelled = true; };
  }, [jobId, router]);

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: 8, color: '#8A8480', fontSize: 14, textAlign: 'center', padding: 24 }}>
      {failed ? (
        <>
          <p style={{ fontSize: 16, fontWeight: 500, color: '#2A2623', margin: 0 }}>This job isn’t available right now</p>
          <p style={{ margin: 0 }}>It may have been filled or removed.</p>
          <Link href="/jobs" style={{ color: '#2A2623', textDecoration: 'underline', textDecorationColor: '#CCC5B6' }}>
            Browse open jobs
          </Link>
        </>
      ) : (
        'Loading…'
      )}
    </main>
  );
}
