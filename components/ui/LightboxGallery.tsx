'use client';

/**
 * components/ui/LightboxGallery.tsx
 *
 * Premium masonry gallery with:
 * - Category filter tabs
 * - Hover zoom animation
 * - Lightbox (fullscreen preview)
 * - Keyboard navigation (← → Esc)
 * - Smooth fade-in loading animations
 * - "Load More" button for pagination
 * - Responsive grid (1 col mobile → 2 tablet → 3-4 desktop)
 */

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import type { GalleryItem } from '@/lib/mediaAssets';

type Category = GalleryItem['category'] | 'all';

const CATEGORY_LABELS: Record<Category, string> = {
  all:           'All Projects',
  residential:   'Residential',
  commercial:    'Commercial',
  shingles:      'Shingles',
  tile:          'Tile Roofing',
  gutters:       'Gutters',
  flat:          'Flat Roofs',
  maintenance:   'Maintenance',
  'before-after': 'Before & After',
};

const PAGE_SIZE = 20;

interface LightboxGalleryProps {
  items: GalleryItem[];
  showFilters?: boolean;
  columns?: 2 | 3 | 4;
}

export default function LightboxGallery({
  items,
  showFilters = true,
  columns = 3,
}: LightboxGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [lightboxIndex,  setLightboxIndex]  = useState<number | null>(null);
  const [visibleCount,   setVisibleCount]   = useState(PAGE_SIZE);

  // Derived filtered list
  const filtered = activeCategory === 'all'
    ? items
    : items.filter((item) => item.category === activeCategory);
  const visible = filtered.slice(0, visibleCount);

  // Keyboard nav
  const closeLightbox  = useCallback(() => setLightboxIndex(null), []);
  const prevLightbox   = useCallback(() => setLightboxIndex((i) => i !== null ? (i - 1 + filtered.length) % filtered.length : null), [filtered.length]);
  const nextLightbox   = useCallback(() => setLightboxIndex((i) => i !== null ? (i + 1) % filtered.length : null), [filtered.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prevLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'Escape')     closeLightbox();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, prevLightbox, nextLightbox, closeLightbox]);

  // Lock scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  // Reset pagination on category change
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [activeCategory]);

  const categories = Array.from(
    new Set(['all' as Category, ...items.map((i) => i.category)])
  );

  const colClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  }[columns];

  return (
    <>
      {/* ── Category Filters ── */}
      {showFilters && (
        <div
          className="flex flex-wrap gap-2 justify-center mb-10"
          role="tablist"
          aria-label="Gallery categories"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={cat === activeCategory}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                cat === activeCategory
                  ? 'bg-primary text-surface border-primary shadow-[0_0_12px_rgba(183,196,255,0.3)]'
                  : 'border-white/10 text-on-surface-variant hover:border-primary/40 hover:text-primary bg-white/[0.03]'
              }`}
            >
              {CATEGORY_LABELS[cat]}
              <span className="ml-1.5 text-xs opacity-60">
                ({cat === 'all' ? items.length : items.filter((i) => i.category === cat).length})
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ── Masonry Grid ── */}
      <div className={`grid ${colClass} gap-3 md:gap-4`}>
        {visible.map((item, idx) => (
          <button
            key={`${item.src}-${idx}`}
            className="group relative overflow-hidden rounded-xl cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-primary gallery-item"
            style={{ aspectRatio: idx % 5 === 0 ? '4/3' : idx % 7 === 3 ? '3/4' : '1/1' }}
            onClick={() => {
              const realIdx = filtered.indexOf(item);
              setLightboxIndex(realIdx >= 0 ? realIdx : idx);
            }}
            aria-label={`View ${item.alt}`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-all duration-300 flex items-center justify-center">
              <ZoomIn
                size={32}
                className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 drop-shadow-lg scale-75 group-hover:scale-100"
              />
            </div>
            {/* Category badge */}
            <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/60 text-white backdrop-blur-sm">
                {CATEGORY_LABELS[item.category]}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* ── Load More ── */}
      {visibleCount < filtered.length && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            className="px-8 py-3 rounded-xl border border-primary/30 text-primary font-medium hover:bg-primary/10 hover:border-primary/60 transition-all duration-200"
          >
            Load More ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X size={20} />
          </button>

          {/* Prev */}
          <button
            className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Image */}
          <div
            className="relative max-w-[90vw] max-h-[90vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={lightboxIndex}
              src={filtered[lightboxIndex].src}
              alt={filtered[lightboxIndex].alt}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {/* Next */}
          <button
            className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>

          {/* Counter + caption */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center z-10">
            <p className="text-white/60 text-sm mb-1">
              {lightboxIndex + 1} / {filtered.length}
            </p>
            <p className="text-white text-base font-medium">
              {filtered[lightboxIndex].alt}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
