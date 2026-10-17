export const citySlug = (city: string) => city.toLowerCase().replace(/[^a-z0-9]+/g, "-");
// Canonical site URL. A *.vercel.app value is ignored so Google always sees the real domain.
const DEFAULT_SITE_URL = "https://www.chiniotpakwan.pk";
const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/["']/g, "").trim();

export const SITE_URL = (envUrl && !envUrl.includes("vercel.app") ? envUrl : DEFAULT_SITE_URL).replace(/\/+$/, "");

export const SITE_NAME = "Chiniot Pakwan";
export const SITE_TAGLINE = "Daig & Wedding Catering in Lahore";
export const SITE_DESCRIPTION =
  "Order authentic Chinioti daig, mutton kunna, chicken korma & biryani online. Wedding, mehndi & walima catering in Lahore, Faisalabad, Karachi and Islamabad.";
export const OG_IMAGE = "/og-image.jpg";

export const CONTACT = {
  phone: "03008008672",
  phoneDisplay: "0300 8008672",
  whatsapp: "923008008672",
  email: "support@chiniotpakwan.pk",
};

export const LOCATIONS = [
  { city: "Lahore", region: "Punjab", mapsUrl: "https://maps.app.goo.gl/PHrv4jNuB9pzYnPWA" },
  { city: "Faisalabad", region: "Punjab", mapsUrl: "https://maps.app.goo.gl/HE5EuPym2SPgAWAm7" },
  { city: "Karachi", region: "Sindh", mapsUrl: "https://maps.app.goo.gl/1irXfZdRG5Yqj3688" },
  { city: "Islamabad", region: "Islamabad Capital Territory", mapsUrl: "https://share.google/YIDWLWKSEAjdOohE5" },
];

export const KEYWORDS = [
  "Chiniot Pakwan",
  "Chiniot Pakwan Lahore",
  "Chiniot Pakwan menu",
  "Chiniot Pakwan price list",
  "daig service Lahore",
  "daig service Faisalabad",
  "daig service Karachi",
  "daig service Islamabad",
  "daig price Lahore",
  "online daig order Pakistan",
  "family daig order",
  "Pakistani catering Lahore",
  "wedding catering Lahore",
  "wedding catering Karachi",
  "wedding catering Faisalabad",
  "wedding catering Islamabad",
  "mehndi catering",
  "walima catering",
  "aqeeqah catering",
  "corporate catering Lahore",
  "halal catering Pakistan",
  "mutton kunna Lahore",
  "chicken white korma daig",
  "chicken badami korma daig",
  "chicken makhani qorma",
  "chicken nihari daig",
  "biryani daig Lahore",
  "kabuli pulao daig",
  "mutton palak",
  "Chinioti cuisine",
  "Chinioti food",
  "nisar daig Lahore",
];

export function getBaseUrl() {
  return SITE_URL;
}
