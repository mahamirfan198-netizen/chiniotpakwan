import { getLocalBusinessSchema } from "@/lib/structuredData";
import Script from "next/script";
import { prisma } from "@/lib/db";
import Link from "next/link";

export const dynamic = 'force-dynamic';

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
    <div className="min-h-screen bg-ivory">
      {/* Structured Data for Local Business */}
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
              <img src="/logo.png" alt="Chiniot Pakwan" className="w-12 h-12 object-contain" />
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
            {/* NEW: Daig Service Lahore Button */}
            <Link
              href="/daig-service/lahore"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold text-gold-bright text-xs font-bold tracking-wider uppercase hover:bg-gold hover:text-emerald-deep transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              Lahore
            </Link>

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

        <div className="absolute inset-0 z-10" style={{ background: "rgba(11, 38, 32, 0.85)" }} />
        <div className="absolute inset-0 z-10" style={{ background: "radial-gradient(circle at center, rgba(11, 38, 32, 0.4) 0%, rgba(9, 20, 16, 0.9) 100%)" }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold to-transparent z-20" />

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
            <span className="text-2xl md:text-4xl font-normal">Daig &amp; Catering in Lahore</span>
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
      </section>

      {/* FLOATING SIDEBAR */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-3 ml-4">
        <Link
          href="/daig-service/lahore"
          className="group flex items-center justify-center w-12 h-12 bg-emerald-deep text-gold rounded-full shadow-lg hover:w-auto hover:px-4 hover:rounded-xl transition-all duration-300 overflow-hidden border border-gold/30"
          aria-label="Daig Service in Lahore"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 whitespace-nowrap font-semibold text-sm">
            Daig Service Lahore
          </span>
        </Link>

        <a href="https://wa.me/923008008672" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center w-12 h-12 bg-[#25D366] text-white rounded-full shadow-lg hover:w-auto hover:px-4 hover:rounded-xl transition-all duration-300 overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
          </svg>
          <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 whitespace-nowrap font-semibold text-sm">WhatsApp Us</span>
        </a>

        <a href="tel:03008008672" className="group flex items-center justify-center w-12 h-12 bg-emerald-deep text-gold rounded-full shadow-lg hover:w-auto hover:px-4 hover:rounded-xl transition-all duration-300 overflow-hidden border border-gold/30">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 whitespace-nowrap font-semibold text-sm">Call Now</span>
        </a>
      </div>
    </div>
  );
}