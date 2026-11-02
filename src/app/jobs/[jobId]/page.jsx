import { notFound } from 'next/navigation';
import { getCompanyJobsCached, getJobListingByIdCached } from '../../../lib/jobBoardData';
import JobDetailRescue from './JobDetailRescue';
import { getSiteUrl } from '../../../lib/siteUrl';
import { companySlug, getPublicS3, logoUrl, stripHtml } from '../../../lib/jobFormat';
import JobDetail from '../../../components/jobs/JobDetail';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { jobId } = await params;
  if (!jobId) return {};

  try {
    const data = await getJobListingByIdCached(jobId);
    const listing = data?.listing;
    const company = data?.company || listing?.company;
    if (!listing) return { title: 'Job Not Found' };

    const companyName = company?.name || 'Company';
    const title = `${listing.title} at ${companyName}`;
    const description =
      stripHtml(listing.description)?.slice(0, 160) || `Apply for ${listing.title} at ${companyName} on Fork Jobs.`;
    const logo = logoUrl(company);

    return {
      title,
      description,
      alternates: { canonical: `/jobs/${jobId}` },
      openGraph: {
        type: 'website',
        title,
        description,
        url: `/jobs/${jobId}`,
        images: logo
          ? [{ url: logo, alt: `${companyName} logo` }]
          : [{ url: '/assets/og-image.png', width: 1200, height: 750, alt: title }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: logo ? [logo] : ['/assets/og-image.png'],
      },
    };
  } catch {
    return { title: 'Job Not Found' };
  }
}

export default async function JobDetailPage({ params }) {
  const { jobId } = await params;
  if (!jobId) notFound();

  let data;
  let fetchFailed = false;
  try {
    data = await getJobListingByIdCached(jobId);
  } catch (e) {
    if (e?.status === 404 || e?.response?.status === 404) notFound();
    fetchFailed = true;
    data = null;
  }

  const listing = data?.listing;
  const company = data?.company || listing?.company;

  // A transient fetch failure (e.g. Cloudflare challenging SSR requests) is
  // not a 404 — let the visitor's browser resolve the listing instead.
  if (!listing && fetchFailed) return <JobDetailRescue jobId={jobId} />;
  if (!listing) notFound();

  // The company's other openings, for the bottom of the page. Best effort.
  let otherJobs = [];
  const slug = companySlug(company);
  if (slug) {
    try {
      const board = await getCompanyJobsCached(slug);
      otherJobs = Array.isArray(board?.listings) ? board.listings : [];
    } catch {
      otherJobs = [];
    }
  }

  const siteUrl = getSiteUrl();
  const companyName = company?.name || 'Company';
  const logo = logoUrl(company);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Jobs', item: `${siteUrl}/jobs` },
      { '@type': 'ListItem', position: 3, name: listing.title, item: `${siteUrl}/jobs/${jobId}` },
    ],
  };

  const jobPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: listing.title,
    description: stripHtml(listing.description) || listing.title,
    datePosted: listing.createdAt,
    employmentType:
      listing.employmentType === 'full-time' ? 'FULL_TIME' : listing.employmentType === 'part-time' ? 'PART_TIME' : undefined,
    hiringOrganization: {
      '@type': 'Organization',
      name: companyName,
      sameAs: company?.publicUrl ? `${siteUrl}/boards/${company.publicUrl}` : undefined,
      logo: logo || undefined,
    },
    jobLocation: listing.location?.city
      ? {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            streetAddress: listing.location.address || undefined,
            addressLocality: listing.location.city,
            addressRegion: listing.location.state || undefined,
          },
        }
      : undefined,
    baseSalary:
      listing.payRateFrom > 0
        ? {
            '@type': 'MonetaryAmount',
            currency: 'USD',
            value: {
              '@type': 'QuantitativeValue',
              value: listing.payRateFrom,
              ...(listing.payRateTo > listing.payRateFrom ? { maxValue: listing.payRateTo } : {}),
              unitText: listing.payType === 'hourly' ? 'HOUR' : listing.payType === 'salary' ? 'YEAR' : undefined,
            },
          }
        : undefined,
    directApply: true,
    url: `${siteUrl}/jobs/${jobId}`,
  };

  return (
    <main className="jb jb-main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd) }} />
      <JobDetail
        listing={listing}
        company={company}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Jobs', href: '/jobs' }, { label: listing.title }]}
        shareUrl={`${siteUrl}/jobs/${jobId}`}
        otherJobs={otherJobs}
        jobHrefFor={(job) => `/jobs/${job._id}`}
        publicS3={getPublicS3()}
      />
    </main>
  );
}
