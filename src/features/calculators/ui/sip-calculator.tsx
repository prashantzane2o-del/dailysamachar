"use client";

import { useState } from "react";

export function SipCalculator() {
  const [investment, setInvestment] = useState("5000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("10");
  const [result, setResult] = useState<{ invested: number; total: number } | null>(null);

  const calculateSIP = (e: React.FormEvent) => {
    e.preventDefault();
    const P = parseFloat(investment);
    const i = parseFloat(rate) / 100 / 12; // monthly interest rate
    const n = parseInt(years) * 12; // total months

    if (P > 0 && i > 0 && n > 0) {
      // Future Value formula for SIP
      const M = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      setResult({
        invested: P * n,
        total: Math.round(M),
      });
    }
  };

  return (
    <div className="rounded-xl border border-line bg-soft p-6">
      <h3 className="mb-4 text-xl font-bold text-ink">SIP Calculator</h3>
      <form onSubmit={calculateSIP} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-muted">Monthly Investment (₹)</label>
          <input type="number" value={investment} onChange={(e) => setInvestment(e.target.value)} className="w-full rounded-md border border-line bg-paper px-3 py-2 text-ink focus:border-signal focus:outline-none" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-muted">Return Rate (%)</label>
            <input type="number" step="any" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-md border border-line bg-paper px-3 py-2 text-ink focus:border-signal focus:outline-none" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-muted">Time (Years)</label>
            <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-md border border-line bg-paper px-3 py-2 text-ink focus:border-signal focus:outline-none" required />
          </div>
        </div>
        <button type="submit" className="w-full rounded-md bg-signal px-4 py-2 font-bold text-white transition-colors hover:bg-red-800">
          Calculate Returns
        </button>
      </form>

      {result !== null && (
        <div className="mt-6 space-y-2 rounded-md border border-line bg-paper p-4 text-center">
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-muted">Total Invested:</span>
            <span className="font-bold text-ink">₹{result.invested.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="font-semibold text-muted">Est. Value:</span>
            <span className="font-black text-green-600">₹{result.total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}
    </div>
  );
}