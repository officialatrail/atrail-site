import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useDocumentHead from '../lib/useDocumentHead';
import Highlight from '../components/Highlight';

const sectionH2 = 'text-xl font-bold text-zinc-900 dark:text-white mt-10 mb-3';
const p = 'font-rubik text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4';
const ul = 'font-rubik list-disc pl-6 text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4 space-y-1';

export default function PrivacyPolicy() {
  useDocumentHead(
    'Privacy Policy | Atrail',
    'How Atrail collects, uses, and protects your data.'
  );

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <Header />
      <main className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
              Privacy <Highlight>Policy</Highlight>
            </h1>
            <p className="font-rubik text-sm text-zinc-500 dark:text-zinc-400">Last updated June 2026</p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-10 shadow-lg border border-slate-100 dark:border-zinc-800"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className={p}>
              Atrail ("we", "us") runs officialatrail.online. This page explains what data we collect, why, and how it's
              used. We keep this simple - we don't sell your data and we don't run ad trackers on this site.
            </p>

            <h2 className={sectionH2}>What we collect</h2>
            <ul className={ul}>
              <li>Your email address, if you sign up for an account, join the tools waitlist, or request exclusive prompt access.</li>
              <li>A password, if you create an account - stored securely (hashed) by our authentication provider, Supabase. We never see or store it in plain text.</li>
              <li>A chosen alias and any comments you post on articles, if you comment.</li>
              <li>Likes and comment votes, linked to your account or a randomly generated identifier stored in your browser if you're not signed in.</li>
              <li>Basic, non-identifying page view counts ("reads") per article.</li>
            </ul>

            <h2 className={sectionH2}>What we don't collect</h2>
            <ul className={ul}>
              <li>No payment or card details - "Buy Me a Coffee" purchases are handled entirely by Buy Me a Coffee, not us.</li>
              <li>No advertising cookies and no ad retargeting.</li>
              <li>No data sold or shared with advertisers or data brokers.</li>
            </ul>

            <h2 className={sectionH2}>How it's used</h2>
            <p className={p}>
              We use your email to manage your account, notify you about exclusive prompt access, or reach out about the
              tools waitlist. We use your alias and comments to power the public comment threads on articles. Local,
              on-device storage (your browser's localStorage) remembers things like your theme preference and which
              items you've liked, so the site feels consistent between visits.
            </p>

            <h2 className={sectionH2}>Analytics</h2>
            <p className={p}>
              We use Google Analytics to understand overall traffic - which pages get visited, roughly where from, and
              how people navigate the site. This sets a cookie and is not tied to your name or email. We don't use it
              for advertising. You can opt out using the{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
              >
                Google Analytics Opt-out Browser Add-on
              </a>{' '}
              or any browser tracking-protection setting.
            </p>

            <h2 className={sectionH2}>Where it's stored</h2>
            <p className={p}>
              Data is stored with Supabase, our database and authentication provider. The site itself is hosted on
              GitHub Pages. Both are reputable infrastructure providers; neither has permission to use your data for
              anything beyond running this site.
            </p>

            <h2 className={sectionH2}>Your choices</h2>
            <p className={p}>
              You can delete your own comments at any time. To change your account email, reset your password, or
              request full deletion of your account and associated data, email us at{' '}
              <a href="mailto:officialatrail@gmail.com" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                officialatrail@gmail.com
              </a>{' '}
              and we'll action it.
            </p>

            <h2 className={sectionH2}>Children's privacy</h2>
            <p className={p}>
              Atrail is intended for working professionals and is not directed at children under 13. We don't
              knowingly collect data from children.
            </p>

            <h2 className={sectionH2}>Changes</h2>
            <p className={p}>
              If this policy changes meaningfully, we'll update the date at the top of this page. Continued use of the
              site after a change means you accept the updated policy.
            </p>

            <h2 className={sectionH2}>Contact</h2>
            <p className={p}>
              Questions about this policy? Email{' '}
              <a href="mailto:officialatrail@gmail.com" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                officialatrail@gmail.com
              </a>
              .
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
