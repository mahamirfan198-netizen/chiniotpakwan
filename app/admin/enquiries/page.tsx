"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/Sidebar";

type Enquiry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  eventType: string;
  eventDate: string | null;
  guestCount: number | null;
  location: string | null;
  preferredDish: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
};

export default function EnquiriesAdmin() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/enquiries")
      .then((r) => r.json())
      .then((d) => {
        setEnquiries(d.enquiries || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-ivory">
      <AdminSidebar />
      <main className="md:ml-60 p-4 md:p-8">
        <h1 className="font-display text-3xl font-bold text-emerald-deep mb-8">
          Catering Enquiries
        </h1>
        {loading ? (
          <p>Loading...</p>
        ) : enquiries.length === 0 ? (
          <div className="luxe-card p-12 text-center">
            <p className="text-charcoal-soft">No enquiries yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {enquiries.map((e) => (
              <div key={e.id} className="luxe-card p-6">
                <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <p className="font-bold text-emerald-deep">{e.name}</p>
                    <p className="text-sm text-charcoal-soft">📞 {e.phone}</p>
                    {e.email && <p className="text-sm text-charcoal-soft">✉️ {e.email}</p>}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold">
                    {e.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-3">
                  <p><strong>Event:</strong> {e.eventType}</p>
                  {e.guestCount && <p><strong>Guests:</strong> {e.guestCount}</p>}
                  {e.eventDate && <p><strong>Date:</strong> {new Date(e.eventDate).toLocaleDateString()}</p>}
                  {e.location && <p><strong>Location:</strong> {e.location}</p>}
                  {e.preferredDish && <p><strong>Dish:</strong> {e.preferredDish}</p>}
                </div>
                {e.notes && (
                  <p className="text-sm mt-3 p-3 rounded-lg bg-ivory-warm">{e.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}