const DEFAULT_SITE_URL = "https://chiniotpakwan.pk";
const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/["']/g, "").trim();

export const SITE_URL = (envUrl && !envUrl.includes("vercel.app") ? envUrl : DEFAULT_SITE_URL).replace(/\/+$/, "");

export const SITE_NAME = "Chiniot Pakwan";
export const SITE_TAGLINE = "Authentic Pakistani Catering & Daig Service";
export const SITE_DESCRIPTION =
  "Authentic Chiniot Pakwan daig & catering in Lahore, Faisalabad, Karachi and Islamabad. Order mutton kunna, korma, biryani and wedding catering online.";
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

const BASE_KEYWORDS = [
  "Chiniot Pakwan","Chiniot Pakwan menu","Chiniot Pakwan price list","Chinioti cuisine","Chinioti daig",
  "Chinioti mutton kunna","chicken white korma daig","chicken nihari daig","kabuli pulao daig","mutton palak",
  "nisar daig","family daig order","daig price list","daig order online","mehndi catering","walima catering",
  "barat catering","aqeeqah catering","event catering Pakistan","corporate catering","shadi catering","daig order karen",
];

const CITY_SERVICES = ["daig service","daig price","Pakistani catering","wedding catering","mutton kunna","biryani daig","corporate catering","online daig order"];

export const KEYWORDS: string[] = Array.from(
  new Set([
    ...BASE_KEYWORDS,
    ...LOCATIONS.flatMap((l) => CITY_SERVICES.map((svc) => svc + " " + l.city)),
  ])
);

export const citySlug = (city: string) => city.toLowerCase().replace(/[^a-z0-9]+/g, "-");
export function getBaseUrl() { return SITE_URL; }
