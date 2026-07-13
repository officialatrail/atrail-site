import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Lock, ArrowRight, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getAddIn, requestAddinEarlyAccess, getMyEarlyAccessStatus } from '../lib/contentStore';
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
      <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-white flex items-center justify-center">
        <span className="font-display text-base sm:text-xl font-bold text-zinc-900 tabular-nums">{String(value).padStart(2, '0')}</span>
      </div>
      <span className="mt-1 text-[9px] sm:text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{label}</span>
    </div>
  );
}

const FEATURES = [
  {
    title: 'Any AI you want',
    desc: 'Claude, GPT-4, DeepSeek, Grok, Gemini, or OpenRouter for dozens of models with one login.',
  },
  {
    title: 'Ask in plain English',
    desc: 'Sort, clean, build pivot tables, write formulas, and analyse data without writing a single formula.',
  },
  {
    title: 'Stays inside Excel',
    desc: 'The chat panel lives in Excel\'s ribbon. No browser, no copy-paste, no switching apps.',
  },
  {
    title: 'Your keys, your data',
    desc: 'API keys are encrypted on your machine using Windows DPAPI. Nothing is stored by Atrail.',
  },
];

export default function AddInSection() {
  const { isAuthenticated, userEmail } = useAuth();
  const addIn = getAddIn();
  const [countdown, setCountdown] = useState(() => calcCountdown(addIn.releaseDate));
  const [earlyStatus, setEarlyStatus] = useState(null);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setCountdown(calcCountdown(addIn.releaseDate)), 1000);
    return () => clearInterval(id);
  }, [addIn.releaseDate]);

  useEffect(() => {
    if (!isAuthenticated) return;
    getMyEarlyAccessStatus().then((s) => setEarlyStatus(s));
  }, [isAuthenticated]);

  const launched = countdown?.launched ?? false;
  const effectiveLaunched = launched || earlyStatus === 'approved';

  const handleRequest = async () => {
    if (!userEmail) return;
    setRequesting(true);
    try {
      await requestAddinEarlyAccess(userEmail);
      setEarlyStatus('pending');
      toast.success('Request submitted!');
    } catch {
      toast.error('Could not submit. Try again.');
    } finally {
      setRequesting(false);
    }
  };

  return (
    <section className="py-24 bg-zinc-950 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(#22d97a 1px, transparent 1px), linear-gradient(90deg, #22d97a 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block font-rubik text-xs font-bold px-3 py-1 rounded-full bg-brand-600 text-white mb-5">
              {effectiveLaunched && !launched ? 'Early Access' : launched ? 'Live Now, Free for all members' : 'Launching July 10 at 12pm'}
            </span>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
              Like Claude for Excel.<br />
              <Highlight>But use any AI.</Highlight>
            </h2>
            <p className="font-rubik text-zinc-400 leading-relaxed mb-8">
              Atrail AI for Excel puts a full AI chat panel directly inside Excel's ribbon. Connect any provider you already have, or use OpenRouter to access dozens of models with a single login. No vendor lock-in, no switching apps.
            </p>

            {/* Feature boxes */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {FEATURES.map((f) => (
                <div key={f.title} className="rounded-xl bg-brand-600 p-5">
                  <p className="font-display text-base font-bold text-white mb-2">{f.title}</p>
                  <p className="font-rubik text-sm text-brand-100 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* BYOK badge */}
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
                <span className="font-rubik text-xs font-bold text-brand-400 uppercase tracking-widest">BYOK</span>
                <span className="font-rubik text-xs text-zinc-400">Bring Your Own Key — connect your own API key. No Atrail subscription needed.</span>
              </span>
            </div>

            {effectiveLaunched ? (
              isAuthenticated ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={addIn.downloadUrl}
                    download
                    className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-brand-700 transition-all shadow-lg"
                  >
                    <Download size={16} /> Download Add-in
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
                    <Lock size={15} /> Sign in to download free
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
              <div className="flex flex-col gap-3">
                <Link
                  to="/addin"
                  className="inline-flex items-center gap-1.5 text-brand-400 hover:text-brand-300 font-semibold text-sm transition-colors"
                >
                  See what's coming <ArrowRight size={14} />
                </Link>
                {/* Compact early access request */}
                {!isAuthenticated ? (
                  <Link to="/login" className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 text-xs transition-colors">
                    <Lock size={11} /> Sign in to request early access
                  </Link>
                ) : earlyStatus === 'pending' ? (
                  <span className="inline-flex items-center gap-1.5 text-zinc-400 text-xs">
                    <Clock size={11} /> Early access request submitted
                  </span>
                ) : earlyStatus === 'rejected' ? (
                  <span className="text-xs text-zinc-500">Early access not approved.</span>
                ) : earlyStatus === null && isAuthenticated ? (
                  <button
                    onClick={handleRequest}
                    disabled={requesting}
                    className="inline-flex items-center gap-1.5 text-zinc-200 hover:text-white text-xs font-semibold underline underline-offset-2 transition-colors disabled:opacity-50"
                  >
                    {requesting ? 'Submitting...' : 'Request early access'}
                  </button>
                ) : null}
              </div>
            )}
          </motion.div>

          {/* Right: countdown + phone preview */}
          <motion.div
            className="flex flex-col items-center gap-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {!effectiveLaunched && (
              <div className="flex items-start gap-1.5 sm:gap-3">
                <Tile value={countdown?.d ?? 0} label="Days" />
                <div className="text-base sm:text-2xl font-bold text-zinc-400 mt-[10px] sm:mt-3">:</div>
                <Tile value={countdown?.h ?? 0} label="Hours" />
                <div className="text-base sm:text-2xl font-bold text-zinc-400 mt-[10px] sm:mt-3">:</div>
                <Tile value={countdown?.m ?? 0} label="Mins" />
                <div className="text-base sm:text-2xl font-bold text-zinc-400 mt-[10px] sm:mt-3">:</div>
                <Tile value={countdown?.s ?? 0} label="Secs" />
              </div>
            )}

            {/* Preview */}
            <div className="rounded-3xl overflow-hidden border border-zinc-700 shadow-2xl shadow-brand-900/20" style={{ width: '260px', aspectRatio: '9/16' }}>
              {addIn.gifUrl ? (
                <img src={addIn.gifUrl} alt="Atrail AI for Excel demo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-zinc-900 to-zinc-800">
                  <div className="text-4xl">📊</div>
                  <p className="font-rubik text-zinc-500 text-xs text-center px-6">Demo preview coming soon</p>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
