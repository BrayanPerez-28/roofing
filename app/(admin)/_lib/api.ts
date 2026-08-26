import axios from "axios";
import { getToken, clearAuth } from "./auth";
import type {
  ApiResponse,
  PaginatedResponse,
  Review,
  Contact,
  LoginPayload,
  ReviewUpdatePayload,
  ContactUpdatePayload,
} from "./types";

// ─── Axios Instance ─────────────────────────────────────────────────────────────

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://api.perezroofingpro.com"
).replace(/\/+$/, "");

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

// ─── Request Interceptor — attach Bearer token ──────────────────────────────────

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response Interceptor — handle 401 globally ────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth Endpoints ─────────────────────────────────────────────────────────────

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<ApiResponse>("/auth/login", payload).then((r) => r.data),

  logout: () =>
    api.post<ApiResponse>("/admin/logout").then((r) => r.data),

  me: () =>
    api.get<ApiResponse>("/admin/user").then((r) => r.data),
};

// ─── Reviews Endpoints ──────────────────────────────────────────────────────────

export const reviewsApi = {
  list: (params: { status?: string; per_page?: number; page?: number } = {}) =>
    api
      .get<PaginatedResponse<Review>>("/admin/reviews", { params })
      .then((r) => r.data),

  get: (id: number) =>
    api.get<{ data: Review }>(`/admin/reviews/${id}`).then((r) => r.data),

  update: (id: number, payload: ReviewUpdatePayload) =>
    api
      .patch<ApiResponse<Review>>(`/admin/reviews/${id}`, payload)
      .then((r) => r.data),

  delete: (id: number) =>
    api.delete<ApiResponse>(`/admin/reviews/${id}`).then((r) => r.data),
};

// ─── Contacts Endpoints ─────────────────────────────────────────────────────────

export const contactsApi = {
  list: (params: { per_page?: number; page?: number } = {}) =>
    api
      .get<PaginatedResponse<Contact>>("/admin/contacts", { params })
      .then((r) => r.data),

  get: (id: number) =>
    api.get<{ data: Contact }>(`/admin/contacts/${id}`).then((r) => r.data),

  update: (id: number, payload: ContactUpdatePayload) =>
    api
      .patch<ApiResponse<Contact>>(`/admin/contacts/${id}`, payload)
      .then((r) => r.data),

  delete: (id: number) =>
    api.delete<ApiResponse>(`/admin/contacts/${id}`).then((r) => r.data),
};

export default api;
