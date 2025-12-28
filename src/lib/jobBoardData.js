import { cache } from 'react';
import jobBoardService from '../features/jobBoard/jobBoardService';

export const getCompanyJobsCached = cache(async (publicUrl) => {
  const res = await jobBoardService.getCompanyJobs(publicUrl);
  return res;
});

export const getCompanyAndListingCached = cache(async (publicUrl, listingId) => {
  const data = await getCompanyJobsCached(publicUrl);
  const listings = Array.isArray(data?.listings) ? data.listings : [];
  const listing = listings.find((l) => l?._id === listingId);

  return {
    company: data?.company,
    listings,
    listing,
  };
});
