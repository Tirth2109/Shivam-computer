import type { Product } from "../types";

type StockMetersProps = {
  products: Product[];
};

export default function StockMeters({ products }: StockMetersProps) {
  const topProducts = products.slice(0, 3);
  return (
    <div className="mt-3 grid gap-2" id="live-stock">
      {topProducts.map((item) => (
        <div
          className="flex items-center justify-between rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2"
          key={item.id}
        >
          <strong className="text-sm text-[#ecf3ff]">{item.name}</strong>
          <small className="text-xs text-[#a8b6ca]">{item.stock} units</small>
        </div>
      ))}
    </div>
  );
}
