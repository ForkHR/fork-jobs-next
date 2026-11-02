import Link from 'next/link';
import CompanyLogo from './CompanyLogo';
import { ArrowUpRightIcon, ClockIcon, MapPinIcon, UsersIcon } from './icons';
import {
  applyHref,
  categoryLabel,
  employmentLabel,
  formatCity,
  formatPay,
  isNewListing,
  plural,
  timeAgo,
} from '../../lib/jobFormat';

/**
 * One job, everywhere a job is listed (home, /jobs, a company's page, related jobs). The whole
 * card opens the job; the Apply button goes straight to the form on the company's board.
 */
export default function JobCard({ job, company = job?.company, href, publicS3, hideCompany = false }) {
  if (!job) return null;
  const to = href || `/jobs/${job._id}`;
  const city = formatCity(job.location);
  const pay = formatPay(job);
  const type = employmentLabel(job.employmentType);
  const category = categoryLabel(job.category);
  const ago = timeAgo(job.createdAt);
  const fresh = isNewListing(job);
  const companyName = !hideCompany ? company?.name : null;
  const applicants = Number(job.applicantsCount) || 0;

  return (
    <article className="jb-card jb-card--hover jb-job">
      <div className="jb-job__top">
        {!hideCompany && <CompanyLogo company={company} size={44} publicS3={publicS3} />}
        <div className="jb-job__head">
          <h3 className="jb-job__title">
            <Link href={to}>{job.title}</Link>
            {fresh && <span className="jb-badge">New</span>}
          </h3>
          {(companyName || category) && (
            <p className="jb-job__company">
              {companyName && <b>{companyName}</b>}
              {companyName && category ? ' · ' : ''}
              {category}
            </p>
          )}
        </div>
        {ago && <span className="jb-job__ago">{ago}</span>}
      </div>

      {(city || type || applicants >= 10) && (
        <div className="jb-job__meta">
          {city && (
            <span className="jb-meta">
              <MapPinIcon size={15} />
              {city}
            </span>
          )}
          {type && (
            <span className="jb-meta">
              <ClockIcon size={15} />
              {type}
            </span>
          )}
          {applicants >= 10 && (
            <span className="jb-meta">
              <UsersIcon size={15} />
              {plural(applicants, 'applicant')}
            </span>
          )}
        </div>
      )}

      <div className="jb-job__foot">
        {pay ? (
          <span className="jb-job__pay">{pay}</span>
        ) : (
          <span className="jb-job__pay jb-job__pay--none">Pay not listed</span>
        )}
        <a
          href={applyHref(job, company)}
          target="_blank"
          rel="noopener noreferrer"
          className="jb-btn jb-btn--ink jb-btn--sm jb-job__apply"
          aria-label={`Apply for ${job.title}`}
        >
          Apply
          <ArrowUpRightIcon size={14} />
        </a>
      </div>
    </article>
  );
}
