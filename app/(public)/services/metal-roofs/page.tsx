/**
 * app/services/metal-roofs/page.tsx
 */
import type { Metadata } from 'next';
import ServiceDetailPage from '../ServiceDetailPage';
import { SERVICES_DATA } from '@/lib/constants';

const data = SERVICES_DATA.find((s) => s.slug === 'metal-roofs')!;

export const metadata: Metadata = {
  title: 'Standing Seam Metal Roofs | Perez Premium Roofing | Bay Area CA',
  description: 'Premium standing seam metal roofing in the Bay Area. 50-70 year lifespan, wind resistant, 100% recyclable. Expert installation. CSLB #1135746.',
};

export default function Page() {
  return (
    <ServiceDetailPage
      title={data.label}
      subtitle="Premium Metal Roofing Systems"
      description={data.description}
      icon={data.icon}
      slug={data.slug}
      badge="Premium System"
      stats={[
        { value: 70, suffix: ' Yr', label: 'Maximum Lifespan' },
        { value: 140, suffix: ' MPH', label: 'Wind Resistance' },
        { value: 100, suffix: '%', label: 'Recyclable Material' },
      ]}
      benefits={data.benefits}
    />
  );
}
