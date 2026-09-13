// src/widgets/shared/ui/skeleton-loaders.tsx
import React from "react";

// --- Shared Base Skeletons ---

export const SkeletonBox: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-pulse rounded bg-gray-200 dark:bg-gray-800 ${className}`} />
); // <-- FIXED: Added missing );

export const SkeletonText: React.FC<{ className?: string; lines?: number }> = ({ className = "", lines = 1 }) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-800 ${
          i === lines - 1 && lines > 1 ? "w-2/3" : "w-full"
        }`}
      />
    ))}
  </div>
); // <-- FIXED: Added missing );

// --- Widget Specific Skeletons ---

export const HeroStorySkeleton: React.FC = () => {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8" aria-hidden="true">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Main Hero Article Skeleton */}
        <div className="flex flex-col lg:col-span-8">
          <SkeletonBox className="aspect-video w-full rounded-xl md:aspect-video" />
          <div className="mt-6 flex grow flex-col">
            <SkeletonText lines={2} className="mb-4 h-10 w-full md:h-12" />
            <SkeletonText lines={3} className="mt-4" />
            <div className="mt-6 flex items-center gap-4">
              <SkeletonBox className="h-4 w-24" />
              <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" />
              <SkeletonBox className="h-4 w-20" />
            </div>
          </div>
        </div>

        {/* Side Articles Skeleton */}
        <div className="flex flex-col justify-between space-y-6 lg:col-span-4">
          <div className="flex items-center justify-between border-b-2 border-gray-200 pb-2 dark:border-gray-800">
            <SkeletonBox className="h-6 w-32" />
            <SkeletonBox className="h-4 w-16" />
          </div>
          <div className="flex grow flex-col gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-start gap-4">
                <SkeletonBox className="h-20 w-28 shrink-0 rounded-lg md:h-24 md:w-32" />
                <div className="flex h-full w-full flex-col justify-center gap-2">
                  <SkeletonBox className="h-3 w-16" />
                  <SkeletonText lines={2} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}; // <-- FIXED: Added missing };

export const NewsGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <section
      className="mx-auto w-full max-w-7xl border-t border-gray-200 px-4 py-12 sm:px-6 lg:px-8 dark:border-gray-800"
      aria-hidden="true"
    >
      <div className="mb-8 flex items-center justify-between">
        <SkeletonBox className="h-8 w-48" />
        <SkeletonBox className="h-4 w-20" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 xl:gap-8">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex h-full flex-col">
            <SkeletonBox className="mb-4 aspect-4/3 w-full rounded-xl" />
            <div className="flex grow flex-col">
              <SkeletonText lines={2} className="mb-2" />
              <SkeletonText lines={2} className="mt-2 opacity-60" />
              <div className="mt-auto flex items-center justify-between pt-4">
                <SkeletonBox className="h-3 w-24" />
                <SkeletonBox className="h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
