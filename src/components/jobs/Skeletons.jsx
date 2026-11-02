// Grey shapes with the real layout, shown while a list or a page loads.

export function JobCardSkeleton() {
  return (
    <div className="jb-card jb-skel-job" aria-hidden="true">
      <div className="jb-skel-job__top">
        <span className="jb-skel" style={{ width: 44, height: 44, borderRadius: 12 }} />
        <div className="jb-skel-job__lines">
          <span className="jb-skel" style={{ height: 16, width: '55%' }} />
          <span className="jb-skel" style={{ height: 12, width: '35%' }} />
        </div>
      </div>
      <span className="jb-skel" style={{ height: 12, width: '60%' }} />
      <div className="jb-skel-job__top" style={{ justifyContent: 'space-between', paddingTop: 10 }}>
        <span className="jb-skel" style={{ height: 14, width: 90 }} />
        <span className="jb-skel" style={{ height: 36, width: 88, borderRadius: 999 }} />
      </div>
    </div>
  );
}

export function JobListSkeleton({ count = 6, grid = false }) {
  return (
    <div className={grid ? 'jb-grid' : 'jb-list'}>
      {Array.from({ length: count }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CompanyCardSkeleton() {
  return (
    <div className="jb-card jb-skel-job" aria-hidden="true">
      <div className="jb-skel-job__top">
        <span className="jb-skel" style={{ width: 48, height: 48, borderRadius: 12 }} />
        <div className="jb-skel-job__lines">
          <span className="jb-skel" style={{ height: 16, width: '50%' }} />
          <span className="jb-skel" style={{ height: 12, width: '30%' }} />
        </div>
      </div>
      <span className="jb-skel" style={{ height: 12, width: '90%' }} />
      <span className="jb-skel" style={{ height: 12, width: '70%' }} />
    </div>
  );
}

export function CompanyListSkeleton({ count = 6 }) {
  return (
    <div className="jb-grid jb-grid--3">
      {Array.from({ length: count }).map((_, i) => (
        <CompanyCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ListPageSkeleton({ kind = 'jobs' }) {
  return (
    <main className="jb jb-main">
      <div className="jb-wrap jb-wrap--narrow">
        <div className="jb-pagehead" aria-hidden="true">
          <span className="jb-skel" style={{ height: 14, width: 120, display: 'block', marginBottom: 22 }} />
          <span className="jb-skel" style={{ height: 36, width: 260, display: 'block' }} />
          <span className="jb-skel" style={{ height: 14, width: 340, display: 'block', marginTop: 14 }} />
        </div>
        <div className="jb-toolbar" aria-hidden="true">
          <span className="jb-skel" style={{ height: 48, borderRadius: 999 }} />
        </div>
        {kind === 'jobs' ? <JobListSkeleton count={5} /> : <CompanyListSkeleton count={6} />}
      </div>
    </main>
  );
}

export function DetailPageSkeleton() {
  return (
    <main className="jb jb-main">
      <div className="jb-wrap">
        <div className="jb-detail" aria-hidden="true">
          <div className="jb-detail__main">
            <span className="jb-skel" style={{ height: 14, width: 200, display: 'block', marginBottom: 22 }} />
            <div className="jb-detail__head">
              <span className="jb-skel" style={{ width: 60, height: 60, borderRadius: 16, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <span className="jb-skel" style={{ height: 32, width: '60%', display: 'block' }} />
                <span className="jb-skel" style={{ height: 14, width: '30%', display: 'block', marginTop: 12 }} />
              </div>
            </div>
            <div className="jb-detail__meta">
              <span className="jb-skel" style={{ height: 32, width: 120, borderRadius: 999 }} />
              <span className="jb-skel" style={{ height: 32, width: 140, borderRadius: 999 }} />
              <span className="jb-skel" style={{ height: 32, width: 100, borderRadius: 999 }} />
            </div>
            <div className="jb-detail__section">
              {[90, 100, 85, 95, 70].map((w, i) => (
                <span key={i} className="jb-skel" style={{ height: 13, width: `${w}%`, display: 'block', marginBottom: 12 }} />
              ))}
            </div>
          </div>
          <div className="jb-aside">
            <div className="jb-card jb-apply">
              <span className="jb-skel" style={{ height: 18, width: '50%', display: 'block' }} />
              <span className="jb-skel" style={{ height: 13, width: '70%', display: 'block', marginTop: 14 }} />
              <span className="jb-skel" style={{ height: 13, width: '60%', display: 'block', marginTop: 10 }} />
              <span className="jb-skel" style={{ height: 44, borderRadius: 999, display: 'block', marginTop: 20 }} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export function CompanyPageSkeleton() {
  return (
    <main className="jb jb-main">
      <div className="jb-cohead" aria-hidden="true">
        <div className="jb-wrap jb-wrap--narrow">
          <span className="jb-skel" style={{ height: 14, width: 200, display: 'block', marginBottom: 22 }} />
          <div className="jb-cohead__row">
            <div className="jb-cohead__id">
              <span className="jb-skel" style={{ width: 72, height: 72, borderRadius: 18, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <span className="jb-skel" style={{ height: 32, width: '50%', display: 'block' }} />
                <span className="jb-skel" style={{ height: 14, width: '30%', display: 'block', marginTop: 12 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="jb-wrap jb-wrap--narrow">
        <div className="jb-section--tight">
          <JobListSkeleton count={4} />
        </div>
      </div>
    </main>
  );
}
