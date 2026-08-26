/**
 * app/services/roof-repairs/page.tsx
 */
import type { Metadata } from 'next';
import ServiceDetailPage from '../ServiceDetailPage';
import { SERVICES_DATA } from '@/lib/constants';

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
      description={data.description}
      icon={data.icon}
      slug={data.slug}
      badge="Emergency Service Available"
      stats={[
        { value: 24, suffix: ' Hr', label: 'Emergency Response' },
        { value: 100, suffix: '%', label: 'All Roof Types' },
        { value: 20, suffix: '+', label: 'Years Experience' },
      ]}
      benefits={data.benefits}
    />
  );
}
