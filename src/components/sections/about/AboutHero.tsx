'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import gsap from 'gsap';

export default function AboutHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

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
        '.about-hero-word',
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power4.out', delay: 0.5 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      <motion.div className="absolute inset-0" style={{ scale }}>
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop&q=80"
          alt="Modern office workspace"
          fill
          className="object-cover opacity-20"
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
          About Us
        </motion.span>

        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight mb-8 max-w-5xl mx-auto"
        >
          {['We', 'Are', 'Digital', 'Storytellers'].map((word, i) => (
            <span key={i} className="about-hero-word inline-block mr-4">
              {i === 2 ? <span className="text-gradient">{word}</span> : word}
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-xl md:text-2xl text-[#888888] max-w-3xl mx-auto leading-relaxed"
        >
          For over a decade, we've been crafting digital experiences that move people,
          inspire action, and transform businesses into industry leaders.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="grid grid-cols-3 gap-8 md:gap-16 max-w-3xl mx-auto mt-16"
        >
          {[
            { number: '12+', label: 'Years' },
            { number: '500+', label: 'Projects' },
            { number: '50+', label: 'Countries' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-[#888888] uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-[1px] h-16 bg-gradient-to-b from-[#ff4d4d] to-transparent"
        />
      </motion.div>
    </section>
  );
}
