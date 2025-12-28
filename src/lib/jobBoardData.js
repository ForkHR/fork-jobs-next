import { cache } from 'react';
import jobBoardService from '../features/jobBoard/jobBoardService';

export const getCompanyJobsCached = cache(async (companyPublicUrl) => {
  const res = await jobBoardService.getCompanyJobs(companyPublicUrl);
  return res;
});

export const getCompanyAndListingCached = cache(async (companyPublicUrl, listingId) => {
  const data = await getCompanyJobsCached(companyPublicUrl);
  const listings = Array.isArray(data?.listings) ? data.listings : [];
  const listing = listings.find((l) => l?._id === listingId);

  return {
    company: data?.company,
    listings,
    listing,
  };
});
