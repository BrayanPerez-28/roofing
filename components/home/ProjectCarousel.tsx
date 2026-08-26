'use client';

/**
 * components/home/ProjectCarousel.tsx
 *
 * Featured projects carousel for the homepage.
 * Full-width cinematic strip with auto-play and overlay text.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FEATURED_PROJECT_IMAGES } from '@/lib/mediaAssets';

/**
 * One entry per slide in FEATURED_PROJECT_IMAGES (same index order).
 * Each title / type / location matches the actual photo shown.
 */
const PROJECTS = [
  { src: FEATURED_PROJECT_IMAGES[0], title: 'Concrete Tile Roof',      location: 'San Jose, CA',      type: 'Residential' },
  { src: FEATURED_PROJECT_IMAGES[1], title: 'Composition Shingles',     location: 'Palo Alto, CA',     type: 'Residential' },
  { src: FEATURED_PROJECT_IMAGES[2], title: 'Commercial Flat Roof',     location: 'Sunnyvale, CA',     type: 'Commercial'  },
  { src: FEATURED_PROJECT_IMAGES[3], title: 'Standing Seam Metal Roof', location: 'Santa Clara, CA',   type: 'Residential' },
  { src: FEATURED_PROJECT_IMAGES[4], title: 'Wood Shake Roofing',       location: 'Fremont, CA',       type: 'Residential' },
  { src: FEATURED_PROJECT_IMAGES[5], title: 'Gutter Installation',      location: 'Oakland, CA',       type: 'Residential' },
  { src: FEATURED_PROJECT_IMAGES[6], title: 'Roof Repairs & Restoration', location: 'San Rafael, CA', type: 'Maintenance' },
  { src: FEATURED_PROJECT_IMAGES[7], title: 'Complete Reroof Project',  location: 'Berkeley, CA',      type: 'Residential' },
];

export default function ProjectCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);
  const touchStart = useRef(0);
  const total = PROJECTS.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next]);

  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.changedTouches[0].screenX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    const dx = touchStart.current - e.changedTouches[0].screenX;
    if (Math.abs(dx) > 40) dx > 0 ? next() : prev();
  };

  return (
    <section
      className="relative overflow-hidden rounded-2xl"
      style={{ aspectRatio: '21/9' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-label="Featured projects"
    >
      {/* Slides */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <Image
            src={PROJECTS[current].src}
            alt={PROJECTS[current].title}
            fill
            className="object-cover"
            sizes="100vw"
            priority={current === 0}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Project info */}
      <div className="absolute bottom-8 left-8 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="inline-block px-3 py-0.5 rounded-full bg-primary/30 border border-primary/50 text-primary text-xs font-medium mb-3">
              {PROJECTS[current].type}
            </span>
            <h3 className="text-white font-bold text-2xl md:text-3xl mb-1">
              {PROJECTS[current].title}
            </h3>
            <p className="text-white/70 text-sm">{PROJECTS[current].location}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div className="absolute bottom-8 right-8 z-10">
        <Link
          href="/gallery"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium backdrop-blur-sm transition-all duration-200 group"
        >
          View All Projects
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 border border-white/20 flex items-center justify-center text-white backdrop-blur-sm transition-all duration-200"
        aria-label="Previous project"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 border border-white/20 flex items-center justify-center text-white backdrop-blur-sm transition-all duration-200"
        aria-label="Next project"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
        {PROJECTS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${i === current ? 'w-5 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'}`}
            aria-label={`Go to project ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
