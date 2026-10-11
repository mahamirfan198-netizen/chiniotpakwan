const fs = require("fs");
const path = require("path");

const files = {

  "data/branches.ts": `export type Branch = {
  id: string;
  name: string;
  address: string;
  city: string;
  mapsUrl: string;
  phone: string;
};

export const BRANCHES: Branch[] = [
  {
    id: "lahore",
    name: "Chiniot Pakwan Food Catering",
    address: "Lahore, Pakistan",
    city: "Lahore",
    mapsUrl: "https://maps.app.goo.gl/PHrv4jNuB9pzYnPWA",
    phone: "03009219945",
  },
  {
    id: "faisalabad",
    name: "Chiniot Pakwan Faisalabad",
    address: "Faisalabad, Pakistan",
    city: "Faisalabad",
    mapsUrl: "https://maps.app.goo.gl/HE5EuPym2SPgAWAm7",
    phone: "03009219945",
  },
  {
    id: "karachi",
    name: "Chiniot Pakwan Karachi",
    address: "Karachi, Pakistan",
    city: "Karachi",
    mapsUrl: "https://maps.app.goo.gl/1irXfZdRG5Yqj3688",
    phone: "03009219945",
  },
  {
    id: "islamabad",
    name: "Chiniot Pakwan Islamabad",
    address: "Islamabad, Pakistan",
    city: "Islamabad",
    mapsUrl: "https://share.google/YIDWLWKSEAjdOohE5",
    phone: "03009219945",
  },
];

export const FACEBOOK_URL = "https://www.facebook.com/share/1LTqwqsDo8/";
export const WHATSAPP_NUMBER = "923009219945";
export const PHONE_NUMBER = "03009219945";
export const EMAIL = "support@chiniotpakwan.pk";`,

  "app/locations/page.tsx": `"use client";

import Link from "next/link";
import { BRANCHES, FACEBOOK_URL, PHONE_NUMBER } from "@/data/branches";

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <nav className="sticky top-0 z-50 bg-emerald-deep shadow-luxe">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center">
              <span className="text-xl">🍛</span>
            </div>
            <span className="font-display text-lg font-bold text-ivory hidden sm:block">Chiniot Pakwan</span>
          </Link>
          <Link href="/" className="text-ivory/80 hover:text-gold transition text-sm">Back to Home</Link>
        </div>
      </nav>

      <section className="bg-emerald-deep py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gold tracking-[0.3em] text-xs uppercase mb-3 font-semibold">Visit Us</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-ivory mb-4">
            Our Locations Across Pakistan
          </h1>
          <div className="divider-gold" />
          <p className="text-ivory/70 max-w-2xl mx-auto mt-6">
            Serving authentic Pakistani cuisine in Lahore, Faisalabad, Karachi, and Islamabad.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BRANCHES.map((branch) => (
            <div key={branch.id} className="luxe-card p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gold-gradient flex items-center justify-center shrink-0 text-2xl">
                  📍
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-bold text-emerald-deep">{branch.name}</h3>
                  <p className="text-xs text-gold tracking-widest uppercase mt-1">{branch.city}</p>
                </div>
              </div>

              <p className="text-sm text-charcoal-soft mb-4">{branch.address}</p>

              <div className="flex flex-col gap-2">
                <a
                  href={branch.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-deep text-ivory font-semibold text-sm hover:bg-emerald-light transition"
                >
                  🗺️ Open in Google Maps
                </a>
                <a
                  href={"tel:" + PHONE_NUMBER}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-ivory-warm text-emerald-deep font-semibold text-sm hover:bg-gold/20 transition"
                >
                  📞 Call: {PHONE_NUMBER}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Facebook CTA */}
        <div className="mt-12 luxe-card p-8 text-center">
          <h3 className="font-display text-2xl font-bold text-emerald-deep mb-3">Follow Us on Facebook</h3>
          <p className="text-charcoal-soft mb-6">See our latest dishes, offers, and event highlights.</p>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-white transition hover:opacity-90"
            style={{ background: "#1877F2" }}
          >
            📘 Follow Chiniot Pakwan
          </a>
        </div>
      </main>
    </div>
  );
}`

};

for (const [filePath, content] of Object.entries(files)) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log("Created: " + filePath);
}
console.log("\nAll files created successfully!");
