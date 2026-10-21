// Canonical site URL.
const DEFAULT_SITE_URL = "https://chiniotpakwan.pk";
const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/["']/g, "").trim();

export const SITE_URL = (envUrl && !envUrl.includes("vercel.app") ? envUrl : DEFAULT_SITE_URL).replace(/\/+$/, "");

export const SITE_NAME = "Chiniot Pakwan";
export const SITE_TAGLINE = "Authentic Pakistani Catering & Daig Service";
export const SITE_DESCRIPTION =
  "Explore Chiniot Pakwan for traditional Chinioti food, mutton kunna, biryani, pulao and catering services. View our menu, prices and ordering information.";
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

// Weaving in your new keyword list here
export const KEYWORDS = [
  // Brand
  "Chiniot Pakwan", "Chiniot World Pakwan", "Chiniot Pakwan official website", "Chiniot Pakwan menu", 
  "Chiniot Pakwan prices", "Chiniot Pakwan contact number", "Chiniot Pakwan location", "Chiniot Pakwan online order", 
  "Chiniot Pakwan delivery", "Chiniot Pakwan reviews",
  // Food
  "Chinioti food", "Chinioti cuisine", "traditional Chinioti food", "Chinioti mutton kunna", "Chiniot kunna", 
  "best Chinioti kunna", "Chiniot traditional food", "famous food of Chiniot", "Chinioti mutton dishes", "Chiniot food specialties",
  // Catering
  "daig service", "daig service in Lahore", "Pakistani catering services", "event catering in Lahore", "wedding catering", 
  "family daig booking", "daig prices in Lahore", "food catering for events", "bulk food orders", "mutton kunna daig", 
  "biryani daig", "chicken qorma daig", "corporate catering", "wedding food arrangements", "Pakwan center",
  // Menu
  "chicken biryani daig", "beef biryani daig", "Sindhi biryani", "chana pulao", "yakhni pulao", "Kabuli pulao", 
  "chicken white korma", "chicken korma daig", "mutton kunna", "palak gosht", "mutton karahi", "chicken handi", 
  "mutanjan", "traditional Pakistani desserts", "Pakistani food menu and prices",
  // Locations
  "daig service Johar Town", "catering Johar Town", "daig delivery Raiwind Road", "catering Raiwind Road", 
  "wedding catering DHA Lahore", "daig service DHA", "Chinioti food catering Faisalabad", "Chinioti cuisine Pakistan"
];

export const citySlug = (city: string) => city.toLowerCase().replace(/[^a-z0-9]+/g, "-");
export function getBaseUrl() { return SITE_URL; }