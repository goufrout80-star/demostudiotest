'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import MagneticButton from '../ui/MagneticButton';

const Scene3D = dynamic(() => import('../three/Scene3D'), { ssr: false });

const heroImage = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop&q=80';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });

      tl.fromTo(
        '.hero-title-line',
        { y: '100%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 1, stagger: 0.1, ease: 'power4.out' }
      )
        .fromTo(
          '.hero-subtitle',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo(
          '.hero-cta',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo(
          '.hero-scroll-indicator',
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.2'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ scale: imageScale }}
      >
        <Image
          src={heroImage}
          alt="Digital universe background"
          fill
          className="object-cover opacity-30"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/50 via-transparent to-[#0a0a0a]" />
      </motion.div>
      
      <Scene3D />
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a] z-10 pointer-events-none" />

      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-20 container mx-auto px-6 text-center"
      >
        <div className="max-w-6xl mx-auto">
          <h1
            ref={titleRef}
            className="text-[clamp(3rem,15vw,12rem)] font-bold leading-[0.85] tracking-tighter mb-8"
          >
            <span className="block overflow-hidden">
              <span className="hero-title-line block">BEYOND</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-title-line block text-gradient">ORDINARY</span>
            </span>
          </h1>

          <p
            ref={subtitleRef}
            className="hero-subtitle text-lg md:text-xl lg:text-2xl text-[#888888] max-w-2xl mx-auto mb-12 font-light"
          >
            We craft digital experiences that transcend the mundane.
            Where innovation meets artistry, and vision becomes reality.
          </p>

          <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center">
            <MagneticButton variant="primary">
              <span>Explore Our Work</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </MagneticButton>
            <MagneticButton variant="outline">
              Watch Reel
            </MagneticButton>
          </div>
        </div>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="hero-scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-[#888888]">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[1px] h-12 bg-gradient-to-b from-[#ff4d4d] to-transparent"
        />
      </motion.div>
    </section>
  );
}
