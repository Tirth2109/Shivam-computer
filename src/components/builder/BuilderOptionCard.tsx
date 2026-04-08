import type { ReactNode } from "react";

interface BuilderOptionCardProps {
  title: string;
  description?: string;
  badge?: ReactNode;
  selected: boolean;
  onSelect: () => void;
}

export default function BuilderOptionCard({
  title,
  description,
  badge,
  selected,
  onSelect,
}: BuilderOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-start justify-between rounded-xl border px-4 py-3 text-left transition ${
        selected
          ? "border-[#5ec7ff] bg-[#0f1625] shadow-[0_10px_30px_rgba(94,199,255,0.25)]"
          : "border-[#2a3f5d] bg-[#111b2c] hover:-translate-y-0.5 hover:border-[#5ec7ff66]"
      }`}
    >
      <div>
        <div className="text-sm font-semibold text-[#ecf3ff]">{title}</div>
        {description ? <p className="mt-1 text-xs text-[#a8b6ca]">{description}</p> : null}
      </div>
      <div className="flex items-center gap-2">
        {badge ? <span className="text-[11px] text-[#5ec7ff]">{badge}</span> : null}
        <span
          className={`h-4 w-4 rounded-full border ${
            selected ? "border-[#5ec7ff] bg-[#5ec7ff]" : "border-[#2a3f5d]"
          }`}
          aria-hidden
        />
      </div>
    </button>
  );
}
