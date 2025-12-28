export const getSiteUrl = () => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (explicit) return String(explicit).trim().replace(/\/+$/, '');

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${String(vercelUrl).trim().replace(/\/+$/, '')}`;

  return 'http://localhost:3000';
};
