"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("mahamirfan198@gmail.com");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [needSetup, setNeedSetup] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/setup")
      .then((r) => r.json())
      .then((d) => {
        setNeedSetup(!d.exists);
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, []);

  async function handleSetup(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const res = await fetch("/api/admin/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, name }),
    });

    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Setup failed");
      setBusy(false);
      return;
    }

    // Auto-login after setup
    const loginRes = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "mahamirfan198@gmail.com", password }),
    });

    setBusy(false);
    if (loginRes.ok) {
      router.push("/admin");
      router.refresh();
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setBusy(false);

    if (!res.ok) {
      const d = await res.json().catch(() => ({ error: "Login failed" }));
      setError(d.error || "Login failed");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-deep">
        <p className="text-ivory">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-deep p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-gold-gradient flex items-center justify-center mb-4">
            <span className="text-3xl">🍛</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-emerald-deep">
            {needSetup ? "Admin Setup" : "Admin Login"}
          </h1>
          <p className="text-sm text-charcoal-soft mt-1">
            {needSetup ? "Create your admin password" : "Chiniot Pakwan Dashboard"}
          </p>
        </div>

        {needSetup ? (
          <form onSubmit={handleSetup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 rounded-xl border bg-gray-50 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Your name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Maham Irfan"
                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 rounded-xl font-semibold text-emerald-deep bg-gold-gradient shadow-gold disabled:opacity-60"
            >
              {busy ? "Creating..." : "Create Admin Account"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-gold/40"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-gold/40"
                required
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 rounded-xl font-semibold text-emerald-deep bg-gold-gradient shadow-gold disabled:opacity-60"
            >
              {busy ? "Signing in..." : "Sign In"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}