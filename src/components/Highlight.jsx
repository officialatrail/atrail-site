import React from 'react';

// Wraps a headline word/phrase with a thick, slightly hand-drawn underline
// instead of coloring the text itself.
export default function Highlight({ children }) {
  return (
    <span className="relative inline-block">
      {children}
      <svg
        className="absolute left-0 w-full pointer-events-none"
        style={{ bottom: '-0.12em', height: '0.32em' }}
        viewBox="0 0 220 16"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M3 11 C 50 14, 90 6, 130 9 C 160 10.5, 190 12.5, 217 7.5"
          stroke="#22d97a"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </span>
  );
}
