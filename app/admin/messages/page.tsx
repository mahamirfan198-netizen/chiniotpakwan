"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/Sidebar";

type Message = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/messages")
      .then((r) => r.json())
      .then((d) => {
        setMessages(d.messages || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-ivory">
      <AdminSidebar />
      <main className="md:ml-60 p-4 md:p-8">
        <h1 className="font-display text-3xl font-bold text-emerald-deep mb-8">
          Contact Messages
        </h1>
        {loading ? (
          <p>Loading...</p>
        ) : messages.length === 0 ? (
          <div className="luxe-card p-12 text-center">
            <p className="text-charcoal-soft">No messages yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={"luxe-card p-6 " + (m.read ? "" : "border-l-4 border-l-yellow-500")}>
                <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                  <div>
                    <p className="font-bold text-emerald-deep">{m.name}</p>
                    <p className="text-sm text-charcoal-soft">📞 {m.phone}</p>
                    {m.email && <p className="text-sm text-charcoal-soft">✉️ {m.email}</p>}
                  </div>
                  <p className="text-xs text-charcoal-soft">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm mt-3 p-3 rounded-lg bg-ivory-warm">{m.message}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}