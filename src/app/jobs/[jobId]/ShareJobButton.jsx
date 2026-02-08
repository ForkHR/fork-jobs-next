'use client';

import { useState } from 'react';

export default function ShareJobButton({ jobUrl, jobTitle }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e) => {
    e.preventDefault();

    if (navigator.share) {
      try {
        await navigator.share({ title: jobTitle, url: jobUrl });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(jobUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Last resort
      window.prompt('Copy this link:', jobUrl);
    }
  };

  return (
    <button
      onClick={handleShare}
      style={{
        color: '#64748b',
        textDecoration: 'underline',
        textDecorationColor: '#cbd5e1',
        background: 'none',
        border: 'none',
        padding: 0,
        font: 'inherit',
        fontSize: 14,
        cursor: 'pointer',
      }}
    >
      {copied ? 'Link copied!' : 'Share this job'}
    </button>
  );
}
