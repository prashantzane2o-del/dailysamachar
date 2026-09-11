"use client";

import React, { useEffect } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Yahan tum Sentry ya DataDog jaisi error tracking service ko error bhej sakte ho
    console.error("Global Layout Crash:", error);
  }, [error]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50">
        <main
          className="flex min-h-screen w-full flex-col items-center justify-center p-6 text-center"
          role="alert"
          aria-live="assertive"
        >
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertOctagon
              className="h-10 w-10 text-red-600 dark:text-red-500"
              aria-hidden="true"
            />
          </div>

          <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
            Critical System Error
          </h1>
          
          <p className="mb-6 max-w-md text-slate-600 dark:text-slate-400">
            A fatal error occurred at the application root. Our engineering team has been notified. 
            Please try refreshing the page to recover.
          </p>

          {error.digest && (
            <p className="mb-8 font-mono text-sm text-slate-500 dark:text-slate-500">
              Error ID: {error.digest}
            </p>
          )}

          <button
            onClick={() => reset()}
            className="inline-flex h-11 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
            aria-label="Attempt to reload and recover from the error"
          >
            <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
            Try Again
          </button>
        </main>
      </body>
    </html>
  );
}