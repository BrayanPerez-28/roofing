/**
 * app/services/composition-shingles/page.tsx
 */
import type { Metadata } from 'next';
import ServiceDetailPage from '../ServiceDetailPage';
import { SERVICES_DATA, BRAND } from '@/lib/constants';

const data = SERVICES_DATA.find((s) => s.slug === 'composition-shingles')!;

export const metadata: Metadata = {
  title: 'Composition Shingles | Perez Premium Roofing | Bay Area CA',
  description: `Professional composition shingle installation in the Bay Area. Durable, beautiful, and backed by ${BRAND.yearsExperience}+ years of experience. Free estimates.`,
};

export default function Page() {
  return (
    <ServiceDetailPage
      title={data.label}
      subtitle="Professional Bay Area Installation"
      description="Professional installation of composite roofing manufactured with a mixture of asphalt, fiberglass and mineral granules. This system provides a strong, lightweight and visually appealing roof ideal for homes in the Bay Area. Our team performs a detailed roof evaluation, properly prepares the surface and proceeds with installation under the highest quality standards."
      icon={data.icon}
      slug={data.slug}
      badge="Most Popular"
      stats={[
        { value: 30, suffix: ' Yr', label: 'Manufacturer Warranty' },
        { value: 130, suffix: ' MPH', label: 'Wind Rating' },
        { value: 40, suffix: '+', label: 'Color Options' },
      ]}
      benefits={data.benefits}
      includedServices={[
        'Initial inspection of the roof',
        'Personalized advice on material and color selection',
        'Removal of existing roof, if applicable',
        'Professional preparation and installation of shingles',
        'Cleaning of the area at the end of the job',
        'Labor and material warranty',
        'Fast and reliable local service throughout the Bay Area',
      ]}
    />
  );
}
