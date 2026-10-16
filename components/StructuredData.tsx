import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, CONTACT, LOCATIONS, citySlug } from "@/lib/seo";

export default function StructuredData() {
  const orgId = SITE_URL + "/#organization";
  const graph = [
    {
      "@type": "Organization",
      "@id": orgId,
      name: SITE_NAME,
      url: SITE_URL,
      logo: SITE_URL + "/logo.png",
      email: CONTACT.email,
      telephone: "+" + CONTACT.whatsapp,
      contactPoint: [{ "@type": "ContactPoint", telephone: "+" + CONTACT.whatsapp, contactType: "customer service", areaServed: "PK", availableLanguage: ["en", "ur"] }],
    },
    {
      "@type": "WebSite",
      "@id": SITE_URL + "/#website",
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en-PK",
      publisher: { "@id": orgId },
    },
    ...LOCATIONS.map((l) => ({
      "@type": "FoodEstablishment",
      "@id": SITE_URL + "/daig-service/" + citySlug(l.city) + "#branch",
      name: SITE_NAME + " " + l.city,
      url: SITE_URL + "/daig-service/" + citySlug(l.city),
      parentOrganization: { "@id": orgId },
      telephone: "+" + CONTACT.whatsapp,
      servesCuisine: ["Pakistani", "Chinioti"],
      hasMap: l.mapsUrl,
      address: { "@type": "PostalAddress", addressLocality: l.city, addressRegion: l.region, addressCountry: "PK" },
      areaServed: { "@type": "City", name: l.city },
    })),
  ];
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
