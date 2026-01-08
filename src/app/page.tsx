import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import ProductShowcase from "@/components/sections/ProductShowcase";
import InteractiveSection from "@/components/sections/InteractiveSection";
import SocialProof from "@/components/sections/SocialProof";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Story />
      <ProductShowcase />
      <InteractiveSection />
      <SocialProof />
      <CTA />
      <Footer />
    </>
  );
}
