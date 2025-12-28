import { notFound } from 'next/navigation';
import JobBoardClient from './jobBoardClient';
import { getCompanyJobsCached } from '../../lib/jobBoardData';

export async function generateMetadata({ params }) {
  const { publicUrl } = await params;
  if (!publicUrl) return {};

  try {
    const data = await getCompanyJobsCached(publicUrl);
    const company = data?.company;
    const listings = Array.isArray(data?.listings) ? data.listings : [];
    const companyName = company?.name || 'Company';
    const jobsQty = listings.length;
    const title = `Work at ${companyName} - ${jobsQty} open jobs - Fork Jobs`;

    return {
      title,
      description: company?.description || `Open roles at ${companyName}.`,
      alternates: {
        canonical: `/${publicUrl}`,
      },
      openGraph: {
        title,
        description: company?.description || `Open roles at ${companyName}.`,
        url: `/${publicUrl}`,
      },
    };
  } catch {
    return { title: 'Fork Jobs' };
  }
}

export default async function CompanyJobsPage({ params }) {
  const { publicUrl } = await params;
  if (!publicUrl) notFound();

  let data;
  try {
    data = await getCompanyJobsCached(publicUrl);
  } catch (e) {
    if (e?.response?.status === 404 || e?.response?.status === 403) notFound();
    throw e;
  }

  const company = data?.company;
  const listings = data?.listings;

  if (!company) notFound();

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: (Array.isArray(listings) ? listings : []).map((l, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `/${publicUrl}/${l?._id}`,
      name: l?.title,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <JobBoardClient
        publicUrl={publicUrl}
        company={company}
        listings={Array.isArray(listings) ? listings : []}
      />
    </>
  );
}
