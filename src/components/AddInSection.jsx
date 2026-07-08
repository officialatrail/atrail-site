import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAddIn } from '../lib/contentStore';
import Highlight from './Highlight';

function calcCountdown(targetDate) {
  if (!targetDate) return null;
  const diff = new Date(targetDate) - Date.now();
  if (diff <= 0) return { launched: true, d: 0, h: 0, m: 0, s: 0 };
  return {
    launched: false,
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}

function Tile({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 rounded-xl bg-zinc-900 dark:bg-zinc-800 flex items-center justify-center">
        <span className="font-display text-xl font-bold text-white tabular-nums">{String(value).padStart(2, '0')}</span>
      </div>
      <span className="mt-1.5 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function AddInSection() {
  const { isAuthenticated } = useAuth();
  const addIn = getAddIn();
  const [countdown, setCountdown] = useState(() => calcCountdown(addIn.releaseDate));

  useEffect(() => {
    const id = setInterval(() => setCountdown(calcCountdown(addIn.releaseDate)), 1000);
    return () => clearInterval(id);
  }, [addIn.releaseDate]);

  const launched = countdown?.launched ?? false;

  return (
    <section className="py-24 bg-zinc-950 dark:bg-zinc-950 relative overflow-hidden">
      {/* subtle grid bg */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(#22d97a 1px, transparent 1px), linear-gradient(90deg, #22d97a 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: text + CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block font-rubik text-xs font-bold px-3 py-1 rounded-full bg-brand-600 text-white mb-5">
              {launched ? 'Live Now — Free for all members' : 'Launching Friday at 12pm'}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Atrail AI <Highlight>for Excel</Highlight>
            </h2>
            <p className="font-rubik text-zinc-400 leading-relaxed mb-6">
              An AI assistant built directly into Excel. Ask it to sort, clean, analyse, build pivot tables, and add formulas — all in plain English. Supports Claude, GPT-4, DeepSeek, Grok, and more.
            </p>

            <ul className="space-y-2 mb-8">
              {[
                'Ask in plain English inside Excel',
                'Six AI providers — use the one you already have',
                'Lives in the ribbon, no browser switching',
                'Free for all Atrail members',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-300 font-rubik">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {launched ? (
              isAuthenticated ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={addIn.downloadUrl}
                    download
                    className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-brand-700 transition-all shadow-lg"
                  >
                    <Download size={16} /> Download Free (.xll)
                  </a>
                  <Link
                    to="/addin"
                    className="inline-flex items-center gap-1.5 text-brand-400 hover:text-brand-300 font-semibold text-sm transition-colors"
                  >
                    Installation guide <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-brand-700 transition-all shadow-lg"
                  >
                    <Lock size={15} /> Sign in to download — free
                  </Link>
                  <Link
                    to="/addin"
                    className="inline-flex items-center gap-1.5 text-brand-400 hover:text-brand-300 font-semibold text-sm transition-colors"
                  >
                    Learn more <ArrowRight size={14} />
                  </Link>
                </div>
              )
            ) : (
              <Link
                to="/addin"
                className="inline-flex items-center gap-1.5 text-brand-400 hover:text-brand-300 font-semibold text-sm transition-colors"
              >
                See what's coming <ArrowRight size={14} />
              </Link>
            )}
          </motion.div>

          {/* Right: countdown or GIF */}
          <motion.div
            className="flex flex-col items-center lg:items-end gap-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {!launched && (
              <div className="flex items-start gap-3 sm:gap-4">
                <Tile value={countdown?.d ?? 0} label="Days" />
                <div className="text-2xl font-bold text-zinc-600 mt-3">:</div>
                <Tile value={countdown?.h ?? 0} label="Hours" />
                <div className="text-2xl font-bold text-zinc-600 mt-3">:</div>
                <Tile value={countdown?.m ?? 0} label="Mins" />
                <div className="text-2xl font-bold text-zinc-600 mt-3">:</div>
                <Tile value={countdown?.s ?? 0} label="Secs" />
              </div>
            )}

            <div className="w-full max-w-md rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 aspect-video flex items-center justify-center">
              {addIn.gifUrl ? (
                <img src={addIn.gifUrl} alt="Atrail AI for Excel demo" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <div className="text-4xl mb-3">📊</div>
                  <p className="font-rubik text-zinc-500 text-xs">Demo preview coming soon</p>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
