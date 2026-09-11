"use client"; // Error components client-side hone zaroori hain

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  // Error logging (Aap ise Sentry ya DataDog par bhej sakte hain)
  useEffect(() => {
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    // role="alert" screen readers ko immediately announce karega ki kuch galat hua hai
    <section
      className="bg-soft flex min-h-[70vh] items-center justify-center px-4 py-12 sm:px-6"
      role="alert"
      aria-live="assertive"
      aria-labelledby="error-title"
    >
      <div className="w-full max-w-lg rounded-xl border-t-4 border-red-600 bg-white p-8 text-center shadow-lg md:p-12">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-8 w-8 text-red-600" aria-hidden="true" />
        </div>

        <h1 id="error-title" className="text-text-base mb-4 text-2xl font-extrabold tracking-tight md:text-3xl">
          Oops! Something went wrong
        </h1>

        <p className="text-text-muted mb-8 text-base leading-relaxed md:text-lg">
          We are having trouble loading this content right now. Our servers might be experiencing a temporary hiccup, or
          there could be a network issue.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {/* Retry Button */}
          <button
            onClick={() => reset()}
            className="bg-primary-900 hover:bg-primary-900/90 focus-visible:ring-focus-ring flex w-full items-center justify-center gap-2 rounded-md px-6 py-3 font-bold text-white transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 sm:w-auto"
            aria-label="Try loading the page again"
          >
            <RefreshCcw className="h-5 w-5" aria-hidden="true" />
            TRY AGAIN
          </button>

          {/* Safe Fallback Link */}
          <Link
            href="/"
            className="text-primary-900 border-primary-900 focus-visible:ring-focus-ring flex w-full items-center justify-center gap-2 rounded-md border-2 bg-white px-6 py-3 font-bold transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 sm:w-auto"
            aria-label="Return to the homepage"
          >
            <Home className="h-5 w-5" aria-hidden="true" />
            BACK TO HOME
          </Link>
        </div>

        {/* Technical details sirf dev mode mein dikhayein, production mein chhupayein taaki security breach na ho */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 overflow-auto rounded bg-gray-100 p-4 text-left font-mono text-xs text-red-800">
            <strong>Dev Error Details:</strong>
            <br />
            {error.message}
          </div>
        )}
      </div>
    </section>
  );
}
