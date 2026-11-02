'use client';

import { useState } from 'react';
import { CheckIcon, ShareIcon } from './icons';

/** Share a job: the native share sheet where there is one, else the link goes to the clipboard. */
export default function ShareJobButton({ jobUrl, jobTitle, className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e) => {
    e.preventDefault();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: jobTitle, url: jobUrl });
        return;
      } catch {
        // Cancelled or unsupported for this payload: fall through to the clipboard.
      }
    }
    try {
      await navigator.clipboard.writeText(jobUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this link:', jobUrl);
    }
  };

  return (
    <button type="button" onClick={handleShare} className={`jb-share${copied ? ' jb-share--done' : ''}${className ? ` ${className}` : ''}`}>
      {copied ? <CheckIcon size={16} /> : <ShareIcon size={16} />}
      {copied ? 'Link copied' : 'Share this job'}
    </button>
  );
}
