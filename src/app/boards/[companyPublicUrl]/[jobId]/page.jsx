import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCompanyAndListingCached } from '../../../../lib/jobBoardData';
import { getSiteUrl } from '../../../../lib/siteUrl';

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

export async function generateMetadata({ params }) {
  const { companyPublicUrl, jobId } = await params;
  if (!companyPublicUrl || !jobId) return {};

  try {
    const data = await getCompanyAndListingCached(companyPublicUrl, jobId);
    const listing = data?.listing;
    const company = data?.company;
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
      alternates: { canonical: `/boards/${companyPublicUrl}/${jobId}` },
      openGraph: {
        type: 'website',
        title,
        description,
        url: `/boards/${companyPublicUrl}/${jobId}`,
        images: logoUrl ? [{ url: logoUrl, alt: `${companyName} logo` }] : undefined,
      },
      twitter: {
        card: 'summary',
        title,
        description,
        images: logoUrl ? [logoUrl] : undefined,
      },
    };
  } catch {
    return { title: 'Job Not Found' };
  }
}

export default async function BoardJobDetailPage({ params }) {
  const { companyPublicUrl, jobId } = await params;
  if (!companyPublicUrl || !jobId) notFound();

  let data;
  try {
    data = await getCompanyAndListingCached(companyPublicUrl, jobId);
  } catch (e) {
    if (e?.status === 404 || e?.response?.status === 404) notFound();
    data = null;
  }

  const listing = data?.listing;
  const company = data?.company;

  if (!listing || !company) notFound();

  const siteUrl = getSiteUrl();
  const companyName = company?.name || 'Company';
  const location = formatLocation(listing.location);
  const pay = formatPay(listing);
  const publicS3 = process.env.NEXT_PUBLIC_PUBLIC_S3_API_URL || process.env.PUBLIC_S3_API_URL;
  const logoUrl =
    company?.logo && publicS3 ? `${String(publicS3).replace(/\/+$/, '')}/${company.logo}` : undefined;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Boards', item: `${siteUrl}/boards` },
      { '@type': 'ListItem', position: 3, name: companyName, item: `${siteUrl}/boards/${companyPublicUrl}` },
      { '@type': 'ListItem', position: 4, name: listing.title, item: `${siteUrl}/boards/${companyPublicUrl}/${jobId}` },
    ],
  };

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
      sameAs: `${siteUrl}/boards/${companyPublicUrl}`,
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
    url: `${siteUrl}/boards/${companyPublicUrl}/${jobId}`,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd) }}
      />

      <nav style={{ padding: '24px 24px 0' }}>
        <ol style={{ display: 'flex', gap: 8, listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#94a3b8' }}>
          <li><Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link></li>
          <li>/</li>
          <li><Link href="/boards" style={{ color: '#64748b', textDecoration: 'none' }}>Boards</Link></li>
          <li>/</li>
          <li><Link href={`/boards/${companyPublicUrl}`} style={{ color: '#64748b', textDecoration: 'none' }}>{companyName}</Link></li>
          <li>/</li>
          <li style={{ color: '#000000', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
            {listing.title}
          </li>
        </ol>
      </nav>

      <div style={{ padding: '24px 24px 64px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${companyName} logo`}
              width={56}
              height={56}
              style={{ borderRadius: 12, border: '1px solid #f1f5f9', objectFit: 'cover', flexShrink: 0 }}
            />
          ) : (
            <div style={{
              width: 56, height: 56, borderRadius: 12, background: '#f1f5f9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 700, color: '#94a3b8', flexShrink: 0,
            }}>
              {companyName.charAt(0)}
            </div>
          )}
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#000000', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
              {listing.title}
            </h1>
            <p style={{ fontSize: 15, color: '#475569', margin: 0 }}>
              <Link
                href={`/boards/${companyPublicUrl}`}
                style={{ color: '#000000', textDecoration: 'underline', textDecorationColor: '#cbd5e1', textUnderlineOffset: 2 }}
              >
                {companyName}
              </Link>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          {listing.employmentType && (
            <span style={{ padding: '6px 14px', fontSize: 13, fontWeight: 500, background: '#f1f5f9', borderRadius: 999, color: '#475569' }}>
              {listing.employmentType === 'full-time' ? 'Full-time' : 'Part-time'}
            </span>
          )}
          {location && (
            <span style={{ padding: '6px 14px', fontSize: 13, fontWeight: 500, background: '#f1f5f9', borderRadius: 999, color: '#475569' }}>
              📍 {location}
            </span>
          )}
          {pay && (
            <span style={{ padding: '6px 14px', fontSize: 13, fontWeight: 500, background: '#f1f5f9', borderRadius: 999, color: '#475569' }}>
              💰 {pay}
            </span>
          )}
          {listing.category && (
            <span style={{ padding: '6px 14px', fontSize: 13, fontWeight: 500, background: '#f1f5f9', borderRadius: 999, color: '#475569' }}>
              {listing.category}
            </span>
          )}
          {listing?.createdAt && (
            <span style={{ padding: '6px 14px', fontSize: 13, fontWeight: 500, background: '#f1f5f9', borderRadius: 999, color: '#94a3b8' }}>
              Posted {new Date(listing.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
          <a
            href={company?.publicUrl ? `/${company.publicUrl}/${listing._id}` : `/${listing.company?._id || listing.company}/${listing._id}`}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '12px 28px', fontSize: 15, fontWeight: 600, color: '#fff',
              background: '#000000', borderRadius: 999, textDecoration: 'none',
            }}
          >
            Apply Now
          </a>
        </div>

        {listing.description && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#000000', margin: '0 0 16px' }}>Job Description</h2>
            <div
              className="job-description-content"
              dangerouslySetInnerHTML={{ __html: listing.description }}
              style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: '#475569',
              }}
            />
          </div>
        )}

        <div style={{
          borderTop: '1px solid #f1f5f9',
          paddingTop: 24,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          fontSize: 14,
        }}>
          <Link href={`/boards/${companyPublicUrl}`} style={{ color: '#64748b', textDecoration: 'underline', textDecorationColor: '#cbd5e1' }}>
            ← Back to board
          </Link>
          <Link href="/boards" style={{ color: '#64748b', textDecoration: 'underline', textDecorationColor: '#cbd5e1' }}>
            Browse all boards
          </Link>
        </div>
      </div>

      <style>{`
        .job-description-content h1,
        .job-description-content h2,
        .job-description-content h3 {
          font-size: 16px;
          font-weight: 600;
          color: #000000;
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
          color: #000000;
          text-decoration: underline;
        }
      `}</style>
    </main>
  );
}
