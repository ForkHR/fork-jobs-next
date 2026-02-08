import Link from 'next/link';
import { searchJobListingsCached } from '../../lib/jobBoardData';
import { getSiteUrl } from '../../lib/siteUrl';
import JobsSearchFilters from './JobsSearchFilters';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const LIMIT = 20;

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const q = sp?.q || '';
  const type = sp?.type || '';

  let title = 'Browse Jobs — Fork Jobs';
  let description =
    'Browse open job listings from companies hiring on Fork. Find barista jobs, restaurant jobs, retail positions, and more — apply directly.';

  if (q) {
    title = `${q} Jobs — Fork Jobs`;
    description = `Search results for "${q}" on Fork Jobs. Find and apply to open positions directly on company job boards.`;
  }
  if (type) {
    const typeLabel = type === 'full-time' ? 'Full-time' : 'Part-time';
    title = q ? `${q} ${typeLabel} Jobs — Fork Jobs` : `${typeLabel} Jobs — Fork Jobs`;
  }

  return {
    title,
    description,
    alternates: { canonical: '/jobs' },
    openGraph: {
      type: 'website',
      title,
      description,
      url: '/jobs',
    },
  };
}

const stripHtml = (html) => {
  if (!html) return '';
  return String(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const formatPay = (job) => {
  if (!job.payRateFrom || job.payRateFrom <= 0) return null;
  let pay = `$${job.payRateFrom}`;
  if (job.payRateTo > job.payRateFrom) pay += `–$${job.payRateTo}`;
  if (job.payType === 'hourly') pay += '/hr';
  else if (job.payType === 'salary') pay += '/yr';
  return pay;
};

const formatLocation = (loc) => {
  if (!loc) return null;
  const parts = [loc.city, loc.state].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : loc.name || null;
};

const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
};

export default async function JobsPage({ searchParams }) {
  const sp = await searchParams;
  const q = sp?.q || '';
  const type = sp?.type || '';
  const sort = sp?.sort || 'recent';
  const page = Math.max(parseInt(sp?.page, 10) || 1, 1);

  let items = [];
  let total = 0;
  let pages = 1;

  try {
    const params = { limit: LIMIT, page, sort };
    if (q) params.q = q;
    if (type) params.employmentType = type;

    const res = await searchJobListingsCached(params);
    items = Array.isArray(res?.items)
      ? res.items
      : Array.isArray(res?.listings)
        ? res.listings
        : Array.isArray(res?.results)
          ? res.results
          : Array.isArray(res)
            ? res
            : [];
    total = res?.total || res?.totalCount || items.length;
    pages = res?.pages || res?.totalPages || Math.ceil(total / LIMIT) || 1;
  } catch (err) {
    console.error('[JobsPage] Failed to fetch jobs:', err?.message || err, err?.status ? `(status ${err.status})` : '', err?.url || '');
    items = [];
  }

  const siteUrl = getSiteUrl();

  // BreadcrumbList schema
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Jobs', item: `${siteUrl}/jobs` },
    ],
  };

  // JobPosting schemas for each visible listing
  const jobPostingSchemas = items.map((job) => ({
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: stripHtml(job.description) || job.title,
    datePosted: job.createdAt,
    validThrough: undefined,
    employmentType:
      job.employmentType === 'full-time'
        ? 'FULL_TIME'
        : job.employmentType === 'part-time'
          ? 'PART_TIME'
          : undefined,
    hiringOrganization: job.company
      ? {
          '@type': 'Organization',
          name: job.company.name,
          sameAs: job.company.publicUrl ? `${siteUrl}/boards/${job.company.publicUrl}` : undefined,
        }
      : undefined,
    jobLocation: job.location?.city
      ? {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: job.location.city,
            addressRegion: job.location.state || undefined,
          },
        }
      : undefined,
    baseSalary:
      job.payRateFrom > 0
        ? {
            '@type': 'MonetaryAmount',
            currency: 'USD',
            value: {
              '@type': 'QuantitativeValue',
              value: job.payRateFrom,
              ...(job.payRateTo > job.payRateFrom ? { maxValue: job.payRateTo } : {}),
              unitText: job.payType === 'hourly' ? 'HOUR' : job.payType === 'salary' ? 'YEAR' : undefined,
            },
          }
        : undefined,
    directApply: true,
    url: `${siteUrl}/jobs/${job._id}`,
  }));

  const buildPageUrl = (p) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (type) params.set('type', type);
    if (sort && sort !== 'recent') params.set('sort', sort);
    if (p > 1) params.set('page', String(p));
    const qs = params.toString();
    return `/jobs${qs ? `?${qs}` : ''}`;
  };

  return (
    <main style={{ fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", 
        maxWidth: 648,
        width: '100%',
        margin: '0 auto', }} className="animation-fade-in"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {jobPostingSchemas.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchemas) }}
        />
      )}

      {/* Breadcrumb */}
      <nav style={{ padding: '16px 24px 0' }}>
        <ol style={{ display: 'flex', gap: 8, listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#94a3b8' }}>
          <li><Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link></li>
          <li>/</li>
          <li style={{ color: '#000000', fontWeight: 500 }}>Jobs</li>
        </ol>
      </nav>

      <div style={{ padding: '24px 24px 64px' }}>
        <JobsSearchFilters initialValues={{ q, employmentType: type, sort }}
          totalResults={total}
        />

        {/* Job listings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((job) => {
            const loc = formatLocation(job.location);
            const pay = formatPay(job);
            const ago = timeAgo(job.createdAt);
            const desc = stripHtml(job.description);
            const publicS3 = process.env.NEXT_PUBLIC_PUBLIC_S3_API_URL || process.env.PUBLIC_S3_API_URL;
            const logoUrl =
              job.company?.logo && publicS3
                ? `${String(publicS3).replace(/\/+$/, '')}/${job.company.logo}`
                : null;

            return (
              <Link
                key={job._id}
                href={`/jobs/${job._id}`}
                className="bg-tertiary-hover"
                style={{
                  display: 'block',
                  background: '#fff',
                  border: '1px solid #f1f5f9',
                  borderRadius: 12,
                  padding: 20,
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={`${job.company?.name || 'Company'} logo`}
                        width={44}
                        height={44}
                        style={{ borderRadius: 10, objectFit: 'cover', border: '1px solid #f1f5f9', flexShrink: 0 }}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 10,
                          background: '#f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 16,
                          fontWeight: 700,
                          color: '#94a3b8',
                          flexShrink: 0,
                        }}
                      >
                        {job.company?.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div>
                      <h2 style={{ fontSize: 16, fontWeight: 600, color: '#000000', margin: '0 0 4px' }}>{job.title}</h2>
                    {job.company?.name && (
                      <p style={{ fontSize: 14, color: '#475569', margin: 0 }}>
                        {job.company.name}
                      </p>
                    )}
                    </div>
                  </div>
                  {job.employmentType && (
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#475569',
                      background: '#f1f5f9',
                      borderRadius: 999,
                      padding: '4px 10px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}>
                      {job.employmentType === 'full-time' ? 'Full-time' : 'Part-time'}
                    </span>
                  )}
                </div>

                {desc && (
                  <p style={{
                    fontSize: 13,
                    color: '#64748b',
                    lineHeight: 1.5,
                    margin: '0 0 10px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {desc.slice(0, 200)}
                  </p>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: '#94a3b8' }}>
                  {loc && <span>📍 {loc}</span>}
                  {pay && <span>💰 {pay}</span>}
                  {ago && <span>🕐 {ago}</span>}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty state */}
        {items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748b' }}>
            <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>No jobs found</p>
            <p style={{ fontSize: 14 }}>Try adjusting your search or filters.</p>
            <Link href="/jobs" style={{ fontSize: 14, color: '#000000', textDecoration: 'underline', textDecorationColor: '#cbd5e1' }}>
              Clear all filters
            </Link>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <nav style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }} aria-label="Pagination">
            {page > 1 && (
              <Link href={buildPageUrl(page - 1)} style={{
                padding: '8px 16px',
                fontSize: 14,
                fontWeight: 500,
                color: '#000000',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                textDecoration: 'none',
              }}>
                ← Previous
              </Link>
            )}
            <span style={{ padding: '8px 16px', fontSize: 14, color: '#64748b' }}>
              Page {page} of {pages}
            </span>
            {page < pages && (
              <Link href={buildPageUrl(page + 1)} style={{
                padding: '8px 16px',
                fontSize: 14,
                fontWeight: 500,
                color: '#000000',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                textDecoration: 'none',
              }}>
                Next →
              </Link>
            )}
          </nav>
        )}
      </div>
    </main>
  );
}
