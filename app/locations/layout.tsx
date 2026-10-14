import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Locations — Chiniot Pakwan Branches Across Pakistan",
  description:
    "Find Chiniot Pakwan branches in Lahore, Faisalabad, Karachi, and Islamabad. Get directions, phone numbers, and hours for your nearest daig and catering service.",
  alternates: {
    canonical: "/locations",
  },
  openGraph: {
    title: "Chiniot Pakwan Locations — Lahore, Faisalabad, Karachi, Islamabad",
    description:
      "Visit your nearest Chiniot Pakwan branch for authentic Chinioti daig and catering.",
    url: "/locations",
  },
};

export default function LocationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
