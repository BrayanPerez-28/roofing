'use client';

/**
 * app/services/ServicesClient.tsx — Services Overview (Client Component)
 *
 * Migrated from our_services/code.html.
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import ReviewsSection from '@/components/reviews/ReviewsSection';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';
import { SERVICE_LINKS } from '@/lib/constants';
import { Calendar } from 'lucide-react';

const categories = [
  {
    title: 'Residential Systems',
    description:
      'Elevating private estates with precision-engineered materials and advanced weather-proofing technology.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcjYRUTIKcAxvKgQzT13jlm5rCKkHgIh-w8tZztDW4RnsWsGmzI5QTbkaPFLVCeo5ZXnv4dKt4YK5jwxkz1HPZuk9F0piYlrq6wQknK-A-PcVbkOFHjmoFPIl5O_AkE1Bu9-brpB0dKbQ67RHd12F_hworSbNBCGrqN8eH4pHHDcGpbW_vXn3e9-GdwKV9K5snXdMvYbd_Y7YjKewMumG5ua5E_kn3w-gAh_x5J78nH7QxTMXxwWA3QA',
    href: '/services',
  },
  {
    title: 'Commercial Infrastructure',
    description:
      'Scalable, hyper-durable roofing solutions designed for enterprise facilities and high-load architectural structures.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDy51xMYEHoJSdEgqa-wqIrqrxUEZoimY2wAIDWlx9poZEPGcn92ZwkzXm5DK2TMEYIH1RfBDNrhyVyzDFdrfVj7SObd0aBQHSs1mgHrag2jmOEx-gy9E-wzFXG8k0nK1SmvX6jjCU0hS82us66po2Igm_7ddS5Hnpz3pY-tms5C4yDCcGVQI_viHhQaaRbtaYuuMWStG_nKKjo7zJiRxdD-xVlfCETKl5oF0DoJ37QIAwFOl3P4Od1Mw',
    href: '/services',
  },
];

const detailServices = [
  {
    icon: 'build',
    title: 'Precision Repair',
    description: 'Targeted diagnostics and structural restoration using aerospace-grade sealants and materials.',
    delay: 0,
  },
  {
    icon: 'engineering',
    title: 'Full Replacement',
    description: 'Complete structural overhaul deploying next-generation membranes and high-efficiency thermal barriers.',
    delay: 0.1,
  },
  {
    icon: 'analytics',
    title: 'Proactive Maintenance',
    description: 'Data-driven inspection regimes utilizing drone telemetry and thermal imaging to preempt structural failure.',
    delay: 0.2,
  },
];

const timelinePhases = [
  { phase: '01', title: 'Assessment', description: 'Structural Assessment & Telemetry Gathering' },
  { phase: '02', title: 'Blueprint',  description: 'Engineering Blueprint & Material Selection' },
  { phase: '03', title: 'Deployment', description: 'Precision Installation & Quality Control' },
  { phase: '04', title: 'Handover',   description: 'Final Inspection, Warranty & Ongoing Support' },
];

export default function ServicesClient() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="section-padding max-w-container-max mx-auto text-center relative overflow-hidden">
        <div className="absolute inset-0 radial-glow-primary -z-10 pointer-events-none" aria-hidden="true" />
        <SectionHeader
          overline="Full Service Portfolio"
          headline="Architectural Precision Services"
          subtext="Next-generation roofing solutions engineered for durability, aesthetic supremacy, and technological integration."
          gradient
          centered
        />
      </section>

      {/* ── Service Links Grid ── */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pb-section-gap-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {SERVICE_LINKS.map((service, i) => (
            <motion.div
              key={service.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <Link
                href={service.href}
                className="glass-card rounded-xl p-6 flex flex-col items-start gap-3 group hover:!transform-none"
              >
                <span
                  className="material-symbols-outlined material-symbols-filled text-primary"
                  style={{ fontSize: '32px' }}
                  aria-hidden="true"
                >
                  {service.icon}
                </span>
                <span className="font-button text-button text-on-surface group-hover:text-primary transition-colors">
                  {service.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Category Image Cards ── */}
      <section className="section-padding max-w-container-max mx-auto" aria-labelledby="categories-heading">
        <SectionHeader
          overline="Our Expertise"
          headline="Built for Every Scale"
          subtext="From single-family homes to industrial complexes — every project receives the same uncompromising precision."
          centered
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              className="relative h-[480px] rounded-xl overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${cat.image}')` }}
                aria-hidden="true"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-surface-dim/95 via-surface-dim/40 to-transparent" />

              {/* Content card at bottom */}
              <div className="absolute bottom-0 left-0 p-8 glass-panel m-4 rounded-lg w-[calc(100%-2rem)]">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-2">{cat.title}</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">{cat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Detail Service Cards ── */}
      <section className="section-padding max-w-container-max mx-auto" aria-labelledby="detail-heading">
        <SectionHeader
          overline="What We Do"
          headline="Our Core Services"
          centered
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {detailServices.map((svc) => (
            <motion.div
              key={svc.title}
              className="glass-panel p-8 rounded-xl glow-hover flex flex-col items-start cursor-pointer group transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: svc.delay }}
            >
              <div className="bg-surface-container-high p-4 rounded-lg mb-6 text-primary group-hover:bg-primary/10 transition-colors">
                <span
                  className="material-symbols-outlined material-symbols-filled"
                  style={{ fontSize: '36px' }}
                  aria-hidden="true"
                >
                  {svc.icon}
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4">{svc.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">{svc.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Process Timeline ── */}
      <section className="section-padding max-w-container-max mx-auto relative" aria-labelledby="timeline-heading">
        <h2 id="timeline-heading" className="font-headline-lg-mobile md:text-headline-lg text-on-surface text-center mb-16 font-extrabold">
          Execution Protocol
        </h2>
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent transform md:-translate-x-1/2" />

          <div className="flex flex-col gap-12">
            {timelinePhases.map((item, i) => (
              <motion.div
                key={item.phase}
                className={`flex flex-col md:flex-row items-start md:items-center w-full justify-between gap-8 md:gap-0 pl-20 md:pl-0`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
              >
                {/* Left content (odd items) */}
                {i % 2 === 0 ? (
                  <>
                    <div className="md:w-1/2 md:pr-12 md:text-right hidden md:block">
                      <h4 className="font-headline-md text-headline-md text-primary mb-2">Phase {item.phase}</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant">{item.description}</p>
                    </div>
                    {/* Timeline dot */}
                    <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-surface border-2 border-primary z-10"
                      style={{ boxShadow: '0 0 12px rgba(183,196,255,0.5)' }} />
                    <div className="md:w-1/2 md:pl-12 md:hidden">
                      <h4 className="font-headline-md text-headline-md text-primary mb-2">Phase {item.phase}</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant">{item.description}</p>
                    </div>
                    <div className="md:w-1/2 md:pl-12 hidden md:block" />
                  </>
                ) : (
                  <>
                    <div className="md:w-1/2 md:pr-12 hidden md:block" />
                    <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-surface border-2 border-outline-variant z-10" />
                    <div className="md:w-1/2 md:pl-12">
                      <h4 className="font-headline-md text-headline-md text-on-surface mb-2">Phase {item.phase}</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant">{item.description}</p>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <ReviewsSection />

      {/* ── Floating Schedule CTA ── */}
      <div className="fixed bottom-8 right-8 z-40">
        <Button variant="primary" href="/contact" size="lg" id="floating-schedule-cta">
          <Calendar size={18} />
          Schedule Inspection
        </Button>
      </div>
    </>
  );
}

