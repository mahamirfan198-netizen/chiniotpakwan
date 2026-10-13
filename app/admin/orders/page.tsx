"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/Sidebar";

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "NEW" | "PREPARING" | "DELIVERED" | "CANCELLED">("all");
  const [selected, setSelected] = useState<any>(null);

  async function load() {
    const res = await fetch("/api/admin/orders");
    if (res.status === 401) { window.location.href = "/admin/login"; return; }
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  async function updateStatus(orderId: string, status: string) {
    await fetch("/api/admin/orders/" + orderId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function updatePayment(orderId: string, paymentStatus: string) {
    await fetch("/api/admin/orders/" + orderId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus }),
    });
    load();
  }

  async function deleteOrder(order: any) {
    if (!confirm("Delete order #" + order.orderNumber + "?")) return;
    await fetch("/api/admin/orders/" + order.id, { method: "DELETE" });
    setSelected(null);
    load();
  }

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const newCount = orders.filter((o) => o.status === "NEW").length;

  return (
    <div className="min-h-screen bg-ivory">
      <AdminSidebar />
      <main className="md:ml-60 p-4 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-emerald-deep flex items-center gap-3">
              Orders
              {newCount > 0 && <span className="px-3 py-1 rounded-full bg-red-500 text-white text-sm font-bold">{newCount} new</span>}
            </h1>
            <p className="text-charcoal-soft">{orders.length} total orders</p>
          </div>
          <button onClick={load} className="px-4 py-2 rounded-xl bg-white border text-sm font-semibold hover:bg-ivory-warm">🔄 Refresh</button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
          {(["all", "NEW", "PREPARING", "DELIVERED", "CANCELLED"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={"px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition " + (filter === f ? "bg-emerald-deep text-ivory" : "bg-white text-charcoal-soft border hover:bg-ivory-warm")}
            >
              {f === "all" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {loading ? <p>Loading...</p> : filtered.length === 0 ? (
          <div className="luxe-card p-12 text-center"><p className="text-charcoal-soft">No orders yet</p></div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <div
                key={order.id}
                className={"luxe-card p-5 cursor-pointer hover:shadow-luxe transition " + (order.status === "NEW" ? "border-l-4 border-l-red-500" : "")}
                onClick={() => setSelected(order)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-bold text-emerald-deep">{order.orderNumber}</p>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gray-100">{order.status}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100">{order.paymentMethod}</span>
                    </div>
                    <p className="text-sm text-charcoal-soft">👤 {order.customerName} · 📞 {order.customerPhone}</p>
                    <p className="text-xs text-charcoal-soft mt-1">📍 {order.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl font-bold text-emerald-deep">Rs. {order.totalAmount.toLocaleString()}</p>
                    <p className="text-xs text-charcoal-soft">{order.items.length} items</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selected && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-end md:items-center justify-center" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white p-5 border-b flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-emerald-deep">{selected.orderNumber}</h2>
              <button onClick={() => setSelected(null)} className="text-2xl opacity-60">×</button>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-wider text-charcoal-soft mb-2">Status</p>
                <div className="flex flex-wrap gap-2">
                  {["NEW", "PREPARING", "DELIVERED", "CANCELLED"].map((s) => (
                    <button key={s} onClick={() => { updateStatus(selected.id, s); setSelected({ ...selected, status: s }); }} className={"px-3 py-1.5 rounded-full text-xs font-semibold " + (selected.status === s ? "bg-emerald-deep text-ivory" : "bg-gray-100")}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-charcoal-soft mb-2">Payment</p>
                <div className="flex flex-wrap gap-2">
                  {["PENDING", "AWAITING_VERIFICATION", "PAID", "REFUNDED"].map((s) => (
                    <button key={s} onClick={() => { updatePayment(selected.id, s); setSelected({ ...selected, paymentStatus: s }); }} className={"px-3 py-1.5 rounded-full text-xs font-semibold " + (selected.paymentStatus === s ? "bg-emerald-deep text-ivory" : "bg-gray-100")}>{s.replace(/_/g, " ")}</button>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-ivory-warm">
                <p className="font-bold text-emerald-deep mb-2">Customer</p>
                <p className="text-sm">👤 {selected.customerName}</p>
                <a href={"tel:" + selected.customerPhone} className="text-sm text-purple-600 block">📞 {selected.customerPhone}</a>
                {selected.customerEmail && <a href={"mailto:" + selected.customerEmail} className="text-sm text-purple-600 block">✉️ {selected.customerEmail}</a>}
              </div>
              <div className="p-4 rounded-xl bg-ivory-warm">
                <p className="font-bold text-emerald-deep mb-2">Address</p>
                <p className="text-sm">📍 {selected.address}</p>
              </div>
              <div>
                <p className="font-bold text-emerald-deep mb-3">Items</p>
                <div className="space-y-2">
                  {selected.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border">
                      {item.image && <img src={item.image} className="w-14 h-14 rounded-lg object-cover" />}
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-charcoal-soft">Rs. {item.price.toLocaleString()} × {item.quantity}</p>
                      </div>
                      <p className="font-bold text-sm">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center p-4 rounded-xl bg-gold/10 border-2 border-gold/30">
                <span className="font-bold">Total</span>
                <span className="font-display text-2xl font-bold text-emerald-deep">Rs. {selected.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <a href={"https://wa.me/" + selected.customerPhone.replace(/[^0-9]/g, "")} target="_blank" rel="noopener noreferrer" className="btn-whatsapp flex-1 justify-center py-3">💬 WhatsApp</a>
                <button onClick={() => deleteOrder(selected)} className="px-4 py-3 rounded-xl bg-red-100 text-red-600 font-semibold">🗑️</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}