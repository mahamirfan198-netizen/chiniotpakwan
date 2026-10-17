import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Ordering, pricing, delivery and catering booking terms for Chiniot Pakwan daig and catering services.",
  alternates: { canonical: "/terms" },
};

const sections: { h: string; p: string }[] = [
  { h: "Orders", p: "An order is confirmed once our team has contacted you by phone or WhatsApp and agreed the dish, quantity, date and delivery address. Large orders and catering events may require advance notice and an advance payment." },
  { h: "Prices", p: "Prices shown on the website are in Pakistani Rupees and may change with ingredient costs. The price confirmed with you at the time of booking applies to your order." },
  { h: "Delivery", p: "Delivery times are estimates and depend on the branch, distance and traffic. Please make sure someone is available to receive the order at the address you give us." },
  { h: "Cancellations and changes", p: "Please contact us as early as possible to change or cancel an order. Food that has already been prepared for your order may not be refundable." },
  { h: "Food and allergens", p: "Our dishes may contain dairy, nuts, spices and other common allergens. Tell us about any allergies before ordering." },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm font-semibold text-emerald-deep hover:underline">Back to home</Link>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-emerald-deep mt-6 mb-2">Terms & Conditions</h1>
        <p className="text-sm text-charcoal-soft mb-10">Last updated: October 2026</p>
        <div className="space-y-8 text-charcoal-soft leading-relaxed">
          {sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-display text-2xl font-bold text-emerald-deep mb-2">{s.h}</h2>
              <p>{s.p}</p>
            </section>
          ))}
          <section>
            <h2 className="font-display text-2xl font-bold text-emerald-deep mb-2">Contact</h2>
            <p>
              {SITE_NAME}: <a className="underline" href={"tel:" + CONTACT.phone}>{CONTACT.phoneDisplay}</a> or{" "}
              <a className="underline" href={"mailto:" + CONTACT.email}>{CONTACT.email}</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
