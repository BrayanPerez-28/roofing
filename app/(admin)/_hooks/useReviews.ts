"use client";

import { useState, useCallback } from "react";
import { reviewsApi } from "../_lib/api";
import type { Review, ReviewUpdatePayload, PaginatedResponse } from "../_lib/types";

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [meta, setMeta] = useState({ page: 1, per_page: 10, total: 0, last_page: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(
    async (params: { status?: string; per_page?: number; page?: number } = {}) => {
      setIsLoading(true);
      setError(null);
      try {
        const res: PaginatedResponse<Review> = await reviewsApi.list({
          status: "all",
          per_page: 10,
          page: 1,
          ...params,
        });
        setReviews(res.data);
        setMeta(res.meta);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to load reviews";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const update = useCallback(
    async (id: number, payload: ReviewUpdatePayload): Promise<Review> => {
      const res = await reviewsApi.update(id, payload);
      const updated = res.data as Review;
      setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
      return updated;
    },
    []
  );

  const remove = useCallback(async (id: number): Promise<void> => {
    await reviewsApi.delete(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
    setMeta((m) => ({ ...m, total: Math.max(0, m.total - 1) }));
  }, []);

  return { reviews, meta, isLoading, error, fetch, update, remove };
}
