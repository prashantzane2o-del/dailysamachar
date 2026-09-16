import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/utils";

export interface BrandLogoProps {
  className?: string;
  noLink?: boolean;
}

export function BrandLogo({ className, noLink = false }: BrandLogoProps) {
  const wrapperClasses = cn(
    "relative flex items-center justify-center transition-transform duration-300",
    // FIXED: Removed "dark:bg-white dark:px-3 dark:py-2 dark:rounded-xl dark:shadow-md" to make it transparent
    "h-14 w-auto min-w-24 sm:h-20 sm:min-w-[160px]",
    className,
  );

  const LogoContent = (
    <div className={wrapperClasses}>
      <Image
        src="/Logo.png"
        alt="Daily Samachar Official Logo"
        width={240}
        height={90}
        priority
        className="h-full w-auto object-contain"
      />
    </div>
  );

  if (noLink) {
    return LogoContent;
  }

  return (
    <Link
      href="/"
      className="group focus-visible:ring-brand-accent inline-flex items-center rounded-xl transition-transform outline-none hover:scale-[1.02] focus-visible:ring-4"
      aria-label="Daily Samachar - Go to Homepage"
    >
      {LogoContent}
    </Link>
  );
}
