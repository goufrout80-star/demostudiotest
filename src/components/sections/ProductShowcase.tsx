'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const projects = [
  {
    id: 1,
    title: 'Ethereal',
    category: 'Brand Identity',
    year: '2024',
    color: '#ff4d4d',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&h=1000&fit=crop&q=80',
    description: 'Abstract fluid art with vibrant red gradients',
  },
  {
    id: 2,
    title: 'Quantum',
    category: 'Web Experience',
    year: '2024',
    color: '#00d4ff',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1600&h=1000&fit=crop&q=80',
    description: 'Futuristic digital interface with cyan glow',
  },
  {
    id: 3,
    title: 'Nebula',
    category: 'Digital Product',
    year: '2023',
    color: '#8b5cf6',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1600&h=1000&fit=crop&q=80',
    description: 'Cosmic purple gradient abstract design',
  },
  {
    id: 4,
    title: 'Horizon',
    category: 'Interactive Design',
    year: '2023',
    color: '#10b981',
    image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1600&h=1000&fit=crop&q=80',
    description: 'Geometric shapes with emerald tones',
  },
];

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={cardRef}
      style={{ y, scale, opacity }}
      className="sticky top-20 h-[80vh] flex items-center justify-center"
    >
      <motion.div
        className="relative w-full max-w-5xl aspect-[16/10] rounded-3xl overflow-hidden group"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.4 }}
        data-cursor-text="View"
        data-cursor-hover
      >
        <Image
          src={project.image}
          alt={project.description}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          priority={index === 0}
        />
        
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${project.color}40 0%, ${project.color}10 100%)`,
          }}
        />
        
        <div className="absolute inset-0 bg-[#0a0a0a]/60" />
        
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${project.color}30 0%, transparent 50%)`,
          }}
        />

        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span
              className="text-xs uppercase tracking-[0.3em] px-4 py-2 rounded-full border"
              style={{ borderColor: project.color, color: project.color }}
            >
              {project.category}
            </span>
            <span className="text-[#888888] text-sm">{project.year}</span>
          </div>

          <div>
            <motion.h3
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              {project.title}
            </motion.h3>
            
            <motion.div
              className="mt-6 flex items-center gap-4"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
            >
              <span
                className="w-12 h-[2px]"
                style={{ background: project.color }}
              />
              <span className="text-sm text-[#888888] group-hover:text-white transition-colors">
                Explore Project
              </span>
              <motion.svg
                className="w-4 h-4 text-[#888888] group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </motion.svg>
            </motion.div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-1 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"
          style={{ background: project.color }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function ProductShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section ref={containerRef} className="relative bg-[#0a0a0a]">
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#222222] z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-[#ff4d4d] to-[#00d4ff]"
          style={{ width: progressWidth }}
        />
      </div>

      <div className="container mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[#ff4d4d] text-sm uppercase tracking-[0.3em] font-medium mb-6"
          >
            Selected Works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter"
          >
            Projects that
            <br />
            <span className="text-gradient">speak volumes</span>
          </motion.h2>
        </div>

        <div className="space-y-[-60vh]">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
