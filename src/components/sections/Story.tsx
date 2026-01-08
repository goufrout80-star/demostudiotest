'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Image from 'next/image';
import TextReveal from '../ui/TextReveal';

const stats = [
  { number: '150+', label: 'Projects Delivered' },
  { number: '50+', label: 'Global Clients' },
  { number: '12', label: 'Years Experience' },
  { number: '99%', label: 'Client Satisfaction' },
];

const teamAvatars = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face&q=80',
];

export default function Story() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textRef, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 10]);

  return (
    <section
      ref={containerRef}
      className="relative py-32 md:py-48 bg-[#0a0a0a] overflow-hidden"
    >
      <div className="absolute inset-0 opacity-5">
        <motion.div
          style={{ x: x1 }}
          className="absolute top-20 left-0 text-[20vw] font-bold text-white whitespace-nowrap"
        >
          INNOVATION • DESIGN • CRAFT •
        </motion.div>
        <motion.div
          style={{ x: x2 }}
          className="absolute bottom-20 right-0 text-[20vw] font-bold text-white whitespace-nowrap"
        >
          • EXPERIENCE • VISION • ART
        </motion.div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div ref={textRef} className="space-y-8">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-block text-[#ff4d4d] text-sm uppercase tracking-[0.3em] font-medium"
            >
              Our Story
            </motion.span>

            <TextReveal
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
              delay={0.2}
            >
              We don't just build websites. We architect digital emotions.
            </TextReveal>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-[#888888] leading-relaxed"
            >
              Founded on the belief that digital experiences should move people,
              we've spent over a decade pushing the boundaries of what's possible.
              Every pixel is intentional. Every interaction is crafted. Every
              moment is designed to leave a lasting impression.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex items-center gap-4"
            >
              <div className="flex -space-x-4">
                {teamAvatars.map((avatar, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full border-2 border-[#0a0a0a] overflow-hidden relative"
                  >
                    <Image
                      src={avatar}
                      alt={`Team member ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                ))}
              </div>
              <span className="text-sm text-[#888888]">
                Join 500+ brands who trust us
              </span>
            </motion.div>
          </div>

          <motion.div
            style={{ rotate }}
            className="relative aspect-square"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff4d4d]/20 to-[#00d4ff]/20 rounded-3xl" />
            <div className="absolute inset-4 bg-[#111111] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=800&fit=crop&q=80"
                alt="Futuristic tech workspace"
                fill
                className="object-cover opacity-40"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-[#111111]/50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="w-32 h-32 border border-[#ff4d4d]/50 rounded-full"
                />
                <motion.div
                  animate={{
                    scale: [1.2, 1, 1.2],
                    rotate: [360, 180, 0],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="absolute w-48 h-48 border border-[#00d4ff]/50 rounded-full"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute w-4 h-4 bg-[#ff4d4d] rounded-full animate-pulse-glow"
                />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, staggerChildren: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-32 pt-16 border-t border-[#222222]"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-[#888888] uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
