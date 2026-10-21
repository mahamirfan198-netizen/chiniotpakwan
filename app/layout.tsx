import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./motion.css";
import { CartProvider } from "@/lib/cart";
import MotionProvider from "@/components/MotionProvider";
import StructuredData from "@/components/StructuredData";
import GoogleTags from "@/components/GoogleTags";
import { SITE_URL, SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION, KEYWORDS, OG_IMAGE } from "@/lib/seo";

const FULL_TITLE = SITE_NAME + " | " + SITE_TAGLINE;

const GSC = process.env.NEXT_PUBLIC_GSC_VERIFICATION?.replace(/["'\s]/g, "");
const BING = process.env.NEXT_PUBLIC_BING_VERIFICATION?.replace(/["'\s]/g, "");
const verification: Metadata["verification"] = {
  ...(GSC ? { google: GSC } : {}),
  ...(BING ? { other: { "msvalidate.01": BING } } : {}),
};

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
  description: SITE_DESCRIPTION,
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
    description: SITE_DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: FULL_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: FULL_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  ...(Object.keys(verification).length ? { verification } : {}),
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
      <body>
        <StructuredData />
        <CartProvider>{children}</CartProvider>
        <MotionProvider />
        <GoogleTags />
      </body>
    </html>
  );
}