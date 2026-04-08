import { fetchSiteSetting, upsertSiteSetting } from "./productsApi";
import type { BuilderConfig } from "../types/builder";

export const BUILDER_SETTING_KEY = "builder_config";

export function normalizeBuilderConfig(raw: unknown): BuilderConfig | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  if (
    !Array.isArray(obj.steps) ||
    !Array.isArray(obj.categories) ||
    !Array.isArray(obj.products) ||
    typeof obj.settings !== "object" ||
    obj.settings === null ||
    typeof obj.compatibility !== "object" ||
    obj.compatibility === null
  ) {
    return null;
  }
  return {
    steps: obj.steps as BuilderConfig["steps"],
    categories: obj.categories as BuilderConfig["categories"],
    brands: Array.isArray(obj.brands) ? (obj.brands as BuilderConfig["brands"]) : [],
    products: obj.products as BuilderConfig["products"],
    settings: (obj.settings as BuilderConfig["settings"]) ?? null,
    compatibility: (obj.compatibility as BuilderConfig["compatibility"]) ?? null,
    updatedAt: (obj.updatedAt as string | undefined) ?? undefined,
  } as BuilderConfig;
}

export async function fetchBuilderConfig(): Promise<BuilderConfig | null> {
  const raw = await fetchSiteSetting(BUILDER_SETTING_KEY);
  return normalizeBuilderConfig(raw);
}

export async function saveBuilderConfig(config: BuilderConfig): Promise<void> {
  await upsertSiteSetting(BUILDER_SETTING_KEY, config);
}
