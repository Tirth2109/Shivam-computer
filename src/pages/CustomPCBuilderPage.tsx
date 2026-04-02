import { useState } from "react";
import { Link } from "react-router-dom";
import HeaderWithDeals from "../components/HeaderWithDeals";
import Footer from "../components/Footer";
import WhatsAppFloat from "../components/WhatsAppFloat";

const STEPS = [
  "Budget & Purpose",
  "Choose CPU",
  "Motherboard",
  "RAM + Storage",
  "GPU + PSU",
  "Cabinet + Cooling",
  "Summary",
];

const BUDGET_OPTIONS = [
  { label: "Budget (₹25k–₹40k)", value: "budget" },
  { label: "Mid Range (₹40k–₹80k)", value: "mid" },
  { label: "High End (₹80k+)", value: "high" },
];

const PURPOSE_OPTIONS = [
  { label: "Gaming", value: "gaming" },
  { label: "Office / Work", value: "office" },
  { label: "Content / Editing", value: "editing" },
  { label: "Programming", value: "programming" },
];

export default function CustomPCBuilderPage() {
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState("");
  const [purpose, setPurpose] = useState("");
  const panelClass = "max-w-[620px] rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-5";
  const fieldClass =
    "mt-1 w-full rounded-lg border border-[#2a3f5d] bg-transparent px-3 py-2 text-sm text-[#ecf3ff] outline-none transition focus:border-[#5ec7ff]";
  const primaryBtn =
    "inline-flex items-center rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-5 py-2.5 text-sm font-semibold text-[#050812] transition hover:bg-[#81d7ff]";
  const secondaryBtn =
    "inline-flex items-center rounded-full border border-[#354a69] bg-[#0f1625]/70 px-5 py-2.5 text-sm font-semibold text-[#d5deec] shadow-[0_6px_16px_rgba(0,0,0,0.35)] transition hover:border-[#5ec7ff] hover:text-[#5ec7ff] hover:bg-[#162339]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ec7ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1120]";

  return (
    <>
      <HeaderWithDeals />
      <main className="py-10">
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[#ecf3ff]">Custom PC Builder</h2>
            <p className="mt-1 text-sm text-[#a8b6ca]">Choose your budget, purpose, and we'll suggest compatible parts. Build time: 2–5 days.</p>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            {STEPS.map((label, i) => (
              <span
                key={label}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  i + 1 === step
                    ? "border-[#5ec7ff] bg-[#5ec7ff] text-[#050812]"
                    : i + 1 < step
                      ? "border-[#3fb950] text-[#3fb950]"
                      : "border-[#2a3f5d] text-[#a8b6ca]"
                }`}
              >
                {i + 1}. {label}
              </span>
            ))}
          </div>

          {step === 1 && (
            <div className={panelClass}>
              <h3 className="text-lg font-semibold text-[#ecf3ff]">Step 1: Budget & Purpose</h3>
              <div className="mt-4">
                <label className="text-sm text-[#d5deec]">Budget range</label>
                <select className={fieldClass} value={budget} onChange={(e) => setBudget(e.target.value)}>
                  <option value="">Select budget</option>
                  {BUDGET_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="mt-4">
                <label className="text-sm text-[#d5deec]">Purpose</label>
                <select className={fieldClass} value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                  <option value="">Select purpose</option>
                  {PURPOSE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <button type="button" className={`${primaryBtn} mt-4`} onClick={() => setStep(2)}>
                Next: Choose CPU
              </button>
            </div>
          )}

          {step === 2 && (
            <div className={panelClass}>
              <h3 className="text-lg font-semibold text-[#ecf3ff]">Step 2: Choose CPU</h3>
              <p className="mt-2 text-sm text-[#a8b6ca]">We'll show compatible Intel/AMD processors based on your budget. (Guided compatibility in full implementation.)</p>
              <div className="mt-4 flex gap-2">
              <button type="button" className={secondaryBtn} onClick={() => setStep(1)}>Back</button>
              <button type="button" className={primaryBtn} onClick={() => setStep(3)}>
                Next: Motherboard
              </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={panelClass}>
              <h3 className="text-lg font-semibold text-[#ecf3ff]">Step 3: Motherboard</h3>
              <p className="mt-2 text-sm text-[#a8b6ca]">Compatible motherboards only. (Filter by socket in full implementation.)</p>
              <div className="mt-4 flex gap-2">
              <button type="button" className={secondaryBtn} onClick={() => setStep(2)}>Back</button>
              <button type="button" className={primaryBtn} onClick={() => setStep(4)}>
                Next: RAM + Storage
              </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className={panelClass}>
              <h3 className="text-lg font-semibold text-[#ecf3ff]">Step 4: RAM + Storage</h3>
              <p className="mt-2 text-sm text-[#a8b6ca]">Select RAM size and SSD/HDD. (DDR4/DDR5 and capacity filters in full implementation.)</p>
              <div className="mt-4 flex gap-2">
              <button type="button" className={secondaryBtn} onClick={() => setStep(3)}>Back</button>
              <button type="button" className={primaryBtn} onClick={() => setStep(5)}>
                Next: GPU + PSU
              </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className={panelClass}>
              <h3 className="text-lg font-semibold text-[#ecf3ff]">Step 5: GPU + PSU</h3>
              <p className="mt-2 text-sm text-[#a8b6ca]">We recommend GPU and PSU wattage based on your build. (Compatibility check in full implementation.)</p>
              <div className="mt-4 flex gap-2">
              <button type="button" className={secondaryBtn} onClick={() => setStep(4)}>Back</button>
              <button type="button" className={primaryBtn} onClick={() => setStep(6)}>
                Next: Cabinet + Cooling
              </button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className={panelClass}>
              <h3 className="text-lg font-semibold text-[#ecf3ff]">Step 6: Cabinet + Cooling</h3>
              <p className="mt-2 text-sm text-[#a8b6ca]">Choose cabinet and CPU cooler. (Form factor and TDP match in full implementation.)</p>
              <div className="mt-4 flex gap-2">
              <button type="button" className={secondaryBtn} onClick={() => setStep(5)}>Back</button>
              <button type="button" className={primaryBtn} onClick={() => setStep(7)}>
                View Summary
              </button>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className={panelClass}>
              <h3 className="text-lg font-semibold text-[#ecf3ff]">Step 7: Summary</h3>
              <p className="mt-2 text-sm text-[#d5deec]">Your custom build summary. Assembled + stress tested. Build time: 2–5 days. Delivered to your doorstep.</p>
              <p className="mt-2 text-sm text-[#a8b6ca]">In a full implementation, selected parts and total price would appear here with checkout.</p>
              <Link to="/category/custom-gaming-pcs" className={`${primaryBtn} mt-3`}>
                Browse Custom Builds & Checkout
              </Link>
              <p className="mt-4 text-sm text-[#d5deec]">
                <strong>Need help choosing?</strong>{" "}
                <a href="https://wa.me/919974655284" target="_blank" rel="noopener noreferrer">
                  Chat on WhatsApp
                </a>{" "}
                for expert build support.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
