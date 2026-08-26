'use client';

/**
 * components/reviews/ReviewsSection.tsx
 *
 * Reusable section that:
 *  1. Fetches real approved reviews from GET /api/public/reviews
 *  2. Displays them in a responsive animated grid
 *  3. Includes an inline "Leave a Review" form (POST /api/public/reviews)
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, CheckCircle, Loader2 } from 'lucide-react';
import { fetchApprovedReviews, submitReview } from '@/services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  approved: boolean;
  created_at: string;
}

// ─── Star Rating Display ──────────────────────────────────────────────────────

function StarDisplay({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/15'}
        />
      ))}
    </div>
  );
}

// ─── Interactive Star Picker ──────────────────────────────────────────────────

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Select a rating">
      {Array.from({ length: 5 }).map((_, i) => {
        const v = i + 1;
        const active = v <= (hovered || value);
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={value === v}
            aria-label={`${v} star${v > 1 ? 's' : ''}`}
            onMouseEnter={() => setHovered(v)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(v)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              size={28}
              className={`transition-colors ${active ? 'fill-yellow-400 text-yellow-400' : 'text-white/20 hover:text-yellow-300'}`}
            />
          </button>
        );
      })}
    </div>
  );
}

// ─── Submit Form ──────────────────────────────────────────────────────────────

function SubmitReviewForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { setError('Please select a star rating.'); return; }
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!comment.trim()) { setError('Please write a comment.'); return; }
    setState('loading');
    setError('');
    try {
      await submitReview({ name: name.trim(), email: email.trim(), rating, comment: comment.trim() });
      setState('success');
      onSuccess();
    } catch (err: unknown) {
      setState('error');
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  const inputClass = 'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/30 transition-all';

  if (state === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-4 py-10 text-center"
      >
        <CheckCircle size={48} className="text-primary" />
        <p className="font-headline-md text-on-surface font-semibold">Thank you for your review!</p>
        <p className="text-sm text-on-surface-variant max-w-xs">
          Your review is pending approval and will appear here shortly.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Star picker */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-white/50 uppercase tracking-widest">Your Rating *</label>
        <StarPicker value={rating} onChange={(v) => { setRating(v); setError(''); }} />
      </div>

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-white/50 uppercase tracking-widest block mb-1.5">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-white/50 uppercase tracking-widest block mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className={inputClass}
          />
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="text-xs font-medium text-white/50 uppercase tracking-widest block mb-1.5">Your Review *</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Share your experience with Perez Premium Roofing…"
          className={`${inputClass} resize-none`}
          required
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1.5">
          <span>⚠</span> {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'loading'}
        className="w-full py-3.5 rounded-xl bg-primary/90 hover:bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {state === 'loading' ? (
          <><Loader2 size={16} className="animate-spin" /> Submitting…</>
        ) : (
          <><Send size={15} /> Submit Review</>
        )}
      </button>

      <p className="text-xs text-white/25 text-center">Reviews are moderated before appearing publicly.</p>
    </form>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const loadReviews = async () => {
    try {
      const res = await fetchApprovedReviews({ perPage: 6 });

      // Laravel returns: { data: Review[], meta: {...} }
      // Handle both shapes defensively
      let extracted: Review[] = [];
      if (Array.isArray(res)) {
        extracted = res as Review[];
      } else if (res && typeof res === 'object' && 'data' in (res as object)) {
        extracted = (res as { data: Review[] }).data ?? [];
      }

      setReviews(extracted);
    } catch (err) {
      // Log so the developer can see what's failing
      console.error('[ReviewsSection] Failed to load reviews:', err);
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadReviews(); }, []);


  const handleFormSuccess = () => {
    setFormKey((k) => k + 1); // resets form fields via key change
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <section className="section-padding max-w-container-max mx-auto" aria-labelledby="reviews-section-heading">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <span className="font-label-md text-label-md text-primary uppercase tracking-widest block mb-3">
            Verified Client Reviews
          </span>
          <h2
            id="reviews-section-heading"
            className="font-headline-lg-mobile md:text-headline-lg text-on-surface font-extrabold"
          >
            What Our Clients <span className="text-gradient">Say About Us</span>
          </h2>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="shrink-0 px-6 py-3 rounded-xl border border-primary/30 bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-all flex items-center gap-2"
          aria-expanded={showForm}
          id="toggle-review-form"
        >
          <Star size={15} className="fill-primary" />
          {showForm ? 'Hide Form' : 'Leave a Review'}
        </button>
      </div>

      {/* Submit Form (collapsible) */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            key="review-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden mb-12"
          >
            <div className="glass-panel rounded-2xl p-8 border border-primary/15 max-w-2xl mx-auto">
              <h3 className="font-headline-md text-on-surface font-semibold mb-6">Share Your Experience</h3>
              <SubmitReviewForm key={formKey} onSuccess={handleFormSuccess} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-6 space-y-3 animate-pulse">
              <div className="flex gap-1">{Array.from({length:5}).map((_,j) => <div key={j} className="w-3.5 h-3.5 rounded-full bg-white/10" />)}</div>
              <div className="h-3 bg-white/8 rounded w-full" />
              <div className="h-3 bg-white/8 rounded w-5/6" />
              <div className="h-3 bg-white/8 rounded w-4/6" />
              <div className="pt-3 border-t border-white/8">
                <div className="h-3 bg-white/12 rounded w-24" />
                <div className="h-2.5 bg-white/6 rounded w-16 mt-1.5" />
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-2xl border border-white/5">
          <Star size={40} className="text-white/20 mx-auto mb-4" />
          <p className="text-on-surface-variant">No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
              className="glass-card rounded-xl p-6 flex flex-col gap-4"
            >
              {/* Stars */}
              <StarDisplay rating={review.rating} />

              {/* Comment */}
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed flex-1 italic">
                &ldquo;{review.comment}&rdquo;
              </p>

              {/* Author */}
              <div className="pt-4 border-t border-white/8 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-on-surface">{review.name}</p>
                  <p className="text-xs text-white/35 mt-0.5">{formatDate(review.created_at)}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm">
                  {review.name[0]?.toUpperCase()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* View all link */}
      {reviews.length > 0 && (
        <div className="text-center mt-10">
          <a
            href="/reviews"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
          >
            View all client reviews →
          </a>
        </div>
      )}
    </section>
  );
}
