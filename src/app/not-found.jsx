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
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        textAlign: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '2.5rem', fontWeight: 600, color: '#2A2623', lineHeight: 1 }}>404</span>
        <span
          style={{
            width: 1,
            height: 40,
            background: '#E2DDD2',
          }}
        />
        <span style={{ fontSize: '1rem', fontWeight: 500, color: '#6B6560' }}>Page not found</span>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#8A8480', maxWidth: 360, marginBottom: '2rem', lineHeight: 1.6 }}>
        The page you&apos;re looking for doesn&apos;t exist or the job board has been deactivated.
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/jobs"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.625rem 1.25rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#fff',
            background: '#033C29',
            borderRadius: 8,
            textDecoration: 'none',
          }}
        >
          Browse Jobs
        </Link>
        <Link
          href="/boards"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.625rem 1.25rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#3D3935',
            background: '#F8F6F1',
            borderRadius: 8,
            textDecoration: 'none',
          }}
        >
          Browse Boards
        </Link>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.625rem 1.25rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#3D3935',
            background: '#F8F6F1',
            borderRadius: 8,
            textDecoration: 'none',
          }}
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
