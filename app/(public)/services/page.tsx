/**
 * app/services/page.tsx — Services Overview Page
 *
 * Migrated from our_services/code.html.
 * Sections:
 *   1. Hero — radial glow, headline
 *   2. Category Cards — Residential / Commercial large image cards
 *   3. Service Detail Cards — 3-col glass grid
 *   4. Process Timeline — "Execution Protocol"
 *   5. Floating CTA button (fixed bottom-right)
 */

import type { Metadata } from 'next';
import { motion } from 'framer-motion';
import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { SERVICE_LINKS } from '@/lib/constants';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'Our Services',
  description:
    'Next-generation roofing solutions: composition shingles, metal roofs, flat PVC/TPO, concrete tile, wood shingles, gutters, and emergency repairs.',
};

export default function ServicesPage() {
  return (
    <ServicesClient />
  );
}

