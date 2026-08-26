// ─── Core API Types ────────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  name: string;
  rating: number; // 1–5
  comment: string;
  approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  inquiry_type: string | null;
  message: string;
  created_at: string;
  updated_at: string;
}

// ─── Pagination ────────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ─── API Responses ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  status: "ok" | "error";
  message: string;
  data?: T;
  user?: User;
  token?: string;
}

// ─── Form Payloads ─────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ReviewUpdatePayload {
  name?: string;
  rating?: number;
  comment?: string;
  approved?: boolean;
}

export interface ContactUpdatePayload {
  name?: string;
  email?: string;
  phone?: string | null;
  inquiryType?: string | null;
  message?: string;
}

// ─── UI State ──────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

export type SortDirection = "asc" | "desc";

export interface SortConfig {
  key: string;
  direction: SortDirection;
}
