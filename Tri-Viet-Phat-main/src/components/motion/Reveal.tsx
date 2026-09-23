import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion, Variants } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Vertical travel in px before the element settles. */
  y?: number;
  as?: 'div' | 'section' | 'li' | 'span';
}

/** Fades and lifts its children into place the first time they scroll into view. */
export const Reveal: React.FC<RevealProps> = ({ children, className, delay = 0, y = 28, as = 'div' }) => {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
};

const groupVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

interface RevealGroupProps {
  children: React.ReactNode;
  className?: string;
  /** Change this to replay the stagger (e.g. when a filter changes the items). */
  replayKey?: string;
}

/** Container whose direct <RevealItem> children appear one after another. */
export const RevealGroup: React.FC<RevealGroupProps> = ({ children, className, replayKey }) => (
  <motion.div
    key={replayKey}
    className={className}
    variants={groupVariants}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.1 }}
  >
    {children}
  </motion.div>
);

export const RevealItem: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <motion.div className={className} variants={itemVariants}>
    {children}
  </motion.div>
);

/**
 * Image that is uncovered by a left-to-right wipe when it scrolls into view.
 * Visibility is tracked on an unclipped outer wrapper: Chromium's
 * IntersectionObserver honours the target's own clip-path, so a fully clipped
 * element would never count as "in view" and the wipe would never start.
 */
export const WipeImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement> & { wrapperClassName?: string }> = ({
  wrapperClassName,
  className,
  ...img
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <div ref={ref} className={wrapperClassName}>
      <motion.div
        className="overflow-hidden"
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={inView ? { clipPath: 'inset(0 0% 0 0)' } : undefined}
        transition={{ duration: 1.1, ease: EASE }}
      >
        <motion.img
          {...(img as React.ComponentProps<typeof motion.img>)}
          className={className}
          initial={{ scale: 1.15 }}
          animate={inView ? { scale: 1 } : undefined}
          transition={{ duration: 1.6, ease: EASE }}
        />
      </motion.div>
    </div>
  );
};

/**
 * Counts the leading number of `value` up from 0 when it enters the viewport,
 * keeping any suffix ("16+" → 0…16 then "+", "100%" → 0…100 then "%").
 * Values without a leading number (e.g. "2–4 giờ") render as-is.
 */
export const CountUp: React.FC<{ value: string; className?: string }> = ({ value, className }) => {
  const match = value.match(/^(\d+)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const hasNumber = match !== null;
  const target = hasNumber ? parseInt(match[1], 10) : 0;
  const suffix = hasNumber ? match[2] : '';
  const [current, setCurrent] = useState(hasNumber && !reduce ? 0 : target);

  useEffect(() => {
    if (!hasNumber || !inView || reduce) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (v) => setCurrent(Math.round(v)),
    });
    return () => controls.stop();
  }, [hasNumber, inView, reduce, target]);

  return (
    <span ref={ref} className={className}>
      {hasNumber ? `${current}${suffix}` : value}
    </span>
  );
};
