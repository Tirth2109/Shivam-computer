import { calculateBuildTotal, selectedProductByCategory } from "../../lib/builderLogic";
import type { BuilderConfig, BuilderSelections } from "../../types/builder";

interface BuilderSummaryPanelProps {
  config: BuilderConfig;
  selections: BuilderSelections;
  onReset?: () => void;
  onCheckout?: () => void;
}

export default function BuilderSummaryPanel({ config, selections, onReset, onCheckout }: BuilderSummaryPanelProps) {
  const { total, lines } = calculateBuildTotal(selections, config.products);
  const summaryReady = lines.length > 0;

  const buildTime = config.settings.buildTimeText;
  const delivery = config.settings.deliveryText;
  const support = config.settings.supportText;

  const cpu = selectedProductByCategory("cpu", selections, config.products);
  const gpu = selectedProductByCategory("gpu", selections, config.products);

  return (
    <div className="rounded-2xl border border-[#2a3f5d] bg-[#0f1625] p-4 shadow-[0_12px_36px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-[#ecf3ff]">{config.settings.summaryHeadline}</h3>
          <p className="text-xs text-[#a8b6ca]">{config.settings.summarySubtext}</p>
        </div>
        {onReset ? (
          <button
            type="button"
            onClick={onReset}
            className="text-[11px] font-semibold text-[#5ec7ff] underline-offset-4 hover:underline"
          >
            Reset
          </button>
        ) : null}
      </div>

      <div className="mt-4 space-y-2">
        {summaryReady ? (
          lines.map((line) => (
            <div
              key={line.product.id}
              className="flex items-start justify-between rounded-lg border border-[#1f2c44] bg-[#0b1120] px-3 py-2"
            >
              <div>
                <div className="text-xs font-semibold text-[#ecf3ff]">{line.product.name}</div>
                <div className="text-[11px] text-[#a8b6ca]">
                  {line.product.categoryId.toUpperCase()}
                  {line.product.brandId ? ` · ${line.product.brandId.toUpperCase()}` : ""}
                </div>
              </div>
              <div className="text-xs font-semibold text-[#5ec7ff]">
                Rs {line.price.toLocaleString()}
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-[#a8b6ca]">
            Select parts to see price and compatibility highlights.
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-[#2a3f5d] bg-[#111b2c] px-3 py-2">
        <span className="text-sm font-semibold text-[#d5deec]">Estimated total</span>
        <span className="text-lg font-semibold text-[#5ec7ff]">
          Rs {total.toLocaleString()}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-[11px] text-[#a8b6ca]">
        <div>• {buildTime}</div>
        <div>• {delivery}</div>
        <div>• {support}</div>
        {cpu ? <div>• CPU: {cpu.name}</div> : null}
        {gpu ? <div>• GPU: {gpu.name}</div> : null}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <button
          type="button"
          onClick={onCheckout}
          disabled={!summaryReady}
          className={`flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition ${
            summaryReady
              ? "border border-[#5ec7ff] bg-[#5ec7ff] text-[#050812] hover:bg-[#81d7ff]"
              : "cursor-not-allowed border border-[#1f2c44] bg-[#0b1120] text-[#5a6987]"
          }`}
        >
          Proceed to Checkout
        </button>
        <a
          href="https://wa.me/919974655284"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-full border border-[#354a69] bg-[#0f1625] px-4 py-2 text-sm font-semibold text-[#d5deec] transition hover:border-[#5ec7ff] hover:text-[#5ec7ff]"
        >
          Chat for Expert Help
        </a>
      </div>
    </div>
  );
}
