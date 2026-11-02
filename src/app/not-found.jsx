import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="jb jb-main">
      <div className="jb-wrap">
        <div className="jb-404">
          <span className="jb-404__code">404</span>
          <h1>That page isn’t here</h1>
          <p>The page you’re looking for doesn’t exist, or the job board it belonged to has been deactivated.</p>
          <div className="jb-404__actions">
            <Link href="/jobs" className="jb-btn jb-btn--ink">
              Browse jobs
            </Link>
            <Link href="/boards" className="jb-btn jb-btn--outline">
              Company boards
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
