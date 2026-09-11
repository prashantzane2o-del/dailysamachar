// src/app/[locale]/not-found.tsx

import React from "react";
import Link from "next/link";
import { FileQuestion, Home, Search } from "lucide-react";

export default function NotFound() {
  // Note: Agar next-intl not-found page par setup nahi hai, toh aap direct strings bhi use kar sakte hain
  // Filhal hum yahan default English text de rahe hain as fallback

  return (
    // role="main" taaki screen readers ko directly main content mil jaye
    <section
      className="bg-paper flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center"
      aria-labelledby="not-found-title"
    >
      <div className="flex w-full max-w-xl flex-col items-center">
        {/* Decorative Accessible Icon */}
        <div className="bg-primary-100 mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full">
          <FileQuestion className="text-primary-900 h-12 w-12" aria-hidden="true" />
        </div>

        {/* AAA Requirement: Clear H1 heading */}
        <h1 id="not-found-title" className="text-primary-900 mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
          404 - Page Not Found
        </h1>

        <p className="text-text-muted mb-10 max-w-md text-lg leading-relaxed">
          We couldn&apos;t find the page you&apos;re looking for. It might have been removed, renamed, or doesn&apos;t
          exist.
        </p>

        {/* Action Buttons Container */}
        <div className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
          <Link
            href="/"
            className="bg-primary-900 hover:bg-primary-900/90 focus-visible:ring-focus-ring flex w-full items-center justify-center gap-2 rounded-md px-8 py-3.5 font-bold text-white transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 sm:w-auto"
            aria-label="Return to the homepage"
          >
            <Home className="h-5 w-5" aria-hidden="true" />
            BACK TO HOME
          </Link>

          <Link
            href="/search"
            className="text-primary-900 border-primary-900 focus-visible:ring-focus-ring flex w-full items-center justify-center gap-2 rounded-md border-2 bg-white px-8 py-3.5 font-bold transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 sm:w-auto"
            aria-label="Go to search page"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
            SEARCH NEWS
          </Link>
        </div>
      </div>
    </section>
  );
}
