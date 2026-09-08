'use client';

/**
 * app/gallery/GalleryClient.tsx
 *
 * Premium editorial masonry gallery:
 * ─ Asymmetric CSS-Grid mosaic (dense auto-flow)
 * ─ Animated glassmorphism hover overlays
 * ─ Instant category filtering with AnimatePresence
 * ─ Videos embedded in the collage (hover-to-preview, click for fullscreen)
 * ─ Premium fullscreen lightbox (zoom, keyboard, swipe, info panel)
 * ─ Scroll-triggered staggered entrance animations
 */

import {
  useState, useEffect, useCallback, useMemo, useRef,
} from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronLeft, ChevronRight, ZoomIn, Play, Eye, Image as ImageIcon, Film, LayoutGrid,
} from 'lucide-react';
import { GALLERY_ITEMS, VIDEOS } from '@/lib/mediaAssets';
import { useAllServicesMedia } from '@/lib/useApiGallery';
import type { GalleryItem } from '@/lib/mediaAssets';

// ─── Types ────────────────────────────────────────────────────────────────────

type CategoryId = GalleryItem['category'] | 'all';
type MediaType  = 'all' | 'images' | 'videos';

interface VideoGalleryItem {
  isVideo: true;
  src: string;
  poster: string;
  alt: string;
  category: GalleryItem['category'];
}

type MosaicItem = GalleryItem | VideoGalleryItem;

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'all',           label: 'All Projects' },
  { id: 'residential',   label: 'Residential' },
  { id: 'commercial',    label: 'Commercial' },
  { id: 'shingles',      label: 'Composition Shingles' },
  { id: 'tile',          label: 'Concrete Tile Roofing' },
  { id: 'flat',          label: 'Flat Roof PVC & TPO' },
  { id: 'gutters',       label: 'Gutters & Downspouts' },
  { id: 'maintenance',   label: 'Maintenance' },
  { id: 'before-after',  label: 'Before & After' },
];

const CAT_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.label])
);

const VIDEO_ITEMS: VideoGalleryItem[] = [
  {
    isVideo: true,
    src: VIDEOS.hero,
    poster: '/multimedia/img/Composition%20Shingles/roof3.jpeg',
    alt: 'Bay Area Roofing — Aerial Project Overview',
    category: 'residential',
  },
  {
    isVideo: true,
    src: VIDEOS.services,
    poster: '/multimedia/img/Composition%20Shingles/roof2.jpeg',
    alt: 'On-Site Roofing Project',
    category: 'commercial',
  },
  {
    isVideo: true,
    src: VIDEOS.maintenance,
    poster: '/multimedia/img/Roof%20Repairs/IN-Roof-Repair-and-Roof-Replacement%20-%20Copy%20-%20Copy.jpg',
    alt: 'Roof Maintenance & Repair Work',
    category: 'maintenance',
  },
];

/**
 * Mosaic size pattern — repeats every 11 items.
 * CSS grid-auto-flow: dense fills gaps automatically → no holes.
 * 4-column grid on desktop, 2-column on tablet/mobile.
 */
const MOSAIC: Array<{ cols: 1 | 2; rows: 1 | 2 }> = [
  { cols: 2, rows: 2 }, //  0 — large hero
  { cols: 1, rows: 1 }, //  1 — small
  { cols: 1, rows: 1 }, //  2 — small
  { cols: 1, rows: 2 }, //  3 — tall portrait
  { cols: 2, rows: 1 }, //  4 — wide landscape
  { cols: 1, rows: 1 }, //  5 — small
  { cols: 1, rows: 1 }, //  6 — small
  { cols: 2, rows: 1 }, //  7 — wide landscape
  { cols: 1, rows: 1 }, //  8 — small
  { cols: 1, rows: 2 }, //  9 — tall portrait
  { cols: 1, rows: 1 }, // 10 — small
];

// Safe Tailwind class map — avoids dynamic class construction
const SIZE_CLASS: Record<string, string> = {
  '1x1': 'col-span-1 row-span-1',
  '2x1': 'col-span-2 row-span-1',
  '1x2': 'col-span-1 row-span-2',
  '2x2': 'col-span-2 row-span-2',
};

function getSize(index: number) {
  const m = MOSAIC[index % MOSAIC.length];
  return { ...m, cls: SIZE_CLASS[`${m.cols}x${m.rows}`] };
}

/** Inject the 3 project videos at visual positions within the filtered list */
function buildMosaicList(images: GalleryItem[]): MosaicItem[] {
  const list: MosaicItem[] = [...images];
  const insertions: Array<[number, VideoGalleryItem]> = [
    [5,  VIDEO_ITEMS[0]],
    [20, VIDEO_ITEMS[1]],
    [48, VIDEO_ITEMS[2]],
  ];
  let offset = 0;
  for (const [pos, v] of insertions) {
    const idx = pos + offset;
    if (list.length > idx) {
      list.splice(idx, 0, v);
      offset++;
    }
  }
  return list;
}

// ─── Single Mosaic Cell ───────────────────────────────────────────────────────

interface CellProps {
  item: MosaicItem;
  gridIndex: number;
  onOpen: (i: number) => void;
}

function MosaicCell({ item, gridIndex, onOpen }: CellProps) {
  const { cls } = getSize(gridIndex);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  const [failed, setFailed]   = useState(false);
  const isVideo = 'isVideo' in item && item.isVideo;
  const isFeatured = gridIndex < 2 || (gridIndex + 1) % 6 === 0;
  const isLarge = cls.includes('col-span-2') || cls.includes('row-span-2');

  // Hover-to-preview for video tiles
  useEffect(() => {
    if (!isVideo) return;
    const v = videoRef.current;
    if (!v) return;
    if (hovered) v.play().catch(() => {});
    else { v.pause(); v.currentTime = 0; }
  }, [hovered, isVideo]);

  const animDelay = (gridIndex % 6) * 0.055;

  // Silently hide the cell if media failed to load (404, network error, etc.)
  if (failed) return null;

  return (
    <motion.div
      className={`gallery-mosaic-cell ${cls} relative overflow-hidden rounded-[1.75rem] cursor-pointer group`}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      whileHover={{ scale: 1.01, y: -4, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay: animDelay,
      }}
      onClick={() => onOpen(gridIndex)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Open: ${item.alt}`}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(gridIndex)}
    >
      {/* ── Media ── */}
      {isVideo ? (
        <video
          ref={videoRef}
          src={(item as VideoGalleryItem).src}
          poster={(item as VideoGalleryItem).poster}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          aria-hidden="true"
          onError={() => setFailed(true)}
        />
      ) : (
        <Image
          src={item.src}
          alt={item.alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform"
          sizes={
            getSize(gridIndex).cols === 2
              ? '(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 50vw'
              : '(max-width: 640px) 50vw, (max-width: 1024px) 30vw, 25vw'
          }
          loading={gridIndex < 8 ? 'eager' : 'lazy'}
          priority={gridIndex < 4}
          onError={() => setFailed(true)}
        />
      )}

      {/* ── Video play badge (resting state) ── */}
      {isVideo && (
        <div
          className={`absolute inset-0 flex items-center justify-center z-10 pointer-events-none
            transition-opacity duration-300 ${hovered ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-2xl">
            <Play size={22} className="text-white fill-white translate-x-0.5" />
          </div>
        </div>
      )}

      {/* ── Hover overlay — glassmorphism ── */}
      <div
        className="absolute inset-0 z-20 flex flex-col justify-between p-4
          opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out
          bg-gradient-to-t from-black/90 via-black/40 to-transparent"
        aria-hidden="true"
      >
        {/* Top row: category + featured badge */}
        <div className="flex justify-between items-start gap-2">
          <motion.span
            className="px-3 py-1 rounded-full text-[11px] font-semibold
              bg-white/15 backdrop-blur-md border border-white/20 text-white/90
              leading-none"
            initial={{ y: -6, opacity: 0 }}
            animate={hovered ? { y: 0, opacity: 1 } : { y: -6, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {CAT_LABEL[item.category] ?? item.category}
          </motion.span>
          <div className="flex flex-wrap justify-end gap-2">
            {isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold
                bg-primary/30 backdrop-blur-md border border-primary/40 text-primary-foreground">
                Featured
              </span>
            )}
            {isVideo && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px]
                bg-primary/30 backdrop-blur-md border border-primary/40 text-primary font-semibold">
                <Play size={9} className="fill-current" />
                VIDEO
              </span>
            )}
          </div>
        </div>

        {/* Bottom: title + CTA */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={hovered ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
          transition={{ duration: 0.28, delay: hovered ? 0.05 : 0 }}
        >
          <p className="text-white font-semibold text-sm leading-snug mb-2 drop-shadow-lg line-clamp-2">
            {item.alt}
          </p>
          <p className="text-white/70 text-[11px] uppercase tracking-[0.2em] mb-3">
            {isLarge ? 'Editorial feature' : 'Project story'}
          </p>
          <span
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium
              bg-white/15 backdrop-blur-md border border-white/25 text-white
              hover:bg-white/25 transition-colors duration-200"
          >
            <Eye size={12} />
            {isVideo ? 'Play Video' : 'View Project'}
          </span>
        </motion.div>
      </div>

      {/* Inner glow border on hover */}
      <div
        className="absolute inset-0 z-30 rounded-xl border border-white/0 group-hover:border-white/10
          transition-all duration-300 pointer-events-none"
      />
    </motion.div>
  );
}

// ─── Premium Fullscreen Lightbox ──────────────────────────────────────────────

interface LightboxProps {
  items: MosaicItem[];
  startIndex: number;
  onClose: () => void;
}

function PremiumLightbox({ items, startIndex, onClose }: LightboxProps) {
  const [idx, setIdx]         = useState(startIndex);
  const [zoomed, setZoomed]   = useState(false);
  const touchStart             = useRef(0);
  const total                  = items.length;
  const item                   = items[idx];
  const isVideo                = item && 'isVideo' in item && item.isVideo;

  const prev = useCallback(() => { setZoomed(false); setIdx((i) => (i - 1 + total) % total); }, [total]);
  const next = useCallback(() => { setZoomed(false); setIdx((i) => (i + 1) % total); }, [total]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape')     onClose();
      if (e.key === 'z')          setZoomed((z) => !z);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [prev, next, onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.changedTouches[0].screenX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    const dx = touchStart.current - e.changedTouches[0].screenX;
    if (Math.abs(dx) > 50) dx > 0 ? next() : prev();
  };

  if (!item) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/96 backdrop-blur-2xl"
        onClick={onClose}
      />

      {/* Layout */}
      <div className="relative flex w-full h-full z-10">

        {/* ── Media panel ── */}
        <div
          className="flex-1 flex items-center justify-center p-6 lg:p-12 min-w-0"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              className="relative w-full h-full"
              initial={{ opacity: 0, scale: 0.97, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.97, x: -20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {isVideo ? (
                <video
                  src={(item as VideoGalleryItem).src}
                  poster={(item as VideoGalleryItem).poster}
                  controls
                  autoPlay
                  muted={false}
                  playsInline
                  className="w-full h-full object-contain rounded-xl"
                  aria-label={item.alt}
                />
              ) : (
                <div
                  className={`relative w-full h-full transition-transform duration-300 rounded-xl overflow-hidden ${zoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}`}
                  onClick={() => setZoomed((z) => !z)}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-contain"
                    sizes="85vw"
                    priority
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Info sidebar (desktop) ── */}
        <motion.aside
          className="hidden lg:flex flex-col w-72 xl:w-80 shrink-0
            border-l border-white/8 bg-surface/50 backdrop-blur-2xl"
          initial={{ x: 48, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/8">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold
              bg-primary/15 border border-primary/25 text-primary mb-4">
              {CAT_LABEL[item.category] ?? item.category}
            </span>
            <h3 className="text-white font-bold text-lg leading-snug mb-2">
              {item.alt}
            </h3>
            <p className="text-white/40 text-sm">Bay Area, California</p>
          </div>

          {/* Company info */}
          <div className="p-6 space-y-4 flex-1">
            <div>
              <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">Contractor</p>
              <p className="text-white/80 text-sm font-medium">Perez Premium Roofing INC</p>
            </div>
            <div>
              <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">License</p>
              <p className="text-white/80 text-sm font-mono">CSLB #1135746</p>
            </div>
            <div>
              <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">Coverage</p>
              <p className="text-white/80 text-sm">San Francisco Bay Area, CA</p>
            </div>
            {isVideo && (
              <div>
                <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">Type</p>
                <p className="text-white/80 text-sm">Project Video</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-white/8 space-y-3">
            <p className="text-white/25 text-xs text-center">
              {idx + 1} of {total}
            </p>
            <a
              href="/contact"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
                bg-primary/20 hover:bg-primary/30 border border-primary/30
                text-primary text-sm font-semibold transition-colors duration-200"
            >
              Get a Free Estimate
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
                bg-white/5 hover:bg-white/10 border border-white/10
                text-white/50 hover:text-white text-sm transition-colors duration-200"
            >
              Close Gallery
            </button>
          </div>
        </motion.aside>
      </div>

      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 h-14 flex items-center justify-between px-4 z-20
        bg-gradient-to-b from-black/40 to-transparent pointer-events-none">
        <span className="text-white/30 text-sm font-medium pointer-events-auto">
          {idx + 1} / {total}
        </span>
        <div className="flex gap-2 pointer-events-auto">
          {!isVideo && (
            <button
              onClick={() => setZoomed((z) => !z)}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Toggle zoom (Z)"
            >
              <ZoomIn size={15} />
            </button>
          )}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Close (Esc)"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* ── Navigation arrows ── */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20
          w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm
          flex items-center justify-center text-white border border-white/15
          transition-all duration-200 hover:scale-110"
        onClick={prev}
        aria-label="Previous image"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        className="absolute right-4 lg:right-[304px] xl:right-[336px] top-1/2 -translate-y-1/2 z-20
          w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm
          flex items-center justify-center text-white border border-white/15
          transition-all duration-200 hover:scale-110"
        onClick={next}
        aria-label="Next image"
      >
        <ChevronRight size={20} />
      </button>

      {/* ── Keyboard hint (fades after 2s) ── */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:flex gap-3 text-white/25 text-xs"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <span>← → Navigate</span>
        <span>·</span>
        <span>Z  Zoom</span>
        <span>·</span>
        <span>Esc  Close</span>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Gallery Page ────────────────────────────────────────────────────────

const PAGE_SIZE = 44;

export default function GalleryClient() {
  const [category,      setCategory]      = useState<CategoryId>('all');
  const [mediaType,     setMediaType]     = useState<MediaType>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visible,       setVisible]       = useState(PAGE_SIZE);

  // Fetch API-uploaded photos and prepend them to the static gallery
  const { galleryItems: apiItems } = useAllServicesMedia();

  // Merge: API items first (most recent), then local items not already in API
  const allItems = useMemo(() => {
    const apiSrcs = new Set(apiItems.map((i) => i.src));
    const local = GALLERY_ITEMS.filter((i) => !apiSrcs.has(i.src));
    return [...apiItems, ...local];
  }, [apiItems]);

  const filteredImages = useMemo(() =>
    category === 'all'
      ? allItems
      : allItems.filter((i) => i.category === category),
    [category, allItems]
  );

  const mosaicItems = useMemo(() => {
    const withVideos = buildMosaicList(filteredImages);
    if (mediaType === 'images') return withVideos.filter((i) => !('isVideo' in i && i.isVideo));
    if (mediaType === 'videos') return VIDEO_ITEMS.filter(
      (v) => category === 'all' || v.category === category
    );
    return withVideos;
  }, [filteredImages, mediaType, category]);

  const shownItems = useMemo(
    () => mosaicItems.slice(0, visible),
    [mosaicItems, visible]
  );

  useEffect(() => { setVisible(PAGE_SIZE); }, [category, mediaType]);

  return (
    <article>

      {/* ── Cinematic Hero ── */}
      <section className="relative overflow-hidden" style={{ minHeight: '60vh' }}>
        {/* Full-bleed background image strip */}
        <div className="absolute inset-0 grid grid-cols-4 gap-0 overflow-hidden opacity-30">
          {GALLERY_ITEMS.slice(0, 8).map((img, i) => (
            <div key={i} className="relative">
              <Image src={img.src} alt="" fill className="object-cover" loading="eager" aria-hidden="true" />
            </div>
          ))}
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface/80 via-surface/70 to-surface" />

        {/* Content */}
        <div className="relative max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop
          flex flex-col items-center justify-center text-center py-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block px-5 py-1.5 rounded-full border border-primary/30 
              bg-primary/8 text-primary text-xs font-semibold uppercase tracking-[0.15em] mb-8">
              Our Portfolio
            </span>
            <h1 className="font-extrabold text-5xl md:text-7xl lg:text-8xl text-on-surface leading-none mb-6">
              {allItems.length}+<br />
              <span className="text-gradient">Real Projects.</span>
            </h1>
            <p className="text-on-surface-variant text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              Every roof tells a story of craftsmanship, precision and trust.
              Explore our complete Bay Area portfolio.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {['Luxury transformations', 'Drone storytelling', 'Before & After'].map((pill) => (
                <span
                  key={pill}
                  className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] font-medium uppercase tracking-[0.2em] text-on-surface-variant"
                >
                  {pill}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Media Type + Category Filters ── */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-10 pb-8 space-y-4">

        {/* Media type toggle */}
        <div className="flex justify-center">
          <div
            className="inline-flex items-center gap-1 p-1 rounded-2xl border border-white/10"
            style={{ background: 'rgba(255,255,255,0.03)' }}
            role="group"
            aria-label="Filter by media type"
          >
            {([
              { id: 'all'    as MediaType, label: 'All Media',  Icon: LayoutGrid },
              { id: 'images' as MediaType, label: 'Photos',     Icon: ImageIcon  },
              { id: 'videos' as MediaType, label: 'Videos',     Icon: Film       },
            ] as const).map(({ id, label, Icon }) => (
              <motion.button
                key={id}
                onClick={() => setMediaType(id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  mediaType === id
                    ? 'bg-primary text-surface shadow-[0_0_20px_rgba(183,196,255,0.35)]'
                    : 'text-on-surface-variant hover:text-primary hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                aria-pressed={mediaType === id}
              >
                <Icon size={14} />
                {label}
                {id === 'videos' && (
                  <span className={`text-xs ml-0.5 ${mediaType === id ? 'opacity-60' : 'opacity-35'}`}>
                    ({VIDEO_ITEMS.length})
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Category filters — hidden when Videos-only is selected */}
        {mediaType !== 'videos' && (
          <div
            className="flex flex-wrap gap-2 justify-center"
            role="tablist"
            aria-label="Filter by category"
          >
            {CATEGORIES.map((cat) => {
              const count = cat.id === 'all'
                ? GALLERY_ITEMS.length
                : GALLERY_ITEMS.filter((i) => i.category === cat.id).length;
              if (count === 0 && cat.id !== 'all') return null;
              const isActive = cat.id === category;
              return (
                <motion.button
                  key={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-surface border-primary shadow-[0_0_24px_rgba(183,196,255,0.3)]'
                      : 'border-white/10 text-on-surface-variant bg-white/[0.03] hover:border-primary/40 hover:text-primary'
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {cat.label}
                  <span className={`ml-1.5 text-xs ${isActive ? 'opacity-60' : 'opacity-35'}`}>
                    ({count})
                  </span>
                </motion.button>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Masonry Collage ── */}
      <section
        className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pb-12"
        aria-label="Project gallery"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${category}-${mediaType}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="gallery-mosaic"
          >
            {shownItems.map((item, i) => (
              <MosaicCell
                key={`${item.src ?? (item as any).src}-${i}`}
                item={item}
                gridIndex={i}
                onOpen={setLightboxIndex}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        {filteredImages.length === 0 && (
          <div className="text-center py-24 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl opacity-30 block mb-4">image_not_supported</span>
            <p>No projects found in this category.</p>
          </div>
        )}

        {/* Load More */}
        {visible < mosaicItems.length && (
          <div className="flex justify-center mt-14">
            <motion.button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="px-10 py-4 rounded-2xl border border-white/10 text-on-surface-variant
                font-medium hover:border-primary/40 hover:text-primary
                bg-white/[0.02] hover:bg-primary/5 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Load More
              <span className="ml-2 text-sm opacity-40">
                ({mosaicItems.length - visible} more)
              </span>
            </motion.button>
          </div>
        )}
      </section>

      {/* ── Bottom CTA ── */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pb-24">
        <motion.div
          className="relative rounded-3xl overflow-hidden p-12 md:p-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* BG collage strip */}
          <div className="absolute inset-0 grid grid-cols-3 opacity-15">
            {GALLERY_ITEMS.slice(10, 16).map((img, i) => (
              <div key={i} className="relative">
                <Image src={img.src} alt="" fill className="object-cover" loading="lazy" aria-hidden="true" />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-surface/95 via-surface/85 to-primary-container/30" />
          <div className="relative">
            <h2 className="font-extrabold text-3xl md:text-5xl text-on-surface mb-4 leading-tight">
              Seen Enough?<br />
              <span className="text-gradient">Let&apos;s Build Something.</span>
            </h2>
            <p className="text-on-surface-variant mb-10 max-w-lg mx-auto">
              Free estimates throughout the Bay Area. Licensed, Bonded &amp; Insured — CSLB #1135746.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-3 btn-primary font-button text-button px-10 py-4 rounded-xl text-base"
            >
              Get a Free Estimate
              <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <PremiumLightbox
            items={shownItems}
            startIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </article>
  );
}
