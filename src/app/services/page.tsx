import { Metadata } from 'next';
import ServicesHero from '@/components/sections/services/ServicesHero';
import ServicesList from '@/components/sections/services/ServicesList';
import Process from '@/components/sections/services/Process';
import Pricing from '@/components/sections/services/Pricing';
import CTA from '@/components/sections/CTA';
import Footer from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'Services | STUDIO.',
  description: 'Explore our premium digital services including web design, development, branding, and motion design.',
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesList />
      <Process />
      <Pricing />
      <CTA />
      <Footer />
    </>
  );
}
