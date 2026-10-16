export function optimizeImage(url: string | null | undefined, width = 800): string {
  if (!url) return "";
  try {
    if (url.includes("res.cloudinary.com") && url.includes("/upload/") && !url.includes("f_auto")) {
      return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
    }
    if (url.includes("images.unsplash.com")) {
      const u = new URL(url);
      u.searchParams.set("w", String(width));
      u.searchParams.set("q", "75");
      u.searchParams.set("auto", "format");
      u.searchParams.set("fit", "crop");
      return u.toString();
    }
  } catch {}
  return url;
}
