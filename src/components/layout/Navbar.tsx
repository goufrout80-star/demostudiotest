'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import MagneticButton from '../ui/MagneticButton';

const navLinks = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'py-4' : 'py-6'
        }`}
      >
        <div className="container mx-auto px-6">
          <div
            className={`flex items-center justify-between rounded-full px-6 py-3 transition-all duration-500 ${
              isScrolled ? 'glass' : ''
            }`}
          >
            <Link href="/">
              <motion.div
                className="text-xl font-bold tracking-tighter cursor-pointer"
                whileHover={{ scale: 1.05 }}
                data-cursor-hover
              >
                STUDIO<span className="text-[#ff4d4d]">.</span>
              </motion.div>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <Link key={link.label} href={link.href}>
                  <motion.div
                    className="text-sm text-[#888888] hover:text-white transition-colors duration-300 relative group cursor-pointer"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    data-cursor-hover
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#ff4d4d] group-hover:w-full transition-all duration-300" />
                  </motion.div>
                </Link>
              ))}
            </nav>

            <div className="hidden md:block">
              <MagneticButton variant="primary" className="text-xs px-6 py-3">
                Start Project
              </MagneticButton>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center"
              data-cursor-hover
            >
              <div className="space-y-2">
                <span className="block w-6 h-[2px] bg-white" />
                <span className="block w-4 h-[2px] bg-white ml-auto" />
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0a0a0a]"
          >
            <div className="container mx-auto px-6 py-6">
              <div className="flex items-center justify-between mb-16">
                <span className="text-xl font-bold tracking-tighter">
                  STUDIO<span className="text-[#ff4d4d]">.</span>
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center"
                  data-cursor-hover
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <nav className="space-y-6">
                {navLinks.map((link, index) => (
                  <Link key={link.label} href={link.href}>
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-4xl md:text-6xl font-bold tracking-tighter hover:text-[#ff4d4d] transition-colors cursor-pointer"
                      data-cursor-hover
                    >
                      {link.label}
                    </motion.div>
                  </Link>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-16"
              >
                <MagneticButton variant="primary" className="w-full justify-center">
                  Start Project
                </MagneticButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-16 pt-8 border-t border-[#222222]"
              >
                <div className="flex gap-6">
                  {['Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="text-sm text-[#888888] hover:text-white transition-colors"
                      data-cursor-hover
                    >
                      {social}
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
