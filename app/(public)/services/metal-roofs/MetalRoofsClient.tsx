'use client';

/**
 * app/services/metal-roofs/MetalRoofsClient.tsx
 * Migrated from standing_seam_metal_roofs/code.html
 */

import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import Button from '@/components/ui/Button';
import SectionHeader from '@/components/ui/SectionHeader';

const stats = [
  { icon: 'shield',                value: 50,  suffix: '+ Years', label: 'Proven Lifespan',       featured: false },
  { icon: 'air',                   value: 150, suffix: ' MPH',    label: 'Wind Resistance',        featured: true  },
  { icon: 'energy_savings_leaf',   value: 30,  suffix: '%',       label: 'Cooling Cost Reduction', featured: false },
];

const specs = [
  { label: 'Panel Profile',     value: 'Standing Seam — 1.5" to 3" Rib Height' },
  { label: 'Material',          value: 'Galvalume®, Corten Steel, Aluminum' },
  { label: 'Finish',            value: 'Kynar 500® PVDF — 40 Year Warranty' },
  { label: 'Fastening',         value: 'Concealed Clip System — No Exposed Fasteners' },
  { label: 'Thermal Expansion', value: 'Floating Panel System — ±3" Movement' },
  { label: 'Fire Rating',       value: 'Class A — ASTM E108' },
  { label: 'Wind Uplift',       value: 'FM 1-90 Approved — Up to 150 MPH' },
  { label: 'Snow Load',         value: '100+ PSF Engineering Certified' },
];

export default function MetalRoofsClient() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative section-padding max-w-container-max mx-auto overflow-hidden">
        {/* Blueprint grid background */}
        <div className="absolute inset-0 blueprint-grid pointer-events-none" aria-hidden="true" />
        {/* Radial glow */}
        <div className="absolute inset-0 radial-glow-top-right pointer-events-none" aria-hidden="true" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter items-center relative z-10">
          {/* Left: Text */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant text-xs uppercase tracking-widest" aria-label="Breadcrumb">
              <a href="/services" className="hover:text-primary transition-colors">Services</a>
              <span>/</span>
              <span className="text-primary">Metal Roofs</span>
            </nav>

            <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-gradient leading-tight">
              Standing Seam
              <br />
              Metal Roofs
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Engineered for ultimate resilience. Architecturally refined. Experience the pinnacle of
              commercial and high-end residential roofing technology with concealed fasteners and
              structural integrity rated for 150+ MPH wind events.
            </p>

            <div className="flex gap-4 flex-wrap">
              <Button variant="glow" href="/contact" size="lg" id="metal-cta-configure">
                Configure Your Roof
              </Button>
              <Button variant="secondary" href="/gallery" size="lg">
                View Projects
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex gap-4 flex-wrap pt-4 border-t border-white/10">
              {['FM Approved', 'ASTM E108', 'Class A Fire', 'Kynar 500®'].map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1 glass-panel rounded-full font-label-md text-label-md text-primary text-xs uppercase tracking-wider"
                >
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right: Hero Image */}
          <motion.div
            className="relative h-[400px] md:h-[600px] glass-card rounded-xl overflow-hidden"
            style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 15px rgba(30,94,255,0.1)' }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            <div
              className="w-full h-full bg-cover bg-center opacity-80 mix-blend-luminosity"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBhHJlG1yF8_X6zjr9emo4U0SKR90KAMnShlaMq0yOVMQYsZF48-rVZ7qTmjaipM8O2tnT0evP-7FmIMrIBR95Z7cUd2KXfk2A1WB_dwpJWNwp12DC6A47WQgxHlC_Q-2IctBSVn1Yqy4M_GXBzDOUX1AMHQst6lkDlYcN-l13687csIylZB6y_DUXgpVxA-ViAovDPFC8lq-EGEu5irWB1Ep7-olMuBXjzUMH0IBsgEZpXPpsFOetY9A')`,
              }}
              aria-label="Standing seam metal roof installation — modern luxury home"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dim via-transparent to-transparent" />

            {/* Floating stat badge */}
            <div
              className="absolute bottom-6 left-6 right-6 glass-panel rounded-lg p-4 border-glass-primary"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-label-md text-label-md text-primary text-xs uppercase tracking-widest">Industry Leading</p>
                  <p className="font-headline-md text-headline-md text-on-surface font-bold mt-1">50+ Year Lifespan</p>
                </div>
                <span className="material-symbols-outlined material-symbols-filled text-primary" style={{ fontSize: '40px' }}>shield</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section
        className="section-padding max-w-container-max mx-auto border-t border-outline-variant/30"
        aria-label="Performance statistics"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className={`glass-card p-8 rounded-xl text-center space-y-4 ${
                stat.featured
                  ? 'md:scale-105 border border-primary/30'
                  : ''
              }`}
              style={stat.featured ? { boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 15px rgba(30,94,255,0.1)' } : {}}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
            >
              <span
                className="material-symbols-outlined material-symbols-filled text-primary block"
                style={{ fontSize: '40px' }}
                aria-hidden="true"
              >
                {stat.icon}
              </span>
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Technical Specs ── */}
      <section className="section-padding max-w-container-max mx-auto" aria-labelledby="specs-heading">
        <SectionHeader
          overline="Technical Specifications"
          headline="Engineered to Exacting Standards"
          subtext="Every panel specification is certified to meet or exceed industry and insurance requirements."
          centered
        />
        <div className="glass-card rounded-xl overflow-hidden">
          {specs.map((spec, i) => (
            <div
              key={spec.label}
              className={`flex flex-col sm:flex-row sm:items-center gap-2 px-8 py-5 ${
                i !== specs.length - 1 ? 'border-b border-white/5' : ''
              } hover:bg-white/[0.02] transition-colors`}
            >
              <span className="font-label-md text-label-md text-primary uppercase tracking-wider sm:w-1/3 shrink-0">
                {spec.label}
              </span>
              <span className="font-body-md text-body-md text-on-surface">
                {spec.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-padding max-w-container-max mx-auto">
        <div className="glass-panel rounded-2xl p-10 md:p-16 text-center border-glass-primary">
          <h2 className="font-headline-lg-mobile md:text-headline-lg text-on-surface font-extrabold mb-4">
            Ready to Configure Your
            <span className="text-gradient"> Metal Roof System</span>?
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto mb-8">
            Our engineers will design a custom standing seam profile to match your architectural requirements.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button variant="glow" href="/contact" size="lg" id="metal-bottom-cta">
              Configure Your Roof
            </Button>
            <Button variant="secondary" href="/services" size="lg">
              Back to Services
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

