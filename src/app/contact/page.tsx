import { Metadata } from 'next';
import ContactHero from '@/components/sections/contact/ContactHero';
import ContactForm from '@/components/sections/contact/ContactForm';
import ContactInfo from '@/components/sections/contact/ContactInfo';
import Footer from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'Contact Us | STUDIO.',
  description: 'Get in touch with our team. Let us help you transform your digital presence.',
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactForm />
      <ContactInfo />
      <Footer />
    </>
  );
}
