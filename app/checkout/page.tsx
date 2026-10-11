"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart";

const JAZZCASH_NUMBER = "03008008672";
const EASYPAISA_NUMBER = "03491325702";
const MEEZAN_ACCOUNT = "00300111388927";
const ACCOUNT_TITLE = "MUHAMMAD MUBASHIR ABU BAKAR";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Lahore");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [transactionId, setTransactionId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (items.length === 0) return setError("Cart is empty");
    if (!customerName || !customerPhone || !address) return setError("Fill required fields");
    if (paymentMethod !== "COD" && !transactionId.trim()) {
      return setError("Please enter your Transaction ID after payment");
    }

    setBusy(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          address,
          city,
          notes,
          paymentMethod,
          transactionId,
          items: items.map((i) => ({ productId: i.id, price: i.price, quantity: i.quantity })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Order failed");
        setBusy(false);
        return;
      }

      const order = data.order;
      const msg = encodeURIComponent(
        "Assalam-o-Alaikum! New Order:\n\n" +
        "Order #" + order.orderNumber + "\n" +
        "Name: " + customerName + "\n" +
        "Phone: " + customerPhone + "\n" +
        "Address: " + address + ", " + city + "\n\n" +
        "Items:\n" +
        items.map((i) => "- " + i.name + " x" + i.quantity + " = Rs. " + (i.price * i.quantity).toLocaleString()).join("\n") +
        "\n\nTotal: Rs. " + totalPrice.toLocaleString() + "\n" +
        "Payment: " + paymentMethod +
        (transactionId ? "\nTRX ID: " + transactionId : "")
      );

      clearCart();
      router.push("/order-success?order=" + order.orderNumber + "&wa=" + encodeURIComponent(msg));
    } catch (err: any) {
      setError("Network error: " + err.message);
      setBusy(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
        <div className="text-center luxe-card p-12 max-w-md">
          <h1 className="font-display text-2xl font-bold text-emerald-deep mb-2">Cart is empty</h1>
          <p className="text-charcoal-soft mb-6">Add some dishes before checking out.</p>
          <Link href="/menu" className="btn-gold inline-block">Go to Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-emerald-deep shadow-luxe">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center">
              <span className="text-xl">🍛</span>
            </div>
            <span className="font-display text-lg font-bold text-ivory hidden sm:block">Chiniot Pakwan</span>
          </Link>
          <Link href="/cart" className="text-ivory/80 hover:text-gold-bright transition text-sm font-medium">
            ← Back to Cart
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-display text-4xl font-bold text-emerald-deep mb-2">Checkout</h1>
        <p className="text-charcoal-soft mb-8">Complete your order details below</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Info */}
          <div className="luxe-card p-6">
            <h2 className="font-display text-xl font-bold text-emerald-deep mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name *"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border"
                required
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border md:col-span-2"
              />
            </div>
          </div>

          {/* Delivery */}
          <div className="luxe-card p-6">
            <h2 className="font-display text-xl font-bold text-emerald-deep mb-4">Delivery Address</h2>
            <div className="space-y-4">
              <textarea
                placeholder="Complete Address *"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border resize-none"
                required
              />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border bg-white"
              >
                <option value="Lahore">Lahore</option>
                <option value="Faisalabad">Faisalabad</option>
                <option value="Karachi">Karachi</option>
                <option value="Islamabad">Islamabad</option>
              </select>
              <textarea
                placeholder="Special instructions (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border resize-none"
              />
            </div>
          </div>

          {/* Payment */}
          <div className="luxe-card p-6">
            <h2 className="font-display text-xl font-bold text-emerald-deep mb-4">Payment Method</h2>
            <div className="space-y-3">

              {/* Cash on Delivery */}
              <label className="flex items-start gap-3 p-4 rounded-xl border cursor-pointer hover:bg-ivory-warm transition">
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <p className="font-semibold text-emerald-deep">💵 Cash on Delivery</p>
                  <p className="text-sm text-charcoal-soft">Pay when your order is delivered</p>
                </div>
              </label>

              {/* JazzCash */}
              <label className="flex items-start gap-3 p-4 rounded-xl border cursor-pointer hover:bg-ivory-warm transition">
                <input
                  type="radio"
                  name="payment"
                  value="JAZZCASH"
                  checked={paymentMethod === "JAZZCASH"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-semibold text-emerald-deep">📱 JazzCash</p>
                  <p className="text-sm text-charcoal-soft mb-2">
                    Send payment to the number below, then enter your Transaction ID
                  </p>
                  {paymentMethod === "JAZZCASH" && (
                    <div className="mt-3 p-3 rounded-lg bg-gold/10 border border-gold/30">
                      <p className="text-sm mb-1"><strong>Send to:</strong> {JAZZCASH_NUMBER}</p>
                      <p className="text-sm mb-2"><strong>Account Title:</strong> {ACCOUNT_TITLE}</p>
                      <input
                        type="text"
                        placeholder="Enter JazzCash Transaction ID"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border text-sm"
                      />
                    </div>
                  )}
                </div>
              </label>

              {/* EasyPaisa */}
              <label className="flex items-start gap-3 p-4 rounded-xl border cursor-pointer hover:bg-ivory-warm transition">
                <input
                  type="radio"
                  name="payment"
                  value="EASYPAISA"
                  checked={paymentMethod === "EASYPAISA"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-semibold text-emerald-deep">📱 EasyPaisa</p>
                  <p className="text-sm text-charcoal-soft mb-2">
                    Send payment to the number below, then enter your Transaction ID
                  </p>
                  {paymentMethod === "EASYPAISA" && (
                    <div className="mt-3 p-3 rounded-lg bg-gold/10 border border-gold/30">
                      <p className="text-sm mb-1"><strong>Send to:</strong> {EASYPAISA_NUMBER}</p>
                      <p className="text-sm mb-2"><strong>Account Title:</strong> {ACCOUNT_TITLE}</p>
                      <input
                        type="text"
                        placeholder="Enter EasyPaisa Transaction ID"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border text-sm"
                      />
                    </div>
                  )}
                </div>
              </label>

              {/* Meezan Bank */}
              <label className="flex items-start gap-3 p-4 rounded-xl border cursor-pointer hover:bg-ivory-warm transition">
                <input
                  type="radio"
                  name="payment"
                  value="MEEZAN"
                  checked={paymentMethod === "MEEZAN"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-semibold text-emerald-deep">🏦 Meezan Bank — Asaan Digital Account</p>
                  <p className="text-sm text-charcoal-soft mb-2">
                    Transfer to the account below, then enter your Transaction ID
                  </p>
                  {paymentMethod === "MEEZAN" && (
                    <div className="mt-3 p-3 rounded-lg bg-gold/10 border border-gold/30">
                      <p className="text-sm mb-1"><strong>Account Number:</strong> {MEEZAN_ACCOUNT}</p>
                      <p className="text-sm mb-2"><strong>Account Title:</strong> {ACCOUNT_TITLE}</p>
                      <input
                        type="text"
                        placeholder="Enter Meezan Transaction ID"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border text-sm"
                      />
                    </div>
                  )}
                </div>
              </label>

            </div>
          </div>

          {/* Order Summary */}
          <div className="luxe-card p-6">
            <h2 className="font-display text-xl font-bold text-emerald-deep mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span className="text-charcoal-soft">
                    {i.name} × {i.quantity}
                  </span>
                  <span className="font-semibold">
                    Rs. {(i.price * i.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4 border-t border-gold/20 text-lg">
              <span className="font-display font-bold text-emerald-deep">Total</span>
              <span className="font-display font-bold text-emerald-deep">
                Rs. {totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-4 rounded-xl font-bold text-emerald-deep bg-gold-gradient shadow-gold hover:opacity-90 transition text-lg disabled:opacity-60"
          >
            {busy ? "Placing Order..." : "Place Order — Rs. " + totalPrice.toLocaleString()}
          </button>
        </form>
      </main>
    </div>
  );
}