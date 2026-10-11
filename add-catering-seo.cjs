const fs = require("fs");
const content = `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding & Event Catering — Daig Services Across Pakistan",
  description:
    "Complete Pakistani wedding catering, mehndi catering, walima, aqeeqah, and corporate event catering. Book daigs for 150-1000+ guests in Lahore, Faisalabad, Karachi, and Islamabad.",
  keywords: [
    "wedding catering Lahore",
    "mehndi catering Lahore",
    "walima catering",
    "aqeeqah catering",
    "nisar daig service",
    "corporate catering Lahore",
    "event catering Pakistan",
  ],
};

export default function CateringLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}`;
const dir = "app/catering";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(dir + "/layout.tsx", content);
console.log("Created: app/catering/layout.tsx");
