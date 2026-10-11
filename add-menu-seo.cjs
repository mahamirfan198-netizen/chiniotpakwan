const fs = require("fs");
const content = `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Menu — Chicken, Beef, Mutton, Rice & Biryani",
  description:
    "Order authentic Pakistani daigs online — Chicken White Korma, Nihari, Mutton Kunna, Lahori Biryani, Kabuli Pulao, and more. Fresh daigs delivered across Lahore, Faisalabad, Karachi, and Islamabad.",
  keywords: [
    "daig menu Lahore",
    "chicken white korma daig",
    "mutton kunna price",
    "biryani daig price",
    "kabuli pulao daig",
    "Pakistani catering menu",
  ],
  openGraph: {
    title: "Complete Menu | Chiniot Pakwan",
    description: "Order authentic Pakistani daigs online.",
    type: "website",
  },
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}`;
const dir = "app/menu";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(dir + "/layout.tsx", content);
console.log("Created: app/menu/layout.tsx");
