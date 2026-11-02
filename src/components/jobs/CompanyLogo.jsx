import { logoUrl } from '../../lib/jobFormat';

const initials = (name) => {
  const words = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '·';
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
};

/** A company's logo, or its initials on a stone tile when it has none. */
export default function CompanyLogo({ company, size = 44, publicS3, className = '', radius, eager = false }) {
  const src = logoUrl(company, publicS3);
  const name = company?.name || '';
  const style = { width: size, height: size, fontSize: Math.round(size * 0.38) };
  if (radius) style.borderRadius = radius;

  if (src) {
    return (
      <img
        src={src}
        alt={name ? `${name} logo` : ''}
        width={size}
        height={size}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={`jb-logo${className ? ` ${className}` : ''}`}
        style={style}
      />
    );
  }
  return (
    <span className={`jb-logo jb-logo--fallback${className ? ` ${className}` : ''}`} style={style} aria-hidden="true">
      {initials(name)}
    </span>
  );
}
