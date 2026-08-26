'use client';

/**
 * components/ui/GlassCard.tsx
 *
 * Reusable glassmorphism card with gradient border,
 * backdrop blur, hover lift + neon glow effect.
 *
 * Usage:
 *   <GlassCard className="p-8 rounded-xl">...</GlassCard>
 *   <GlassCard noHover className="p-4 rounded-lg">...</GlassCard>
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  /** Disables the hover lift+glow animation */
  noHover?: boolean;
  /** Framer Motion delay for staggered animations */
  delay?: number;
  /** Whether to use Framer Motion wrapper (default true) */
  animate?: boolean;
  onClick?: () => void;
}

const cardVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  }),
};

export default function GlassCard({
  children,
  className,
  noHover = false,
  delay = 0,
  animate = true,
  onClick,
}: GlassCardProps) {
  const classes = cn(
    'relative glass-card rounded-xl',
    !noHover && 'cursor-default',
    className
  );

  if (!animate) {
    return (
      <div className={classes} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={classes}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      custom={delay}
      onClick={onClick}
      whileHover={noHover ? {} : { y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

