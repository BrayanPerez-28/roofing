/**
 * app/services/roof-repairs/page.tsx
 */
import type { Metadata } from 'next';
import ServiceDetailPage from '../ServiceDetailPage';
import { SERVICES_DATA, BRAND } from '@/lib/constants';

const data = SERVICES_DATA.find((s) => s.slug === 'roof-repairs')!;

export const metadata: Metadata = {
  title: 'Roof Repairs | Perez Premium Roofing | Bay Area CA',
  description: 'Fast and reliable roof repair services in the Bay Area. Leaks, storm damage, aging systems — all roof types. Emergency line available. CSLB #1135746.',
};

export default function Page() {
  return (
    <ServiceDetailPage
      title={data.label}
      subtitle="Fast & Reliable Repairs"
      description="PEREZ PREMIUM ROOFING INC's Roof Repairs service includes the inspection, diagnosis and repair of all types of damage that may affect the integrity of a roof. Whether it is a localized leak, broken shingles, membrane cracks, gutter failures or minor structural damage, our highly trained team identifies the problem and resolves it quickly and accurately. We work with materials compatible with the original roof and apply durable solutions that prevent recurrences. With over 20 years of experience, we guarantee reliable repairs throughout the Bay Area."
      icon={data.icon}
      slug={data.slug}
      badge="Emergency Service Available"
      stats={[
        { value: 24, suffix: ' Hr', label: 'Emergency Response' },
        { value: 100, suffix: '%', label: 'All Roof Types' },
        { value: BRAND.yearsExperience, suffix: '+', label: 'Years Experience' },
      ]}
      benefits={data.benefits}
      includedServices={[
        'Complete inspection of the roof to identify visible and hidden damage',
        'Accurate diagnosis and detailed explanation of the problem',
        'Repair or replacement of shingles, membranes, seals, loose nailing or affected areas',
        'Review and intervention on gutters, downspouts or vents, if necessary',
        'Testing for waterproofing and structural soundness after repair',
        'Cleaning of the work area upon completion',
        'Warranty on the repair performed',
        'Coverage throughout the Bay Area',
      ]}
    />
  );
}
