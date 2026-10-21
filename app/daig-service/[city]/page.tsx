import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CONTACT, LOCATIONS, SITE_NAME, citySlug } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCATIONS.map((l) => ({ city: citySlug(l.city) }));
}

const findCity = (slug: string) => LOCATIONS.find((l) => citySlug(l.city) === slug);

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const loc = findCity(city);
  if (!loc) return { title: "Page not found", robots: { index: false, follow: false } };

  const path = "/daig-service/" + citySlug(loc.city);
  const title = "Daig Service in " + loc.city + " | Chiniot Pakwan";
  const description = "Looking for daig catering in " + loc.city + "? Explore available biryani, pulao, qorma and mutton kunna options, serving sizes, prices and booking details.";

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", url: path, title: title + " | " + SITE_NAME, description },
  };
}

const DISHES = [
  "Mutton kunna",
  "Chicken white korma",
  "Chicken nihari",
  "Biryani",
  "Kabuli pulao",
  "Mutton palak",
];

const OCCASIONS = ["Mehndi", "Barat and walima", "Aqeeqah", "Corporate lunches and events", "Family gatherings"];

const STEPS = [
  "Pick your dishes on the menu and note how many guests you are feeding.",
  "Call or WhatsApp us with the date, quantity and delivery address.",
  "We confirm the details with you. Large orders and events may need advance notice and an advance payment.",
  "Your daig is prepared fresh and delivered to your address.",
];

export default async function Page({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const loc = findCity(city);
  if (!loc) notFound();

  const others = LOCATIONS.filter((l) => l.city !== loc.city);

  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <nav aria-label="Breadcrumb" className="text-sm text-charcoal-soft mb-6">
          <Link href="/" className="hover:underline">Home</Link> <span aria-hidden="true">/</span>{" "}
          <Link href="/locations" className="hover:underline">Locations</Link> <span aria-hidden="true">/</span>{" "}
          <span>{loc.city}</span>
        </nav>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-emerald-deep mb-4">
          Daig Service &amp; Catering in {loc.city}
        </h1>
        <p className="text-lg text-charcoal-soft leading-relaxed mb-8">
          {SITE_NAME} brings authentic Chinioti cooking to {loc.city}, {loc.region}. Order daig (also spelled degh or deg) for
          your family or book full catering for your event, and our team will confirm every detail with you by phone or WhatsApp.
        </p>

        <div className="flex flex-wrap gap-3 mb-12">
          <Link href="/menu" className="btn-gold inline-block px-6 py-3 rounded-full font-semibold">View menu &amp; prices</Link>
          <a href={"tel:" + CONTACT.phone} className="inline-block px-6 py-3 rounded-full font-semibold border border-emerald-deep text-emerald-deep">
            Call {CONTACT.phoneDisplay}
          </a>
          <a
            href={"https://wa.me/" + CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-full font-semibold border border-emerald-deep text-emerald-deep"
          >
            WhatsApp us
          </a>
        </div>

        <div className="space-y-12 text-charcoal-soft leading-relaxed">
          <section>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-emerald-deep mb-3">What we cook for {loc.city}</h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {DISHES.map((d) => (
                <li key={d} className="luxe-card bg-white rounded-xl px-5 py-4 font-semibold text-emerald-deep shadow-sm">{d}</li>
              ))}
            </ul>
            <p className="mt-4">
              See every dish with its price on the <Link className="underline" href="/menu">full menu</Link>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-emerald-deep mb-3">Catering for every occasion</h2>
            <p className="mb-3">We cater events of all sizes in {loc.city}, including:</p>
            <ul className="list-disc pl-6 space-y-1">
              {OCCASIONS.map((o) => <li key={o}>{o}</li>)}
            </ul>
            <p className="mt-4">
              Planning something big? Look at our <Link className="underline" href="/catering">catering packages</Link>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-emerald-deep mb-3">How to order in {loc.city}</h2>
            <ol className="list-decimal pl-6 space-y-2">
              {STEPS.map((s) => <li key={s}>{s}</li>)}
            </ol>
          </section>

          <section>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-emerald-deep mb-3">Find our {loc.city} branch</h2>
            <p>
              <a className="underline font-semibold" href={loc.mapsUrl} target="_blank" rel="noopener noreferrer">
                Open the {loc.city} branch on Google Maps
              </a>
              . For delivery questions or a custom quote, call <a className="underline" href={"tel:" + CONTACT.phone}>{CONTACT.phoneDisplay}</a> or
              email <a className="underline" href={"mailto:" + CONTACT.email}>{CONTACT.email}</a>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-emerald-deep mb-3">We also serve</h2>
            <p className="flex flex-wrap gap-x-5 gap-y-2">
              {others.map((o) => (
                <Link key={o.city} className="underline font-semibold text-emerald-deep" href={"/daig-service/" + citySlug(o.city)}>
                  {o.city}
                </Link>
              ))}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}