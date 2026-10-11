export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://chiniotpakwan.com";

export const SITE_NAME = "Chiniot Pakwan";
export const SITE_TAGLINE = "Authentic Pakistani Catering & Daig Service";
export const SITE_DESCRIPTION =
  "Premium Pakistani catering and daig service in Lahore, Faisalabad, Karachi, and Islamabad. Order authentic mutton kunna, chicken korma, biryani, and wedding catering online.";

export const CONTACT = {
  phone: "03009219945",
  phoneDisplay: "0300 9219945",
  whatsapp: "923009219945",
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
  "daig service Lahore",
  "Pakistani catering Lahore",
  "mutton kunna Lahore",
  "wedding catering Lahore",
  "chicken white korma daig",
  "chicken nihari daig",
  "biryani daig Lahore",
  "kabuli pulao daig",
  "mutton palak",
  "Chinioti cuisine",
  "daig price Lahore",
  "nisar daig Lahore",
  "mehndi catering",
  "walima catering",
  "aqeeqah catering",
  "corporate catering Lahore",
  "family daig order",
  "Chiniot Pakwan menu",
  "Chiniot Pakwan price list",
];

export function getBaseUrl() {
  return SITE_URL.replace(/\/$/, "");
}