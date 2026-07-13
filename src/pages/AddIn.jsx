import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Lock, CheckCircle, ChevronRight, ExternalLink, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getAddIn, requestAddinEarlyAccess, getMyEarlyAccessStatus, sendNotification, getMyAlias } from '../lib/contentStore';
import useDocumentHead from '../lib/useDocumentHead';
import Highlight from '../components/Highlight';

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

function CountdownBox({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-zinc-900 dark:bg-white flex items-center justify-center">
        <span className="font-display text-3xl md:text-4xl font-bold text-white dark:text-zinc-900 tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="mt-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{label}</span>
    </div>
  );
}

const FEATURES = [
  { title: 'Talk to your spreadsheet', desc: 'Ask in plain English to sort, clean, model, and analyse your data.' },
  { title: 'Any AI you want', desc: 'Claude, GPT-4, DeepSeek, Grok, Gemini, or OpenRouter for dozens of models with one login.' },
  { title: 'Lives in the ribbon', desc: 'No browser switching. The chat panel stays inside Excel where you work.' },
  { title: 'Your keys, your data', desc: 'API keys encrypted on your machine. Nothing is ever stored by Atrail.' },
];

const EXAMPLES = [
  '"Sort this table by revenue, highest first"',
  '"Add a total row at the bottom"',
  '"Create a pivot table showing sales by region"',
  '"Write a VLOOKUP formula to match order IDs"',
  '"Highlight all cells below 100 in red"',
  '"Summarise what\'s in this sheet"',
];

export default function AddIn() {
  useDocumentHead(
    'Atrail AI for Excel | Add-in',
    'An AI assistant built directly into Excel. Use any AI model you already have, or connect OpenRouter for dozens of models with one login.'
  );

  const { isAuthenticated, userEmail } = useAuth();
  const addIn = getAddIn();
  const [countdown, setCountdown] = useState(() => calcCountdown(addIn.releaseDate));
  const [earlyStatus, setEarlyStatus] = useState(null); // null | 'pending' | 'approved' | 'rejected'
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

  const trackDownload = () => {
    getMyAlias().then((alias) => {
      sendNotification({ type: 'addin_download', userEmail: userEmail ?? null, productName: 'Atrail AI for Excel Add-in', userName: alias });
    });
  };

  const handleRequest = async () => {
    if (!userEmail) return;
    setRequesting(true);
    try {
      await requestAddinEarlyAccess(userEmail);
      setEarlyStatus('pending');
      toast.success('Request submitted! We will review it shortly.');
    } catch (err) {
      console.error('Early access request error:', err);
      toast.error(err?.message ?? 'Could not submit request. Please try again.');
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <main className="pt-32 pb-24">

        {/* Hero */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block font-rubik text-xs font-bold px-3 py-1 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 mb-5">
              {effectiveLaunched && !launched ? 'Early Access' : launched ? 'Live Now' : 'Launching Soon'}
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white mb-5">
              Atrail AI <Highlight>for Excel</Highlight>
            </h1>
            <p className="font-rubik text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Like Claude for Excel, but use any AI. Connect your own API key or link to OpenRouter to access dozens of models with a single login.
            </p>
            <p className="font-rubik text-sm text-zinc-400 dark:text-zinc-500 mt-3">
              Supports Claude · GPT-4 · DeepSeek · Grok · Gemini · OpenRouter
            </p>
            <div className="mt-5">
              <span className="inline-flex items-center gap-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full px-4 py-2">
                <span className="font-rubik text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">BYOK</span>
                <span className="font-rubik text-xs text-zinc-500 dark:text-zinc-400">Bring Your Own Key — connect your API key directly. No Atrail subscription needed.</span>
              </span>
            </div>
          </motion.div>

          {/* Countdown / Early Access Request / Download */}
          {!effectiveLaunched ? (
            <motion.div
              className="flex flex-col items-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="font-rubik text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-6 uppercase tracking-wider">Launching July 10 at 12pm</p>
              {/* Mobile: 2×2 grid */}
              <div className="sm:hidden grid grid-cols-2 gap-4 w-full max-w-[280px]">
                {[
                  { v: countdown?.d ?? 0, l: 'Days' },
                  { v: countdown?.h ?? 0, l: 'Hours' },
                  { v: countdown?.m ?? 0, l: 'Mins' },
                  { v: countdown?.s ?? 0, l: 'Secs' },
                ].map(({ v, l }) => (
                  <div key={l} className="flex flex-col items-center gap-2">
                    <div className="w-full aspect-square rounded-2xl bg-zinc-900 dark:bg-white flex items-center justify-center">
                      <span className="font-display text-4xl font-bold text-white dark:text-zinc-900 tabular-nums">
                        {String(v).padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{l}</span>
                  </div>
                ))}
              </div>

              {/* sm+: horizontal row with colons */}
              <div className="hidden sm:flex items-start gap-3 md:gap-6">
                <CountdownBox value={countdown?.d ?? 0} label="Days" />
                <div className="text-3xl font-bold text-zinc-400 mt-5">:</div>
                <CountdownBox value={countdown?.h ?? 0} label="Hours" />
                <div className="text-3xl font-bold text-zinc-400 mt-5">:</div>
                <CountdownBox value={countdown?.m ?? 0} label="Mins" />
                <div className="text-3xl font-bold text-zinc-400 mt-5">:</div>
                <CountdownBox value={countdown?.s ?? 0} label="Secs" />
              </div>

              {/* Early access card */}
              <motion.div
                className="mt-12 w-full max-w-md bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 text-center shadow-sm"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                  Want in before launch?
                </h2>
                <p className="font-rubik text-sm text-zinc-500 dark:text-zinc-400 mb-7 leading-relaxed">
                  Request early access and we will review your request. Approved members get the full download and installation guide before July 10.
                </p>
                {!isAuthenticated ? (
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-full font-bold text-base hover:bg-brand-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <Lock size={16} /> Sign in to request early access
                  </Link>
                ) : earlyStatus === 'pending' ? (
                  <div className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-semibold text-sm">
                    <Clock size={15} /> Request submitted, awaiting approval
                  </div>
                ) : earlyStatus === 'rejected' ? (
                  <p className="font-rubik text-sm text-zinc-400 dark:text-zinc-500">Early access request was not approved.</p>
                ) : (
                  <button
                    onClick={handleRequest}
                    disabled={requesting}
                    className="inline-flex items-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-full font-bold text-base hover:bg-brand-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {requesting ? 'Submitting...' : 'Request Early Access'}
                  </button>
                )}
                <p className="font-rubik text-xs text-zinc-400 dark:text-zinc-500 mt-4">Free for everyone · Limited spots before launch</p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col items-center mb-16"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {isAuthenticated ? (
                <a
                  href={addIn.downloadUrl}
                  download
                  onClick={trackDownload}
                  className="inline-flex items-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-brand-700 transition-all duration-200 shadow-xl hover:shadow-2xl"
                >
                  <Download size={20} /> Download Add-in
                </a>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="inline-flex items-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-full font-semibold text-lg filter blur-[3px] select-none pointer-events-none">
                      <Download size={20} /> Download Add-in
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Link
                        to="/login"
                        className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition-all shadow-xl"
                      >
                        <Lock size={15} /> Sign in to download free
                      </Link>
                    </div>
                  </div>
                  <p className="font-rubik text-xs text-zinc-400 dark:text-zinc-500">Free for all Atrail members</p>
                </div>
              )}
              {isAuthenticated && (
                <p className="font-rubik text-xs text-zinc-400 dark:text-zinc-500 mt-3">
                  Windows 10/11 · Excel 2016+ (64-bit)
                </p>
              )}
            </motion.div>
          )}
        </div>

        {/* Preview */}
        <div className="max-w-sm mx-auto px-4 sm:px-6 lg:px-8 mb-20" style={{ maxWidth: '360px' }}>
          <motion.div
            className="rounded-3xl overflow-hidden border border-slate-200 dark:border-zinc-700 bg-zinc-900 shadow-2xl"
            style={{ aspectRatio: '9/16' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {addIn.gifUrl ? (
              <img src={addIn.gifUrl} alt="Atrail AI for Excel demo" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-zinc-900 to-zinc-800">
                <div className="text-5xl">📊</div>
                <p className="font-rubik text-zinc-500 text-sm text-center px-8">Demo preview coming soon</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Features */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {FEATURES.map(({ title, desc }) => (
              <div key={title} className="bg-brand-600 rounded-2xl p-6 shadow-sm">
                <h3 className="font-display font-bold text-white mb-3 text-xl">{title}</h3>
                <p className="font-rubik text-sm text-brand-100 leading-relaxed">{desc}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Installation + Guide — only shown after effective launch */}
        {effectiveLaunched ? (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

            {/* Requirements */}
            <motion.div
              className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 p-8 sm:p-10 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white mb-6">Requirements</h2>
              <ul className="space-y-3">
                {['Windows 10 or 11', 'Excel 2016 or later (64-bit)'].map((r) => (
                  <li key={r} className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300 font-rubik">
                    <CheckCircle size={16} className="text-brand-600 dark:text-brand-400 mt-0.5 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* How to Use */}
            <motion.div
              className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 p-8 sm:p-10 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white mb-8">How to Use</h2>

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-rubik text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-3 py-1 rounded-full uppercase tracking-wide">Option A</span>
                  <h3 className="font-rubik font-bold text-zinc-900 dark:text-white">Quick try — single session</h3>
                </div>
                <ol className="space-y-3">
                  {[
                    'Download the XLL file using the button above',
                    'Double-click it — Excel opens and asks to enable it',
                    'Click "Enable for this session only"',
                    'The Atrail tab appears in your Excel ribbon',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-4 font-rubik text-sm text-zinc-700 dark:text-zinc-300">
                      <span className="shrink-0 w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                      <span className="mt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
                <p className="font-rubik text-xs text-zinc-400 dark:text-zinc-500 mt-3">The add-in is not saved permanently — you repeat this each session.</p>
              </div>

              <div className="border-t border-slate-100 dark:border-zinc-800 mb-8" />

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-rubik text-xs font-bold bg-brand-600/10 text-brand-600 dark:text-brand-400 px-3 py-1 rounded-full uppercase tracking-wide">Option B</span>
                  <h3 className="font-rubik font-bold text-zinc-900 dark:text-white">Permanent install — recommended</h3>
                </div>
                <ol className="space-y-3">
                  {[
                    'Download the XLL file and save it somewhere you will not move it',
                    'In Excel go to File → Options → Add-ins',
                    'At the bottom, set Manage to Excel Add-ins and click Go',
                    'Click Browse, find the XLL file, and click OK',
                    'The add-in now loads automatically every time Excel opens',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-4 font-rubik text-sm text-zinc-700 dark:text-zinc-300">
                      <span className="shrink-0 w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">{i + 1}</span>
                      <span className="mt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-6 bg-zinc-50 dark:bg-zinc-800 rounded-xl px-5 py-3 text-sm font-rubik text-zinc-600 dark:text-zinc-300">
                  To reopen the panel later: <strong>Atrail tab in the Excel ribbon</strong>
                </div>
              </div>
            </motion.div>

            {/* Getting Started */}
            <motion.div
              className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 p-8 sm:p-10 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white mb-2">Getting Started</h2>
              <p className="font-rubik text-sm text-zinc-500 dark:text-zinc-400 mb-8">You need an API key from at least one provider, or sign in with OpenRouter for instant access.</p>

              <div className="mb-8">
                <h3 className="font-rubik font-bold text-zinc-900 dark:text-white mb-3">Option A: OpenRouter (easiest, free models available)</h3>
                <p className="font-rubik text-sm text-zinc-600 dark:text-zinc-400 mb-3">Access many AI models with one login. No API key to copy and paste.</p>
                <ol className="space-y-2">
                  {['Click the settings button in the panel', 'Scroll to OpenRouter and click Connect with OpenRouter', 'Approve in your browser and you are done'].map((s, i) => (
                    <li key={i} className="flex items-start gap-3 font-rubik text-sm text-zinc-700 dark:text-zinc-300">
                      <ChevronRight size={14} className="text-brand-600 dark:text-brand-400 mt-0.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ol>
                <p className="font-rubik text-xs text-zinc-400 dark:text-zinc-500 mt-3">Free models include Llama 4, Qwen 3, DeepSeek R1, Gemini Flash, and more.</p>
              </div>

              <div>
                <h3 className="font-rubik font-bold text-zinc-900 dark:text-white mb-3">Option B: Direct API key</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-rubik">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-zinc-800">
                        <th className="text-left py-2 pr-4 text-zinc-500 dark:text-zinc-400 font-semibold">Provider</th>
                        <th className="text-left py-2 pr-4 text-zinc-500 dark:text-zinc-400 font-semibold">Sign up</th>
                        <th className="text-left py-2 text-zinc-500 dark:text-zinc-400 font-semibold">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-zinc-800/50">
                      {[
                        ['Anthropic (Claude)', 'console.anthropic.com', 'Best reasoning'],
                        ['OpenAI (GPT-4)', 'platform.openai.com', 'GPT-4.1, o3, o4-mini'],
                        ['DeepSeek', 'platform.deepseek.com', 'Very low cost, R1 reasoning'],
                        ['xAI / Grok', 'console.x.ai', 'Grok 3'],
                        ['Gemini', 'aistudio.google.com', 'Free tier available'],
                      ].map(([provider, url, notes]) => (
                        <tr key={provider}>
                          <td className="py-2.5 pr-4 font-semibold text-zinc-900 dark:text-white">{provider}</td>
                          <td className="py-2.5 pr-4">
                            <a href={`https://${url}`} target="_blank" rel="noopener noreferrer" className="text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1">
                              {url} <ExternalLink size={11} />
                            </a>
                          </td>
                          <td className="py-2.5 text-zinc-500 dark:text-zinc-400">{notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="font-rubik text-xs text-zinc-400 dark:text-zinc-500 mt-3">Paste your key in settings, choose your provider and model, click Save.</p>
              </div>
            </motion.div>

            {/* What You Can Do */}
            <motion.div
              className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 p-8 sm:p-10 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white mb-2">What You Can Do</h2>
              <p className="font-rubik text-sm text-zinc-500 dark:text-zinc-400 mb-6">Type your request in the chat box and press Enter.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EXAMPLES.map((ex) => (
                  <div key={ex} className="bg-zinc-50 dark:bg-zinc-800 rounded-xl px-4 py-3 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                    {ex}
                  </div>
                ))}
              </div>
              <div className="mt-8 space-y-4">
                {[
                  { title: 'Scope', body: 'The toolbar shows the current scope. Click it to cycle between Sheet (active sheet), Selection (selected range), and Workbook (all sheets).' },
                  { title: 'Sheet Lock', body: 'Pin the AI to a specific sheet with the lock button. The AI will keep reading from and writing to the locked sheet even when you navigate away.' },
                  { title: 'Thinking Mode', body: 'Toggle extended reasoning for complex formulas and multi-step analysis.' },
                  { title: 'Permissions', body: 'For destructive actions like deleting rows or clearing data, the AI asks for approval first. Click Accept All to skip prompts for the session.' },
                ].map(({ title, body }) => (
                  <div key={title}>
                    <h4 className="font-rubik font-bold text-zinc-900 dark:text-white text-sm mb-1">{title}</h4>
                    <p className="font-rubik text-sm text-zinc-600 dark:text-zinc-400">{body}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Troubleshooting */}
            <motion.div
              className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 p-8 sm:p-10 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white mb-6">Troubleshooting</h2>
              <div className="space-y-5">
                {[
                  { q: 'Add-in did not load', a: 'Make sure Excel is 64-bit and version 2016 or later. Close Excel fully and try double-clicking the XLL again, or re-add it through File → Options → Add-ins.' },
                  { q: 'No API key message', a: 'Open settings in the panel and add your key or connect OpenRouter.' },
                  { q: 'HTTP 401 error', a: 'Your key is invalid or expired. Disconnect and reconnect OpenRouter, or check the key in your provider dashboard.' },
                  { q: 'Panel does not open', a: 'Go to the Add-ins tab in Excel\'s ribbon and click Atrail AI.' },
                  { q: 'White or invisible text', a: 'Open settings, switch Theme to Dark, save, then switch back.' },
                ].map(({ q, a }) => (
                  <div key={q}>
                    <p className="font-rubik font-bold text-zinc-900 dark:text-white text-sm">{q}</p>
                    <p className="font-rubik text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">{a}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-zinc-800">
                <p className="font-rubik text-sm text-zinc-500 dark:text-zinc-400">
                  Still stuck? Email{' '}
                  <a href="mailto:officialatrail@gmail.com" className="text-brand-600 dark:text-brand-400 underline hover:text-brand-700">
                    officialatrail@gmail.com
                  </a>
                  {' '}or open an issue on{' '}
                  <a href="https://github.com/officialatrail/Atrail-Excel-Addin" target="_blank" rel="noopener noreferrer" className="text-brand-600 dark:text-brand-400 underline hover:text-brand-700">
                    GitHub
                  </a>.
                </p>
              </div>
            </motion.div>

            {/* Bottom CTA */}
            {isAuthenticated && (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <a
                  href={addIn.downloadUrl}
                  download
                  onClick={trackDownload}
                  className="inline-flex items-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-brand-700 transition-all duration-200 shadow-xl"
                >
                  <Download size={20} /> Download Add-in
                </a>
              </motion.div>
            )}

          </div>
        ) : (
          /* Pre-launch: blurred instructions */
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="rounded-3xl border border-slate-100 dark:border-zinc-800 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="bg-zinc-50 dark:bg-zinc-900 px-8 py-6 border-b border-slate-100 dark:border-zinc-800">
                <p className="font-rubik text-sm font-semibold text-zinc-500 dark:text-zinc-400">Installation guide unlocks on launch</p>
              </div>
              <div className="relative bg-white dark:bg-zinc-900 px-8 py-8 filter blur-[3px] select-none pointer-events-none">
                <div className="space-y-4">
                  {['Download Atrail Excel Addin.xll', 'Open Excel, go to File then Options then Add-ins', 'Browse to the .xll file and tick Atrail AI'].map((s, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                      <span className="font-rubik text-sm text-zinc-700 dark:text-zinc-300">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900 px-8 py-6 text-center border-t border-slate-100 dark:border-zinc-800">
                {isAuthenticated ? (
                  <p className="font-rubik text-sm text-zinc-500 dark:text-zinc-400">Full instructions unlock at launch on July 10</p>
                ) : (
                  <Link to="/login" className="inline-flex items-center gap-2 font-rubik text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700">
                    <Lock size={13} /> Sign in now to get instant access on launch
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        )}

      </main>
    </div>
  );
}
