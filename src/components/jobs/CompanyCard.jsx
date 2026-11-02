import Link from 'next/link';
import CompanyLogo from './CompanyLogo';
import { ArrowRightIcon } from './icons';
import { companyHref, excerpt, plural } from '../../lib/jobFormat';

/** One company board in a list: logo, name, how many openings, a line of its description. */
export default function CompanyCard({ company, publicS3 }) {
  if (!company) return null;
  const desc = excerpt(company.description, 120);
  const count = Number(company.jobsCount) || 0;

  return (
    <article className="jb-card jb-card--hover jb-co">
      <div className="jb-co__top">
        <CompanyLogo company={company} size={48} publicS3={publicS3} />
        <div style={{ minWidth: 0 }}>
          <h3 className="jb-co__name">
            <Link href={companyHref(company)}>{company.name}</Link>
          </h3>
          <p className="jb-co__count">{plural(count, 'open position')}</p>
        </div>
      </div>
      {desc && <p className="jb-co__desc">{desc}</p>}
      <div className="jb-co__foot">
        <span>See open positions</span>
        <ArrowRightIcon size={16} />
      </div>
    </article>
  );
}
