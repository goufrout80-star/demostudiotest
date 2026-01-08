'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState('');

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.closest('a, button, [data-cursor-hover]')) {
        setIsHovering(true);
      }
      
      const cursorTextAttr = target.closest('[data-cursor-text]')?.getAttribute('data-cursor-text');
      if (cursorTextAttr) {
        setCursorText(cursorTextAttr);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.closest('a, button, [data-cursor-hover]')) {
        setIsHovering(false);
      }
      
      if (target.closest('[data-cursor-text]')) {
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          className="relative flex items-center justify-center rounded-full bg-white"
          animate={{
            width: isHovering ? 80 : isClicking ? 12 : 20,
            height: isHovering ? 80 : isClicking ? 12 : 20,
            x: isHovering ? -40 : isClicking ? -6 : -10,
            y: isHovering ? -40 : isClicking ? -6 : -10,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          {cursorText && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-black text-xs font-medium uppercase tracking-wider"
            >
              {cursorText}
            </motion.span>
          )}
        </motion.div>
      </motion.div>
      
      <motion.div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-1 h-1 rounded-full bg-[#ff4d4d] pointer-events-none z-[10001]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </>
  );
}
