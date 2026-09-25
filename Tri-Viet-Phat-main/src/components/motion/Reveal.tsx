import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform, Variants } from 'motion/react';

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
 * Counts from 0 up to `to` when it enters the viewport. `prefix`/`suffix`
 * stay static; the suffix can be styled separately (e.g. an accent "+").
 */
export const CountUp: React.FC<{
  to: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  suffixClassName?: string;
}> = ({ to, prefix = '', suffix = '', className, suffixClassName }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => setCurrent(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {current}
      {suffix && <span className={suffixClassName}>{suffix}</span>}
    </span>
  );
};

/**
 * Heading text whose words rise out of a mask one after another when scrolled
 * into view. Real spaces are kept between words for screen readers and SEO.
 */
export const MaskText: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const words = text.split(' ');
  return (
    <span ref={ref}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <span className="inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]">
            <motion.span
              className="inline-block"
              initial={{ y: '110%' }}
              animate={inView ? { y: 0 } : undefined}
              transition={{ duration: 0.8, ease: EASE, delay: delay + i * 0.05 }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 && ' '}
        </React.Fragment>
      ))}
    </span>
  );
};

/**
 * Full-bleed background photo that drifts slower than the page (parallax).
 * Place inside a `relative overflow-hidden` section.
 */
export const ParallaxImage: React.FC<{ src: string; alt?: string; className?: string; strength?: number }> = ({
  src,
  alt = 'Phòng xét nghiệm y khoa – Trí Việt Phát',
  className = '',
  strength = 14,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${reduce ? 0 : strength}%`, `${reduce ? 0 : strength}%`]);
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ y }}
        className={`absolute inset-x-0 -top-[20%] h-[140%] w-full object-cover ${className}`}
      />
    </div>
  );
};

/** Soft, slowly drifting colour glows for dark sections (decorative). */
export const AmbientGlow: React.FC<{ className?: string; light?: boolean }> = ({ className = '', light = false }) => (
  <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
    <div
      className={`glow-drift absolute -top-1/2 -left-[10%] w-[55%] aspect-square rounded-full blur-[120px] ${
        light ? 'bg-[#0a94dc]/12' : 'bg-[#0a94dc]/35'
      }`}
    />
    <div
      className={`glow-drift-reverse absolute -bottom-1/2 -right-[10%] w-[45%] aspect-square rounded-full blur-[120px] ${
        light ? 'bg-[#e11d2a]/8' : 'bg-[#e11d2a]/20'
      }`}
    />
  </div>
);
