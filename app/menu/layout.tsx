import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Menu — Daig, Biryani, Korma & Catering Prices",
  description:
    "Browse Chiniot Pakwan's full menu: mutton kunna, chicken white korma, nihari, biryani, kabuli pulao, and wedding daigs. Live prices, serving sizes, and easy WhatsApp ordering.",
  alternates: {
    canonical: "/menu",
  },
  openGraph: {
    title: "Chiniot Pakwan Menu — Authentic Chinioti Daig & Catering",
    description:
      "Full daig menu with live prices. Mutton kunna, chicken korma, biryani, and wedding catering.",
    url: "/menu",
  },
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
