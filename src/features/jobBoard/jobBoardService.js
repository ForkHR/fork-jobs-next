import axios from 'axios';

const getApiBaseUrl = () => {
    const isBrowser = typeof window !== 'undefined';

    // In the browser we must use NEXT_PUBLIC_* (it gets inlined at build time).
    // On the server we allow API_URL as an override.
    const base = isBrowser ? process.env.NEXT_PUBLIC_API_URL : process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

    if (!base) {
        throw new Error('Missing API base URL. Set NEXT_PUBLIC_API_URL (recommended) or API_URL.');
    }

    const trimmed = String(base).trim();
    if (!/^https?:\/\//i.test(trimmed)) {
        throw new Error(
            `Invalid API base URL: "${trimmed}". It must start with http(s):// (e.g. https://app.forkhr.com/api).`
        );
    }

    return trimmed;
};

const normalizeBaseUrl = (baseUrl) => {
    // Tolerate misconfig like `.../api/job-board`
    const trimmed = String(baseUrl).trim().replace(/\/+$/, '');
    return trimmed.replace(/\/job-board$/, '');
};

const getJobBoardUrl = () => {
    const base = normalizeBaseUrl(getApiBaseUrl());
    return `${base}/job-board`;
};

const getServerRequestHeaders = () => {
    if (typeof window !== 'undefined') return undefined;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
    return {
        Accept: 'application/json',
        'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        ...(siteUrl ? { Referer: siteUrl } : {}),
    };
};



export const getCompanyJobs = async (id) => {
    console.log(`fetching : ${getJobBoardUrl()}?companyPublicUrl=` + id);
    const res = await axios.get(`${getJobBoardUrl()}?companyPublicUrl=${encodeURIComponent(id)}`,
        {
            headers: getServerRequestHeaders(),
        }
    );
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