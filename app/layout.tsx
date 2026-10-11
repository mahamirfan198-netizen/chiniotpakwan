import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { SITE_URL, SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION, KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME + " — " + SITE_TAGLINE,
    template: "%s | " + SITE_NAME,
  },
  description: SITE_DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME + " — " + SITE_TAGLINE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: SITE_NAME + " — " + SITE_TAGLINE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME + " — " + SITE_TAGLINE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
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
        <link rel="canonical" href={SITE_URL} />
      </head>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
