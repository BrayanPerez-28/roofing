/**
 * app/services/flat-roof/page.tsx
 */
import type { Metadata } from 'next';
import ServiceDetailPage from '../ServiceDetailPage';
import { SERVICES_DATA } from '@/lib/constants';

const data = SERVICES_DATA.find((s) => s.slug === 'flat-roof')!;

export const metadata: Metadata = {
  title: 'Flat Roof PVC & TPO | Perez Premium Roofing | Bay Area CA',
  description: 'Commercial-grade PVC and TPO flat roofing systems in the Bay Area. Heat-welded seams, Energy Star rated, 20-30 year lifespan. CSLB #1135746.',
};

export default function Page() {
  return (
    <ServiceDetailPage
      title={data.label}
      subtitle="Commercial & Residential Flat Roofs"
      description={data.description}
      icon={data.icon}
      slug={data.slug}
      badge="Commercial Specialist"
      stats={[
        { value: 30, suffix: ' Yr', label: 'System Lifespan' },
        { value: 100, suffix: '%', label: 'Waterproof Seams' },
        { value: 20, suffix: '%', label: 'Energy Savings' },
      ]}
      benefits={data.benefits}
    />
  );
}
