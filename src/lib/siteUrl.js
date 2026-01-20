export const getSiteUrl = () => {
  const ensureProtocol = (value) => {
    const trimmed = String(value || '')
      .trim()
      .replace(/\/+$/, '');
    if (!trimmed) return trimmed;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;

    // Common local/dev hostnames where http is expected
    if (/^(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/i.test(trimmed)) {
      return `http://${trimmed}`;
    }

    return `https://${trimmed}`;
  };

  const explicit = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (explicit) return ensureProtocol(explicit);

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return ensureProtocol(vercelUrl);

  return 'http://localhost:3000';
};
