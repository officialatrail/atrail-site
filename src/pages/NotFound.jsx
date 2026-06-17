import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className="relative flex py-10 min-h-screen items-center justify-center overflow-hidden bg-zinc-900">
      <div className="mx-auto relative z-10 w-full max-w-[600px] text-center px-4">
        <h1 className="font-display mb-4 text-6xl font-bold text-brand-400">404</h1>
        <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">Page Not Found</h2>
        <p className="mb-8 text-base text-zinc-400 sm:text-lg">
          We can't seem to find the page you're looking for.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          Back to homepage
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
