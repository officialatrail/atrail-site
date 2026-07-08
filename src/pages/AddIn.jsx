import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Lock, CheckCircle, ChevronRight, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAddIn } from '../lib/contentStore';
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
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-zinc-900 dark:bg-white flex items-center justify-center">
        <span className="font-display text-3xl sm:text-4xl font-bold text-white dark:text-zinc-900 tabular-nums">
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

  const { isAuthenticated } = useAuth();
  const addIn = getAddIn();
  const [countdown, setCountdown] = useState(() => calcCountdown(addIn.releaseDate));

  useEffect(() => {
    const id = setInterval(() => setCountdown(calcCountdown(addIn.releaseDate)), 1000);
    return () => clearInterval(id);
  }, [addIn.releaseDate]);

  const launched = countdown?.launched ?? false;

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
              {launched ? 'Live Now' : 'Launching Soon'}
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
          </motion.div>

          {/* Countdown or Download */}
          {!launched ? (
            <motion.div
              className="flex flex-col items-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="font-rubik text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-6 uppercase tracking-wider">Launching July 10 at 12pm</p>
              <div className="flex items-start gap-4 sm:gap-6">
                <CountdownBox value={countdown?.d ?? 0} label="Days" />
                <div className="text-3xl font-bold text-zinc-400 mt-5">:</div>
                <CountdownBox value={countdown?.h ?? 0} label="Hours" />
                <div className="text-3xl font-bold text-zinc-400 mt-5">:</div>
                <CountdownBox value={countdown?.m ?? 0} label="Mins" />
                <div className="text-3xl font-bold text-zinc-400 mt-5">:</div>
                <CountdownBox value={countdown?.s ?? 0} label="Secs" />
              </div>
              <p className="font-rubik text-sm text-zinc-400 dark:text-zinc-500 mt-6">Free for everyone · Requires sign-in to download</p>
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
                  className="inline-flex items-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-brand-700 transition-all duration-200 shadow-xl hover:shadow-2xl"
                >
                  <Download size={20} /> Download Atrail AI for Excel (.xll)
                </a>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="inline-flex items-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-full font-semibold text-lg filter blur-[3px] select-none pointer-events-none">
                      <Download size={20} /> Download Atrail AI for Excel (.xll)
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
                  Windows 10/11 · Excel 2016+ (64-bit) · Requires .NET 10 Desktop Runtime
                </p>
              )}
            </motion.div>
          )}
        </div>

        {/* Phone preview */}
        <div className="max-w-xs mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <motion.div
            className="relative"
            style={{ aspectRatio: '9/16' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="absolute inset-0 rounded-[2.8rem] bg-zinc-900 dark:bg-zinc-800 border-[5px] border-zinc-700 shadow-2xl shadow-brand-900/20 overflow-hidden">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-[5px] bg-zinc-700 rounded-full z-10" />
              <div className="absolute inset-2 rounded-[2.2rem] overflow-hidden bg-zinc-800 dark:bg-zinc-900">
                {addIn.gifUrl ? (
                  <img src={addIn.gifUrl} alt="Atrail AI for Excel demo" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-zinc-900 to-zinc-800">
                    <div className="text-4xl">📊</div>
                    <p className="font-rubik text-zinc-500 text-xs text-center px-6">Demo preview coming soon</p>
                  </div>
                )}
              </div>
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-zinc-600 rounded-full" />
            </div>
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
                <h3 className="font-display font-bold text-white mb-2 text-sm">{title}</h3>
                <p className="font-rubik text-xs text-brand-100 leading-relaxed">{desc}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Installation + Guide — only shown after launch */}
        {launched ? (
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
                {['Windows 10 or 11', 'Excel 2016 or later (64-bit)', '.NET 10 Desktop Runtime (free, about 25 MB, one-time install from Microsoft)'].map((r) => (
                  <li key={r} className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300 font-rubik">
                    <CheckCircle size={16} className="text-brand-600 dark:text-brand-400 mt-0.5 shrink-0" />
                    {r === '.NET 10 Desktop Runtime (free, about 25 MB, one-time install from Microsoft)' ? (
                      <span>
                        <a href="https://dotnet.microsoft.com/en-us/download/dotnet/10.0" target="_blank" rel="noopener noreferrer" className="text-brand-600 dark:text-brand-400 underline hover:text-brand-700">
                          .NET 10 Desktop Runtime
                        </a>
                        {' '}(free, about 25 MB, one-time install from Microsoft)
                      </span>
                    ) : r}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Installation */}
            <motion.div
              className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 p-8 sm:p-10 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white mb-6">Installation</h2>
              <ol className="space-y-4">
                {[
                  <>Install <a href="https://dotnet.microsoft.com/en-us/download/dotnet/10.0" target="_blank" rel="noopener noreferrer" className="text-brand-600 dark:text-brand-400 underline hover:text-brand-700">.NET 10 Desktop Runtime</a> if you haven't already</>,
                  'Download Atrail Excel Addin.xll using the button above',
                  'Open Excel, go to File, then Options, then Add-ins',
                  'Set "Manage" to Excel Add-ins and click Go',
                  'Click Browse, select the .xll file, click OK',
                  'Tick the checkbox next to Atrail AI and click OK',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-4 font-rubik text-sm text-zinc-700 dark:text-zinc-300">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <span className="mt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-6 bg-zinc-50 dark:bg-zinc-800 rounded-xl px-5 py-3 text-sm font-rubik text-zinc-600 dark:text-zinc-300">
                To reopen the panel later: <strong>Add-ins tab then Atrail AI</strong>
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
                  { q: 'Add-in did not load', a: 'Install .NET 10 Desktop Runtime and restart Excel.' },
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
                  className="inline-flex items-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-brand-700 transition-all duration-200 shadow-xl"
                >
                  <Download size={20} /> Download Now, It's Free
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
                  {['Install .NET 10 Desktop Runtime', 'Download Atrail Excel Addin.xll', 'Open Excel, go to File then Options then Add-ins', 'Browse to the .xll file and tick Atrail AI'].map((s, i) => (
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
