import type { Product } from "../types";

type StockMetersProps = {
  products: Product[];
};

export default function StockMeters({ products }: StockMetersProps) {
  const topProducts = products.slice(0, 3);
  return (
    <div className="stock-meters" id="live-stock">
      {topProducts.map((item) => (
        <div className="stock-meter" key={item.id}>
          <strong>{item.name}</strong>
          <small>{item.stock} units</small>
        </div>
      ))}
    </div>
  );
}
