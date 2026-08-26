/**
 * lib/mediaAssets.ts
 *
 * Centralized registry of all multimedia assets.
 * 122 images + 3 videos categorized by service / page use.
 * All paths are relative to /public — use as src directly.
 *
 * Folder structure under /public/multimedia/img/:
 *   Composition Shingles/
 *   Concrete Tile/
 *   Flat Roof PVC and TPO/
 *   Gutters and Downspouts/
 *   Roof Repairs/
 *   Standing Seam Metal Roofs/
 *   Wood Shingle/
 */

// ─── Videos ──────────────────────────────────────────────────────────────────

export const VIDEOS = {
  /** 4K aerial roofing footage — Hero background */
  hero: '/multimedia/video/2675565-uhd_4096_2160_24fps.mp4',
  /** Real job-site footage — Services / Flat Roof hero */
  services: '/multimedia/video/IMG_6888.mp4',
  /** Short work clip — Maintenance / Repairs sections */
  maintenance: '/multimedia/video/Video-de-WhatsApp-2025-06-16-a-las-11.12.39_9c76d642.mp4',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build a URL for an image inside a named service subfolder */
const img = (folder: string, name: string) =>
  `/multimedia/img/${encodeURIComponent(folder)}/${encodeURIComponent(name)}`;

// Folder aliases for readability
const CS = 'Composition Shingles';
const CT = 'Concrete Tile';
const FP = 'Flat Roof PVC and TPO';
const GD = 'Gutters and Downspouts';
const RR = 'Roof Repairs';
const SM = 'Standing Seam Metal Roofs';
const WS = 'Wood Shingle';

// ─── Gallery — ALL real project photos ───────────────────────────────────────

/** Every image sorted into labelled gallery items */
export interface GalleryItem {
  src: string;
  alt: string;
  category: 'residential' | 'commercial' | 'shingles' | 'tile' | 'gutters' | 'flat' | 'maintenance' | 'before-after';
  thumb?: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  // ── Composition Shingles ──
  { src: img(CS, 'roof.jpeg'), alt: 'Composition shingle roof installation', category: 'shingles' },
  { src: img(CS, 'roof2.jpeg'), alt: 'Asphalt shingle roofing project', category: 'shingles' },
  { src: img(CS, 'roof3.jpeg'), alt: 'New composition roof Bay Area', category: 'shingles' },
  { src: img(FP, 'roof4.jpeg'), alt: 'Residential shingle installation', category: 'flat' },
  { src: img(FP, 'roof6 (1).jpeg'), alt: 'Flat roof PVC section', category: 'flat' },
  { src: img(CS, 'roof6 (2).jpeg'), alt: 'Roof shingles close-up', category: 'shingles' },
  { src: img(CS, 'roof7.jpeg'), alt: 'Complete shingle roof replacement', category: 'shingles' },
  { src: img(CS, 'iStock_1025187342-scaled.jpg.optimal (1).jpg'), alt: 'Flat roof system', category: 'flat' },
  { src: img(CS, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.31_19c5ea0a.jpg'), alt: 'Complete roof replacement', category: 'shingles' },
  { src: img(CS, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.32_feb5fe3e.jpg'), alt: 'New roof installation', category: 'shingles' },
  { src: img(CS, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.47_dbcfff48.jpg'), alt: 'New shingle roof Bay Area', category: 'shingles' },
  { src: img(CS, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.49_04f9e453-2.jpg'), alt: 'Roof replacement project', category: 'shingles' },
  { src: img(CS, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.53_8ee98947-1.jpg'), alt: 'Bay Area roof install', category: 'residential' },
  { src: img(CS, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.53_8f7d24cf-1 (1).jpg'), alt: 'Residential roofing project', category: 'residential' },
  { src: img(CS, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.53_8f7d24cf-1 (2).jpg'), alt: 'Residential roofing project 2', category: 'residential' },
  { src: img(CS, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.53_8f7d24cf-1.jpg'), alt: 'Roof installation Bay Area', category: 'residential' },
  { src: img(CS, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.54_b6494ea9.jpg'), alt: 'Premium residential roof', category: 'residential' },
  { src: img(CS, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.55_8edd29c1 (1).jpg'), alt: 'Roofing project', category: 'residential' },
  { src: img(CS, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.55_8edd29c1.jpg'), alt: 'Residential roofing', category: 'shingles' },
  { src: img(CS, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.55_dbef9dad (1).jpg'), alt: 'Roof installation', category: 'shingles' },
  { src: img(CS, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.55_dbef9dad.jpg'), alt: 'New shingle roof', category: 'shingles' },
  { src: img(CS, 'WhatsApp Image 2026-07-07 at 9.59.18 PM (1).jpeg'), alt: 'New roof installation', category: 'shingles' },
  { src: img(CS, 'WhatsApp Image 2026-07-07 at 9.59.18 PM.jpeg'), alt: 'Roof project completed', category: 'shingles' },
  { src: img(CS, 'WhatsApp Image 2026-07-07 at 9.59.20 PM.jpeg'), alt: 'Roofing project', category: 'shingles' },
  { src: img(CS, 'WhatsApp Image 2026-07-07 at 9.59.23 PM (1).jpeg'), alt: 'New roof installation', category: 'shingles' },
  { src: img(CS, 'WhatsApp Image 2026-07-07 at 9.59.24 PM (4).jpeg'), alt: 'Residential roof project', category: 'shingles' },

  // ── Concrete Tile ──
  { src: img(CT, 'High_Barrel_HERO-1024x623-1 - Copy.png'), alt: 'High barrel concrete tile roof', category: 'tile' },
  { src: img(CT, 'homeguide-concrete-tile-roof-installation_sgbfeh - Copy - Copy.avif'), alt: 'Concrete tile installation', category: 'tile' },
  { src: img(CT, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.33_1386d0e9.jpg'), alt: 'Roof project completed', category: 'residential' },
  { src: img(CT, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.35_1e0245a7.jpg'), alt: 'Residential roofing', category: 'tile' },
  { src: img(CT, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.35_8828198a-1.jpg'), alt: 'Tile roof project', category: 'tile' },
  { src: img(CT, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.35_8828198a.jpg'), alt: 'Tile roof project variant', category: 'tile' },
  { src: img(CT, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.35_a59f6ab1.jpg'), alt: 'Concrete tile roofing', category: 'tile' },
  { src: img(CT, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.36_4539d4f0.jpg'), alt: 'Roof installation detail', category: 'shingles' },
  { src: img(CT, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.44_7cfc151a.jpg'), alt: 'Roofing project completed', category: 'tile' },
  { src: img(CT, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.36_4539d4f0.jpg'), alt: 'Tile roof installation detail', category: 'tile' },
  { src: img(SM, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.44_e66c14cb.jpg'), alt: 'Roof tile project', category: 'tile' },
  { src: img(CT, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.55_1b6f4879-1.jpg'), alt: 'Tile roof replacement', category: 'tile' },
  { src: img(CT, 'WhatsApp Image 2026-07-07 at 9.59.20 PM (2).jpeg'), alt: 'Tile roof installation', category: 'tile' },
  { src: img(CT, 'WhatsApp Image 2026-07-07 at 9.59.21 PM (3).jpeg'), alt: 'New roof installation', category: 'tile' },
  { src: img(CT, 'WhatsApp Image 2026-07-07 at 9.59.23 PM (3).jpeg'), alt: 'Bay Area roof project', category: 'tile' },

  // ── Wood Shingle ──
  { src: img(WS, 'CEDAR-SHINGLES-ROOF.-585292078 - Copy.jpeg'), alt: 'Cedar shingle roof', category: 'shingles' },
  { src: img(WS, 'What-is-a-Cedar-Shake-Roof- - Copy.jpg'), alt: 'Cedar shake roof', category: 'shingles' },
  { src: img(WS, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.29_fa840603-2.jpg'), alt: 'Roofing project Bay Area', category: 'residential' },
  { src: img(WS, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.30_091a5253-1.jpg'), alt: 'Roof installation project', category: 'residential' },
  { src: img(WS, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.30_be35797d.jpg'), alt: 'Bay Area roof project', category: 'residential' },
  { src: img(WS, 'WhatsApp Image 2026-07-07 at 9.59.16 PM.jpeg'), alt: 'Recent roof project 2026', category: 'residential' },

  // ── Flat Roof PVC and TPO ──
  { src: img(FP, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.38_1732dc53.jpg'), alt: 'Flat roof system install', category: 'flat' },
  { src: img(FP, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.38_87f3032b-1.jpg'), alt: 'PVC flat roof project', category: 'flat' },
  { src: img(FP, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.38_f3cfe290-1.jpg'), alt: 'Flat roof membrane', category: 'flat' },
  { src: img(FP, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.53_2677088a-1.jpg'), alt: 'Roofing project complete', category: 'residential' },
  { src: img(FP, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.54_0c96fcc3-1.jpg'), alt: 'Commercial flat roof', category: 'commercial' },
  { src: img(FP, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.54_157b8369.jpg'), alt: 'Roofing work Bay Area', category: 'residential' },
  { src: img(CS, 'WhatsApp Image 2026-07-07 at 9.59.19 PM (2).jpeg'), alt: 'Flat roof commercial', category: 'flat' },
  { src: img(CS, 'WhatsApp Image 2026-07-07 at 9.59.22 PM (3).jpeg'), alt: 'Flat roof TPO system', category: 'flat' },

  // ── Gutters and Downspouts ──
  { src: img(GD, 'Gutters-44.jpg'), alt: 'Gutter installation project', category: 'gutters' },
  { src: img(GD, 'gutter-installation - Copy.jpg'), alt: 'Gutter downspout installation', category: 'gutters' },
  { src: img(GD, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.40_ff5ec20b.jpg'), alt: 'Gutter installation', category: 'gutters' },
  { src: img(GD, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.50_03c3cf43.jpg'), alt: 'Gutters and downspouts', category: 'gutters' },
  { src: img(GD, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.50_41b7a5c8.jpg'), alt: 'Gutter system install', category: 'gutters' },
  { src: img(GD, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.50_8879f4cd.jpg'), alt: 'Seamless gutters', category: 'gutters' },
  { src: img(GD, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.50_fbe8a864.jpg'), alt: 'Gutter installation job', category: 'gutters' },
  { src: img(GD, 'WhatsApp Image 2026-07-07 at 9.59.25 PM (3).jpeg'), alt: 'Gutter installation', category: 'gutters' },
  { src: img(GD, 'WhatsApp Image 2026-07-07 at 9.59.25 PM (4).jpeg'), alt: 'Seamless gutter system', category: 'gutters' },

  // ── Standing Seam Metal Roofs ──
  { src: img(SM, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.43_0a034a7c.jpg'), alt: 'Metal roof installation', category: 'residential' },
  { src: img(SM, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.43_9b5073ea.jpg'), alt: 'Standing seam metal roof', category: 'residential' },
  { src: img(SM, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.43_bb5e607b.jpg'), alt: 'Metal roofing project', category: 'residential' },
  { src: img(CS, 'WhatsApp Image 2026-07-07 at 9.59.17 PM (1).jpeg'), alt: 'Bay Area roofing 2026', category: 'residential' },
  { src: img(CS, 'WhatsApp Image 2026-07-07 at 9.59.21 PM.jpeg'), alt: 'Roofing project 2026', category: 'residential' },
  { src: img(CS, 'WhatsApp Image 2026-07-07 at 9.59.21 PM (1).jpeg'), alt: 'Bay Area roofing crew', category: 'residential' },
  { src: img(CS, 'WhatsApp Image 2026-07-07 at 9.59.21 PM (2).jpeg'), alt: 'Roof replacement project', category: 'residential' },
  { src: img(CS, 'WhatsApp Image 2026-07-07 at 9.59.21 PM (4).jpeg'), alt: 'Roofing work in progress', category: 'residential' },
  { src: img(CS, 'WhatsApp Image 2026-07-07 at 9.59.22 PM (2).jpeg'), alt: 'Roofing installation', category: 'residential' },

  // ── Roof Repairs ──
  { src: img(RR, 'IN-Roof-Repair-and-Roof-Replacement - Copy - Copy.jpg'), alt: 'Roof repair and replacement', category: 'before-after' },
  { src: img(RR, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.27_897877f0.jpg'), alt: 'Concrete tile roofing project', category: 'tile' },
  { src: img(RR, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.30_62bcc177.jpg'), alt: 'Premium roofing work', category: 'before-after' },
  { src: img(RR, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.30_8c2fdd4c.jpg'), alt: 'Residential roof project', category: 'residential' },
  { src: img(RR, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.32_41cd3e5b.jpg'), alt: 'Roofing crew at work', category: 'residential' },
  { src: img(RR, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.36_7b922921.jpg'), alt: 'Bay Area roofing project', category: 'residential' },
  { src: img(RR, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.36_e50a0081.jpg'), alt: 'Premium roof installation', category: 'residential' },
  { src: img(RR, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.39_31fde525.jpg'), alt: 'Roofing work in progress', category: 'before-after' },
  { src: img(RR, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.39_3e7cacbb.jpg'), alt: 'Roof repair project', category: 'maintenance' },
  { src: img(RR, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.39_7cdf9241.jpg'), alt: 'Roof restoration', category: 'maintenance' },
  { src: img(RR, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.42_ce5b3a92.jpg'), alt: 'Commercial roof project', category: 'commercial' },
  { src: img(RR, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.42_e21dfc8e.jpg'), alt: 'Commercial roofing Bay Area', category: 'commercial' },
  { src: img(RR, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.45_46258076.jpg'), alt: 'Premium roof installation', category: 'residential' },
  { src: img(RR, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.47_a911a20c.jpg'), alt: 'Roofing crew Bay Area', category: 'residential' },
  { src: img(RR, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.48_02cfda82-1.jpg'), alt: 'Residential project', category: 'residential' },
  { src: img(RR, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.48_489cbd2e.jpg'), alt: 'Roofing project detail', category: 'residential' },
  { src: img(RR, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.48_c63aa36e.jpg'), alt: 'Premium roofing system', category: 'residential' },
  { src: img(RR, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.55_6b838d67-1.jpg'), alt: 'Roof project Bay Area', category: 'residential' },
  { src: img(RR, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.56_6c3ae428 - Copy.jpg'), alt: 'Roofing project', category: 'residential' },
  { src: img(RR, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.56_6c3ae428.jpg'), alt: 'Bay Area roofing', category: 'residential' },
  { src: img(RR, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.56_b0387241.jpg'), alt: 'Residential roof work', category: 'residential' },
  { src: img(RR, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.56_c2a3806b-1.jpg'), alt: 'Premium roof project', category: 'residential' },
  { src: img(RR, 'WhatsApp Image 2026-07-07 at 9.59.18 PM (3).jpeg'), alt: 'Residential roof project', category: 'residential' },
  { src: img(RR, 'WhatsApp Image 2026-07-07 at 9.59.18 PM (4).jpeg'), alt: 'Premium roofing work', category: 'residential' },
  { src: img(RR, 'WhatsApp Image 2026-07-07 at 9.59.19 PM (1).jpeg'), alt: 'Commercial roofing', category: 'commercial' },
  { src: img(RR, 'WhatsApp Image 2026-07-07 at 9.59.19 PM (3).jpeg'), alt: 'Roofing project detail', category: 'residential' },
  { src: img(RR, 'WhatsApp Image 2026-07-07 at 9.59.20 PM (1).jpeg'), alt: 'New roof Bay Area', category: 'residential' },
  { src: img(RR, 'WhatsApp Image 2026-07-07 at 9.59.20 PM (3).jpeg'), alt: 'Residential roofing 2026', category: 'residential' },
  { src: img(RR, 'WhatsApp Image 2026-07-07 at 9.59.20 PM (4).jpeg'), alt: 'Premium roof project', category: 'residential' },
  { src: img(RR, 'WhatsApp Image 2026-07-07 at 9.59.22 PM (1).jpeg'), alt: 'Commercial roof project', category: 'commercial' },
  { src: img(RR, 'WhatsApp Image 2026-07-07 at 9.59.22 PM (4).jpeg'), alt: 'Roof project Bay Area', category: 'residential' },
  { src: img(RR, 'WhatsApp Image 2026-07-07 at 9.59.22 PM (5).jpeg'), alt: 'Premium roofing', category: 'residential' },
  { src: img(RR, 'WhatsApp Image 2026-07-07 at 9.59.22 PM.jpeg'), alt: 'Roofing crew at work', category: 'residential' },
  { src: img(RR, 'WhatsApp Image 2026-07-07 at 9.59.23 PM (2).jpeg'), alt: 'Residential roofing', category: 'residential' },
  { src: img(RR, 'WhatsApp Image 2026-07-07 at 9.59.23 PM (4).jpeg'), alt: 'Roofing project complete', category: 'residential' },
  { src: img(RR, 'WhatsApp Image 2026-07-07 at 9.59.23 PM (5).jpeg'), alt: 'Premium roof work', category: 'residential' },
  { src: img(RR, 'WhatsApp Image 2026-07-07 at 9.59.23 PM.jpeg'), alt: 'Roofing installation', category: 'residential' },
  { src: img(RR, 'WhatsApp Image 2026-07-07 at 9.59.24 PM (1).jpeg'), alt: 'Bay Area roofing project', category: 'residential' },
  { src: img(RR, 'WhatsApp Image 2026-07-07 at 9.59.24 PM (3).jpeg'), alt: 'Roof replacement', category: 'residential' },
  { src: img(RR, 'WhatsApp Image 2026-07-07 at 9.59.24 PM (5).jpeg'), alt: 'New roof installation', category: 'residential' },
  { src: img(RR, 'WhatsApp Image 2026-07-07 at 9.59.24 PM (6).jpeg'), alt: 'Roofing crew Bay Area', category: 'residential' },
  { src: img(RR, 'WhatsApp Image 2026-07-07 at 9.59.24 PM.jpeg'), alt: 'Roofing project', category: 'residential' },
  { src: img(RR, 'WhatsApp Image 2026-07-07 at 9.59.25 PM (1).jpeg'), alt: 'Maintenance project', category: 'maintenance' },
  { src: img(RR, 'WhatsApp Image 2026-07-07 at 9.59.25 PM (2).jpeg'), alt: 'Roof repair Bay Area', category: 'maintenance' },
  { src: img(RR, 'WhatsApp Image 2026-07-07 at 9.59.25 PM.jpeg'), alt: 'Premium roofing project', category: 'residential' },
  { src: img(RR, 'WhatsApp Image 2026-07-07 at 9.59.26 PM (1).jpeg'), alt: 'Commercial roof install', category: 'commercial' },
  { src: img(RR, 'WhatsApp Image 2026-07-07 at 9.59.26 PM (2).jpeg'), alt: 'Bay Area commercial roof', category: 'commercial' },
  { src: img(RR, 'WhatsApp Image 2026-07-07 at 9.59.26 PM (3).jpeg'), alt: 'Roofing project 2026', category: 'residential' },
  { src: img(RR, 'WhatsApp Image 2026-07-07 at 9.59.26 PM (4).jpeg'), alt: 'Premium roof installation', category: 'residential' },
];

// ─── Service-specific image sets ─────────────────────────────────────────────

export const SERVICE_IMAGES: Record<string, string[]> = {
  'composition-shingles': [
    img(CS, 'roof.jpeg'),
    img(CS, 'roof2.jpeg'),
    img(CS, 'roof3.jpeg'),
    img(CS, 'roof4.jpeg'),
    img(CS, 'roof6 (1).jpeg'),
    img(CS, 'roof6 (2).jpeg'),
    img(CS, 'roof7.jpeg'),
    img(CS, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.31_19c5ea0a.jpg'),
    img(CS, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.32_feb5fe3e.jpg'),
    img(CS, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.47_dbcfff48.jpg'),
    img(CS, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.49_04f9e453-2.jpg'),
    img(CS, 'WhatsApp Image 2026-07-07 at 9.59.18 PM (1).jpeg'),
    img(CS, 'WhatsApp Image 2026-07-07 at 9.59.18 PM.jpeg'),
    img(CS, 'WhatsApp Image 2026-07-07 at 9.59.20 PM.jpeg'),
    img(CS, 'WhatsApp Image 2026-07-07 at 9.59.23 PM (1).jpeg'),
    img(CS, 'WhatsApp Image 2026-07-07 at 9.59.24 PM (4).jpeg'),
  ],
  'concrete-tile': [
    img(CT, 'High_Barrel_HERO-1024x623-1 - Copy.png'),
    img(CT, 'homeguide-concrete-tile-roof-installation_sgbfeh - Copy - Copy.avif'),
    img(CT, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.35_1e0245a7.jpg'),
    img(CT, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.35_8828198a-1.jpg'),
    img(CT, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.35_a59f6ab1.jpg'),
    img(CT, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.44_7cfc151a.jpg'),
    img(SM, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.44_e66c14cb.jpg'),
    img(CT, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.55_1b6f4879-1.jpg'),
    img(CT, 'WhatsApp Image 2026-07-07 at 9.59.20 PM (2).jpeg'),
    img(CT, 'WhatsApp Image 2026-07-07 at 9.59.21 PM (3).jpeg'),
    img(CT, 'WhatsApp Image 2026-07-07 at 9.59.23 PM (3).jpeg'),
  ],
  'wood-shingles': [
    img(WS, 'CEDAR-SHINGLES-ROOF.-585292078 - Copy.jpeg'),
    img(WS, 'What-is-a-Cedar-Shake-Roof- - Copy.jpg'),
    img(WS, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.29_fa840603-2.jpg'),
    img(WS, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.30_091a5253-1.jpg'),
    img(WS, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.30_be35797d.jpg'),
    img(WS, 'WhatsApp Image 2026-07-07 at 9.59.16 PM.jpeg'),
  ],
  'flat-roof': [
    img(CS, 'iStock_1025187342-scaled.jpg.optimal (1).jpg'),
    img(FP, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.38_1732dc53.jpg'),
    img(FP, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.38_87f3032b-1.jpg'),
    img(FP, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.38_f3cfe290-1.jpg'),
    img(CS, 'WhatsApp Image 2026-07-07 at 9.59.19 PM (2).jpeg'),
    img(CS, 'WhatsApp Image 2026-07-07 at 9.59.22 PM (3).jpeg'),
    img(FP, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.54_0c96fcc3-1.jpg'),
  ],
  'metal-roofs': [
    img(SM, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.43_0a034a7c.jpg'),
    img(SM, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.43_9b5073ea.jpg'),
    img(SM, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.43_bb5e607b.jpg'),
    img(CS, 'WhatsApp Image 2026-07-07 at 9.59.21 PM.jpeg'),
    img(CS, 'WhatsApp Image 2026-07-07 at 9.59.22 PM (2).jpeg'),
    img(CS, 'WhatsApp Image 2026-07-07 at 9.59.17 PM (1).jpeg'),
    img(CS, 'WhatsApp Image 2026-07-07 at 9.59.21 PM (4).jpeg'),
  ],
  'gutters': [
    img(GD, 'Gutters-44.jpg'),
    img(GD, 'gutter-installation - Copy.jpg'),
    img(GD, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.40_ff5ec20b.jpg'),
    img(GD, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.50_03c3cf43.jpg'),
    img(GD, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.50_41b7a5c8.jpg'),
    img(GD, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.50_8879f4cd.jpg'),
    img(GD, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.50_fbe8a864.jpg'),
    img(GD, 'WhatsApp Image 2026-07-07 at 9.59.25 PM (3).jpeg'),
    img(GD, 'WhatsApp Image 2026-07-07 at 9.59.25 PM (4).jpeg'),
  ],
  'roof-repairs': [
    img(RR, 'IN-Roof-Repair-and-Roof-Replacement - Copy - Copy.jpg'),
    img(RR, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.39_31fde525.jpg'),
    img(RR, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.39_3e7cacbb.jpg'),
    img(RR, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.39_7cdf9241.jpg'),
    img(RR, 'WhatsApp Image 2026-07-07 at 9.59.25 PM (1).jpeg'),
    img(RR, 'WhatsApp Image 2026-07-07 at 9.59.25 PM (2).jpeg'),
    img(RR, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.30_62bcc177.jpg'),
    img(RR, 'WhatsApp Image 2026-07-07 at 9.59.18 PM (3).jpeg'),
  ],
};

/**
 * Featured images for the homepage "Featured Projects" carousel.
 * One representative image per service category — order matches PROJECTS in ProjectCarousel.tsx:
 * [0] Concrete Tile Replacement
 * [1] Composition Shingles
 * [2] Commercial Flat Roof
 * [3] Metal Roof Installation
 * [4] Wood Shake Roofing
 * [5] Gutter Installation
 * [6] Roof Repairs
 * [7] Complete Reroof
 */
export const FEATURED_PROJECT_IMAGES = [
  img(CT, 'High_Barrel_HERO-1024x623-1 - Copy.png'),                                   // [0] Concrete Tile
  img(CS, 'roof7.jpeg'),                                                                 // [1] Composition Shingles
  img(FP, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.54_0c96fcc3-1.jpg'),              // [2] Commercial Flat Roof
  img(SM, 'metal-roof.jpg'),                         // [3] Metal Roof
  img(WS, 'CEDAR-SHINGLES-ROOF.-585292078 - Copy.jpeg'),                               // [4] Wood Shake
  img(GD, 'Gutters-44.jpg'),                                                            // [5] Gutters
  img(RR, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.39_31fde525.jpg'),               // [6] Roof Repairs
  img(CS, 'Imagen-de-WhatsApp-2025-06-15-a-las-16.57.53_8ee98947-1.jpg'),              // [7] Complete Reroof
];
