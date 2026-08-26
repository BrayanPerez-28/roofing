/**
 * app/page.tsx — Home Page
 *
 * SEO: Title "Perez Premium Roofing | Bay Area CA | CSLB #1135746"
 * Sections:
 *   1. HeroSection    — Video + WebGL shader + Three.js + hero text
 *   2. StatsRow       — Animated counters (real company stats)
 *   3. Featured Projects Carousel
 *   4. Services Grid  — All service cards with links
 *   5. Why Choose Us  — 6 key value props
 *   6. Testimonials   — Auto-playing review slider
 *   7. Coverage Area  — Bay Area city badges
 *   8. CTA Banner     — Get estimate / call
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import HeroSection from '@/components/home/HeroSection';
import BentoGrid from '@/components/home/BentoGrid';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import Button from '@/components/ui/Button';
import LeafletMapClient from '@/components/maps/LeafletMapClient';

import ProjectCarousel from '@/components/home/ProjectCarousel';
import TestimonialSlider from '@/components/home/TestimonialSlider';
import {
  HOME_STATS,
  SERVICE_LINKS,
  WHY_CHOOSE_US,
  COVERAGE_CITIES,
  COVERAGE_TEXT,
  CONTACT_INFO,
} from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Perez Premium Roofing INC | Bay Area CA | CSLB #1135746',
  description:
    'Licensed Bay Area roofing contractor with 20+ years of experience. Composition shingles, concrete tile, metal roofs, flat roof PVC/TPO, and repairs. Free estimates — CSLB #1135746.',
};

export default function HomePage() {
  return (
    <>
      {/* ── 1. Hero ── */}
      <HeroSection />



      {/* ── 2. Stats Row ── */}
      <section
        className="section-padding max-w-container-max mx-auto border-t border-outline-variant/30"
        aria-label="Company statistics"
      >
        <div className="text-center mb-10">
          <span className="font-label-md text-label-md text-primary uppercase tracking-widest block mb-3">
            By the Numbers
          </span>
          <h2 className="font-headline-md text-on-surface font-bold">
            Two Decades of Bay Area Roofing Excellence
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {HOME_STATS.map((stat) => (
            <AnimatedCounter
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>
      </section>

      {/* ── 3. Featured Projects Carousel ── */}
      <section className="section-padding max-w-container-max mx-auto" aria-labelledby="projects-heading">
        <div className="text-center mb-8">
          <span className="font-label-md text-label-md text-primary uppercase tracking-widest block mb-3">
            Recent Work
          </span>
          <h2
            id="projects-heading"
            className="font-headline-lg-mobile md:text-headline-lg text-on-surface font-extrabold"
          >
            Featured <span className="text-gradient">Projects</span>
          </h2>
        </div>
        <ProjectCarousel />
      </section>

      {/* ── 4. Bento Grid ── */}
      <BentoGrid />

      {/* ── 5. Services Grid ── */}
      <section className="section-padding max-w-container-max mx-auto" aria-labelledby="services-preview-heading">
        <div className="text-center mb-12">
          <span className="font-label-md text-label-md text-primary uppercase tracking-widest block mb-3">
            Full Service Portfolio
          </span>
          <h2
            id="services-preview-heading"
            className="font-headline-lg-mobile md:text-headline-lg text-on-surface font-extrabold mb-4"
          >
            Residential &amp; Commercial
            <br />
            <span className="text-gradient">Roofing Systems</span>
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            From composition shingles to standing seam metal roofs — we engineer every system
            for maximum performance and long-term protection across the Bay Area.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {SERVICE_LINKS.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="glass-card rounded-xl p-6 flex flex-col gap-3 glow-hover group transition-all duration-300 border border-white/5 hover:border-primary/30"
            >
              <span
                className="material-symbols-outlined material-symbols-filled text-3xl text-primary"
                aria-hidden="true"
              >
                {service.icon}
              </span>
              <span className="font-button text-on-surface group-hover:text-primary transition-colors duration-200">
                {service.label}
              </span>
              <span className="text-xs text-on-surface-variant flex items-center gap-1 mt-auto">
                Learn more
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button variant="primary" href="/services" size="lg">
            View All Services
          </Button>
        </div>
      </section>

      {/* ── 6. Why Choose Us ── */}
      <section className="section-padding max-w-container-max mx-auto" aria-labelledby="why-choose-heading">
        <div className="glass-panel rounded-2xl p-8 md:p-16 border border-white/5">
          <div className="text-center mb-12">
            <span className="font-label-md text-label-md text-primary uppercase tracking-widest block mb-3">
              Why Perez Premium Roofing
            </span>
            <h2
              id="why-choose-heading"
              className="font-headline-lg-mobile md:text-headline-lg text-on-surface font-extrabold mb-4"
            >
              Your Trusted Bay Area
              <br />
              <span className="text-gradient">Roofing Contractor</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_CHOOSE_US.map((item) => (
              <div
                key={item.title}
                className="flex flex-col gap-3 rounded-xl border border-white/5 bg-white/2 p-6 transition-all duration-300 hover:border-primary/20"
              >
                <span
                  className="material-symbols-outlined material-symbols-filled text-3xl text-primary"
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <h3 className="font-body-lg text-on-surface font-semibold">{item.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Testimonials ── */}
      <TestimonialSlider />

      {/* ── 8. Coverage Area ── */}
      <section className="section-padding max-w-container-max mx-auto" aria-labelledby="coverage-heading">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="font-label-md text-label-md text-primary uppercase tracking-widest block mb-3">
            Coverage Area
          </span>
          <h2
            id="coverage-heading"
            className="font-headline-lg-mobile md:font-headline-lg text-on-surface font-bold mb-6"
          >
            Our Service Area
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
            {COVERAGE_TEXT}
          </p>
        </div>

        {/* Map + Cities layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* Map — takes 3 of 5 columns on desktop */}
          <div className="lg:col-span-3 relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl" style={{ height: '480px' }}>
            <LeafletMapClient />
          </div>

          {/* Cities — takes 2 of 5 columns on desktop */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-headline-sm text-on-surface font-semibold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '22px' }} aria-hidden="true">location_on</span>
                Cities We Serve
              </h3>
              <div className="flex flex-wrap gap-2">
                {COVERAGE_CITIES.map((city) => (
                  <span
                    key={city}
                    className="cursor-default rounded-full border border-primary/20 bg-white/3 px-3 py-1.5 text-sm font-medium text-on-surface-variant transition-colors duration-200 hover:border-primary/50 hover:text-primary"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div className="glass-card rounded-xl p-6 flex items-center gap-4">
              <span className="material-symbols-outlined shrink-0 text-primary" style={{ fontSize: '36px' }} aria-hidden="true">
                directions_car
              </span>
              <div>
                <p className="text-on-surface font-bold text-lg">Bay Area Wide</p>
                <p className="text-on-surface-variant text-sm">We come to you — free on-site estimates throughout the region</p>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 flex items-center gap-4">
              <span className="material-symbols-outlined shrink-0 text-primary" style={{ fontSize: '36px' }} aria-hidden="true">
                emergency
              </span>
              <div>
                <p className="text-on-surface font-bold text-lg">24/7 Emergency</p>
                <p className="text-on-surface-variant text-sm">
                  <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-primary transition-colors">
                    {CONTACT_INFO.phone}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── 10. Bottom CTA ── */}
      <section
        className="section-padding max-w-container-max mx-auto"
        aria-labelledby="cta-heading"
      >
        <div className="glass-panel rounded-2xl p-12 md:p-20 text-center border-glass-primary radial-glow-primary">
          <span className="font-label-md text-label-md text-primary uppercase tracking-widest block mb-4">
            Free Estimates — Bay Area
          </span>
          <h2
            id="cta-heading"
            className="font-headline-lg-mobile md:text-headline-lg text-on-surface font-extrabold mb-6"
          >
            Ready to Upgrade Your Roof?
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto mb-4">
            Get a free inspection from our licensed team. No obligation, no pressure.
            Response within 24 hours guaranteed.
          </p>
          <p className="text-sm text-on-surface-variant mb-10 opacity-70">
            Licensed, Bonded &amp; Insured — CSLB #1135746
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Button variant="primary" href="/contact" size="lg" id="bottom-cta-estimate">
              Get a Free Estimate
            </Button>
            <Button variant="secondary" href={CONTACT_INFO.phoneHref} size="lg">
              Call {CONTACT_INFO.phone}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}



  

