import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isSupabaseConfigured } from "../lib/supabase";
import { initialBuilderConfig } from "../data/builder";
import {
  fetchBuilderConfig,
  saveBuilderConfig,
  normalizeBuilderConfig,
} from "../lib/builderApi";
import type {
  BuilderBrand,
  BuilderCategory,
  BuilderCompatibilityRules,
  BuilderConfig,
  BuilderProduct,
  BuilderSettings,
  BuilderStep,
} from "../types/builder";

const STORAGE_KEY = "shivam_builder_config";

type DraftUpdater<T> = (draft: T) => T;

interface BuilderContextValue {
  config: BuilderConfig;
  activeSteps: BuilderStep[];
  activeCategories: BuilderCategory[];
  activeProducts: BuilderProduct[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  save: (next: BuilderConfig | DraftUpdater<BuilderConfig>) => Promise<void>;
  addStep: (step: Partial<BuilderStep>) => Promise<void>;
  updateStep: (id: string, updates: Partial<BuilderStep>) => Promise<void>;
  deleteStep: (id: string) => Promise<void>;
  reorderSteps: (orderedIds: string[]) => Promise<void>;
  addCategory: (cat: Partial<BuilderCategory>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<BuilderCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addBrand: (brand: Partial<BuilderBrand>) => Promise<void>;
  updateBrand: (id: string, updates: Partial<BuilderBrand>) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
  addProduct: (product: Partial<BuilderProduct>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<BuilderProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  reorderProducts: (categoryId: string, orderedIds: string[]) => Promise<void>;
  updateSettings: (updates: Partial<BuilderSettings>) => Promise<void>;
  updateCompatibility: (updates: Partial<BuilderCompatibilityRules>) => Promise<void>;
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

function loadFromStorage(): BuilderConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialBuilderConfig;
    const parsed = JSON.parse(raw) as unknown;
    const normalized = normalizeBuilderConfig(parsed);
    return normalized ?? initialBuilderConfig;
  } catch {
    return initialBuilderConfig;
  }
}

function saveToStorage(config: BuilderConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

function generateId(prefix: string) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function BuilderProvider({ children }: { children: ReactNode }) {
  const useSupabase = isSupabaseConfigured();
  const [config, setConfig] = useState<BuilderConfig>(
    useSupabase ? initialBuilderConfig : loadFromStorage()
  );
  const [loading, setLoading] = useState(useSupabase);
  const [error, setError] = useState<string | null>(null);

  const activeSteps = useMemo(
    () => [...config.steps].filter((s) => s.active).sort((a, b) => a.order - b.order),
    [config.steps]
  );

  const activeCategories = useMemo(
    () => [...config.categories].filter((c) => c.active).sort((a, b) => a.order - b.order),
    [config.categories]
  );

  const activeProducts = useMemo(
    () => config.products.filter((p) => p.active).sort((a, b) => a.sortOrder - b.sortOrder),
    [config.products]
  );

  const refresh = useCallback(async () => {
    if (!useSupabase) return;
    setLoading(true);
    setError(null);
    try {
      const fromDb = await fetchBuilderConfig();
      if (fromDb) {
        setConfig(fromDb);
        saveToStorage(fromDb);
      } else {
        setConfig(initialBuilderConfig);
      }
    } catch (e: any) {
      const message = e?.message ?? "";
      const missingTable =
        message.includes("site_settings") ||
        message.includes("relation") ||
        message.includes("schema cache");
      if (missingTable) {
        console.warn("Builder config table missing; falling back to local seed");
        setConfig(loadFromStorage());
        setError(null);
      } else {
        setError(message || "Failed to load builder config");
        setConfig(loadFromStorage());
      }
    } finally {
      setLoading(false);
    }
  }, [useSupabase]);

  useEffect(() => {
    if (!useSupabase) {
      setLoading(false);
      return;
    }
    void refresh();
  }, [useSupabase, refresh]);

  const persist = useCallback(
    async (nextConfig: BuilderConfig) => {
      const withTimestamp: BuilderConfig = {
        ...nextConfig,
        updatedAt: new Date().toISOString(),
      };
      setConfig(withTimestamp);
      saveToStorage(withTimestamp);
      if (useSupabase) {
        await saveBuilderConfig(withTimestamp);
      }
    },
    [useSupabase]
  );

  const save = useCallback(
    async (next: BuilderConfig | DraftUpdater<BuilderConfig>) => {
      const resolved = typeof next === "function" ? (next as DraftUpdater<BuilderConfig>)(config) : next;
      await persist(resolved);
    },
    [config, persist]
  );

  const updateSettings = useCallback(
    async (updates: Partial<BuilderSettings>) => {
      await save((draft) => ({ ...draft, settings: { ...draft.settings, ...updates } }));
    },
    [save]
  );

  const updateCompatibility = useCallback(
    async (updates: Partial<BuilderCompatibilityRules>) => {
      await save((draft) => ({ ...draft, compatibility: { ...draft.compatibility, ...updates } }));
    },
    [save]
  );

  const addStep = useCallback(
    async (partial: Partial<BuilderStep>) => {
      const step: BuilderStep = {
        id: partial.id ?? generateId("step"),
        title: partial.title ?? "Untitled Step",
        description: partial.description ?? "",
        helperText: partial.helperText ?? "",
        ctaLabel: partial.ctaLabel ?? draftButtonText(config),
        kind: partial.kind ?? "category",
        categoryIds: partial.categoryIds ?? [],
        order: partial.order ?? config.steps.length + 1,
        active: partial.active ?? true,
      };
      await save((draft) => ({ ...draft, steps: [...draft.steps, step] }));
    },
    [config, save]
  );

  const updateStep = useCallback(
    async (id: string, updates: Partial<BuilderStep>) => {
      await save((draft) => ({
        ...draft,
        steps: draft.steps.map((s) => (s.id === id ? { ...s, ...updates } : s)),
      }));
    },
    [save]
  );

  const deleteStep = useCallback(
    async (id: string) => {
      await save((draft) => ({
        ...draft,
        steps: draft.steps.filter((s) => s.id !== id),
      }));
    },
    [save]
  );

  const reorderSteps = useCallback(
    async (orderedIds: string[]) => {
      await save((draft) => {
        const idToOrder = new Map<string, number>();
        orderedIds.forEach((id, index) => idToOrder.set(id, index + 1));
        const nextSteps = draft.steps.map((s) => ({
          ...s,
          order: idToOrder.get(s.id) ?? s.order,
        }));
        nextSteps.sort((a, b) => a.order - b.order);
        return { ...draft, steps: nextSteps };
      });
    },
    [save]
  );

  const addCategory = useCallback(
    async (partial: Partial<BuilderCategory>) => {
      const cat: BuilderCategory = {
        id: partial.id ?? generateId("cat"),
        name: partial.name ?? "New Category",
        slug: partial.slug ?? `cat-${Date.now()}`,
        description: partial.description ?? "",
        order: partial.order ?? config.categories.length + 1,
        active: partial.active ?? true,
      };
      await save((draft) => ({ ...draft, categories: [...draft.categories, cat] }));
    },
    [config.categories.length, save]
  );

  const updateCategory = useCallback(
    async (id: string, updates: Partial<BuilderCategory>) => {
      await save((draft) => ({
        ...draft,
        categories: draft.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      }));
    },
    [save]
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      await save((draft) => ({
        ...draft,
        categories: draft.categories.filter((c) => c.id !== id),
        products: draft.products.filter((p) => p.categoryId !== id),
      }));
    },
    [save]
  );

  const addBrand = useCallback(
    async (partial: Partial<BuilderBrand>) => {
      const brand: BuilderBrand = {
        id: partial.id ?? generateId("brand"),
        name: partial.name ?? "New Brand",
        slug: partial.slug ?? `brand-${Date.now()}`,
        logo: partial.logo,
        order: partial.order ?? config.brands.length + 1,
        active: partial.active ?? true,
      };
      await save((draft) => ({ ...draft, brands: [...draft.brands, brand] }));
    },
    [config.brands.length, save]
  );

  const updateBrand = useCallback(
    async (id: string, updates: Partial<BuilderBrand>) => {
      await save((draft) => ({
        ...draft,
        brands: draft.brands.map((b) => (b.id === id ? { ...b, ...updates } : b)),
      }));
    },
    [save]
  );

  const deleteBrand = useCallback(
    async (id: string) => {
      await save((draft) => ({
        ...draft,
        brands: draft.brands.filter((b) => b.id !== id),
        products: draft.products.map((p) =>
          p.brandId === id ? { ...p, brandId: undefined } : p
        ),
      }));
    },
    [save]
  );

  const addProduct = useCallback(
    async (partial: Partial<BuilderProduct>) => {
      const product: BuilderProduct = {
        id: partial.id ?? generateId("bp"),
        name: partial.name ?? "New Part",
        slug: partial.slug ?? `part-${Date.now()}`,
        categoryId: partial.categoryId ?? (config.categories[0]?.id ?? "category"),
        brandId: partial.brandId,
        price: partial.price ?? 0,
        salePrice: partial.salePrice,
        sku: partial.sku,
        stockStatus: partial.stockStatus ?? "in_stock",
        image: partial.image ?? "",
        shortDescription: partial.shortDescription ?? "",
        description: partial.description ?? "",
        active: partial.active ?? true,
        featured: partial.featured ?? false,
        recommended: partial.recommended ?? false,
        sortOrder: partial.sortOrder ?? config.products.length + 1,
        specs: partial.specs ?? [],
      };
      await save((draft) => ({ ...draft, products: [...draft.products, product] }));
    },
    [config.categories, config.products.length, save]
  );

  const updateProduct = useCallback(
    async (id: string, updates: Partial<BuilderProduct>) => {
      await save((draft) => ({
        ...draft,
        products: draft.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      }));
    },
    [save]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      await save((draft) => ({
        ...draft,
        products: draft.products.filter((p) => p.id !== id),
      }));
    },
    [save]
  );

  const reorderProducts = useCallback(
    async (categoryId: string, orderedIds: string[]) => {
      await save((draft) => {
        const idToOrder = new Map<string, number>();
        orderedIds.forEach((id, idx) => idToOrder.set(id, idx + 1));
        const nextProducts = draft.products.map((p) =>
          p.categoryId === categoryId
            ? { ...p, sortOrder: idToOrder.get(p.id) ?? p.sortOrder }
            : p
        );
        return { ...draft, products: nextProducts };
      });
    },
    [save]
  );

  const value: BuilderContextValue = {
    config,
    activeSteps,
    activeCategories,
    activeProducts,
    loading,
    error,
    refresh,
    save,
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
  };

  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
}

function draftButtonText(config: BuilderConfig) {
  return config.settings?.buttonText ?? "Next";
}

export function useBuilder() {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error("useBuilder must be used within BuilderProvider");
  return ctx;
}
