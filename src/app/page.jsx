import Link from 'next/link';
import { searchJobListingsCached } from '../lib/jobBoardData';
import styles from './page.module.css';
import { getSiteUrl } from '../lib/siteUrl';
import Button from '../components/ui/Button';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Fork Jobs -- Find Jobs. Apply Fast. Get Hired.',
  description:
    'Discover local job openings on company-powered job boards. Browse barista jobs, restaurant jobs, retail positions, and more -- apply directly with no middlemen.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    title: 'Fork Jobs -- Find Jobs. Apply Fast. Get Hired.',
    description:
      'Discover local job openings on company-powered job boards. Browse and apply directly -- no middlemen, no recruiters.',
    url: '/',
    images: [
      {
        url: '/assets/og-image.png',
        width: 1200,
        height: 750,
        alt: 'Fork Jobs — Find Jobs. Apply Fast. Get Hired.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fork Jobs -- Find Jobs. Apply Fast. Get Hired.',
    description:
      'Discover local job openings on company-powered job boards. Browse and apply directly -- no middlemen, no recruiters.',
    images: ['/assets/og-image.png'],
  },
};

export default async function HomePage() {
  let recentJobs = [];
  let totalJobs = 0;
  try {
    const res = await searchJobListingsCached({ limit: 6, sort: 'recent' });
    const items = res?.items || res?.listings || [];
    recentJobs = Array.isArray(items) ? items : [];
    totalJobs = Number(res?.total) || recentJobs.length;
  } catch {
    recentJobs = [];
    totalJobs = 0;
  }
  const siteUrl = getSiteUrl();

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

      {/* ─── Hero ─── */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} />
              Company job boards powered by Fork
            </div>

            <h1 className={styles.heroTitle}>
              Find Jobs.<br />Apply Fast.<br />Get Hired<span className={styles.accent}>.</span>
            </h1>

            <p className={styles.heroSub}>
              Fork replaces traditional job sites with company-powered job boards. Browse open positions and apply directly to the employer -- no recruiters, no middlemen.
            </p>

            <div className={styles.heroCtas}>
              <Button
                to="/jobs"
                label="Browse jobs"
                variant="filled"
                type="brand"
              />
              <Button
                to="https://app.forkhr.com/hiring?new-job-listing=true"
                label="Post a job"
                variant="outline"
                target="_blank"
              />
            </div>

            <p className={styles.heroNote}>
              {totalJobs > 0
                ? `${totalJobs.toLocaleString()} open positions available`
                : 'New positions added daily'}
            </p>
          </div>
        </div>
      </section>

      {/* ─── Employer Flow ─── */}
      <section className={styles.sectionAlt}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionLabel}>For Employers</div>
          <h2 className={styles.sectionTitle}>Your own job board in minutes</h2>
          <p className={styles.sectionSub}>
            Create listings, accept applications, and hire -- all from one platform. No fees, no contracts.{' '}
            <a href="https://medium.com/@bohdankhv/how-to-post-a-job-on-fork-in-under-2-minutes-bf957c35d46d" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', textDecorationColor: '#cbd5e1', textUnderlineOffset: 2 }}>
              Learn how →
            </a>
          </p>
          <div className={styles.stepsGrid}>
            {[
              { step: '01', title: 'Create a listing', desc: 'Add job details, requirements, screening questions, and pay information.' },
              { step: '02', title: 'Publish to your board', desc: 'Your company gets its own SEO-friendly job board -- branded and shareable.' },
              { step: '03', title: 'Accept applications', desc: 'Applicants apply directly. Review resumes, AI summaries, and responses.' },
              { step: '04', title: 'Hire & onboard', desc: 'Send interviews, extend offers, and onboard -- all in Fork.' },
            ].map((s) => (
              <div key={s.step} className={styles.stepCard}>
                <div className={styles.stepNumber}>{s.step}</div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Applicant Flow ─── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionLabel}>For Applicants</div>
          <h2 className={styles.sectionTitle}>From application to offer</h2>
          <p className={styles.sectionSub}>
            Apply directly on company job boards. No account needed, no third-party recruiter.
          </p>
          <div className={styles.stepperRow}>
            {[
              { num: 1, title: 'Apply', desc: 'Submit your info and resume directly to the company.' },
              { num: 2, title: 'Review', desc: 'The hiring team reviews your application and resume.' },
              { num: 3, title: 'Interview', desc: 'Get interview invitations with one-click scheduling.' },
              { num: 4, title: 'Get hired', desc: 'Accept an offer and onboard -- all through Fork.' },
            ].map((s, i) => (
              <div key={s.num} className={styles.stepperItem}>
                <div className={styles.stepperCircle}><span>{s.num}</span></div>
                {i < 3 && <div className={styles.stepperLine} />}
                <h3 className={styles.stepperTitle}>{s.title}</h3>
                <p className={styles.stepperDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Recent Jobs ─── */}
      {recentJobs.length > 0 && (
        <section className={styles.sectionAlt}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionLabel}>Latest Openings</div>
            <h2 className={styles.sectionTitle}>Recently posted jobs</h2>
            <p className={styles.sectionSub}>Fresh openings from companies hiring right now.</p>
            <div className={styles.jobsGrid}>
              {recentJobs.map((job) => (
                <Link key={job._id} href={`/jobs/${job._id}`} className={styles.jobCard}>
                  <div className={styles.jobCardTop}>
                    <div>
                      <h3 className={styles.jobTitle}>{job.title}</h3>
                      <p className={styles.jobCompany}>{job.company?.name}</p>
                    </div>
                    {job.employmentType && (
                      <span className={styles.jobBadge}>
                        {job.employmentType === 'full-time' ? 'Full-time' : 'Part-time'}
                      </span>
                    )}
                  </div>
                  <div className={styles.jobMeta}>
                    {job.location?.city && (
                      <span>{job.location.city}{job.location.state ? `, ${job.location.state}` : ''}</span>
                    )}
                    {job.payRateFrom > 0 && (
                      <span>
                        ${job.payRateFrom}
                        {job.payRateTo > job.payRateFrom ? ` - $${job.payRateTo}` : ''}
                        {job.payType === 'hourly' ? '/hr' : job.payType === 'salary' ? '/yr' : ''}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            <div className={styles.ctaRow}>
              <Button
                to="/jobs"
                label="View all jobs"
                variant="outline"
                size="lg"
              />
            </div>
          </div>
        </section>
      )}

      {/* ─── SEO Content ─── */}
      <section className={styles.sectionAlt}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>What are Fork job boards?</h2>
          <div className={styles.seoContent}>
            <p>
              Fork job boards are company-owned hiring pages powered by{' '}
              <a href="https://forkhr.com" target="_blank" rel="noopener noreferrer">ForkHR</a>.
              Each business creates and manages its own job board -- listing open positions for
              barista jobs, restaurant jobs, coffee shop hiring, retail positions, and more.
            </p>
            <p>
              Unlike traditional job sites, Fork job boards connect you directly with the
              employer. There are no recruiters, no middlemen, and no fees. You apply once, and
              your application goes straight to the hiring manager.
            </p>
            <p>
              Whether you&apos;re looking for local jobs near you, part-time work, or a full-time
              career in hospitality, retail, or food service -- Fork makes it easy to find open
              positions and apply fast.
            </p>
            <h3>How it works for job seekers</h3>
            <p>
              Browse open positions on the <Link href="/jobs">jobs page</Link> or explore
              company job boards on the <Link href="/boards">boards page</Link>. Filter by keyword
              and apply directly. Your application -- including your resume and screening question
              answers -- goes straight to the employer. No account required.
            </p>
            <h3>How it works for employers</h3>
            <p>
              Employers on Fork get a free, SEO-friendly job board that lives at their own URL.
              Post job listings, accept applications, review resumes with AI summaries, schedule
              interviews, and onboard new hires -- all in one system.{' '}
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

      {/* ─── Final CTA ─── */}
      <section className={styles.sectionDark}>
        <div className={styles.darkGlow} />
        <div className={styles.darkInner}>
          <h2 className={styles.darkTitle}>Ready to find your next opportunity?</h2>
          <p className={styles.darkSub}>
            Browse open positions from companies hiring right now -- or create your own free job
            board to start accepting applications today.
          </p>
          <div className={styles.heroCtas} style={{ justifyContent: 'center' }}>
            <Button
              to="/jobs"
              label="Browse jobs"
              variant="filled"
              size="lg"
              className={styles.btnWhite}
            />
            <Button
              to="https://app.forkhr.com/register"
              label="Create a job board"
              variant="outline"
              size="lg"
              target="_blank"
              className={styles.btnOutlineWhite}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
