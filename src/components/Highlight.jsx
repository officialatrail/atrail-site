import React from 'react';

// Underlines just the words themselves using a background-image instead of an
// absolutely-positioned SVG, so when the phrase wraps onto multiple lines on
// mobile, box-decoration-break clones the underline under each line instead
// of stretching one long line under the whole wrapped block.
export default function Highlight({ children }) {
  return (
    <span
      style={{
        backgroundImage: 'linear-gradient(transparent calc(100% - 0.18em), #22d97a calc(100% - 0.18em) calc(100% - 0.02em), transparent calc(100% - 0.02em))',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        boxDecorationBreak: 'clone',
        WebkitBoxDecorationBreak: 'clone',
      }}
    >
      {children}
    </span>
  );
}
