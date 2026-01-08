'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Discovery',
    description: 'We dive deep into your business, goals, and audience to understand what makes you unique.',
  },
  {
    number: '02',
    title: 'Strategy',
    description: 'We develop a comprehensive roadmap that aligns with your objectives and market position.',
  },
  {
    number: '03',
    title: 'Design',
    description: 'Our team crafts stunning visuals and experiences that bring your brand to life.',
  },
  {
    number: '04',
    title: 'Development',
    description: 'We build robust, scalable solutions using the latest technologies and best practices.',
  },
  {
    number: '05',
    title: 'Launch',
    description: 'We ensure a smooth deployment and provide ongoing support for continuous improvement.',
  },
];

export default function Process() {
  return (
    <section className="relative py-32 bg-[#0a0a0a] overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff4d4d] to-transparent" />
      </div>

      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[#ff4d4d] text-sm uppercase tracking-[0.3em] font-medium mb-6"
          >
            Our Process
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter"
          >
            How We
            <br />
            <span className="text-gradient">Work Together</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff4d4d]/5 to-[#00d4ff]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              
              <div className="relative p-6 rounded-2xl bg-[#111111] border border-[#222222] group-hover:border-[#ff4d4d]/30 transition-all duration-500 h-full">
                <div className="text-5xl font-bold text-gradient mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-[#888888] leading-relaxed">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[2px] bg-gradient-to-r from-[#ff4d4d] to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
