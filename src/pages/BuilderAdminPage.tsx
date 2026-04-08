import { useEffect, useMemo, useState, type ReactNode } from "react";
import HeaderWithDeals from "../components/HeaderWithDeals";
import Footer from "../components/Footer";
import { useBuilder } from "../context/BuilderContext";
import type {
  BuilderBrand,
  BuilderBudgetOption,
  BuilderCategory,
  BuilderCompatibilityRules,
  BuilderConfig,
  BuilderProduct,
  BuilderPurposeOption,
  BuilderSpecKV,
  BuilderStep,
  BuilderStockStatus,
} from "../types/builder";

export default function BuilderAdminPage() {
  const {
    config,
    loading,
    error,
    refresh,
    addStep,
    updateStep,
    deleteStep,
    reorderSteps,
    addCategory,
    updateCategory,
    deleteCategory,
    addBrand,
    updateBrand,
    deleteBrand,
    addProduct,
    updateProduct,
    deleteProduct,
    reorderProducts,
    updateSettings,
    updateCompatibility,
  } = useBuilder();

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "steps" | "categories" | "brands" | "products" | "compatibility" | "settings"
  >("dashboard");

  const [stepForm, setStepForm] = useState<Partial<BuilderStep>>({ kind: "category", active: true });
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState<Partial<BuilderCategory>>({ active: true });
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [brandForm, setBrandForm] = useState<Partial<BuilderBrand>>({ active: true });
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);

  const [productForm, setProductForm] = useState<Partial<BuilderProduct>>({
    active: true,
    stockStatus: "in_stock",
    specs: [],
  });
  const [specRows, setSpecRows] = useState<BuilderSpecKV[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState("");

  const [budgetsDraft, setBudgetsDraft] = useState<BuilderBudgetOption[]>(config.settings.budgets);
  const [purposesDraft, setPurposesDraft] = useState<BuilderPurposeOption[]>(config.settings.purposes);
  const [settingsDraft, setSettingsDraft] = useState(config.settings);
  const [compatibilityDraft, setCompatibilityDraft] = useState<BuilderCompatibilityRules>(
    config.compatibility
  );

  useEffect(() => {
    setBudgetsDraft(config.settings.budgets);
    setPurposesDraft(config.settings.purposes);
    setSettingsDraft(config.settings);
    setCompatibilityDraft(config.compatibility);
  }, [config]);

  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return config.products;
    return config.products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.brandId ?? "").toLowerCase().includes(q) ||
        p.categoryId.toLowerCase().includes(q)
    );
  }, [config.products, productSearch]);

  const panelClass =
    "rounded-2xl border border-[#2a3f5d] bg-[#111b2c] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]";

  const tabButton = (id: typeof activeTab, label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => setActiveTab(id)}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        activeTab === id
          ? "border border-[#5ec7ff] bg-[#5ec7ff] text-[#050812]"
          : "border border-transparent bg-[#0f1625] text-[#d5deec] hover:border-[#2a3f5d]"
      }`}
    >
      {label}
    </button>
  );

  const handleSaveStep = async () => {
    if (!stepForm.title || !stepForm.kind) return;
    if (editingStepId) {
      await updateStep(editingStepId, stepForm as BuilderStep);
    } else {
      await addStep(stepForm);
    }
    setStepForm({ kind: "category", active: true });
    setEditingStepId(null);
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name || !categoryForm.slug) return;
    if (editingCategoryId) {
      await updateCategory(editingCategoryId, categoryForm as BuilderCategory);
    } else {
      await addCategory(categoryForm);
    }
    setCategoryForm({ active: true });
    setEditingCategoryId(null);
  };

  const handleSaveBrand = async () => {
    if (!brandForm.name || !brandForm.slug) return;
    if (editingBrandId) {
      await updateBrand(editingBrandId, brandForm as BuilderBrand);
    } else {
      await addBrand(brandForm);
    }
    setBrandForm({ active: true });
    setEditingBrandId(null);
  };

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.categoryId || productForm.price == null) return;
    const payload: Partial<BuilderProduct> = {
      ...productForm,
      price: Number(productForm.price),
      salePrice: productForm.salePrice != null ? Number(productForm.salePrice) : undefined,
      sortOrder: productForm.sortOrder != null ? Number(productForm.sortOrder) : undefined,
      specs: specRows,
    };
    if (editingProductId) {
      await updateProduct(editingProductId, payload);
    } else {
      await addProduct(payload);
    }
    setProductForm({ active: true, stockStatus: "in_stock", specs: [] });
    setSpecRows([]);
    setEditingProductId(null);
  };

  if (loading) {
    return (
      <>
        <HeaderWithDeals />
        <main className="py-10">
          <div className="mx-auto w-full max-w-6xl px-5 text-sm text-[#a8b6ca]">Loading builder admin...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeaderWithDeals />
        <main className="py-10">
          <div className="mx-auto w-full max-w-6xl px-5 text-sm text-[#a8b6ca]">
            Error: {error}{" "}
            <button className="text-[#5ec7ff] underline" onClick={() => refresh()}>
              Retry
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <HeaderWithDeals />
      <main className="py-10">
        <div className="mx-auto w-full max-w-6xl px-5 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#5ec7ff]">Admin</p>
              <h1 className="text-2xl font-semibold text-[#ecf3ff]">Builder Control Panel</h1>
              <p className="text-sm text-[#a8b6ca]">Manage steps, parts, compatibility, and text without code.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {tabButton("dashboard", "Dashboard")}
              {tabButton("steps", "Steps")}
              {tabButton("categories", "Categories")}
              {tabButton("brands", "Brands")}
              {tabButton("products", "Products")}
              {tabButton("compatibility", "Compatibility")}
              {tabButton("settings", "Settings")}
            </div>
          </div>

          {activeTab === "dashboard" && <DashboardPanel config={config} panelClass={panelClass} />}
          {activeTab === "steps" && (
            <StepsPanel
              config={config}
              panelClass={panelClass}
              stepForm={stepForm}
              setStepForm={setStepForm}
              editingStepId={editingStepId}
              setEditingStepId={setEditingStepId}
              handleSaveStep={handleSaveStep}
              updateStep={updateStep}
              deleteStep={deleteStep}
              reorderSteps={reorderSteps}
            />
          )}
          {activeTab === "categories" && (
            <CategoriesPanel
              config={config}
              panelClass={panelClass}
              categoryForm={categoryForm}
              setCategoryForm={setCategoryForm}
              editingCategoryId={editingCategoryId}
              setEditingCategoryId={setEditingCategoryId}
              handleSaveCategory={handleSaveCategory}
              updateCategory={updateCategory}
              deleteCategory={deleteCategory}
            />
          )}
          {activeTab === "brands" && (
            <BrandsPanel
              config={config}
              panelClass={panelClass}
              brandForm={brandForm}
              setBrandForm={setBrandForm}
              editingBrandId={editingBrandId}
              setEditingBrandId={setEditingBrandId}
              handleSaveBrand={handleSaveBrand}
              updateBrand={updateBrand}
              deleteBrand={deleteBrand}
            />
          )}
          {activeTab === "products" && (
            <ProductsPanel
              config={config}
              panelClass={panelClass}
              products={filteredProducts}
              productForm={productForm}
              setProductForm={setProductForm}
              editingProductId={editingProductId}
              setEditingProductId={setEditingProductId}
              specRows={specRows}
              setSpecRows={setSpecRows}
              handleSaveProduct={handleSaveProduct}
              deleteProduct={deleteProduct}
              reorderProducts={reorderProducts}
              productSearch={productSearch}
              setProductSearch={setProductSearch}
            />
          )}
          {activeTab === "compatibility" && (
            <CompatibilityPanel
              panelClass={panelClass}
              draft={compatibilityDraft}
              setDraft={setCompatibilityDraft}
              save={updateCompatibility}
            />
          )}
          {activeTab === "settings" && (
            <SettingsPanel
              panelClass={panelClass}
              settingsDraft={settingsDraft}
              setSettingsDraft={setSettingsDraft}
              budgetsDraft={budgetsDraft}
              setBudgetsDraft={setBudgetsDraft}
              purposesDraft={purposesDraft}
              setPurposesDraft={setPurposesDraft}
              saveSettings={updateSettings}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function DashboardPanel({ config, panelClass }: { config: BuilderConfig; panelClass: string }) {
  return (
    <div className={panelClass}>
      <h3 className="text-lg font-semibold text-[#ecf3ff]">Builder Dashboard</h3>
      <p className="text-sm text-[#a8b6ca]">Snapshot of your dynamic builder content.</p>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Active steps" value={config.steps.filter((s) => s.active).length} />
        <StatCard label="Categories" value={config.categories.filter((c) => c.active).length} />
        <StatCard label="Brands" value={config.brands.filter((b) => b.active).length} />
        <StatCard label="Active parts" value={config.products.filter((p) => p.active).length} />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <InfoCard title="Summary text" body={config.settings.summarySubtext} />
        <InfoCard
          title="Compatibility rules"
          body={`CPU socket: ${config.compatibility.enforceCpuSocket ? "On" : "Off"}, RAM type: ${config.compatibility.enforceRamType ? "On" : "Off"}, PSU headroom: ${config.compatibility.psuHeadroomPercent}%`}
        />
      </div>
      <div className="mt-3 text-xs text-[#7d8dab]">
        Last updated: {config.updatedAt ? new Date(config.updatedAt).toLocaleString() : "N/A"}
      </div>
    </div>
  );
}

function ProductsPanel({
  config,
  panelClass,
  products,
  productForm,
  setProductForm,
  editingProductId,
  setEditingProductId,
  specRows,
  setSpecRows,
  handleSaveProduct,
  deleteProduct,
  reorderProducts,
  productSearch,
  setProductSearch,
}: {
  config: BuilderConfig;
  panelClass: string;
  products: BuilderProduct[];
  productForm: Partial<BuilderProduct>;
  setProductForm: (p: Partial<BuilderProduct>) => void;
  editingProductId: string | null;
  setEditingProductId: (id: string | null) => void;
  specRows: BuilderSpecKV[];
  setSpecRows: (rows: BuilderSpecKV[]) => void;
  handleSaveProduct: () => void;
  deleteProduct: (id: string) => Promise<void>;
  reorderProducts: (catId: string, ids: string[]) => Promise<void>;
  productSearch: string;
  setProductSearch: (v: string) => void;
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, BuilderProduct[]>();
    for (const product of products) {
      const list = map.get(product.categoryId) ?? [];
      list.push(product);
      map.set(product.categoryId, list);
    }
    for (const [key, list] of map.entries()) {
      list.sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return map;
  }, [products]);

  const startEdit = (p: BuilderProduct) => {
    setEditingProductId(p.id);
    setProductForm(p);
    setSpecRows(p.specs ?? []);
  };

  const resetForm = () => {
    setEditingProductId(null);
    setProductForm({ active: true, stockStatus: "in_stock", specs: [] });
    setSpecRows([]);
  };

  return (
    <div className={panelClass}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[#ecf3ff]">Products / Parts</h3>
          <p className="text-sm text-[#a8b6ca]">
            Add, edit, feature, disable, and reorder parts per category.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            placeholder="Search products"
            className="rounded-full border border-[#2a3f5d] bg-[#0f1625] px-3 py-1.5 text-xs text-[#ecf3ff] outline-none"
          />
          <button
            type="button"
            className="text-[11px] font-semibold text-[#5ec7ff] underline-offset-4 hover:underline"
            onClick={resetForm}
          >
            New product
          </button>
        </div>
      </div>

      {[...grouped.entries()].map(([catId, list]) => {
        const category = config.categories.find((c) => c.id === catId);
        return (
          <div key={catId} className="mt-4 rounded-xl border border-[#1f2c44] bg-[#0b1120] p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-semibold text-[#d5deec]">
                {category?.name ?? catId} ({list.length})
              </div>
              <button
                type="button"
                className="text-[11px] text-[#5ec7ff] underline-offset-4 hover:underline"
                onClick={() => reorderProducts(catId, list.map((p) => p.id))}
              >
                Save current order
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {list.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border border-[#1f2c44] bg-[#0f1625] px-3 py-2"
                >
                  <div>
                    <div className="text-sm font-semibold text-[#ecf3ff]">{p.name}</div>
                    <div className="text-[11px] text-[#a8b6ca]">
                      Rs {(p.salePrice ?? p.price).toLocaleString()} · Order {p.sortOrder}
                    </div>
                    <div className="text-[11px] text-[#7d8dab]">
                      Active: {p.active ? "Yes" : "No"} · Featured:{" "}
                      {p.featured ? "Yes" : "No"} · Recommended: {p.recommended ? "Yes" : "No"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded-full border border-[#5ec7ff] px-3 py-1 text-[11px] font-semibold text-[#5ec7ff]"
                      onClick={() => startEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-[#fb7185] px-3 py-1 text-[11px] font-semibold text-[#fb7185]"
                      onClick={() => deleteProduct(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="mt-6 rounded-xl border border-[#1f2c44] bg-[#0b1120] p-3">
        <h4 className="text-sm font-semibold text-[#d5deec]">
          {editingProductId ? "Edit Product" : "Add Product"}
        </h4>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Name">
            <input
              value={productForm.name ?? ""}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              className="w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
            />
          </Field>
          <Field label="Slug">
            <input
              value={productForm.slug ?? ""}
              onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
              className="w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
            />
          </Field>
          <Field label="Category">
            <select
              value={productForm.categoryId ?? ""}
              onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
              className="w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
            >
              <option value="">Select category</option>
              {config.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Brand">
            <select
              value={productForm.brandId ?? ""}
              onChange={(e) => setProductForm({ ...productForm, brandId: e.target.value })}
              className="w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
            >
              <option value="">Optional</option>
              {config.brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Price">
            <input
              type="number"
              value={productForm.price ?? 0}
              onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
              className="w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
            />
          </Field>
          <Field label="Sale Price">
            <input
              type="number"
              value={productForm.salePrice ?? ""}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  salePrice: e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
              className="w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
            />
          </Field>
          <Field label="SKU">
            <input
              value={productForm.sku ?? ""}
              onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
              className="w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
            />
          </Field>
          <Field label="Stock Status">
            <select
              value={productForm.stockStatus ?? "in_stock"}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  stockStatus: e.target.value as BuilderStockStatus,
                })
              }
              className="w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
            >
              <option value="in_stock">In stock</option>
              <option value="low_stock">Low stock</option>
              <option value="out_of_stock">Out of stock</option>
              <option value="preorder">Pre-order</option>
            </select>
          </Field>
          <Field label="Image URL">
            <input
              value={productForm.image ?? ""}
              onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
              className="w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
            />
          </Field>
          <Field label="Short Description">
            <input
              value={productForm.shortDescription ?? ""}
              onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
              className="w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
            />
          </Field>
          <Field label="Full Description">
            <textarea
              value={productForm.description ?? ""}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              className="min-h-[80px] w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
            />
          </Field>
          <Field label="Sort Order">
            <input
              type="number"
              value={productForm.sortOrder ?? products.length + 1}
              onChange={(e) => setProductForm({ ...productForm, sortOrder: Number(e.target.value) })}
              className="w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
            />
          </Field>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[#d5deec]">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={productForm.active ?? true}
              onChange={(e) => setProductForm({ ...productForm, active: e.target.checked })}
              className="accent-[#5ec7ff]"
            />
            Active
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={productForm.featured ?? false}
              onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
              className="accent-[#5ec7ff]"
            />
            Featured
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={productForm.recommended ?? false}
              onChange={(e) => setProductForm({ ...productForm, recommended: e.target.checked })}
              className="accent-[#5ec7ff]"
            />
            Recommended
          </label>
        </div>

        <SpecsEditor specs={specRows} setSpecs={setSpecRows} />

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={handleSaveProduct}
            className="rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-4 py-2 text-sm font-semibold text-[#050812]"
          >
            {editingProductId ? "Update Product" : "Add Product"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="rounded-full border border-[#2a3f5d] bg-[#0f1625] px-4 py-2 text-sm font-semibold text-[#d5deec]"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

function SpecsEditor({
  specs,
  setSpecs,
}: {
  specs: BuilderSpecKV[];
  setSpecs: (rows: BuilderSpecKV[]) => void;
}) {
  const updateRow = (idx: number, key: keyof BuilderSpecKV, value: string) => {
    const next = [...specs];
    next[idx] = { ...next[idx], [key]: value };
    setSpecs(next);
  };

  const addRow = () => setSpecs([...specs, { key: "", value: "" }]);
  const removeRow = (idx: number) => setSpecs(specs.filter((_, i) => i !== idx));

  return (
    <div className="mt-4 rounded-xl border border-[#1f2c44] bg-[#0b1120] p-3">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-semibold text-[#d5deec]">Specs / Compatibility Fields</h5>
        <button
          type="button"
          onClick={addRow}
          className="rounded-full border border-[#5ec7ff] px-3 py-1 text-[11px] font-semibold text-[#5ec7ff]"
        >
          Add row
        </button>
      </div>
      <p className="text-[11px] text-[#7d8dab]">
        Use keys like socket, ram_type, form_factor, tdp, power_draw_w, length_mm, etc.
      </p>
      <div className="mt-2 space-y-2">
        {specs.map((row, idx) => (
          <div key={`${row.key}-${idx}`} className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
            <input
              value={row.key}
              onChange={(e) => updateRow(idx, "key", e.target.value)}
              placeholder="key"
              className="rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-2 py-1 text-xs text-[#ecf3ff] outline-none"
            />
            <input
              value={row.value}
              onChange={(e) => updateRow(idx, "value", e.target.value)}
              placeholder="value"
              className="rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-2 py-1 text-xs text-[#ecf3ff] outline-none"
            />
            <button
              type="button"
              onClick={() => removeRow(idx)}
              className="rounded-full border border-[#fb7185] px-2 py-1 text-[11px] font-semibold text-[#fb7185]"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-[#a8b6ca]">
      <span>{label}</span>
      {children}
    </label>
  );
}

function CompatibilityPanel({
  panelClass,
  draft,
  setDraft,
  save,
}: {
  panelClass: string;
  draft: BuilderCompatibilityRules;
  setDraft: (d: BuilderCompatibilityRules) => void;
  save: (updates: Partial<BuilderCompatibilityRules>) => Promise<void>;
}) {
  const handleNumber = (key: keyof BuilderCompatibilityRules, value: string) => {
    setDraft({ ...draft, [key]: Number(value) });
  };

  return (
    <div className={panelClass}>
      <h3 className="text-lg font-semibold text-[#ecf3ff]">Compatibility / Rules</h3>
      <p className="text-sm text-[#a8b6ca]">
        Control how sockets, RAM type, form factor, and PSU headroom are enforced on the frontend.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <ToggleRow
          label="Enforce CPU socket on motherboard"
          checked={draft.enforceCpuSocket}
          onChange={(v) => setDraft({ ...draft, enforceCpuSocket: v })}
        />
        <ToggleRow
          label="Enforce RAM type"
          checked={draft.enforceRamType}
          onChange={(v) => setDraft({ ...draft, enforceRamType: v })}
        />
        <ToggleRow
          label="Enforce form factor for cabinets"
          checked={draft.enforceFormFactor}
          onChange={(v) => setDraft({ ...draft, enforceFormFactor: v })}
        />
        <ToggleRow
          label="Enforce cooler socket"
          checked={draft.enforceCoolerSocket}
          onChange={(v) => setDraft({ ...draft, enforceCoolerSocket: v })}
        />
        <NumberRow
          label="PSU headroom %"
          value={draft.psuHeadroomPercent}
          onChange={(v) => handleNumber("psuHeadroomPercent", v)}
        />
        <NumberRow
          label="Minimum PSU wattage"
          value={draft.minimumPsuWattage}
          onChange={(v) => handleNumber("minimumPsuWattage", v)}
        />
        <NumberRow
          label="GPU length tolerance (mm)"
          value={draft.gpuLengthToleranceMm}
          onChange={(v) => handleNumber("gpuLengthToleranceMm", v)}
        />
      </div>
      <button
        type="button"
        onClick={() => save(draft)}
        className="mt-4 rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-4 py-2 text-sm font-semibold text-[#050812]"
      >
        Save Compatibility Rules
      </button>
    </div>
  );
}

function SettingsPanel({
  panelClass,
  settingsDraft,
  setSettingsDraft,
  budgetsDraft,
  setBudgetsDraft,
  purposesDraft,
  setPurposesDraft,
  saveSettings,
}: {
  panelClass: string;
  settingsDraft: BuilderConfig["settings"];
  setSettingsDraft: (s: BuilderConfig["settings"]) => void;
  budgetsDraft: BuilderBudgetOption[];
  setBudgetsDraft: (b: BuilderBudgetOption[]) => void;
  purposesDraft: BuilderPurposeOption[];
  setPurposesDraft: (p: BuilderPurposeOption[]) => void;
  saveSettings: (updates: Partial<BuilderConfig["settings"]>) => Promise<void>;
}) {
  const updateBudget = (
    idx: number,
    key: keyof BuilderBudgetOption,
    value: string | number | boolean
  ) => {
    const next = [...budgetsDraft];
    next[idx] = { ...next[idx], [key]: value } as BuilderBudgetOption;
    setBudgetsDraft(next);
  };
  const updatePurpose = (
    idx: number,
    key: keyof BuilderPurposeOption,
    value: string | number | boolean
  ) => {
    const next = [...purposesDraft];
    next[idx] = { ...next[idx], [key]: value } as BuilderPurposeOption;
    setPurposesDraft(next);
  };

  const saveAll = async () => {
    await saveSettings({
      ...settingsDraft,
      budgets: budgetsDraft,
      purposes: purposesDraft,
    });
  };

  return (
    <div className={panelClass}>
      <h3 className="text-lg font-semibold text-[#ecf3ff]">Builder Settings</h3>
      <p className="text-sm text-[#a8b6ca]">Control headings, CTAs, and summary text.</p>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {[
          ["heroHeading", "Hero Heading"],
          ["heroSubheading", "Hero Subheading"],
          ["subheadingMuted", "Muted Subheading"],
          ["ctaLabel", "CTA Label"],
          ["summaryHeadline", "Summary Headline"],
          ["summarySubtext", "Summary Subtext"],
          ["buildTimeText", "Build Time Text"],
          ["deliveryText", "Delivery Text"],
          ["supportText", "Support Text"],
          ["buttonText", "Default Button Text"],
          ["budgetLabel", "Budget Label"],
          ["purposeLabel", "Purpose Label"],
        ].map(([key, label]) => (
          <Field key={key} label={label}>
            <input
              value={(settingsDraft as any)[key] ?? ""}
              onChange={(e) => setSettingsDraft({ ...settingsDraft, [key]: e.target.value } as any)}
              className="w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
            />
          </Field>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-[#1f2c44] bg-[#0b1120] p-3">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[#d5deec]">Budget Options</h4>
            <button
              type="button"
              className="text-[11px] text-[#5ec7ff] underline-offset-4 hover:underline"
              onClick={() =>
                setBudgetsDraft([
                  ...budgetsDraft,
                  { id: `budget-${Date.now()}`, label: "New Budget", active: true },
                ])
              }
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {budgetsDraft.map((b, idx) => (
              <div
                key={b.id}
                className="rounded-lg border border-[#1f2c44] bg-[#0f1625] p-2 text-xs text-[#d5deec]"
              >
                <input
                  value={b.label}
                  onChange={(e) => updateBudget(idx, "label", e.target.value)}
                  className="mb-1 w-full rounded border border-[#2a3f5d] bg-[#0b1120] px-2 py-1 text-xs text-[#ecf3ff] outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={b.min ?? ""}
                    onChange={(e) => updateBudget(idx, "min", Number(e.target.value))}
                    placeholder="Min"
                    className="rounded border border-[#2a3f5d] bg-[#0b1120] px-2 py-1 text-xs text-[#ecf3ff] outline-none"
                  />
                  <input
                    type="number"
                    value={b.max ?? ""}
                    onChange={(e) => updateBudget(idx, "max", Number(e.target.value))}
                    placeholder="Max"
                    className="rounded border border-[#2a3f5d] bg-[#0b1120] px-2 py-1 text-xs text-[#ecf3ff] outline-none"
                  />
                </div>
                <label className="mt-1 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={b.active}
                    onChange={(e) => updateBudget(idx, "active", e.target.checked)}
                    className="accent-[#5ec7ff]"
                  />
                  Active
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[#1f2c44] bg-[#0b1120] p-3">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[#d5deec]">Purpose Options</h4>
            <button
              type="button"
              className="text-[11px] text-[#5ec7ff] underline-offset-4 hover:underline"
              onClick={() =>
                setPurposesDraft([
                  ...purposesDraft,
                  { id: `purpose-${Date.now()}`, label: "New Purpose", active: true },
                ])
              }
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {purposesDraft.map((p, idx) => (
              <div
                key={p.id}
                className="rounded-lg border border-[#1f2c44] bg-[#0f1625] p-2 text-xs text-[#d5deec]"
              >
                <input
                  value={p.label}
                  onChange={(e) => updatePurpose(idx, "label", e.target.value)}
                  className="mb-1 w-full rounded border border-[#2a3f5d] bg-[#0b1120] px-2 py-1 text-xs text-[#ecf3ff] outline-none"
                />
                <textarea
                  value={p.description ?? ""}
                  onChange={(e) => updatePurpose(idx, "description", e.target.value)}
                  className="w-full rounded border border-[#2a3f5d] bg-[#0b1120] px-2 py-1 text-xs text-[#ecf3ff] outline-none"
                  placeholder="Description"
                />
                <label className="mt-1 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={p.active}
                    onChange={(e) => updatePurpose(idx, "active", e.target.checked)}
                    className="accent-[#5ec7ff]"
                  />
                  Active
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={saveAll}
        className="mt-4 rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-4 py-2 text-sm font-semibold text-[#050812]"
      >
        Save Settings
      </button>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-2 rounded-xl border border-[#1f2c44] bg-[#0b1120] px-3 py-2 text-sm text-[#d5deec]">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-[#5ec7ff]"
      />
    </label>
  );
}

function NumberRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 rounded-xl border border-[#1f2c44] bg-[#0b1120] px-3 py-2 text-xs text-[#d5deec]">
      <span>{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
      />
    </label>
  );
}

function BrandsPanel({
  config,
  panelClass,
  brandForm,
  setBrandForm,
  editingBrandId,
  setEditingBrandId,
  handleSaveBrand,
  updateBrand,
  deleteBrand,
}: {
  config: BuilderConfig;
  panelClass: string;
  brandForm: Partial<BuilderBrand>;
  setBrandForm: (b: Partial<BuilderBrand>) => void;
  editingBrandId: string | null;
  setEditingBrandId: (id: string | null) => void;
  handleSaveBrand: () => void;
  updateBrand: (id: string, updates: Partial<BuilderBrand>) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
}) {
  const brands = [...config.brands].sort((a, b) => a.order - b.order);
  return (
    <div className={panelClass}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[#ecf3ff]">Brands</h3>
          <p className="text-sm text-[#a8b6ca]">Manage brand labels and optional logos.</p>
        </div>
        <button
          type="button"
          className="text-[11px] font-semibold text-[#5ec7ff] underline-offset-4 hover:underline"
          onClick={() => {
            setEditingBrandId(null);
            setBrandForm({ active: true });
          }}
        >
          New brand
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="flex items-center justify-between rounded-xl border border-[#1f2c44] bg-[#0b1120] px-3 py-2"
          >
            <div>
              <div className="text-sm font-semibold text-[#ecf3ff]">
                {brand.name} <span className="text-[11px] text-[#7d8dab]">({brand.slug})</span>
              </div>
              <div className="text-[11px] text-[#a8b6ca]">Order: {brand.order}</div>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-[11px] text-[#d5deec]">
                <input
                  type="checkbox"
                  checked={brand.active}
                  onChange={(e) => updateBrand(brand.id, { active: e.target.checked })}
                  className="accent-[#5ec7ff]"
                />
                Active
              </label>
              <button
                type="button"
                className="rounded-full border border-[#5ec7ff] px-3 py-1 text-[11px] font-semibold text-[#5ec7ff]"
                onClick={() => {
                  setEditingBrandId(brand.id);
                  setBrandForm(brand);
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="rounded-full border border-[#fb7185] px-3 py-1 text-[11px] font-semibold text-[#fb7185]"
                onClick={() => deleteBrand(brand.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-[#1f2c44] bg-[#0b1120] p-3">
          <h4 className="text-sm font-semibold text-[#d5deec]">
            {editingBrandId ? "Edit Brand" : "Add Brand"}
          </h4>
          <div className="mt-3 space-y-2 text-sm text-[#d5deec]">
            <label className="block text-xs text-[#a8b6ca]">Name</label>
            <input
              value={brandForm.name ?? ""}
              onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
              className="w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
            />
            <label className="block text-xs text-[#a8b6ca]">Slug</label>
            <input
              value={brandForm.slug ?? ""}
              onChange={(e) => setBrandForm({ ...brandForm, slug: e.target.value })}
              className="w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
            />
            <label className="block text-xs text-[#a8b6ca]">Logo URL (optional)</label>
            <input
              value={brandForm.logo ?? ""}
              onChange={(e) => setBrandForm({ ...brandForm, logo: e.target.value })}
              className="w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
            />
            <label className="block text-xs text-[#a8b6ca]">Order</label>
            <input
              type="number"
              value={brandForm.order ?? config.brands.length + 1}
              onChange={(e) => setBrandForm({ ...brandForm, order: Number(e.target.value) })}
              className="w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
            />
            <label className="mt-2 flex items-center gap-2 text-xs text-[#d5deec]">
              <input
                type="checkbox"
                checked={brandForm.active ?? true}
                onChange={(e) => setBrandForm({ ...brandForm, active: e.target.checked })}
                className="accent-[#5ec7ff]"
              />
              Active
            </label>
            <button
              type="button"
              onClick={handleSaveBrand}
              className="mt-3 w-full rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-4 py-2 text-sm font-semibold text-[#050812]"
            >
              {editingBrandId ? "Update Brand" : "Add Brand"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoriesPanel({
  config,
  panelClass,
  categoryForm,
  setCategoryForm,
  editingCategoryId,
  setEditingCategoryId,
  handleSaveCategory,
  updateCategory,
  deleteCategory,
}: {
  config: BuilderConfig;
  panelClass: string;
  categoryForm: Partial<BuilderCategory>;
  setCategoryForm: (c: Partial<BuilderCategory>) => void;
  editingCategoryId: string | null;
  setEditingCategoryId: (id: string | null) => void;
  handleSaveCategory: () => void;
  updateCategory: (id: string, updates: Partial<BuilderCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}) {
  const categories = [...config.categories].sort((a, b) => a.order - b.order);
  return (
    <div className={panelClass}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[#ecf3ff]">Categories</h3>
          <p className="text-sm text-[#a8b6ca]">Add/edit part categories and their order.</p>
        </div>
        <button
          type="button"
          className="text-[11px] font-semibold text-[#5ec7ff] underline-offset-4 hover:underline"
          onClick={() => {
            setEditingCategoryId(null);
            setCategoryForm({ active: true });
          }}
        >
          New category
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between rounded-xl border border-[#1f2c44] bg-[#0b1120] px-3 py-2"
          >
            <div>
              <div className="text-sm font-semibold text-[#ecf3ff]">
                {cat.name} <span className="text-[11px] text-[#7d8dab]">({cat.slug})</span>
              </div>
              <div className="text-[11px] text-[#a8b6ca]">Order: {cat.order}</div>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-[11px] text-[#d5deec]">
                <input
                  type="checkbox"
                  checked={cat.active}
                  onChange={(e) => updateCategory(cat.id, { active: e.target.checked })}
                  className="accent-[#5ec7ff]"
                />
                Active
              </label>
              <button
                type="button"
                className="rounded-full border border-[#5ec7ff] px-3 py-1 text-[11px] font-semibold text-[#5ec7ff]"
                onClick={() => {
                  setEditingCategoryId(cat.id);
                  setCategoryForm(cat);
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="rounded-full border border-[#fb7185] px-3 py-1 text-[11px] font-semibold text-[#fb7185]"
                onClick={() => deleteCategory(cat.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-[#1f2c44] bg-[#0b1120] p-3">
          <h4 className="text-sm font-semibold text-[#d5deec]">
            {editingCategoryId ? "Edit Category" : "Add Category"}
          </h4>
          <div className="mt-3 space-y-2 text-sm text-[#d5deec]">
            <label className="block text-xs text-[#a8b6ca]">Name</label>
            <input
              value={categoryForm.name ?? ""}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              className="w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
            />
            <label className="block text-xs text-[#a8b6ca]">Slug</label>
            <input
              value={categoryForm.slug ?? ""}
              onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
              className="w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
            />
            <label className="block text-xs text-[#a8b6ca]">Description</label>
            <textarea
              value={categoryForm.description ?? ""}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              className="w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
            />
            <label className="block text-xs text-[#a8b6ca]">Order</label>
            <input
              type="number"
              value={categoryForm.order ?? config.categories.length + 1}
              onChange={(e) => setCategoryForm({ ...categoryForm, order: Number(e.target.value) })}
              className="w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
            />
            <label className="mt-2 flex items-center gap-2 text-xs text-[#d5deec]">
              <input
                type="checkbox"
                checked={categoryForm.active ?? true}
                onChange={(e) => setCategoryForm({ ...categoryForm, active: e.target.checked })}
                className="accent-[#5ec7ff]"
              />
              Active
            </label>
            <button
              type="button"
              onClick={handleSaveCategory}
              className="mt-3 w-full rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-4 py-2 text-sm font-semibold text-[#050812]"
            >
              {editingCategoryId ? "Update Category" : "Add Category"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-[#1f2c44] bg-[#0b1120] p-3">
      <div className="text-[11px] uppercase tracking-wide text-[#7d8dab]">{label}</div>
      <div className="text-xl font-semibold text-[#ecf3ff]">{value}</div>
    </div>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-[#1f2c44] bg-[#0b1120] p-3">
      <div className="text-sm font-semibold text-[#d5deec]">{title}</div>
      <p className="text-xs text-[#a8b6ca]">{body}</p>
    </div>
  );
}

function StepsPanel({
  config,
  panelClass,
  stepForm,
  setStepForm,
  editingStepId,
  setEditingStepId,
  handleSaveStep,
  updateStep,
  deleteStep,
  reorderSteps,
}: {
  config: BuilderConfig;
  panelClass: string;
  stepForm: Partial<BuilderStep>;
  setStepForm: (s: Partial<BuilderStep>) => void;
  editingStepId: string | null;
  setEditingStepId: (id: string | null) => void;
  handleSaveStep: () => void;
  updateStep: (id: string, updates: Partial<BuilderStep>) => Promise<void>;
  deleteStep: (id: string) => Promise<void>;
  reorderSteps: (ids: string[]) => Promise<void>;
}) {
  const steps = [...config.steps].sort((a, b) => a.order - b.order);

  const move = async (id: string, dir: -1 | 1) => {
    const idx = steps.findIndex((s) => s.id === id);
    const swapWith = idx + dir;
    if (swapWith < 0 || swapWith >= steps.length) return;
    const newOrder = [...steps];
    const [removed] = newOrder.splice(idx, 1);
    newOrder.splice(swapWith, 0, removed);
    await reorderSteps(newOrder.map((s) => s.id));
  };

  return (
    <div className={panelClass}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[#ecf3ff]">Steps Management</h3>
          <p className="text-sm text-[#a8b6ca]">Enable/disable, reorder, and edit builder steps.</p>
        </div>
        <button
          type="button"
          className="text-[11px] font-semibold text-[#5ec7ff] underline-offset-4 hover:underline"
          onClick={() => {
            setEditingStepId(null);
            setStepForm({ kind: "category", active: true });
          }}
        >
          New step
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#1f2c44] bg-[#0b1120] px-3 py-2"
          >
            <div>
              <div className="text-sm font-semibold text-[#ecf3ff]">
                {step.order}. {step.title}{" "}
                <span className="text-[11px] text-[#7d8dab]">({step.kind})</span>
              </div>
              <div className="text-[11px] text-[#a8b6ca]">
                Categories: {(step.categoryIds ?? []).join(", ") || "N/A"}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-[11px] text-[#d5deec]">
                <input
                  type="checkbox"
                  checked={step.active}
                  onChange={(e) => updateStep(step.id, { active: e.target.checked })}
                  className="accent-[#5ec7ff]"
                />
                Active
              </label>
              <button
                type="button"
                onClick={() => move(step.id, -1)}
                disabled={idx === 0}
                className="rounded-full border border-[#2a3f5d] px-2 py-1 text-[11px] text-[#a8b6ca] disabled:opacity-40"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(step.id, 1)}
                disabled={idx === steps.length - 1}
                className="rounded-full border border-[#2a3f5d] px-2 py-1 text-[11px] text-[#a8b6ca] disabled:opacity-40"
              >
                ↓
              </button>
              <button
                type="button"
                className="rounded-full border border-[#5ec7ff] px-3 py-1 text-[11px] font-semibold text-[#5ec7ff]"
                onClick={() => {
                  setEditingStepId(step.id);
                  setStepForm(step);
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="rounded-full border border-[#fb7185] px-3 py-1 text-[11px] font-semibold text-[#fb7185]"
                onClick={() => deleteStep(step.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-[#1f2c44] bg-[#0b1120] p-3">
          <h4 className="text-sm font-semibold text-[#d5deec]">
            {editingStepId ? "Edit Step" : "Add Step"}
          </h4>
          <div className="mt-3 space-y-2 text-sm text-[#d5deec]">
            <label className="block text-xs text-[#a8b6ca]">Title</label>
            <input
              value={stepForm.title ?? ""}
              onChange={(e) => setStepForm({ ...stepForm, title: e.target.value })}
              className="w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
            />
            <label className="block text-xs text-[#a8b6ca]">Description</label>
            <textarea
              value={stepForm.description ?? ""}
              onChange={(e) => setStepForm({ ...stepForm, description: e.target.value })}
              className="w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
            />
            <label className="block text-xs text-[#a8b6ca]">Kind</label>
            <select
              value={stepForm.kind ?? "category"}
              onChange={(e) =>
                setStepForm({ ...stepForm, kind: e.target.value as BuilderStep["kind"] })
              }
              className="w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
            >
              <option value="budget">Budget</option>
              <option value="purpose">Purpose</option>
              <option value="category">Category</option>
              <option value="summary">Summary</option>
              <option value="info">Info</option>
            </select>
            <label className="block text-xs text-[#a8b6ca]">Categories (comma separated IDs)</label>
            <input
              value={(stepForm.categoryIds ?? []).join(",")}
              onChange={(e) =>
                setStepForm({
                  ...stepForm,
                  categoryIds: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              className="w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
            />
            <label className="block text-xs text-[#a8b6ca]">CTA Label</label>
            <input
              value={stepForm.ctaLabel ?? ""}
              onChange={(e) => setStepForm({ ...stepForm, ctaLabel: e.target.value })}
              className="w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
            />
            <label className="block text-xs text-[#a8b6ca]">Order</label>
            <input
              type="number"
              value={stepForm.order ?? steps.length + 1}
              onChange={(e) => setStepForm({ ...stepForm, order: Number(e.target.value) })}
              className="w-full rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none"
            />
            <label className="mt-2 flex items-center gap-2 text-xs text-[#d5deec]">
              <input
                type="checkbox"
                checked={stepForm.active ?? true}
                onChange={(e) => setStepForm({ ...stepForm, active: e.target.checked })}
                className="accent-[#5ec7ff]"
              />
              Active
            </label>
            <button
              type="button"
              onClick={handleSaveStep}
              className="mt-3 w-full rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-4 py-2 text-sm font-semibold text-[#050812]"
            >
              {editingStepId ? "Update Step" : "Add Step"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
