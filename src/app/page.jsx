import Link from 'next/link';
import { getAvailableJobBoardsCached, getCompanyJobsCached } from '../lib/jobBoardData';
import HomeSearchClient from './HomeSearchClient';
import styles from './page.module.css';
import { Avatar, Button, Img } from '../components';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Post a job with Fork',
  description: 'Post a job with Fork and explore companies currently hiring.',
  alternates: {
    canonical: '/',
  },
};

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

export default async function HomePage() {
  let boardIds = [];
  try {
    const res = await getAvailableJobBoardsCached();
    boardIds = (Array.isArray(res) ? res : [])
      .map((c) => c?._id)
      .filter(Boolean);
  } catch {
    boardIds = [];
  }

  const companies = [];
  const batches = chunk(boardIds, 10);
  for (const batch of batches) {
    const results = await Promise.all(
      batch.map(async (id) => {
        try {
          const data = await getCompanyJobsCached(id);
          const company = data?.company;
          const listings = Array.isArray(data?.listings) ? data.listings : [];
          if (!company?.publicUrl) return null;
          if (listings.length === 0) return null;

          const publicS3 = process.env.NEXT_PUBLIC_PUBLIC_S3_API_URL || process.env.PUBLIC_S3_API_URL;
          const logoUrl =
            company?.logo && publicS3 ? `${String(publicS3).replace(/\/+$/, '')}/${company.logo}` : undefined;

          return {
            _id: company?._id || id,
            name: company?.name || 'Company',
            logo: company?.logo || null,
            publicUrl: company.publicUrl,
            logoUrl,
            jobsCount: listings.length,
          };
        } catch {
          return null;
        }
      })
    );
    for (const r of results) if (r) companies.push(r);
  }

  companies.sort((a, b) => {
    if (b.jobsCount !== a.jobsCount) return b.jobsCount - a.jobsCount;
    return String(a.name).localeCompare(String(b.name));
  });

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: companies.map((c, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `/${c.publicUrl}`,
      name: c.name,
    })),
  };

  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <section>
        {/* <div className="w-max-600-px mx-auto">
          <div className="container py-6 my-6">
            <div className={styles.heroInner}>
              <div>
                <h1 className={styles.h1}>Company-owned job boards.</h1>
                <p className={styles.sub}>
                  Find your next role directly on company job boards. No middlemen, no recruiters—just you and the hiring
                </p>
                <div className={styles.heroActions}>
                  <Button
                    label="Search jobs"
                    type="brand"
                    variant="filled"
                    to="/search"
                    className={styles.heroButton}
                  />
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <div className="w-max-600-px mx-auto">
          <div className="container pt-6 pb-4 mt-6">
            <div className="bg-secondary p-4 border-radius-lg">
              <div className="fs-24 weight-500">
                Are you hiring?
              </div>
              <div className="fs-14 weight-400">
                Get candidates ready for work with a FREE job posting on Fork.
              </div>
              <div className="flex">
                <Button
                  label="Post a job"
                  type="brand"
                  variant="filled"
                  to="https://app.forkhr.com/hiring?new-job-listing=true"
                  target="_blank"
                  className="mt-3"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-max-600-px mx-auto">
          <div className="container">
            <div className="p-4 bg-secondary border-radius-lg">
              {/* Hiring companies */}
              <div className="fs-12 weight-600 border-bottom pb-3 mb-3 border-secondary text-uppercase">
                {companies.length} result{companies.length === 1 ? '' : 's'}
              </div>
              <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
                {companies.map((c) => (
                  <Link
                    key={c._id}
                    href={`/${c._id}`}
                    className="bg-main p-4 border-radius"
                  >
                    <div className="flex gap-3 align-center pb-3 border-bottom border-secondary">
                      {c.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                      <Img
                        img={
                          c?.logo
                            ? `https://public-s3.forkhr.com/${c.logo}`
                            : `https://ui-avatars.com/api/?name=${c?.name?.slice(0, 2)}&bold=true`
                        }
                        classNameContainer="w-max-50-px h-max-50-px border border-radius overflow-hidden"
                        name={c?.name}
                        alt={c?.name}
                        width={60}
                        height={60}
                        avatarColor={c.name.length}
                        len={2}
                        borderRadiusNone
                      />
                      ) : (
                        <div className="w-32-px h-32-px bg-tertiary border-radius-md" />
                      )}
                      <div>
                        <div className="fs-20 weight-600 text-dark text-ellipsis-1">{c.name}</div>
                        <div className="fs-12">
                          {c.description ? c.description : 'No description available.'}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between align-center pt-3">
                      <div className="fs-12 text-secondary-light">
                        {c.jobsCount} open {c.jobsCount === 1 ? 'job' : 'jobs'}
                      </div>
                      <Button
                        label="APPLY NOW"
                        to={`/${c._id}`}
                        variant="filled"
                        type="brand"
                        size="sm"
                        borderRadius="lg"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
