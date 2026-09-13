// src/features/calculators/ui/sip-calculator.tsx
"use client";

import { useState, useMemo } from "react";
import { IndianRupee, Percent, Calendar, PieChart } from "lucide-react";

export function SipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [timePeriod, setTimePeriod] = useState<number>(10);

  const results = useMemo(() => {
    const P = monthlyInvestment || 0;
    const i = (expectedReturn || 0) / 12 / 100;
    const n = (timePeriod || 0) * 12;

    const investedAmount = P * n;
    const futureValue = i === 0 ? investedAmount : Math.round(P * (((Math.pow(1 + i, n) - 1) / i) * (1 + i)));
    const estimatedReturns = futureValue - investedAmount;

    return { investedAmount, estimatedReturns, futureValue };
  }, [monthlyInvestment, expectedReturn, timePeriod]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  return (
    <section
      className="border-line bg-paper flex flex-col rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md"
      aria-label="SIP Return Calculator"
    >
      <div className="border-line mb-6 flex items-center gap-3 border-b pb-4">
        <div className="bg-brand-primary/10 text-brand-primary dark:bg-brand-accent/20 dark:text-brand-accent flex h-10 w-10 items-center justify-center rounded-full">
          <PieChart className="h-5 w-5" aria-hidden="true" />
        </div>
        <h2 className="text-ink text-xl font-bold">SIP Calculator</h2>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="sip-amount" className="text-muted text-sm font-semibold">
              Monthly Investment
            </label>
            <div className="relative w-32">
              <div className="text-muted pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <IndianRupee className="h-4 w-4" />
              </div>
              <input
                id="sip-amount"
                type="number"
                min="500"
                max="1000000"
                step="500"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="border-line bg-soft text-ink focus:border-brand-accent focus:ring-brand-accent/20 block w-full rounded-lg border p-2 pl-9 text-right text-sm font-bold focus:ring-2 focus:outline-none"
              />
            </div>
          </div>
          <input
            type="range"
            min="500"
            max="100000"
            step="500"
            value={monthlyInvestment}
            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
            className="bg-line accent-brand-accent h-2 w-full cursor-pointer appearance-none rounded-lg"
            aria-hidden="true"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="sip-return" className="text-muted text-sm font-semibold">
              Expected Return Rate (p.a)
            </label>
            <div className="relative w-32">
              <div className="text-muted pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <Percent className="h-4 w-4" />
              </div>
              <input
                id="sip-return"
                type="number"
                min="1"
                max="30"
                step="0.5"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="border-line bg-soft text-ink focus:border-brand-accent focus:ring-brand-accent/20 block w-full rounded-lg border p-2 pr-9 text-right text-sm font-bold focus:ring-2 focus:outline-none"
              />
            </div>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(Number(e.target.value))}
            className="bg-line accent-brand-accent h-2 w-full cursor-pointer appearance-none rounded-lg"
            aria-hidden="true"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="sip-time" className="text-muted text-sm font-semibold">
              Time Period (Years)
            </label>
            <div className="relative w-32">
              <div className="text-muted pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Calendar className="h-4 w-4" />
              </div>
              <input
                id="sip-time"
                type="number"
                min="1"
                max="40"
                step="1"
                value={timePeriod}
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className="border-line bg-soft text-ink focus:border-brand-accent focus:ring-brand-accent/20 block w-full rounded-lg border p-2 pl-9 text-right text-sm font-bold focus:ring-2 focus:outline-none"
              />
            </div>
          </div>
          <input
            type="range"
            min="1"
            max="40"
            step="1"
            value={timePeriod}
            onChange={(e) => setTimePeriod(Number(e.target.value))}
            className="bg-line accent-brand-accent h-2 w-full cursor-pointer appearance-none rounded-lg"
            aria-hidden="true"
          />
        </div>
      </form>

      <div className="bg-soft border-line mt-8 rounded-xl border p-5" aria-live="polite" aria-atomic="true">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Invested Amount</span>
            <span className="text-ink font-semibold">{formatCurrency(results.investedAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Est. Returns</span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              {formatCurrency(results.estimatedReturns)}
            </span>
          </div>
          <div className="border-line mt-4 flex items-center justify-between border-t pt-4">
            <span className="text-ink font-bold">Total Value</span>
            <span className="text-brand-primary dark:text-brand-accent text-xl font-black">
              {formatCurrency(results.futureValue)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
