import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Atrail crashed:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 text-center px-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-zinc-900 dark:text-white mb-3">Something went wrong</h1>
          <p className="font-rubik text-zinc-600 dark:text-zinc-400 mb-6">
            Sorry about that - try refreshing the page. If it keeps happening, let us know.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center bg-brand-600 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-brand-700 transition-all duration-200"
          >
            Back to homepage
          </a>
        </div>
      </div>
    );
  }
}
