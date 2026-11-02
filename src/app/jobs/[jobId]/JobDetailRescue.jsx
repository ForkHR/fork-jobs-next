'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getListingByIdClient } from '../../../lib/clientJobBoard';
import EmptyState from '../../../components/jobs/EmptyState';
import { DetailPageSkeleton } from '../../../components/jobs/Skeletons';

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
    return () => {
      cancelled = true;
    };
  }, [jobId, router]);

  if (!failed) return <DetailPageSkeleton />;

  return (
    <main className="jb jb-main">
      <div className="jb-wrap jb-wrap--narrow">
        <div className="jb-section">
          <EmptyState title="This job isn’t available right now" text="It may have been filled or taken down by the business.">
            <Link href="/jobs" className="jb-btn jb-btn--ink jb-btn--sm">
              Browse open jobs
            </Link>
          </EmptyState>
        </div>
      </div>
    </main>
  );
}
