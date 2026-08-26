/**
 * app/services/gutters/page.tsx
 */
import type { Metadata } from 'next';
import ServiceDetailPage from '../ServiceDetailPage';
import { SERVICES_DATA } from '@/lib/constants';

const data = SERVICES_DATA.find((s) => s.slug === 'gutters')!;

export const metadata: Metadata = {
  title: 'Gutters & Downspouts | Perez Premium Roofing | Bay Area CA',
  description: 'Professional seamless gutter installation and maintenance in the Bay Area. Aluminum, copper, and galvanized steel. Free estimates. CSLB #1135746.',
};

export default function Page() {
  return (
    <ServiceDetailPage
      title={data.label}
      subtitle="Seamless Gutter Systems"
      description={data.description}
      icon={data.icon}
      slug={data.slug}
      stats={[
        { value: 20, suffix: '+', label: 'Years Installing Gutters' },
        { value: 100, suffix: '%', label: 'Seamless Options' },
        { value: 3, suffix: ' Types', label: 'Aluminum, Copper, Steel' },
      ]}
      benefits={data.benefits}
    />
  );
}
