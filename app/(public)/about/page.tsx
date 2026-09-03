/**
 * app/about/page.tsx — About Us Page
 *
 * Real company content from perezroofingpro.com
 */
import type { Metadata } from 'next';
import Button from '@/components/ui/Button';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import ReviewsSection from '@/components/reviews/ReviewsSection';
import { HOME_STATS, COMPANY_VALUES, CONTACT_INFO, FAQ, BRAND } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About Us | Perez Premium Roofing INC | Bay Area CA',
  description:
    `Over ${BRAND.yearsExperience} years of roofing excellence in the Bay Area, CA. Licensed contractor CSLB #1135746 — committed to quality, integrity, and lasting results for residential and commercial clients.`,
};

const PILLARS = [
  {
    icon: 'emoji_objects',
    title: 'Mission',
    text: COMPANY_VALUES.mission,
  },
  {
    icon: 'visibility',
    title: 'Vision',
    text: COMPANY_VALUES.vision,
  },
  {
    icon: 'favorite',
    title: 'Values',
    text: COMPANY_VALUES.values,
  },
];

export default function AboutPage() {
  return (
    <article>
      {/* ── Hero ── */}
      <section className="section-padding max-w-container-max mx-auto">
        <div className="max-w-3xl">
          <span className="inline-block px-4 py-1 glass-panel rounded-full border-glass-primary mb-6">
            <span className="font-label-md text-label-md text-primary uppercase tracking-widest">
              Est. 2003 — CSLB #1135746
            </span>
          </span>
          <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-gradient mb-8">
            Built on Integrity.<br />Trusted by the Bay Area.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
            Perez Premium Roofing INC is a company committed to providing durable, safe and
            aesthetically impeccable roofing solutions in the Bay Area, CA. With over {BRAND.yearsExperience} years
            of experience in the industry and backed by our state license CSLB #1135746, we
            pride ourselves in providing high quality services to both residential and commercial
            customers.
          </p>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
            Specializing in a wide range of roofing systems — including Composition Shingles,
            Wood Shingles, Concrete Tile Roofing, Flat Roof PVC and TPO, and Standing Seam
            Metal Roofs — we also offer installation and maintenance of Gutters &amp; Downspouts
            and complete Roof Repair services. Every project is approached with precision,
            premium materials and attention to detail, ensuring long-term satisfaction and
            protection for your property.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Button variant="primary" href="/contact" size="lg">
              Get a Free Estimate
            </Button>
            <Button variant="secondary" href={CONTACT_INFO.phoneHref} size="lg">
              Call {CONTACT_INFO.phone}
            </Button>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section
        className="section-padding max-w-container-max mx-auto border-t border-outline-variant/30"
        aria-label="Company statistics"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {HOME_STATS.map((stat) => (
            <AnimatedCounter
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>
      </section>

      {/* ── Mission / Vision / Values ── */}
      <section
        className="section-padding max-w-container-max mx-auto"
        aria-labelledby="pillars-heading"
      >
        <div className="text-center mb-12">
          <span className="font-label-md text-label-md text-primary uppercase tracking-widest block mb-3">
            Our Foundation
          </span>
          <h2
            id="pillars-heading"
            className="font-headline-lg-mobile md:text-headline-lg text-on-surface font-extrabold"
          >
            Mission, Vision &amp; <span className="text-gradient">Values</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className="glass-card p-8 rounded-xl flex flex-col gap-4">
              <span
                className="material-symbols-outlined material-symbols-filled text-primary"
                style={{ fontSize: '40px' }}
                aria-hidden="true"
              >
                {pillar.icon}
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface">{pillar.title}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {pillar.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Two Decades Matter ── */}
      <section className="section-padding max-w-container-max mx-auto" aria-labelledby="experience-heading">
        <div className="glass-panel rounded-2xl p-8 md:p-16 border border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="font-label-md text-label-md text-primary uppercase tracking-widest block mb-4">
                Over {BRAND.yearsExperience} Years of Excellence
              </span>
              <h2
                id="experience-heading"
                className="font-headline-lg-mobile md:text-headline-lg text-on-surface font-extrabold mb-6"
              >
                Your Local Roofing Company <span className="text-gradient">You Can Trust</span>
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-4">
                With over {BRAND.yearsExperience} years of industry experience, Perez Premium Roofing INC has
                established itself as a trusted local company in the Bay Area, CA. Our track
                record speaks for itself: two decades of delivering quality, commitment and
                roofing solutions designed to stand the test of time.
              </p>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-4">
                Over the years, we&apos;ve worked hand-in-hand with hundreds of families and
                business owners, providing personalized attention, honest advice, and flawless
                results on every project.
              </p>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Excellence is not only part of our work — it is our philosophy. We combine
                the tradition of a job well done with modern techniques and high quality
                materials, ensuring strong, functional and visually attractive roofs.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: 'verified', label: 'Licensed, Bonded & Insured', detail: 'CSLB #1135746' },
                { icon: 'workspace_premium', label: `${BRAND.yearsExperience}+ Years Experience`, detail: 'Bay Area, CA' },
                { icon: 'handshake', label: 'Free Estimates', detail: 'No Obligation' },
                { icon: 'emergency', label: '24/7 Emergency Line', detail: CONTACT_INFO.phoneEmergency },
                { icon: 'home', label: 'Residential & Commercial', detail: 'All Roof Types' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5"
                >
                  <span
                    className="material-symbols-outlined material-symbols-filled text-2xl text-primary shrink-0"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  <div>
                    <p className="font-button text-on-surface text-sm">{item.label}</p>
                    <p className="text-xs text-primary">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section-padding max-w-container-max mx-auto" aria-labelledby="faq-heading">
        <div className="text-center mb-12">
          <span className="font-label-md text-label-md text-primary uppercase tracking-widest block mb-3">
            Common Questions
          </span>
          <h2
            id="faq-heading"
            className="font-headline-lg-mobile md:text-headline-lg text-on-surface font-extrabold"
          >
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {FAQ.map((item, idx) => (
            <div
              key={idx}
              className="glass-card rounded-xl p-6 border border-white/5"
            >
              <h3 className="font-button text-on-surface font-semibold mb-3 flex items-start gap-3">
                <span className="text-primary shrink-0 mt-0.5">Q.</span>
                {item.question}
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed pl-6">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Reviews ── */}
      <ReviewsSection />

      {/* ── CTA ── */}
      <section className="section-padding max-w-container-max mx-auto">
        <div className="glass-panel rounded-2xl p-12 text-center border-glass-primary radial-glow-primary">
          <h2 className="font-headline-md text-on-surface font-extrabold mb-4">
            Ready to Work with a Trusted Bay Area Roofer?
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-xl mx-auto">
            Contact us today for a free, no-obligation estimate. Licensed, Bonded &amp; Insured — CSLB #1135746.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Button variant="primary" href="/contact" size="lg">
              Get a Free Estimate
            </Button>
            <Button variant="secondary" href="/services" size="lg">
              View Our Services
            </Button>
          </div>
        </div>
      </section>
    </article>
  );
}
