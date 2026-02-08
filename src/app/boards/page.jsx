import Link from 'next/link';
import { searchJobBoardCompaniesCached } from '../../lib/jobBoardData';
import { getSiteUrl } from '../../lib/siteUrl';
import BoardsSearchFilters from './BoardsSearchFilters';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const LIMIT = 24;

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const q = sp?.q || '';

  const title = q ? `${q} Job Boards — Fork Jobs` : 'Company Job Boards — Fork Jobs';
  const description = q
    ? `Browse job boards matching "${q}" on Fork Jobs.`
    : 'Browse company-owned job boards on Fork Jobs. Apply directly to employers.';

  return {
    title,
    description,
    alternates: { canonical: '/boards' },
    openGraph: {
      type: 'website',
      title,
      description,
      url: '/boards',
    },
  };
}

export default async function BoardsPage({ searchParams }) {
  const sp = await searchParams;
  const q = sp?.q || '';
  const sort = sp?.sort || 'jobs';
  const page = Math.max(parseInt(sp?.page, 10) || 1, 1);

  let items = [];
  let total = 0;
  let pages = 1;

  try {
    const res = await searchJobBoardCompaniesCached({
      q,
      page,
      limit: LIMIT,
      sort,
    });

    items = Array.isArray(res?.items) ? res.items : [];
    total = res?.total || items.length;
    pages = res?.pages || Math.ceil(total / LIMIT) || 1;
  } catch {
    items = [];
  }

  const siteUrl = getSiteUrl();
  const publicS3 = process.env.NEXT_PUBLIC_PUBLIC_S3_API_URL || process.env.PUBLIC_S3_API_URL;

  const buildPageUrl = (p) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (sort && sort !== 'jobs') params.set('sort', sort);
    if (p > 1) params.set('page', String(p));
    const qs = params.toString();
    return `/boards${qs ? `?${qs}` : ''}`;
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Boards', item: `${siteUrl}/boards` },
    ],
  };

  const itemListJsonLd = items.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: items.map((company, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          url: `${siteUrl}/boards/${company?.publicUrl || company?._id}`,
          name: company?.name,
        })),
      }
    : null;

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
      {itemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      {/* Breadcrumb */}
      <nav style={{ padding: '24px 24px 0'}}>
          <ol style={{ display: 'flex', gap: 8, listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#94a3b8' }}>
          <li><Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link></li>
          <li>/</li>
          <li style={{ color: '#000000', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
              Boards
          </li>
          </ol>
      </nav>
      <div style={{ padding: '24px 24px 64px'}}>
        <BoardsSearchFilters initialValues={{ q, sort }} totalResults={total} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((company) => {
            const logoUrl =
              company?.logo && publicS3
                ? `${String(publicS3).replace(/\/+$/, '')}/${company.logo}`
                : null;
            const boardSlug = company?.publicUrl || company?._id;

            return (
              <Link
                key={company._id}
                href={`/boards/${boardSlug}`}
                className="bg-tertiary-hover"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 20,
                  background: '#fff',
                  border: '1px solid #f1f5f9',
                  borderRadius: 12,
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={`${company.name} logo`}
                    width={40}
                    height={40}
                    style={{ borderRadius: 10, objectFit: 'cover', border: '1px solid #f1f5f9', flexShrink: 0 }}
                    loading="lazy"
                  />
                ) : (
                  <div
                    style={{
                      width: 40,
                      height: 40,
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
                    {company?.name?.charAt(0) || '?'}
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>{company.name}</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>
                    {company.jobsCount} open {company.jobsCount === 1 ? 'position' : 'positions'}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748b' }}>
            <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>No boards found</p>
            <p style={{ fontSize: 14 }}>Try a different search term.</p>
          </div>
        )}

        {pages > 1 && (
          <nav style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }} aria-label="Pagination">
            {page > 1 && (
              <Link
                href={buildPageUrl(page - 1)}
                style={{
                  padding: '8px 16px',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#0f172a',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  textDecoration: 'none',
                }}
              >
                ← Previous
              </Link>
            )}
            <span style={{ padding: '8px 16px', fontSize: 14, color: '#64748b' }}>
              Page {page} of {pages}
            </span>
            {page < pages && (
              <Link
                href={buildPageUrl(page + 1)}
                style={{
                  padding: '8px 16px',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#0f172a',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  textDecoration: 'none',
                }}
              >
                Next →
              </Link>
            )}
          </nav>
        )}
      </div>
    </main>
  );
}
