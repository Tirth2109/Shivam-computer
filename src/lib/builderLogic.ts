import type { BuilderCompatibilityRules, BuilderConfig, BuilderProduct, BuilderSelections } from "../types/builder";

export function getSpecValue(product: BuilderProduct | undefined, key: string): string | undefined {
  const specs = Array.isArray(product?.specs) ? product!.specs : [];
  const found = specs.find((item) => item.key.toLowerCase() === key.toLowerCase());
  return found?.value;
}

function getNumber(product: BuilderProduct | undefined, key: string): number | null {
  const val = getSpecValue(product, key);
  if (val == null) return null;
  const num = parseFloat(val);
  return Number.isFinite(num) ? num : null;
}

function includesCsv(value: string | undefined, needle: string | undefined): boolean {
  if (!value || !needle) return false;
  return value
    .split(",")
    .map((v) => v.trim().toLowerCase())
    .includes(needle.trim().toLowerCase());
}

export function computeRecommendedPsuWatts(
  selections: BuilderSelections,
  products: BuilderProduct[],
  rules: BuilderCompatibilityRules
): number {
  const cpu = selectedProductByCategory("cpu", selections, products);
  const gpu = selectedProductByCategory("gpu", selections, products);
  const cpuTdp = cpu ? getNumber(cpu, "tdp") ?? 65 : 0;
  const gpuDraw = gpu ? getNumber(gpu, "power_draw_w") ?? 120 : 0;
  const base = cpuTdp + gpuDraw + 100; // allowance for fans, drives
  const headroomMultiplier = 1 + (rules.psuHeadroomPercent ?? 0) / 100;
  const recommended = Math.ceil(base * headroomMultiplier);
  return Math.max(recommended, rules.minimumPsuWattage ?? 500);
}

export function selectedProductByCategory(
  categoryId: string,
  selections: BuilderSelections,
  products: BuilderProduct[]
): BuilderProduct | undefined {
  const id = selections.parts[categoryId];
  if (!id) return undefined;
  return products.find((p) => p.id === id);
}

export function getCompatibleProducts(
  categoryId: string,
  config: BuilderConfig,
  selections: BuilderSelections
): BuilderProduct[] {
  const rules = config.compatibility;
  const allProducts = config.products.filter((p) => p.categoryId === categoryId && p.active);
  if (!rules) return allProducts.sort(sortProducts);

  const cpu = selectedProductByCategory("cpu", selections, config.products);
  const motherboard = selectedProductByCategory("motherboard", selections, config.products);
  const ram = selectedProductByCategory("ram", selections, config.products);
  const gpu = selectedProductByCategory("gpu", selections, config.products);
  const cabinet = selectedProductByCategory("cabinet", selections, config.products);
  const cooler = selectedProductByCategory("cooler", selections, config.products);

  const ramType = getSpecValue(motherboard, "ram_type");
  const socket = getSpecValue(cpu, "socket");
  const moboForm = getSpecValue(motherboard, "form_factor");
  const gpuLength = getNumber(gpu, "length_mm");
  const coolerHeight = getNumber(cooler, "height_mm");
  const radiatorSize = getNumber(cooler, "radiator_size_mm");
  const cpuTdp = getNumber(cpu, "tdp");

  const recommendedPsu = computeRecommendedPsuWatts(selections, config.products, rules);

  const filtered = allProducts.filter((product) => {
    switch (categoryId) {
      case "motherboard":
        if (rules.enforceCpuSocket && socket) {
          const boardSocket = getSpecValue(product, "socket");
          if (!boardSocket || boardSocket.toLowerCase() !== socket.toLowerCase()) return false;
        }
        return true;
      case "ram":
        if (rules.enforceRamType && ramType) {
          const ddr = getSpecValue(product, "ddr_type");
          if (!ddr || ddr.toLowerCase() !== ramType.toLowerCase()) return false;
        }
        return true;
      case "gpu":
        if (cabinet) {
          const clearance = getNumber(cabinet, "gpu_clearance_mm");
          const length = getNumber(product, "length_mm");
          if (clearance && length && length > clearance + (rules.gpuLengthToleranceMm ?? 0)) {
            return false;
          }
        }
        return true;
      case "psu": {
        const wattage = getNumber(product, "wattage") ?? 0;
        return wattage >= recommendedPsu;
      }
      case "cabinet": {
        if (rules.enforceFormFactor && moboForm) {
          const supported = getSpecValue(product, "supported_form_factors");
          if (supported && !includesCsv(supported, moboForm)) return false;
        }
        if (gpuLength) {
          const clearance = getNumber(product, "gpu_clearance_mm");
          if (clearance && gpuLength > clearance + (rules.gpuLengthToleranceMm ?? 0)) return false;
        }
        if (radiatorSize && radiatorSize > 0) {
          const radSupport = getSpecValue(product, "radiator_support");
          if (radSupport && !radSupport.match(new RegExp(`${radiatorSize}`))) return false;
        }
        return true;
      }
      case "cooler": {
        if (rules.enforceCoolerSocket && socket) {
          const support = getSpecValue(product, "socket_support");
          if (support && !includesCsv(support, socket)) return false;
        }
        if (cpuTdp) {
          const tdpSupport = getNumber(product, "tdp_support");
          if (tdpSupport && tdpSupport < cpuTdp) return false;
        }
        if (cabinet) {
          const maxHeight = getNumber(cabinet, "cooler_clearance_mm");
          if (maxHeight && coolerHeight && coolerHeight > maxHeight) return false;
          if (!coolerHeight && radiatorSize && radiatorSize > 0) {
            const radSupport = getSpecValue(cabinet, "radiator_support");
            if (radSupport && !radSupport.match(new RegExp(`${radiatorSize}`))) return false;
          }
        }
        return true;
      }
      default:
        return true;
    }
  });

  return filtered.sort(sortProducts);
}

export function calculateBuildTotal(
  selections: BuilderSelections,
  products: BuilderProduct[]
): { total: number; lines: { product: BuilderProduct; price: number }[] } {
  const lines: { product: BuilderProduct; price: number }[] = [];
  let total = 0;
  for (const productId of Object.values(selections.parts)) {
    const product = products.find((p) => p.id === productId);
    if (!product) continue;
    const price = product.salePrice ?? product.price;
    lines.push({ product, price });
    total += price;
  }
  return { total, lines };
}

function sortProducts(a: BuilderProduct, b: BuilderProduct) {
  if (a.recommended && !b.recommended) return -1;
  if (b.recommended && !a.recommended) return 1;
  if (a.featured && !b.featured) return -1;
  if (b.featured && !a.featured) return 1;
  if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
  return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
}
