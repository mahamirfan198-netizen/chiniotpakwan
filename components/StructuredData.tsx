export default function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Chiniot Pakwan",
    "image": "https://chiniotpakwan.pk/logo.png",
    "url": "https://chiniotpakwan.pk",
    "telephone": "03008008672",
    "priceRange": "Rs. 5,500 - Rs. 60,000",
    "servesCuisine": ["Pakistani", "Chinioti", "Mughlai"],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Lahore",
      "addressRegion": "Punjab",
      "addressCountry": "PK"
    },
    "areaServed": ["Lahore", "Faisalabad", "Karachi", "Islamabad"],
    "hasMenu": "https://chiniotpakwan.pk/menu",
    "acceptsReservations": "False"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
}
