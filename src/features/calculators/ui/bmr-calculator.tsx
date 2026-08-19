"use client";

import { useState } from "react";

export function BmrCalculator() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [bmr, setBmr] = useState<number | null>(null);

  const calculateBMR = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);
    
    if (w > 0 && h > 0 && a > 0) {
      // Mifflin-St Jeor Equation
      let result = (10 * w) + (6.25 * h) - (5 * a);
      result = gender === "male" ? result + 5 : result - 161;
      setBmr(Math.round(result));
    }
  };

  return (
    <div className="rounded-xl border border-line bg-soft p-6">
      <h3 className="mb-4 text-xl font-bold text-ink">BMR Calculator</h3>
      <form onSubmit={calculateBMR} className="space-y-4">
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-ink">
            <input type="radio" name="gender" value="male" checked={gender === "male"} onChange={() => setGender("male")} className="text-signal focus:ring-signal" /> Male
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink">
            <input type="radio" name="gender" value="female" checked={gender === "female"} onChange={() => setGender("female")} className="text-signal focus:ring-signal" /> Female
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-muted">Weight (kg)</label>
            <input type="number" step="any" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full rounded-md border border-line bg-paper px-3 py-2 text-ink focus:border-signal focus:outline-none" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-muted">Height (cm)</label>
            <input type="number" step="any" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-md border border-line bg-paper px-3 py-2 text-ink focus:border-signal focus:outline-none" required />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-muted">Age (years)</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-md border border-line bg-paper px-3 py-2 text-ink focus:border-signal focus:outline-none" required />
        </div>
        <button type="submit" className="w-full rounded-md bg-signal px-4 py-2 font-bold text-white transition-colors hover:bg-red-800">
          Calculate BMR
        </button>
      </form>

      {bmr !== null && (
        <div className="mt-6 rounded-md border border-line bg-paper p-4 text-center">
          <p className="text-sm font-medium text-muted">Maintenance Calories</p>
          <p className="mt-1 text-3xl font-black text-ink">{bmr} <span className="text-base font-medium">kcal/day</span></p>
        </div>
      )}
    </div>
  );
}