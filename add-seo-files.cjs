const fs = require("fs");
const path = require("path");

const files = {

  // ============ SEO CONFIG ============
  "lib/seo.ts": `export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://chiniotpakwan.com";

export const SITE_NAME = "Chiniot Pakwan";
export const SITE_TAGLINE = "Authentic Pakistani Catering & Daig Service";
export const SITE_DESCRIPTION =
  "Premium Pakistani catering and daig service in Lahore, Faisalabad, Karachi, and Islamabad. Order authentic mutton kunna, chicken korma, biryani, and wedding catering online.";

export const CONTACT = {
  phone: "03009219945",
  phoneDisplay: "0300 9219945",
  whatsapp: "923009219945",
  email: "support@chiniotpakwan.pk",
};

export const LOCATIONS = [
  { city: "Lahore", region: "Punjab", mapsUrl: "https://maps.app.goo.gl/PHrv4jNuB9pzYnPWA" },
  { city: "Faisalabad", region: "Punjab", mapsUrl: "https://maps.app.goo.gl/HE5EuPym2SPgAWAm7" },
  { city: "Karachi", region: "Sindh", mapsUrl: "https://maps.app.goo.gl/1irXfZdRG5Yqj3688" },
  { city: "Islamabad", region: "Islamabad Capital Territory", mapsUrl: "https://share.google/YIDWLWKSEAjdOohE5" },
];

export const KEYWORDS = [
  "Chiniot Pakwan",
  "daig service Lahore",
  "Pakistani catering Lahore",
  "mutton kunna Lahore",
  "wedding catering Lahore",
  "chicken white korma daig",
  "chicken nihari daig",
  "biryani daig Lahore",
  "kabuli pulao daig",
  "mutton palak",
  "Chinioti cuisine",
  "daig price Lahore",
  "nisar daig Lahore",
  "mehndi catering",
  "walima catering",
  "aqeeqah catering",
  "corporate catering Lahore",
  "family daig order",
  "Chiniot Pakwan menu",
  "Chiniot Pakwan price list",
];

export function getBaseUrl() {
  return SITE_URL.replace(/\\/$/, "");
}`,

  // ============ STRUCTURED DATA HELPERS ============
  "lib/structuredData.ts": `import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, CONTACT, LOCATIONS } from "./seo";

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    "@id": SITE_URL + "#business",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    priceRange: "Rs. 5,500 - Rs. 60,000",
    servesCuisine: ["Pakistani", "Chinioti", "Mughlai", "Halal"],
    address: LOCATIONS.map((loc) => ({
      "@type": "PostalAddress",
      addressLocality: loc.city,
      addressRegion: loc.region,
      addressCountry: "PK",
    })),
    areaServed: LOCATIONS.map((loc) => loc.city),
    sameAs: [
      "https://www.facebook.com/share/1LTqwqsDo8/",
    ],
    image: SITE_URL + "/og-image.jpg",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "127",
    },
  };
}

export function getProductSchema(product: {
  name: string;
  description: string;
  image: string;
  priceFrom: number;
  priceTo: number;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "PKR",
      lowPrice: product.priceFrom,
      highPrice: product.priceTo,
      availability: "https://schema.org/InStock",
      url: SITE_URL + "/menu/" + product.slug,
    },
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: SITE_URL + item.url,
    })),
  };
}`

};

for (const [filePath, content] of Object.entries(files)) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log("Created: " + filePath);
}
console.log("\nSEO files created successfully!");
