'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import gsap from 'gsap';

export default function ContactHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-hero-line',
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power4.out', delay: 0.5 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      <motion.div className="absolute inset-0" style={{ scale }}>
        <Image
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop&q=80"
          alt="Modern office meeting"
          fill
          className="object-cover opacity-15"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/50 to-[#0a0a0a]" />
      </motion.div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 container mx-auto px-6 text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-block text-[#ff4d4d] text-sm uppercase tracking-[0.3em] font-medium mb-8"
        >
          Get In Touch
        </motion.span>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight mb-8 max-w-5xl mx-auto">
          <span className="block overflow-hidden">
            <span className="contact-hero-line block">Let's Create</span>
          </span>
          <span className="block overflow-hidden">
            <span className="contact-hero-line block text-gradient">Something Amazing</span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-xl md:text-2xl text-[#888888] max-w-3xl mx-auto leading-relaxed"
        >
          Ready to start your project? We would love to hear from you.
          Fill out the form below and we will get back to you within 24 hours.
        </motion.p>
      </motion.div>
    </section>
  );
}
