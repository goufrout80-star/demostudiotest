'use client';

import { motion } from 'framer-motion';

const values = [
  {
    icon: '01',
    title: 'Purpose-Driven',
    description: 'Every project starts with why. We believe in creating work that matters, that serves a purpose beyond aesthetics.',
  },
  {
    icon: '02',
    title: 'Innovation First',
    description: 'We do not follow trends we set them. Our team constantly explores new technologies and techniques.',
  },
  {
    icon: '03',
    title: 'Collaboration',
    description: 'Your vision, our expertise. We work as partners, not vendors, to bring your ideas to life.',
  },
  {
    icon: '04',
    title: 'Quality Obsessed',
    description: 'Perfection is our standard. We obsess over every detail until it is exactly right.',
  },
  {
    icon: '05',
    title: 'Results Focused',
    description: 'Beautiful design is just the beginning. We measure success by the impact we create.',
  },
  {
    icon: '06',
    title: 'Global Mindset',
    description: 'We think globally, act locally. Our diverse team brings perspectives from around the world.',
  },
];

export default function Values() {
  return (
    <section className="relative py-32 bg-[#0a0a0a] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[#ff4d4d] text-sm uppercase tracking-[0.3em] font-medium mb-6"
          >
            Our Values
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter"
          >
            What We
            <br />
            <span className="text-gradient">Stand For</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff4d4d]/5 to-[#00d4ff]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              
              <div className="relative p-8 rounded-3xl bg-[#111111] border border-[#222222] group-hover:border-[#ff4d4d]/30 transition-all duration-500 h-full">
                <div className="text-5xl font-bold text-[#ff4d4d]/20 mb-6">{value.icon}</div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-gradient transition-all duration-300">
                  {value.title}
                </h3>
                <p className="text-[#888888] leading-relaxed">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
