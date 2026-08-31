import Link from 'next/link';
import { searchJobListingsCached } from '../lib/jobBoardData';
import styles from './page.module.css';
import { getSiteUrl } from '../lib/siteUrl';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Fork Jobs — Local Jobs, Straight from the Companies Hiring',
  description:
    'Browse open positions on company-run job boards — barista jobs, restaurant jobs, retail and more. Apply directly to the employer. No recruiters, no account needed.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    title: 'Fork Jobs — Local Jobs, Straight from the Companies Hiring',
    description:
      'Browse open positions on company-run job boards and apply directly to the employer. No recruiters, no account needed.',
    url: '/',
    images: [
      {
        url: '/assets/og-image.png',
        width: 1200,
        height: 750,
        alt: 'Fork Jobs — local jobs, straight from the companies hiring',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fork Jobs — Local Jobs, Straight from the Companies Hiring',
    description:
      'Browse open positions on company-run job boards and apply directly to the employer. No recruiters, no account needed.',
    images: ['/assets/og-image.png'],
  },
};

const timeAgo = (dateStr) => {
  if (!dateStr) return null;
  const then = new Date(dateStr).getTime();
  if (Number.isNaN(then)) return null;
  const days = Math.floor((Date.now() - then) / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return weeks === 1 ? 'Last week' : `${weeks} weeks ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatAmount = (n) =>
  n >= 1000 ? `${Math.round(n / 1000)}k` : String(n);

const formatPay = (job) => {
  if (!job.payRateFrom || job.payRateFrom <= 0) return null;
  let pay = `$${formatAmount(job.payRateFrom)}`;
  if (job.payRateTo > job.payRateFrom) pay += `–$${formatAmount(job.payRateTo)}`;
  if (job.payType === 'hourly') pay += '/hr';
  else if (job.payType === 'salary') pay += '/yr';
  return pay;
};

export default async function HomePage() {
  let recentJobs = [];
  let totalJobs = 0;
  try {
    const res = await searchJobListingsCached({ limit: 8, sort: 'recent' });
    const items = res?.items || res?.listings || [];
    recentJobs = Array.isArray(items) ? items : [];
    totalJobs = Number(res?.total) || recentJobs.length;
  } catch (err) {
    console.error('[home] failed to load recent jobs:', err?.message, err?.bodyPreview || '');
    recentJobs = [];
    totalJobs = 0;
  }
  const siteUrl = getSiteUrl();
  const publicS3 = process.env.NEXT_PUBLIC_PUBLIC_S3_API_URL || process.env.PUBLIC_S3_API_URL;

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Fork Jobs',
    url: siteUrl,
    description: 'Company-powered job boards by ForkHR.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/jobs?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Fork',
    url: 'https://forkhr.com',
    logo: 'https://forkhr.com/icons/icon-512.png',
  };

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([websiteJsonLd, orgJsonLd]) }}
      />

      {/* Hero + search */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>
            Local jobs, straight from the companies hiring.
          </h1>
          <p className={styles.heroSub}>
            Fork hosts job boards for real businesses — cafés, restaurants, shops, and more.
            When you apply, your application goes to the person doing the hiring, not a recruiter.
          </p>

          <form action="/jobs" role="search" className={styles.searchForm}>
            <input
              type="search"
              name="q"
              placeholder="Job title, company, or keyword"
              aria-label="Search jobs"
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchBtn}>Search jobs</button>
          </form>

          <p className={styles.heroTrail}>
            {totalJobs > 0 ? (
              <>{totalJobs.toLocaleString()} open positions right now. </>
            ) : (
              <>New positions are added daily. </>
            )}
            Free to apply, no account needed. Try{' '}
            <Link href="/jobs?q=barista">barista</Link>,{' '}
            <Link href="/jobs?q=server">server</Link>,{' '}
            <Link href="/jobs?q=cook">cook</Link>, or{' '}
            <Link href="/jobs?type=part-time">part-time work</Link>.
          </p>
        </div>
      </section>

      {/* Latest openings */}
      {recentJobs.length > 0 && (
        <section className={styles.jobsSection}>
          <div className={styles.sectionInner}>
            <div className={styles.jobsHeader}>
              <h2 className={styles.sectionTitle}>Latest openings</h2>
              <Link href="/jobs" className={styles.jobsAllLink}>
                View all {totalJobs > recentJobs.length ? totalJobs.toLocaleString() : ''} jobs
              </Link>
            </div>

            <ul className={styles.jobList}>
              {recentJobs.map((job) => {
                const pay = formatPay(job);
                const ago = timeAgo(job.createdAt);
                const city = job.location?.city
                  ? `${job.location.city}${job.location.state ? `, ${job.location.state}` : ''}`
                  : null;
                const logoUrl =
                  job.company?.logo && publicS3
                    ? `${String(publicS3).replace(/\/+$/, '')}/${job.company.logo}`
                    : null;
                return (
                  <li key={job._id}>
                    <Link href={`/jobs/${job._id}`} className={styles.jobRow}>
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt=""
                          width={40}
                          height={40}
                          loading="lazy"
                          className={styles.jobLogo}
                        />
                      ) : (
                        <span className={styles.jobLogoFallback} aria-hidden="true">
                          {job.company?.name?.charAt(0) || '·'}
                        </span>
                      )}
                      <span className={styles.jobMain}>
                        <span className={styles.jobTitle}>{job.title}</span>
                        <span className={styles.jobCompany}>
                          {job.company?.name}
                          {city ? ` · ${city}` : ''}
                          {job.employmentType
                            ? ` · ${job.employmentType === 'full-time' ? 'Full-time' : 'Part-time'}`
                            : ''}
                        </span>
                      </span>
                      <span className={styles.jobSide}>
                        {pay && <span className={styles.jobPay}>{pay}</span>}
                        {ago && <span className={styles.jobAgo}>{ago}</span>}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className={styles.howSection}>
        <div className={styles.sectionInner}>
          <div className={styles.howGrid}>
            <div className={styles.howCol}>
              <h2 className={styles.sectionTitle}>Looking for work?</h2>
              <p className={styles.howIntro}>
                Every listing here belongs to a company that manages its own board on Fork.
                There&apos;s no middle layer between you and the employer.
              </p>
              <ol className={styles.howList}>
                <li>Search <Link href="/jobs">open positions</Link> or browse <Link href="/boards">company boards</Link>.</li>
                <li>Apply with your resume and answers — no account required.</li>
                <li>The hiring team reviews it and reaches out directly for interviews and offers.</li>
              </ol>
            </div>
            <div className={styles.howCol}>
              <h2 className={styles.sectionTitle}>Hiring?</h2>
              <p className={styles.howIntro}>
                Fork gives your company its own job board at its own URL — free, with no contracts.
                Applications, resumes, interviews, and onboarding all live in one place.
              </p>
              <ol className={styles.howList}>
                <li>Create a listing with pay, requirements, and screening questions.</li>
                <li>Publish it to your board and share the link anywhere.</li>
                <li>Review applicants, schedule interviews, and hire from Fork.</li>
              </ol>
              <a
                href="https://medium.com/@bohdankhv/how-to-post-a-job-on-fork-in-under-2-minutes-bf957c35d46d"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.howLink}
              >
                Read: how to post a job in under 2 minutes
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Employer band */}
      <section className={styles.employerBand}>
        <div className={styles.employerInner}>
          <div>
            <h2 className={styles.employerTitle}>Put your openings where people can find them</h2>
            <p className={styles.employerSub}>
              Set up your company&apos;s job board and start accepting applications in a few minutes.
            </p>
          </div>
          <a
            href="https://app.forkhr.com/register"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.employerBtn}
          >
            Create a free job board
          </a>
        </div>
      </section>

      {/* About / SEO content */}
      <section className={styles.aboutSection}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>About Fork job boards</h2>
          <div className={styles.aboutContent}>
            <p>
              Fork job boards are company-owned hiring pages powered by{' '}
              <a href="https://forkhr.com" target="_blank" rel="noopener noreferrer">ForkHR</a>.
              Each business creates and manages its own board — listing open positions for
              barista jobs, restaurant jobs, coffee shop hiring, retail positions, and more.
            </p>
            <p>
              Unlike traditional job sites, Fork connects you directly with the employer.
              There are no recruiters, no middlemen, and no fees. You apply once, and your
              application goes straight to the hiring manager. Whether you&apos;re looking for
              local jobs near you, part-time work, or a full-time career in hospitality,
              retail, or food service, Fork makes it easy to find open positions and apply fast.
            </p>
            <h3>For job seekers</h3>
            <p>
              Browse open positions on the <Link href="/jobs">jobs page</Link> or explore
              company boards on the <Link href="/boards">boards page</Link>. Filter by keyword
              and apply directly — your resume and screening answers go straight to the
              employer, and you never need to create an account.
            </p>
            <h3>For employers</h3>
            <p>
              Employers on Fork get a free, SEO-friendly job board that lives at their own URL.
              Post listings, accept applications, review resumes with AI summaries, schedule
              interviews, and onboard new hires — all in one system.{' '}
              <a href="https://app.forkhr.com/register" target="_blank" rel="noopener noreferrer">
                Get started free
              </a>{' '}
              or read our guide on{' '}
              <a href="https://medium.com/@bohdankhv/how-to-post-a-job-on-fork-in-under-2-minutes-bf957c35d46d" target="_blank" rel="noopener noreferrer">
                how to post a job on Fork in under 2 minutes
              </a>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
