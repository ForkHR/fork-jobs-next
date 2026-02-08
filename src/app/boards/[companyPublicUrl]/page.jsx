import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCompanyJobsCached } from '../../../lib/jobBoardData';
import { getSiteUrl } from '../../../lib/siteUrl';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const stripHtml = (html) => {
  if (!html) return '';
  return String(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const formatPay = (listing) => {
  if (!listing.payRateFrom || listing.payRateFrom <= 0) return null;
  let pay = `$${listing.payRateFrom}`;
  if (listing.payRateTo > listing.payRateFrom) pay += `–$${listing.payRateTo}`;
  if (listing.payType === 'hourly') pay += '/hr';
  else if (listing.payType === 'salary') pay += '/yr';
  return pay;
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

const formatLocation = (loc) => {
  if (!loc) return null;
  const parts = [loc.city, loc.state].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : loc.name || null;
};

export async function generateMetadata({ params }) {
  const { companyPublicUrl } = await params;
  if (!companyPublicUrl) return {};

  try {
    const data = await getCompanyJobsCached(companyPublicUrl);
    const company = data?.company;
    const listings = Array.isArray(data?.listings) ? data.listings : [];
    if (!company) return { title: 'Board Not Found' };

    const companyName = company?.name || 'Company';
    const jobCount = listings.length;
    const title = `${companyName} Job Board — ${jobCount} Open Position${jobCount !== 1 ? 's' : ''}`;
    const description =
      stripHtml(company?.description)?.slice(0, 160) ||
      `Explore ${jobCount} open job${jobCount !== 1 ? 's' : ''} at ${companyName}. Apply directly on their board.`;

    const publicS3 = process.env.NEXT_PUBLIC_PUBLIC_S3_API_URL || process.env.PUBLIC_S3_API_URL;
    const logoUrl =
      company?.logo && publicS3 ? `${String(publicS3).replace(/\/+$/, '')}/${company.logo}` : undefined;

    return {
      title,
      description,
      alternates: { canonical: `/boards/${companyPublicUrl}` },
      openGraph: {
        type: 'website',
        title,
        description,
        url: `/boards/${companyPublicUrl}`,
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
    return { title: 'Board Not Found' };
  }
}

export default async function BoardDetailPage({ params }) {
  const { companyPublicUrl } = await params;
  if (!companyPublicUrl) notFound();

  let data;
  try {
    data = await getCompanyJobsCached(companyPublicUrl);
  } catch (e) {
    if (e?.status === 404 || e?.response?.status === 404) notFound();
    data = null;
  }

  const company = data?.company;
  const listings = Array.isArray(data?.listings) ? data.listings : [];

  if (!company) notFound();

  const companyName = company?.name || 'Company';
  const siteUrl = getSiteUrl();
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
    ],
  };

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: companyName,
    url: `${siteUrl}/boards/${companyPublicUrl}`,
    logo: logoUrl || undefined,
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: listings.map((l, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${siteUrl}/boards/${companyPublicUrl}/${l?._id}`,
      name: l?.title,
    })),
  };

  return (
    <main style={{ fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", 
        maxWidth: 648,
        width: '100%',
        margin: '0 auto', }} className="animation-fade-in"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, orgJsonLd, itemListJsonLd]) }}
      />

      <nav style={{ padding: '24px 24px 0' }}>
        <ol style={{ display: 'flex', gap: 8, listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#94a3b8' }}>
          <li><Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link></li>
          <li>/</li>
          <li><Link href="/boards" style={{ color: '#64748b', textDecoration: 'none' }}>Boards</Link></li>
          <li>/</li>
          <li style={{ color: '#000000', fontWeight: 500 }}>{companyName}</li>
        </ol>
      </nav>

      <div style={{ padding: '24px 24px 64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
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
              {companyName}
            </h1>
            <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
              {listings.length} open {listings.length === 1 ? 'position' : 'positions'}
            </p>
          </div>
        </div>

        {company?.description && (
          <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: '0 0 24px' }}>
            {stripHtml(company.description).slice(0, 240) + (stripHtml(company.description).length > 240 ? '…' : '')}
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {listings.map((listing) => {
            const loc = formatLocation(listing.location);
            const pay = formatPay(listing);
            const ago = timeAgo(listing.createdAt);

            return (
              <Link
                key={listing._id}
                href={`/boards/${companyPublicUrl}/${listing._id}`}
                className="bg-tertiary-hover"
                style={{
                  display: 'block',
                  background: '#fff',
                  border: '1px solid #f1f5f9',
                  borderRadius: 12,
                  padding: 20,
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div>
                    <h2 style={{ fontSize: 16, fontWeight: 600, color: '#000000', margin: '0 0 4px' }}>
                      {listing.title}
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 13, color: '#94a3b8' }}>
                      {loc && <span>📍 {loc}</span>}
                      {pay && <span>💰 {pay}</span>}
                      {ago && <span>🕐 {ago}</span>}
                    </div>
                  </div>
                  {listing.employmentType && (
                    <span style={{
                      fontSize: 11, fontWeight: 600, color: '#475569',
                      background: '#f1f5f9', borderRadius: 999, padding: '4px 10px',
                      whiteSpace: 'nowrap', flexShrink: 0,
                    }}>
                      {listing.employmentType === 'full-time' ? 'Full-time' : 'Part-time'}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {listings.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748b' }}>
            <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>No open positions</p>
            <p style={{ fontSize: 14 }}>This company doesn&apos;t have any active job listings right now.</p>
          </div>
        )}
      </div>
    </main>
  );
}
