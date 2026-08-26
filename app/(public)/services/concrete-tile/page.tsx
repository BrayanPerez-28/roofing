/**
 * app/services/concrete-tile/page.tsx
 */
import type { Metadata } from 'next';
import ServiceDetailPage from '../ServiceDetailPage';
import { SERVICES_DATA } from '@/lib/constants';

const data = SERVICES_DATA.find((s) => s.slug === 'concrete-tile')!;

export const metadata: Metadata = {
  title: 'Concrete Tile Roofing | Perez Premium Roofing | Bay Area CA',
  description: 'Expert concrete tile roof installation in the Bay Area. 50+ year lifespan, Class A fire rating, and premium Mediterranean aesthetics. CSLB #1135746.',
};

export default function Page() {
  return (
    <ServiceDetailPage
      title={data.label}
      subtitle="Premium Tile Installation"
      description={data.description}
      icon={data.icon}
      slug={data.slug}
      stats={[
        { value: 50, suffix: '+', label: 'Year Lifespan' },
        { value: 100, suffix: '%', label: 'Fire Resistant (Class A)' },
        { value: 20, suffix: '+', label: 'Years Installing Tile' },
      ]}
      benefits={data.benefits}
    />
  );
}
