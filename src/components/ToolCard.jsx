import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Lock } from 'lucide-react';
import { platforms } from '../lib/platformIcons';
import BorderBeam from './BorderBeam';
import LikeButton from './LikeButton';

export default function ToolCard({ tool, locked, requiresSignIn, onPlayVideo }) {
  const platformInfo = tool.platform ? platforms[tool.platform] : null;

  const inner = (
    <>
      <BorderBeam />
      {requiresSignIn && (
        <span className="absolute top-4 right-4 z-10 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/90 dark:bg-zinc-800/90 text-zinc-400 dark:text-zinc-500 shadow-sm">
          <Lock size={13} />
        </span>
      )}
      <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-800 overflow-hidden rounded-xl mb-5">
        <img src={tool.image} alt={tool.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {tool.link?.type === 'video' && !requiresSignIn && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="w-5 h-5 text-brand-600 ml-0.5" fill="currentColor" />
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 mb-3">
        {platformInfo && (
          <span
            className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-1"
            title={tool.platform}
          >
            <img src={platformInfo.logo} alt={tool.platform} className="w-full h-full object-contain" />
          </span>
        )}
        {tool.price && (
          <span className="font-rubik text-xs font-bold px-2.5 py-1 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300">
            {tool.price}
          </span>
        )}
      </div>
      <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{tool.name}</h3>
      {locked ? (
        <p className="font-rubik text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed filter blur-[3px] select-none pointer-events-none">
          {tool.description}
        </p>
      ) : (
        <p className="font-rubik text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{tool.description}</p>
      )}
      {!locked && (
        <div className="mt-4 relative z-10">
          <LikeButton itemKey={`tool-${tool.name}`} />
        </div>
      )}
    </>
  );

  const lockedClassName = "card-rich group relative block bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-zinc-800";

  const className = "card-rich group relative block bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-[0_4px_0_0_rgba(0,0,0,0.06)] dark:shadow-[0_4px_0_0_rgba(0,0,0,0.4)] hover:shadow-[0_2px_0_0_rgba(0,0,0,0.06)] dark:hover:shadow-[0_2px_0_0_rgba(0,0,0,0.4)] transition-all duration-150 border-2 border-slate-200 dark:border-zinc-700 hover:border-brand-300 dark:hover:border-brand-700 -translate-y-0.5 hover:translate-y-0 active:translate-y-0.5 active:shadow-none cursor-pointer";

  if (locked) {
    return <div className={lockedClassName}>{inner}</div>;
  }

  if (requiresSignIn) {
    return <Link to="/login" className={className}>{inner}</Link>;
  }

  if (tool.link?.type === 'article') {
    return <Link to={`/articles/${tool.link.value}`} className={className}>{inner}</Link>;
  }

  if (tool.link?.type === 'video') {
    return (
      <button onClick={() => onPlayVideo?.(tool.link.value)} className={`${className} text-left w-full`}>
        {inner}
      </button>
    );
  }

  return (
    <a href={tool.link?.value} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  );
}
