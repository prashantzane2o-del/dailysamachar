// src/app/[locale]/loading.tsx

import React from "react";

export default function Loading() {
  return (
    // role="status" aur aria-live="polite" screen readers ko batate hain ki page load ho raha hai
    <div className="w-full" role="status" aria-live="polite" aria-atomic="true" aria-busy="true">
      {/* AAA Requirement: Screen Reader Only Loading Message */}
      <span className="sr-only">Loading latest news articles, please wait...</span>

      {/* Page Title Skeleton */}
      <div className="mb-8 border-b-2 border-gray-100 pb-2" aria-hidden="true">
        {/* motion-safe:animate-pulse ensure karta hai ki reduced-motion on hone par animation na chale */}
        <div className="h-10 w-48 rounded-md bg-gray-200 motion-safe:animate-pulse sm:w-64"></div>
      </div>

      {/* Grid of Skeleton Cards (NewsCard layout ki exact copy) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
        {/* Hum 6 skeleton cards dikhayenge kyunki homepage par 6 articles aate hain */}
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div
            key={index}
            className="relative flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm"
          >
            {/* Image Skeleton */}
            <div className="h-48 w-full bg-gray-200 motion-safe:animate-pulse sm:h-56"></div>

            {/* Content Skeleton */}
            <div className="flex flex-1 flex-col p-4">
              {/* Date & Category Skeleton */}
              <div className="mb-4 h-4 w-1/3 rounded-md bg-gray-200 motion-safe:animate-pulse"></div>

              {/* Title Skeleton (2 lines for large titles) */}
              <div className="mb-4 space-y-2">
                <div className="h-6 w-full rounded-md bg-gray-300 motion-safe:animate-pulse"></div>
                <div className="h-6 w-5/6 rounded-md bg-gray-300 motion-safe:animate-pulse"></div>
              </div>

              {/* Excerpt Skeleton (3 lines) */}
              <div className="mb-6 flex-1 space-y-2">
                <div className="h-4 w-full rounded-md bg-gray-200 motion-safe:animate-pulse"></div>
                <div className="h-4 w-full rounded-md bg-gray-200 motion-safe:animate-pulse"></div>
                <div className="h-4 w-4/5 rounded-md bg-gray-200 motion-safe:animate-pulse"></div>
              </div>

              {/* Fake Read More Button Skeleton */}
              <div className="bg-primary-100 mt-auto h-4 w-24 rounded-md motion-safe:animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
