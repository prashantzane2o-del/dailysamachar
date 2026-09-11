import type { Metadata } from "next";
import { StaticPage } from "@/features/home/components/static-page";

// 1. ADDED: SEO Metadata for static policy pages (Architecture SEO Standards)
export const metadata: Metadata = {
  title: "Advertise With Us | DailySamachar",
  description:
    "Partner with DailySamachar. We create clear, respectful advertising opportunities for brands that value quality journalism.",
  alternates: {
    canonical: "/advertise",
  },
  openGraph: {
    title: "Advertise With Us | DailySamachar",
    description: "Clear, respectful advertising opportunities.",
    type: "website",
  },
};

export default function AdvertisePage() {
  return (
    <StaticPage eyebrow="Partnerships" title="Advertising with integrity.">
      {/* 2. Added proper semantic prose classes for accessibility and readability */}
      <div className="prose prose-slate text-muted max-w-none" aria-label="Advertising information">
        <p className="text-lg leading-relaxed">
          We create clear, respectful advertising opportunities for brands that value quality journalism and attentive
          audiences. Editorial and advertising operations remain strictly separate.
        </p>
        <p className="mt-4 text-lg leading-relaxed">
          For our media kit and partnership inquiries, please contact{" "}
          <a
            href="mailto:partnerships@dailysamachar.in"
            className="text-signal decoration-signal/30 hover:decoration-signal focus:ring-signal rounded-sm font-semibold underline underline-offset-4 transition focus:ring-2 focus:outline-none"
          >
            partnerships@dailysamachar.in
          </a>
          .
        </p>
      </div>
    </StaticPage>
  );
}
