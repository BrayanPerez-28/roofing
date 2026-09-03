'use client';

/**
 * components/contact/MapPanel.tsx
 *
 * Bay Area service map with highlighted coverage zones for the contact panel.
 */

import { motion } from 'framer-motion';
import LeafletMapClient from '@/components/maps/LeafletMapClient';
import { MapPin } from 'lucide-react';

const COVERAGE_ZONES = [
  {
    label: 'North Bay',
    detail: 'Santa Rosa · Bodega Bay · Sonoma · Napa · San Rafael · Marin',
  },
  {
    label: 'East Bay',
    detail: 'Oakland · Berkeley · Fremont · Concord · Walnut Creek',
  },
  {
    label: 'South Bay',
    detail: 'San Jose · Santa Clara · Cupertino · Sunnyvale · Campbell · Morgan Hill · Gilroy · Milpitas · Mountain View',
  },
  {
    label: 'Peninsula',
    detail: 'San Francisco · Daly City · Pacifica · San Mateo · Half Moon Bay · Palo Alto',
  },
];

export default function MapPanel() {
  return (
    <div className="relative h-full min-h-175 border-l border-white/5 overflow-hidden bg-[#050917]">
      <LeafletMapClient />

      {/* Top badge */}
      <motion.div
        className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/70 border border-primary/30 backdrop-blur-md"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <MapPin size={13} className="text-primary shrink-0" />
        <span className="text-xs font-semibold tracking-widest text-primary uppercase">
          Bay Area Service Coverage
        </span>
      </motion.div>

      {/* Bottom info panel */}
      <motion.div
        className="absolute bottom-4 left-4 right-4 z-20 glass-panel p-4 rounded-xl border-glass-primary"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.6 }}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="font-label-md text-label-md text-primary text-[10px] uppercase tracking-widest">
              Service Area
            </p>
            <p className="font-headline-md text-headline-md text-on-surface text-base font-bold mt-0.5">
              Greater Bay Area, CA
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary/80 ring-2 ring-primary/30" />
            <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-widest">
              25+ Cities
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {COVERAGE_ZONES.map((zone) => (
            <div key={zone.label} className="flex items-start gap-1.5">
              <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
              <div>
                <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">
                  {zone.label}
                </span>
                <p className="text-[9px] text-on-surface-variant leading-tight mt-0.5">
                  {zone.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
