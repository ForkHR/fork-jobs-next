'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SiteFooter() {
  const pathname = usePathname();

  // Don't show on branded company boards
  const isBrandedBoard =
    pathname &&
    pathname !== '/' &&
    !pathname.startsWith('/jobs') &&
    !pathname.startsWith('/boards') &&
    !pathname.startsWith('/search') &&
    !pathname.startsWith('/debug') &&
    !pathname.startsWith('/__debug');

  if (isBrandedBoard) return null;

  return (
    <footer
      style={{
        borderTop: '1px solid #f1f5f9',
        background: '#fff',
        fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 600,
          margin: '0 auto',
          padding: '40px 24px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 32,
            marginBottom: 32,
          }}
        >
          {/* Jobs */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', margin: '0 0 12px' }}>
              Jobs
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link href="/jobs" style={{ fontSize: 14, color: '#475569', textDecoration: 'none' }}>Browse All Jobs</Link>
              <Link href="/boards" style={{ fontSize: 14, color: '#475569', textDecoration: 'none' }}>Browse Boards</Link>
              <Link href="/jobs?type=full-time" style={{ fontSize: 14, color: '#475569', textDecoration: 'none' }}>Full-time Jobs</Link>
              <Link href="/jobs?type=part-time" style={{ fontSize: 14, color: '#475569', textDecoration: 'none' }}>Part-time Jobs</Link>
            </nav>
          </div>

          {/* For Employers */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', margin: '0 0 12px' }}>
              For Employers
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="https://app.forkhr.com/hiring?new-job-listing=true" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: '#475569', textDecoration: 'none' }}>Post a Job</a>
              <a href="https://medium.com/@bohdankhv/how-to-post-a-job-on-fork-in-under-2-minutes-bf957c35d46d" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: '#475569', textDecoration: 'none' }}>How to Post a Job</a>
              <a href="https://app.forkhr.com/register" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: '#475569', textDecoration: 'none' }}>Create Job Board</a>
              <a href="https://app.forkhr.com/login" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: '#475569', textDecoration: 'none' }}>Employer Sign In</a>
            </nav>
          </div>

          {/* Fork */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', margin: '0 0 12px' }}>
              Fork
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="https://forkhr.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: '#475569', textDecoration: 'none' }}>Website</a>
              <a href="https://forkhr.com/features" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: '#475569', textDecoration: 'none' }}>Features</a>
              <a href="https://forkhr.com/pricing" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: '#475569', textDecoration: 'none' }}>Pricing</a>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', margin: '0 0 12px' }}>
              Legal
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="https://forkhr.com/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: '#475569', textDecoration: 'none' }}>Privacy Policy</a>
              <a href="https://forkhr.com/terms-of-service" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: '#475569', textDecoration: 'none' }}>Terms of Service</a>
            </nav>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid #f1f5f9',
            paddingTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
            © {new Date().getFullYear()} Fork. All rights reserved.
          </p>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
            Powered by{' '}
            <a
              href="https://forkhr.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#000000', textDecoration: 'underline', textDecorationColor: '#cbd5e1', textUnderlineOffset: 2, fontWeight: "600" }}
            >
              Fork
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
