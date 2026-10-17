"use client";

import Script from "next/script";
import { getProductSchema, getBreadcrumbSchema } from "@/lib/structuredData";
import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { optimizeImage } from "@/lib/img";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceFrom: number;
  priceTo: number;
  variantNote: string | null;
  image: string;
  popular: boolean;
  available: boolean;
  category: { id: string; name: string; icon?: string };
};

function ProductDetailContent() {
  const params = useParams();
  const id = params.id as string;
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch("/api/products/" + id)
      .then((r) => r.json())
      .then((d) => {
        if (d.product) {
          setProduct(d.product);
          setSelectedPrice(d.product.priceFrom);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-ivory">Loading...</div>;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory p-6">
        <div className="luxe-card p-12 max-w-md text-center">
          <div className="text-6xl mb-4">🍛</div>
          <h1 className="font-display text-2xl font-bold text-emerald-deep mb-2">Product not found</h1>
          <Link href="/menu" className="btn-gold inline-block mt-4">Back to Menu</Link>
        </div>
      </div>
    );
  }

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
      "Assalam-o-Alaikum! I would like to order:\n\n" +
      "Product: " + product.name + "\n" +
      "Price: Rs. " + selectedPrice.toLocaleString() + "\n" +
      "Quantity: " + quantity + "\n" +
      "Total: Rs. " + (selectedPrice * quantity).toLocaleString()
    );
    window.open("https://wa.me/923008008672?text=" + msg, "_blank");
  }

  return (
    <div className="min-h-screen bg-ivory">
      <nav className="sticky top-0 z-50 bg-emerald-deep shadow-luxe">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center">
              <span className="text-xl">🍛</span>
            </div>      {/* Structured Data */}
      {product && (
        <>
          <Script
            id="product-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(getProductSchema({
                name: product.name,
                description: product.description,
                image: product.image,
                priceFrom: product.priceFrom,
                priceTo: product.priceTo,
                slug: product.slug || product.id,
              })),
            }}
          />
          <Script
            id="breadcrumb-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(getBreadcrumbSchema([
                { name: "Home", url: "/" },
                { name: "Menu", url: "/menu" },
                { name: product.name, url: "/menu/" + (product.slug || product.id) },
              ])),
            }}
          />
        </>
      )}
            <span className="font-display text-lg font-bold text-ivory hidden sm:block">Chiniot Pakwan</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/menu" className="text-ivory/80 hover:text-gold transition text-sm">Menu</Link>
            <CartIcon />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pb-16 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-black shadow-luxe">
              <img src={optimizeImage(product.image, 900)} fetchPriority="high" alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.popular && (
              <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-gold-gradient text-emerald-deep text-xs font-bold uppercase shadow-luxe">
                Popular
              </div>
            )}
          </div>

          <div>
            <p className="text-gold tracking-widest text-xs uppercase font-semibold mb-2">{product.category.name}</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-emerald-deep mb-4 leading-tight">{product.name}</h1>
            <div className="h-1 w-16 bg-gold-gradient rounded-full mb-6" />
            <p className="text-charcoal-soft leading-relaxed mb-6 text-lg">{product.description}</p>

            {product.variantNote && (
              <div className="p-4 rounded-xl bg-ivory-warm border border-gold/30 mb-6">
                <p className="text-sm text-charcoal-soft"><strong>{product.variantNote}</strong></p>
              </div>
            )}

            <div className="p-6 rounded-2xl bg-white border border-gold/20 mb-6">
              <p className="text-xs text-charcoal-soft uppercase tracking-wider mb-3">Choose your size</p>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => setSelectedPrice(product.priceFrom)}
                  className={"px-5 py-3 rounded-xl text-sm font-bold transition " + (selectedPrice === product.priceFrom ? "bg-emerald-deep text-ivory" : "bg-ivory text-charcoal-soft border border-ivory-warm")}
                >
                  Small - Rs. {product.priceFrom.toLocaleString()}
                </button>
                <button
                  onClick={() => setSelectedPrice(product.priceTo)}
                  className={"px-5 py-3 rounded-xl text-sm font-bold transition " + (selectedPrice === product.priceTo ? "bg-emerald-deep text-ivory" : "bg-ivory text-charcoal-soft border border-ivory-warm")}
                >
                  Large - Rs. {product.priceTo.toLocaleString()}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3 text-emerald-deep">Quantity</label>
              <div className="flex items-center gap-4">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 rounded-xl bg-ivory-warm text-emerald-deep font-bold text-2xl">-</button>
                <span className="w-20 text-center font-display text-3xl font-bold text-emerald-deep">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 rounded-xl bg-ivory-warm text-emerald-deep font-bold text-2xl">+</button>
              </div>
            </div>

            <div className="mb-6 p-5 rounded-2xl bg-gold/10 border border-gold/30">
              <div className="flex justify-between items-center">
                <span className="text-charcoal-soft font-semibold">Total</span>
                <span className="font-display text-3xl font-bold text-emerald-deep">Rs. {(selectedPrice * quantity).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={handleAddToCart} className={"w-full py-4 rounded-xl font-bold text-lg " + (added ? "bg-green-500 text-white" : "text-emerald-deep bg-gold-gradient shadow-gold")}>
                {added ? "Added to Cart!" : "Add to Cart"}
              </button>
              <button onClick={handleWhatsAppOrder} className="btn-whatsapp justify-center py-4 text-base">Order on WhatsApp</button>
              <Link href="/cart" className="block w-full py-4 rounded-xl font-bold text-lg text-center bg-emerald-deep text-ivory">View Cart and Checkout</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartIcon() {
  const { totalItems } = useCart();
  return (
    <Link href="/cart" className="relative text-ivory text-2xl">
      Cart
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
}