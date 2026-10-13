export const dynamic = 'force-dynamic';
import { getLocalBusinessSchema } from "@/lib/structuredData";
import Script from "next/script";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function Home() {

  const featured = await prisma.product.findMany({
    where: { available: true },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: { category: { select: { name: true } } },
  });

  const kunna = await prisma.product.findFirst({
    where: { name: { contains: "Kunna", mode: "insensitive" } },
  });
  return (
        <div className="min-h-screen bg-ivory">      {/* Structured Data for Local Business */}
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getLocalBusinessSchema()),
        }}
      />
      {/* ============ PREMIUM NAVIGATION ============ */}
      <nav className="absolute top-0 left-0 right-0 z-50 py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold">
              <span className="text-2xl">🍛</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-display text-xl font-bold text-white leading-none">
                Chiniot Pakwan
              </p>
              <p className="text-[10px] tracking-[0.2em] text-gold-bright uppercase mt-1">
                Authentic Catering
              </p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {[
              { href: "/", label: "Home" },
              { href: "/menu", label: "Menu" },
              { href: "/catering", label: "Catering" },
              { href: "/locations", label: "Locations" },
              { href: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white hover:text-gold-bright transition text-sm font-semibold tracking-wider uppercase"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/cart" className="text-white text-2xl relative hover:text-gold-bright transition">
              🛒
            </Link>
            <Link
              href="/menu"
              className="hidden sm:inline-block px-5 py-2 rounded-full bg-gold-gradient text-emerald-deep text-xs font-bold tracking-wider uppercase shadow-gold hover:scale-105 transition"
            >
              Order Now
            </Link>
          </div>
        </div>
      </nav>

      {/* ============ CINEMATIC HERO ============ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1633945274309-2c16c9682a8c?w=1920')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Dark overlay - strong */}
        <div className="absolute inset-0 z-10" style={{ background: "rgba(11, 38, 32, 0.85)" }} />

        {/* Additional vignette gradient */}
        <div className="absolute inset-0 z-10" style={{ background: "radial-gradient(circle at center, rgba(11, 38, 32, 0.4) 0%, rgba(9, 20, 16, 0.9) 100%)" }} />

        {/* Gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold to-transparent z-20" />

        {/* Hero Content */}
        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center">
          <p className="text-gold-bright tracking-[0.35em] text-sm uppercase mb-6 font-bold drop-shadow-lg">
            — Great Pakistani Cuisine —
          </p>

          <p className="font-display italic text-2xl md:text-3xl text-gold-bright mb-4 drop-shadow-md">
            Authentic &amp; Delicious
          </p>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-8 drop-shadow-2xl">
                       AUTHENTIC <span className="text-gold-bright" style={{ textShadow: "0 4px 20px rgba(232, 200, 118, 0.4)" }}>PAKISTANI</span>
            <br />
            <span className="text-2xl md:text-4xl font-normal">Daig & Catering in Lahore</span>
          </h1>

          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-20 h-0.5 bg-gold-bright" />
            <span className="text-gold-bright text-lg">✦</span>
            <div className="w-20 h-0.5 bg-gold-bright" />
          </div>

          <p className="text-white text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-lg">
            From family gatherings to grand celebrations — discover authentic
            Pakistani daigs, freshly prepared mutton kunna, and premium
            catering crafted for your special occasions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/menu"
              className="px-8 py-4 rounded-full bg-gold-gradient text-emerald-deep font-bold tracking-wider uppercase text-sm shadow-gold hover:scale-105 transition inline-flex items-center gap-2"
            >
              Explore Our Menu <span>→</span>
            </Link>
            <Link
              href="/catering"
              className="px-8 py-4 rounded-full border-2 border-white text-white font-bold tracking-wider uppercase text-sm hover:bg-white hover:text-emerald-deep transition inline-flex items-center gap-2"
            >
              Book Catering
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="w-6 h-10 rounded-full border-2 border-gold-bright/60 flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-gold-bright animate-pulse" />
          </div>
        </div>
      </section>

      {/* ============ WELCOME CARD ============ */}
      <section className="relative -mt-32 z-30 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="luxe-card p-8 md:p-14 text-center bg-white shadow-luxe">
            <p className="text-gold tracking-[0.3em] text-sm uppercase mb-4 font-bold">
              Welcome to Chiniot Pakwan
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-emerald-deep mb-4">
              Home of Authentic <span className="text-gold italic">Chinioti Taste</span>
            </h2>
            <div className="divider-gold mb-6" />
            <p className="text-charcoal-soft text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
              We are Lahore's trusted catering service, serving fresh and
              authentic Pakistani daigs, traditional biryani, aromatic rice
              dishes, and our signature mutton kunna. Every dish is cooked with
              premium ingredients and traditional recipes passed down through
              generations — perfect for weddings, family gatherings, corporate
              events, and religious occasions.
            </p>
          </div>
        </div>
      </section>

      {/* ============ SERVICE CARDS ============ */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "🍲",
              title: "Signature Dishes",
              desc: "Authentic Chinioti recipes with premium ingredients.",
              href: "/menu",
            },
            {
              icon: "🍛",
              title: "Daig Service",
              desc: "Freshly prepared daigs for every occasion and guest count.",
              href: "/menu",
            },
            {
              icon: "💍",
              title: "Wedding Catering",
              desc: "Complete catering solutions for weddings and events.",
              href: "/catering",
            },
          ].map((s) => (
            <Link key={s.title} href={s.href} className="luxe-card p-8 text-center group">
              <div className="w-16 h-16 mx-auto rounded-full bg-gold-gradient flex items-center justify-center mb-4 shadow-gold group-hover:scale-110 transition">
                <span className="text-3xl">{s.icon}</span>
              </div>
              <h3 className="font-display text-xl font-bold text-emerald-deep mb-2">
                {s.title}
              </h3>
              <p className="text-sm text-charcoal-soft leading-relaxed">{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ SIGNATURE KUNNA SECTION ============ */}
      <section className="py-20 px-6 bg-emerald-deep relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 30% 50%, rgba(18, 59, 42, 0.5) 0%, rgba(9, 20, 16, 0.9) 100%)" }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold to-transparent" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="order-2 lg:order-1">
            <p className="text-gold-bright tracking-[0.3em] text-sm uppercase mb-4 font-bold drop-shadow-lg">
              — Our Signature —
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              Mutton <span className="text-gold-bright italic">Kunna</span>
              <br />
              The Pride of Chiniot
            </h2>
            <p className="text-white/95 leading-relaxed mb-8 text-lg drop-shadow-md">
              Slow-cooked in traditional clay pots for hours, our mutton kunna
              is a centuries-old Chinioti recipe. Tender mutton, aromatic
              spices, and a rich, silky gravy — the perfect centerpiece for
              your most special occasions.
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gold-gradient text-emerald-deep font-bold tracking-wider uppercase text-sm shadow-gold hover:scale-105 transition"
            >
              Order Kunna <span>→</span>
            </Link>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="aspect-square rounded-3xl overflow-hidden border-4 border-gold/40 shadow-luxe">
              <img
                src={kunna?.image || "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800"}
                alt="Mutton Kunna"
                className="w-full h-full object-cover hover:scale-105 transition duration-700"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gold-gradient flex items-center justify-center shadow-luxe rotate-12">
              <div className="text-center text-emerald-deep">
                <p className="text-2xl font-bold">★</p>
                <p className="text-[10px] font-bold tracking-widest uppercase">
                  Best in
                  <br />
                  Lahore
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MENU PREVIEW ============ */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold tracking-[0.3em] text-sm uppercase mb-4 font-bold">
              — Explore Our Menu —
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-emerald-deep mb-4">
              Signature Pakistani Dishes
            </h2>
            <div className="divider-gold" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((item) => (
              <Link
                key={item.id}
                href={"/menu/" + item.id}
                className="luxe-card overflow-hidden group relative"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                  {item.popular && (
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gold text-emerald-deep text-[10px] font-bold tracking-wider uppercase shadow-luxe">
                      ? Popular
                    </span>
                  )}
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-display text-base font-bold text-emerald-deep mb-1">
                    {item.name}
                  </h3>
                  <p className="text-gold font-bold text-sm">From Rs. {item.priceFrom.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/menu" className="btn-emerald inline-flex items-center gap-2">
              View Complete Menu →
            </Link>
          </div>
        </div>
      </section>

      {/* ============ LOCATIONS CTA ============ */}
      <section className="py-20 px-6 bg-ivory-warm">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold tracking-[0.3em] text-sm uppercase mb-4 font-bold">
            — Visit Us —
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-emerald-deep mb-4">
            Our Locations Across Pakistan
          </h2>
          <div className="divider-gold" />
          <p className="text-charcoal-soft max-w-2xl mx-auto mt-6 mb-8 text-lg">
            Serving Lahore, Faisalabad, Karachi, and Islamabad. Click below to see all our branches on Google Maps.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {["Lahore", "Faisalabad", "Karachi", "Islamabad"].map((city) => (
              <Link
                key={city}
                href="/locations"
                className="px-5 py-2.5 rounded-full bg-white border-2 border-gold/40 text-emerald-deep font-bold text-sm hover:bg-gold/20 transition shadow-soft"
              >
                📍 {city}
              </Link>
            ))}
          </div>

          <Link href="/locations" className="btn-gold inline-block">
            View All Locations →
          </Link>
        </div>
      </section>

      {/* ============ CTA BANNER ============ */}
      <section className="py-20 px-6 bg-gold-gradient">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: "#0B2620" }}>
            Ready to Order?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto font-semibold" style={{ color: "#0B2620" }}>
            Call us now for fresh daig orders, or book catering for your next celebration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:03008008672"
              className="px-8 py-4 rounded-full font-bold tracking-wider uppercase text-sm shadow-luxe hover:scale-105 transition inline-flex items-center justify-center gap-2"
              style={{ background: "#0B2620", color: "#FAF6EE" }}
            >
              📞 Call Now
            </a>
            <a
              href="https://wa.me/923008008672"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full bg-white font-bold tracking-wider uppercase text-sm shadow-luxe hover:scale-105 transition inline-flex items-center justify-center gap-2"
              style={{ color: "#0B2620" }}
            >
              💬 WhatsApp Order
            </a>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-emerald-deep text-ivory py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center">
                  <span className="text-2xl">🍛</span>
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-white">Chiniot Pakwan</p>
                  <p className="text-[10px] tracking-[0.2em] text-gold-bright uppercase">
                    Authentic Catering
                  </p>
                </div>
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-4">
                Premium Pakistani catering and daig service across Pakistan.
              </p>
              <a
                href="https://www.facebook.com/share/1LTqwqsDo8/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-bold transition hover:opacity-90"
                style={{ background: "#1877F2" }}
              >
                📘 Follow on Facebook
              </a>
            </div>

            <div>
              <h4 className="font-display text-base font-bold mb-4 text-gold-bright">
                Quick Links
              </h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-white/80 hover:text-gold-bright transition">Home</Link></li>
                <li><Link href="/menu" className="text-white/80 hover:text-gold-bright transition">Menu</Link></li>
                <li><Link href="/catering" className="text-white/80 hover:text-gold-bright transition">Catering</Link></li>
                <li><Link href="/locations" className="text-white/80 hover:text-gold-bright transition">Locations</Link></li>
                <li><Link href="/contact" className="text-white/80 hover:text-gold-bright transition">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display text-base font-bold mb-4 text-gold-bright">
                Menu
              </h4>
              <ul className="space-y-2 text-sm">
                {["Chicken", "Beef", "Rice & Biryani", "Mutton", "Desserts"].map((l) => (
                  <li key={l}>
                    <Link href="/menu" className="text-white/80 hover:text-gold-bright transition">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display text-base font-bold mb-4 text-gold-bright">
                Contact
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="tel:03008008672"
                    className="text-white/80 hover:text-gold-bright transition flex items-center gap-2"
                  >
                    📞 0300 8008672
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:support@chiniotpakwan.pk"
                    className="text-white/80 hover:text-gold-bright transition flex items-center gap-2 break-all"
                  >
                    ✉️ support@chiniotpakwan.pk
                  </a>
                </li>
                <li className="text-white/80">
                  📍 Lahore · Faisalabad · Karachi · Islamabad
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
            <p>© 2026 Chiniot Pakwan. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-gold-bright transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-gold-bright transition">
                Terms &amp; Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}