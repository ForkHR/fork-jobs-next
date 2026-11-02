import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

// 1 … 4 5 6 … 12: the first, the last, and the pages around the current one.
const pageWindow = (page, pages) => {
  const keep = new Set([1, pages, page - 1, page, page + 1].filter((n) => n >= 1 && n <= pages));
  const out = [];
  let last = 0;
  for (let n = 1; n <= pages; n += 1) {
    if (!keep.has(n)) continue;
    if (n - last > 1) out.push('…');
    out.push(n);
    last = n;
  }
  return out;
};

export default function Pagination({ page, pages, hrefFor }) {
  if (!pages || pages <= 1) return null;
  return (
    <nav className="jb-pager" aria-label="Pagination">
      {page > 1 && (
        <Link href={hrefFor(page - 1)} rel="prev" className="jb-btn jb-btn--outline jb-btn--sm jb-pager__btn">
          <ChevronLeftIcon size={16} />
          Previous
        </Link>
      )}
      {pageWindow(page, pages).map((n, i) =>
        n === '…' ? (
          <span key={`gap-${i}`} className="jb-pager__gap" aria-hidden="true">
            …
          </span>
        ) : (
          <Link
            key={n}
            href={hrefFor(n)}
            className={`jb-pager__num${n === page ? ' jb-pager__num--on' : ''}`}
            aria-current={n === page ? 'page' : undefined}
          >
            {n}
          </Link>
        )
      )}
      {page < pages && (
        <Link href={hrefFor(page + 1)} rel="next" className="jb-btn jb-btn--outline jb-btn--sm jb-pager__btn">
          Next
          <ChevronRightIcon size={16} />
        </Link>
      )}
    </nav>
  );
}
