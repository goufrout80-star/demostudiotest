'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const words = ['INNOVATE', 'CREATE', 'INSPIRE', 'TRANSFORM', 'ELEVATE'];

export default function InteractiveSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [activeWord, setActiveWord] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['100%', '-100%']);
  const xSpring = useSpring(x, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray('.word-section');
      
      sections.forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section as Element,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveWord(i),
          onEnterBack: () => setActiveWord(i),
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative py-32 bg-[#0a0a0a] overflow-hidden"
    >
      <motion.div
        style={{ x: xSpring }}
        className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[30vw] font-bold text-[#111111] pointer-events-none select-none"
      >
        EXPERIENCE • DESIGN • FUTURE •
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="lg:sticky lg:top-32">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-[#ff4d4d] text-sm uppercase tracking-[0.3em] font-medium mb-6"
            >
              Our Philosophy
            </motion.span>
            
            <div ref={textRef} className="relative h-[200px] overflow-hidden">
              {words.map((word, index) => (
                <motion.h2
                  key={word}
                  className="absolute inset-0 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter"
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{
                    y: activeWord === index ? '0%' : activeWord > index ? '-100%' : '100%',
                    opacity: activeWord === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <span className="text-gradient">{word}</span>
                </motion.h2>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex gap-2 mt-8"
            >
              {words.map((_, index) => (
                <motion.div
                  key={index}
                  className="h-1 rounded-full transition-all duration-300"
                  animate={{
                    width: activeWord === index ? 48 : 12,
                    background: activeWord === index ? '#ff4d4d' : '#333333',
                  }}
                />
              ))}
            </motion.div>
          </div>

          <div className="space-y-0">
            {words.map((word, index) => (
              <div
                key={word}
                className="word-section min-h-[50vh] flex items-center"
              >
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8 }}
                  className="p-8 rounded-2xl bg-[#111111]/50 backdrop-blur-sm border border-[#222222] hover:border-[#ff4d4d]/30 transition-colors duration-500"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[#ff4d4d] text-sm font-mono">
                      0{index + 1}
                    </span>
                    <div className="w-12 h-[1px] bg-[#333333]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{word}</h3>
                  <p className="text-[#888888] leading-relaxed">
                    {getDescription(index)}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff4d4d] to-transparent" />
    </section>
  );
}

function getDescription(index: number): string {
  const descriptions = [
    'We push boundaries and challenge conventions to create solutions that have never existed before. Innovation is not just about technology—it is about reimagining possibilities.',
    'Every pixel, every interaction, every moment is carefully crafted. We believe that great design is invisible—it just works, feels right, and moves people.',
    'Our work is meant to spark something within. We create experiences that resonate on a deeper level, connecting brands with their audiences through emotion and authenticity.',
    'We do not just adapt to change—we drive it. Our solutions transform businesses, elevate brands, and redefine what is possible in the digital landscape.',
    'Excellence is our standard. We elevate every project we touch, bringing uncompromising quality and attention to detail that sets new industry benchmarks.',
  ];
  return descriptions[index];
}
