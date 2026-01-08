'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import Image from 'next/image';
import MagneticButton from '../ui/MagneticButton';

const ctaBackground = 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&h=1080&fit=crop&q=80';

export default function CTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cta-letter',
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.03,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const title = "LET'S CREATE";
  const subtitle = 'SOMETHING EXTRAORDINARY';

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center py-32 bg-[#0a0a0a] overflow-hidden"
    >
      <motion.div 
        className="absolute inset-0"
        style={{ scale: bgScale }}
      >
        <Image
          src={ctaBackground}
          alt="Abstract gradient background"
          fill
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]" />
      </motion.div>
      
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,77,77,0.15) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      <motion.div
        style={{ scale, opacity }}
        className="container mx-auto px-6 text-center relative z-10"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block text-[#ff4d4d] text-sm uppercase tracking-[0.3em] font-medium mb-8"
        >
          Ready to Begin?
        </motion.span>

        <h2
          ref={textRef}
          className="text-5xl md:text-7xl lg:text-[10rem] font-bold tracking-tighter leading-[0.85] mb-4"
        >
          <span className="block overflow-hidden">
            {title.split('').map((letter, i) => (
              <span key={i} className="cta-letter inline-block">
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </span>
          <span className="block overflow-hidden text-gradient">
            {subtitle.split('').map((letter, i) => (
              <span key={i} className="cta-letter inline-block">
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </span>
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-[#888888] max-w-2xl mx-auto mt-8 mb-12"
        >
          Ready to transform your digital presence? Let's craft an experience
          that will leave a lasting impression on your audience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <MagneticButton variant="primary" className="text-lg px-12 py-6">
            Start a Project
          </MagneticButton>
          <MagneticButton variant="outline" className="text-lg px-12 py-6">
            Schedule a Call
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex justify-center gap-8"
        >
          {['hello@studio.com', '+1 (555) 123-4567'].map((contact, i) => (
            <a
              key={i}
              href={i === 0 ? `mailto:${contact}` : `tel:${contact}`}
              className="text-[#888888] hover:text-white transition-colors duration-300 text-sm"
              data-cursor-hover
            >
              {contact}
            </a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
