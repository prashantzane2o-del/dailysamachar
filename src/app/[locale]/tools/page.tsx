// src/app/[locale]/tools/page.tsx
import type { Metadata } from "next";
import { Container, Section } from "@/components/layout/layout";
import { BmiCalculator } from "@/features/calculators/ui/bmi-calculator";
import { BmrCalculator } from "@/features/calculators/ui/bmr-calculator";
import { SipCalculator } from "@/features/calculators/ui/sip-calculator";

export const metadata: Metadata = {
  title: "Tools & Calculators | DailySamachar",
  description: "Free online SIP, BMI, and BMR calculators to plan your finances and health.",
};

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <Section>
        <Container>
          <div className="mb-10 text-center">
            <p className="text-signal text-sm font-bold tracking-widest uppercase">Utilities</p>
            <h1 className="editorial mt-3 text-4xl font-bold tracking-tight md:text-5xl dark:text-gray-100">
              Tools & Calculators
            </h1>
            <p className="text-muted mt-4 text-lg">
              Calculate your health metrics and financial goals instantly.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <SipCalculator />
            <BmiCalculator />
            <BmrCalculator />
          </div>
        </Container>
      </Section>
    </main>
  );
}