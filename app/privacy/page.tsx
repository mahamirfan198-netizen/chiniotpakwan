import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Chiniot Pakwan collects, uses and protects your personal information when you order daig or book catering.",
  alternates: { canonical: "/privacy" },
};

const sections: { h: string; p: string }[] = [
  { h: "What we collect", p: "When you place an order, request catering or use our contact form, we collect your name, phone number, delivery address, email (if provided) and the details of your order or enquiry." },
  { h: "How we use it", p: "We use this information only to prepare and deliver your order, confirm details with you by phone, WhatsApp or email, answer your questions and improve our service. We do not sell your personal information." },
  { h: "Who can see it", p: "Our team sees your details to fulfil your order. We also rely on service providers for hosting, image storage and messaging, who process data on our behalf only as needed to run the website." },
  { h: "Cart and local storage", p: "Your shopping cart is kept in your browser so it is still there when you return. We do not use it to track you across other websites." },
  { h: "Your choices", p: "You can ask us to correct or delete your information at any time by contacting us." },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm font-semibold text-emerald-deep hover:underline">Back to home</Link>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-emerald-deep mt-6 mb-2">Privacy Policy</h1>
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
