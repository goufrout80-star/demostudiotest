'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const team = [
  {
    name: 'Alex Rivera',
    role: 'Founder & Creative Director',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&q=80',
  },
  {
    name: 'Maya Chen',
    role: 'Head of Design',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face&q=80',
  },
  {
    name: 'Jordan Blake',
    role: 'Lead Developer',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&q=80',
  },
  {
    name: 'Sofia Martinez',
    role: 'Strategy Director',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face&q=80',
  },
  {
    name: 'Marcus Johnson',
    role: 'Tech Lead',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face&q=80',
  },
  {
    name: 'Emma Wilson',
    role: 'UX Director',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face&q=80',
  },
];

export default function Team() {
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
            Our Team
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter"
          >
            Meet the
            <br />
            <span className="text-gradient">Visionaries</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff4d4d]/10 to-[#00d4ff]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              
              <div className="relative rounded-3xl overflow-hidden bg-[#111111] border border-[#222222] group-hover:border-[#ff4d4d]/30 transition-all duration-500">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-gradient transition-all duration-300">
                    {member.name}
                  </h3>
                  <p className="text-[#888888] text-sm">{member.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
