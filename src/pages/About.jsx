import React from 'react';
import { motion } from 'framer-motion';
import { Youtube, Linkedin, Mail } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getAbout } from '../lib/contentStore';

export default function About() {
  const about = getAbout();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <Header />
      <main className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
              About
              <span className="text-brand-600 dark:text-brand-400"> Atrail</span>
            </h1>
            <p className="font-rubik text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Built by Michael, a community hub for finance and accounting professionals
              who want to automate their work with AI and no-code tools.
            </p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-12 shadow-lg border border-slate-100 dark:border-zinc-800 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {about.bioParagraphs.map((p, i) => (
              <p key={i} className="font-rubik text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6 last:mb-0">
                {p}
              </p>
            ))}

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mt-8">
              <a
                href="https://youtube.com/@OfficialAtrail"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-[#FF0000] transition-colors"
              >
                <Youtube size={18} /> YouTube
              </a>
              <a
                href="https://www.linkedin.com/company/atrail/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-[#0A66C2] transition-colors"
              >
                <Linkedin size={18} /> LinkedIn
              </a>
              <a
                href="https://buymeacoffee.com/officialatrail/extras"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-[#FFDD00] transition-colors"
              >
                <img src="https://cdn.simpleicons.org/buymeacoffee" alt="" className="w-[18px] h-[18px]" /> Buy Me a Coffee
              </a>
              <a
                href="mailto:hello@officialatrail.online"
                className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                <Mail size={18} /> Email
              </a>
            </div>
          </motion.div>

          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Focus Areas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {about.focusAreas.map((area) => (
                <div key={area} className="flex items-start gap-3 bg-brand-50 dark:bg-zinc-900 rounded-xl p-5">
                  <span className="mt-1 w-2 h-2 rounded-full bg-brand-600 dark:bg-brand-400 shrink-0" />
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">{area}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
