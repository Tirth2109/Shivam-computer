import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
  useEffect,
} from "react";
import type { Product } from "../types";
import { initialProducts } from "../data/products";
import { isSupabaseConfigured } from "../lib/supabase";
import { useAuth } from "./AuthContext";
import {
  fetchProducts,
  addProductToSupabase,
  updateProductInSupabase,
  deleteProductFromSupabase,
  seedProducts,
  fetchSiteSetting,
  upsertSiteSetting,
} from "../lib/productsApi";

const STORAGE_KEY = "shivam_computer_products";
const CAROUSEL_STORAGE_KEY = "shivam_home_carousel_product_ids";
const CAROUSEL_SETTING_KEY = "home_carousel_product_ids";
const CAROUSEL_REQUIRED_COUNT = 5;

interface ProductsContextValue {
  products: Product[];
  bestSellers: Product[];
  newArrivals: Product[];
  topDeals: Product[];
  latestLaptopAndHeadphoneDeals: Product[];
  carouselProductIds: string[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetToDefault: () => void;
  saveCarouselProductIds: (ids: string[]) => Promise<void>;
  resetCarouselToDefault: () => Promise<void>;
  loading: boolean;
  error: string | null;
  useSupabase: boolean;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

function loadFromStorage(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Product[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return initialProducts;
}

function saveToStorage(products: Product[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {
    // ignore
  }
}

function normalizeCarouselIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const id = item.trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    result.push(id);
  }
  return result;
}

function sanitizeCarouselIds(ids: string[], products: Product[]) {
  const validIds = new Set(products.map((p) => p.id));
  return normalizeCarouselIds(ids).filter((id) => validIds.has(id));
}

function getDefaultCarouselIds(products: Product[]): string[] {
  const result: string[] = [];
  const seen = new Set<string>();
  const push = (id: string) => {
    if (seen.has(id)) return;
    seen.add(id);
    result.push(id);
  };

  for (const p of products) {
    if (p.categorySlug === "laptops" || p.categorySlug === "headphones") {
      push(p.id);
      if (result.length >= CAROUSEL_REQUIRED_COUNT) return result;
    }
  }

  for (const p of products) {
    push(p.id);
    if (result.length >= CAROUSEL_REQUIRED_COUNT) return result;
  }

  return result;
}

function loadCarouselFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(CAROUSEL_STORAGE_KEY);
    if (!raw) return [];
    return normalizeCarouselIds(JSON.parse(raw));
  } catch {
    return [];
  }
}

function saveCarouselToStorage(ids: string[]) {
  try {
    localStorage.setItem(CAROUSEL_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const useSupabase = isSupabaseConfigured();
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>(
    useSupabase ? initialProducts : loadFromStorage()
  );
  const [carouselProductIds, setCarouselProductIds] = useState<string[]>(
    () => loadCarouselFromStorage()
  );
  const [carouselSettingsLoaded, setCarouselSettingsLoaded] = useState(false);
  const [loading, setLoading] = useState(useSupabase);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!useSupabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetchProducts()
      .then((data) => {
        if (data.length > 0) {
          setProducts(data);
          return;
        }

        // Avoid failing RLS-protected INSERTs for visitors who aren't signed in yet.
        if (!user) {
          setProducts(initialProducts);
          return;
        }

        return seedProducts(initialProducts)
          .then(() => setProducts(initialProducts))
          .catch((e) => console.warn("Seed failed:", e));
      })
      .catch((e) => {
        setError(e.message ?? "Failed to load products");
        setProducts(loadFromStorage());
      })
      .finally(() => setLoading(false));
  }, [useSupabase, user, authLoading]);

  useEffect(() => {
    if (!useSupabase) saveToStorage(products);
  }, [products, useSupabase]);

  useEffect(() => {
    saveCarouselToStorage(carouselProductIds);
  }, [carouselProductIds]);

  useEffect(() => {
    if (carouselSettingsLoaded) return;
    let canceled = false;

    const applyIds = (raw: unknown) => {
      const normalized = normalizeCarouselIds(raw);
      if (normalized.length === 0) return;
      const sanitized = sanitizeCarouselIds(normalized, products);
      setCarouselProductIds(sanitized);
      saveCarouselToStorage(sanitized);
    };

    if (useSupabase) {
      fetchSiteSetting(CAROUSEL_SETTING_KEY)
        .then((value) => {
          if (canceled) return;
          applyIds(value);
        })
        .catch(() => {
          if (canceled) return;
          setCarouselProductIds((prev) => sanitizeCarouselIds(prev, products));
        })
        .finally(() => {
          if (!canceled) setCarouselSettingsLoaded(true);
        });
      return () => {
        canceled = true;
      };
    }

    setCarouselProductIds((prev) => sanitizeCarouselIds(prev, products));
    setCarouselSettingsLoaded(true);
    return () => {
      canceled = true;
    };
  }, [carouselSettingsLoaded, products, useSupabase]);

  useEffect(() => {
    if (!carouselSettingsLoaded) return;
    setCarouselProductIds((prev) => sanitizeCarouselIds(prev, products));
  }, [carouselSettingsLoaded, products]);

  const addProduct = useCallback(
    async (product: Product) => {
      setError(null);
      if (useSupabase) {
        try {
          await addProductToSupabase(product);
          setProducts((prev) => [...prev, product]);
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Failed to add product";
          setError(msg);
          throw e;
        }
      } else {
        setProducts((prev) => [...prev, product]);
      }
    },
    [useSupabase]
  );

  const updateProduct = useCallback(
    async (id: string, updates: Partial<Product>) => {
      setError(null);
      if (useSupabase) {
        try {
          await updateProductInSupabase(id, updates);
          setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
          );
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Failed to update product";
          setError(msg);
          throw e;
        }
      } else {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
        );
      }
    },
    [useSupabase]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      setError(null);
      if (useSupabase) {
        try {
          await deleteProductFromSupabase(id);
          setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Failed to delete product";
          setError(msg);
          throw e;
        }
      } else {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    },
    [useSupabase]
  );

  const resetToDefault = useCallback(async () => {
    if (useSupabase) {
      try {
        await seedProducts(initialProducts);
        setProducts(initialProducts);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to reset");
      }
    } else {
      setProducts(initialProducts);
    }
  }, [useSupabase]);

  const saveCarouselProductIds = useCallback(
    async (ids: string[]) => {
      const sanitized = sanitizeCarouselIds(ids, products);
      if (sanitized.length !== CAROUSEL_REQUIRED_COUNT) {
        throw new Error("Please select exactly 5 unique products for the homepage carousel.");
      }

      let remoteError: unknown = null;
      if (useSupabase) {
        try {
          await upsertSiteSetting(CAROUSEL_SETTING_KEY, sanitized);
        } catch (e) {
          remoteError = e;
        }
      }

      setCarouselProductIds(sanitized);
      saveCarouselToStorage(sanitized);

      if (remoteError) {
        const message =
          remoteError instanceof Error ? remoteError.message : "unknown error";
        throw new Error(
          `Saved locally but failed to sync carousel setting to Supabase: ${message}`
        );
      }
    },
    [products, useSupabase]
  );

  const resetCarouselToDefault = useCallback(async () => {
    const defaults = getDefaultCarouselIds(products);
    if (defaults.length !== CAROUSEL_REQUIRED_COUNT) {
      throw new Error("Not enough products available to create the default carousel.");
    }
    await saveCarouselProductIds(defaults);
  }, [products, saveCarouselProductIds]);

  const bestSellers = useMemo(
    () => products.filter((_, i) => [0, 2, 5, 10, 14].includes(i)),
    [products]
  );
  const newArrivals = useMemo(
    () => products.filter((_, i) => [1, 6, 11, 16, 18].includes(i)),
    [products]
  );
  const topDeals = useMemo(
    () =>
      products
        .filter((p) => (p.discountPercent ?? 0) >= 11)
        .slice(0, 8),
    [products]
  );
  const latestLaptopAndHeadphoneDeals = useMemo(
    () =>
      products.filter(
        (p) =>
          p.categorySlug === "laptops" || p.categorySlug === "headphones"
      ),
    [products]
  );

  const value: ProductsContextValue = useMemo(
    () => ({
      products,
      bestSellers,
      newArrivals,
      topDeals,
      latestLaptopAndHeadphoneDeals,
      carouselProductIds,
      addProduct,
      updateProduct,
      deleteProduct,
      resetToDefault,
      saveCarouselProductIds,
      resetCarouselToDefault,
      loading,
      error,
      useSupabase,
    }),
    [
      products,
      bestSellers,
      newArrivals,
      topDeals,
      latestLaptopAndHeadphoneDeals,
      carouselProductIds,
      addProduct,
      updateProduct,
      deleteProduct,
      resetToDefault,
      saveCarouselProductIds,
      resetCarouselToDefault,
      loading,
      error,
      useSupabase,
    ]
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
