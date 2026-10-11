const fs = require("fs");
const path = require("path");

const files = {

  // ============ CART CONTEXT ============
  "lib/cart.tsx": `"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variantNote?: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, loaded]);

  function addItem(item: CartItem) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}`,

  // ============ PRODUCTS PUBLIC API ============
  "app/api/products/route.ts": `import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { available: true },
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true, icon: true } },
      },
    });
    return NextResponse.json({ products });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}`,

  // ============ SINGLE PRODUCT PUBLIC API ============
  "app/api/products/[id]/route.ts": `import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
      },
    });

    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ product });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}`,

  // ============ CONTACT FORM API ============
  "app/api/contact/route.ts": `import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, message } = await req.json();

    if (!name || !phone || !message) {
      return NextResponse.json({ error: "Name, phone, and message required" }, { status: 400 });
    }

    const contact = await prisma.contactMessage.create({
      data: { name, phone, email: email || null, message },
    });

    return NextResponse.json({ ok: true, id: contact.id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}`,

  // ============ CATERING ENQUIRY API ============
  "app/api/catering/route.ts": `import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, phone, email, eventType, eventDate, guestCount, location, preferredDish, notes } = data;

    if (!name || !phone || !eventType) {
      return NextResponse.json({ error: "Name, phone, and event type required" }, { status: 400 });
    }

    const enquiry = await prisma.cateringEnquiry.create({
      data: {
        name,
        phone,
        email: email || null,
        eventType,
        eventDate: eventDate ? new Date(eventDate) : null,
        guestCount: guestCount ? Number(guestCount) : null,
        location: location || null,
        preferredDish: preferredDish || null,
        notes: notes || null,
      },
    });

    return NextResponse.json({ ok: true, id: enquiry.id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}`,

  // ============ PRODUCT DETAIL PAGE ============
  "app/menu/[id]/page.tsx": `"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart";

type Product = {
  id: string;
  name: string;
  description: string;
  priceFrom: number;
  priceTo: number;
  variantNote: string | null;
  image: string;
  popular: boolean;
  category: { id: string; name: string };
};

function ProductDetailContent() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch("/api/products/" + id)
      .then((r) => r.json())
      .then((d) => {
        setProduct(d.product);
        setSelectedPrice(d.product?.priceFrom || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  function handleAddToCart() {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: selectedPrice,
      image: product.image,
      quantity,
      variantNote: product.variantNote || undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleWhatsAppOrder() {
    if (!product) return;
    const msg = encodeURIComponent(
      "Assalam-o-Alaikum! I would like to order:\\n\\n" +
      "🍛 " + product.name + "\\n" +
      "💰 Price: Rs. " + selectedPrice.toLocaleString() + "\\n" +
      "🔢 Quantity: " + quantity + "\\n" +
      "💵 Total: Rs. " + (selectedPrice * quantity).toLocaleString() + "\\n\\n" +
      "Please confirm availability."
    );
    window.open("https://wa.me/923009219945?text=" + msg, "_blank");
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-emerald-deep shadow-luxe">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center">
              <span className="text-xl">🍛</span>
            </div>
            <span className="font-display text-lg font-bold text-ivory hidden sm:block">Chiniot Pakwan</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/menu" className="text-ivory/80 hover:text-gold transition text-sm">← Menu</Link>
            <CartButton />
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 py-4 text-sm text-charcoal-soft">
        <Link href="/menu" className="hover:text-gold transition">Menu</Link>
        <span className="mx-2">/</span>
        <Link href={"/menu?category=" + product.category.id} className="hover:text-gold transition">{product.category.name}</Link>
        <span className="mx-2">/</span>
        <span className="text-emerald-deep font-semibold">{product.name}</span>
      </div>

      {/* Product */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-black shadow-luxe">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.popular && (
              <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-gold-gradient text-emerald-deep text-xs font-bold tracking-wider uppercase shadow-luxe">
                ★ Popular
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="text-gold tracking-[0.3em] text-xs uppercase font-semibold mb-2">{product.category.name}</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-emerald-deep mb-4 leading-tight">{product.name}</h1>
            <div className="divider-gold mb-6" style={{ marginLeft: 0 }} />

            <p className="text-charcoal-soft leading-relaxed mb-6">{product.description}</p>

            {product.variantNote && (
              <div className="p-4 rounded-xl bg-ivory-warm border border-gold/30 mb-6">
                <p className="text-sm text-charcoal-soft"><strong>📦 {product.variantNote}</strong></p>
              </div>
            )}

            <div className="p-6 rounded-2xl bg-white border border-gold/20 mb-6">
              <p className="text-xs text-charcoal-soft uppercase tracking-wider mb-1">Price range</p>
              <p className="font-display text-3xl font-bold text-emerald-deep">Rs. {product.priceFrom.toLocaleString()} – {product.priceTo.toLocaleString()}</p>
              <div className="mt-4 pt-4 border-t border-gold/20">
                <label className="block text-sm font-semibold mb-2">Select Price</label>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedPrice(product.priceFrom)}
                    className={"px-4 py-2 rounded-xl text-sm font-semibold transition " + (selectedPrice === product.priceFrom ? "bg-emerald-deep text-ivory" : "bg-ivory text-charcoal-soft hover:bg-gold/20")}
                  >
                    Rs. {product.priceFrom.toLocaleString()}
                  </button>
                  <button
                    onClick={() => setSelectedPrice(product.priceTo)}
                    className={"px-4 py-2 rounded-xl text-sm font-semibold transition " + (selectedPrice === product.priceTo ? "bg-emerald-deep text-ivory" : "bg-ivory text-charcoal-soft hover:bg-gold/20")}
                  >
                    Rs. {product.priceTo.toLocaleString()}
                  </button>
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-xl bg-ivory-warm text-emerald-deep font-bold text-xl hover:bg-gold/20 transition">−</button>
                <span className="w-16 text-center font-display text-2xl font-bold text-emerald-deep">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-xl bg-ivory-warm text-emerald-deep font-bold text-xl hover:bg-gold/20 transition">+</button>
              </div>
            </div>

            {/* Total */}
            <div className="mb-6 p-4 rounded-xl bg-gold/10 border border-gold/30">
              <div className="flex justify-between items-center">
                <span className="text-charcoal-soft">Total</span>
                <span className="font-display text-2xl font-bold text-emerald-deep">Rs. {(selectedPrice * quantity).toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button onClick={handleAddToCart} className="w-full py-4 rounded-xl font-semibold text-emerald-deep bg-gold-gradient shadow-gold hover:opacity-90 transition">
                {added ? "✓ Added to Cart" : "🛒 Add to Cart"}
              </button>
              <button onClick={handleWhatsAppOrder} className="btn-whatsapp justify-center py-4">
                💬 Order on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartButton() {
  const { totalItems } = useCart();
  return (
    <Link href="/cart" className="relative text-ivory text-2xl">
      🛒
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold text-emerald-deep text-[10px] font-bold flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
      <ProductDetailContent />
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
console.log("\nAll files created successfully!");
