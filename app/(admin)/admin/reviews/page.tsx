"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useReviews } from "../../_hooks/useReviews";
import { Modal } from "../../_components/ui/Modal";
import { ConfirmDialog } from "../../_components/ui/ConfirmDialog";
import { StarRating } from "../../_components/ui/StarRating";
import { ApprovedBadge } from "../../_components/ui/Badge";
import { Button } from "../../_components/ui/Button";
import { TableSkeleton } from "../../_components/ui/Skeleton";
import { ToastContainer, useToast } from "../../_components/ui/Toast";
import type { Review, ReviewUpdatePayload } from "../../_lib/types";

// ─── Edit / View Modal ─────────────────────────────────────────────────────────
function ReviewModal({
  review,
  isOpen,
  onClose,
  onSave,
}: {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, payload: ReviewUpdatePayload) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [approved, setApproved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (review) {
      setName(review.name);
      setRating(review.rating);
      setComment(review.comment);
      setApproved(review.approved);
      setErrors({});
    }
  }, [review]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!comment.trim()) e.comment = "Review is required";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setIsSaving(true);
    try {
      await onSave(review!.id, { name: name.trim(), rating, comment: comment.trim(), approved });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Review — ${review?.name ?? ""}`}
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} isLoading={isSaving}>Save Changes</Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Name */}
        <div>
          <label className="text-sm font-medium text-white/60 block mb-1.5">Customer Name</label>
          <input
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
            className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all ${errors.name ? "border-red-500/50" : "border-white/10"}`}
            placeholder="Customer name"
          />
          {errors.name && <p className="text-xs text-red-400 mt-1">⚠ {errors.name}</p>}
        </div>

        {/* Rating */}
        <div>
          <label className="text-sm font-medium text-white/60 block mb-2">Rating</label>
          <StarRating value={rating} onChange={setRating} size="lg" />
        </div>

        {/* Comment */}
        <div>
          <label className="text-sm font-medium text-white/60 block mb-1.5">Review</label>
          <textarea
            value={comment}
            onChange={(e) => { setComment(e.target.value); setErrors((p) => ({ ...p, comment: "" })); }}
            rows={4}
            className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all ${errors.comment ? "border-red-500/50" : "border-white/10"}`}
            placeholder="Review text…"
          />
          {errors.comment && <p className="text-xs text-red-400 mt-1">⚠ {errors.comment}</p>}
        </div>

        {/* Status toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/4 border border-white/8">
          <div>
            <p className="text-sm font-medium text-white">Approval Status</p>
            <p className="text-xs text-white/40 mt-0.5">Approved reviews appear on the public site</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={approved}
            onClick={() => setApproved((a) => !a)}
            className={`relative w-12 h-6 rounded-full transition-all duration-200 ${approved ? "bg-gradient-to-r from-[#D35400] to-[#FF8C00]" : "bg-white/15"}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${approved ? "left-6" : "left-0.5"}`} />
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── View Modal ────────────────────────────────────────────────────────────────
function ViewModal({ review, isOpen, onClose }: { review: Review | null; isOpen: boolean; onClose: () => void }) {
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { dateStyle: "long" });
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Review Details" maxWidth="md">
      {review && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-white/8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-400/10 flex items-center justify-center text-orange-400 text-xl font-bold">
              {review.name[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-white">{review.name}</p>
              <StarRating value={review.rating} readonly size="sm" />
            </div>
            <ApprovedBadge approved={review.approved} />
          </div>
          <p className="text-sm text-white/80 leading-relaxed admin-prose">{review.comment}</p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="px-3 py-2 rounded-lg bg-white/4">
              <p className="text-xs text-white/40">Submitted</p>
              <p className="text-sm text-white mt-0.5">{formatDate(review.created_at)}</p>
            </div>
            <div className="px-3 py-2 rounded-lg bg-white/4">
              <p className="text-xs text-white/40">Rating</p>
              <p className="text-sm text-white mt-0.5">{review.rating} / 5 stars</p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
function ReviewsContent() {
  const searchParams = useSearchParams();
  const { reviews, meta, isLoading, fetch, update, remove } = useReviews();
  const { toasts, toast, dismissToast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [sortKey, setSortKey] = useState<keyof Review>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [viewReview, setViewReview] = useState<Review | null>(null);
  const [editReview, setEditReview] = useState<Review | null>(null);
  const [deleteReview, setDeleteReview] = useState<Review | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = useCallback(() => {
    fetch({ status: statusFilter, per_page: perPage, page });
  }, [fetch, statusFilter, perPage, page]);

  useEffect(() => { load(); }, [load]);

  const handleSort = (key: keyof Review) => {
    setSortDir((d) => (sortKey === key ? (d === "asc" ? "desc" : "asc") : "desc"));
    setSortKey(key);
  };

  const handleUpdate = async (id: number, payload: ReviewUpdatePayload) => {
    try {
      await update(id, payload);
      toast.success("Review updated successfully");
    } catch {
      toast.error("Failed to update review");
      throw new Error("update failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteReview) return;
    setIsDeleting(true);
    try {
      await remove(deleteReview.id);
      toast.success("Review deleted");
      setDeleteReview(null);
    } catch {
      toast.error("Failed to delete review");
    } finally {
      setIsDeleting(false);
    }
  };

  // Client-side search + sort
  const filtered = reviews
    .filter((r) => {
      const q = search.toLowerCase();
      return (
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const av = a[sortKey] as string | number | boolean;
      const bv = b[sortKey] as string | number | boolean;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const SortIcon = ({ k }: { k: keyof Review }) => (
    <span className={`ml-1 text-xs ${sortKey === k ? "text-orange-400" : "text-white/20"}`}>
      {sortKey === k ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );

  return (
    <div className="space-y-6 animate-[slideUpFade_0.4s_ease]">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Reviews</h2>
          <p className="text-sm text-white/40">{meta.total} total reviews</p>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card p-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/30 transition-all"
          />
        </div>

        {/* Status filter */}
        <div className="flex gap-2">
          {(["all", "approved", "pending"] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                statusFilter === s
                  ? "bg-gradient-to-r from-[#D35400] to-[#FF8C00] text-white shadow-lg shadow-orange-500/25"
                  : "bg-white/6 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table — desktop */}
      <div className="admin-card overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                {[
                  { key: "name", label: "Customer" },
                  { key: "rating", label: "Rating" },
                  { key: "comment", label: "Review" },
                  { key: "approved", label: "Status" },
                  { key: "created_at", label: "Date" },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key as keyof Review)}
                    className="cursor-pointer hover:text-white transition-colors select-none"
                  >
                    {label} <SortIcon k={key as keyof Review} />
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-0">
                    <TableSkeleton rows={5} cols={6} />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="py-16 flex flex-col items-center gap-3">
                      <div className="text-4xl">⭐</div>
                      <p className="text-sm text-white/40">No reviews found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/15 flex items-center justify-center text-orange-400 text-xs font-bold shrink-0">
                          {r.name[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium">{r.name}</span>
                      </div>
                    </td>
                    <td><StarRating value={r.rating} readonly size="sm" /></td>
                    <td>
                      <p className="max-w-xs truncate text-white/70">{r.comment}</p>
                    </td>
                    <td><ApprovedBadge approved={r.approved} /></td>
                    <td className="text-white/50 text-xs">{formatDate(r.created_at)}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setViewReview(r)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                          title="View"
                        >👁</button>
                        <button
                          onClick={() => setEditReview(r)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-orange-400 hover:bg-orange-500/10 transition-all"
                          title="Edit"
                        >✏</button>
                        <button
                          onClick={() => {
                            if (!r.approved) handleUpdate(r.id, { approved: true }).then(() => toast.success("Review approved"));
                            else handleUpdate(r.id, { approved: false }).then(() => toast.info("Review set to pending"));
                          }}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                            r.approved
                              ? "text-green-400 hover:text-yellow-400 hover:bg-yellow-500/10"
                              : "text-yellow-400 hover:text-green-400 hover:bg-green-500/10"
                          }`}
                          title={r.approved ? "Set to Pending" : "Approve"}
                        >{r.approved ? "✓" : "⏳"}</button>
                        <button
                          onClick={() => setDeleteReview(r)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Delete"
                        >🗑</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards — mobile */}
      <div className="space-y-3 md:hidden">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="admin-card p-4 space-y-3">
                <div className="admin-skeleton h-4 w-32" />
                <div className="admin-skeleton h-3 w-full" />
                <div className="admin-skeleton h-3 w-3/4" />
              </div>
            ))
          : filtered.map((r) => (
              <div key={r.id} className="admin-card p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-white text-sm">{r.name}</p>
                    <StarRating value={r.rating} readonly size="sm" />
                  </div>
                  <ApprovedBadge approved={r.approved} />
                </div>
                <p className="text-sm text-white/60 line-clamp-2">{r.comment}</p>
                <div className="flex items-center justify-between pt-1 border-t border-white/8">
                  <span className="text-xs text-white/30">{formatDate(r.created_at)}</span>
                  <div className="flex gap-1">
                    <button onClick={() => setViewReview(r)} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-blue-400 hover:bg-blue-500/10">👁</button>
                    <button onClick={() => setEditReview(r)} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-orange-400 hover:bg-orange-500/10">✏</button>
                    <button onClick={() => setDeleteReview(r)} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10">🗑</button>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Pagination */}
      {meta.last_page > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/40">
            Page {meta.page} of {meta.last_page} · {meta.total} total
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p - 1)} disabled={page <= 1}>← Prev</Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page >= meta.last_page}>Next →</Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <ViewModal review={viewReview} isOpen={!!viewReview} onClose={() => setViewReview(null)} />
      <ReviewModal review={editReview} isOpen={!!editReview} onClose={() => setEditReview(null)} onSave={handleUpdate} />
      <ConfirmDialog
        isOpen={!!deleteReview}
        onClose={() => setDeleteReview(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Review?"
        description={`This will permanently delete the review from "${deleteReview?.name}". This cannot be undone.`}
        confirmLabel="Delete Review"
      />
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <Suspense>
      <ReviewsContent />
    </Suspense>
  );
}
