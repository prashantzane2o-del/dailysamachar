// src/features/calculators/ui/bmi-calculator.tsx
"use client";

import { useState, useMemo } from "react";
import { Activity, Ruler, Weight } from "lucide-react";

export function BmiCalculator() {
  const [height, setHeight] = useState<number>(170); // in cm
  const [weight, setWeight] = useState<number>(65); // in kg

  // Auto-calculate BMI
  const { bmi, category, colorClass, indicatorPosition } = useMemo(() => {
    if (!height || !weight || height <= 0 || weight <= 0) {
      return { bmi: 0, category: "Invalid Input", colorClass: "text-muted", indicatorPosition: 0 };
    }

    const heightInMeters = height / 100;
    const calculatedBmi = weight / (heightInMeters * heightInMeters);
    const roundedBmi = parseFloat(calculatedBmi.toFixed(1));

    let category = "";
    let colorClass = "";
    let percentage = 0;

    if (roundedBmi < 18.5) {
      category = "Underweight";
      colorClass = "text-amber-500 dark:text-amber-400";
      percentage = (roundedBmi / 18.5) * 25;
    } else if (roundedBmi >= 18.5 && roundedBmi <= 24.9) {
      category = "Normal weight";
      colorClass = "text-green-600 dark:text-green-400";
      percentage = 25 + ((roundedBmi - 18.5) / 6.4) * 25;
    } else if (roundedBmi >= 25 && roundedBmi <= 29.9) {
      category = "Overweight";
      colorClass = "text-orange-500 dark:text-orange-400";
      percentage = 50 + ((roundedBmi - 25) / 4.9) * 25;
    } else {
      category = "Obese";
      colorClass = "text-red-600 dark:text-red-400";
      percentage = 75 + Math.min(((roundedBmi - 30) / 10) * 25, 25);
    }

    return {
      bmi: roundedBmi,
      category,
      colorClass,
      indicatorPosition: Math.min(Math.max(percentage, 0), 100),
    };
  }, [height, weight]);

  return (
    <section
      className="border-line bg-paper flex flex-col rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md"
      aria-label="Body Mass Index Calculator"
    >
      <div className="border-line mb-6 flex items-center gap-3 border-b pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          <Activity className="h-5 w-5" aria-hidden="true" />
        </div>
        <h2 className="text-ink text-xl font-bold">BMI Calculator</h2>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Height Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="bmi-height" className="text-muted text-sm font-semibold">
              Height (cm)
            </label>
            <div className="relative w-32">
              <div className="text-muted pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Ruler className="h-4 w-4" />
              </div>
              <input
                id="bmi-height"
                type="number"
                min="100"
                max="250"
                step="1"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="border-line bg-soft text-ink focus:border-brand-accent focus:ring-brand-accent/20 block w-full rounded-lg border p-2 pl-9 text-right text-sm font-bold focus:ring-2 focus:outline-none"
              />
            </div>
          </div>
          <input
            type="range"
            min="100"
            max="250"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="bg-line h-2 w-full cursor-pointer appearance-none rounded-lg accent-blue-600 dark:accent-blue-400"
            aria-hidden="true"
          />
        </div>

        {/* Weight Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="bmi-weight" className="text-muted text-sm font-semibold">
              Weight (kg)
            </label>
            <div className="relative w-32">
              <div className="text-muted pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Weight className="h-4 w-4" />
              </div>
              <input
                id="bmi-weight"
                type="number"
                min="20"
                max="200"
                step="1"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="border-line bg-soft text-ink focus:border-brand-accent focus:ring-brand-accent/20 block w-full rounded-lg border p-2 pl-9 text-right text-sm font-bold focus:ring-2 focus:outline-none"
              />
            </div>
          </div>
          <input
            type="range"
            min="20"
            max="200"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="bg-line h-2 w-full cursor-pointer appearance-none rounded-lg accent-blue-600 dark:accent-blue-400"
            aria-hidden="true"
          />
        </div>
      </form>

      {/* Results Section */}
      <div className="bg-soft border-line mt-8 rounded-xl border p-5" aria-live="polite" aria-atomic="true">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-muted text-sm">Your BMI Score</p>
            <p className={`mt-1 text-3xl font-black ${colorClass}`}>{bmi > 0 ? bmi : "--"}</p>
          </div>
          <div className="text-right">
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase ${colorClass} bg-paper shadow-sm`}
            >
              {category}
            </span>
          </div>
        </div>

        {/* Visual Indicator Bar */}
        {bmi > 0 && (
          <div className="mt-6">
            <div className="relative flex h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-1/4 bg-amber-400"></div>
              <div className="h-full w-1/4 bg-green-500"></div>
              <div className="h-full w-1/4 bg-orange-500"></div>
              <div className="h-full w-1/4 bg-red-600"></div>
            </div>
            <div
              className="relative -mt-3 h-4 w-4 rounded-full border-2 border-white bg-slate-900 shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-white"
              style={{ left: `calc(${indicatorPosition}% - 8px)` }}
              aria-hidden="true"
            />
            <div className="text-muted mt-2 flex justify-between text-[10px] uppercase">
              <span>Under</span>
              <span>Normal</span>
              <span>Over</span>
              <span>Obese</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
