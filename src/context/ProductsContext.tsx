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
import {
  fetchProducts,
  addProductToSupabase,
  updateProductInSupabase,
  deleteProductFromSupabase,
  seedProducts,
} from "../lib/productsApi";

const STORAGE_KEY = "shivam_computer_products";

interface ProductsContextValue {
  products: Product[];
  bestSellers: Product[];
  newArrivals: Product[];
  topDeals: Product[];
  latestLaptopAndHeadphoneDeals: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetToDefault: () => void;
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

export function ProductsProvider({ children }: { children: ReactNode }) {
  const useSupabase = isSupabaseConfigured();
  const [products, setProducts] = useState<Product[]>(
    useSupabase ? initialProducts : loadFromStorage()
  );
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
        } else {
          seedProducts(initialProducts)
            .then(() => setProducts(initialProducts))
            .catch((e) => console.warn("Seed failed:", e));
        }
      })
      .catch((e) => {
        setError(e.message ?? "Failed to load products");
        setProducts(loadFromStorage());
      })
      .finally(() => setLoading(false));
  }, [useSupabase]);

  useEffect(() => {
    if (!useSupabase) saveToStorage(products);
  }, [products, useSupabase]);

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
      addProduct,
      updateProduct,
      deleteProduct,
      resetToDefault,
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
      addProduct,
      updateProduct,
      deleteProduct,
      resetToDefault,
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
