'use client';

/**
 * components/home/TestimonialSlider.tsx
 *
 * Auto-playing testimonial carousel that loads REAL approved reviews
 * from GET /api/public/reviews. Falls back to static testimonials
 * while loading or if the API returns no results.
 *
 * Design: glassmorphism card with animated slide transitions,
 * dot-nav, auto-play every 5.5s, and trust badges below.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Loader2 } from 'lucide-react';
import { fetchApprovedReviews } from '@/services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Testimonial {
  id?: number;
  name: string;
  location?: string;
  rating: number;
  text: string;
  service?: string;
  created_at?: string;
}

// ─── Fallback data (shown while loading or if API has no results yet) ─────────

const FALLBACK: Testimonial[] = [
  {
    name: 'Juan M.',
    location: 'San Jose, CA',
    rating: 5,
    text: 'Great people to deal with, easy-going. I would recommend them to put your roof in your house. They did a great job — happy with their work.',
    service: 'Roof Installation',
  },
  {
    name: 'Maria G.',
    location: 'Sunnyvale, CA',
    rating: 5,
    text: 'Perez Roofing did an excellent job on our home. Very professional team, arrived on time, and cleaned up completely. The new roof looks beautiful!',
    service: 'Composition Shingles',
  },
  {
    name: 'Roberto L.',
    location: 'Fremont, CA',
    rating: 5,
    text: 'We had a leak that was causing serious damage. They came out quickly, diagnosed the problem, and had it fixed the same week. Highly recommend!',
    service: 'Roof Repair',
  },
  {
    name: 'Sandra K.',
    location: 'Palo Alto, CA',
    rating: 5,
    text: 'From the free estimate to the final inspection, the entire process was smooth and transparent. Licensed, insured, and honest pricing. 10/10.',
    service: 'Concrete Tile Roofing',
  },
  {
    name: 'Carlos H.',
    location: 'Oakland, CA',
    rating: 5,
    text: 'Our commercial building needed a full flat roof replacement. Perez Roofing handled the entire project professionally. No disruption to our business.',
    service: 'Flat Roof PVC/TPO',
  },
];

// ─── Star Rating Display ──────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 justify-center" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={18}
          className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}
        />
      ))}
    </div>
  );
}

// ─── Avatar initials circle ───────────────────────────────────────────────────

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0"
      style={{
        background: 'linear-gradient(135deg, #0b1e5b 0%, #1b2b68 100%)',
        border: '2px solid rgba(183,196,255,0.25)',
        color: '#b7c4ff',
        fontFamily: 'Montserrat, sans-serif',
      }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TestimonialSlider() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRealData, setIsRealData] = useState(false);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Load real reviews from API
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchApprovedReviews({ perPage: 50 });

        // Handle both {data: Review[]} and Review[] shapes from Laravel
        let extracted: Testimonial[] = [];
        if (Array.isArray(res)) {
          extracted = res.map((r: { id?: number; name: string; rating: number; comment?: string; text?: string; created_at?: string }) => ({
            id: r.id,
            name: r.name,
            rating: r.rating,
            text: r.comment || r.text || '',
            created_at: r.created_at,
          }));
        } else if (res && typeof res === 'object' && 'data' in (res as object)) {
          const data = (res as { data: { id?: number; name: string; rating: number; comment?: string; text?: string; created_at?: string }[] }).data ?? [];
          extracted = data.map((r) => ({
            id: r.id,
            name: r.name,
            rating: r.rating,
            text: r.comment || r.text || '',
            created_at: r.created_at,
          }));
        }

        if (extracted.length > 0) {
          setTestimonials(extracted);
          setIsRealData(true);
        } else {
          setTestimonials(FALLBACK);
        }
      } catch {
        setTestimonials(FALLBACK);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Compute real stats from reviews
  const avgRating = isRealData && testimonials.length > 0
    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length)
    : null;
  const pctRecommended = isRealData && testimonials.length > 0
    ? Math.round((testimonials.filter((t) => t.rating >= 4).length / testimonials.length) * 100)
    : null;

  const total = testimonials.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  // Auto-play (pauses on hover)
  useEffect(() => {
    if (isLoading || total === 0 || isPaused) return;
    const id = setInterval(next, 5500);
    return () => clearInterval(id);
  }, [next, isLoading, total, isPaused]);

  // ── Skeleton while loading ──
  if (isLoading) {
    return (
      <section className="section-padding max-w-container-max mx-auto" aria-label="Loading reviews">
        <div className="text-center mb-12">
          <span className="font-label-md text-label-md text-primary uppercase tracking-widest block mb-3">
            Client Reviews
          </span>
          <h2 className="font-headline-lg-mobile md:text-headline-lg text-on-surface font-extrabold">
            What Our Clients <span className="text-gradient">Say About Us</span>
          </h2>
        </div>
        <div className="max-w-3xl mx-auto glass-panel rounded-2xl p-8 md:p-12 border border-white/10 flex flex-col items-center gap-4">
          <Loader2 size={32} className="text-primary animate-spin" />
          <p className="text-sm text-on-surface-variant">Loading reviews…</p>
        </div>
      </section>
    );
  }

  const t = testimonials[current];

  return (
    <section
      className="section-padding max-w-container-max mx-auto"
      aria-labelledby="testimonials-heading"
    >
      {/* Section header */}
      <div className="text-center mb-12">
        <span className="font-label-md text-label-md text-primary uppercase tracking-widest block mb-3">
          {testimonials === FALLBACK ? 'Client Reviews' : 'Verified Client Reviews'}
        </span>
        <h2
          id="testimonials-heading"
          className="font-headline-lg-mobile md:text-headline-lg text-on-surface font-extrabold"
        >
          What Our Clients <span className="text-gradient">Say About Us</span>
        </h2>
      </div>

      {/* Slider */}
      <div
        className="relative max-w-3xl mx-auto"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Prev / Next arrows */}
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10
                     w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#8f909b',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(183,196,255,0.12)';
            (e.currentTarget as HTMLButtonElement).style.color = '#b7c4ff';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
            (e.currentTarget as HTMLButtonElement).style.color = '#8f909b';
          }}
          aria-label="Previous testimonial"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>

        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10
                     w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#8f909b',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(183,196,255,0.12)';
            (e.currentTarget as HTMLButtonElement).style.color = '#b7c4ff';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
            (e.currentTarget as HTMLButtonElement).style.color = '#8f909b';
          }}
          aria-label="Next testimonial"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="glass-panel rounded-2xl p-8 md:p-12 border border-white/10 text-center"
          >
            {/* Quote icon */}
            <div
              className="text-6xl leading-none mb-4 select-none"
              style={{ color: 'rgba(183,196,255,0.2)', fontFamily: 'Georgia, serif' }}
              aria-hidden="true"
            >
              &ldquo;
            </div>

            {/* Stars */}
            <StarRating rating={t.rating} />

            {/* Review text */}
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-6 mb-8 italic leading-relaxed">
              &ldquo;{t.text}&rdquo;
            </p>

            {/* Author */}
            <div className="flex flex-col items-center gap-3">
              <Avatar name={t.name} />
              <div className="flex flex-col items-center gap-1">
                <span className="font-button text-on-surface font-semibold text-lg">
                  {t.name}
                </span>
                {t.location && (
                  <span className="text-sm text-on-surface-variant">{t.location}</span>
                )}
                {t.created_at && !t.location && (
                  <span className="text-sm text-on-surface-variant">
                    {new Date(t.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                )}
                {t.service && (
                  <span
                    className="mt-1 px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: 'rgba(183,196,255,0.08)',
                      border: '1px solid rgba(183,196,255,0.2)',
                      color: '#b7c4ff',
                    }}
                  >
                    {t.service}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dot navigation */}
        <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Testimonial navigation">
          {testimonials.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              onClick={() => setCurrent(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === current ? 24 : 6,
                height: 6,
                background: i === current ? '#b7c4ff' : 'rgba(255,255,255,0.2)',
              }}
              onMouseEnter={(e) => {
                if (i !== current) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.4)';
              }}
              onMouseLeave={(e) => {
                if (i !== current) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.2)';
              }}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>

        {/* Review count badge */}
        {testimonials !== FALLBACK && total > 0 && (
          <p className="text-center text-xs text-on-surface-variant mt-3">
            Showing {current + 1} of {total} verified reviews
          </p>
        )}
      </div>

      {/* "Leave a Review" CTA */}
      <div className="text-center mt-8">
        <a
          href="/reviews"
          className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-200"
          style={{ color: '#b7c4ff' }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <Star size={14} className="fill-primary" />
          See all reviews &amp; leave yours →
        </a>
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap justify-center gap-6 mt-12 pt-10 border-t border-white/5">
        {[
          { icon: 'verified', label: 'Licensed & Insured', sub: 'CSLB #1135746' },
          {
            icon: 'star',
            label: avgRating ? `${avgRating.toFixed(1)} / 5 Stars` : '5-Star Rated',
            sub: isRealData ? `Based on ${testimonials.length} reviews` : 'Google Reviews',
          },
          {
            icon: 'thumb_up',
            label: pctRecommended !== null ? `${pctRecommended}% Recommended` : '100% Recommended',
            sub: isRealData ? 'By verified clients' : 'By Our Clients',
          },
          { icon: 'handshake', label: 'Free Estimates', sub: 'No Obligation' },
        ].map((badge) => (
          <div key={badge.label} className="flex items-center gap-3 px-5 py-3 glass-card rounded-xl">
            <span className="material-symbols-outlined material-symbols-filled text-primary text-2xl" aria-hidden="true">
              {badge.icon}
            </span>
            <div>
              <p className="text-sm font-semibold text-on-surface">{badge.label}</p>
              <p className="text-xs text-on-surface-variant">{badge.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
