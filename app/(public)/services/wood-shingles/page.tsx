/**
 * app/services/wood-shingles/page.tsx
 */
import type { Metadata } from 'next';
import ServiceDetailPage from '../ServiceDetailPage';
import { SERVICES_DATA } from '@/lib/constants';

const data = SERVICES_DATA.find((s) => s.slug === 'wood-shingles')!;

export const metadata: Metadata = {
  title: 'Wood Shingles | Perez Premium Roofing | Bay Area CA',
  description: 'Natural cedar wood shingle installation in the Bay Area. Beautiful, insulating, and eco-friendly. Expert installation by licensed contractors. CSLB #1135746.',
};

export default function Page() {
  return (
    <ServiceDetailPage
      title={data.label}
      subtitle="Natural Cedar & Redwood"
      description={data.description}
      icon={data.icon}
      slug={data.slug}
      stats={[
        { value: 30, suffix: '+', label: 'Year Lifespan' },
        { value: 100, suffix: '%', label: 'Natural Material' },
        { value: 20, suffix: '+', label: 'Years Experience' },
      ]}
      benefits={data.benefits}
    />
  );
}
