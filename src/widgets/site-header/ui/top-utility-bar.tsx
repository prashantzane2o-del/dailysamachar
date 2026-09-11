'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';

export function TopUtilityBar() {
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    // Client-side date formatting to prevent Next.js hydration mismatch errors
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    // Format according to Indian locale
    setCurrentDate(date.toLocaleDateString('en-IN', options));
  }, []);

  // Theme Sync: Background ko Deep Navy Blue (brand-primary) diya hai.
  // Text ko off-white (gray-200) rakha hai taaki AAA Contrast ratio maintain rahe.
  return (
    <div className="bg-brand-primary text-gray-200 py-1.5 px-4 text-[13px] font-medium tracking-wide">
      <div className="container mx-auto flex items-center justify-between">
        
        {/* Left Side: Live Indicator & Date */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2" aria-live="polite">
            {/* Red pulsing dot to give a "News/Live" feel */}
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" aria-hidden="true"></span>
            <span className="sr-only">Current Date: </span>
            {currentDate || 'Loading...'}
          </span>
        </div>

        {/* Right Side: Logo Tagline & Utility Links (Hidden on very small screens) */}
        <div className="hidden sm:flex items-center gap-4 lg:gap-6">
          
          {/* Logo Tagline using the Devanagari font we set in Step 2 */}
          <span className="font-devanagari text-gray-300">
            सही खबर, सबके लिए
          </span>
          
          {/* Visual Separator */}
          <div className="h-3 w-px bg-gray-600" aria-hidden="true"></div>
          
          <Link 
            href="/epaper" 
            className="hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-1 focus-visible:ring-offset-brand-primary focus-visible:rounded-sm transition-colors"
          >
            e-Paper
          </Link>
          
          <Link 
            href="/live" 
            className="flex items-center gap-1 text-white hover:text-brand-accent outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-1 focus-visible:ring-offset-brand-primary focus-visible:rounded-sm transition-colors"
          >
            <span className="w-2 h-2 rounded-sm bg-brand-accent inline-block" aria-hidden="true"></span>
            Watch Live
          </Link>

        </div>
      </div>
    </div>
  );
}