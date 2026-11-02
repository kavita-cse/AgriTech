import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import MarketplacePreview from '../components/MarketplacePreview';
import ExpertConsultation from '../components/ExpertConsultation';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar />
      <main className="flex-grow-1">
        <Hero />
        <Features />
        <HowItWorks />
        <MarketplacePreview />
        <ExpertConsultation />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;

