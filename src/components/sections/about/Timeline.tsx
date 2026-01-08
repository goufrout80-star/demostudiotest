'use client';

import { motion } from 'framer-motion';

const milestones = [
  {
    year: '2013',
    title: 'The Beginning',
    description: 'Founded with a vision to transform digital experiences. Started with a team of 3 passionate designers.',
  },
  {
    year: '2015',
    title: 'Global Expansion',
    description: 'Opened offices in New York and London. Grew to a team of 25 talented individuals.',
  },
  {
    year: '2017',
    title: 'Award Recognition',
    description: 'Won our first Awwwards Site of the Year. Recognized as a leading digital agency.',
  },
  {
    year: '2019',
    title: 'Innovation Lab',
    description: 'Launched our R&D division focused on emerging technologies like AR, VR, and AI.',
  },
  {
    year: '2021',
    title: 'Sustainability Focus',
    description: 'Committed to carbon-neutral operations and sustainable digital practices.',
  },
  {
    year: '2024',
    title: 'Industry Leaders',
    description: 'Serving Fortune 500 companies with a team of 100+ experts across 5 continents.',
  },
];

export default function Timeline() {
  return (
    <section className="relative py-32 bg-[#0a0a0a] overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff4d4d] to-transparent" />
      </div>

      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[#ff4d4d] text-sm uppercase tracking-[0.3em] font-medium mb-6"
          >
            Our Journey
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter"
          >
            A Decade of
            <br />
            <span className="text-gradient">Innovation</span>
          </motion.h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#ff4d4d] via-[#00d4ff] to-[#ff4d4d] hidden md:block" />

          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`relative mb-16 md:mb-24 ${
                index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2 md:text-right'
              }`}
            >
              <div className={`md:w-1/2 ${index % 2 === 0 ? '' : 'md:ml-auto'}`}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff4d4d]/5 to-[#00d4ff]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                  
                  <div className="relative p-8 rounded-2xl bg-[#111111] border border-[#222222] group-hover:border-[#ff4d4d]/30 transition-all duration-500">
                    <div className="text-6xl font-bold text-gradient mb-4">
                      {milestone.year}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{milestone.title}</h3>
                    <p className="text-[#888888] leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute left-1/2 top-8 w-4 h-4 bg-[#ff4d4d] rounded-full -translate-x-1/2 hidden md:block ring-4 ring-[#0a0a0a] group-hover:scale-150 transition-transform duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
