'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  type?: 'button' | 'submit' | 'reset';
}

export default function MagneticButton({
  children,
  className,
  onClick,
  strength = 0.3,
  variant = 'primary',
  type = 'button',
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * strength, y: middleY * strength });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const variants = {
    primary: 'bg-[#ff4d4d] text-white hover:bg-[#ff3333]',
    secondary: 'bg-white text-black hover:bg-gray-100',
    outline: 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-black',
    ghost: 'bg-transparent text-white hover:bg-white/10',
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 15, mass: 0.5 }}
      className={clsx(
        'relative px-8 py-4 rounded-full font-medium text-sm uppercase tracking-wider transition-colors duration-300',
        variants[variant],
        className
      )}
      data-cursor-hover
    >
      <motion.span
        className="relative z-10 flex items-center gap-2"
        animate={{ x: position.x * 0.1, y: position.y * 0.1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 15, mass: 0.5 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
}
