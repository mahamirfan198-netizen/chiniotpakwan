import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding Catering & Daig Service in Lahore",
  description:
    "Wedding, mehndi, walima, aqeeqah & corporate catering in Lahore, Faisalabad, Karachi and Islamabad. Authentic Chinioti daig packages. Get a quote on WhatsApp.",
  alternates: { canonical: "/catering" },
  openGraph: {
    title: "Chiniot Pakwan Catering: Wedding & Event Daig Service",
    description: "Authentic Chinioti catering for weddings, mehndi, walima, aqeeqah and corporate events across Pakistan.",
    url: "/catering",
  },
};

export default function CateringLayout({ children }: { children: React.ReactNode }) {
  return children;
}
