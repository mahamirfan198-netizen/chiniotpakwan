import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, CONTACT, LOCATIONS } from "./seo";

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
}