import { useEffect, useMemo, useState } from "react";
import HeaderWithDeals from "../components/HeaderWithDeals";
import Footer from "../components/Footer";
import WhatsAppFloat from "../components/WhatsAppFloat";
import BuilderOptionCard from "../components/builder/BuilderOptionCard";
import BuilderProductCard from "../components/builder/BuilderProductCard";
import BuilderStepPills from "../components/builder/BuilderStepPills";
import BuilderSummaryPanel from "../components/builder/BuilderSummaryPanel";
import { useBuilder } from "../context/BuilderContext";
import {
  computeRecommendedPsuWatts,
  getCompatibleProducts,
  getSpecValue,
  selectedProductByCategory,
} from "../lib/builderLogic";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import type { BuilderConfig, BuilderProduct, BuilderSelections, BuilderStep } from "../types/builder";
import type { Product } from "../types";

const panelClass =
  "rounded-2xl border border-[#2a3f5d] bg-[#111b2c] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]";

export default function CustomPCBuilderPage() {
  const { config, activeSteps, loading, error } = useBuilder();
  const { addToCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [selections, setSelections] = useState<BuilderSelections>({ parts: {} });
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});

  useEffect(() => {
    if (activeSteps.length > 0 && !currentStepId) {
      setCurrentStepId(activeSteps[0].id);
    }
  }, [activeSteps, currentStepId]);

  const currentStep = useMemo(
    () => activeSteps.find((s) => s.id === currentStepId) ?? activeSteps[0],
    [activeSteps, currentStepId]
  );

  const selectedCpu = selectedProductByCategory("cpu", selections, config.products);
  const selectedMotherboard = selectedProductByCategory("motherboard", selections, config.products);
  const selectedGpu = selectedProductByCategory("gpu", selections, config.products);
  const selectedCabinet = selectedProductByCategory("cabinet", selections, config.products);
  const selectedCooler = selectedProductByCategory("cooler", selections, config.products);

  const recommendedPsu = useMemo(
    () => computeRecommendedPsuWatts(selections, config.products, config.compatibility),
    [config.compatibility, config.products, selections]
  );

  if (loading) {
    return (
      <>
        <HeaderWithDeals />
        <main className="py-10">
          <div className="mx-auto w-full max-w-6xl px-5">
            <div className="animate-pulse space-y-4">
              <div className="h-6 w-1/3 rounded bg-[#1b2639]" />
              <div className="h-4 w-1/2 rounded bg-[#1b2639]" />
              <div className="h-64 rounded-2xl bg-[#0f1625]" />
            </div>
          </div>
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
          <div className="mx-auto w-full max-w-6xl px-5">
            <div className="rounded-2xl border border-[#fb7185] bg-[#2a0c18] p-5 text-[#ffdfe7]">
              <h2 className="text-lg font-semibold">Could not load builder data</h2>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!currentStep) {
    return (
      <>
        <HeaderWithDeals />
        <main className="py-10">
          <div className="mx-auto w-full max-w-6xl px-5">
            <p className="rounded-2xl border border-[#2a3f5d] bg-[#111b2c] p-5 text-sm text-[#a8b6ca]">
              No active steps found. Please configure the builder in admin.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const stepIndex = activeSteps.findIndex((s) => s.id === currentStep.id);
  const canGoBack = stepIndex > 0;
  const canGoNext = stepIndex < activeSteps.length - 1;
  const isComplete = isStepComplete(currentStep, selections);

  const goNext = () => {
    if (!isComplete) return;
    if (stepIndex < activeSteps.length - 1) {
      setCurrentStepId(activeSteps[stepIndex + 1].id);
    }
  };

  const goPrev = () => {
    if (stepIndex > 0) {
      setCurrentStepId(activeSteps[stepIndex - 1].id);
    }
  };

  const resetBuild = () => {
    setSelections({ parts: {} });
    setCurrentStepId(activeSteps[0]?.id ?? null);
  };

  const handleCheckout = () => {
    // Clear existing cart and add selected builder parts as cart items.
    clearCart();
    const productsToAdd = Object.entries(selections.parts)
      .map(([categoryId, productId]) => {
        const bp = config.products.find((p) => p.id === productId);
        const cat = config.categories.find((c) => c.id === categoryId);
        return bp && cat ? builderProductToStoreProduct(bp, cat.name, cat.slug) : null;
      })
      .filter(Boolean) as Product[];

    productsToAdd.forEach((p) => addToCart(p, 1));
    navigate("/checkout");
  };

  return (
    <>
      <HeaderWithDeals />
      <main className="py-10">
        <div className="mx-auto w-full max-w-6xl px-5">
          <section className="rounded-2xl border border-[#2a3f5d] bg-[#111b2c] p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#5ec7ff]">
                  Fully admin managed
                </p>
                <h1 className="text-2xl font-semibold text-[#ecf3ff]">
                  {config.settings.heroHeading}
                </h1>
                <p className="text-sm text-[#a8b6ca]">{config.settings.heroSubheading}</p>
                {config.settings.subheadingMuted ? (
                  <p className="text-xs text-[#7d8dab]">{config.settings.subheadingMuted}</p>
                ) : null}
              </div>
              <div className="rounded-xl border border-[#2a3f5d] bg-[#0f1625] px-4 py-3 text-xs text-[#d5deec]">
                Active data only · Steps, text, options come from the admin database.
              </div>
            </div>

            <BuilderStepPills
              steps={activeSteps}
              currentStepId={currentStep.id}
              onSelect={setCurrentStepId}
            />

            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <div className="space-y-4">
                {renderStep({
                  step: currentStep,
                  selections,
                  setSelections,
                  config,
                  searchTerms,
                  setSearchTerms,
                  recommendedPsu,
                  selectedCpu,
                  selectedMotherboard,
                  selectedGpu,
                  selectedCabinet,
                  selectedCooler,
                })}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={!canGoBack}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                      canGoBack
                        ? "border border-[#354a69] bg-[#0f1625]/70 text-[#d5deec] hover:border-[#5ec7ff] hover:text-[#5ec7ff]"
                        : "cursor-not-allowed border border-[#1f2c44] bg-[#0b1120] text-[#5a6987]"
                    }`}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!isComplete}
                    className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
                      isComplete
                        ? "border border-[#5ec7ff] bg-[#5ec7ff] text-[#050812] hover:bg-[#81d7ff]"
                        : "cursor-not-allowed border border-[#1f2c44] bg-[#0b1120] text-[#5a6987]"
                    }`}
                  >
                    {currentStep.ctaLabel ?? "Next"}
                  </button>
                </div>
              </div>

              <div className="lg:sticky lg:top-24">
                <BuilderSummaryPanel
                  config={config}
                  selections={selections}
                  onReset={resetBuild}
                  onCheckout={handleCheckout}
                />
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

function builderProductToStoreProduct(
  product: BuilderProduct,
  categoryName: string,
  categorySlug: string
): Product {
  const specs = (product.specs ?? []).map((s) => `${s.key}: ${s.value}`);
  return {
    id: product.id,
    name: product.name,
    category: categoryName,
    categorySlug,
    brand: product.brandId,
    price: product.salePrice ?? product.price,
    mrp: product.salePrice ? product.price : undefined,
    discountPercent:
      product.salePrice && product.price
        ? Math.round(((product.price - product.salePrice) / product.price) * 100)
        : undefined,
    stock: 1,
    inStock: true,
    image: product.image,
    specs,
    rating: 5,
    reviewCount: 1,
    warranty: "Assembly warranty",
    purpose: undefined,
    isCustomBuild: true,
    buildTimeDays: 5,
  };
}

function renderStep({
  step,
  selections,
  setSelections,
  config,
  searchTerms,
  setSearchTerms,
  recommendedPsu,
  selectedCpu,
  selectedMotherboard,
  selectedGpu,
  selectedCabinet,
  selectedCooler,
}: {
  step: BuilderStep;
  selections: BuilderSelections;
  setSelections: (next: BuilderSelections) => void;
  config: BuilderConfig;
  searchTerms: Record<string, string>;
  setSearchTerms: (next: Record<string, string>) => void;
  recommendedPsu: number;
  selectedCpu?: BuilderProduct;
  selectedMotherboard?: BuilderProduct;
  selectedGpu?: BuilderProduct;
  selectedCabinet?: BuilderProduct;
  selectedCooler?: BuilderProduct;
}) {
  const updateSelection = (data: Partial<BuilderSelections>) => {
    setSelections({ ...selections, ...data, parts: { ...selections.parts, ...(data.parts ?? {}) } });
  };

  if (step.kind === "budget") {
    const options = config.settings.budgets.filter((b) => b.active);
    return (
      <div className={panelClass}>
        <h3 className="text-lg font-semibold text-[#ecf3ff]">{step.title}</h3>
        <p className="text-sm text-[#a8b6ca]">{step.description}</p>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {options.map((opt) => (
            <BuilderOptionCard
              key={opt.id}
              title={opt.label}
              description={opt.description}
              badge={opt.min && opt.max ? `${opt.min.toLocaleString()} - ${opt.max.toLocaleString()}` : undefined}
              selected={selections.budgetId === opt.id}
              onSelect={() => updateSelection({ budgetId: opt.id })}
            />
          ))}
        </div>
      </div>
    );
  }

  if (step.kind === "purpose") {
    const options = config.settings.purposes.filter((p) => p.active);
    return (
      <div className={panelClass}>
        <h3 className="text-lg font-semibold text-[#ecf3ff]">{step.title}</h3>
        <p className="text-sm text-[#a8b6ca]">{step.description}</p>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {options.map((opt) => (
            <BuilderOptionCard
              key={opt.id}
              title={opt.label}
              description={opt.description}
              selected={selections.purposeId === opt.id}
              onSelect={() => updateSelection({ purposeId: opt.id })}
            />
          ))}
        </div>
      </div>
    );
  }

  if (step.kind === "summary") {
    return (
      <div className={panelClass}>
        <h3 className="text-lg font-semibold text-[#ecf3ff]">{step.title}</h3>
        <p className="text-sm text-[#a8b6ca]">{step.description}</p>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <InfoTile
            label="Build time"
            value={config.settings.buildTimeText}
            icon="⏱"
          />
          <InfoTile
            label="Delivery"
            value={config.settings.deliveryText}
            icon="🚚"
          />
          <InfoTile
            label="Support"
            value={config.settings.supportText}
            icon="💬"
          />
          <InfoTile
            label="Admin managed"
            value="Steps, text, and products update automatically."
            icon="✅"
          />
        </div>
      </div>
    );
  }

  const categories = step.categoryIds ?? [];

  return (
    <div className={panelClass}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#ecf3ff]">{step.title}</h3>
          <p className="text-sm text-[#a8b6ca]">{step.description}</p>
        </div>
        <div className="rounded-full border border-[#2a3f5d] bg-[#0f1625] px-3 py-1 text-[11px] text-[#a8b6ca]">
          Compatibility powered by your selections
        </div>
      </div>

      <div className="mt-4 space-y-5">
        {categories.map((categoryId) => {
          const options = getCompatibleProducts(categoryId, config, selections);
          const search = searchTerms[categoryId] ?? "";
          const filtered = options.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
          );
          const note = compatibilityNote({
            categoryId,
            selectedCpu,
            selectedMotherboard,
            selectedGpu,
            selectedCabinet,
            selectedCooler,
            recommendedPsu,
          });
          return (
            <div key={categoryId} className="rounded-xl border border-[#1f2c44] bg-[#0b1120] p-3">
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-[#d5deec]">
                    {categoryHeading(categoryId, config)}
                  </h4>
                  {note ? <p className="text-xs text-[#7d8dab]">{note}</p> : null}
                </div>
                <input
                  value={search}
                  onChange={(e) =>
                    setSearchTerms({ ...searchTerms, [categoryId]: e.target.value })
                  }
                  placeholder="Search in this category"
                  className="w-full max-w-xs rounded-full border border-[#2a3f5d] bg-[#0f1625] px-3 py-1.5 text-xs text-[#ecf3ff] outline-none transition focus:border-[#5ec7ff]"
                />
              </div>

              {filtered.length === 0 ? (
                <p className="text-xs text-[#a8b6ca]">
                  No active items match the compatibility filters. Adjust selection or ask support.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {filtered.map((product) => (
                    <BuilderProductCard
                      key={product.id}
                      product={product}
                      selected={selections.parts[categoryId] === product.id}
                      onSelect={() =>
                        updateSelection({ parts: { ...selections.parts, [categoryId]: product.id } })
                      }
                      compatibilityNote={note ?? undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function isStepComplete(step: BuilderStep, selections: BuilderSelections) {
  if (step.kind === "budget") return !!selections.budgetId;
  if (step.kind === "purpose") return !!selections.purposeId;
  if (step.kind === "category") {
    const requiredCategories = step.categoryIds ?? [];
    return requiredCategories.every((cat) => !!selections.parts[cat]);
  }
  return true;
}

function categoryHeading(categoryId: string, config: BuilderConfig) {
  const category = config.categories.find((c) => c.id === categoryId);
  return category?.name ?? categoryId;
}

function compatibilityNote({
  categoryId,
  selectedCpu,
  selectedMotherboard,
  selectedGpu,
  selectedCabinet,
  selectedCooler,
  recommendedPsu,
}: {
  categoryId: string;
  selectedCpu?: BuilderProduct;
  selectedMotherboard?: BuilderProduct;
  selectedGpu?: BuilderProduct;
  selectedCabinet?: BuilderProduct;
  selectedCooler?: BuilderProduct;
  recommendedPsu: number;
}) {
  switch (categoryId) {
    case "motherboard":
      return selectedCpu
        ? `Filtered by CPU socket ${getSpecValue(selectedCpu, "socket") ?? ""}`
        : "Select a CPU to filter motherboards by socket.";
    case "ram":
      return selectedMotherboard
        ? `Matching RAM type ${getSpecValue(selectedMotherboard, "ram_type")}`
        : "Select a motherboard to filter RAM type.";
    case "psu":
      return `Recommended wattage: ${recommendedPsu}W based on CPU/GPU draw.`;
    case "cabinet":
      return selectedMotherboard
        ? `Form factor ${getSpecValue(selectedMotherboard, "form_factor")}, GPU length and radiator fit checked.`
        : "Select motherboard to lock form factor compatibility.";
    case "cooler":
      return selectedCpu
        ? `Socket ${getSpecValue(selectedCpu, "socket")} and TDP compatibility ensured.`
        : "Select CPU to filter compatible coolers.";
    case "gpu":
      return selectedCabinet
        ? `GPU length checks against cabinet clearance.`
        : "Select a cabinet later; GPUs remain filtered by power needs.";
    default:
      return null;
  }
}

function InfoTile({ label, value, icon }: { label: string; value: string; icon?: string }) {
  return (
    <div className="rounded-xl border border-[#2a3f5d] bg-[#0f1625] px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-[#7d8dab]">{label}</div>
      <div className="flex items-center gap-2 text-sm font-semibold text-[#ecf3ff]">
        {icon ? <span aria-hidden>{icon}</span> : null}
        <span>{value}</span>
      </div>
    </div>
  );
}
