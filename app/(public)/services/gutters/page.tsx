/**
 * app/services/gutters/page.tsx
 */
import type { Metadata } from 'next';
import ServiceDetailPage from '../ServiceDetailPage';
import { SERVICES_DATA, BRAND } from '@/lib/constants';

const data = SERVICES_DATA.find((s) => s.slug === 'gutters')!;

export const metadata: Metadata = {
  title: 'Gutters & Downspouts | Perez Premium Roofing | Bay Area CA',
  description: 'Professional seamless gutter installation and maintenance in the Bay Area. Aluminum, copper, and galvanized steel. Free estimates.',
};

export default function Page() {
  return (
    <ServiceDetailPage
      title={data.label}
      subtitle="Seamless Gutter Systems"
      description="PEREZ PREMIUM ROOFING INC's Gutters and Downspouts service includes the installation, replacement or repair of gutters and downspouts systems that allow a correct evacuation of rainwater from the roof to the drainage. Our team performs a complete evaluation of the property to design an efficient and functional system, adapted to the type of roof and local climatic conditions. With over 20 years of experience, we guarantee an accurate, durable and aesthetically pleasing installation."
      icon={data.icon}
      slug={data.slug}
      stats={[
        { value: BRAND.yearsExperience, suffix: '+', label: 'Years Installing Gutters' },
        { value: 100, suffix: '%', label: 'Seamless Options' },
        { value: 3, suffix: ' Types', label: 'Aluminum, Copper, Steel' },
      ]}
      benefits={data.benefits}
      includedServices={[
        'Inspection of the current system or evaluation for new installation',
        'Personalized advice on materials, design and colors',
        'Installation or replacement of gutters and downspouts in aluminum, copper or other finishes',
        'Systems with clog protection, optional',
        'Review of slopes and drainage points for maximum efficiency',
        'Warranty for defects in installation and materials',
        'Coverage throughout the Bay Area',
      ]}
    />
  );
}
