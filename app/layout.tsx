import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./motion.css";
import { CartProvider } from "@/lib/cart";`nimport StructuredData from "@/components/StructuredData";
import MotionProvider from "@/components/MotionProvider";
import { SITE_URL, SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION, KEYWORDS, OG_IMAGE } from "@/lib/seo";

const FULL_TITLE = SITE_NAME + " | " + SITE_TAGLINE;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#123B2A",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: FULL_TITLE,
    template: "%s | " + SITE_NAME,
  },
  description: "Explore Chiniot Pakwan for traditional Chinioti food, mutton kunna, biryani, pulao and catering services. View our menu, prices and ordering information.",
  keywords: KEYWORDS,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: FULL_TITLE,
    description: "Explore Chiniot Pakwan for traditional Chinioti food, mutton kunna, biryani, pulao and catering services. View our menu, prices and ordering information.",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: FULL_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: FULL_TITLE,
    description: "Explore Chiniot Pakwan for traditional Chinioti food, mutton kunna, biryani, pulao and catering services. View our menu, prices and ordering information.",
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
  // NOTE: no global canonical here. Each page sets its own, otherwise every page would point to the home page.
  category: "food",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&display=swap"
          rel="stylesheet"
        />
        <meta name="geo.region" content="PK-PB" />
        <meta name="geo.placename" content="Lahore" />
      </head>
      <body>`n        <StructuredData />
        <CartProvider>{children}</CartProvider>
        <MotionProvider />
      </body>
    </html>
  );
}
