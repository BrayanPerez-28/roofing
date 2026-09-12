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
      description="PEREZ PREMIUM ROOFING INC's Standing Seam Metal Roofs service consists of the installation of metal roofs composed of highly durable vertical panels, whose raised edges (seams) are sealed by means of mechanical hooking or concealed fastening systems. This type of roofing not only provides excellent protection against the elements, but also offers a sophisticated and clean style. Our team performs the structural evaluation of the roof, prepares the surface and executes the installation with precision, using premium materials."
      icon={data.icon}
      slug={data.slug}
      badge="Premium System"
      stats={[
        { value: 70, suffix: ' Yr', label: 'Maximum Lifespan' },
        { value: 140, suffix: ' MPH', label: 'Wind Resistance' },
        { value: 100, suffix: '%', label: 'Recyclable Material' },
      ]}
      benefits={data.benefits}
      includedServices={[
        'Complete evaluation of the roof structure',
        'Advice on selection of materials, finishes and colors',
        'Preparation of the roof for structural support of the metal',
        'Installation of metal panels with concealed fastening and professional sealing',
        'Integration with ventilation systems and gutters, if required',
        'Quality guarantee in materials and workmanship',
      ]}
    />
  );
}
