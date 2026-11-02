import { notFound } from 'next/navigation';
import { getCompanyAndListingCached } from '../../../../lib/jobBoardData';
import ClientRedirect from '../../../../components/ClientRedirect';
import { getSiteUrl } from '../../../../lib/siteUrl';
import { getPublicS3, logoUrl, stripHtml } from '../../../../lib/jobFormat';
import JobDetail from '../../../../components/jobs/JobDetail';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
      stripHtml(listing.description)?.slice(0, 160) || `Apply for ${listing.title} at ${companyName} on Fork Jobs.`;
    const logo = logoUrl(company);

    return {
      title,
      description,
      alternates: { canonical: `/boards/${companyPublicUrl}/${jobId}` },
      openGraph: {
        type: 'website',
        title,
        description,
        url: `/boards/${companyPublicUrl}/${jobId}`,
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

export default async function BoardJobDetailPage({ params }) {
  const { companyPublicUrl, jobId } = await params;
  if (!companyPublicUrl || !jobId) notFound();

  let data;
  let fetchFailed = false;
  try {
    data = await getCompanyAndListingCached(companyPublicUrl, jobId);
  } catch (e) {
    if (e?.status === 404 || e?.response?.status === 404) notFound();
    fetchFailed = true;
    data = null;
  }

  const listing = data?.listing;
  const company = data?.company;
  const listings = Array.isArray(data?.listings) ? data.listings : [];

  // Transient SSR fetch failure (e.g. Cloudflare challenge): send the visitor
  // to the company-board listing page, which loads its data client-side.
  if ((!listing || !company) && fetchFailed) {
    return <ClientRedirect to={`/${companyPublicUrl}/${jobId}`} />;
  }
  if (!listing || !company) notFound();

  const siteUrl = getSiteUrl();
  const companyName = company?.name || 'Company';
  const logo = logoUrl(company);

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
      listing.employmentType === 'full-time' ? 'FULL_TIME' : listing.employmentType === 'part-time' ? 'PART_TIME' : undefined,
    hiringOrganization: {
      '@type': 'Organization',
      name: companyName,
      sameAs: `${siteUrl}/boards/${companyPublicUrl}`,
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
    url: `${siteUrl}/boards/${companyPublicUrl}/${jobId}`,
  };

  return (
    <main className="jb jb-main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd) }} />
      <JobDetail
        listing={listing}
        company={company}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Companies', href: '/boards' },
          { label: companyName, href: `/boards/${companyPublicUrl}` },
          { label: listing.title },
        ]}
        shareUrl={`${siteUrl}/boards/${companyPublicUrl}/${jobId}`}
        otherJobs={listings}
        jobHrefFor={(job) => `/boards/${companyPublicUrl}/${job._id}`}
        publicS3={getPublicS3()}
      />
    </main>
  );
}
