import Link from 'next/link';
import { ChevronRightIcon } from './icons';

/** Home › Jobs › Barista. Every item but the last links. */
export default function Breadcrumb({ items }) {
  if (!items || items.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb">
      <ol className="jb-crumbs">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return [
            <li key={`c-${i}`} className={last ? 'jb-crumbs__cur' : undefined} aria-current={last ? 'page' : undefined}>
              {last || !item.href ? item.label : <Link href={item.href}>{item.label}</Link>}
            </li>,
            !last ? (
              <li key={`s-${i}`} className="jb-crumbs__sep" aria-hidden="true">
                <ChevronRightIcon size={14} />
              </li>
            ) : null,
          ];
        })}
      </ol>
    </nav>
  );
}
