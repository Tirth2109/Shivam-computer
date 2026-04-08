import type { BuilderProduct } from "../../types/builder";
import { getSpecValue } from "../../lib/builderLogic";

interface BuilderProductCardProps {
  product: BuilderProduct;
  selected: boolean;
  onSelect: () => void;
  compatibilityNote?: string;
}

export default function BuilderProductCard({
  product,
  selected,
  onSelect,
  compatibilityNote,
}: BuilderProductCardProps) {
  const price = product.salePrice ?? product.price;
  const mrp = product.salePrice ? product.price : null;
  const stockBadge =
    product.stockStatus === "in_stock"
      ? "In stock"
      : product.stockStatus === "low_stock"
        ? "Low stock"
        : product.stockStatus === "preorder"
          ? "Pre-order"
          : "Out of stock";

  const highlights = [
    getSpecValue(product, "socket"),
    getSpecValue(product, "form_factor"),
    getSpecValue(product, "ddr_type"),
    getSpecValue(product, "vram_gb") ? `${getSpecValue(product, "vram_gb")}GB` : null,
    getSpecValue(product, "wattage") ? `${getSpecValue(product, "wattage")}W` : null,
    getSpecValue(product, "radiator_size_mm")
      ? `${getSpecValue(product, "radiator_size_mm")}mm`
      : null,
  ].filter(Boolean) as string[];

  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl border p-4 transition ${
        selected
          ? "border-[#5ec7ff] bg-[#0f1625] shadow-[0_12px_34px_rgba(94,199,255,0.25)]"
          : "border-[#2a3f5d] bg-[#111b2c] hover:-translate-y-0.5 hover:border-[#5ec7ff66]"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {product.recommended ? (
            <span className="rounded-full bg-[#162339] px-2 py-0.5 text-[11px] font-semibold text-[#5ec7ff]">
              Recommended
            </span>
          ) : null}
          {product.featured && !product.recommended ? (
            <span className="rounded-full bg-[#162339] px-2 py-0.5 text-[11px] font-semibold text-[#a8b6ca]">
              Featured
            </span>
          ) : null}
        </div>
        <span className="rounded-full border border-[#2a3f5d] px-2 py-0.5 text-[11px] text-[#a8b6ca]">
          {stockBadge}
        </span>
      </div>

      <div className="mt-3 text-sm font-semibold text-[#ecf3ff]">{product.name}</div>
      {product.shortDescription ? (
        <p className="mt-1 text-xs text-[#a8b6ca]">{product.shortDescription}</p>
      ) : null}

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-lg font-semibold text-[#5ec7ff]">Rs {price.toLocaleString()}</span>
        {mrp ? (
          <span className="text-xs text-[#a8b6ca] line-through">Rs {mrp.toLocaleString()}</span>
        ) : null}
      </div>

      {highlights.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {highlights.slice(0, 4).map((item) => (
            <span
              key={`${product.id}-${item}`}
              className="rounded-full border border-[#2a3f5d] bg-[#0f1625] px-2 py-1 text-[11px] text-[#d5deec]"
            >
              {item}
            </span>
          ))}
        </div>
      ) : null}

      {compatibilityNote ? (
        <div className="mt-3 rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-[11px] text-[#a8b6ca]">
          {compatibilityNote}
        </div>
      ) : null}

      <div className="mt-auto pt-4">
        <button
          type="button"
          onClick={onSelect}
          className={`w-full rounded-full px-4 py-2 text-sm font-semibold transition ${
            selected
              ? "border border-[#5ec7ff] bg-[#5ec7ff] text-[#050812] hover:bg-[#81d7ff]"
              : "border border-[#354a69] bg-[#0f1625]/70 text-[#d5deec] hover:border-[#5ec7ff] hover:text-[#5ec7ff]"
          }`}
        >
          {selected ? "Selected" : "Select"}
        </button>
      </div>
    </div>
  );
}
