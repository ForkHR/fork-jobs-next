import Link from 'next/link';
import { searchJobBoardCompaniesCached, searchJobListingsCached } from '../lib/jobBoardData';
import { getSiteUrl } from '../lib/siteUrl';
import { getPublicS3, itemsOf, plural } from '../lib/jobFormat';
import { HOW_IT_WORKS } from '../lib/howItWorks';
import HomeJobsFallback from './HomeJobsFallback';
import JobCard from '../components/jobs/JobCard';
import CompanyCard from '../components/jobs/CompanyCard';
import CompanyLogo from '../components/jobs/CompanyLogo';
import HowItWorks from '../components/jobs/HowItWorks';
import EmployerBand from '../components/jobs/EmployerBand';
import { ArrowRightIcon, CheckIcon, SearchIcon } from '../components/jobs/icons';

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

const POPULAR = [
  { label: 'Barista', href: '/jobs?q=barista' },
  { label: 'Server', href: '/jobs?q=server' },
  { label: 'Cook', href: '/jobs?q=cook' },
  { label: 'Bartender', href: '/jobs?q=bartender' },
  { label: 'Part-time', href: '/jobs?type=part-time' },
];

const JOBS_ON_HOME = 6;
const COMPANIES_ON_HOME = 6;

export default async function HomePage() {
  const [jobsRes, companiesRes] = await Promise.allSettled([
    searchJobListingsCached({ limit: JOBS_ON_HOME, sort: 'recent' }),
    searchJobBoardCompaniesCached({ limit: COMPANIES_ON_HOME, sort: 'jobs' }),
  ]);

  const jobsData = jobsRes.status === 'fulfilled' ? jobsRes.value : null;
  const recentJobs = itemsOf(jobsData);
  const totalJobs = Number(jobsData?.total) || recentJobs.length;

  const companiesData = companiesRes.status === 'fulfilled' ? companiesRes.value : null;
  const companies = itemsOf(companiesData);
  const totalCompanies = Number(companiesData?.total) || companies.length;

  const siteUrl = getSiteUrl();
  const publicS3 = getPublicS3();

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
    <main className="jb jb-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([websiteJsonLd, orgJsonLd]) }}
      />

      {/* Hero: the search */}
      <section className="jb-hero">
        <div className="jb-dots" aria-hidden="true" />
        <div className="jb-wrap">
          <div className="jb-hero__inner">
            <span className="jb-eyebrow">Jobs at local businesses</span>
            <h1 className="jb-hero__title">Local jobs, straight from the businesses hiring.</h1>
            <p className="jb-hero__lede">
              Cafés, restaurants and shops post their openings here, on job boards they run themselves. Apply once and
              it goes to the person doing the hiring, not a recruiter.
            </p>

            <form action="/jobs" role="search" className="jb-search jb-hero__search">
              <span className="jb-search__icon">
                <SearchIcon size={20} />
              </span>
              <input type="search" name="q" placeholder="Job title or keyword" aria-label="Search jobs" autoComplete="off" />
              <button type="submit" className="jb-btn jb-btn--ink">
                Search
              </button>
            </form>

            <div className="jb-hero__popular">
              <span>Popular:</span>
              {POPULAR.map((p) => (
                <Link key={p.href} href={p.href} className="jb-chip jb-chip--soft">
                  {p.label}
                </Link>
              ))}
            </div>

            <div className="jb-hero__facts">
              <span className="jb-hero__fact">
                {companies.length > 0 && (
                  <span className="jb-avatars" aria-hidden="true">
                    {companies.slice(0, 5).map((c) => (
                      <CompanyLogo key={c._id} company={c} size={28} publicS3={publicS3} />
                    ))}
                  </span>
                )}
                {totalJobs > 0 ? (
                  <span>
                    <b>{plural(totalJobs, 'open position')}</b>
                    {totalCompanies > 0 ? ` at ${plural(totalCompanies, 'business', 'businesses')}` : ''}
                  </span>
                ) : (
                  <span>New positions are added every week</span>
                )}
              </span>
              <span className="jb-hero__fact">
                <CheckIcon size={16} />
                No account needed
              </span>
              <span className="jb-hero__fact">
                <CheckIcon size={16} />
                Apply straight to the employer
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Latest openings. When the server fetch came back empty (the Cloudflare challenge on
          SSR requests), the visitor's browser refetches through HomeJobsFallback. */}
      <section className="jb-section jb-hairline">
        <div className="jb-wrap">
          <div className="jb-sechead">
            <div className="jb-sechead__text">
              <h2 className="jb-h2">Latest openings</h2>
              <p className="jb-lede">The newest listings across every board on Fork.</p>
            </div>
            <Link href="/jobs" className="jb-link">
              View all {totalJobs > recentJobs.length ? totalJobs.toLocaleString('en-US') : ''} jobs
              <ArrowRightIcon size={16} />
            </Link>
          </div>

          {recentJobs.length === 0 ? (
            <HomeJobsFallback publicS3={publicS3} limit={JOBS_ON_HOME} />
          ) : (
            <div className="jb-grid">
              {recentJobs.map((job) => (
                <JobCard key={job._id} job={job} publicS3={publicS3} />
              ))}
            </div>
          )}
        </div>
      </section>

      <HowItWorks
        id="how-it-works"
        eyebrow="How it works"
        title="From the sign in the window to your first shift"
        lede="Jordan applies for the weekend barista job at Main St. Four moments from the listing to the invite to Fork."
        slides={HOW_IT_WORKS}
      />

      {companies.length > 0 && (
        <section className="jb-section jb-hairline">
          <div className="jb-wrap">
            <div className="jb-sechead">
              <div className="jb-sechead__text">
                <h2 className="jb-h2">Businesses hiring on Fork</h2>
                <p className="jb-lede">Each one runs its own board. Open it to see every position and apply directly.</p>
              </div>
              <Link href="/boards" className="jb-link">
                All company boards
                <ArrowRightIcon size={16} />
              </Link>
            </div>
            <div className="jb-grid jb-grid--3">
              {companies.map((company) => (
                <CompanyCard key={company._id} company={company} publicS3={publicS3} />
              ))}
            </div>
          </div>
        </section>
      )}

      <EmployerBand />

      {/* About / SEO content */}
      <section className="jb-section jb-band">
        <div className="jb-wrap">
          <div className="jb-sechead">
            <div className="jb-sechead__text">
              <span className="jb-eyebrow">About</span>
              <h2 className="jb-h2">Job boards run by the businesses themselves</h2>
              <p className="jb-lede">
                Fork job boards are company-owned hiring pages powered by{' '}
                <a href="https://forkhr.com" target="_blank" rel="noopener noreferrer" className="jb-underline">
                  Fork
                </a>
                . Each business creates and manages its own board, listing open positions for barista jobs, restaurant
                jobs, coffee shop hiring, retail positions and more. There are no recruiters, no middlemen and no fees:
                you apply once, and your application goes straight to the hiring manager.
              </p>
            </div>
          </div>
          <div className="jb-about">
            <div className="jb-prose jb-prose--sm">
              <h3>For job seekers</h3>
              <p>
                Browse open positions on the <Link href="/jobs">jobs page</Link> or explore{' '}
                <Link href="/boards">company boards</Link>. Search by title or keyword, filter by full-time or part-time
                and apply directly: your resume and screening answers go straight to the employer, and you never need
                to create an account. Whether you are looking for local jobs near you, part-time work or a full-time
                career in hospitality, retail or food service, Fork makes it easy to find open positions and apply fast.
              </p>
            </div>
            <div className="jb-prose jb-prose--sm">
              <h3>For employers</h3>
              <p>
                Employers on Fork get an SEO-friendly job board that lives at its own URL. Post listings, accept
                applications, review resumes with AI summaries, schedule interviews and onboard new hires, all in one
                system.{' '}
                <a href="https://app.forkhr.com/register?use=workplace&plan=essential" target="_blank" rel="noopener noreferrer">
                  Create your job board
                </a>{' '}
                or read the guide on{' '}
                <a
                  href="https://medium.com/@bohdankhv/how-to-post-a-job-on-fork-in-under-2-minutes-bf957c35d46d"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  how to post a job on Fork in under 2 minutes
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
