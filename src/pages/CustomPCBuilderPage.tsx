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

  return (
    <>
      <HeaderWithDeals />
      <main className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Custom PC Builder</h2>
            <p>Choose your budget, purpose, and we'll suggest compatible parts. Build time: 2–5 days.</p>
          </div>

          <div className="builder-steps">
            {STEPS.map((label, i) => (
              <span
                key={label}
                className={`builder-step-indicator ${i + 1 === step ? "active" : i + 1 < step ? "done" : ""}`}
              >
                {i + 1}. {label}
              </span>
            ))}
          </div>

          {step === 1 && (
            <div className="cart-summary" style={{ maxWidth: "520px" }}>
              <h3>Step 1: Budget & Purpose</h3>
              <div className="filter-group" style={{ marginTop: "1rem" }}>
                <label>Budget range</label>
                <select value={budget} onChange={(e) => setBudget(e.target.value)}>
                  <option value="">Select budget</option>
                  {BUDGET_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group" style={{ marginTop: "1rem" }}>
                <label>Purpose</label>
                <select value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                  <option value="">Select purpose</option>
                  {PURPOSE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <button type="button" className="btn primary" onClick={() => setStep(2)} style={{ marginTop: "1rem" }}>
                Next: Choose CPU
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="cart-summary" style={{ maxWidth: "520px" }}>
              <h3>Step 2: Choose CPU</h3>
              <p className="text-muted">We'll show compatible Intel/AMD processors based on your budget. (Guided compatibility in full implementation.)</p>
              <button type="button" className="btn secondary" onClick={() => setStep(1)}>Back</button>
              <button type="button" className="btn primary" onClick={() => setStep(3)} style={{ marginLeft: "0.5rem" }}>
                Next: Motherboard
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="cart-summary" style={{ maxWidth: "520px" }}>
              <h3>Step 3: Motherboard</h3>
              <p className="text-muted">Compatible motherboards only. (Filter by socket in full implementation.)</p>
              <button type="button" className="btn secondary" onClick={() => setStep(2)}>Back</button>
              <button type="button" className="btn primary" onClick={() => setStep(4)} style={{ marginLeft: "0.5rem" }}>
                Next: RAM + Storage
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="cart-summary" style={{ maxWidth: "520px" }}>
              <h3>Step 4: RAM + Storage</h3>
              <p className="text-muted">Select RAM size and SSD/HDD. (DDR4/DDR5 and capacity filters in full implementation.)</p>
              <button type="button" className="btn secondary" onClick={() => setStep(3)}>Back</button>
              <button type="button" className="btn primary" onClick={() => setStep(5)} style={{ marginLeft: "0.5rem" }}>
                Next: GPU + PSU
              </button>
            </div>
          )}

          {step === 5 && (
            <div className="cart-summary" style={{ maxWidth: "520px" }}>
              <h3>Step 5: GPU + PSU</h3>
              <p className="text-muted">We recommend GPU and PSU wattage based on your build. (Compatibility check in full implementation.)</p>
              <button type="button" className="btn secondary" onClick={() => setStep(4)}>Back</button>
              <button type="button" className="btn primary" onClick={() => setStep(6)} style={{ marginLeft: "0.5rem" }}>
                Next: Cabinet + Cooling
              </button>
            </div>
          )}

          {step === 6 && (
            <div className="cart-summary" style={{ maxWidth: "520px" }}>
              <h3>Step 6: Cabinet + Cooling</h3>
              <p className="text-muted">Choose cabinet and CPU cooler. (Form factor and TDP match in full implementation.)</p>
              <button type="button" className="btn secondary" onClick={() => setStep(5)}>Back</button>
              <button type="button" className="btn primary" onClick={() => setStep(7)} style={{ marginLeft: "0.5rem" }}>
                View Summary
              </button>
            </div>
          )}

          {step === 7 && (
            <div className="cart-summary" style={{ maxWidth: "520px" }}>
              <h3>Step 7: Summary</h3>
              <p>Your custom build summary. Assembled + stress tested. Build time: 2–5 days. Delivered to your doorstep.</p>
              <p className="text-muted">In a full implementation, selected parts and total price would appear here with checkout.</p>
              <Link to="/category/custom-gaming-pcs" className="btn primary">
                Browse Custom Builds & Checkout
              </Link>
              <p style={{ marginTop: "1rem" }}>
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
