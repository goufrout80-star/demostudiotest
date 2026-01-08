'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 z-[10000] bg-[#0a0a0a] flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              className="text-4xl md:text-6xl font-bold tracking-tighter mb-8"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              STUDIO<span className="text-[#ff4d4d]">.</span>
            </motion.div>

            <div className="w-64 h-[2px] bg-[#222222] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#ff4d4d] to-[#00d4ff]"
                initial={{ width: '0%' }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            <motion.p
              className="mt-4 text-sm text-[#888888] font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {Math.min(Math.round(progress), 100)}%
            </motion.p>
          </motion.div>

          <motion.div
            className="absolute bottom-10 text-xs text-[#888888] uppercase tracking-[0.3em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading Experience
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
