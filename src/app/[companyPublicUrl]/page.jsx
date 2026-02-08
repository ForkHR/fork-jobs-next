import { notFound } from 'next/navigation';
import JobBoardClient from './jobBoardClient';
import { getCompanyJobsCached } from '../../lib/jobBoardData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { companyPublicUrl } = await params;
  if (!companyPublicUrl) return {};

  try {
    const stripHtml = (html) => {
      if (!html) return '';
      return String(html)
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    };

    const data = await getCompanyJobsCached(companyPublicUrl);
    const company = data?.company;
    const listings = Array.isArray(data?.listings) ? data.listings : [];
    const companyName = company?.name || 'Company';
    const jobsQty = listings.length;
    const title = `Work at ${companyName} - ${jobsQty} open jobs`;

    const companyDescription = stripHtml(company?.description);
    const description =
      companyDescription ||
      (jobsQty > 0
        ? `Explore ${jobsQty} open ${jobsQty === 1 ? 'job' : 'jobs'} at ${companyName}.`
        : `Explore careers and new opportunities at ${companyName}.`);

    const publicS3 = process.env.NEXT_PUBLIC_PUBLIC_S3_API_URL || process.env.PUBLIC_S3_API_URL;
    const logoUrl = company?.logo && publicS3 ? `${String(publicS3).replace(/\/+$/, '')}/${company.logo}` : undefined;

    return {
      title,
      description,
      alternates: {
        canonical: `/${companyPublicUrl}`,
      },
      openGraph: {
        type: 'website',
        title,
        description,
        url: `/${companyPublicUrl}`,
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
    return { title: 'Fork Jobs' };
  }
}

export default async function CompanyJobsPage({ params }) {
  const { companyPublicUrl } = await params;
  if (!companyPublicUrl) notFound();

  let data;
  try {
    data = await getCompanyJobsCached(companyPublicUrl);
  } catch (e) {
    if (e?.response?.status === 404) notFound();
    data = null;
  }

  const company = data?.company;
  const listings = data?.listings;

  // If the server cannot reach the API (e.g. 403/WAF), render and let the client fetch.
  // Still `notFound()` above for genuine 404s.
  if (!company) {
    return <JobBoardClient companyPublicUrl={companyPublicUrl} company={null} listings={[]} />;
  }

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: (Array.isArray(listings) ? listings : []).map((l, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `/${companyPublicUrl}/${l?._id}`,
      name: l?.title,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <JobBoardClient
        companyPublicUrl={companyPublicUrl}
        company={company}
        listings={Array.isArray(listings) ? listings : []}
      />
    </>
  );
}
