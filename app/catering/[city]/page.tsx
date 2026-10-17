import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { optimizeImage } from "@/lib/img";
import CityLinks, { CITIES } from "@/components/CityLinks";
import { BRANCHES, WHATSAPP_NUMBER, PHONE_NUMBER } from "@/data/branches";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export const dynamic = "force-dynamic";

const PHONE_DISPLAY = "0300 8008672";

export function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

function findCity(slug: string) {
  return CITIES.find((c) => c.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: slug } = await params;
  const city = findCity(slug);
  if (!city) return { title: "Page not found", robots: { index: false, follow: false } };
  const title = `Daig & Wedding Catering in ${city.name}`;
  const description = `Order authentic Chinioti daig, mutton kunna, korma and biryani in ${city.name}. Wedding, mehndi, walima & corporate catering by Chiniot Pakwan. Call ${PHONE_DISPLAY}.`;
  const path = "/catering/" + city.slug;
  return {
    title: { absolute: `${title} | ${SITE_NAME}` },
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", url: path, title: `${title} | ${SITE_NAME}`, description },
  };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: slug } = await params;
  const city = findCity(slug);
  if (!city) notFound();

  const branch = BRANCHES.find((b) => b.id === city.slug);
  let products: { id: string; name: string; image: string; priceFrom: number; priceTo: number }[] = [];
  try {
    products = await prisma.product.findMany({
      where: { available: true },
      orderBy: [{ popular: "desc" }, { createdAt: "desc" }],
      take: 6,
      select: { id: true, name: true, image: true, priceFrom: true, priceTo: true },
    });
  } catch {
    products = [];
  }
  const lowest = products.length ? Math.min(...products.map((p) => p.priceFrom)) : null;

  const faqs = [
    {
      q: `Does Chiniot Pakwan provide daig service in ${city.name}?`,
      a: `Yes. We have a ${city.name} branch. Call or WhatsApp ${PHONE_DISPLAY} to place your daig order.`,
    },
    {
      q: `How do I order a daig in ${city.name}?`,
      a: `Pick a dish from our online menu and check out, or WhatsApp us on ${PHONE_DISPLAY} with the dish, daig size, date and delivery address.`,
    },
    {
      q: `Which events do you cater in ${city.name}?`,
      a: "Weddings, mehndi, walima, aqeeqah, corporate events, religious gatherings (niaz) and family gatherings.",
    },
    ...(lowest
      ? [{
          q: `What are daig prices in ${city.name}?`,
          a: `Daig prices on our menu start from Rs. ${lowest.toLocaleString("en-PK")}. The final price depends on the dish and the daig size you choose.`,
        }]
      : []),
  ];

  const url = `${SITE_URL}/catering/${city.slug}`;
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "FoodEstablishment",
      name: `${SITE_NAME} ${city.name}`,
      url,
      telephone: PHONE_NUMBER,
      servesCuisine: ["Pakistani", "Chinioti", "Halal"],
      address: { "@type": "PostalAddress", addressLocality: city.name, addressCountry: "PK" },
      areaServed: city.name,
      ...(branch ? { hasMap: branch.mapsUrl } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
        { "@type": "ListItem", position: 2, name: "Catering", item: SITE_URL + "/catering" },
        { "@type": "ListItem", position: 3, name: city.name, item: url },
      ],
    },
  ];

  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Assalam o Alaikum, I want to order daig / catering in ${city.name}.`)}`;

  return (
    <div className="min-h-screen bg-ivory">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />

      <nav className="sticky top-0 z-50 bg-emerald-deep shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-lg font-bold text-ivory">Chiniot Pakwan</Link>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/menu" className="text-[#faf6ee]/80 hover:text-[#e8c876] transition">Menu</Link>
            <Link href="/catering" className="text-[#faf6ee]/80 hover:text-[#e8c876] transition">Catering</Link>
            <Link href="/locations" className="text-[#faf6ee]/80 hover:text-[#e8c876] transition">Locations</Link>
          </div>
        </div>
      </nav>

      <header className="bg-emerald-deep py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-ivory mb-4">
            Daig &amp; Wedding Catering in {city.name}
          </h1>
          <p className="text-[#faf6ee]/80 text-lg">
            Authentic Chinioti daig, mutton kunna, chicken korma and biryani for weddings, mehndi, walima, aqeeqah and family gatherings in {city.name}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <a href={wa} className="btn-gold" rel="noopener">Order on WhatsApp</a>
            <Link href="/catering" className="px-8 py-3 rounded-full border-2 border-[#c6a15b] text-[#e8c876] font-bold uppercase text-sm tracking-wider hover:bg-[#c6a15b]/10 transition">
              Get a Catering Quote
            </Link>
          </div>
        </div>
      </header>

      {products.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-emerald-deep text-center mb-8">Popular daigs in {city.name}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((p) => (
                <Link key={p.id} href={"/menu/" + p.id} className="luxe-card overflow-hidden block">
                  <div className="aspect-4/3 overflow-hidden bg-ivory-warm">
                    <img
                      src={optimizeImage(p.image, 500)}
                      alt={`${p.name} daig in ${city.name}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-display font-bold text-emerald-deep">{p.name}</h3>
                    <p className="text-sm text-charcoal-soft mt-1">From Rs. {p.priceFrom.toLocaleString("en-PK")}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/menu" className="btn-gold">See the full menu</Link>
            </div>
          </div>
        </section>
      )}

      <section className="py-16 px-6 bg-ivory-warm">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-emerald-deep text-center mb-8">
            Questions about daig service in {city.name}
          </h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <details key={f.q} className="luxe-card p-5 group">
                <summary className="font-semibold text-emerald-deep cursor-pointer">{f.q}</summary>
                <p className="mt-3 text-charcoal-soft leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
          {branch && (
            <p className="text-center mt-8 text-charcoal-soft">
              Find our {city.name} branch on{" "}
              <a className="underline text-emerald-deep font-semibold" href={branch.mapsUrl} rel="noopener">Google Maps</a>{" "}
              or call <a className="underline text-emerald-deep font-semibold" href={"tel:" + PHONE_NUMBER}>{PHONE_DISPLAY}</a>.
            </p>
          )}
        </div>
      </section>

      <CityLinks current={city.slug} />
    </div>
  );
}
