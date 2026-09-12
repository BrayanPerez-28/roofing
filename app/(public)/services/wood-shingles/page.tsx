/**
 * app/services/wood-shingles/page.tsx
 */
import type { Metadata } from 'next';
import ServiceDetailPage from '../ServiceDetailPage';
import { SERVICES_DATA, BRAND } from '@/lib/constants';

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
        { value: BRAND.yearsExperience, suffix: '+', label: 'Years Experience' },
      ]}
      benefits={data.benefits}
      includedServices={[
        'Complete evaluation and inspection of the roof',
        'Advice on the choice of the right type of wood and style',
        'Removal of previous material, if applicable',
        'Preparation of the roof surface and structure',
        'Accurate and professional installation of wood shingles',
        'Moisture and insect protection treatments, as needed',
        'Subsequent cleanup and proper disposal of old materials',
        'Warranty on workmanship and materials'
      ]}
    />
  );
}
