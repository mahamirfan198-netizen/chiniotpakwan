const fs = require("fs");
const path = require("path");

const content = `"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
        <div className="text-center luxe-card p-12 max-w-md">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="font-display text-3xl font-bold text-emerald-deep mb-2">Your cart is empty</h1>
          <p className="text-charcoal-soft mb-6">Add some delicious dishes from our menu!</p>
          <Link href="/menu" className="btn-gold">Browse Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <nav className="sticky top-0 z-50 bg-emerald-deep shadow-luxe">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center">
              <span className="text-xl">🍛</span>
            </div>
            <span className="font-display text-lg font-bold text-ivory hidden sm:block">Chiniot Pakwan</span>
          </Link>
          <Link href="/menu" className="text-ivory/80 hover:text-gold transition text-sm">← Continue Shopping</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-display text-4xl font-bold text-emerald-deep mb-2">Your Cart</h1>
        <p className="text-charcoal-soft mb-8">{totalItems} {totalItems === 1 ? "item" : "items"}</p>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div key={item.id} className="luxe-card p-4 flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-emerald-deep truncate">{item.name}</p>
                <p className="text-sm text-charcoal-soft">Rs. {item.price.toLocaleString()} each</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-lg bg-ivory-warm font-bold">−</button>
                <span className="w-8 text-center font-bold">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-lg bg-ivory-warm font-bold">+</button>
              </div>
              <div className="text-right ml-4">
                <p className="font-display text-lg font-bold text-emerald-deep">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                <button onClick={() => removeItem(item.id)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="luxe-card p-6">
          <div className="flex justify-between mb-4 text-lg">
            <span className="text-charcoal-soft">Subtotal</span>
            <span className="font-display font-bold">Rs. {totalPrice.toLocaleString()}</span>
          </div>
          <Link href="/checkout" className="block w-full text-center py-4 rounded-xl font-semibold text-emerald-deep bg-gold-gradient shadow-gold hover:opacity-90 transition">
            Proceed to Checkout →
          </Link>
        </div>
      </main>
    </div>
  );
}`;

const dir = "app/cart";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(dir + "/page.tsx", content);
console.log("Created: app/cart/page.tsx");
