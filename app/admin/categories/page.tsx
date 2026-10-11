"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/admin/Sidebar";

type Category = {
  id: string;
  name: string;
  icon: string | null;
  _count: { products: number };
};

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/admin/categories");
    if (res.status === 401) {
      window.location.href = "/admin/login";
      return;
    }
    const data = await res.json();
    setCategories(data.categories || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, icon }),
    });
    setName("");
    setIcon("");
    load();
  }

  async function remove(cat: Category, force: boolean = false) {
    let msg = "";
    if (cat._count.products > 0) {
      msg = "This category has " + cat._count.products + " products. Deleting will ALSO delete all these products. Continue?";
      if (!confirm(msg)) return;
    } else {
      if (!confirm("Delete category " + cat.name + "?")) return;
    }

    const url = "/api/admin/categories/" + cat.id + (force ? "?force=true" : "");
    const res = await fetch(url, { method: "DELETE" });

    if (!res.ok) {
      const d = await res.json();
      if (d.error && cat._count.products > 0 && !force) {
        // Try force delete
        if (confirm("Force delete category and all its products?")) {
          await fetch("/api/admin/categories/" + cat.id + "?force=true", { method: "DELETE" });
          load();
        }
      } else {
        alert(d.error || "Delete failed");
      }
      return;
    }
    load();
  }

  return (
    <div className="min-h-screen bg-ivory">
      <AdminSidebar />
      <main className="md:ml-60 p-4 md:p-8">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl font-bold text-emerald-deep mb-2">
            Categories
          </h1>
          <p className="text-charcoal-soft mb-8">
            Click on a category to view its products
          </p>

          <form onSubmit={add} className="luxe-card p-4 mb-6 flex gap-3">
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="🍗"
              className="w-16 px-3 py-2 rounded-xl border text-center text-xl"
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              className="flex-1 px-4 py-2 rounded-xl border"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 rounded-xl font-semibold text-emerald-deep bg-gold-gradient shadow-gold hover:opacity-90 transition"
            >
              Add
            </button>
          </form>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-2">
              {categories.map((c) => (
                <div key={c.id} className="luxe-card p-4 flex items-center justify-between gap-3">
                  <Link
                    href={"/admin/products?category=" + c.id}
                    className="flex items-center gap-3 flex-1 min-w-0 group"
                  >
                    <span className="text-3xl shrink-0">{c.icon || "📁"}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-emerald-deep truncate group-hover:text-gold transition">
                        {c.name}
                      </p>
                      <p className="text-xs text-charcoal-soft">
                        {c._count.products} products · Click to view
                      </p>
                    </div>
                  </Link>
                  <button
                    onClick={() => remove(c)}
                    className={
                      "px-4 py-2 rounded-lg text-sm font-semibold transition " +
                      (c._count.products > 0
                        ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                        : "bg-red-100 text-red-600 hover:bg-red-200")
                    }
                    title={c._count.products > 0 ? "Force delete (removes products too)" : "Delete category"}
                  >
                    {c._count.products > 0 ? "Force Delete" : "Delete"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}