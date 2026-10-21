import { getLocalBusinessSchema } from "@/lib/structuredData";
import Script from "next/script";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { CONTACT } from "@/lib/seo";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const featured = await prisma.product.findMany({
    where: { available: true },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: { category: { select: { name: true } } },
  });

  return (
    <div className="min-h-screen bg-ivory">
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getLocalBusinessSchema()) }}
      />
      
      {/* ============ PREMIUM NAVIGATION ============ */}
      <nav className="absolute top-0 left-0 right-0 z-50 py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold">
              <img src="/logo.png" alt="Chiniot Pakwan" className="w-12 h-12 object-contain" />
            </div>
            <div className="hidden sm:block">
              <p className="font-display text-xl font-bold text-white leading-none">Chiniot Pakwan</p>
              <p className="text-[10px] tracking-[0.2em] text-gold-bright uppercase mt-1">Authentic Catering</p>
            </div>
          </Link>

          {/* Navigation Links - Made highly visible */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
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
                className="text-gold-bright hover:text-white transition text-sm font-bold tracking-wider uppercase drop-shadow-lg"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/daig-service/lahore"
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold text-gold-bright text-xs font-bold tracking-wider uppercase hover:bg-gold hover:text-emerald-deep transition"
            >
              Lahore
            </Link>
            <Link href="/cart" className="text-white text-2xl relative hover:text-gold-bright transition drop-shadow-md">
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
            backgroundImage: "url('https://images.unsplash.com/photo-1633945274309-2c16c9682a8c?w=1920')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 z-10" style={{ background: "rgba(11, 38, 32, 0.85)" }} />
        <div className="absolute inset-0 z-10" style={{ background: "radial-gradient(circle at center, rgba(11, 38, 32, 0.3) 0%, rgba(9, 20, 16, 0.95) 100%)" }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold to-transparent z-20" />

        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center pt-20">
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
          <p className="text-white text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-lg font-medium">
            From family gatherings to grand celebrations — discover authentic Pakistani daigs, freshly prepared mutton kunna, and premium catering crafted for your special occasions.
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
              className="px-8 py-4 rounded-full border-2 border-white text-white font-bold tracking-wider uppercase text-sm hover:bg-white hover:text-emerald-deep transition inline-flex items-center gap-2 backdrop-blur-sm"
            >
              Book Catering
            </Link>
          </div>
        </div>
      </section>

      {/* ============ WELCOME SECTION ============ */}
      <section className="relative -mt-20 z-30 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="luxe-card p-8 md:p-14 text-center bg-white shadow-luxe rounded-3xl border-t-4 border-gold">
            <p className="text-gold tracking-[0.3em] text-sm uppercase mb-4 font-bold">
              Welcome to Chiniot Pakwan
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-emerald-deep mb-4">
              Home of Authentic <span className="text-gold italic">Chinioti Taste</span>
            </h2>
            <div className="w-24 h-0.5 bg-gold mx-auto mb-6" />
            <p className="text-charcoal-soft text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
              We are Lahore's trusted catering service for <strong>traditional Chinioti food</strong>. From the famous <strong>Chiniot mutton kunna</strong> to aromatic Kabuli pulao and Sindhi biryani, we serve fresh and authentic Pakistani daigs. Whether you need <strong>daig service in Lahore</strong> for a wedding, or a <strong>family daig booking</strong> in Johar Town or DHA, every dish is cooked with premium ingredients and traditional Chinioti cuisine recipes passed down through generations.
            </p>
          </div>
        </div>
      </section>

      {/* ============ FEATURED DISHES ============ */}
      <section className="py-20 px-6 bg-ivory-warm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-gold tracking-[0.3em] text-sm uppercase mb-4 font-bold">
              — Our Signature —
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-emerald-deep mb-4">
              Signature Pakistani Dishes
            </h2>
            <div className="w-24 h-0.5 bg-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((item) => (
              <Link
                key={item.id}
                href={"/menu/" + item.id}
                className="luxe-card overflow-hidden group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                  {item.popular && (
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gold text-emerald-deep text-[10px] font-bold tracking-wider uppercase shadow-luxe">
                      ★ Popular
                    </span>
                  )}
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-display text-lg font-bold text-emerald-deep mb-1">
                    {item.name}
                  </h3>
                  <p className="text-gold font-bold text-sm">From Rs. {item.priceFrom.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/menu"
              className="inline-block px-8 py-3 rounded-full border-2 border-emerald-deep text-emerald-deep font-bold tracking-wider uppercase text-sm hover:bg-emerald-deep hover:text-ivory transition"
            >
              View Complete Menu
            </Link>
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION (Fixed Green Part) ============ */}
      <section className="py-24 px-6 bg-emerald-deep relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at center, #C6A15B 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-md">
            Planning a Grand Event?
          </h2>
          <p className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
            From intimate family gatherings to large-scale weddings, our catering team ensures your guests experience the finest Chinioti cuisine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catering"
              className="px-8 py-4 rounded-full bg-gold-gradient text-emerald-deep font-bold tracking-wider uppercase text-sm shadow-gold hover:scale-105 transition"
            >
              View Catering Packages
            </Link>
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full border-2 border-gold text-white font-bold tracking-wider uppercase text-sm hover:bg-gold hover:text-emerald-deep transition"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-[#0a1c15] text-ivory py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white">Chiniot Pakwan</h3>
            </div>
            <p className="text-ivory/80 text-sm leading-relaxed mb-4">
              Authentic Chinioti cuisine and premium daig catering services across Pakistan.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gold uppercase tracking-wider mb-4">Locations</h4>
            <ul className="space-y-2 text-sm text-ivory/80">
              <li><Link href="/daig-service/lahore" className="hover:text-gold transition">Daig Service Lahore</Link></li>
              <li><Link href="/daig-service/islamabad" className="hover:text-gold transition">Daig Service Islamabad</Link></li>
              <li><Link href="/daig-service/karachi" className="hover:text-gold transition">Daig Service Karachi</Link></li>
              <li><Link href="/daig-service/faisalabad" className="hover:text-gold transition">Daig Service Faisalabad</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gold uppercase tracking-wider mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-ivory/80">
              <li><a href={`tel:${CONTACT.phone}`} className="hover:text-gold transition">📞 {CONTACT.phoneDisplay}</a></li>
              <li><a href={`mailto:${CONTACT.email}`} className="hover:text-gold transition">✉️ {CONTACT.email}</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-xs text-ivory/60">
          © {new Date().getFullYear()} Chiniot Pakwan. All rights reserved.
        </div>
      </footer>

      {/* FLOATING SIDEBAR */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-3">
        <Link
          href="/daig-service/lahore"
          className="group flex items-center justify-center w-12 h-12 bg-emerald-deep text-gold rounded-full shadow-lg hover:w-auto hover:px-4 hover:rounded-xl transition-all duration-300 overflow-hidden border border-gold/30"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 whitespace-nowrap font-semibold text-sm">Lahore</span>
        </Link>
        <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center w-12 h-12 bg-[#25D366] text-white rounded-full shadow-lg hover:w-auto hover:px-4 hover:rounded-xl transition-all duration-300 overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
          </svg>
          <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 whitespace-nowrap font-semibold text-sm">WhatsApp</span>
        </a>
        <a href={`tel:${CONTACT.phone}`} className="group flex items-center justify-center w-12 h-12 bg-emerald-deep text-gold rounded-full shadow-lg hover:w-auto hover:px-4 hover:rounded-xl transition-all duration-300 overflow-hidden border border-gold/30">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 whitespace-nowrap font-semibold text-sm">Call Now</span>
        </a>
      </div>
    </div>
  );
}