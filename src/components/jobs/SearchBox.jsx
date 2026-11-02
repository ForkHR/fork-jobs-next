'use client';

import { SearchIcon, XIcon } from './icons';

/** The search pill for list pages: icon, input, a clear button once there is text. */
export default function SearchBox({ value, onChange, placeholder, label = 'Search', compact = true, autoFocus = false }) {
  return (
    <div className={`jb-search${compact ? ' jb-search--compact' : ''}`}>
      <span className="jb-search__icon">
        <SearchIcon size={18} />
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        autoComplete="off"
        autoFocus={autoFocus}
        enterKeyHint="search"
      />
      {value ? (
        <button type="button" className="jb-search__clear" onClick={() => onChange('')} aria-label="Clear search">
          <XIcon size={16} />
        </button>
      ) : null}
    </div>
  );
}

export function SortSelect({ value, onChange, options, label = 'Sort by' }) {
  return (
    <label className="jb-select">
      <span className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
        {label}
      </span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </label>
  );
}
