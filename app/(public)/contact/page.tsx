/**
 * app/contact/page.tsx — Contact Us Page
 *
 * Migrated from contact_us/code.html.
 * Layout: Emergency banner + split layout (form left, map right)
 */

import type { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';
import MapPanel from '@/components/contact/MapPanel';
import { CONTACT_INFO } from '@/lib/constants';
import { Phone, Mail, MapPin, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Deploy our engineering teams for architectural assessments, commercial bids, or premium residential consultations. 24/7 emergency line available.',
};

const contactCards = [
  {
    icon: <Phone size={20} />,
    label: 'Call Us',
    value: CONTACT_INFO.phone,
    href: CONTACT_INFO.phoneHref,
    id: 'contact-phone-card',
  },
  {
    icon: <Mail size={20} />,
    label: 'Email Ops',
    value: CONTACT_INFO.email,
    href: CONTACT_INFO.emailHref,
    id: 'contact-email-card',
  },
  {
    icon: <MapPin size={20} />,
    label: 'HQ Location',
    value: CONTACT_INFO.address,
    href: undefined,
    id: 'contact-location-card',
  },
];

export default function ContactPage() {
  return (
    <>
      {/* ── Emergency Banner ── */}
      <div
        className="w-full bg-error-container/20 border-b border-error/20 py-4 px-margin-mobile md:px-margin-desktop backdrop-blur-md"
        role="alert"
      >
        <div className="max-w-container-max mx-auto flex items-center justify-center gap-3 text-error">
          <AlertTriangle size={18} className="shrink-0" />
          <span className="font-label-md text-label-md uppercase tracking-widest">
            24/7 Emergency Repairs Available — Call{' '}
            <a href={CONTACT_INFO.phoneHref} className="underline hover:opacity-80 transition-opacity">
              {CONTACT_INFO.phone}
            </a>
          </span>
        </div>
      </div>

      {/* ── Split Layout ── */}
      <section className="flex-grow grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-140px)]">

        {/* Left Column: Form */}
        <div className="flex flex-col justify-center px-margin-mobile md:px-margin-desktop py-section-gap max-w-2xl mx-auto lg:mx-0 w-full relative z-10">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4 font-extrabold">
              Initiate{' '}
              <span
                className="text-primary"
                style={{ textShadow: '0 0 12px rgba(183,196,255,0.3)' }}
              >
                Connection
              </span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
              Deploy our engineering teams for architectural assessments, commercial bids, or premium
              residential consultations.
            </p>
          </div>

          {/* Contact Form */}
          <ContactForm />

          {/* Quick Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
            {contactCards.map((card) =>
              card.href ? (
                <a
                  key={card.id}
                  id={card.id}
                  href={card.href}
                  className="glass-card p-4 rounded-lg flex flex-col items-center justify-center text-center gap-2 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-container/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <div className="font-label-md text-label-md text-on-surface">{card.label}</div>
                  <div className="font-body-md text-body-md text-on-surface-variant text-sm">
                    {card.value}
                  </div>
                </a>
              ) : (
                <div
                  key={card.id}
                  id={card.id}
                  className="glass-card p-4 rounded-lg flex flex-col items-center justify-center text-center gap-2 group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-container/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <div className="font-label-md text-label-md text-on-surface">{card.label}</div>
                  <div className="font-body-md text-body-md text-on-surface-variant text-sm">
                    {card.value}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Right Column: Map */}
        <div className="hidden lg:block">
          <MapPanel />
        </div>
      </section>
    </>
  );
}

