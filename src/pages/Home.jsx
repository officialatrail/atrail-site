import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Stats from '../components/Stats';
import Portfolio from '../components/Portfolio';
import Testimonials from '../components/Testimonials';
import useDocumentHead from '../lib/useDocumentHead';

export default function Home() {
  useDocumentHead(
    'Atrail: Finance Automation Hub',
    'Atrail is a community hub for finance and accounting workflow automation. Articles, tools, files, and AI prompts for automating workflows like reconciliation, financial modelling, and bookkeeping with n8n, Claude, Excel, etc.'
  );

  return (
    <div className="min-h-screen">
      <main>
        <Hero />
        <Features />
        <Stats />
        <Portfolio />
        <Testimonials />
      </main>
    </div>
  );
}
