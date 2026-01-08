'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
  {
    quote: "They didn't just build us a website. They crafted an experience that fundamentally changed how our customers perceive our brand.",
    author: 'Sarah Chen',
    role: 'CEO, Ethereal Labs',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face&q=80',
  },
  {
    quote: "The attention to detail is extraordinary. Every micro-interaction, every animation—it all comes together to create something truly magical.",
    author: 'Marcus Johnson',
    role: 'Creative Director, Quantum',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face&q=80',
  },
  {
    quote: "Working with them felt like having a true creative partner. They understood our vision and elevated it beyond what we imagined.",
    author: 'Elena Rodriguez',
    role: 'Founder, Nebula Studios',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face&q=80',
  },
];

const brands = [
  'GOOGLE',
  'APPLE',
  'META',
  'AMAZON',
  'NETFLIX',
  'SPOTIFY',
  'AIRBNB',
  'UBER',
];

export default function SocialProof() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);

  return (
    <section ref={containerRef} className="relative py-32 bg-[#0a0a0a] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[#ff4d4d] text-sm uppercase tracking-[0.3em] font-medium mb-6"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter"
          >
            Voices that
            <br />
            <span className="text-gradient">matter most</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff4d4d]/10 to-[#00d4ff]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              
              <div className="relative p-8 md:p-10 rounded-3xl bg-[#111111] border border-[#222222] group-hover:border-[#ff4d4d]/30 transition-colors duration-500 h-full flex flex-col">
                <svg
                  className="w-12 h-12 text-[#ff4d4d] mb-6 opacity-50"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                
                <p className="text-lg md:text-xl text-[#cccccc] leading-relaxed mb-8 flex-grow">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative ring-2 ring-[#ff4d4d]/30">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{testimonial.author}</div>
                    <div className="text-sm text-[#888888]">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />
          
          <motion.div
            style={{ x }}
            className="flex gap-16 py-8"
          >
            {[...brands, ...brands].map((brand, index) => (
              <div
                key={index}
                className="text-4xl md:text-5xl font-bold text-[#222222] hover:text-[#444444] transition-colors duration-300 whitespace-nowrap"
              >
                {brand}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-[#ff4d4d]/5 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-[#00d4ff]/5 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </section>
  );
}
