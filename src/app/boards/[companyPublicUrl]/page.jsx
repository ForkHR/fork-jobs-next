import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCompanyJobsCached } from '../../../lib/jobBoardData';
import ClientRedirect from '../../../components/ClientRedirect';
import { getSiteUrl } from '../../../lib/siteUrl';
import { boardHref, excerpt, formatCity, getPublicS3, logoUrl, plural, stripHtml } from '../../../lib/jobFormat';
import Breadcrumb from '../../../components/jobs/Breadcrumb';
import CompanyLogo from '../../../components/jobs/CompanyLogo';
import JobCard from '../../../components/jobs/JobCard';
import EmptyState from '../../../components/jobs/EmptyState';
import { ArrowUpRightIcon, BriefcaseIcon, MapPinIcon } from '../../../components/jobs/icons';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    const logo = logoUrl(company);

    return {
      title,
      description,
      alternates: { canonical: `/boards/${companyPublicUrl}` },
      openGraph: {
        type: 'website',
        title,
        description,
        url: `/boards/${companyPublicUrl}`,
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
    return { title: 'Board Not Found' };
  }
}

export default async function BoardDetailPage({ params }) {
  const { companyPublicUrl } = await params;
  if (!companyPublicUrl) notFound();

  let data;
  let fetchFailed = false;
  try {
    data = await getCompanyJobsCached(companyPublicUrl);
  } catch (e) {
    if (e?.status === 404 || e?.response?.status === 404) notFound();
    fetchFailed = true;
    data = null;
  }

  const company = data?.company;
  const listings = Array.isArray(data?.listings) ? data.listings : [];

  // Transient SSR fetch failure (e.g. Cloudflare challenge): send the visitor
  // to the company board, which loads its data client-side.
  if (!company && fetchFailed) return <ClientRedirect to={`/${companyPublicUrl}`} />;
  if (!company) notFound();

  const companyName = company?.name || 'Company';
  const siteUrl = getSiteUrl();
  const publicS3 = getPublicS3();
  const logo = logoUrl(company, publicS3);
  const description = excerpt(company?.description, 420);
  const cities = [...new Set(listings.map((l) => formatCity(l.location)).filter(Boolean))];
  const where = cities.length > 3 ? `${cities.slice(0, 3).join(', ')} +${cities.length - 3}` : cities.join(', ');

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
    logo: logo || undefined,
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
    <main className="jb jb-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, orgJsonLd, itemListJsonLd]) }}
      />

      <section className="jb-cohead">
        <div className="jb-wrap jb-wrap--narrow">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Companies', href: '/boards' }, { label: companyName }]} />
          <div className="jb-cohead__row">
            <div className="jb-cohead__id">
              <CompanyLogo company={company} size={72} publicS3={publicS3} className="jb-cohead__logo" eager />
              <div style={{ minWidth: 0 }}>
                <h1>{companyName}</h1>
                <div className="jb-cohead__sub">
                  <span className="jb-meta">
                    <BriefcaseIcon size={15} />
                    {plural(listings.length, 'open position')}
                  </span>
                  {where && (
                    <span className="jb-meta">
                      <MapPinIcon size={15} />
                      {where}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="jb-cohead__actions">
              <a href={boardHref(company)} target="_blank" rel="noopener noreferrer" className="jb-btn jb-btn--outline">
                Visit their job board
                <ArrowUpRightIcon size={15} />
              </a>
            </div>
          </div>
          {description && <p className="jb-cohead__desc">{description}</p>}
        </div>
      </section>

      <div className="jb-wrap jb-wrap--narrow">
        <section className="jb-section--tight">
          <div className="jb-sechead" style={{ marginBottom: 18 }}>
            <h2 className="jb-h3">Open positions</h2>
            <Link href="/jobs" className="jb-link jb-link--muted jb-small">
              Browse every job
            </Link>
          </div>

          {listings.length > 0 ? (
            <div className="jb-list">
              {listings.map((listing) => (
                <JobCard
                  key={listing._id}
                  job={listing}
                  company={company}
                  href={`/boards/${companyPublicUrl}/${listing._id}`}
                  publicS3={publicS3}
                  hideCompany
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No open positions right now"
              text={`${companyName} isn’t hiring at the moment. Check back later, or browse the other businesses on Fork.`}
            >
              <Link href="/jobs" className="jb-btn jb-btn--outline jb-btn--sm">
                Browse all jobs
              </Link>
            </EmptyState>
          )}
        </section>
      </div>
    </main>
  );
}
