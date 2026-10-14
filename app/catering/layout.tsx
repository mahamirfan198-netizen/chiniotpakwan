import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding & Event Catering in Lahore — Daig Packages & Prices",
  description:
    "Full-service Pakistani catering in Lahore, Faisalabad, Karachi, and Islamabad. Wedding, mehndi, walima, aqeeqah, and corporate daig packages. Get a custom quote on WhatsApp.",
  alternates: {
    canonical: "/catering",
  },
  openGraph: {
    title: "Chiniot Pakwan Catering — Wedding & Event Daig Service",
    description:
      "Authentic Chinioti catering for weddings, mehndi, walima, aqeeqah, and corporate events across Pakistan.",
    url: "/catering",
  },
};

export default function CateringLayout({ children }: { children: React.ReactNode }) {
  return children;
}
