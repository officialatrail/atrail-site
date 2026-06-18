import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Stats from '../components/Stats';
import Portfolio from '../components/Portfolio';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import useDocumentHead from '../lib/useDocumentHead';

export default function Home() {
  useDocumentHead(
    'Atrail: Finance Automation Hub',
    'Atrail is a community hub for finance and accounting workflow automation. Articles, tools, and AI prompts for automating reconciliation, financial modelling, and bookkeeping with n8n, Claude, and Excel.'
  );

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <Stats />
        <Portfolio />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
