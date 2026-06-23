import React from 'react';

// Turns any raw http(s) URL inside a plain-text string into a real clickable link,
// leaving the rest of the text untouched.
export function linkify(text) {
  const parts = (text || '').split(/(https?:\/\/[^\s]+)/g);
  return parts.map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-600 dark:text-brand-400 underline hover:text-brand-700 break-all"
        onClick={(e) => e.stopPropagation()}
      >
        {part}
      </a>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}
