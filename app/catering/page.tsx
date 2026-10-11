"use client";

import { useState } from "react";
import Link from "next/link";

export default function CateringPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    eventType: "Wedding",
    eventDate: "",
    guestCount: "",
    location: "",
    preferredDish: "",
    notes: "",
  });
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const res = await fetch("/api/catering", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setBusy(false);

    if (!res.ok) {
      const d = await res.json().catch(() => ({ error: "Failed" }));
      setError(d.error || "Submission failed");
      return;
    }

    setSuccess(true);

    // Also open WhatsApp with the enquiry
    const msg = encodeURIComponent(
      "Assalam-o-Alaikum! Catering Enquiry:\n\n" +
      "👤 " + form.name + "\n" +
      "📞 " + form.phone + "\n" +
      "🎉 Event: " + form.eventType + "\n" +
      (form.eventDate ? "📅 Date: " + form.eventDate + "\n" : "") +
      (form.guestCount ? "👥 Guests: " + form.guestCount + "\n" : "") +
      (form.location ? "📍 Location: " + form.location + "\n" : "") +
      (form.preferredDish ? "🍛 Dishes: " + form.preferredDish + "\n" : "") +
      (form.notes ? "\n📝 " + form.notes : "")
    );
    window.open("https://wa.me/923009219945?text=" + msg, "_blank");
  }

  if (success) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
        <div className="luxe-card p-10 max-w-lg w-full text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gold-gradient flex items-center justify-center mb-6">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-emerald-deep mb-2">Enquiry Received!</h1>
          <p className="text-charcoal-soft mb-6">We'll contact you within 24 hours to discuss your event.</p>
          <Link href="/" className="btn-gold">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <nav className="sticky top-0 z-50 bg-emerald-deep shadow-luxe">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center">
              <span className="text-xl">🍛</span>
            </div>
            <span className="font-display text-lg font-bold text-ivory">Chiniot Pakwan</span>
          </Link>
          <Link href="/" className="text-ivory/80 hover:text-gold transition text-sm">← Home</Link>
        </div>
      </nav>

      <section className="bg-emerald-deep py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold tracking-[0.3em] text-xs uppercase mb-3 font-semibold">— Book Catering —</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-ivory mb-4">Wedding &amp; Event Catering</h1>
          <div className="divider-gold" />
          <p className="text-ivory/70 max-w-2xl mx-auto mt-6">
            Complete catering solutions for weddings, mehndi, corporate events, and family gatherings across Pakistan.
          </p>
        </div>
      </section>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="luxe-card p-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Your Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Phone Number *</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Email (optional)</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Event Type *</label>
              <select value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} className="w-full px-4 py-3 rounded-xl border bg-white">
                <option value="Wedding">Wedding</option>
                <option value="Walima">Walima</option>
                <option value="Mehndi">Mehndi</option>
                <option value="Aqeeqah">Aqeeqah</option>
                <option value="Corporate">Corporate Event</option>
                <option value="Religious">Religious Gathering / Niaz</option>
                <option value="Family">Family Gathering</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Event Date</label>
              <input type="date" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} className="w-full px-4 py-3 rounded-xl border" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Estimated Guests</label>
              <input type="number" value={form.guestCount} onChange={(e) => setForm({ ...form, guestCount: e.target.value })} placeholder="e.g. 200" className="w-full px-4 py-3 rounded-xl border" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">City / Location</label>
              <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-3 rounded-xl border bg-white">
                <option value="">Select city</option>
                <option value="Lahore">Lahore</option>
                <option value="Karachi">Karachi</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Faisalabad">Faisalabad</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Preferred Dishes</label>
            <input type="text" value={form.preferredDish} onChange={(e) => setForm({ ...form, preferredDish: e.target.value })} placeholder="e.g. Chicken Korma, Mutton Kunna, Biryani" className="w-full px-4 py-3 rounded-xl border" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Additional Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl border resize-none" placeholder="Any specific requirements..." />
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</div>}

          <button type="submit" disabled={busy} className="w-full py-4 rounded-xl font-bold text-emerald-deep bg-gold-gradient shadow-gold hover:opacity-90 transition disabled:opacity-60">
            {busy ? "Sending..." : "Send Enquiry"}
          </button>
        </form>
      </main>
    </div>
  );
}