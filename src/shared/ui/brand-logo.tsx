import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { cn } from '@/shared/lib/utils';

export interface BrandLogoProps {
  className?: string;
  noLink?: boolean;
}

export function BrandLogo({ className, noLink = false }: BrandLogoProps) {
  const wrapperClasses = cn(
    "relative flex items-center justify-center transition-colors duration-300",
    "dark:bg-white dark:px-3 dark:py-2 dark:rounded-xl dark:shadow-md",
    // Fix: !w-auto ko w-auto! kar diya gaya hai
    "h-16 sm:h-20 w-auto! min-w-[140px] sm:min-w-[160px]", 
    className
  );

  const LogoContent = (
    <div className={wrapperClasses}>
      <Image
        src="/Logo.svg"
        alt="Daily Samachar Official Logo"
        width={240}
        height={90}
        priority 
        // Fix: !w-auto ko w-auto! kar diya gaya hai
        className="object-contain h-full w-auto!" 
      />
    </div>
  );

  if (noLink) {
    return LogoContent;
  }

  return (
    <Link 
      href="/" 
      className="group inline-flex items-center rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-brand-accent transition-transform hover:scale-[1.02]"
      aria-label="Daily Samachar - Go to Homepage"
    >
      {LogoContent}
    </Link>
  );
}
