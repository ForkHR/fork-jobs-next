import jobBoardService from '../features/jobBoard/jobBoardService';

const normalizeJobBoardResponse = (res) => {
  if (!res) return res;
  if (res?.company || res?.listings) return res;
  if (res?.data && (res.data.company || res.data.listings)) return res.data;
  return res;
};

export const getCompanyJobsCached = async (companyPublicUrl) => {
  const res = await jobBoardService.getCompanyJobs(companyPublicUrl);
  return normalizeJobBoardResponse(res);
};

export const getCompanyAndListingCached = async (companyPublicUrl, listingId) => {
  const data = await getCompanyJobsCached(companyPublicUrl);
  const listings = Array.isArray(data?.listings) ? data.listings : [];
  const listing = listings.find((l) => l?._id === listingId);

  return {
    company: data?.company,
    listings,
    listing,
  };
};
