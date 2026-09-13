"use client";

import { useState, useMemo } from "react";
import { Flame, User, Ruler, Weight, Activity } from "lucide-react";

type Gender = "male" | "female";
type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "extreme";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, { label: string; mult: number }> = {
  sedentary: { label: "Sedentary (Little or no exercise)", mult: 1.2 },
  light: { label: "Lightly active (1-3 days/week)", mult: 1.375 },
  moderate: { label: "Moderately active (3-5 days/week)", mult: 1.55 },
  active: { label: "Active (6-7 days/week)", mult: 1.725 },
  extreme: { label: "Very active (Hard exercise & physical job)", mult: 1.9 },
};

export function BmrCalculator() {
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState<number>(25);
  const [weight, setWeight] = useState<number>(70); // kg
  const [height, setHeight] = useState<number>(175); // cm
  const [activity, setActivity] = useState<ActivityLevel>("moderate");

  // Calculate BMR (Mifflin-St Jeor Equation) & TDEE
  const { bmr, tdee } = useMemo(() => {
    if (!age || !weight || !height) return { bmr: 0, tdee: 0 };

    // BMR Formula
    let baseBmr = 10 * weight + 6.25 * height - 5 * age;
    baseBmr = gender === "male" ? baseBmr + 5 : baseBmr - 161;

    const roundedBmr = Math.round(baseBmr);
    const calculatedTdee = Math.round(roundedBmr * ACTIVITY_MULTIPLIERS[activity].mult);

    return {
      bmr: Math.max(0, roundedBmr),
      tdee: Math.max(0, calculatedTdee),
    };
  }, [gender, age, weight, height, activity]);

  return (
    <section
      className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-gray-900"
      aria-label="BMR and Calorie Calculator"
    >
      <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
          <Flame className="h-5 w-5" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-gray-100">BMR & Calorie Calculator</h2>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Gender Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Gender</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setGender("male")}
              className={`flex items-center justify-center gap-2 rounded-lg border p-2.5 text-sm font-bold transition-all ${
                gender === "male"
                  ? "border-brand-primary bg-brand-primary/10 text-brand-primary dark:border-brand-accent dark:bg-brand-accent/20 dark:text-brand-accent"
                  : "border-slate-300 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => setGender("female")}
              className={`flex items-center justify-center gap-2 rounded-lg border p-2.5 text-sm font-bold transition-all ${
                gender === "female"
                  ? "border-brand-primary bg-brand-primary/10 text-brand-primary dark:border-brand-accent dark:bg-brand-accent/20 dark:text-brand-accent"
                  : "border-slate-300 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              Female
            </button>
          </div>
        </div>

        {/* Age & Weight Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="bmr-age" className="text-xs font-semibold text-slate-700 dark:text-gray-300">
              Age (Years)
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <User className="h-4 w-4" />
              </div>
              <input
                id="bmr-age"
                type="number"
                min="10"
                max="100"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="focus:border-brand-primary block w-full rounded-lg border border-slate-300 bg-slate-50 p-2 pl-9 text-sm font-bold text-slate-900 focus:ring-2 focus:outline-none dark:border-slate-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="bmr-weight" className="text-xs font-semibold text-slate-700 dark:text-gray-300">
              Weight (kg)
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Weight className="h-4 w-4" />
              </div>
              <input
                id="bmr-weight"
                type="number"
                min="30"
                max="200"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="focus:border-brand-primary block w-full rounded-lg border border-slate-300 bg-slate-50 p-2 pl-9 text-sm font-bold text-slate-900 focus:ring-2 focus:outline-none dark:border-slate-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Height Input */}
        <div className="space-y-2">
          <label htmlFor="bmr-height" className="text-xs font-semibold text-slate-700 dark:text-gray-300">
            Height (cm)
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
              <Ruler className="h-4 w-4" />
            </div>
            <input
              id="bmr-height"
              type="number"
              min="100"
              max="250"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="focus:border-brand-primary block w-full rounded-lg border border-slate-300 bg-slate-50 p-2 pl-9 text-sm font-bold text-slate-900 focus:ring-2 focus:outline-none dark:border-slate-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Activity Level Dropdown */}
        <div className="space-y-2">
          <label htmlFor="bmr-activity" className="text-xs font-semibold text-slate-700 dark:text-gray-300">
            Activity Level
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
              <Activity className="h-4 w-4" />
            </div>
            <select
              id="bmr-activity"
              value={activity}
              onChange={(e) => setActivity(e.target.value as ActivityLevel)}
              className="focus:border-brand-primary block w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 pl-9 text-sm font-medium text-slate-900 focus:ring-2 focus:outline-none dark:border-slate-700 dark:bg-gray-800 dark:text-white"
            >
              {Object.entries(ACTIVITY_MULTIPLIERS).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>

      {/* Results Section */}
      <div className="mt-8 rounded-xl bg-slate-50 p-5 dark:bg-gray-950" aria-live="polite" aria-atomic="true">
        <div className="grid grid-cols-2 gap-4 divide-x divide-slate-200 dark:divide-slate-800">
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">BMR (Basal Rate)</p>
            <p className="mt-1 text-xl font-black text-slate-900 dark:text-gray-100">
              {bmr > 0 ? `${bmr} kcal` : "--"}
            </p>
          </div>
          <div className="pl-4">
            <p className="text-xs text-slate-600 dark:text-slate-400">Daily Calories (TDEE)</p>
            <p className="mt-1 text-xl font-black text-orange-600 dark:text-orange-400">
              {tdee > 0 ? `${tdee} kcal` : "--"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
