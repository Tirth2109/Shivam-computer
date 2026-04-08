import type { BuilderStep } from "../../types/builder";

interface BuilderStepPillsProps {
  steps: BuilderStep[];
  currentStepId: string;
  onSelect?: (id: string) => void;
}

export default function BuilderStepPills({ steps, currentStepId, onSelect }: BuilderStepPillsProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {steps.map((step, index) => {
        const isActive = step.id === currentStepId;
        const doneIndex = steps.findIndex((s) => s.id === currentStepId);
        const isDone = index < doneIndex;
        const base =
          "rounded-full border px-3 py-1 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ec7ff]";
        const palette = isActive
          ? "border-[#5ec7ff] bg-[#5ec7ff] text-[#050812]"
          : isDone
            ? "border-[#3fb950] text-[#3fb950]"
            : "border-[#2a3f5d] text-[#a8b6ca]";
        return (
          <button
            type="button"
            key={step.id}
            className={`${base} ${palette}`}
            onClick={() => onSelect?.(step.id)}
          >
            {index + 1}. {step.title}
          </button>
        );
      })}
    </div>
  );
}
