"use client";

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
            <span className="font-display text-lg font-bold text-ivory hidden sm:block">
              Chiniot Pakwan
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-ivory/80 hover:text-gold transition text-sm font-medium">
              ← Home
            </Link>
            <Link href="/menu" className="text-ivory/80 hover:text-gold transition text-sm font-medium">
              Menu
            </Link>
          </div>
        </div>
      </nav>

      <section className="bg-emerald-deep py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold to-transparent" />
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gold tracking-[0.3em] text-xs uppercase mb-3 font-semibold">
            — Visit Us —
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-ivory mb-4">
            Our <span className="text-gold italic">Locations</span> Across Pakistan
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
                  <h3 className="font-display text-xl font-bold text-emerald-deep">
                    {branch.name}
                  </h3>
                  <p className="text-xs text-gold tracking-widest uppercase mt-1">
                    {branch.city}
                  </p>
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

        <div className="mt-12 luxe-card p-8 md:p-12 text-center">
          <div
            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 text-4xl text-white"
            style={{ background: "#1877F2" }}
          >
            📘
          </div>
          <h3 className="font-display text-2xl md:text-3xl font-bold text-emerald-deep mb-3">
            Follow Us on Facebook
          </h3>
          <p className="text-charcoal-soft mb-6 max-w-md mx-auto">
            See our latest dishes, offers, and event highlights. Join our Facebook community for daily updates.
          </p>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-white transition hover:opacity-90 shadow-luxe"
            style={{ background: "#1877F2" }}
          >
            <span className="text-xl">📘</span>
            Follow Chiniot Pakwan
          </a>
        </div>

        <div className="mt-12 text-center">
          <h3 className="font-display text-2xl font-bold text-emerald-deep mb-3">
            Want to Order or Book Catering?
          </h3>
          <p className="text-charcoal-soft mb-6">
            Call us or send a WhatsApp message for instant response.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={"tel:" + PHONE_NUMBER} className="btn-emerald inline-block">
              📞 Call Now
            </a>
            <a
              href="https://wa.me/923009219945"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp justify-center py-4 px-8"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </main>

      <footer className="bg-emerald-deep text-ivory py-10 px-6 text-center text-sm">
        <p className="text-ivory/60">© 2026 Chiniot Pakwan. All rights reserved.</p>
      </footer>
    </div>
  );
}