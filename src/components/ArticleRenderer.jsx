import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ChartBlock from './ChartBlock';

// Splits markdown on ```chart ... ``` fences so chart JSON can be rendered
// with Recharts instead of as a plain code block.
function splitOnChartBlocks(markdown) {
  const parts = [];
  const regex = /```chart\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(markdown)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'markdown', content: markdown.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'chart', content: match[1] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < markdown.length) {
    parts.push({ type: 'markdown', content: markdown.slice(lastIndex) });
  }
  return parts;
}

const markdownComponents = {
  h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-10 mb-4" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-3" {...props} />,
  p: ({ node, ...props }) => <p className="font-rubik text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6" {...props} />,
  ul: ({ node, ...props }) => <ul className="font-rubik list-disc pl-6 text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6 space-y-2" {...props} />,
  ol: ({ node, ...props }) => <ol className="font-rubik list-decimal pl-6 text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6 space-y-2" {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote className="font-rubik border-l-4 border-brand-500 pl-5 italic text-zinc-600 dark:text-zinc-400 my-6" {...props} />
  ),
  code: ({ node, inline, ...props }) =>
    inline ? (
      <code className="bg-brand-50 dark:bg-zinc-800 text-brand-700 dark:text-brand-300 px-1.5 py-0.5 rounded text-[0.9em] font-mono" {...props} />
    ) : (
      <code className="block bg-zinc-900 text-zinc-100 rounded-xl p-5 text-sm font-mono overflow-x-auto" {...props} />
    ),
  pre: ({ node, ...props }) => <pre className="my-6" {...props} />,
  table: ({ node, ...props }) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-left border-collapse" {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => <thead className="bg-brand-50 dark:bg-zinc-800" {...props} />,
  th: ({ node, ...props }) => <th className="px-4 py-3 text-sm font-bold text-zinc-700 dark:text-zinc-200 border-b border-slate-200 dark:border-zinc-700" {...props} />,
  td: ({ node, ...props }) => <td className="font-rubik px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-bold text-zinc-900 dark:text-white" {...props} />,
};

export default function ArticleRenderer({ body }) {
  // Backward-compatible: older articles stored body as an array of paragraph strings.
  const markdown = Array.isArray(body) ? body.join('\n\n') : body;
  const parts = splitOnChartBlocks(markdown || '');

  return (
    <div>
      {parts.map((part, i) =>
        part.type === 'chart' ? (
          <ChartBlock key={i} spec={part.content} />
        ) : (
          <ReactMarkdown key={i} remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {part.content}
          </ReactMarkdown>
        )
      )}
    </div>
  );
}
