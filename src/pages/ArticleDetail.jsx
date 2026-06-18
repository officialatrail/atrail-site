import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NotFound from './NotFound';
import ArticleRenderer from '../components/ArticleRenderer';
import LikeButton from '../components/LikeButton';
import { getArticles } from '../lib/contentStore';
import useDocumentHead from '../lib/useDocumentHead';

export default function ArticleDetail() {
  const { slug } = useParams();
  const articles = getArticles();
  const article = articles.find((a) => a.slug === slug);

  useDocumentHead(
    article ? `${article.title} | Atrail` : undefined,
    article ? article.excerpt : undefined
  );

  if (!article) return <NotFound />;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <Header />
      <main className="pt-32 pb-24">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link to="/articles" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 mb-8">
              <ArrowLeft size={14} /> Back to articles
            </Link>

            <div className="flex items-center gap-3 mb-4 text-sm text-zinc-500 dark:text-zinc-500">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300">
                {article.category}
              </span>
              <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span>·</span>
              <span>{article.readTime}</span>
            </div>

            <h1 className="font-display text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6 leading-tight">
              {article.title}
            </h1>

            <div className="mb-10">
              <LikeButton itemKey={`article-${article.slug}`} />
            </div>

            <ArticleRenderer body={article.body} />
          </motion.div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
