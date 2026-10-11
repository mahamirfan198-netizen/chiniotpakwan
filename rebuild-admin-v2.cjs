const fs = require("fs");
const path = require("path");

const files = {

  // ============ UPDATED CATEGORY DELETE API (allow force delete) ============
  "app/api/admin/categories/[id]/route.ts": `import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/adminAuth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const force = searchParams.get("force") === "true";

  const productCount = await prisma.product.count({ where: { categoryId: id } });

  if (productCount > 0 && !force) {
    return NextResponse.json(
      { error: "Category has " + productCount + " products. Delete products first or use force delete." },
      { status: 400 }
    );
  }

  // Delete products first if force, then category
  if (force && productCount > 0) {
    await prisma.product.deleteMany({ where: { categoryId: id } });
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });

  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ category });
}`,

  // ============ UPDATED CATEGORIES PAGE (clickable, force delete) ============
  "app/admin/categories/page.tsx": `"use client";

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
}`,

  // ============ UPDATED PRODUCTS PAGE (filter by category, editable) ============
  "app/admin/products/page.tsx": `"use client";

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
}`,

  // ============ UPDATED EDIT PRODUCT PAGE ============
  "app/admin/products/[id]/page.tsx": `"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/admin/Sidebar";

type Category = { id: string; name: string };

function EditProductContent() {
  const params = useParams();
  const id = params.id as string;
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [variantNote, setVariantNote] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState("");
  const [popular, setPopular] = useState(false);
  const [available, setAvailable] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInput = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/categories").then((r) => r.json()),
      fetch("/api/admin/products/" + id).then((r) => r.json()),
    ])
      .then(([catData, prodData]) => {
        setCategories(catData.categories || []);
        const p = prodData.product;
        if (p) {
          setName(p.name);
          setDescription(p.description);
          setPriceFrom(String(p.priceFrom));
          setPriceTo(String(p.priceTo));
          setVariantNote(p.variantNote || "");
          setCategoryId(p.categoryId);
          setImage(p.image);
          setPopular(p.popular);
          setAvailable(p.available);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load: " + err.message);
        setLoading(false);
      });
  }, [id]);

  async function handleImageUpload(file: File) {
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) setImage(data.url);
      else setError(data.error || "Upload failed");
    } catch (err: any) {
      setError("Upload error: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      const res = await fetch("/api/admin/products/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          priceFrom: Number(priceFrom),
          priceTo: Number(priceTo),
          variantNote: variantNote.trim(),
          categoryId,
          image,
          popular,
          available,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Failed to save");
        setBusy(false);
        return;
      }

      router.push("/admin/products");
    } catch (err: any) {
      setError("Network error: " + err.message);
      setBusy(false);
    }
  }

  if (loading) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-ivory">
      <AdminSidebar />
      <main className="md:ml-60 p-4 md:p-8">
        <div className="max-w-2xl">
          <Link href="/admin/products" className="text-emerald-deep text-sm mb-4 inline-block">
            ← Back to products
          </Link>
          <h1 className="font-display text-3xl font-bold text-emerald-deep mb-8">
            Edit Product
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2">Product Image</label>
              <div className="flex items-center gap-4">
                {image ? (
                  <img src={image} alt="Preview" className="w-32 h-32 rounded-xl object-cover" />
                ) : (
                  <div className="w-32 h-32 rounded-xl bg-ivory-warm flex items-center justify-center text-4xl">
                    🍛
                  </div>
                )}
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImageUpload(f);
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  disabled={uploading}
                  className="px-5 py-3 rounded-xl bg-emerald-deep text-ivory text-sm font-semibold disabled:opacity-60"
                >
                  {uploading ? "Uploading..." : "Change Image"}
                </button>
              </div>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Or paste image URL here"
                className="w-full px-4 py-2 mt-2 rounded-xl border text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Product Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Price From</label>
                <input
                  type="number"
                  value={priceFrom}
                  onChange={(e) => setPriceFrom(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Price To</label>
                <input
                  type="number"
                  value={priceTo}
                  onChange={(e) => setPriceTo(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Variant Note</label>
              <input
                type="text"
                value={variantNote}
                onChange={(e) => setVariantNote(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border bg-white"
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={popular}
                onChange={(e) => setPopular(e.target.checked)}
                className="w-5 h-5"
              />
              <span className="text-sm font-medium">Mark as Popular</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
                className="w-5 h-5"
              />
              <span className="text-sm font-medium">Available on menu</span>
            </label>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 rounded-xl font-semibold text-emerald-deep bg-gold-gradient shadow-gold disabled:opacity-60"
            >
              {busy ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function EditProductPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
      <EditProductContent />
    </Suspense>
  );
}`

};

for (const [filePath, content] of Object.entries(files)) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log("Created: " + filePath);
}
console.log("\nAll admin files updated successfully!");
