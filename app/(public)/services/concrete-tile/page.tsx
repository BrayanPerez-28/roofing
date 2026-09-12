/**
 * app/services/concrete-tile/page.tsx
 */
import type { Metadata } from 'next';
import ServiceDetailPage from '../ServiceDetailPage';
import { SERVICES_DATA, BRAND } from '@/lib/constants';

const data = SERVICES_DATA.find((s) => s.slug === 'concrete-tile')!;

export const metadata: Metadata = {
  title: 'Concrete Tile Roofing | Perez Premium Roofing | Bay Area CA',
  description: 'Expert concrete tile roof installation in the Bay Area. 50+ year lifespan, Class A fire rating, and premium Mediterranean aesthetics.',
};

export default function Page() {
  return (
    <ServiceDetailPage
      title={data.label}
      subtitle="Premium Tile Installation"
      description="PEREZ PREMIUM ROOFING INC's Concrete Tile Roofing service consists of the specialized installation of concrete tiles on residential and commercial roofs. This process requires a detailed evaluation of the roof structure to ensure that it can support the additional weight of the tiles. Then, proper preparation and waterproofing is performed before the tiles are accurately and aesthetically placed. With over 20 years of experience, we guarantee a safe, durable and high-performance installation throughout the Bay Area."
      icon={data.icon}
      slug={data.slug}
      stats={[
        { value: 50, suffix: '+', label: 'Year Lifespan' },
        { value: 100, suffix: '%', label: 'Fire Resistant (Class A)' },
        { value: BRAND.yearsExperience, suffix: '+', label: 'Years Installing Tile' },
      ]}
      benefits={data.benefits}
      includedServices={[
        'Structural evaluation of the roof to verify load capacity',
        'Advice on tile style, color and type selection',
        'Removal of existing materials, if necessary',
        'Installation of waterproof barrier and support reinforcement',
        'Accurate placement of concrete roof tiles',
        'Final quality inspection and complete cleaning of the work area',
        'Installation and materials warranty',
        'Coverage throughout the Bay Area',
      ]}
    />
  );
}
