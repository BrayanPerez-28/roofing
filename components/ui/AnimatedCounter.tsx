'use client';

/**
 * components/ui/AnimatedCounter.tsx
 *
 * Progressive Enhancement counter:
 *  - SSR / no-JS: renders the final value immediately (no "0" flash)
 *  - JS hydrated: counts up from 0 when scrolled into view
 *
 * Usage:
 *   <AnimatedCounter value={800} suffix="+" label="Projects Completed" />
 *   <AnimatedCounter value={95}  suffix=".5%" label="Customer Satisfaction" />
 */

import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
  className?: string;
  valueClassName?: string;
  labelClassName?: string;
}

export default function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  label,
  duration = 2,
  className,
  valueClassName,
  labelClassName,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);

  /**
   * hasMounted: false on first render (SSR + hydration).
   * We show the final value until JS is ready, then animate.
   * This prevents:
   *  1. "0" flash on raw HTML / slow connection
   *  2. React hydration mismatch (server vs client initial state)
   */
  const [hasMounted, setHasMounted] = useState(false);
  const [displayValue, setDisplayValue] = useState(value); // ← final value for SSR

  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 60,
    damping: 15,
    duration,
  });

  // Mark as mounted after first client render
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Once mounted + in view → start animation from 0
  useEffect(() => {
    if (hasMounted && isInView) {
      setDisplayValue(0);       // reset display to 0 right before animation
      motionValue.set(0);
      // Small tick to ensure React paints the 0 before springing
      const id = requestAnimationFrame(() => motionValue.set(value));
      return () => cancelAnimationFrame(id);
    }
  }, [hasMounted, isInView, motionValue, value]);

  // Subscribe to spring updates (only after mount)
  useEffect(() => {
    if (!hasMounted) return;
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.floor(latest));
    });
    return unsubscribe;
  }, [hasMounted, springValue]);

  return (
    <div ref={ref} className={cn('flex flex-col items-center text-center', className)}>
      <span
        className={cn(
          'font-headline-lg text-headline-lg-mobile md:text-headline-lg font-extrabold text-on-surface',
          valueClassName
        )}
        aria-label={`${prefix}${value}${suffix}`}
        aria-live="polite"
      >
        {prefix}
        {displayValue.toLocaleString()}
        {suffix}
      </span>
      <span
        className={cn(
          'font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mt-1',
          labelClassName
        )}
      >
        {label}
      </span>
    </div>
  );
}
