export type BuilderStepKind = "budget" | "purpose" | "category" | "summary" | "info";

export interface BuilderStep {
  id: string;
  title: string;
  description?: string;
  helperText?: string;
  ctaLabel?: string;
  kind: BuilderStepKind;
  categoryIds?: string[];
  order: number;
  active: boolean;
}

export interface BuilderCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
  active: boolean;
}

export interface BuilderBrand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  order: number;
  active: boolean;
}

export type BuilderStockStatus = "in_stock" | "low_stock" | "out_of_stock" | "preorder";

export interface BuilderSpecKV {
  key: string;
  value: string;
}

export interface BuilderProduct {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  brandId?: string;
  price: number;
  salePrice?: number;
  sku?: string;
  stockStatus: BuilderStockStatus;
  image: string;
  shortDescription?: string;
  description?: string;
  active: boolean;
  featured?: boolean;
  recommended?: boolean;
  sortOrder: number;
  specs: BuilderSpecKV[];
}

export interface BuilderBudgetOption {
  id: string;
  label: string;
  min?: number;
  max?: number;
  description?: string;
  active: boolean;
}

export interface BuilderPurposeOption {
  id: string;
  label: string;
  description?: string;
  active: boolean;
}

export interface BuilderCompatibilityRules {
  enforceCpuSocket: boolean;
  enforceRamType: boolean;
  enforceFormFactor: boolean;
  enforceCoolerSocket: boolean;
  psuHeadroomPercent: number;
  minimumPsuWattage: number;
  gpuLengthToleranceMm: number;
}

export interface BuilderSettings {
  heroHeading: string;
  heroSubheading: string;
  subheadingMuted?: string;
  ctaLabel: string;
  summaryHeadline: string;
  summarySubtext: string;
  buildTimeText: string;
  deliveryText: string;
  supportText: string;
  buttonText: string;
  budgetLabel: string;
  purposeLabel: string;
  budgets: BuilderBudgetOption[];
  purposes: BuilderPurposeOption[];
}

export interface BuilderConfig {
  steps: BuilderStep[];
  categories: BuilderCategory[];
  brands: BuilderBrand[];
  products: BuilderProduct[];
  settings: BuilderSettings;
  compatibility: BuilderCompatibilityRules;
  updatedAt?: string;
}

export interface BuilderSelections {
  budgetId?: string;
  purposeId?: string;
  parts: Record<string, string>; // categoryId -> productId
}
