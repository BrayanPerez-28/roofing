/**
 * services/api.js
 *
 * Centralized Axios API client for Perez Premium Roofing.
 *
 * Architecture:
 *  - This file is the ONLY file that should make HTTP requests to the backend.
 *  - All functions are async and return a Promise.
 *  - The base URL is configured via the NEXT_PUBLIC_API_URL environment variable.
 *  - For the static export, all functions are called client-side (useEffect, event handlers).
 *
 * Laravel Backend Integration:
 *  - Set NEXT_PUBLIC_API_URL=https://api.yourdomain.com in .env.local
 *  - Ensure the Laravel backend sends CORS headers for your frontend domain.
 *  - The 'Authorization' interceptor will attach the Bearer token once auth is implemented.
 *
 * Usage example:
 *  import { submitContactForm } from '@/services/api';
 *  const response = await submitContactForm({ name, email, message });
 */

import axios from 'axios';

// ─── Axios Instance ───────────────────────────────────────────────────────────

const api = axios.create({
  /**
   * Set NEXT_PUBLIC_API_URL in your .env.local file to point to a custom API host.
   * If left empty, requests will fall back to the local Laravel server.
   *
   * The /api prefix is included here so all route paths below are clean
   * and match exactly the Laravel routes/api.php definitions.
   */
  baseURL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api',

  // Default headers for all requests
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Required for Laravel to detect AJAX requests
  },

  // 10 second timeout
  timeout: 10000,
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Attaches the Bearer token from localStorage if the user is authenticated.
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('perez_auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ────────────────────────────────────────────────────
// Normalizes error responses from Laravel's validation error format.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 422) {
      // Laravel validation errors — flatten the errors object for easy UI display
      const validationErrors = error.response.data.errors || {};
      const firstError = Object.values(validationErrors).flat()[0];
      return Promise.reject(new Error(firstError || 'Validation failed.'));
    }
    if (error.response?.status === 401) {
      // Unauthorized — clear token and redirect to login if needed
      if (typeof window !== 'undefined') {
        localStorage.removeItem('perez_auth_token');
      }
    }
    return Promise.reject(error);
  }
);


// ─── Lead & Contact Functions ────────────────────────────────────────────────

/**
 * submitLead
 * @description Submits a new lead from the "Get a Free Estimate" CTA.
 * @param {Object} data - Lead data from the estimate form
 * @param {string} data.firstName
 * @param {string} data.lastName
 * @param {string} data.email
 * @param {string} data.phone
 * @param {string} data.serviceType - e.g. 'metal-roofs', 'composition-shingles'
 * @param {string} data.propertyAddress
 * @param {string} [data.notes]
 * @returns {Promise<{message: string, leadId: number}>}
 *
 * Laravel Route: POST /api/leads
 */
export const submitLead = async (data) => {
  // Laravel: POST /api/public/contact
  const response = await api.post('/public/contact', data);
  return response.data;
};

/**
 * submitContactForm
 * @description Submits the contact form from the Contact Us page.
 * @param {Object} data - Contact form data
 * @param {string} data.firstName
 * @param {string} data.lastName
 * @param {string} data.email
 * @param {string} data.inquiryType - 'commercial' | 'residential' | 'technology' | 'support'
 * @param {string} data.message
 * @returns {Promise<{message: string}>}
 *
 * Laravel Route: POST /api/contact
 */
export const submitContactForm = async (data) => {
  // Laravel: POST /api/public/contact
  const response = await api.post('/public/contact', data);
  return response.data;
};


// ─── Reviews Functions ────────────────────────────────────────────────────────

/**
 * fetchApprovedReviews
 * @description Fetches all customer reviews with status 'approved'.
 * @param {Object} [params]
 * @param {number} [params.page=1]     - Pagination page number
 * @param {number} [params.perPage=9]  - Results per page
 * @param {number} [params.minRating]  - Minimum star rating filter
 * @returns {Promise<{data: Review[], meta: PaginationMeta}>}
 *
 * Laravel Route: GET /api/reviews?status=approved&page=1&per_page=9
 */
export const fetchApprovedReviews = async (params = {}) => {
  // Laravel: GET /api/public/reviews (no auth required)
  const response = await api.get('/public/reviews', {
    params: {
      page: params.page || 1,
      per_page: params.perPage || 9,
    },
  });
  return response.data;
};

/**
 * submitReview
 * @description Allows a customer to submit a new review (pending moderation).
 * @param {Object} data
 * @param {string} data.name
 * @param {string} data.email
 * @param {number} data.rating - 1-5 star rating
 * @param {string} data.comment
 * @param {string} [data.projectType]
 * @returns {Promise<{message: string, reviewId: number}>}
 *
 * Laravel Route: POST /api/reviews
 */
export const submitReview = async (data) => {
  // Laravel: POST /api/public/reviews (no auth required)
  const response = await api.post('/public/reviews', data);
  return response.data;
};


// ─── Gallery Functions ────────────────────────────────────────────────────────

/**
 * fetchGalleryImages
 * @description Fetches project gallery images, optionally filtered by category.
 * @param {Object} [params]
 * @param {number} [params.page=1]
 * @param {number} [params.perPage=12]
 * @param {string} [params.category] - e.g. 'metal-roofs', 'residential', 'commercial'
 * @returns {Promise<{data: GalleryImage[], meta: PaginationMeta}>}
 *
 * Laravel Route: GET /api/gallery?page=1&per_page=12&category=metal-roofs
 */
export const fetchGalleryImages = async (params = {}) => {
  const response = await api.get('/api/gallery', {
    params: {
      page: params.page || 1,
      per_page: params.perPage || 12,
      ...(params.category && { category: params.category }),
    },
  });
  return response.data;
};


// ─── Services Functions ───────────────────────────────────────────────────────

/**
 * fetchServiceDetails
 * @description Fetches detailed content for a specific service page.
 * @param {string} slug - The service URL slug (e.g., 'metal-roofs')
 * @returns {Promise<ServiceDetail>}
 *
 * Laravel Route: GET /api/services/:slug
 */
export const fetchServiceDetails = async (slug) => {
  const response = await api.get(`/api/services/${slug}`);
  return response.data;
};

/**
 * fetchAllServices
 * @description Fetches a summary list of all services for the Services index page.
 * @returns {Promise<Service[]>}
 *
 * Laravel Route: GET /api/services
 */
export const fetchAllServices = async () => {
  const response = await api.get('/api/services');
  return response.data;
};


// ─── System & Testing Functions ──────────────────────────────────────────────

/**
 * pingServer
 * @description Tests the connection to the Laravel backend.
 * @returns {Promise<{status: string, message: string}>}
 *
 * Laravel Route: GET /api/ping
 */
export const pingServer = async () => {
  // Laravel: GET /api/ping
  const response = await api.get('/ping');
  return response.data;
};

// ─── Chat / AI Functions ──────────────────────────────────────────────────────

/**
 * sendChatMessage
 * @description Sends a visitor message to the AI chatbot endpoint.
 * @param {string} message - The visitor's chat message (max 1000 chars).
 * @returns {Promise<{reply: string}>} - The AI assistant's reply.
 *
 * Laravel Route: POST /api/public/chat
 */
export const sendChatMessage = async (message) => {
  const response = await api.post('/public/chat', { message });
  return response.data;
};


// ─── Export default instance (for advanced use) ───────────────────────────────
export default api;




