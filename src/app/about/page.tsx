import { Metadata } from 'next';
import AboutHero from '@/components/sections/about/AboutHero';
import Team from '@/components/sections/about/Team';
import Timeline from '@/components/sections/about/Timeline';
import Values from '@/components/sections/about/Values';
import CTA from '@/components/sections/CTA';
import Footer from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'About Us | STUDIO.',
  description: 'Learn about our story, team, and values. We are a digital experience agency pushing the boundaries of creativity.',
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Values />
      <Timeline />
      <Team />
      <CTA />
      <Footer />
    </>
  );
}
