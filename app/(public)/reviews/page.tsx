'use client';

/**
 * app/(public)/reviews/page.tsx — Customer Reviews
 *
 * Full-page reviews experience:
 *  - Hero header with real average rating stat
 *  - Reviews grid (paginated, fetched from API)
 *  - Inline "Leave a Review" form
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Loader2, Send, CheckCircle } from 'lucide-react';
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

interface Meta {
  page: number;
  per_page: number;
  total: number;
  last_page: number;
}

// ─── Star Display ─────────────────────────────────────────────────────────────

function StarDisplay({ rating, size = 15 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5`}>
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

// ─── Star Picker ──────────────────────────────────────────────────────────────

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
              size={30}
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
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [rating, setRating]   = useState(0);
  const [comment, setComment] = useState('');
  const [state, setState]     = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError]     = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating)        { setError('Please select a star rating.'); return; }
    if (!name.trim())   { setError('Please enter your name.'); return; }
    if (!comment.trim()) { setError('Please write a short comment.'); return; }
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

  const inputClass =
    'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-white/30 text-white';
  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
  };

  if (state === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 py-10 text-center"
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(183,196,255,0.1)', border: '2px solid rgba(183,196,255,0.3)' }}
        >
          <CheckCircle size={32} style={{ color: '#b7c4ff' }} />
        </div>
        <p className="text-lg font-semibold text-on-surface" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Thank you for your review!
        </p>
        <p className="text-sm text-on-surface-variant max-w-xs">
          Your review is pending approval and will appear here shortly.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Star picker */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Your Rating *
        </label>
        <StarPicker value={rating} onChange={(v) => { setRating(v); setError(''); }} />
      </div>

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium uppercase tracking-widest block mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Smith"
            className={inputClass}
            style={inputStyle}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(183,196,255,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onBlur={(e) =>  { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-widest block mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Email <span style={{ color: 'rgba(255,255,255,0.25)' }}>(optional)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            className={inputClass}
            style={inputStyle}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(183,196,255,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onBlur={(e) =>  { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
          />
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="text-xs font-medium uppercase tracking-widest block mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Your Review *
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Share your experience with Perez Premium Roofing…"
          className={`${inputClass} resize-none`}
          style={inputStyle}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(183,196,255,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
          onBlur={(e) =>  { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
          required
        />
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs flex items-center gap-1.5"
            style={{ color: '#ffb4ab' }}
          >
            <span>⚠</span> {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Submit */}
      <button
        type="submit"
        disabled={state === 'loading'}
        className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: 'linear-gradient(135deg, #b7c4ff 0%, #0555f7 100%)',
          color: '#1b2b68',
          fontFamily: 'Montserrat, sans-serif',
          boxShadow: '0 0 20px rgba(183,196,255,0.25)',
        }}
      >
        {state === 'loading' ? (
          <><Loader2 size={16} className="animate-spin" /> Submitting…</>
        ) : (
          <><Send size={15} /> Submit Review</>
        )}
      </button>

      <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.2)' }}>
        Reviews are moderated before appearing publicly.
      </p>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReviewsPage() {
  const [reviews, setReviews]   = useState<Review[]>([]);
  const [meta, setMeta]         = useState<Meta>({ page: 1, per_page: 9, total: 0, last_page: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage]         = useState(1);
  const [formKey, setFormKey]   = useState(0);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async (p: number) => {
    setIsLoading(true);
    try {
      const res = await fetchApprovedReviews({ perPage: 9, page: p });
      const data = Array.isArray(res) ? { data: [], meta } : (res as { data: Review[]; meta: Meta });
      setReviews(data.data ?? []);
      if (data.meta) setMeta(data.meta);
    } catch {
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { load(page); }, [load, page]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Compute real avg rating from current page
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative section-padding max-w-container-max mx-auto text-center"
        aria-labelledby="reviews-page-heading"
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(11,30,91,0.35) 0%, transparent 70%)',
          }}
        />

        <span
          className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-5"
          style={{
            background: 'rgba(183,196,255,0.08)',
            border: '1px solid rgba(183,196,255,0.2)',
            color: '#b7c4ff',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          Verified Client Reviews
        </span>

        <h1
          id="reviews-page-heading"
          className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-gradient mb-4"
        >
          What Our Clients Say
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto mb-8">
          Real reviews from homeowners and commercial clients across the Bay Area.
        </p>

        {/* Live stats row */}
        {meta.total > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              {avgRating && (
                <span className="font-bold text-on-surface text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {avgRating}
                </span>
              )}
            </div>
            <span
              className="h-5 w-px hidden sm:block"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            />
            <span className="text-sm text-on-surface-variant">
              <strong className="text-on-surface">{meta.total}</strong> verified reviews
            </span>
          </div>
        )}

        {/* Leave a Review CTA */}
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{
            background: showForm ? 'rgba(183,196,255,0.12)' : 'rgba(183,196,255,0.08)',
            border: '1px solid rgba(183,196,255,0.25)',
            color: '#b7c4ff',
            fontFamily: 'Montserrat, sans-serif',
          }}
          aria-expanded={showForm}
          id="toggle-review-form"
        >
          <Star size={14} className="fill-primary" />
          {showForm ? 'Hide form' : 'Leave a Review'}
        </button>
      </section>

      {/* ── Submit Form (collapsible) ── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            key="review-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="max-w-2xl mx-auto px-6 pb-12">
              <div
                className="rounded-2xl p-8"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(183,196,255,0.12)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                <h2
                  className="text-lg font-semibold text-on-surface mb-6"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Share Your Experience
                </h2>
                <SubmitReviewForm
                  key={formKey}
                  onSuccess={() => { setFormKey((k) => k + 1); load(1); }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Reviews Grid ── */}
      <section className="section-padding max-w-container-max mx-auto pt-0" aria-label="Reviews grid">
        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 size={36} className="text-primary animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div
            className="text-center py-20 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <Star size={48} className="text-white/20 mx-auto mb-4" />
            <p className="text-on-surface-variant text-lg">No reviews yet.</p>
            <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Be the first to share your experience!
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Showing {reviews.length} of {meta.total} verified reviews
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="flex flex-col gap-4 rounded-2xl p-6 transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(12px)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(183,196,255,0.2)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Stars */}
                  <StarDisplay rating={review.rating} />

                  {/* Comment */}
                  <p className="text-sm text-on-surface-variant leading-relaxed flex-1 italic">
                    &ldquo;{review.comment}&rdquo;
                  </p>

                  {/* Author */}
                  <div
                    className="flex items-center gap-3 pt-4"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #0b1e5b 0%, #1b2b68 100%)',
                        border: '1px solid rgba(183,196,255,0.2)',
                        color: '#b7c4ff',
                        fontFamily: 'Montserrat, sans-serif',
                      }}
                    >
                      {review.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{review.name}</p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        {formatDate(review.created_at)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {meta.last_page > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page <= 1}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#e5e2e1',
                  }}
                >
                  ← Prev
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: meta.last_page }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className="w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200"
                      style={{
                        background: page === i + 1 ? 'rgba(183,196,255,0.15)' : 'transparent',
                        border: page === i + 1 ? '1px solid rgba(183,196,255,0.4)' : '1px solid transparent',
                        color: page === i + 1 ? '#b7c4ff' : 'rgba(255,255,255,0.4)',
                        fontFamily: 'Montserrat, sans-serif',
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= meta.last_page}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#e5e2e1',
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
