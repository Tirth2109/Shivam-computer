import { useState, useEffect } from "react";
import type { Product } from "../types";
import { categories } from "../data/categories";

const PURPOSE_OPTIONS: { value: Product["purpose"]; label: string }[] = [
  { value: "gaming", label: "Gaming" },
  { value: "office", label: "Office" },
  { value: "editing", label: "Editing" },
  { value: "student", label: "Student" },
  { value: "general", label: "General" },
];

const emptyProduct: Partial<Product> = {
  name: "",
  category: "",
  categorySlug: "",
  brand: "",
  price: 0,
  mrp: undefined,
  discountPercent: undefined,
  stock: 0,
  inStock: true,
  image: "",
  specs: [],
  rating: undefined,
  reviewCount: undefined,
  warranty: "",
  purpose: undefined,
  isCustomBuild: false,
  buildTimeDays: undefined,
};

type AdminProductFormProps = {
  product?: Product | null;
  onSave: (p: Product) => void;
  onCancel: () => void;
};

export default function AdminProductForm({
  product,
  onSave,
  onCancel,
}: AdminProductFormProps) {
  const [form, setForm] = useState<Partial<Product>>(product ?? emptyProduct);

  useEffect(() => {
    setForm(product ?? emptyProduct);
  }, [product]);

  const update = (key: keyof Product, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "categorySlug") {
      const cat = categories.find((c) => c.slug === value);
      if (cat) setForm((prev) => ({ ...prev, category: cat.name }));
    }
  };

  const handleSpecsChange = (text: string) => {
    const specs = text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    setForm((prev) => ({ ...prev, specs }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id =
      form.id ||
      form.name
        ?.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") ||
      "product-" + Date.now();
    const stock = Number(form.stock) || 0;
    const inStock = stock > 0;
    const numOpt = (v: unknown): number | undefined => {
      if (v === undefined || v === null || v === "") return undefined;
      const n = Number(v);
      return Number.isNaN(n) ? undefined : n;
    };
    const payload: Product = {
      id: (form.id as string) || id,
      name: (form.name as string) || "Unnamed",
      category: (form.category as string) || "Other",
      categorySlug: (form.categorySlug as string) || "other",
      brand: form.brand as string | undefined,
      price: Number(form.price) || 0,
      mrp: numOpt(form.mrp),
      discountPercent: numOpt(form.discountPercent),
      stock,
      inStock,
      image: (form.image as string) || "",
      specs: Array.isArray(form.specs) ? form.specs : [],
      rating: numOpt(form.rating),
      reviewCount: numOpt(form.reviewCount),
      warranty: form.warranty as string | undefined,
      purpose: form.purpose as Product["purpose"] | undefined,
      isCustomBuild: Boolean(form.isCustomBuild),
      buildTimeDays: numOpt(form.buildTimeDays),
    };
    onSave(payload);
  };

  const specsText = Array.isArray(form.specs) ? form.specs.join("\n") : "";

  return (
    <form className="admin-product-form" onSubmit={handleSubmit}>
      <div className="admin-form-grid">
        <div className="admin-form-group">
          <label>Product ID</label>
          <input
            type="text"
            value={form.id ?? ""}
            onChange={(e) => update("id", e.target.value)}
            placeholder="e.g. laptop-01"
            disabled={!!product}
          />
        </div>
        <div className="admin-form-group">
          <label>Name *</label>
          <input
            type="text"
            value={form.name ?? ""}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Product name"
            required
          />
        </div>
        <div className="admin-form-group">
          <label>Category</label>
          <select
            value={form.categorySlug ?? ""}
            onChange={(e) => update("categorySlug", e.target.value)}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-form-group">
          <label>Category (display name)</label>
          <input
            type="text"
            value={form.category ?? ""}
            onChange={(e) => update("category", e.target.value)}
            placeholder="e.g. Laptops"
          />
        </div>
        <div className="admin-form-group">
          <label>Brand</label>
          <input
            type="text"
            value={form.brand ?? ""}
            onChange={(e) => update("brand", e.target.value)}
            placeholder="e.g. Dell"
          />
        </div>
        <div className="admin-form-group">
          <label>Price (₹) *</label>
          <input
            type="number"
            min={0}
            value={form.price ?? ""}
            onChange={(e) => update("price", e.target.value)}
            required
          />
        </div>
        <div className="admin-form-group">
          <label>MRP (₹)</label>
          <input
            type="number"
            min={0}
            value={form.mrp ?? ""}
            onChange={(e) => update("mrp", e.target.value)}
            placeholder="Original price"
          />
        </div>
        <div className="admin-form-group">
          <label>Discount %</label>
          <input
            type="number"
            min={0}
            max={100}
            value={form.discountPercent ?? ""}
            onChange={(e) => update("discountPercent", e.target.value)}
            placeholder="e.g. 10"
          />
        </div>
        <div className="admin-form-group">
          <label>Stock *</label>
          <input
            type="number"
            min={0}
            value={form.stock ?? ""}
            onChange={(e) => update("stock", e.target.value)}
            required
          />
        </div>
        <div className="admin-form-group">
          <label>Image URL *</label>
          <input
            type="url"
            value={form.image ?? ""}
            onChange={(e) => update("image", e.target.value)}
            placeholder="https://..."
            required
          />
        </div>
        <div className="admin-form-group">
          <label>Rating (1–5)</label>
          <input
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={form.rating ?? ""}
            onChange={(e) => update("rating", e.target.value)}
          />
        </div>
        <div className="admin-form-group">
          <label>Review count</label>
          <input
            type="number"
            min={0}
            value={form.reviewCount ?? ""}
            onChange={(e) => update("reviewCount", e.target.value)}
          />
        </div>
        <div className="admin-form-group">
          <label>Warranty</label>
          <input
            type="text"
            value={form.warranty ?? ""}
            onChange={(e) => update("warranty", e.target.value)}
            placeholder="e.g. 1 Year"
          />
        </div>
        <div className="admin-form-group">
          <label>Purpose</label>
          <select
            value={form.purpose ?? ""}
            onChange={(e) =>
              update("purpose", e.target.value as Product["purpose"] || undefined)
            }
          >
            <option value="">—</option>
            {PURPOSE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-form-group admin-form-group--checkbox">
          <label>
            <input
              type="checkbox"
              checked={Boolean(form.isCustomBuild)}
              onChange={(e) => update("isCustomBuild", e.target.checked)}
            />
            Custom build
          </label>
        </div>
        <div className="admin-form-group">
          <label>Build time (days)</label>
          <input
            type="number"
            min={0}
            value={form.buildTimeDays ?? ""}
            onChange={(e) => update("buildTimeDays", e.target.value)}
            placeholder="For custom builds"
          />
        </div>
        <div className="admin-form-group admin-form-group--full">
          <label>Specs (one per line)</label>
          <textarea
            value={specsText}
            onChange={(e) => handleSpecsChange(e.target.value)}
            placeholder="e.g.&#10;Intel i5&#10;8GB RAM&#10;512GB SSD"
            rows={4}
          />
        </div>
      </div>
      <div className="admin-form-actions">
        <button type="button" className="btn outline" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn primary">
          {product ? "Update product" : "Add product"}
        </button>
      </div>
    </form>
  );
}
