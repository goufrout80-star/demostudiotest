'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname}>
        <motion.div
          className="fixed inset-0 bg-[#ff4d4d] z-[9999] origin-bottom"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        <motion.div
          className="fixed inset-0 bg-[#ff4d4d] z-[9999] origin-top"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
        />
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
