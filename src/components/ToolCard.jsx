import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Lock, ArrowRight } from 'lucide-react';
import { platforms } from '../lib/platformIcons';
import BorderBeam from './BorderBeam';
import LikeButton from './LikeButton';
import { useAuth } from '../context/AuthContext';
import { sendNotification, getMyAlias } from '../lib/contentStore';

export default function ToolCard({ tool, locked, requiresSignIn, onPlayVideo }) {
  const platformInfo = tool.platform ? platforms[tool.platform] : null;
  const { userEmail } = useAuth();

  const trackOpen = () => {
    getMyAlias().then((alias) => {
      sendNotification({ type: 'tool_open', userEmail: userEmail ?? null, productName: tool.name, userName: alias });
    });
  };

  const inner = (
    <>
      <BorderBeam />
      {requiresSignIn && (
        <span className="absolute top-4 right-4 z-10 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/90 dark:bg-zinc-800/90 text-zinc-400 dark:text-zinc-500 shadow-sm transition-colors duration-200 group-hover:bg-blue-100 group-hover:text-blue-500 dark:group-hover:bg-blue-900/40 dark:group-hover:text-blue-400">
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
          <span className="font-rubik text-xs font-bold px-2.5 py-1 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900">
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
        <div className="mt-4 relative z-10 flex items-center justify-between">
          <LikeButton itemKey={`tool-${tool.name}`} />
          <span
            className={`inline-flex items-center gap-1 text-xs font-bold px-3.5 py-1.5 rounded-full transition-colors duration-200 ${
              requiresSignIn
                ? 'bg-zinc-800 dark:bg-zinc-700 text-white group-hover:bg-blue-600'
                : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 group-hover:bg-brand-600 dark:group-hover:bg-brand-500 dark:group-hover:text-white'
            }`}
          >
            {requiresSignIn ? (
              <>Sign In <Lock size={11} /></>
            ) : (
              <>Open <ArrowRight size={11} /></>
            )}
          </span>
        </div>
      )}
    </>
  );

  const lockedClassName = "card-rich group relative block bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-zinc-800";

  const className = "card-rich group relative block bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-[0_4px_0_0_rgba(0,0,0,0.06)] dark:shadow-[0_4px_0_0_rgba(0,0,0,0.4)] hover:shadow-[0_2px_0_0_rgba(0,0,0,0.06)] dark:hover:shadow-[0_2px_0_0_rgba(0,0,0,0.4)] transition-all duration-150 border-2 border-slate-200 dark:border-zinc-700 hover:border-brand-300 dark:hover:border-brand-700 -translate-y-0.5 hover:translate-y-0 active:translate-y-0.5 active:shadow-none cursor-pointer";

  const signInClassName = "card-rich group relative block bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-[0_4px_0_0_rgba(0,0,0,0.06)] dark:shadow-[0_4px_0_0_rgba(0,0,0,0.4)] hover:shadow-[0_2px_0_0_rgba(0,0,0,0.06)] dark:hover:shadow-[0_2px_0_0_rgba(0,0,0,0.4)] transition-all duration-150 border-2 border-slate-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 -translate-y-0.5 hover:translate-y-0 active:translate-y-0.5 active:shadow-none cursor-pointer";

  if (locked) {
    return <div className={lockedClassName}>{inner}</div>;
  }

  if (requiresSignIn) {
    return <Link to="/login" className={signInClassName}>{inner}</Link>;
  }

  if (tool.link?.type === 'article') {
    return <Link to={`/articles/${tool.link.value}`} className={className}>{inner}</Link>;
  }

  if (tool.link?.type === 'video') {
    return (
      <button onClick={() => { trackOpen(); onPlayVideo?.(tool.link.value); }} className={`${className} text-left w-full`}>
        {inner}
      </button>
    );
  }

  return (
    <a href={tool.link?.value} target="_blank" rel="noopener noreferrer" onClick={trackOpen} className={className}>
      {inner}
    </a>
  );
}
