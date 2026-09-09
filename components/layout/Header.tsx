'use client';

/**
 * components/layout/Header.tsx
 *
 * Sticky glassmorphism navigation header.
 * - 80px tall, backdrop-blur-xl
 * - Desktop: logo + nav links + "Get a Quote" CTA
 * - Mobile: logo + hamburger → Framer Motion slide-in drawer
 * - Active route highlighted with primary color + bottom border
 * - Services link opens a mega-menu dropdown on hover
 */

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Phone } from 'lucide-react';
import { NAV_LINKS, SERVICE_LINKS, CONTACT_INFO, BRAND } from '@/lib/constants';

const slideIn: any = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'tween', duration: 0.35, ease: 'easeOut' },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { type: 'tween', duration: 0.25, ease: 'easeOut' },
  },
};

const megaMenuVariants: any = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: { duration: 0.15 },
  },
};

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesHover, setServicesHover] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[999] border-b border-white/15"
        style={{
          background: 'rgba(10, 12, 20, 0.88)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.6)',
        }}
      >
        <div className="flex justify-between items-center h-nav-height px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center"
          >
            <span
              className="flex items-center rounded-xl px-3 py-1.5"
              style={{ background: 'rgba(255, 255, 255, 0.80)', backdropFilter: 'blur(8px)' }}
            >
              <Image
                src="/logo.png"
                alt={`${BRAND.name} Logo`}
                width={200}
                height={80}
                className="h-16 w-auto object-contain"
                priority
              />
            </span>
          </Link>

          {/* ── Desktop Navigation ── */}
          <nav className="hidden md:flex gap-1 items-center" aria-label="Primary navigation">
            {NAV_LINKS.map((link) => {
              if (link.label === 'Services') {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setServicesHover(true)}
                    onMouseLeave={() => setServicesHover(false)}
                  >
                    <button className={`nav-blob-btn${isActive(link.href) ? ' blob-active' : ''}`}>
                      <span className="nav-label">{link.label}</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 relative z-[3] ${servicesHover ? 'rotate-180' : ''}`}
                      />
                      <span className="nav-blob-btn__inner">
                        <span className="nav-blob-btn__blobs">
                          <span className="nav-blob-btn__blob" />
                          <span className="nav-blob-btn__blob" />
                          <span className="nav-blob-btn__blob" />
                          <span className="nav-blob-btn__blob" />
                        </span>
                      </span>
                    </button>

                    {/* Mega Menu Dropdown */}
                    <AnimatePresence>
                      {servicesHover && (
                        <motion.div
                          variants={megaMenuVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 rounded-xl p-4 border border-white/15"
                          style={{
                            background: 'rgba(10, 12, 20, 0.95)',
                            backdropFilter: 'blur(24px)',
                            WebkitBackdropFilter: 'blur(24px)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.7), 0 0 15px rgba(183,196,255,0.05)',
                          }}
                        >
                          <div className="mb-3 px-2">
                            <p className="font-label-md text-label-md text-primary uppercase tracking-widest">
                              Our Services
                            </p>
                          </div>
                          <div className="flex flex-col gap-1">
                            {SERVICE_LINKS.map((service) => (
                              <Link
                                key={service.href}
                                href={service.href}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all duration-200 group"
                              >
                                <span
                                  className="material-symbols-outlined material-symbols-filled text-primary text-xl"
                                  aria-hidden="true"
                                >
                                  {service.icon}
                                </span>
                                <span className="font-button text-sm">{service.label}</span>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-blob-btn${isActive(link.href) ? ' blob-active' : ''}`}
                >
                  <span className="nav-label">{link.label}</span>
                  <span className="nav-blob-btn__inner">
                    <span className="nav-blob-btn__blobs">
                      <span className="nav-blob-btn__blob" />
                      <span className="nav-blob-btn__blob" />
                      <span className="nav-blob-btn__blob" />
                      <span className="nav-blob-btn__blob" />
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* ── Desktop Actions ── */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={CONTACT_INFO.phoneHref}
              className="flex flex-col items-start font-button text-label-md text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="flex items-center gap-2">
                <Phone size={14} />
                {CONTACT_INFO.phone}
              </span>
              <span className="text-xs text-outline pl-5">Main – Office</span>
            </a>
            <Link
              href="/contact"
              className="btn-primary-dark font-button text-button px-5 py-2.5 rounded-md"
            >
              Get a Quote
            </Link>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            className="md:hidden text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-white/5"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            id="mobile-menu-button"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Spacer to prevent content jumping under fixed header */}
      <div className="h-nav-height" aria-hidden="true" />

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer Panel */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-50 w-80 glass-panel border-l border-white/10 flex flex-col"
              variants={slideIn}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Drawer Header */}
              <div className="flex justify-between items-center h-nav-height px-6 border-b border-white/10">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center"
                >
                  <span
                    className="flex items-center rounded-xl px-3 py-1.5"
                    style={{ background: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(8px)' }}
                  >
                    <Image
                      src="/logo.png"
                      alt={`${BRAND.name} Logo`}
                      width={150}
                      height={60}
                      className="h-12 w-auto object-contain"
                      priority
                    />
                  </span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-white/5"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto" aria-label="Mobile navigation">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`font-button text-button px-4 py-3 rounded-lg transition-all duration-200 ${isActive(link.href)
                      ? 'text-primary bg-white/5'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile service sub-links */}
                <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-white/10 pl-4">
                  {SERVICE_LINKS.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 font-button text-sm text-on-surface-variant hover:text-primary transition-colors py-2"
                    >
                      <span className="material-symbols-outlined material-symbols-filled text-base text-primary">
                        {service.icon}
                      </span>
                      {service.label}
                    </Link>
                  ))}
                </div>
              </nav>

              {/* Drawer Footer CTA */}
              <div className="p-4 border-t border-white/10 flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <div>
                      <a
                        href={CONTACT_INFO.phoneHref}
                        className="flex items-center justify-center gap-2 btn-secondary font-button text-button px-6 py-3 rounded-md"
                      >
                        <Phone size={16} />
                        {CONTACT_INFO.phone}
                      </a>
                      <p className="text-xs text-center text-outline mt-0.5">Main – Office</p>
                    </div>
                    <div>
                      <a
                        href={CONTACT_INFO.phoneEmergencyHref}
                        className="flex items-center justify-center gap-2 btn-secondary font-button text-button px-6 py-3 rounded-md border-error/40 text-error hover:text-error"
                      >
                        <Phone size={16} />
                        {CONTACT_INFO.phoneEmergency}
                      </a>
                      <p className="text-xs text-center text-outline mt-0.5">Roofing Emergencies</p>
                    </div>
                  </div>
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary-dark font-button text-button px-6 py-3 rounded-md text-center"
                >
                  Get a Free Quote
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Hidden SVG Goo Filter for blob nav animation */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
        aria-hidden="true"
      >
        <defs>
          <filter id="nav-goo">
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"
              result="goo"
            />
            <feBlend in2="goo" in="SourceGraphic" result="mix" />
          </filter>
        </defs>
      </svg>
    </>
  );
}

