// Shared wording for listings and companies on the public pages (home, /jobs, /boards and the
// job pages). Every card and header reads from here, so a job reads the same everywhere.

export const getPublicS3 = () =>
  process.env.NEXT_PUBLIC_PUBLIC_S3_API_URL || process.env.PUBLIC_S3_API_URL || '';

export const logoUrl = (company, publicS3) => {
  const base = publicS3 || getPublicS3();
  if (!company?.logo || !base) return null;
  return `${String(base).replace(/\/+$/, '')}/${company.logo}`;
};

export const companySlug = (company) => company?.publicUrl || company?._id || '';

/** The company's own branded board (/<slug>). */
export const boardHref = (company) => `/${companySlug(company)}`;

/** The company's page on this site (/boards/<slug>). */
export const companyHref = (company) => `/boards/${companySlug(company)}`;

/** The application form on the company's board. */
export const applyHref = (job, company = job?.company) => {
  const slug = companySlug(company) || (typeof job?.company === 'string' ? job.company : '');
  return `/${slug}/${job?._id}#application-form`;
};

export const stripHtml = (html) => {
  if (!html) return '';
  return String(html)
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
};

export const excerpt = (html, max = 160) => {
  const text = stripHtml(html);
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), 40)).trim()}…`;
};

const short = (n) => {
  if (n >= 1000) {
    const k = n / 1000;
    return `${Number.isInteger(k) ? k : k.toFixed(k < 10 ? 1 : 0)}k`;
  }
  return String(n);
};

const long = (n) => Number(n).toLocaleString('en-US');

const payUnit = (job, style) => {
  if (job?.payType === 'hourly') return style === 'long' ? ' per hour' : '/hr';
  if (job?.payType === 'salary') return style === 'long' ? ' per year' : '/yr';
  return '';
};

/** "$14–$16/hr", "$25k–$100k/yr"; null when the listing has no pay. */
export const formatPay = (job) => {
  if (!job?.payRateFrom || job.payRateFrom <= 0) return null;
  let pay = `$${short(job.payRateFrom)}`;
  if (job.payRateTo > job.payRateFrom) pay += `–$${short(job.payRateTo)}`;
  return pay + payUnit(job, 'short');
};

/** "$14 – $16 per hour", "$25,000 – $100,000 per year". */
export const formatPayLong = (job) => {
  if (!job?.payRateFrom || job.payRateFrom <= 0) return null;
  let pay = `$${long(job.payRateFrom)}`;
  if (job.payRateTo > job.payRateFrom) pay += ` – $${long(job.payRateTo)}`;
  return pay + payUnit(job, 'long');
};

export const employmentLabel = (type) => {
  if (type === 'full-time') return 'Full-time';
  if (type === 'part-time') return 'Part-time';
  return null;
};

/** "Brooklyn, NY", else the location's name. */
export const formatCity = (loc) => {
  if (!loc) return null;
  const parts = [loc.city, loc.state].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : loc.name || null;
};

/** "80 Dekalb Ave, Brooklyn, NY". */
export const formatAddress = (loc) => {
  if (!loc) return null;
  const parts = [loc.address, loc.city, loc.state].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : loc.name || null;
};

export const categoryLabel = (category) => {
  const name = typeof category === 'string' ? category : category?.name;
  if (!name) return null;
  const text = String(name).trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const daysSince = (dateStr) => {
  if (!dateStr) return null;
  const then = new Date(dateStr).getTime();
  if (Number.isNaN(then)) return null;
  return Math.floor((Date.now() - then) / 86400000);
};

export const isNewListing = (job) => {
  const days = daysSince(job?.createdAt);
  return days !== null && days <= 7;
};

export const timeAgo = (dateStr) => {
  const days = daysSince(dateStr);
  if (days === null) return null;
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return months <= 1 ? '1 month ago' : `${months} months ago`;
  const years = Math.floor(days / 365);
  return years <= 1 ? '1 year ago' : `${years} years ago`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

export const plural = (n, one, many = `${one}s`) => `${Number(n).toLocaleString('en-US')} ${n === 1 ? one : many}`;

/** The list the search endpoints answer, whatever shape the API (or its fallback) used. */
export const itemsOf = (res) => {
  if (Array.isArray(res?.items)) return res.items;
  if (Array.isArray(res?.listings)) return res.listings;
  if (Array.isArray(res?.results)) return res.results;
  if (Array.isArray(res)) return res;
  return [];
};
