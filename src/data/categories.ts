import type { Category } from "../types";

export const categories: Category[] = [
  { id: "new-desktop", name: "Brand New Desktop PCs", slug: "new-desktop-pcs", icon: "🖥️" },
  { id: "custom-gaming", name: "Custom Built Gaming PCs", slug: "custom-gaming-pcs", icon: "🎮" },
  { id: "office-student", name: "Office & Student PCs", slug: "office-student-pcs", icon: "💼" },
  { id: "laptops", name: "Laptops", slug: "laptops", icon: "💻" },
  { id: "monitors", name: "Monitors", slug: "monitors", icon: "🖲️" },
  { id: "processors", name: "Processors (Intel/AMD)", slug: "processors", icon: "🧠" },
  { id: "gpu", name: "Graphics Cards (GPU)", slug: "graphics-cards", icon: "🎞️" },
  { id: "motherboards", name: "Motherboards", slug: "motherboards", icon: "🔌" },
  { id: "ram", name: "RAM", slug: "ram", icon: "📗" },
  { id: "ssd-hdd", name: "SSD / HDD", slug: "ssd-hdd", icon: "💾" },
  { id: "psu", name: "Power Supply (PSU)", slug: "power-supply", icon: "⚡" },
  { id: "cabinets", name: "Cabinets", slug: "cabinets", icon: "📦" },
  { id: "cooling", name: "Cooling (Air/AIO)", slug: "cooling", icon: "❄️" },
  { id: "keyboard-mouse", name: "Keyboards & Mouse", slug: "keyboards-mouse", icon: "⌨️" },
  { id: "printers-networking", name: "Printers & Networking", slug: "printers-networking", icon: "🖨️" },
  { id: "headphones", name: "Headphones", slug: "headphones", icon: "🎧" },
];

export const navCategories = [
  { label: "New Computers", path: "/category/new-desktop-pcs" },
  { label: "Custom Build PC", path: "/custom-build" },
  { label: "Computer Components", path: "/category/components" },
  { label: "Laptops", path: "/category/laptops" },
  { label: "Monitors", path: "/category/monitors" },
  { label: "Accessories", path: "/category/keyboards-mouse" },
  { label: "Deals", path: "/deals" },
  { label: "Support", path: "/support" },
];
