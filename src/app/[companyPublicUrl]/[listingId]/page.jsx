import { notFound } from 'next/navigation';
import ListingPageClient from './listingPageClient';
import { getCompanyAndListingCached } from '../../../lib/jobBoardData';

export async function generateMetadata({ params }) {
  const { companyPublicUrl, listingId } = await params;
  if (!companyPublicUrl || !listingId) return {};

  try {
    const { company, listing } = await getCompanyAndListingCached(companyPublicUrl, listingId);

    const companyName = company?.name || 'Company';
    const title = listing?.title
      ? `Apply for ${listing.title} at ${companyName} - Fork Jobs`
      : `Apply for a job at ${companyName} - Fork Jobs`;

    const stripHtml = (html) => {
      if (!html) return '';
      return String(html)
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    };
    const description = stripHtml(listing?.description) || company?.description || `Apply for ${title}.`;

    return {
      title,
      description,
      alternates: {
        canonical: `/${companyPublicUrl}/${listingId}`,
      },
      openGraph: {
        title,
        url: `/${companyPublicUrl}/${listingId}`,
      },
    };
  } catch {
    return { title: 'Fork Jobs' };
  }
}

export default async function ListingPage({ params }) {
  const { companyPublicUrl, listingId } = await params;
  if (!companyPublicUrl || !listingId) notFound();

  let data;
  try {
    data = await getCompanyAndListingCached(companyPublicUrl, listingId);
  } catch (e) {
    if (e?.response?.status === 404 || e?.response?.status === 403) notFound();
    throw e;
  }
  const company = data?.company;
  const listing = data?.listing;

  if (!company || !listing) notFound();

  const publicS3 = process.env.NEXT_PUBLIC_PUBLIC_S3_API_URL;
  const jobPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: listing?.title,
    description: listing?.description || '',
    datePosted: listing?.createdAt,
    employmentType: listing?.employmentType,
    hiringOrganization: {
      '@type': 'Organization',
      name: company?.name,
      sameAs: company?.website,
      logo: company?.logo && publicS3 ? `${publicS3}/${company.logo}` : undefined,
    },
    jobLocation: listing?.location
      ? {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            streetAddress: listing.location.address,
            addressLocality: listing.location.city,
            addressRegion: listing.location.state,
            addressCountry: listing.location.country || 'US',
          },
        }
      : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd) }} />
      <ListingPageClient companyPublicUrl={companyPublicUrl} company={company} listing={listing} />
    </>
  );
}
