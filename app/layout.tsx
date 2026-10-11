import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Chiniot Pakwan — Authentic Pakistani Catering & Daig Service in Lahore",
  description: "Premium Pakistani catering and daig ordering service in Lahore.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable + " " + playfair.variable}>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}