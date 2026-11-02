import { searchJobBoardCompaniesCached } from '../../lib/jobBoardData';
import { getSiteUrl } from '../../lib/siteUrl';
import { getPublicS3, itemsOf } from '../../lib/jobFormat';
import BoardsSearchFilters from './BoardsSearchFilters';
import BoardsClientFallback from './BoardsClientFallback';
import CompanyCard from '../../components/jobs/CompanyCard';
import Breadcrumb from '../../components/jobs/Breadcrumb';
import Pagination from '../../components/jobs/Pagination';
import { EmployerNote } from '../../components/jobs/EmployerBand';

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

export default async function BoardsPage({ searchParams }) {
  const sp = await searchParams;
  const q = sp?.q || '';
  const sort = sp?.sort || 'jobs';
  const page = Math.max(parseInt(sp?.page, 10) || 1, 1);

  let items = [];
  let total = 0;
  let pages = 1;

  try {
    const res = await searchJobBoardCompaniesCached({ q, page, limit: LIMIT, sort });
    items = itemsOf(res);
    total = res?.total || items.length;
    pages = res?.pages || Math.ceil(total / LIMIT) || 1;
  } catch {
    items = [];
  }

  const siteUrl = getSiteUrl();
  const publicS3 = getPublicS3();

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

  const itemListJsonLd =
    items.length > 0
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
    <main className="jb jb-main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {itemListJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      )}

      <div className="jb-wrap jb-wrap--narrow">
        <div className="jb-pagehead">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Companies' }]} />
          <div className="jb-pagehead__row">
            <div>
              <h1>Company boards</h1>
              <p className="jb-lede">
                Every business hiring on Fork runs its own board. Open one to see all of its positions and apply
                directly.
              </p>
            </div>
          </div>
        </div>

        <BoardsSearchFilters initialValues={{ q, sort }} totalResults={total} />

        {items.length > 0 ? (
          <div className="jb-grid jb-grid--3">
            {items.map((company) => (
              <CompanyCard key={company._id} company={company} publicS3={publicS3} />
            ))}
          </div>
        ) : (
          /* Empty SSR result: retry from the visitor's browser (handles the Cloudflare
             challenge on server-side requests). */
          <BoardsClientFallback q={q} sort={sort} publicS3={publicS3} />
        )}

        <Pagination page={page} pages={pages} hrefFor={buildPageUrl} />

        <EmployerNote />
      </div>
    </main>
  );
}
