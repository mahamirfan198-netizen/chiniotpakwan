const fs = require("fs");
const path = require("path");

const files = {

  // ============ ADMIN LAYOUT ============
  "app/admin/layout.tsx": `import { getCurrentAdmin } from "@/lib/adminAuth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}`,

  // ============ ADMIN SIDEBAR COMPONENT ============
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
    <aside className="fixed left-0 top-0 h-screen w-60 bg-emerald-deep p-4 text-ivory flex flex-col">
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
      <main className="ml-60 p-8">
        <h1 className="font-display text-3xl font-bold text-emerald-deep mb-2">Dashboard</h1>
        <p className="text-charcoal-soft mb-8">Welcome back, Maham</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard href="/admin/products" icon="🍛" label="Products" value={stats.products} />
          <StatCard href="/admin/categories" icon="📁" label="Categories" value={stats.categories} />
          <StatCard href="/admin/enquiries" icon="💍" label="Enquiries" value={stats.enquiries} badge={stats.unreadEnquiries} />
          <StatCard href="/admin/messages" icon="📩" label="Messages" value={stats.messages} badge={stats.unreadMessages} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Link href="/admin/products/new" className="luxe-card p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center shrink-0">
              <span className="text-2xl">➕</span>
            </div>
            <div>
              <p className="font-display text-lg font-bold text-emerald-deep">Add New Product</p>
              <p className="text-sm text-charcoal-soft">Create a new dish with image, price, and description</p>
            </div>
          </Link>
          <Link href="/admin/categories" className="luxe-card p-6 flex items-start gap-4">
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
    <Link href={href} className="luxe-card p-6 block relative">
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
}`,

  // ============ PRODUCTS LIST ============
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

  return (
    <div className="min-h-screen bg-ivory">
      <AdminSidebar />
      <main className="ml-60 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-emerald-deep">Products</h1>
            <p className="text-charcoal-soft">{products.length} dishes</p>
          </div>
          <Link
            href="/admin/products/new"
            className="px-6 py-3 rounded-xl font-semibold text-emerald-deep bg-gold-gradient shadow-gold"
          >
            + Add Product
          </Link>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <div className="luxe-card p-12 text-center">
            <p className="mb-4 text-charcoal-soft">No products yet</p>
            <Link href="/admin/products/new" className="btn-emerald">
              Add First Product
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="luxe-card p-4 flex items-center gap-4">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold text-emerald-deep">{p.name}</p>
                  <p className="text-xs text-charcoal-soft">
                    {p.category.name} · Rs. {p.priceFrom.toLocaleString()} – {p.priceTo.toLocaleString()}
                  </p>
                  <div className="flex gap-2 mt-1">
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
                <button
                  onClick={() => remove(p.id, p.name)}
                  className="px-4 py-2 rounded-lg bg-red-100 text-red-600 text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}`,

  // ============ NEW PRODUCT ============
  "app/admin/products/new/page.tsx": `"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/admin/Sidebar";

type Category = { id: string; name: string };

export default function NewProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [variantNote, setVariantNote] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => {
        setCategories(d.categories || []);
        if (d.categories?.[0]) setCategoryId(d.categories[0].id);
      });
  }, []);

  async function handleImageUpload(file: File) {
    setUploading(true);
    setError(null);
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
    if (!name || !description || !image || !priceFrom || !priceTo || !categoryId) {
      return setError("Please fill all required fields");
    }
    setBusy(true);
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        priceFrom: Number(priceFrom),
        priceTo: Number(priceTo),
        variantNote,
        categoryId,
        image,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({ error: "Failed" }));
      return setError(d.error || "Failed to create");
    }
    router.push("/admin/products");
  }

  return (
    <div className="min-h-screen bg-ivory">
      <AdminSidebar />
      <main className="ml-60 p-8">
        <div className="max-w-2xl">
          <Link href="/admin/products" className="text-emerald-deep text-sm mb-4 inline-block">
            ← Back to products
          </Link>
          <h1 className="font-display text-3xl font-bold text-emerald-deep mb-8">
            Add New Product
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2">Product Image *</label>
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
                  {uploading ? "Uploading..." : "Choose Image"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Description *</label>
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
                <label className="block text-sm font-semibold mb-2">Price From (Rs.) *</label>
                <input
                  type="number"
                  value={priceFrom}
                  onChange={(e) => setPriceFrom(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Price To (Rs.) *</label>
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
                placeholder="e.g. Available in 4kg – 12kg daig sizes"
                className="w-full px-4 py-3 rounded-xl border"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border bg-white"
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

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
              {busy ? "Saving..." : "Save Product"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}`,

  // ============ CATEGORIES ============
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

  return (
    <div className="min-h-screen bg-ivory">
      <AdminSidebar />
      <main className="ml-60 p-8">
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
              className="px-6 py-2 rounded-xl font-semibold text-emerald-deep bg-gold-gradient shadow-gold"
            >
              Add
            </button>
          </form>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-2">
              {categories.map((c) => (
                <div key={c.id} className="luxe-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c.icon || "📁"}</span>
                    <div>
                      <p className="font-semibold text-emerald-deep">{c.name}</p>
                      <p className="text-xs text-charcoal-soft">
                        {c._count.products} products
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}`,

  // ============ ENQUIRIES ============
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
      <main className="ml-60 p-8">
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
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-emerald-deep">{e.name}</p>
                    <p className="text-sm text-charcoal-soft">📞 {e.phone}</p>
                    {e.email && <p className="text-sm text-charcoal-soft">✉️ {e.email}</p>}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold">
                    {e.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mt-3">
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

  // ============ MESSAGES ============
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
      <main className="ml-60 p-8">
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
                <div className="flex items-start justify-between mb-2">
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
}`

};

for (const [filePath, content] of Object.entries(files)) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log("Created: " + filePath);
}
console.log("\nAll admin files created successfully!");
