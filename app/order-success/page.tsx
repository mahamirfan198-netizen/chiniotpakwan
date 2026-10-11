"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const params = useSearchParams();
  const orderNumber = params.get("order");
  const waMsg = params.get("wa");
  const whatsappUrl = waMsg ? "https://wa.me/923008008672?text=" + waMsg : "https://wa.me/923008008672";

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
      <div className="luxe-card p-10 max-w-lg w-full text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-gold-gradient flex items-center justify-center mb-6">
          <span className="text-4xl">✓</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-emerald-deep mb-2">Order Received!</h1>
        <p className="text-charcoal-soft mb-6">Thank you! We'll confirm your order shortly.</p>
        {orderNumber && (
          <div className="p-4 rounded-xl bg-gold/10 border border-gold/30 mb-6">
            <p className="text-xs text-charcoal-soft uppercase tracking-wider mb-1">Order Number</p>
            <p className="font-display text-2xl font-bold text-emerald-deep">{orderNumber}</p>
          </div>
        )}
        <p className="text-sm text-charcoal-soft mb-6">
          Click below to send your order on WhatsApp for faster confirmation:
        </p>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp justify-center w-full py-4 mb-3">
          💬 Confirm on WhatsApp
        </a>
        <Link href="/menu" className="block w-full py-3 rounded-xl font-semibold text-emerald-deep bg-ivory-warm hover:bg-gold/20 transition">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}