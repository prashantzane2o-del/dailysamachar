"use client";

import { useState } from "react";

export function BmiCalculator() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // cm to meters
    if (w > 0 && h > 0) {
      setBmi(parseFloat((w / (h * h)).toFixed(1)));
    }
  };

  return (
    <div className="rounded-xl border border-line bg-soft p-6">
      <h3 className="mb-4 text-xl font-bold text-ink">BMI Calculator</h3>
      <form onSubmit={calculateBMI} className="space-y-4">
        <div>
          <label htmlFor="bmi-weight" className="mb-1 block text-sm font-semibold text-muted">Weight (kg)</label>
          <input id="bmi-weight" type="number" step="any" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full rounded-md border border-line bg-paper px-3 py-2 text-ink focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal" required />
        </div>
        <div>
          <label htmlFor="bmi-height" className="mb-1 block text-sm font-semibold text-muted">Height (cm)</label>
          <input id="bmi-height" type="number" step="any" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-md border border-line bg-paper px-3 py-2 text-ink focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal" required />
        </div>
        <button type="submit" className="w-full rounded-md bg-signal px-4 py-2 font-bold text-white transition-colors hover:bg-red-800">
          Calculate BMI
        </button>
      </form>

      {bmi !== null && (
        <div className="mt-6 rounded-md border border-line bg-paper p-4 text-center">
          <p className="text-sm font-medium text-muted">Your BMI Result</p>
          <p className="mt-1 text-3xl font-black text-ink">{bmi}</p>
        </div>
      )}
    </div>
  );
}