'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const services = [
  {
    number: '01',
    title: 'Web Design & Development',
    description: 'Stunning, high-performance websites that convert visitors into customers. Built with cutting-edge technology and pixel-perfect design.',
    features: ['Responsive Design', 'Performance Optimization', 'SEO Best Practices', 'CMS Integration'],
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=600&fit=crop&q=80',
  },
  {
    number: '02',
    title: 'Brand Identity',
    description: 'Comprehensive brand systems that tell your story and resonate with your audience. From logo to guidelines.',
    features: ['Logo Design', 'Brand Guidelines', 'Visual Identity', 'Brand Strategy'],
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop&q=80',
  },
  {
    number: '03',
    title: 'UI/UX Design',
    description: 'User-centered design that combines beauty with functionality. Every interaction is crafted for maximum impact.',
    features: ['User Research', 'Wireframing', 'Prototyping', 'Usability Testing'],
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop&q=80',
  },
  {
    number: '04',
    title: 'Motion Design',
    description: 'Bring your brand to life with captivating animations and motion graphics that engage and inspire.',
    features: ['Animation', 'Video Production', 'Motion Graphics', 'Interactive Media'],
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop&q=80',
  },
];

export default function ServicesList() {
  return (
    <section className="relative py-32 bg-[#0a0a0a]">
      <div className="container mx-auto px-6">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="mb-32 last:mb-0"
          >
            <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden group">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
                </div>
              </div>

              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="text-8xl font-bold text-[#ff4d4d]/10 mb-4">
                  {service.number}
                </div>
                <h3 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-lg text-[#888888] leading-relaxed mb-8">
                  {service.description}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ff4d4d]" />
                      <span className="text-sm text-[#cccccc]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
