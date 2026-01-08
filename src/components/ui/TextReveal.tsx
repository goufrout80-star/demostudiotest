'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  splitBy?: 'words' | 'chars' | 'lines';
}

export default function TextReveal({
  children,
  className = '',
  delay = 0,
  splitBy = 'words',
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const splitText = () => {
    if (splitBy === 'chars') {
      return children.split('').map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={{
            hidden: { y: '100%', opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.02,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ));
    }

    if (splitBy === 'lines') {
      return children.split('\n').map((line, i) => (
        <motion.span
          key={i}
          className="block overflow-hidden"
          variants={{
            hidden: { y: '100%', opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
          transition={{
            duration: 0.8,
            delay: delay + i * 0.1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {line}
        </motion.span>
      ));
    }

    return children.split(' ').map((word, i) => (
      <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
        <motion.span
          className="inline-block"
          variants={{
            hidden: { y: '100%', opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.05,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {word}
        </motion.span>
      </span>
    ));
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
    >
      {splitText()}
    </motion.div>
  );
}
