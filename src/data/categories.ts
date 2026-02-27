import type { Category } from "../types";

export const categories: Category[] = [
  { id: "new-desktop", name: "Brand New Desktop PCs", slug: "new-desktop-pcs" },
  { id: "custom-gaming", name: "Custom Built Gaming PCs", slug: "custom-gaming-pcs" },
  { id: "office-student", name: "Office & Student PCs", slug: "office-student-pcs" },
  { id: "laptops", name: "Laptops", slug: "laptops" },
  { id: "monitors", name: "Monitors", slug: "monitors" },
  { id: "processors", name: "Processors (Intel/AMD)", slug: "processors" },
  { id: "gpu", name: "Graphics Cards (GPU)", slug: "graphics-cards" },
  { id: "motherboards", name: "Motherboards", slug: "motherboards" },
  { id: "ram", name: "RAM", slug: "ram" },
  { id: "ssd-hdd", name: "SSD / HDD", slug: "ssd-hdd" },
  { id: "psu", name: "Power Supply (PSU)", slug: "power-supply" },
  { id: "cabinets", name: "Cabinets", slug: "cabinets" },
  { id: "cooling", name: "Cooling (Air/AIO)", slug: "cooling" },
  { id: "keyboard-mouse", name: "Keyboards & Mouse", slug: "keyboards-mouse" },
  { id: "printers-networking", name: "Printers & Networking", slug: "printers-networking" },
  { id: "headphones", name: "Headphones", slug: "headphones" },
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
