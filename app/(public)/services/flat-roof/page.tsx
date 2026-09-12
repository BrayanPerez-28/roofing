/**
 * app/services/flat-roof/page.tsx
 */
import type { Metadata } from 'next';
import ServiceDetailPage from '../ServiceDetailPage';
import { SERVICES_DATA } from '@/lib/constants';

const data = SERVICES_DATA.find((s) => s.slug === 'flat-roof')!;

export const metadata: Metadata = {
  title: 'Flat Roof PVC & TPO | Perez Premium Roofing | Bay Area CA',
  description: 'Commercial-grade PVC and TPO flat roofing systems in the Bay Area. Heat-welded seams, Energy Star rated, 20-30 year lifespan.',
};

export default function Page() {
  return (
    <ServiceDetailPage
      title={data.label}
      subtitle="Commercial & Residential Flat Roofs"
      description="The Flat Roof PVC and TPO service offered by PEREZ PREMIUM ROOFING INC consists of the professional installation of single-ply membrane roofing systems, ideal for structures with flat or low slope roofs. PVC (Polyvinyl Chloride) and TPO (Thermoplastic Polyolefin) are flexible, lightweight and highly waterproof materials. Our team performs a complete evaluation of the surface, properly prepares the base and applies the system with specialized techniques that guarantee watertight sealing, resistance and functionality. With over 20 years of experience serving the Bay Area, we deliver reliable roofing solutions."
      icon={data.icon}
      slug={data.slug}
      badge="Commercial Specialist"
      stats={[
        { value: 30, suffix: ' Yr', label: 'System Lifespan' },
        { value: 100, suffix: '%', label: 'Waterproof Seams' },
        { value: 20, suffix: '%', label: 'Energy Savings' },
      ]}
      benefits={data.benefits}
      includedServices={[
        'Professional evaluation of the current condition of the roof',
        'Advice on the best option between PVC and TPO according to your needs',
        'Preparation and cleaning of the surface to ensure proper underlayment',
        'Installation of membrane with heat or mechanical sealant',
        'Reinforcement in critical areas, including drains, edges and seams',
        'Waterproofing tests and final inspection',
        'Warranty for materials and workmanship',
        'Local coverage throughout the Bay Area',
      ]}
    />
  );
}
