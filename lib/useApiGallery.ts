'use client';

/**
 * lib/useApiGallery.ts
 *
 * Shared hook that fetches media from the public gallery API.
 * Used by:
 *  - ServiceDetailPage  → loads carousel images for a specific service
 *  - GalleryClient      → loads ALL services media for the full gallery page
 */

import { useState, useEffect } from 'react';
import type { GalleryItem } from '@/lib/mediaAssets';

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || 'https://api.perezroofingpro.com'
).replace(/\/+$/, '');

// Maps the service slug used in our routes → service name slug in the API
// These must match the `slug` column in the `services` table
const SLUG_MAP: Record<string, string> = {
  'composition-shingles': 'composition-shingles',
  'concrete-tile':        'concrete-tile',
  'flat-roof':            'flat-roof',
  'gutters':              'gutters',
  'metal-roofs':          'metal-roofs',
  'roof-repairs':         'roof-repairs',
  'wood-shingles':        'wood-shingles',
};

// Category mapping from slug → GalleryItem category
const SLUG_TO_CATEGORY: Record<string, GalleryItem['category']> = {
  'composition-shingles': 'shingles',
  'concrete-tile':        'tile',
  'flat-roof':            'flat',
  'gutters':              'gutters',
  'metal-roofs':          'metal',
  'roof-repairs':         'repairs',
  'wood-shingles':        'wood',
};

interface ApiMedia {
  id: number;
  service_id: number;
  file_path: string;
  media_type: 'image' | 'video';
}

interface ApiService {
  id: number;
  name: string;
  slug: string;
  media?: ApiMedia[];
}

/** Build the public CDN URL for a media file */
export function mediaUrl(filePath: string): string {
  return `${API_BASE}/storage/${filePath}`;
}

// ─── Hook: media for ONE service ─────────────────────────────────────────────

export function useServiceMedia(slug: string): {
  images: string[];
  videos: string[];
  isLoading: boolean;
} {
  const [images,    setImages]    = useState<string[]>([]);
  const [videos,    setVideos]    = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const apiSlug = SLUG_MAP[slug] ?? slug;
    setIsLoading(true);

    fetch(`${API_BASE}/api/public/gallery/${apiSlug}`)
      .then((r) => r.json())
      .then((data: ApiService) => {
        const media = (data.media ?? []).sort((a, b) => b.id - a.id); // newest first
        setImages(media.filter((m) => m.media_type === 'image').map((m) => mediaUrl(m.file_path)));
        setVideos(media.filter((m) => m.media_type === 'video').map((m) => mediaUrl(m.file_path)));
      })
      .catch(() => { setImages([]); setVideos([]); })
      .finally(() => setIsLoading(false));
  }, [slug]);

  return { images, videos, isLoading };
}

// ─── Hook: ALL services media (for gallery page) ──────────────────────────────

export function useAllServicesMedia(): {
  galleryItems: GalleryItem[];
  isLoading: boolean;
} {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/public/services`)
      .then((r) => r.json())
      .then(async (services: ApiService[] | { data: ApiService[] }) => {
        // Handle both array and {data: [...]} response shapes
        const list: ApiService[] = Array.isArray(services)
          ? services
          : (services as { data: ApiService[] }).data ?? [];

        // Fetch media for each service in parallel
        const results = await Promise.allSettled(
          list.map((svc) =>
            fetch(`${API_BASE}/api/public/gallery/${svc.slug}`)
              .then((r) => r.json() as Promise<ApiService>)
          )
        );

        const items: GalleryItem[] = [];
        results.forEach((result) => {
          if (result.status !== 'fulfilled') return;
          const svc = result.value;
          const category = SLUG_TO_CATEGORY[svc.slug] ?? 'shingles';
          const media = (svc.media ?? []).sort((a, b) => b.id - a.id); // newest first
          media.forEach((m) => {
            if (m.media_type === 'image') {
              items.push({
                src: mediaUrl(m.file_path),
                alt: `${svc.name} project photo`,
                category,
              });
            }
          });
        });

        setGalleryItems(items);
      })
      .catch(() => setGalleryItems([]))
      .finally(() => setIsLoading(false));
  }, []);

  return { galleryItems, isLoading };
}
