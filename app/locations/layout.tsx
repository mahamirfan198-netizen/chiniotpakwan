import { Metadata } from "next";
import CityLinks from "@/components/CityLinks";

export const metadata: Metadata = {
  title: "Branches in Lahore, Faisalabad, Karachi",
  description:
    "Chiniot Pakwan branches in Lahore, Faisalabad, Karachi and Islamabad. Find your nearest daig and catering service with directions and phone number.",
  alternates: { canonical: "/locations" },
  openGraph: {
    title: "Chiniot Pakwan Locations: Lahore, Faisalabad, Karachi, Islamabad",
    description: "Visit your nearest Chiniot Pakwan branch for authentic Chinioti daig and catering.",
    url: "/locations",
  },
};

export default function LocationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CityLinks />
    </>
  );
}
