/**
 * Brands we sell – shown in Popular Brands section.
 * ViewSonic, Samsung, BenQ, Lenovo, MSI, HP, LG, ASUS, Dell.
 * Add logo files in public/brands/ (e.g. viewsonic.svg, samsung.mp4).
 */
export const brandsWithLogos = [
  { name: "ViewSonic", slug: "viewsonic", domain: "viewsonic.com" },
  { name: "Samsung", slug: "samsung", domain: "samsung.com" },
  { name: "BenQ", slug: "benq", domain: "benq.com" },
  { name: "Lenovo", slug: "lenovo", domain: "lenovo.com" },
  { name: "MSI", slug: "msi", domain: "msi.com", logoSize: "small" },
  { name: "HP", slug: "hp", domain: "hp.com", lottie: true },
  { name: "LG", slug: "lg", domain: "lg.com" },
  { name: "ASUS", slug: "asus", domain: "asus.com", logoFile: "Asus Brand Logo.mp4" },
  { name: "Dell", slug: "dell", domain: "dell.com" },
] as const;

export function getBrandLogoUrl(domain: string): string {
  return `https://logo.clearbit.com/${domain}`;
}

/** Path for local logo in public/brands/ (e.g. /brands/dell.webp) */
export function getLocalBrandLogoPath(slug: string, ext: "webp" | "png" | "svg" | "mp4" = "webp"): string {
  return `/brands/${slug}.${ext}`;
}
