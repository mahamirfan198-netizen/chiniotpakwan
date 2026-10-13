"use client";

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
  orders: number;
  newOrders: number;
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
          <StatCard href="/admin/orders" icon="📋" label="Orders" value={stats.orders} badge={stats.newOrders} />
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
}