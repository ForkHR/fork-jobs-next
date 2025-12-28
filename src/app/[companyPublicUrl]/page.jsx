import { notFound } from 'next/navigation';
import JobBoardClient from './jobBoardClient';
import { getCompanyJobsCached } from '../../lib/jobBoardData';

export async function generateMetadata({ params }) {
  const { companyPublicUrl } = params;
  if (!companyPublicUrl) return {};

  try {
    const data = await getCompanyJobsCached(companyPublicUrl);
    const company = data?.company;
    const listings = Array.isArray(data?.listings) ? data.listings : [];
    const companyName = company?.name || 'Company';
    const jobsQty = listings.length;
    const title = `Work at ${companyName} - ${jobsQty} open jobs - Fork Jobs`;

    return {
      title,
      description: company?.description || `Open roles at ${companyName}.`,
      alternates: {
        canonical: `/${companyPublicUrl}`,
      },
      openGraph: {
        title,
        description: company?.description || `Open roles at ${companyName}.`,
        url: `/${companyPublicUrl}`,
      },
    };
  } catch {
    return { title: 'Fork Jobs' };
  }
}

export default async function CompanyJobsPage({ params }) {
  const { companyPublicUrl } = params;
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
