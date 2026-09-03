/**
 * app/services/composition-shingles/page.tsx
 */
import type { Metadata } from 'next';
import ServiceDetailPage from '../ServiceDetailPage';
import { SERVICES_DATA, BRAND } from '@/lib/constants';

const data = SERVICES_DATA.find((s) => s.slug === 'composition-shingles')!;

export const metadata: Metadata = {
  title: 'Composition Shingles | Perez Premium Roofing | Bay Area CA',
  description: `Professional composition shingle installation in the Bay Area. Durable, beautiful, and backed by ${BRAND.yearsExperience}+ years of experience. CSLB #1135746. Free estimates.`,
};

export default function Page() {
  return (
    <ServiceDetailPage
      title={data.label}
      subtitle="Professional Bay Area Installation"
      description={data.description}
      icon={data.icon}
      slug={data.slug}
      badge="Most Popular"
      stats={[
        { value: 30, suffix: ' Yr', label: 'Manufacturer Warranty' },
        { value: 130, suffix: ' MPH', label: 'Wind Rating' },
        { value: 40, suffix: '+', label: 'Color Options' },
      ]}
      benefits={data.benefits}
    />
  );
}
