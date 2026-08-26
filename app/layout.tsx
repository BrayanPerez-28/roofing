import type { Metadata } from "next";
import "./globals.css";

import { Inter, Montserrat } from 'next/font/google';


const inter = Inter({ 
  subsets: ['latin'], 
  display: 'swap',
  variable: '--font-inter' // Nos permite usarla en Tailwind o CSS si es necesario
});

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  display: 'swap',
  variable: '--font-montserrat' 
});

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
        {/* Eliminamos los links de Google Fonts para que Next.js las optimice localmente */}
        
        {/* Material Symbols Outlined (Este sí lo dejamos como link porque es de iconos) */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      {/* 3. Inyectamos las fuentes optimizadas directamente en el body */}
      <body className={`${inter.className} ${inter.variable} ${montserrat.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
