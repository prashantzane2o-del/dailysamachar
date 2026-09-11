// src/components/draft-banner.tsx
import { draftMode } from "next/headers";
import Link from "next/link";

export async function DraftBanner() {
  // Check if Next.js draft mode is enabled
  const draft = await draftMode();

  if (!draft.isEnabled) {
    return null; // Agar normal user hai toh banner hide rahega
  }

  return (
    <div 
      // Tailwind CSS v4 fix: changed z-[9999] to z-9999
      className="fixed right-0 bottom-0 left-0 z-9999 flex w-full items-center justify-center gap-4 border-t-2 border-amber-700 bg-amber-500 px-4 py-3 text-black shadow-lg"
      role="alert"
      aria-live="polite"
    >
      <span className="text-sm font-medium md:text-base">
          <strong>Preview Mode Active:</strong> You are viewing unpublished or draft content.
      </span>
      <Link
        href="/api/disable-draft"
        className="rounded bg-black px-4 py-2 text-sm font-semibold text-white shadow transition-colors hover:bg-gray-800"
        prefetch={false} // Prevents Next.js from prefetching and accidentally disabling draft mode
      >
        Exit Preview
      </Link>
    </div>
  );
}