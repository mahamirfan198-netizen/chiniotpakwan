import { Metadata } from "next";
import ContactForm from "./ContactForm";
import { CONTACT, LOCATIONS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us: Daig Orders & Catering",
  description:
    "Call or WhatsApp Chiniot Pakwan on 0300 8008672 to order daig or book wedding catering in Lahore, Faisalabad, Karachi or Islamabad.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Chiniot Pakwan — Order Authentic Chinioti Daig",
    description:
      "Reach us on WhatsApp, phone, or email. We respond quickly to catering and daig inquiries across Pakistan.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-emerald-deep mb-4">
          Contact Chiniot Pakwan
        </h1>
        <p className="text-charcoal-soft text-lg mb-12">
          For daig orders, wedding catering, or event inquiries — reach us directly.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <h2 className="font-display text-xl font-bold text-emerald-deep mb-4">Direct Contact</h2>
            <div className="space-y-3">
              <a href={`tel:${CONTACT.phone}`} className="block text-charcoal-soft hover:text-gold">
                📞 <strong>Phone:</strong> {CONTACT.phoneDisplay}
              </a>
              <a href={`https://wa.me/${CONTACT.whatsapp}`} className="block text-charcoal-soft hover:text-gold" target="_blank" rel="noopener noreferrer">
                💬 <strong>WhatsApp:</strong> {CONTACT.phoneDisplay}
              </a>
              <a href={`mailto:${CONTACT.email}`} className="block text-charcoal-soft hover:text-gold">
                ✉️ <strong>Email:</strong> {CONTACT.email}
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <h2 className="font-display text-xl font-bold text-emerald-deep mb-4">Our Branches</h2>
            <ul className="space-y-2">
              {LOCATIONS.map((loc) => (
                <li key={loc.city}>
                  <a
                    href={loc.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-charcoal-soft hover:text-gold"
                  >
                    📍 {loc.city}, {loc.region}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-10 shadow-soft">
          <h2 className="font-display text-2xl font-bold text-emerald-deep mb-6">
            Send Us a Message
          </h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
