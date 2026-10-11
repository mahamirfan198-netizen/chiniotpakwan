export type MenuItem = {
  id: string;
  name: string;
  category: "Chicken" | "Beef" | "Rice" | "Mutton" | "Desserts" | "Wedding";
  priceFrom: number;
  priceTo: number;
  description: string;
  variantNote: string;
  image: string;
  originalUrl: string;
  popular?: boolean;
};

export const MENU_ITEMS: MenuItem[] = [
  // ============ CHICKEN ============
  {
    id: "chicken-white-korma",
    name: "Chicken White Korma Daig",
    category: "Chicken",
    priceFrom: 7000,
    priceTo: 21000,
    description:
      "Creamy white korma prepared with tender chicken and traditional Chinioti spices. Perfect for weddings, mehndi, and family gatherings.",
    variantNote: "Available in 4kg – 12kg daig sizes (6–50 people)",
    image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&q=80",
    originalUrl: "https://chiniotpakwan.com/product/chicken-white-korma-daig/",
    popular: true,
  },
  {
    id: "chicken-badami-korma",
    name: "Chicken Badami Korma Daig",
    category: "Chicken",
    priceFrom: 6800,
    priceTo: 19200,
    description:
      "Rich almond-based chicken korma with creamy texture and traditional spices.",
    variantNote: "Available in multiple daig sizes",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80",
    originalUrl: "https://chiniotpakwan.com/product/chicken-badami-korma-daig/",
  },
  {
    id: "chicken-makhani-qorma",
    name: "Chicken Makhani Qorma",
    category: "Chicken",
    priceFrom: 6000,
    priceTo: 18000,
    description:
      "Rich, creamy orange-golden chicken curry with butter and traditional Chinioti spices.",
    variantNote: "Available in multiple daig sizes",
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80",
    originalUrl: "https://chiniotpakwan.com/product/chicken-makhani-qorma/",
  },
  {
    id: "chicken-kofta",
    name: "Chicken Kofta",
    category: "Chicken",
    priceFrom: 7400,
    priceTo: 22200,
    description:
      "Tender chicken meatballs slow-cooked in a rich traditional curry.",
    variantNote: "Available in multiple daig sizes",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80",
    originalUrl: "https://chiniotpakwan.com/product/chicken-kofta/",
  },
  {
    id: "chicken-shashlik",
    name: "Chicken Shashlik",
    category: "Chicken",
    priceFrom: 7600,
    priceTo: 22800,
    description:
      "Marinated chicken pieces cooked with bell peppers, onions, and rich tomato-based sauce.",
    variantNote: "Available in multiple daig sizes",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80",
    originalUrl: "https://chiniotpakwan.com/",
  },
  {
    id: "chicken-nihari",
    name: "Chicken Nihari",
    category: "Chicken",
    priceFrom: 7800,
    priceTo: 23400,
    description:
      "Slow-cooked aromatic chicken nihari with traditional spices and bone marrow flavour.",
    variantNote: "Available in multiple daig sizes",
    image: "https://images.unsplash.com/photo-1633945274309-2c16c9682a8c?w=800&q=80",
    originalUrl: "https://chiniotpakwan.com/",
    popular: true,
  },
  {
    id: "chicken-palak",
    name: "Chicken Palak",
    category: "Chicken",
    priceFrom: 11250,
    priceTo: 27000,
    description:
      "Tender chicken cooked in a rich spinach gravy with ginger and green chillies.",
    variantNote: "Available in multiple daig sizes",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80",
    originalUrl: "https://chiniotpakwan.com/",
  },
  {
    id: "chicken-karahi",
    name: "Chicken Karahi Daig",
    category: "Chicken",
    priceFrom: 7000,
    priceTo: 19800,
    description:
      "Signature karahi prepared with fresh tomatoes, ginger, and traditional spices.",
    variantNote: "Available in 4kg – 12kg daig sizes",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80",
    originalUrl: "https://chiniotpakwan.com/",
  },
  {
    id: "chicken-korma",
    name: "Chicken Korma/Qorma Daig",
    category: "Chicken",
    priceFrom: 6500,
    priceTo: 16800,
    description:
      "Rich and aromatic chicken qorma with tender meat and flavourful gravy.",
    variantNote: "Available in 4kg – 12kg daig sizes (6–50 people)",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80",
    originalUrl: "https://chiniotpakwan.com/",
  },

  // ============ BEEF ============
  {
    id: "beef-korma",
    name: "Beef Korma Daig",
    category: "Beef",
    priceFrom: 12000,
    priceTo: 34200,
    description:
      "Slow-cooked beef korma with traditional Chinioti spices and rich gravy.",
    variantNote: "Available in 4kg – 12kg daig sizes (6–50 people)",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
    originalUrl: "https://chiniotpakwan.com/product/beef-korma-daig/",
    popular: true,
  },
  {
    id: "katta-korma",
    name: "Katta Korma Daig",
    category: "Beef",
    priceFrom: 12000,
    priceTo: 34200,
    description:
      "Traditional katta korma with beef chunks in a thick, aromatic curry.",
    variantNote: "Available in 4kg – 12kg daig sizes",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
    originalUrl: "https://chiniotpakwan.com/",
  },

  // ============ RICE ============
  {
    id: "chicken-lahori-biryani",
    name: "Chicken Lahori Biryani Daig",
    category: "Rice",
    priceFrom: 9250,
    priceTo: 19800,
    description:
      "Aromatic Lahori-style biryani with tender chicken and long-grain basmati rice.",
    variantNote: "5kg+5kg – 12kg+12kg (20–75 people)",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80",
    originalUrl: "https://chiniotpakwan.com/product/chicken-lahori-biryani-daig/",
    popular: true,
  },
  {
    id: "chicken-kabuli-pulao",
    name: "Chicken Kabuli Pulao Daig",
    category: "Rice",
    priceFrom: 10500,
    priceTo: 23760,
    description:
      "Traditional Kabuli pulao with tender chicken, caramelized carrots, and raisins.",
    variantNote: "5kg+5kg – 12kg+12kg (20–50 people)",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&q=80",
    originalUrl: "https://chiniotpakwan.com/product/chicken-kabuli-pulao-daig/",
  },
  {
    id: "peas-pulao",
    name: "Peas Pulao",
    category: "Rice",
    priceFrom: 5500,
    priceTo: 13200,
    description:
      "Fluffy basmati rice cooked with green peas and aromatic spices.",
    variantNote: "Available in multiple daig sizes",
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80",
    originalUrl: "https://chiniotpakwan.com/product/peas-pulao/",
  },

  // ============ MUTTON ============
  {
    id: "mutton-palak",
    name: "Mutton Palak",
    category: "Mutton",
    priceFrom: 19750,
    priceTo: 47400,
    description:
      "Tender mutton cooked in a rich spinach gravy with traditional spices.",
    variantNote: "Available in daig sizes by request",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
    originalUrl: "https://chiniotpakwan.com/",
    popular: true,
  },
  {
    id: "mutton-chinioti-kunna",
    name: "Mutton Chinioti Kunna",
    category: "Mutton",
    priceFrom: 24000,
    priceTo: 60000,
    description:
      "Signature slow-cooked mutton kunna in traditional clay-pot style. The pride of Chiniot cuisine.",
    variantNote: "Available in multiple daig sizes",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
    originalUrl: "https://chiniotpakwan.com/",
    popular: true,
  },

  // ============ DESSERTS ============
  {
    id: "matanjan-vip-zarda",
    name: "Matanjan VIP Zarda",
    category: "Desserts",
    priceFrom: 9000,
    priceTo: 21600,
    description:
      "Premium sweet rice with dry fruits, khoya, and traditional zarda flavours.",
    variantNote: "Available in daig sizes by request",
    image: "https://images.unsplash.com/photo-1631206753348-db44968fd440?w=800&q=80",
    originalUrl: "https://chiniotpakwan.com/",
  },
  {
    id: "dodh-dulari",
    name: "Dodh Dulari",
    category: "Desserts",
    priceFrom: 13500,
    priceTo: 54000,
    description:
      "Traditional milk-based dessert with dry fruits, vermicelli, jelly, and delicate flavours.",
    variantNote: "Available from 10kg – 40kg (daig sizes)",
    image: "https://images.unsplash.com/photo-1606471191009-63994c53433b?w=800&q=80",
    originalUrl: "https://chiniotpakwan.com/",
  },

  // ============ WEDDING ============
  {
    id: "chicken-wedding-menu",
    name: "Chicken One Dish Wedding Menu",
    category: "Wedding",
    priceFrom: 1230,
    priceTo: 1230,
    description:
      "Complete one-dish wedding catering package with premium service and presentation.",
    variantNote: "Rs. 1,230 per person • Minimum 150 people (Rs. 184,500 – 708,000 total)",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
    originalUrl: "https://chiniotpakwan.com/product/chicken-one-dish-menu/",
  },
];

export const CATEGORIES = [
  { id: "all", name: "All Items", icon: "🍽️" },
  { id: "Chicken", name: "Chicken", icon: "🐔" },
  { id: "Beef", name: "Beef", icon: "🐄" },
  { id: "Rice", name: "Rice & Biryani", icon: "🍚" },
  { id: "Mutton", name: "Mutton", icon: "🐑" },
  { id: "Desserts", name: "Desserts", icon: "🍮" },
  { id: "Wedding", name: "Wedding", icon: "💍" },
];

export const WHATSAPP_NUMBER = "923009219945";
export const PHONE_NUMBER = "03009219945";
export const EMAIL = "support@chiniotpakwan.pk";

export function formatPrice(amount: number): string {
  return "Rs. " + amount.toLocaleString();
}

export function getWhatsAppLink(item: MenuItem): string {
  const message = encodeURIComponent(
    `Assalam-o-Alaikum! I would like to order:\n\n🍛 ${item.name}\n💰 Price: ${formatPrice(
      item.priceFrom
    )} - ${formatPrice(item.priceTo)}\n\nPlease share more details.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}