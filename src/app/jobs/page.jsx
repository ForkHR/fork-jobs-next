import { searchJobListingsCached } from '../../lib/jobBoardData';
import { getSiteUrl } from '../../lib/siteUrl';
import { getPublicS3, itemsOf, stripHtml } from '../../lib/jobFormat';
import JobsSearchFilters from './JobsSearchFilters';
import JobsClientFallback from './JobsClientFallback';
import JobCard from '../../components/jobs/JobCard';
import Breadcrumb from '../../components/jobs/Breadcrumb';
import Pagination from '../../components/jobs/Pagination';
import { EmployerNote } from '../../components/jobs/EmployerBand';

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
      images: [
        {
          url: '/assets/og-image.png',
          width: 1200,
          height: 750,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/assets/og-image.png'],
    },
  };
}

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
    items = itemsOf(res);
    total = res?.total || res?.totalCount || items.length;
    pages = res?.pages || res?.totalPages || Math.ceil(total / LIMIT) || 1;
  } catch (err) {
    console.error('[JobsPage] Failed to fetch jobs:', err?.message || err, err?.status ? `(status ${err.status})` : '', err?.url || '');
    items = [];
  }

  const siteUrl = getSiteUrl();
  const publicS3 = getPublicS3();

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Jobs', item: `${siteUrl}/jobs` },
    ],
  };

  const jobPostingSchemas = items.map((job) => ({
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: stripHtml(job.description) || job.title,
    datePosted: job.createdAt,
    employmentType:
      job.employmentType === 'full-time' ? 'FULL_TIME' : job.employmentType === 'part-time' ? 'PART_TIME' : undefined,
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

  const typeLabel = type === 'full-time' ? 'Full-time' : type === 'part-time' ? 'Part-time' : '';
  const heading = typeLabel ? `${typeLabel} jobs` : 'Browse jobs';

  return (
    <main className="jb jb-main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {jobPostingSchemas.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchemas) }} />
      )}

      <div className="jb-wrap jb-wrap--narrow">
        <div className="jb-pagehead">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Jobs' }]} />
          <div className="jb-pagehead__row">
            <div>
              <h1>{heading}</h1>
              <p className="jb-lede">
                Every listing is posted by the business itself. Apply straight to the employer, no account needed.
              </p>
            </div>
          </div>
        </div>

        <JobsSearchFilters initialValues={{ q, employmentType: type, sort }} totalResults={total} />

        {items.length > 0 ? (
          <div className="jb-list">
            {items.map((job) => (
              <JobCard key={job._id} job={job} publicS3={publicS3} />
            ))}
          </div>
        ) : (
          /* Empty SSR result: retry from the visitor's browser (handles the Cloudflare
             challenge on server-side requests); the fallback draws the empty state itself. */
          <JobsClientFallback q={q} type={type} sort={sort} publicS3={publicS3} />
        )}

        <Pagination page={page} pages={pages} hrefFor={buildPageUrl} />

        <EmployerNote />
      </div>
    </main>
  );
}
