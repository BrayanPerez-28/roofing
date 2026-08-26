'use client';

/**
 * components/ui/Button.tsx
 *
 * Reusable button component with 3 variants:
 *  - primary:  gradient fill with neon glow, expands on hover
 *  - primary-dark: navy gradient with electric blue border
 *  - secondary: transparent + silver border → Electric Blue on hover
 *  - glow:     electric blue gradient (for featured CTAs)
 *  - ghost:    icon-only circular transparent button
 *
 * Usage:
 *   <Button variant="primary" onClick={...}>Get a Quote</Button>
 *   <Button variant="secondary" href="/services">Explore Services</Button>
 *   <Button variant="glow" size="lg">Configure Your Roof</Button>
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'primary-dark' | 'secondary' | 'glow' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  id?: string;
}

const variantClasses: Record<Variant, string> = {
  'primary':
    'btn-primary text-on-primary',
  'primary-dark':
    'btn-primary-dark',
  'secondary':
    'btn-secondary',
  'glow':
    'btn-glow',
  'ghost':
    'bg-transparent text-on-surface-variant hover:text-primary hover:bg-white/5 border border-white/10 transition-all duration-300',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded',
  md: 'px-6 py-3 rounded-md',
  lg: 'px-8 py-4 rounded-md',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  className,
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  id,
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 font-button text-button',
    'select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  const content = loading ? (
    <>
      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      {children}
    </>
  ) : (
    children
  );

  if (href) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link href={href} className={classes} id={id}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      id={id}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {content}
    </motion.button>
  );
}

