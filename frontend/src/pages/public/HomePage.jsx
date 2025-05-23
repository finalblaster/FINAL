import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonial';
import Pricing from '@/components/Pricing';
import CallToAction from '@/components/CallToAction';
import PrimaryFeatures from '@/components/PrimaryFeatures';
import SecondaryFeatures from '@/components/SecondaryFeatures';
import Faqs from '@/components/Faqs';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

const HomePage = () => {
  const { t } = useTranslation(); // Initialize the translation hook

  return (
    <>
      <Helmet>
        <title>{t('home.pageTitle')}</title>
      </Helmet>
      <Hero />
      <PrimaryFeatures />
      <SecondaryFeatures />
      <CallToAction />
      <Testimonials />
      <Pricing />
      <Faqs />
    </>
  );
};

export default HomePage;
