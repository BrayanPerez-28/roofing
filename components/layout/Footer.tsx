'use client';

/**
 * components/layout/Footer.tsx
 *
 * 4-column footer: Brand/Logo | Services | Company | Legal
 * Design: Surface-Dark gradient, neon divider, "Built with Precision" tagline
 */

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { BRAND, SERVICE_LINKS, CONTACT_INFO } from '@/lib/constants';

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Contact Us', href: '/contact' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Accessibility', href: '/accessibility' },
];

export default function Footer() {
  return (
    <footer
      className="bg-surface-container-lowest border-t border-outline-variant"
      role="contentinfo"
    >
      {/* Neon top divider */}
      <div className="neon-divider" />

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-gutter">

          {/* Column 1: Brand */}
          <div className="flex flex-col gap-4 sm:col-span-2 md:col-span-1">
            <Link
              href="/"
              className="self-start flex items-center"
            >
              <span
                className="flex items-center rounded-xl px-3 py-2"
                style={{ background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(6px)' }}
              >
                <Image
                  src="/logo.png"
                  alt={`${BRAND.name} Logo`}
                  width={240}
                  height={96}
                  className="h-20 w-auto object-contain"
                  priority
                />
              </span>
            </Link>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed max-w-xs">
              Engineering structural integrity with high-end aesthetics since {BRAND.established}.
            </p>

            {/* Contact quick-links */}
            <div className="flex flex-col gap-2 mt-2">
              <a
                href={CONTACT_INFO.phoneHref}
                className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md"
              >
                <Phone size={14} className="text-primary" />
                {CONTACT_INFO.phone}
              </a>
              <a
                href={CONTACT_INFO.emailHref}
                className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md"
              >
                <Mail size={14} className="text-primary" />
                {CONTACT_INFO.email}
              </a>
              <span className="flex items-center gap-2 text-on-surface-variant font-body-md text-body-md">
                <MapPin size={14} className="text-primary" />
                {CONTACT_INFO.address}
              </span>
            </div>

            {/* Social icons */}
            <div className="flex gap-3 mt-2">
              <button
                aria-label="Visit our website"
                className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-white/5 border border-white/10"
              >
                <Globe size={16} />
              </button>
              <button
                aria-label="Email us"
                className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-white/5 border border-white/10"
              >
                <Mail size={16} />
              </button>
              <button
                aria-label="Call us"
                className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-white/5 border border-white/10"
              >
                <Phone size={16} />
              </button>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="flex flex-col gap-3">
            <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-widest mb-1">
              Services
            </h3>
            {SERVICE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body-md text-body-md text-on-surface-variant hover:text-primary-fixed-dim transition-colors focus:underline decoration-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col gap-3">
            <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-widest mb-1">
              Company
            </h3>
            {companyLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body-md text-body-md text-on-surface-variant hover:text-primary-fixed-dim transition-colors focus:underline decoration-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Column 4: Legal */}
          <div className="flex flex-col gap-3">
            <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-widest mb-1">
              Legal
            </h3>
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body-md text-body-md text-on-surface-variant hover:text-primary-fixed-dim transition-colors focus:underline decoration-primary"
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-6 glass-panel rounded-lg p-3 border-glass-primary">
              <p className="font-label-md text-label-md text-primary text-xs uppercase tracking-widest mb-1">
                24/7 Emergency
              </p>
              <a
                href={CONTACT_INFO.phoneHref}
                className="font-headline-md text-sm font-bold text-on-surface hover:text-primary transition-colors"
              >
                {CONTACT_INFO.phone}
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="mt-16 pt-8 neon-divider" />
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-body-md text-body-md text-outline text-sm">
            {BRAND.copyright}
          </p>
          <p className="font-label-md text-label-md text-outline text-xs uppercase tracking-widest">
            Built with Precision
          </p>
        </div>
      </div>
    </footer>
  );
}

