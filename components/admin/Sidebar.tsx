"use client";

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
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-60 bg-emerald-deep p-4 text-ivory z-40">
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
}