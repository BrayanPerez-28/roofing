/**
 * app/gallery/page.tsx — Premium Multimedia Gallery
 *
 * Features:
 * - Video showcase section with embedded project videos
 * - Masonry image grid (122 real photos)
 * - Category filters (Residential, Commercial, Shingles, Tile, Gutters, Flat, Maintenance)
 * - Lightbox with zoom and fullscreen preview
 * - Keyboard navigation in lightbox
 * - Load More pagination
 * - Smooth entrance animations
 */

import type { Metadata } from 'next';
import GalleryClient from './GalleryClient';

export const metadata: Metadata = {
  title: 'Gallery | Perez Premium Roofing | Bay Area Project Photos',
  description:
    'Browse real roofing projects completed by Perez Premium Roofing INC across the Bay Area — composition shingles, concrete tile, metal roofs, flat roofs, gutters, and more. CSLB #1135746.',
};

export default function GalleryPage() {
  return <GalleryClient />;
}
