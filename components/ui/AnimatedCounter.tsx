'use client';

/**
 * components/ui/AnimatedCounter.tsx
 *
 * Counts up from 0 to a target value when scrolled into view.
 * Uses Framer Motion's useInView + useMotionValue + useTransform.
 *
 * Usage:
 *   <AnimatedCounter value={10000} suffix="+" label="Roofs Installed" />
 *   <AnimatedCounter value={98} suffix="%" label="Client Satisfaction" duration={2} />
 */

'use client';

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
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [displayValue, setDisplayValue] = useState(0);

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 60,
    damping: 15,
    duration,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.floor(latest));
    });
    return unsubscribe;
  }, [springValue]);

  return (
    <div ref={ref} className={cn('flex flex-col items-center text-center', className)}>
      <span
        className={cn(
          'font-headline-lg text-headline-lg-mobile md:text-headline-lg font-extrabold text-on-surface',
          valueClassName
        )}
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

