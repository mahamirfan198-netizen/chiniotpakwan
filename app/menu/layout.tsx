import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu & Prices: Daig, Biryani, Korma, Nihari",
  description:
    "Chiniot Pakwan menu & prices: mutton kunna, chicken white korma, nihari, biryani, kabuli pulao and wedding daigs. Check daig prices and order on WhatsApp.",
  alternates: { canonical: "/menu" },
  openGraph: {
    title: "Chiniot Pakwan Menu: Authentic Chinioti Daig & Catering Prices",
    description: "Full daig menu with prices. Mutton kunna, chicken korma, biryani and wedding catering.",
    url: "/menu",
  },
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
