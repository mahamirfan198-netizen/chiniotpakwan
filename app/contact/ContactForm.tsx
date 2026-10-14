"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="text-center py-8">
        <p className="text-2xl mb-2">✅</p>
        <p className="font-display text-xl text-emerald-deep">Message sent!</p>
        <p className="text-charcoal-soft text-sm mt-2">We will get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <input
          required
          type="text"
          placeholder="Your Name *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="px-4 py-3 rounded-xl border border-ivory-warm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold bg-ivory"
        />
        <input
          required
          type="tel"
          placeholder="Phone Number *"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="px-4 py-3 rounded-xl border border-ivory-warm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold bg-ivory"
        />
      </div>
      <input
        type="email"
        placeholder="Email (optional)"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full px-4 py-3 rounded-xl border border-ivory-warm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold bg-ivory"
      />
      <textarea
        required
        rows={5}
        placeholder="Your Message *"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="w-full px-4 py-3 rounded-xl border border-ivory-warm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold bg-ivory resize-none"
      />
      {status === "error" && (
        <p className="text-red-600 text-sm">Something went wrong. Please try again or contact us on WhatsApp.</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full px-6 py-4 rounded-xl bg-emerald-deep text-ivory font-bold tracking-wider uppercase text-sm shadow-luxe hover:scale-[1.02] transition disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
