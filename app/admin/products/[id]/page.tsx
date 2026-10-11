"use client";

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
}