import type { Metadata } from "next";
import { StaticPage } from "@/features/home/components/static-page";

// 1. ADDED: SEO Metadata for static policy pages (Architecture SEO Standards)
export const metadata: Metadata = {
  title: "Terms of Use | DailySamachar",
  description: "Terms of use and copyright information for DailySamachar content and reporting.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Use | DailySamachar",
    description: "Terms of use and copyright information for DailySamachar.",
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <StaticPage eyebrow="Legal" title="Terms of use.">
      {/* 2. Added proper text styles and semantic spacing for readability */}
      <div className="prose prose-slate text-muted max-w-none" aria-label="Terms and conditions">
        <p className="text-lg leading-relaxed">
          DailySamachar content is protected by applicable copyright law. You may link to and share our reporting, but
          reproduction requires written permission except where law allows otherwise.
        </p>
        <p className="mt-4 text-lg leading-relaxed">
          We work to keep the service available and accurate, while acknowledging that reporting evolves as new facts
          are established.
        </p>
      </div>
    </StaticPage>
  );
}
