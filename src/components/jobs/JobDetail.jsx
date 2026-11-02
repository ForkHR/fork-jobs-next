import Link from 'next/link';
import Breadcrumb from './Breadcrumb';
import CompanyLogo from './CompanyLogo';
import JobCard from './JobCard';
import ShareJobButton from './ShareJobButton';
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BanknoteIcon,
  BriefcaseIcon,
  BuildingIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  TagIcon,
  UsersIcon,
} from './icons';
import {
  applyHref,
  boardHref,
  categoryLabel,
  companyHref,
  employmentLabel,
  excerpt,
  formatAddress,
  formatCity,
  formatDate,
  formatPay,
  formatPayLong,
  isNewListing,
  plural,
  timeAgo,
} from '../../lib/jobFormat';

/**
 * The job page, drawn the same at /jobs/<id> and /boards/<company>/<id>: the listing on the
 * left, the apply card on the right (a bar at the bottom of a phone), the company's other
 * openings underneath. The pages fetch; this draws.
 */
export default function JobDetail({ listing, company, crumbs, shareUrl, otherJobs = [], jobHrefFor, publicS3 }) {
  const companyName = company?.name || 'Company';
  const address = formatAddress(listing.location);
  const city = formatCity(listing.location);
  const pay = formatPay(listing);
  const payLong = formatPayLong(listing);
  const type = employmentLabel(listing.employmentType);
  const category = categoryLabel(listing.category);
  const posted = formatDate(listing.createdAt);
  const ago = timeAgo(listing.createdAt);
  const apply = applyHref(listing, company);
  const applicants = Number(listing.applicantsCount) || 0;
  const companyDesc = excerpt(company?.description, 220);
  const others = otherJobs.filter((j) => j?._id !== listing._id).slice(0, 4);
  const openCount = otherJobs.length || null;

  return (
    <div className="jb-wrap">
      <div className="jb-detail">
        <div className="jb-detail__main">
          <Breadcrumb items={crumbs} />

          <header className="jb-detail__head">
            <CompanyLogo company={company} size={60} publicS3={publicS3} className="jb-detail__logo" eager />
            <div style={{ minWidth: 0, flex: 1 }}>
              <h1 className="jb-detail__title">{listing.title}</h1>
              <p className="jb-detail__company">
                <Link href={companyHref(company)} className="jb-underline">
                  {companyName}
                </Link>
                {ago && (
                  <span className="jb-muted">
                    · Posted {ago}
                  </span>
                )}
                {isNewListing(listing) && <span className="jb-badge">New</span>}
              </p>
            </div>
          </header>

          <div className="jb-detail__meta">
            {address && (
              <span className="jb-pill">
                <MapPinIcon size={15} />
                {address}
              </span>
            )}
            {pay && (
              <span className="jb-pill">
                <BanknoteIcon size={15} />
                {pay}
              </span>
            )}
            {type && (
              <span className="jb-pill">
                <ClockIcon size={15} />
                {type}
              </span>
            )}
            {category && (
              <span className="jb-pill">
                <TagIcon size={15} />
                {category}
              </span>
            )}
            {posted && (
              <span className="jb-pill">
                <CalendarIcon size={15} />
                {posted}
              </span>
            )}
          </div>

          <section className="jb-detail__section">
            <h2>About the job</h2>
            {listing.description ? (
              <div className="jb-prose" dangerouslySetInnerHTML={{ __html: listing.description }} />
            ) : (
              <p className="jb-prose jb-muted">
                {companyName} has not written a description for this role yet. Apply and ask them what the job involves.
              </p>
            )}
          </section>

          <div className="jb-detail__links">
            <ShareJobButton jobUrl={shareUrl} jobTitle={listing.title} className="jb-btn jb-btn--outline jb-btn--sm" />
            <Link href={companyHref(company)} className="jb-btn jb-btn--outline jb-btn--sm">
              More jobs at {companyName}
              <ArrowRightIcon size={15} />
            </Link>
          </div>

          {others.length > 0 && (
            <section className="jb-related">
              <h2>Other openings at {companyName}</h2>
              <div className="jb-list">
                {others.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    company={company}
                    href={jobHrefFor ? jobHrefFor(job) : `/jobs/${job._id}`}
                    publicS3={publicS3}
                    hideCompany
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="jb-aside">
          <div className="jb-card jb-apply">
            <h2 className="jb-apply__title">Apply for this job</h2>
            <p className="jb-apply__sub">Your application goes to the hiring manager at {companyName}.</p>
            <div className="jb-apply__rows">
              {(payLong || pay) && (
                <span className="jb-meta">
                  <BanknoteIcon size={16} />
                  <b>{payLong || pay}</b>
                </span>
              )}
              {type && (
                <span className="jb-meta">
                  <BriefcaseIcon size={16} />
                  {type}
                </span>
              )}
              {city && (
                <span className="jb-meta">
                  <MapPinIcon size={16} />
                  {city}
                </span>
              )}
              <span className="jb-meta">
                <UsersIcon size={16} />
                {applicants >= 10 ? plural(applicants, 'applicant') + ' so far' : 'Be one of the first to apply'}
              </span>
            </div>
            <a href={apply} target="_blank" rel="noopener noreferrer" className="jb-btn jb-btn--ink jb-btn--lg jb-btn--block">
              Apply now
              <ArrowUpRightIcon size={16} />
            </a>
            <p className="jb-apply__note">Resume and a few questions. No account to create.</p>
            <div className="jb-apply__links">
              <a href={boardHref(company)} target="_blank" rel="noopener noreferrer">
                <BuildingIcon size={16} />
                Visit the {companyName} job board
              </a>
            </div>
          </div>

          <div className="jb-card jb-aside__co">
            <div className="jb-aside__co-top">
              <CompanyLogo company={company} size={40} publicS3={publicS3} />
              <div style={{ minWidth: 0 }}>
                <div className="jb-aside__co-name">{companyName}</div>
                {openCount ? <div className="jb-aside__co-count">{plural(openCount, 'open position')}</div> : null}
              </div>
            </div>
            {companyDesc && <p className="jb-aside__co-desc">{companyDesc}</p>}
            <div className="jb-apply__links">
              <Link href={companyHref(company)}>
                <ArrowRightIcon size={16} />
                All openings at {companyName}
              </Link>
              <a href={boardHref(company)} target="_blank" rel="noopener noreferrer">
                <BuildingIcon size={16} />
                Visit their job board
              </a>
            </div>
          </div>
        </aside>
      </div>

      <div className="jb-applybar">
        <div className="jb-applybar__text">
          <div className="jb-applybar__pay">{pay || listing.title}</div>
          <div className="jb-applybar__sub">{pay ? listing.title : companyName}</div>
        </div>
        <a href={apply} target="_blank" rel="noopener noreferrer" className="jb-btn jb-btn--ink">
          Apply now
          <ArrowUpRightIcon size={15} />
        </a>
      </div>
    </div>
  );
}
