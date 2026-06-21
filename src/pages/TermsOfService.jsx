import React from 'react';
import { motion } from 'framer-motion';
import useDocumentHead from '../lib/useDocumentHead';
import Highlight from '../components/Highlight';

const sectionH2 = 'text-xl font-bold text-zinc-900 dark:text-white mt-10 mb-3';
const p = 'font-rubik text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4';
const ul = 'font-rubik list-disc pl-6 text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4 space-y-1';

export default function TermsOfService() {
  useDocumentHead(
    'Terms of Service | Atrail',
    'The terms that apply when you use Atrail.'
  );

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <main className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
              Terms of <Highlight>Service</Highlight>
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
              By using officialatrail.online ("Atrail"), you agree to the terms below. If you don't agree, please don't
              use the site.
            </p>

            <h2 className={sectionH2}>Content is provided as-is</h2>
            <p className={p}>
              Articles, tools, prompts, and videos on Atrail are shared to help finance professionals automate real
              work. They're provided "as-is", without warranty of any kind. Always review and test outputs - prompts,
              formulas, scripts, and templates - before relying on them for real financial decisions or production
              data. Atrail is not liable for losses arising from use of anything on this site.
            </p>

            <h2 className={sectionH2}>Accounts</h2>
            <ul className={ul}>
              <li>You're responsible for keeping your account credentials secure.</li>
              <li>One alias per account; aliases must be unique and aren't transferable.</li>
              <li>Don't create multiple accounts to evade restrictions (e.g. exclusive access limits).</li>
            </ul>

            <h2 className={sectionH2}>Comments and community content</h2>
            <p className={p}>
              Anyone with an account can post comments, and anyone can vote on them. By posting, you agree not to post
              anything illegal, abusive, spammy, or infringing on others' rights. We may remove any comment, alias, or
              account at our discretion, without notice, particularly in cases of abuse or spam.
            </p>

            <h2 className={sectionH2}>Intellectual property</h2>
            <p className={p}>
              Unless otherwise stated, articles, tools, and prompts on Atrail are free to use, copy, and adapt for your
              own work. The Atrail name, logo, and site design remain the property of Atrail.
            </p>

            <h2 className={sectionH2}>Changes to the service</h2>
            <p className={p}>
              We may add, change, or remove features, content, or access tiers (including what's free vs. exclusive)
              at any time.
            </p>

            <h2 className={sectionH2}>Changes to these terms</h2>
            <p className={p}>
              If these terms change meaningfully, we'll update the date at the top of this page. Continued use of the
              site after a change means you accept the updated terms.
            </p>

            <h2 className={sectionH2}>Contact</h2>
            <p className={p}>
              Questions about these terms? Email{' '}
              <a href="mailto:officialatrail@gmail.com" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                officialatrail@gmail.com
              </a>
              .
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
