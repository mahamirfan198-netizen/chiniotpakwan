"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { formatPrice, getWhatsAppLink, PHONE_NUMBER } from "@/data/menu";

type Product = {
  id: string;
  name: string;
  description: string;
  priceFrom: number;
  priceTo: number;
  variantNote: string | null;
  image: string;
  popular: boolean;
  category: { id: string; name: string; icon: string | null } | null;
};

type Category = {
  id: string;
  name: string;
  icon: string | null;
};

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "priceAsc" | "priceDesc">("name");

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ])
      .then(([productsData, categoriesData]) => {
        setProducts(productsData.products || []);
        setCategories(categoriesData.categories || []);
      })
      .catch((err) => console.error("Failed to load menu:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = useMemo(() => {
    let items = [...products];

    if (activeCategory !== "all") {
      items = items.filter((i) => i.category?.id === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === "priceAsc") items.sort((a, b) => a.priceFrom - b.priceFrom);
    else if (sortBy === "priceDesc") items.sort((a, b) => b.priceFrom - a.priceFrom);
    else items.sort((a, b) => a.name.localeCompare(b.name));

    return items;
  }, [products, activeCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-ivory">
      <nav className="sticky top-0 z-50 bg-emerald-deep shadow-luxe">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center">
              <span className="text-xl">🍽</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-display text-base font-bold text-ivory leading-none">Chiniot Pakwan</p>
              <p className="text-[9px] tracking-[0.2em] text-gold uppercase mt-0.5">Authentic Catering</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-ivory/80 hover:text-gold transition text-sm font-medium">
              ← Home
            </Link>
            <Link href="/cart" className="relative text-ivory text-2xl hover:text-gold transition">
              🛒
            </Link>
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-gradient text-emerald-deep text-xs font-bold tracking-wider uppercase shadow-gold hover:scale-105 transition"
            >
              📞 Call Now
            </a>
          </div>
        </div>
      </nav>

      <section className="bg-emerald-deep py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at center, rgba(18, 59, 42, 0.4) 0%, rgba(9, 26, 20, 0.8) 100%)" }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold to-transparent" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <p className="text-gold-bright tracking-[0.3em] text-sm uppercase mb-3 font-bold drop-shadow-lg">— Complete Menu —</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
            Our <span className="text-gold-bright italic">Signature</span> Dishes
          </h1>
          <div className="divider-gold" />
          <p className="text-white/90 max-w-2xl mx-auto mt-6 text-lg drop-shadow-md">
            Authentic Pakistani cuisine prepared with premium ingredients. Available as full daigs for your events and gatherings.
          </p>
        </div>
      </section>

      <section className="bg-white shadow-soft sticky top-18 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search dishes..."
                className="flex-1 px-4 py-3 rounded-xl border border-ivory-warm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold bg-ivory transition"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 rounded-xl border border-ivory-warm bg-ivory focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition cursor-pointer"
              >
                <option value="name">Sort: Name</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => setActiveCategory("all")}
                className={
                  "px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition flex items-center gap-2 " +
                  (activeCategory === "all"
                    ? "bg-emerald-deep text-ivory shadow-luxe"
                    : "bg-ivory text-charcoal-soft hover:bg-gold/20 border border-ivory-warm")
                }
              >
                <span>🍽</span>
                <span>All Items</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={
                    "px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition flex items-center gap-2 " +
                    (activeCategory === cat.id
                      ? "bg-emerald-deep text-ivory shadow-luxe"
                      : "bg-ivory text-charcoal-soft hover:bg-gold/20 border border-ivory-warm")
                  }
                >
                  <span>{cat.icon || "🍴"}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
              <p className="text-charcoal-soft mt-4">Loading menu...</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-charcoal-soft mb-6">
                Showing <strong className="text-emerald-deep">{filteredItems.length}</strong>{" "}
                {filteredItems.length === 1 ? "item" : "items"}
              </p>

              {filteredItems.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-5xl mb-4">🍽️</div>
                  <p className="font-display text-2xl text-emerald-deep mb-2">No dishes found</p>
                  <p className="text-charcoal-soft text-sm">Try a different search or category</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item, idx) => (
                    <ProductCard key={item.id} item={item} index={idx} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="py-16 px-6 bg-gold-gradient">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-emerald-deep mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-emerald-deep/80 mb-8">
            Call us for custom orders, wedding catering, or special daig requests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="px-8 py-4 rounded-xl bg-emerald-deep text-ivory font-bold tracking-wider uppercase text-sm shadow-luxe hover:scale-105 transition inline-flex items-center gap-2 justify-center"
            >
              📞 Call Us
            </a>
            <a
              href="https://wa.me/923008008672"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl bg-white text-emerald-deep font-bold tracking-wider uppercase text-sm shadow-luxe hover:scale-105 transition inline-flex items-center gap-2 justify-center"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-emerald-deep text-ivory py-10 px-6 text-center text-sm">
        <p className="text-ivory/60">© 2026 Chiniot Pakwan. All rights reserved.</p>
      </footer>
    </div>
  );
}

function ProductCard({ item, index }: { item: Product; index: number }) {
  return (
    <div
      className="luxe-card overflow-hidden group animate-fadeInUp"
      style={{ animationDelay: index * 50 + "ms" }}
    >
      <Link href={"/menu/" + item.id} className="block">
        <div className="relative aspect-4/3 bg-ivory-warm overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
            loading="lazy"
          />
          {item.popular && (
            <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gold text-emerald-deep text-[10px] font-bold tracking-wider uppercase shadow-luxe z-10">
              ★ Popular
            </span>
          )}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition" />
        </div>
      </Link>

      <div className="p-5">
        <p className="text-xs text-gold tracking-widest uppercase font-semibold mb-2">
          {item.category?.name || "Uncategorized"}
        </p>
        <h3 className="font-display text-lg font-bold text-emerald-deep mb-2 leading-snug">
          <Link href={"/menu/" + item.id} className="hover:text-gold transition">
            {item.name}
          </Link>
        </h3>
        <p className="text-sm text-charcoal-soft leading-relaxed mb-4 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-baseline justify-between mb-4">
          <div>
            <p className="text-[10px] text-charcoal-soft uppercase tracking-wider">Starting from</p>
            <p className="font-display text-xl font-bold text-emerald-deep">{formatPrice(item.priceFrom)}</p>
            <p className="text-[10px] text-charcoal-soft mt-0.5">up to {formatPrice(item.priceTo)}</p>
          </div>
        </div>

        {item.variantNote && (
          <p className="text-[11px] text-charcoal-soft italic mb-4">{item.variantNote}</p>
        )}

        <div className="flex flex-col gap-2">
          <Link
            href={"/menu/" + item.id}
            className="w-full px-4 py-2.5 rounded-xl bg-emerald-deep text-ivory font-semibold text-sm hover:bg-emerald-light transition text-center"
          >
            View Details
          </Link>
          <a
            href={getWhatsAppLink(item as any)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp justify-center"
          >
            💬 Order on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
