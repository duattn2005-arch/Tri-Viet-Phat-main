import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'motion/react';

interface TiltProps {
  children: React.ReactNode;
  className?: string;
  /** Maximum tilt in degrees on each axis. */
  max?: number;
}

/**
 * Tilts its content in 3D toward the pointer and shows a soft glare that
 * follows it. Mouse only (touch and reduced-motion users get a plain box).
 */
export const Tilt: React.FC<TiltProps> = ({ children, className = '', max = 7 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const spring = { stiffness: 220, damping: 20 };
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useSpring(0, spring);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.45), transparent 55%)`;

  if (reduce) return <div className={`relative ${className}`}>{children}</div>;

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rotateY.set((px - 0.5) * max * 2);
    rotateX.set(-(py - 0.5) * max * 2);
    glareX.set(px * 100);
    glareY.set(py * 100);
    glareOpacity.set(1);
  };

  const onPointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glareOpacity.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 mix-blend-soft-light"
        style={{ background: glare, opacity: glareOpacity }}
        aria-hidden="true"
      />
    </motion.div>
  );
};
