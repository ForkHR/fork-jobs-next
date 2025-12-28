import axios from 'axios';

const getApiBaseUrl = () => {
    const base = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
    if (!base) {
        throw new Error('Missing API base URL. Set NEXT_PUBLIC_API_URL (recommended) or API_URL.');
    }
    return base;
};

const getJobBoardUrl = () => `${getApiBaseUrl()}/job-board`;



export const getCompanyJobs = async (id) => {
    const res = await axios.get(`${getJobBoardUrl()}?companyPublicUrl=` + id);

    return res.data;
}

export const applyToListing = async (payload) => {
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };
    const res = await axios.post(getJobBoardUrl() + "/" + payload._id, payload, config);

    return res.data;
}

export const respondToInterview = async (payload) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    const res = await axios.post(getJobBoardUrl() + "/" + payload._id + `/interview?token=${payload.token}&response=${payload.response}`, payload, config);

    return res.data;
}

const jobBoardService = {
    getCompanyJobs,
    applyToListing,
    respondToInterview,
};

export default jobBoardService;