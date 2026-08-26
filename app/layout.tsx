import type { Metadata } from "next";
import "./globals.css";

// NOTE: This is the MINIMAL root layout — it only sets up the HTML shell,
// fonts, and global CSS. Header/Footer are provided by app/(public)/layout.tsx.
// Admin pages use their own shell via app/(admin)/layout.tsx.

export const metadata: Metadata = {
  title: {
    default: "Perez Premium Roofing | Built with Precision",
    template: "%s | Perez Premium Roofing",
  },
  description:
    "Engineering structural integrity with high-end aesthetics. Perez Premium Roofing delivers futuristic materials and masterful craftsmanship for commercial and luxury residential properties.",
  keywords: [
    "premium roofing",
    "metal roofs",
    "commercial roofing",
    "Chicago roofing",
    "luxury residential roofing",
    "composition shingles",
    "flat roof PVC TPO",
    "standing seam metal roof",
  ],
  authors: [{ name: "Perez Premium Roofing INC" }],
  creator: "Perez Premium Roofing INC",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Perez Premium Roofing | Built with Precision",
    description:
      "Futuristic materials. Masterful craftsmanship. Engineering the future of roofing.",
    siteName: "Perez Premium Roofing",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Montserrat (headlines) + Inter (body) */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,600;0,700;0,800;1,700&family=Inter:wght@300;400;500;600;700&display=swap"
        />
        {/* Material Symbols Outlined */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

