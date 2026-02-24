import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getJobListingByIdCached } from '../../../lib/jobBoardData';
import { getSiteUrl } from '../../../lib/siteUrl';
import JobApplySection from './JobApplySection';
import ShareJobButton from './ShareJobButton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const stripHtml = (html) => {
  if (!html) return '';
  return String(html)
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

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
      stripHtml(listing.description)?.slice(0, 160) ||
      `Apply for ${listing.title} at ${companyName} on Fork Jobs.`;

    const publicS3 = process.env.NEXT_PUBLIC_PUBLIC_S3_API_URL || process.env.PUBLIC_S3_API_URL;
    const logoUrl =
      company?.logo && publicS3 ? `${String(publicS3).replace(/\/+$/, '')}/${company.logo}` : undefined;

    return {
      title,
      description,
      alternates: { canonical: `/jobs/${jobId}` },
      openGraph: {
        type: 'website',
        title,
        description,
        url: `/jobs/${jobId}`,
        images: logoUrl
          ? [{ url: logoUrl, alt: `${companyName} logo` }]
          : [{ url: '/assets/og-image.png', width: 1200, height: 750, alt: title }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: logoUrl ? [logoUrl] : ['/assets/og-image.png'],
      },
    };
  } catch {
    return { title: 'Job Not Found' };
  }
}

const formatPay = (listing) => {
  if (!listing.payRateFrom || listing.payRateFrom <= 0) return null;
  let pay = `$${listing.payRateFrom}`;
  if (listing.payRateTo > listing.payRateFrom) pay += ` – $${listing.payRateTo}`;
  if (listing.payType === 'hourly') pay += ' / hour';
  else if (listing.payType === 'salary') pay += ' / year';
  return pay;
};

const formatLocation = (loc) => {
  if (!loc) return null;
  const parts = [loc.name, loc.address, loc.city, loc.state].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : null;
};

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return null;
  }
};

export default async function JobDetailPage({ params }) {
  const { jobId } = await params;
  if (!jobId) notFound();

  let data;
  try {
    data = await getJobListingByIdCached(jobId);
  } catch (e) {
    if (e?.status === 404 || e?.response?.status === 404) notFound();
    data = null;
  }

  const listing = data?.listing;
  const company = data?.company || listing?.company;

  if (!listing) notFound();

  const siteUrl = getSiteUrl();
  const companyName = company?.name || 'Company';
  const location = formatLocation(listing.location);
  const pay = formatPay(listing);
  const postedDate = formatDate(listing.createdAt);
  const publicS3 = process.env.NEXT_PUBLIC_PUBLIC_S3_API_URL || process.env.PUBLIC_S3_API_URL;
  const logoUrl =
    company?.logo && publicS3 ? `${String(publicS3).replace(/\/+$/, '')}/${company.logo}` : undefined;

  // Schema.org: BreadcrumbList
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Jobs', item: `${siteUrl}/jobs` },
      { '@type': 'ListItem', position: 3, name: listing.title, item: `${siteUrl}/jobs/${jobId}` },
    ],
  };

  // Schema.org: JobPosting
  const jobPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: listing.title,
    description: stripHtml(listing.description) || listing.title,
    datePosted: listing.createdAt,
    employmentType:
      listing.employmentType === 'full-time'
        ? 'FULL_TIME'
        : listing.employmentType === 'part-time'
          ? 'PART_TIME'
          : undefined,
    hiringOrganization: {
      '@type': 'Organization',
      name: companyName,
      sameAs: company?.publicUrl ? `${siteUrl}/boards/${company.publicUrl}` : undefined,
      logo: logoUrl || undefined,
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
    <main style={{ fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, sans-serif", 
        maxWidth: 900,
        width: '100%',
        margin: '0 auto', }} className="animation-fade-in"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav style={{ padding: '24px 32px 0' }}>
        <ol style={{ display: 'flex', gap: 8, listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#A9A49E' }}>
          <li><Link href="/" style={{ color: '#8A8480', textDecoration: 'none' }}>Home</Link></li>
          <li>/</li>
          <li><Link href="/jobs" style={{ color: '#8A8480', textDecoration: 'none' }}>Jobs</Link></li>
          <li>/</li>
          <li style={{ color: '#2A2623', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
            {listing.title}
          </li>
        </ol>
      </nav>

      <div style={{ padding: '24px 24px 64px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${companyName} logo`}
              width={56}
              height={56}
              style={{ borderRadius: 12, border: '1px solid #E2DDD2', objectFit: 'cover', flexShrink: 0 }}
            />
          ) : (
            <div style={{
              width: 56, height: 56, borderRadius: 12, background: '#F0EDE6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 700, color: '#A9A49E', flexShrink: 0,
            }}>
              {companyName.charAt(0)}
            </div>
          )}
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2A2623', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
              {listing.title}
            </h1>
            <p style={{ fontSize: 15, color: '#6B6560', margin: 0 }}>
              {company?.publicUrl ? (
                <Link
                  href={`/boards/${company.publicUrl}`}
                  style={{ color: '#2A2623', textDecoration: 'underline', textDecorationColor: '#CCC5B6', textUnderlineOffset: 2 }}
                >
                  {companyName}
                </Link>
              ) : (
                companyName
              )}
            </p>
          </div>
        </div>

        {/* Meta chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          {listing.employmentType && (
            <span style={{ padding: '6px 14px', fontSize: 13, fontWeight: 500, background: '#F0EDE6', borderRadius: 999, color: '#6B6560' }}>
              {listing.employmentType === 'full-time' ? 'Full-time' : 'Part-time'}
            </span>
          )}
          {location && (
            <span style={{ padding: '6px 14px', fontSize: 13, fontWeight: 500, background: '#F0EDE6', borderRadius: 999, color: '#6B6560' }}>
              📍 {location}
            </span>
          )}
          {pay && (
            <span style={{ padding: '6px 14px', fontSize: 13, fontWeight: 500, background: '#F0EDE6', borderRadius: 999, color: '#6B6560' }}>
              💰 {pay}
            </span>
          )}
          {listing.category && (
            <span style={{ padding: '6px 14px', fontSize: 13, fontWeight: 500, background: '#F0EDE6', borderRadius: 999, color: '#6B6560' }}>
              {listing.category}
            </span>
          )}
          {postedDate && (
            <span style={{ padding: '6px 14px', fontSize: 13, fontWeight: 500, background: '#F0EDE6', borderRadius: 999, color: '#A9A49E' }}>
              Posted {postedDate}
            </span>
          )}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
          <a
            href={
              company?.publicUrl
                ? `/${company.publicUrl}/${listing._id}#application-form`
                : `/${listing.company?._id || listing.company}/${listing._id}#application-form`
            }
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '12px 24px', fontSize: 15, fontWeight: 600, color: '#fff',
              background: 'var(--color-brand)', borderRadius: 999, textDecoration: 'none',
            }}
          >
            Apply Now
          </a>
        </div>

        {/* Job description */}
        {listing.description && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#2A2623', margin: '0 0 16px' }}>
              Description
            </h2>
            <div
              className="job-description-content"
              dangerouslySetInnerHTML={{ __html: listing.description }}
              style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: '#6B6560',
              }}
            />
          </div>
        )}

        {/* Related links */}
        <div style={{
          borderTop: '1px solid #E2DDD2',
          paddingTop: 24,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          fontSize: 14,
        }}>
          <ShareJobButton jobUrl={`${siteUrl}/jobs/${jobId}`} jobTitle={listing.title} />
            <Link href={`/${company?.publicUrl || company._id}`} style={{ color: '#8A8480', textDecoration: 'underline', textDecorationColor: '#CCC5B6' }} target="_blank" rel="noopener noreferrer">
              More jobs at {companyName}
            </Link>
        </div>
      </div>

      <style>{`
        .job-description-content h1,
        .job-description-content h2,
        .job-description-content h3 {
          font-size: 16px;
          font-weight: 600;
          color: #2A2623;
          margin: 24px 0 8px;
        }
        .job-description-content p {
          margin: 0 0 12px;
        }
        .job-description-content ul,
        .job-description-content ol {
          padding-left: 20px;
          margin: 0 0 12px;
        }
        .job-description-content li {
          margin-bottom: 4px;
        }
        .job-description-content a {
          color: #2A2623;
          text-decoration: underline;
        }
      `}</style>
    </main>
  );
}
