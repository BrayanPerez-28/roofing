'use client';

/**
 * components/ui/SectionHeader.tsx
 *
 * Reusable section header with:
 * - Overline label (Montserrat uppercase, tracking-widest, primary color)
 * - Headline (text-gradient or plain on-surface)
 * - Optional subtext (Inter body-lg)
 * - Framer Motion fade-up on scroll
 *
 * Usage:
 *   <SectionHeader
 *     overline="Our Services"
 *     headline="Built for the Future"
 *     subtext="We engineer roofs that stand for generations."
 *     gradient
 *     centered
 *   />
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  overline?: string;
  headline: string;
  subtext?: string;
  /** Apply text-gradient to the headline */
  gradient?: boolean;
  /** Center-align the entire block */
  centered?: boolean;
  className?: string;
  /** Max width for subtext paragraph */
  subtextMaxWidth?: string;
}

const containerVariants: any = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
};

export default function SectionHeader({
  overline,
  headline,
  subtext,
  gradient = false,
  centered = false,
  className,
  subtextMaxWidth = 'max-w-2xl',
}: SectionHeaderProps) {
  return (
    <motion.div
      className={cn(
        'flex flex-col gap-4 mb-16',
        centered && 'items-center text-center',
        className
      )}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {overline && (
        <motion.div variants={itemVariants}>
          <span className="inline-block px-4 py-1 glass-panel rounded-full border-glass-primary">
            <span className="font-label-md text-label-md text-primary uppercase tracking-widest">
              {overline}
            </span>
          </span>
        </motion.div>
      )}

      <motion.h2
        variants={itemVariants}
        className={cn(
          'font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg',
          gradient ? 'text-gradient' : 'text-on-surface'
        )}
      >
        {headline}
      </motion.h2>

      {subtext && (
        <motion.p
          variants={itemVariants}
          className={cn(
            'font-body-lg text-body-lg text-on-surface-variant',
            centered && 'mx-auto',
            subtextMaxWidth
          )}
        >
          {subtext}
        </motion.p>
      )}
    </motion.div>
  );
}

