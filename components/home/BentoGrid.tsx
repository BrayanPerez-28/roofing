'use client';

/**
 * components/home/BentoGrid.tsx
 *
 * "Architectural Precision" bento grid section.
 * 4-item bento layout matching the design file:
 * - Item 1 (2-col span): Aerospace-Grade Materials with animated icon
 * - Item 2: Micro-Tolerance Engineering
 * - Item 3: Lifetime Warranty
 * - Item 4 (2-col span): Smart Roof Integration with background image
 *
 * Framer Motion scroll-triggered animations with staggered delays.
 */

import { motion, type Transition, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: 'easeOut' } as Transition,
  }),
};

const items = [
  {
    id: 1,
    colSpan: 'md:col-span-2',
    icon: 'architecture',
    title: 'Aerospace-Grade Materials',
    description:
      'We utilize advanced composites and coatings originally developed for extreme environments, ensuring unmatched durability and performance under any condition.',
    large: true,
    delay: 0,
  },
  {
    id: 2,
    colSpan: '',
    icon: 'precision_manufacturing',
    title: 'Micro-Tolerance Engineering',
    description: 'Every installation is mapped and executed with laser precision.',
    large: false,
    delay: 0.1,
  },
  {
    id: 3,
    colSpan: '',
    icon: 'verified_user',
    title: 'Lifetime Warranty',
    description: 'Backed by comprehensive guarantees that reflect our confidence in every project.',
    large: false,
    delay: 0.2,
  },
];

export default function BentoGrid() {
  return (
    <section
      className="section-padding max-w-container-max mx-auto"
      aria-labelledby="bento-heading"
    >
      {/* Section Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7 }}
      >
        <h2
          id="bento-heading"
          className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4"
        >
          Architectural Precision
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Elevating industry standards through advanced materials and rigorous engineering protocols.
        </p>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">

        {/* ── Items 1–3 ── */}
        {items.map((item) => (
          <motion.div
            key={item.id}
            className={`glass-card rounded-xl p-8 flex flex-col justify-end relative overflow-hidden group ${item.colSpan}`}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            custom={item.delay}
          >
            {/* Background icon (decorative, fades in on hover) */}
            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none">
              <span
                className="material-symbols-outlined material-symbols-filled text-primary"
                style={{ fontSize: item.large ? '120px' : '80px' }}
                aria-hidden="true"
              >
                {item.icon}
              </span>
            </div>

            {/* Content */}
            <div className={`relative z-10 ${item.large ? 'w-2/3' : ''}`}>
              {!item.large && (
                <span
                  className="material-symbols-outlined material-symbols-filled text-primary mb-4 block"
                  style={{ fontSize: '40px' }}
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
              )}
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                {item.title}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}

        {/* ── Item 4: Smart Roof Integration (wide, with bg image) ── */}
        <motion.div
          className="md:col-span-2 glass-card rounded-xl p-8 flex items-center justify-between relative overflow-hidden group"
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          custom={0.3}
        >
          {/* Background image overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay group-hover:opacity-30 transition-opacity duration-700"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCGKDUc4VcNWbYKOk2UNyiN8IpXXIwRxWNdeWNlOqjjVYQzN67tlVeeZRVOQTVXpkk41c6c0HK_tV1yk6_bubFvksOKDfrb4wwzUTjm5U1rZRzwkztfxyFDOKzrdsWXmmvijxLmqZVLfGFiJtJ5SgUMgliRpVndbl-RVFY0Mp2UVi_-Bg4_1ovXU3jCbG-3qEdDxUGqlbozehr5MOwvG3t58eJ7YsAPiQ4teW3MPIM0gRWwVSIil7ay5A')`,
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-sm">
            <span
              className="material-symbols-outlined material-symbols-filled text-primary mb-4 block"
              style={{ fontSize: '40px' }}
              aria-hidden="true"
            >
              solar_power
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
              Smart Roof Integration
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Seamlessly incorporating solar technology and IoT sensors without compromising
              structural aesthetics or weather integrity.
            </p>
          </div>

          <Link
            href="/services"
            className="relative z-10 btn-secondary rounded-full p-4 shrink-0 group/btn"
            aria-label="Explore Smart Roof Integration services"
          >
            <ArrowRight
              size={20}
              className="transition-transform duration-300 group-hover/btn:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

