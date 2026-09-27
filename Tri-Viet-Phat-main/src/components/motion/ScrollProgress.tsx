import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

/** Thin blue→red bar along the top edge that fills as the page is scrolled. */
export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-linear-to-r from-[#0a94dc] via-[#5cc4ff] to-[#e11d2a] shadow-[0_0_10px_rgba(10,148,220,0.7)] pointer-events-none"
    />
  );
};
