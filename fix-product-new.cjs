const fs = require("fs");
const path = require("path");

const files = {

  // ============ NEW PRODUCT PAGE ============
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
        const cats = d.categories || [];
        setCategories(cats);
        if (cats.length > 0) setCategoryId(cats[0].id);
      })
      .catch((err) => console.error("Categories load error:", err));
  }, []);

  async function handleImageUpload(file: File) {
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        setImage(data.url);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err: any) {
      setError("Upload error: " + (err.message || "unknown"));
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Enter product name");
    if (!description.trim()) return setError("Enter description");
    if (!image) return setError("Upload an image first");
    if (!priceFrom || !priceTo) return setError("Enter both prices");
    if (!categoryId) return setError("Select a category");

    setBusy(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          priceFrom: Number(priceFrom),
          priceTo: Number(priceTo),
          variantNote: variantNote.trim(),
          categoryId,
          image,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create");
        setBusy(false);
        return;
      }

      router.push("/admin/products");
    } catch (err: any) {
      setError("Network error: " + (err.message || "unknown"));
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-ivory">
      <AdminSidebar />
      <main className="md:ml-60 p-4 md:p-8">
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
              <p className="text-xs text-charcoal-soft mt-2">
                Or paste an image URL directly:
              </p>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://... or /menu/xxx.jpg"
                className="w-full px-4 py-2 mt-2 rounded-xl border text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border"
                placeholder="Chicken White Korma Daig"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border resize-none"
                placeholder="Creamy white korma prepared with tender chicken..."
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
                  placeholder="7000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Price To (Rs.) *</label>
                <input
                  type="number"
                  value={priceTo}
                  onChange={(e) => setPriceTo(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border"
                  placeholder="21000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Variant Note</label>
              <input
                type="text"
                value={variantNote}
                onChange={(e) => setVariantNote(e.target.value)}
                placeholder="Available in 4kg – 12kg daig sizes"
                className="w-full px-4 py-3 rounded-xl border"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border bg-white"
              >
                {categories.length === 0 ? (
                  <option value="">Loading categories...</option>
                ) : (
                  categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))
                )}
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
}`

};

for (const [filePath, content] of Object.entries(files)) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log("Created: " + filePath);
}
console.log("\nFile created successfully!");
