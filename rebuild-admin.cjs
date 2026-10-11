const fs = require("fs");
const path = require("path");

const files = {

  // ============ FIXED SIDEBAR ============
  "components/admin/Sidebar.tsx": `"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const items = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "🍛" },
  { href: "/admin/categories", label: "Categories", icon: "📁" },
  { href: "/admin/enquiries", label: "Enquiries", icon: "💍" },
  { href: "/admin/messages", label: "Messages", icon: "📩" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-60 bg-emerald-deep p-4 text-ivory z-40">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center">
          <span className="text-xl">🍛</span>
        </div>
        <div>
          <p className="font-display font-bold text-sm">Admin Panel</p>
          <p className="text-[10px] tracking-wider text-gold uppercase">Chiniot Pakwan</p>
        </div>
      </div>
      <nav className="space-y-1 flex-1">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition " +
                (active ? "bg-white/15 font-semibold" : "hover:bg-white/10")
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <button
        onClick={logout}
        className="py-2.5 rounded-xl bg-red-500/20 text-red-200 hover:bg-red-500/30 text-sm font-semibold transition"
      >
        Logout
      </button>
    </aside>
  );
}`,

  // ============ CATEGORY DELETE API ============
  "app/api/admin/categories/[id]/route.ts": `import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/adminAuth";

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return NextResponse.json(
      { error: "Cannot delete category with " + productCount + " products. Delete products first." },
      { status: 400 }
    );
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}`,

  // ============ UPDATED CATEGORIES PAGE (with delete) ============
  "app/admin/categories/page.tsx": `"use client";

import { useEffect, useState } from "react";
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

  async function remove(cat: Category) {
    if (cat._count.products > 0) {
      alert("Cannot delete: " + cat._count.products + " products in this category. Delete products first.");
      return;
    }
    if (!confirm("Delete category " + cat.name + "?")) return;
    const res = await fetch("/api/admin/categories/" + cat.id, { method: "DELETE" });
    if (!res.ok) {
      const d = await res.json();
      alert(d.error || "Delete failed");
      return;
    }
    load();
  }

  return (
    <div className="min-h-screen bg-ivory">
      <AdminSidebar />
      <main className="md:ml-60 p-4 md:p-8">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl font-bold text-emerald-deep mb-8">
            Categories
          </h1>

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
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl shrink-0">{c.icon || "📁"}</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-emerald-deep truncate">{c.name}</p>
                      <p className="text-xs text-charcoal-soft">
                        {c._count.products} products
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => remove(c)}
                    disabled={c._count.products > 0}
                    className={
                      "px-4 py-2 rounded-lg text-sm font-semibold transition " +
                      (c._count.products > 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-red-100 text-red-600 hover:bg-red-200")
                    }
                    title={c._count.products > 0 ? "Delete products first" : "Delete category"}
                  >
                    Delete
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

  // ============ UPDATED PRODUCTS PAGE (with delete already there, add mobile) ============
  "app/admin/products/page.tsx": `"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/admin/Sidebar";

type Product = {
  id: string;
  name: string;
  image: string;
  priceFrom: number;
  priceTo: number;
  popular: boolean;
  available: boolean;
  category: { name: string };
};

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  async function load() {
    const res = await fetch("/api/admin/products");
    if (res.status === 401) {
      window.location.href = "/admin/login";
      return;
    }
    const data = await res.json();
    setProducts(data.products || []);
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

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-ivory">
      <AdminSidebar />
      <main className="md:ml-60 p-4 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-emerald-deep">Products</h1>
            <p className="text-charcoal-soft">{products.length} dishes</p>
          </div>
          <Link
            href="/admin/products/new"
            className="px-6 py-3 rounded-xl font-semibold text-emerald-deep bg-gold-gradient shadow-gold hover:opacity-90 transition"
          >
            + Add Product
          </Link>
        </div>

        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search products..."
          className="w-full md:max-w-md px-4 py-3 rounded-xl border mb-6 bg-white"
        />

        {loading ? (
          <p>Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="luxe-card p-12 text-center">
            <p className="mb-4 text-charcoal-soft">No products found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((p) => (
              <div key={p.id} className="luxe-card p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
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
                <div className="flex gap-2">
                  <Link
                    href={"/admin/products/" + p.id}
                    className="px-4 py-2 rounded-lg bg-emerald-deep text-ivory text-sm font-semibold hover:bg-emerald-light transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => remove(p.id, p.name)}
                    className="px-4 py-2 rounded-lg bg-red-100 text-red-600 text-sm font-semibold hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}`,

  // ============ SINGLE PRODUCT EDIT PAGE ============
  "app/admin/products/[id]/page.tsx": `"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/admin/Sidebar";

type Category = { id: string; name: string };

export default function EditProductPage() {
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
    ]).then(([catData, prodData]) => {
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
    });
  }, [id]);

  async function handleImageUpload(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (res.ok) setImage(data.url);
    else setError(data.error || "Upload failed");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await fetch("/api/admin/products/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        priceFrom: Number(priceFrom),
        priceTo: Number(priceTo),
        variantNote,
        categoryId,
        image,
        popular,
        available,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const d = await res.json();
      return setError(d.error || "Failed");
    }
    router.push("/admin/products");
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
            </div>

            <input
              type="text"
              placeholder="Product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border"
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border resize-none"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Price From"
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border"
                required
              />
              <input
                type="number"
                placeholder="Price To"
                value={priceTo}
                onChange={(e) => setPriceTo(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Variant note"
              value={variantNote}
              onChange={(e) => setVariantNote(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border"
            />
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
}`,

  // ============ ENQUIRIES PAGE ============
  "app/admin/enquiries/page.tsx": `"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/Sidebar";

type Enquiry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  eventType: string;
  eventDate: string | null;
  guestCount: number | null;
  location: string | null;
  preferredDish: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
};

export default function EnquiriesAdmin() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/enquiries")
      .then((r) => r.json())
      .then((d) => {
        setEnquiries(d.enquiries || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-ivory">
      <AdminSidebar />
      <main className="md:ml-60 p-4 md:p-8">
        <h1 className="font-display text-3xl font-bold text-emerald-deep mb-8">
          Catering Enquiries
        </h1>
        {loading ? (
          <p>Loading...</p>
        ) : enquiries.length === 0 ? (
          <div className="luxe-card p-12 text-center">
            <p className="text-charcoal-soft">No enquiries yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {enquiries.map((e) => (
              <div key={e.id} className="luxe-card p-6">
                <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <p className="font-bold text-emerald-deep">{e.name}</p>
                    <p className="text-sm text-charcoal-soft">📞 {e.phone}</p>
                    {e.email && <p className="text-sm text-charcoal-soft">✉️ {e.email}</p>}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold">
                    {e.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-3">
                  <p><strong>Event:</strong> {e.eventType}</p>
                  {e.guestCount && <p><strong>Guests:</strong> {e.guestCount}</p>}
                  {e.eventDate && <p><strong>Date:</strong> {new Date(e.eventDate).toLocaleDateString()}</p>}
                  {e.location && <p><strong>Location:</strong> {e.location}</p>}
                  {e.preferredDish && <p><strong>Dish:</strong> {e.preferredDish}</p>}
                </div>
                {e.notes && (
                  <p className="text-sm mt-3 p-3 rounded-lg bg-ivory-warm">{e.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}`,

  // ============ MESSAGES PAGE ============
  "app/admin/messages/page.tsx": `"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/Sidebar";

type Message = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/messages")
      .then((r) => r.json())
      .then((d) => {
        setMessages(d.messages || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-ivory">
      <AdminSidebar />
      <main className="md:ml-60 p-4 md:p-8">
        <h1 className="font-display text-3xl font-bold text-emerald-deep mb-8">
          Contact Messages
        </h1>
        {loading ? (
          <p>Loading...</p>
        ) : messages.length === 0 ? (
          <div className="luxe-card p-12 text-center">
            <p className="text-charcoal-soft">No messages yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={"luxe-card p-6 " + (m.read ? "" : "border-l-4 border-l-yellow-500")}>
                <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                  <div>
                    <p className="font-bold text-emerald-deep">{m.name}</p>
                    <p className="text-sm text-charcoal-soft">📞 {m.phone}</p>
                    {m.email && <p className="text-sm text-charcoal-soft">✉️ {m.email}</p>}
                  </div>
                  <p className="text-xs text-charcoal-soft">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm mt-3 p-3 rounded-lg bg-ivory-warm">{m.message}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}`,

  // ============ DASHBOARD ============
  "app/admin/page.tsx": `"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/Sidebar";

type Stats = {
  products: number;
  categories: number;
  enquiries: number;
  messages: number;
  unreadEnquiries: number;
  unreadMessages: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => {
        if (r.status === 401) {
          router.push("/admin/login");
          return null;
        }
        return r.json();
      })
      .then((d) => d && setStats(d))
      .catch(() => router.push("/admin/login"));
  }, [router]);

  if (!stats) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-ivory">
      <AdminSidebar />
      <main className="md:ml-60 p-4 md:p-8">
        <h1 className="font-display text-3xl font-bold text-emerald-deep mb-2">Dashboard</h1>
        <p className="text-charcoal-soft mb-8">Welcome back, Maham</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatCard href="/admin/products" icon="🍛" label="Products" value={stats.products} />
          <StatCard href="/admin/categories" icon="📁" label="Categories" value={stats.categories} />
          <StatCard href="/admin/enquiries" icon="💍" label="Enquiries" value={stats.enquiries} badge={stats.unreadEnquiries} />
          <StatCard href="/admin/messages" icon="📩" label="Messages" value={stats.messages} badge={stats.unreadMessages} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Link href="/admin/products/new" className="luxe-card p-6 flex items-start gap-4 hover:shadow-luxe transition">
            <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center shrink-0">
              <span className="text-2xl">➕</span>
            </div>
            <div>
              <p className="font-display text-lg font-bold text-emerald-deep">Add New Product</p>
              <p className="text-sm text-charcoal-soft">Create a new dish with image, price, and description</p>
            </div>
          </Link>
          <Link href="/admin/categories" className="luxe-card p-6 flex items-start gap-4 hover:shadow-luxe transition">
            <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center shrink-0">
              <span className="text-2xl">📁</span>
            </div>
            <div>
              <p className="font-display text-lg font-bold text-emerald-deep">Manage Categories</p>
              <p className="text-sm text-charcoal-soft">Add or edit menu categories</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  href, icon, label, value, badge,
}: { href: string; icon: string; label: string; value: number; badge?: number }) {
  return (
    <Link href={href} className="luxe-card p-6 block relative hover:shadow-luxe transition">
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{icon}</span>
        {badge && badge > 0 ? (
          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold">
            {badge} new
          </span>
        ) : null}
      </div>
      <p className="font-display text-3xl font-bold text-emerald-deep">{value}</p>
      <p className="text-sm text-charcoal-soft">{label}</p>
    </Link>
  );
}`

};

for (const [filePath, content] of Object.entries(files)) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log("Created: " + filePath);
}
console.log("\nAll admin files created successfully!");
