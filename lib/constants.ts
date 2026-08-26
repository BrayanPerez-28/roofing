/**
 * lib/constants.ts
 *
 * Centralized site constants for Perez Premium Roofing.
 * Data sourced from the real company site: perezroofingpro.com
 * Update this file to change navigation, contact info, and service routes.
 */

// ─── Navigation ──────────────────────────────────────────────────────────────

export const NAV_LINKS = [
  { label: "Home",     href: "/" },
  { label: "About",    href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Gallery",  href: "/gallery" },
  { label: "Reviews",  href: "/reviews" },
  { label: "Contact",  href: "/contact" },
];

export const SERVICE_LINKS = [
  { label: "Composition Shingles", href: "/services/composition-shingles", icon: "layers" },
  { label: "Concrete Tile",        href: "/services/concrete-tile",        icon: "view_module" },
  { label: "Flat Roof (PVC/TPO)",  href: "/services/flat-roof",            icon: "crop_landscape" },
  { label: "Standing Seam Metal",  href: "/services/metal-roofs",          icon: "hardware" },
  { label: "Wood Shingles",        href: "/services/wood-shingles",        icon: "park" },
  { label: "Roof Repairs",         href: "/services/roof-repairs",         icon: "build" },
  { label: "Gutters & Downspouts", href: "/services/gutters",              icon: "water_drop" },
];

// ─── Contact Information ──────────────────────────────────────────────────────

export const CONTACT_INFO = {
  phone:          "(408) 816-5753",
  phoneHref:      "tel:+14088165753",
  phoneEmergency: "(408) 786-7081",
  phoneEmergencyHref: "tel:+14087867081",
  email:          "info@perezroofingpro.com",
  emailHref:      "mailto:info@perezroofingpro.com",
  address:        "Bay Area, CA",
  hours:          "Mon–Sat 7AM–6PM | Emergency: (408) 786-7081",
  license:        "CSLB #1135746",
};

// ─── Brand ───────────────────────────────────────────────────────────────────

export const BRAND = {
  name:        "Perez Premium Roofing",
  fullName:    "Perez Premium Roofing INC",
  tagline:     "Licensed, Bonded & Insured — CSLB #1135746",
  established: "2003",
  license:     "CSLB #1135746",
  copyright:   `© ${new Date().getFullYear()} Perez Premium Roofing INC. All rights reserved. CSLB #1135746`,
};

// ─── Stats ───────────────────────────────────────────────────────────────────

export const HOME_STATS = [
  { value: 800,  suffix: "+",    label: "Projects Completed" },
  { value: 20,   suffix: "+ Yrs",label: "Industry Experience" },
  { value: 95,   suffix: ".5%",  label: "Customer Satisfaction" },
  { value: 100,  suffix: "%",    label: "Recommended by Clients" },
];

// ─── Services Detail ─────────────────────────────────────────────────────────

export const SERVICES_DATA = [
  {
    slug: "composition-shingles",
    label: "Composition Shingles",
    icon: "layers",
    shortDesc: "Durable asphalt shingles engineered for Bay Area weather — lightweight, beautiful, and long-lasting.",
    description:
      "Professional installation of composite roofing manufactured with a mixture of asphalt, fiberglass and mineral granules. This system provides a strong, lightweight and visually appealing roof ideal for homes in the Bay Area. Our team performs a detailed roof evaluation, properly prepares the surface and proceeds with installation under the highest quality standards, backed by our state license CSLB #1135746.",
    benefits: [
      {
        title: "Durability & Weather Resistance",
        desc: "Designed to withstand heavy rain, wind and sun exposure, making them a reliable choice for protecting your home for years to come.",
      },
      {
        title: "Aesthetic Variety",
        desc: "Wide range of styles, textures and colors, allowing homeowners to customize the appearance of their roof and enhance visual appeal.",
      },
      {
        title: "Low Maintenance & Great Value",
        desc: "Affordable and low-maintenance, representing long-term savings on both repairs and replacements.",
      },
    ],
  },
  {
    slug: "wood-shingles",
    label: "Wood Shingles",
    icon: "park",
    shortDesc: "Natural cedar wood shingles that offer timeless beauty and exceptional insulating properties.",
    description:
      "Professional installation of natural wood shingles and shakes that combine rustic elegance with excellent thermal insulation. Our expert team carefully selects premium cedar or redwood materials and installs them to maximize longevity and weather resistance in the Bay Area climate.",
    benefits: [
      {
        title: "Natural Aesthetic",
        desc: "Unique, warm appearance that complements traditional and craftsman-style homes, improving curb appeal and property value.",
      },
      {
        title: "Superior Insulation",
        desc: "Natural wood provides excellent insulation properties, helping maintain comfortable indoor temperatures year-round.",
      },
      {
        title: "Eco-Friendly Choice",
        desc: "Sustainably sourced wood shingles are biodegradable and have a smaller carbon footprint compared to synthetic materials.",
      },
    ],
  },
  {
    slug: "concrete-tile",
    label: "Concrete Tile Roofing",
    icon: "view_module",
    shortDesc: "Heavy-duty concrete tiles delivering unmatched durability and a premium Mediterranean look.",
    description:
      "Concrete tile roofing offers exceptional longevity and aesthetic versatility. Our experienced team installs concrete tiles that withstand California's varied climate while providing excellent fire resistance and energy efficiency for both residential and commercial properties.",
    benefits: [
      {
        title: "50+ Year Lifespan",
        desc: "Concrete tiles are among the most durable roofing materials available, often outlasting the structure itself when properly maintained.",
      },
      {
        title: "Fire & Weather Resistant",
        desc: "Class A fire rating and excellent resistance to wind, hail, and extreme temperatures make concrete tile the premium choice.",
      },
      {
        title: "Energy Efficient",
        desc: "The air circulation beneath concrete tiles helps regulate attic temperatures, reducing cooling costs in California's warm summers.",
      },
    ],
  },
  {
    slug: "gutters",
    label: "Gutters & Downspouts",
    icon: "water_drop",
    shortDesc: "Complete gutter installation and maintenance to protect your home's foundation and landscaping.",
    description:
      "Proper gutter and downspout systems are critical to protecting your property from water damage. We install, repair and maintain seamless gutters in aluminum, copper and galvanized steel, customized to your roof's design and the specific drainage needs of your Bay Area property.",
    benefits: [
      {
        title: "Foundation Protection",
        desc: "Properly functioning gutters direct water away from your foundation, preventing costly structural damage and basement flooding.",
      },
      {
        title: "Erosion Prevention",
        desc: "Controlled water flow protects your landscaping, walkways and driveways from erosion and water pooling.",
      },
      {
        title: "Custom Seamless Design",
        desc: "Seamless gutters are fabricated on-site to your home's exact measurements, minimizing leak points and enhancing appearance.",
      },
    ],
  },
  {
    slug: "flat-roof",
    label: "Flat Roof PVC & TPO",
    icon: "crop_landscape",
    shortDesc: "Commercial-grade PVC and TPO flat roofing systems for maximum waterproofing and longevity.",
    description:
      "We specialize in PVC and TPO flat roof systems for commercial buildings and low-slope residential applications. These single-ply membrane systems are heat-welded at seams for superior waterproofing, UV resistance, and energy efficiency, making them the premier choice for flat roofs in the Bay Area.",
    benefits: [
      {
        title: "Superior Waterproofing",
        desc: "Heat-welded seams create a monolithic barrier that eliminates leak points, even under standing water conditions.",
      },
      {
        title: "Energy Star Rated",
        desc: "Highly reflective white membranes reduce heat absorption, significantly lowering cooling costs in commercial buildings.",
      },
      {
        title: "Long Service Life",
        desc: "Quality PVC and TPO systems can last 20–30 years with minimal maintenance, offering excellent return on investment.",
      },
    ],
  },
  {
    slug: "metal-roofs",
    label: "Standing Seam Metal Roofs",
    icon: "hardware",
    shortDesc: "Premium standing seam metal roofing with a 50+ year lifespan and sleek modern aesthetics.",
    description:
      "Standing seam metal roofing represents the pinnacle of residential and commercial roofing technology. Our team installs concealed-fastener metal panels in steel, aluminum, and copper, providing a virtually maintenance-free roof with exceptional wind uplift resistance and a sleek, architectural profile.",
    benefits: [
      {
        title: "50–70 Year Lifespan",
        desc: "Properly installed metal roofing can outlast the building itself, making it the last roof you'll ever need.",
      },
      {
        title: "Wind & Fire Resistant",
        desc: "Rated for winds exceeding 140 mph and non-combustible, metal roofing provides maximum protection in extreme conditions.",
      },
      {
        title: "100% Recyclable",
        desc: "Metal roofing is made from recycled content and is fully recyclable at end of life, making it the most sustainable roofing choice.",
      },
    ],
  },
  {
    slug: "roof-repairs",
    label: "Roof Repairs",
    icon: "build",
    shortDesc: "Fast, reliable roof repairs for leaks, storm damage, and aging systems — all roofing types.",
    description:
      "From minor leak fixes to major storm damage restoration, our repair team responds quickly to protect your property. We work on all roofing systems including shingles, tile, flat roofs and metal, providing comprehensive assessments and lasting repairs backed by our workmanship warranty.",
    benefits: [
      {
        title: "Fast Emergency Response",
        desc: "Our team is available for emergency repairs to prevent water intrusion and further structural damage to your property.",
      },
      {
        title: "Comprehensive Diagnostics",
        desc: "We identify not just the visible damage but the root cause, ensuring repairs last and don't recur after the next rainstorm.",
      },
      {
        title: "All Roofing Systems",
        desc: "Our crew is trained on every roofing type — composition, tile, wood, flat membrane, and metal — so one call covers it all.",
      },
    ],
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const TESTIMONIALS = [
  {
    name:   "Juan",
    rating: 5,
    date:   "September 2025",
    title:  "Did the roof in my house and I'm very happy with it.",
    text:   "Great people to deal with, easy-going. I would recommend them to put your roof in your house. They did a great job — happy with their work.",
  },
];

// ─── Coverage Area ────────────────────────────────────────────────────────────

export const COVERAGE_CITIES = [
  "Santa Rosa", "Bodega Bay", "Sonoma", "Napa", "San Rafael",
  "Concord", "Daly City", "San Mateo", "Pacifica", "Berkeley",
  "Oakland", "Fremont", "Walnut Creek", "Half Moon Bay", "Palo Alto",
  "Morgan Hill", "Gilroy", "Santa Clara", "Cupertino", "Campbell",
  "Sunnyvale", "Milpitas", "Mountain View",
];

export const COVERAGE_TEXT =
  "At PEREZ PREMIUM ROOFING INC, we are proud to offer our roofing services to a wide community within the San Francisco Bay Area. We service with professionalism and commitment cities such as Santa Rosa, Bodega Bay, Sonoma, Napa, San Rafael, Concord, Daly City, San Mateo, Pacifica, Berkeley, Oakland, Fremont, Walnut Creek, Half Moon Bay, Palo Alto, Morgan Hill, Gilroy, Santa Clara, Cupertino, Campbell, Sunnyvale, Milpitas and Mountain View. Whether you need a complete installation, urgent repairs or preventive maintenance, our team is ready to reach out to you with quality solutions and personalized attention.";

// ─── Why Choose Us ────────────────────────────────────────────────────────────

export const WHY_CHOOSE_US = [
  {
    icon: "verified",
    title: "Licensed, Bonded & Insured",
    desc: "California State Contractor's License CSLB #1135746. Full liability and workers' compensation coverage on every job.",
  },
  {
    icon: "workspace_premium",
    title: "20+ Years of Excellence",
    desc: "Two decades delivering quality roofing solutions designed to stand the test of time for hundreds of Bay Area families and businesses.",
  },
  {
    icon: "handshake",
    title: "Free Estimates",
    desc: "We offer no-obligation free estimates throughout the Bay Area. Honest pricing with no hidden fees — ever.",
  },
  {
    icon: "construction",
    title: "Premium Materials Only",
    desc: "We combine modern techniques with high-quality materials, ensuring strong, functional and visually attractive roofs.",
  },
  {
    icon: "emergency",
    title: "24/7 Emergency Line",
    desc: "Roof damage doesn't wait for business hours. Call our emergency line any time: (408) 786-7081.",
  },
  {
    icon: "home",
    title: "Residential & Commercial",
    desc: "From single-family homes to large commercial properties — we have the experience and equipment to handle any project.",
  },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export const FAQ = [
  {
    question: "Is Perez Premium Roofing INC properly licensed and insured?",
    answer:
      "Yes. We hold California State Contractor's License CSLB #1135746 and carry full general liability insurance and workers' compensation coverage. You can verify our license at the CSLB website.",
  },
  {
    question: "How much experience does the company have in the roofing industry?",
    answer:
      "We have over 20 years of experience in the roofing industry. Over those two decades, we have worked with hundreds of families and business owners throughout the San Francisco Bay Area, delivering quality and commitment on every project.",
  },
  {
    question: "What types of roofs do you install or repair?",
    answer:
      "We install and repair all major roofing systems: Composition Shingles, Wood Shingles, Concrete Tile Roofing, Flat Roof PVC and TPO, Standing Seam Metal Roofs, Gutters & Downspouts, and Roof Repairs of any system.",
  },
  {
    question: "Do you offer free estimates?",
    answer:
      "Yes! We offer completely free, no-obligation estimates throughout the Bay Area. Contact us at (408) 816-5753 or fill out our online form and we'll schedule a visit at your convenience.",
  },
];

// ─── Mission / Vision / Values ────────────────────────────────────────────────

export const COMPANY_VALUES = {
  mission:
    "At Perez Premium Roofing INC, our mission is to provide reliable, safe and top quality roofing services tailored to each customer's needs. We are committed to working with integrity, precision and efficiency, using durable materials and industry best practices to protect the homes and businesses of our community.",
  vision:
    "Our vision is to be recognized as one of the leading roofing solutions companies in the Bay Area, distinguished by the quality of our services, the expertise of our team and an ongoing commitment to customer satisfaction.",
  values:
    "We believe in honesty as the basis of every relationship with our clients, in responsibility as a reflection of respect for every project we take on, and in excellence as a permanent goal in every detail. We value teamwork, continuous improvement and total dedication to ensure results that exceed expectations.",
};

// ─── Colors (mirrored from Tailwind config for use in JS/Canvas) ─────────────

export const COLORS = {
  primaryBlue:      "#b7c4ff",
  primaryNavy:      "#0b1e5b",
  electricBlue:     "#1E5EFF",
  deepBlue:         "#0555f7",
  surface:          "#131313",
  surfaceDim:       "#0A0A0A",
  onSurface:        "#e5e2e1",
  onSurfaceVariant: "#c6c5d1",
};
