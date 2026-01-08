'use client';

import { motion } from 'framer-motion';
import MagneticButton from '../ui/MagneticButton';

const footerLinks = {
  navigation: [
    { label: 'Home', href: '#' },
    { label: 'Work', href: '#' },
    { label: 'About', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  services: [
    { label: 'Web Design', href: '#' },
    { label: 'Development', href: '#' },
    { label: 'Branding', href: '#' },
    { label: 'Motion', href: '#' },
  ],
  social: [
    { label: 'Twitter', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'Dribbble', href: '#' },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0a0a0a] border-t border-[#222222]">
      <div className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <span className="text-2xl font-bold tracking-tighter">
                STUDIO<span className="text-[#ff4d4d]">.</span>
              </span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[#888888] text-sm leading-relaxed mb-6"
            >
              We craft digital experiences that transcend the ordinary.
              Every project is an opportunity to create something extraordinary.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <MagneticButton variant="outline" className="text-xs">
                Let's Talk
              </MagneticButton>
            </motion.div>
          </div>

          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <h4 className="text-sm uppercase tracking-[0.2em] text-[#888888] mb-6">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-white hover:text-[#ff4d4d] transition-colors duration-300 text-sm group flex items-center gap-2"
                      data-cursor-hover
                    >
                      <span className="w-0 h-[1px] bg-[#ff4d4d] group-hover:w-4 transition-all duration-300" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-[#222222] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[#888888] text-xs"
            >
              © {currentYear} Studio. All rights reserved.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-6"
            >
              <a
                href="#"
                className="text-[#888888] hover:text-white transition-colors duration-300 text-xs"
                data-cursor-hover
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-[#888888] hover:text-white transition-colors duration-300 text-xs"
                data-cursor-hover
              >
                Terms of Service
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-xs text-[#888888]"
            >
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              Available for new projects
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #ff4d4d 50%, transparent 100%)',
        }}
        animate={{
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </footer>
  );
}
