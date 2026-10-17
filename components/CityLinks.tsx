import Link from "next/link";

export const CITIES = [
  { slug: "lahore", name: "Lahore" },
  { slug: "faisalabad", name: "Faisalabad" },
  { slug: "karachi", name: "Karachi" },
  { slug: "islamabad", name: "Islamabad" },
];

export default function CityLinks({ current }: { current?: string }) {
  return (
    <nav aria-label="Daig and catering by city" className="bg-ivory-warm px-6 py-10">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="font-display text-2xl font-bold text-emerald-deep mb-4">Daig &amp; Wedding Catering by City</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {CITIES.filter((c) => c.slug !== current).map((c) => (
            <Link
              key={c.slug}
              href={"/catering/" + c.slug}
              className="px-5 py-2 rounded-full border border-[#c6a15b]/50 text-emerald-deep font-semibold text-sm hover:bg-[#c6a15b]/20 transition"
            >
              Catering in {c.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
