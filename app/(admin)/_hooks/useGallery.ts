"use client";

import { useState, useCallback } from "react";
import { galleryApi } from "../_lib/api";
import type { Service, ServiceMedia } from "../_lib/types";

export function useGallery() {
  const [services, setServices] = useState<Service[]>([]);
  const [media, setMedia] = useState<ServiceMedia[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch all services ────────────────────────────────────────────────────────
  const fetchServices = useCallback(async () => {
    setIsLoadingServices(true);
    setError(null);
    try {
      const data = await galleryApi.getServices();
      setServices(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load services");
    } finally {
      setIsLoadingServices(false);
    }
  }, []);

  // ── Fetch media for a service by slug ─────────────────────────────────────────
  const fetchMedia = useCallback(async (slug: string) => {
    setIsLoadingMedia(true);
    setError(null);
    try {
      const service = await galleryApi.getGalleryByService(slug);
      setMedia(service.media ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load gallery");
      setMedia([]);
    } finally {
      setIsLoadingMedia(false);
    }
  }, []);

  // ── Upload media files ────────────────────────────────────────────────────────
  const uploadMedia = useCallback(
    async (serviceId: number, files: File[]): Promise<ServiceMedia[]> => {
      setIsUploading(true);
      setUploadProgress(0);
      try {
        const tick = setInterval(() => {
          setUploadProgress((p) => Math.min(p + 20, 80));
        }, 300);
        const uploaded = await galleryApi.uploadMedia(serviceId, files);
        clearInterval(tick);
        setUploadProgress(100);
        setMedia((prev) => [...uploaded, ...prev]);
        return uploaded;
      } finally {
        setIsUploading(false);
        setTimeout(() => setUploadProgress(0), 800);
      }
    },
    []
  );

  // ── Delete a single media item ────────────────────────────────────────────────
  const deleteMedia = useCallback(async (id: number): Promise<void> => {
    await galleryApi.deleteMedia(id);
    setMedia((prev) => prev.filter((m) => m.id !== id));
  }, []);

  // ── Service CRUD ──────────────────────────────────────────────────────────────
  const createService = useCallback(
    async (payload: { name: string; slug: string }): Promise<Service> => {
      const svc = await galleryApi.createService(payload);
      setServices((prev) => [...prev, svc]);
      return svc;
    },
    []
  );

  const updateService = useCallback(
    async (id: number, payload: { name?: string; slug?: string }): Promise<Service> => {
      const svc = await galleryApi.updateService(id, payload);
      setServices((prev) => prev.map((s) => (s.id === id ? svc : s)));
      return svc;
    },
    []
  );

  const deleteService = useCallback(async (id: number): Promise<void> => {
    await galleryApi.deleteService(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return {
    services,
    media,
    isLoadingServices,
    isLoadingMedia,
    isUploading,
    uploadProgress,
    error,
    fetchServices,
    fetchMedia,
    uploadMedia,
    deleteMedia,
    createService,
    updateService,
    deleteService,
  };
}
