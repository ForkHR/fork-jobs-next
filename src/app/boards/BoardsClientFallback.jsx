'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { searchCompaniesClient } from '../../lib/clientJobBoard';

// Rendered when the server-side fetch produced no companies. Refetches from
// the visitor's browser (which passes Cloudflare).
export default function BoardsClientFallback({ q = '', sort = 'jobs', publicS3 = '' }) {
  const [state, setState] = useState({ status: 'loading', items: [] });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await searchCompaniesClient({ q, sort, page: 1, limit: 50 });
        if (!cancelled) setState({ status: 'done', items: Array.isArray(res?.items) ? res.items : [] });
      } catch {
        if (!cancelled) setState({ status: 'error', items: [] });
      }
    })();
    return () => { cancelled = true; };
  }, [q, sort]);

  if (state.status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0', color: '#8A8480', fontSize: 14 }}>
        Loading boards…
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0', color: '#8A8480' }}>
        <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
          {state.status === 'error' ? 'Couldn’t load boards right now' : 'No boards found'}
        </p>
        <p style={{ fontSize: 14 }}>
          {state.status === 'error' ? 'Please try refreshing the page.' : 'Try a different search term.'}
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {state.items.map((company) => {
        const logoUrl =
          company?.logo && publicS3 ? `${String(publicS3).replace(/\/+$/, '')}/${company.logo}` : null;
        const boardSlug = company?.publicUrl || company?._id;
        return (
          <Link
            key={company._id}
            href={`/boards/${boardSlug}`}
            className="bg-tertiary-hover"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: 20,
              background: '#fff',
              border: '1px solid #d4d4d4',
              borderRadius: 24,
              textDecoration: 'none',
              color: 'inherit',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${company.name} logo`}
                width={40}
                height={40}
                style={{ borderRadius: 10, objectFit: 'cover', border: '1px solid #d4d4d4', flexShrink: 0 }}
                loading="lazy"
              />
            ) : (
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: '#ebebeb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#A9A49E',
                  flexShrink: 0,
                }}
              >
                {company?.name?.charAt(0) || '?'}
              </div>
            )}
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#2A2623' }}>{company.name}</div>
              <div style={{ fontSize: 13, color: '#8A8480' }}>
                {company.jobsCount} open {company.jobsCount === 1 ? 'position' : 'positions'}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
