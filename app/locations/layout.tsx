import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Locations — Lahore, Faisalabad, Karachi, Islamabad",
  description:
    "Visit Chiniot Pakwan in Lahore, Faisalabad, Karachi, or Islamabad. Find directions on Google Maps and call for daig orders and catering services.",
  keywords: [
    "Chiniot Pakwan Lahore",
    "Chiniot Pakwan Faisalabad",
    "Chiniot Pakwan Karachi",
    "Chiniot Pakwan Islamabad",
    "daig service near me",
  ],
};

export default function LocationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}