"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AdminSidebar from "@/components/admin/Sidebar";

type Product = {
  id: string;
  name: string;
  image: string;
  priceFrom: number;
  priceTo: number;
  popular: boolean;
  available: boolean;
  categoryId: string;
  category: { id: string; name: string };
};

type Category = {
  id: string;
  name: string;
  icon: string | null;
  _count: { products: number };
};

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  useEffect(() => {
    if (initialCategory) setCategoryFilter(initialCategory);
  }, [initialCategory]);

  async function load() {
    const [prodRes, catRes] = await Promise.all([
      fetch("/api/admin/products"),
      fetch("/api/admin/categories"),
    ]);

    if (prodRes.status === 401) {
      window.location.href = "/admin/login";
      return;
    }

    const prodData = await prodRes.json();
    const catData = await catRes.json();

    setProducts(prodData.products || []);
    setCategories(catData.categories || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string, name: string) {
    if (!confirm("Delete " + name + "?")) return;
    await fetch("/api/admin/products/" + id, { method: "DELETE" });
    load();
  }

  const filtered = products.filter((p) => {
    if (categoryFilter !== "all" && p.categoryId !== categoryFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const activeCategory = categories.find((c) => c.id === categoryFilter);

  return (
    <div className="min-h-screen bg-ivory">
      <AdminSidebar />
      <main className="md:ml-60 p-4 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-emerald-deep">
              Products
              {activeCategory && (
                <span className="text-charcoal-soft text-lg ml-3">
                  in {activeCategory.name}
                </span>
              )}
            </h1>
            <p className="text-charcoal-soft">
              {filtered.length} {filtered.length === 1 ? "dish" : "dishes"}
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="px-6 py-3 rounded-xl font-semibold text-emerald-deep bg-gold-gradient shadow-gold hover:opacity-90 transition"
          >
            + Add Product
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="flex-1 px-4 py-3 rounded-xl border bg-white"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border bg-white md:w-64"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon || "📁"} {c.name} ({c._count.products})
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="luxe-card p-12 text-center">
            <p className="mb-4 text-charcoal-soft">
              {products.length === 0
                ? "No products yet"
                : "No products match your filters"}
            </p>
            {products.length === 0 && (
              <Link href="/admin/products/new" className="btn-emerald inline-block">
                Add First Product
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="luxe-card p-4 flex flex-col md:flex-row items-start md:items-center gap-4"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-emerald-deep">{p.name}</p>
                  <p className="text-xs text-charcoal-soft">
                    {p.category.name} · Rs. {p.priceFrom.toLocaleString()} – {p.priceTo.toLocaleString()}
                  </p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {p.popular && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-bold">
                        POPULAR
                      </span>
                    )}
                    {!p.available && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-bold">
                        HIDDEN
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Link
                    href={"/admin/products/" + p.id}
                    className="flex-1 md:flex-none text-center px-4 py-2 rounded-lg bg-emerald-deep text-ivory text-sm font-semibold hover:bg-emerald-light transition"
                  >
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => remove(p.id, p.name)}
                    className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-red-100 text-red-600 text-sm font-semibold hover:bg-red-200 transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProductsAdmin() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}