'use client';

/**
 * app/services/ServiceDetailPage.tsx
 *
 * Shared template for all service sub-pages.
 * Enhanced with:
 * - Video hero banner (service-specific)
 * - Responsive masonry mosaic gallery of admin-uploaded photos
 * - Lightbox (fullscreen preview with keyboard nav)
 * - Benefit cards from real service data
 * - Scroll-triggered entrance animations
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import Button from '@/components/ui/Button';
import SectionHeader from '@/components/ui/SectionHeader';
import MediaCarousel from '@/components/ui/MediaCarousel';
import VideoBackground from '@/components/ui/VideoBackground';
import { VIDEOS, SERVICE_IMAGES } from '@/lib/mediaAssets';
import { useServiceMedia } from '@/lib/useApiGallery';
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
  includedServices?: string[];
  videoSrc?: string;
}

// Map service slug to a video
const SERVICE_VIDEOS: Record<string, string> = {
  'flat-roof':            VIDEOS.maintenance,
  'concrete-tile':        VIDEOS.maintenance,
  'composition-shingles': VIDEOS.hero,
  'metal-roofs':          VIDEOS.hero,
  'wood-shingles':        VIDEOS.hero,
  'gutters':              VIDEOS.maintenance,
  'roof-repairs':         VIDEOS.maintenance,
};

// ─── Masonry Mosaic Gallery ────────────────────────────────────────────────────

const INITIAL_VISIBLE = 6;
const LOAD_MORE_STEP  = 6;

function MosaicGallery({ images, title }: { images: string[]; title: string }) {
  const [lightboxIdx,   setLightboxIdx]   = useState<number | null>(null);
  const [visibleCount,  setVisibleCount]  = useState(INITIAL_VISIBLE);

  const visibleImages  = images.slice(0, visibleCount);
  const hasMore        = visibleCount < images.length;
  const isExpanded     = visibleCount > INITIAL_VISIBLE;

  const close = useCallback(() => setLightboxIdx(null), []);
  const prev  = useCallback(() => setLightboxIdx((i) => i !== null ? (i - 1 + images.length) % images.length : null), [images.length]);
  const next  = useCallback(() => setLightboxIdx((i) => i !== null ? (i + 1) % images.length : null), [images.length]);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')       close();
      else if (e.key === 'ArrowLeft')   prev();
      else if (e.key === 'ArrowRight')  next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIdx, close, prev, next]);

  useEffect(() => {
    document.body.style.overflow = lightboxIdx !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIdx]);

  return (
    <>
      {/* ── Masonry grid ── */}
      <div
        style={{ columnGap: '12px' }}
        className="[column-count:1] sm:[column-count:2] lg:[column-count:3]"
      >
        {visibleImages.map((src, idx) => (
          <motion.div
            key={src + idx}
            className="break-inside-avoid mb-3 overflow-hidden rounded-xl cursor-zoom-in group relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: (idx % 6) * 0.06 }}
            onClick={() => setLightboxIdx(idx)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${title} project photo ${idx + 1}`}
              className="w-full h-auto block object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center rounded-xl">
              <span className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-all duration-300 drop-shadow-lg">
                🔍
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Load More / Show Less ── */}
      {images.length > INITIAL_VISIBLE && (
        <div className="flex flex-col items-center gap-3 mt-6">
          <p className="text-sm text-on-surface-variant/60">
            Showing <span className="font-semibold text-on-surface">{visibleImages.length}</span> of{' '}
            <span className="font-semibold text-on-surface">{images.length}</span> photos
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            {hasMore && (
              <button
                onClick={() => setVisibleCount((c) => Math.min(c + LOAD_MORE_STEP, images.length))}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-primary/30 text-primary font-medium text-sm hover:bg-primary/10 transition-all duration-300 hover:border-primary/60"
              >
                <span>Load More Photos</span>
                <span className="text-xs opacity-60">({Math.min(LOAD_MORE_STEP, images.length - visibleCount)} more)</span>
                <span>↓</span>
              </button>
            )}
            {!hasMore && (
              <button
                onClick={() => setVisibleCount((c) => Math.min(c + LOAD_MORE_STEP, images.length))}
                disabled
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-outline-variant/30 text-on-surface-variant/40 font-medium text-sm cursor-default"
              >
                All photos loaded ✓
              </button>
            )}
            {isExpanded && (
              <button
                onClick={() => setVisibleCount(INITIAL_VISIBLE)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-outline-variant/40 text-on-surface-variant font-medium text-sm hover:bg-surface-variant/20 transition-all duration-300"
              >
                Show Less ↑
              </button>
            )}
          </div>
        </div>
      )}


      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            {/* Close */}
            <button
              onClick={close}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white text-xl flex items-center justify-center transition-all z-10"
              aria-label="Close"
            >✕</button>

            {/* Prev */}
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 sm:left-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white text-xl flex items-center justify-center transition-all z-10"
                aria-label="Previous photo"
              >‹</button>
            )}

            {/* Image */}
            <motion.img
              key={lightboxIdx}
              src={images[lightboxIdx]}
              alt={`${title} project photo ${lightboxIdx + 1}`}
              className="max-w-full max-h-[88vh] object-contain rounded-lg shadow-2xl"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next */}
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 sm:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white text-xl flex items-center justify-center transition-all z-10"
                aria-label="Next photo"
              >›</button>
            )}

            {/* Counter */}
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {lightboxIdx + 1} / {images.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Video Grid ────────────────────────────────────────────────────────────────

const INITIAL_VIDEOS = 3;
const LOAD_MORE_VIDEOS = 3;

function VideoGrid({ videos, title }: { videos: string[]; title: string }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VIDEOS);
  const [playing,      setPlaying]      = useState<number | null>(null);

  const visibleVideos = videos.slice(0, visibleCount);
  const hasMore       = visibleCount < videos.length;
  const isExpanded    = visibleCount > INITIAL_VIDEOS;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleVideos.map((src, idx) => (
          <motion.div
            key={src + idx}
            className="relative rounded-xl overflow-hidden bg-black/20 group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: (idx % 3) * 0.08 }}
          >
            <video
              src={src}
              className="w-full h-auto max-h-64 object-cover block"
              controls={playing === idx}
              playsInline
              preload="metadata"
              onPlay={() => setPlaying(idx)}
              onPause={() => setPlaying(null)}
              onEnded={() => setPlaying(null)}
              aria-label={`${title} project video ${idx + 1}`}
            />
            {/* Play overlay — disappears when playing */}
            {playing !== idx && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-all duration-300 cursor-pointer"
                onClick={() => {
                  const el = document.querySelectorAll('video')[idx] as HTMLVideoElement;
                  if (el) { el.play(); setPlaying(idx); }
                }}
              >
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl ml-1">▶</span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* ── Load More / Show Less ── */}
      {videos.length > INITIAL_VIDEOS && (
        <div className="flex flex-col items-center gap-3 mt-6">
          <p className="text-sm text-on-surface-variant/60">
            Showing <span className="font-semibold text-on-surface">{visibleVideos.length}</span> of{' '}
            <span className="font-semibold text-on-surface">{videos.length}</span> videos
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            {hasMore && (
              <button
                onClick={() => setVisibleCount((c) => Math.min(c + LOAD_MORE_VIDEOS, videos.length))}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-primary/30 text-primary font-medium text-sm hover:bg-primary/10 transition-all duration-300 hover:border-primary/60"
              >
                <span>Load More Videos</span>
                <span className="text-xs opacity-60">({Math.min(LOAD_MORE_VIDEOS, videos.length - visibleCount)} more)</span>
                <span>↓</span>
              </button>
            )}
            {!hasMore && (
              <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-outline-variant/30 text-on-surface-variant/40 font-medium text-sm">
                All videos loaded ✓
              </span>
            )}
            {isExpanded && (
              <button
                onClick={() => { setVisibleCount(INITIAL_VIDEOS); setPlaying(null); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-outline-variant/40 text-on-surface-variant font-medium text-sm hover:bg-surface-variant/20 transition-all duration-300"
              >
                Show Less ↑
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function ServiceDetailPage({
  title,
  subtitle,
  description,
  icon,
  slug,
  stats,
  badge,
  benefits,
  includedServices,
  videoSrc,
}: ServiceDetailPageProps) {
  // API media (images + videos) uploaded via admin
  const { images: apiImages, videos: apiVideos } = useServiceMedia(slug);

  const localImages = (SERVICE_IMAGES[slug] || []).map((src) => ({ src, alt: `${title} project photo` }));

  // If API has images → show mosaic. Otherwise fall back to carousel with local images
  const showMosaic   = apiImages.length > 0;
  const carouselImages = localImages;

  const heroVideo = videoSrc || SERVICE_VIDEOS[slug] || VIDEOS.hero;
  const fallbackImage = apiImages[0] || localImages[0]?.src;

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

      {/* ── Mosaic Gallery (API images) ── */}
      {showMosaic && (
        <section
          className="section-padding max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop"
          aria-label={`${title} project photos`}
        >
          <div className="text-center mb-8">
            <span className="font-label-md text-label-md text-primary uppercase tracking-widest block mb-3">
              Our Work
            </span>
            <h2 className="font-headline-md text-on-surface font-bold">
              {title} Projects
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              {apiImages.length} completed project{apiImages.length !== 1 ? 's' : ''} — click any photo to view full size
            </p>
          </div>
          <MosaicGallery images={apiImages} title={title} />
        </section>
      )}

      {/* ── Video Gallery (API-uploaded videos) ── */}
      {apiVideos.length > 0 && (
        <section
          className="section-padding max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop"
          aria-label={`${title} project videos`}
        >
          <div className="text-center mb-8">
            <span className="font-label-md text-label-md text-primary uppercase tracking-widest block mb-3">
              Project Videos
            </span>
            <h2 className="font-headline-md text-on-surface font-bold">
              {title} — Video Gallery
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              {apiVideos.length} video{apiVideos.length !== 1 ? 's' : ''} from our completed projects
            </p>
          </div>
          <VideoGrid videos={apiVideos} title={title} />
        </section>
      )}


      {/* ── Carousel fallback (only when no API images) ── */}
      {!showMosaic && carouselImages.length > 0 && (
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

      {includedServices && includedServices.length > 0 && (
        <section className="section-padding max-w-container-max mx-auto" aria-labelledby="service-includes-heading">
          <div className="text-center">
            <SectionHeader
              overline="Included With Your Project"
              headline="What does the service include?"
              centered
            />
            <p id="service-includes-heading" className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mx-auto mt-6 mb-8 leading-relaxed">
              When contracting the {title} service with Perez Premium Roofing INC, the client receives:
            </p>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {includedServices.map((item) => (
              <li key={item} className="glass-card p-5 rounded-xl flex items-start gap-3 text-left font-body-md text-body-md text-on-surface">
                <span className="material-symbols-outlined text-primary shrink-0" aria-hidden="true">check_circle</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
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

