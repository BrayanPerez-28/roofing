'use client';

/**
 * app/services/ServiceDetailPage.tsx
 *
 * Shared template for all service sub-pages.
 * Enhanced with:
 * - Video hero banner (service-specific)
 * - Auto-playing image carousel of real project photos
 * - Benefit cards from real service data
 * - Scroll-triggered entrance animations
 */

import { motion } from 'framer-motion';
import Image from 'next/image';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import Button from '@/components/ui/Button';
import SectionHeader from '@/components/ui/SectionHeader';
import MediaCarousel from '@/components/ui/MediaCarousel';
import VideoBackground from '@/components/ui/VideoBackground';
import { VIDEOS, SERVICE_IMAGES } from '@/lib/mediaAssets';
import ReviewsSection from '@/components/reviews/ReviewsSection';
import type { SERVICES_DATA } from '@/lib/constants';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

interface BenefitItem {
  title: string;
  desc: string;
}

interface ServiceDetailPageProps {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  slug: string;
  stats: StatItem[];
  badge?: string;
  benefits?: BenefitItem[];
  videoSrc?: string;
}

// Map service slug to a video
const SERVICE_VIDEOS: Record<string, string> = {
  'flat-roof':            VIDEOS.services,
  'concrete-tile':        VIDEOS.services,
  'composition-shingles': VIDEOS.hero,
  'metal-roofs':          VIDEOS.hero,
  'wood-shingles':        VIDEOS.hero,
  'gutters':              VIDEOS.maintenance,
  'roof-repairs':         VIDEOS.maintenance,
};

export default function ServiceDetailPage({
  title,
  subtitle,
  description,
  icon,
  slug,
  stats,
  badge,
  benefits,
  videoSrc,
}: ServiceDetailPageProps) {
  const carouselImages = (SERVICE_IMAGES[slug] || []).map((src) => ({
    src,
    alt: `${title} project photo`,
  }));

  const heroVideo = videoSrc || SERVICE_VIDEOS[slug] || VIDEOS.hero;
  const fallbackImage = carouselImages[0]?.src;

  return (
    <>
      {/* ── Video Hero ── */}
      <VideoBackground
        src={heroVideo}
        fallbackImage={fallbackImage}
        overlayOpacity={0.55}
        className="min-h-[55vh] flex items-center"
        aria-label={`${title} hero section`}
      >
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20 w-full">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 font-label-md text-label-md text-white/60 text-xs uppercase tracking-widest mb-8"
            aria-label="Breadcrumb"
          >
            <a href="/services" className="hover:text-white transition-colors">Services</a>
            <span>/</span>
            <span className="text-white">{title}</span>
          </nav>

          {badge && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                <span className="font-label-md text-label-md text-white/90 uppercase tracking-widest">{badge}</span>
              </span>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                <span
                  className="material-symbols-outlined material-symbols-filled text-white"
                  style={{ fontSize: '48px' }}
                  aria-hidden="true"
                >
                  {icon}
                </span>
              </div>
              <div>
                <p className="font-label-md text-label-md text-primary uppercase tracking-widest">{subtitle}</p>
                <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-lg text-white font-extrabold mt-1">
                  {title}
                </h1>
              </div>
            </div>

            <p className="font-body-lg text-body-lg text-white/80 max-w-2xl mb-10">
              {description}
            </p>

            <div className="flex gap-4 flex-wrap">
              <Button variant="primary" href="/contact" size="lg" id={`${slug}-cta`}>
                Get a Free Estimate
              </Button>
              <Button variant="secondary" href="/services" size="lg">
                All Services
              </Button>
            </div>
          </motion.div>
        </div>
      </VideoBackground>

      {/* ── Image Carousel ── */}
      {carouselImages.length > 0 && (
        <section className="section-padding max-w-container-max mx-auto" aria-label={`${title} project photos`}>
          <div className="text-center mb-8">
            <span className="font-label-md text-label-md text-primary uppercase tracking-widest block mb-3">
              Our Work
            </span>
            <h2 className="font-headline-md text-on-surface font-bold">
              {title} Projects
            </h2>
          </div>
          <MediaCarousel
            slides={carouselImages}
            aspectRatio="16/7"
            autoplayInterval={4500}
            transition="slide"
            rounded
          />
        </section>
      )}

      {/* ── Stats ── */}
      <section className="section-padding max-w-container-max mx-auto border-t border-outline-variant/30" aria-label="Service statistics">
        <div className="grid grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="glass-card p-8 rounded-xl text-center"
            >
              <AnimatedCounter value={stat.value} suffix={stat.suffix} label={stat.label} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Benefits ── */}
      {benefits && benefits.length > 0 && (
        <section className="section-padding max-w-container-max mx-auto" aria-labelledby="benefits-heading">
          <SectionHeader
            overline="Why This System"
            headline="Key Benefits"
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                className="glass-card p-6 rounded-xl flex flex-col gap-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">{benefit.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── Features ── */}
      <section className="section-padding max-w-container-max mx-auto" aria-labelledby="features-heading">
        <SectionHeader
          overline="Our Standards"
          headline="Built for Performance"
          centered
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {[
            { icon: 'verified',          title: 'Licensed & Insured',   desc: 'All work performed under CSLB License #1135746, with full liability and workers\' comp coverage.' },
            { icon: 'support_agent',     title: 'Expert Installation',  desc: 'Our experienced crews deliver every installation with precision and care for your property.' },
            { icon: 'eco',               title: 'Premium Materials',    desc: 'We use only high-quality materials that meet California building codes and manufacturer specs.' },
            { icon: 'workspace_premium', title: 'Workmanship Warranty', desc: 'We stand behind our work. Every installation is backed by our craftsman\' warranty.' },
          ].map((feat, i) => (
            <motion.div
              key={feat.title}
              className="glass-card p-6 rounded-xl flex items-start gap-4"
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="bg-primary-container/20 p-3 rounded-lg shrink-0">
                <span className="material-symbols-outlined material-symbols-filled text-primary" style={{ fontSize: '28px' }} aria-hidden="true">{feat.icon}</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{feat.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Reviews ── */}
      <ReviewsSection />

      {/* ── Bottom CTA ── */}
      <section className="section-padding max-w-container-max mx-auto">
        <div className="glass-panel rounded-2xl p-10 md:p-16 text-center border-glass-primary">
          <h2 className="font-headline-lg-mobile md:text-headline-lg text-on-surface font-extrabold mb-4">
            Start Your <span className="text-gradient">{title}</span> Project
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto mb-8">
            Contact us for a free, no-obligation estimate. Licensed, Bonded &amp; Insured — CSLB #1135746.
          </p>
          <Button variant="primary" href="/contact" size="lg">
            Get a Free Estimate
          </Button>
        </div>
      </section>
    </>
  );
}
