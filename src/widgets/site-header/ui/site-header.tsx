// src/widgets/site-header/ui/site-header.tsx
import { Link } from '@/i18n/navigation';
import { BrandLogo } from '@/shared/ui/brand-logo';
import { TopUtilityBar } from './top-utility-bar';
import { MainNavigation } from './main-navigation';
import { SearchTrigger } from './search-trigger';
import { MobileMenuTrigger } from './mobile-menu-trigger';
import { ThemeToggle } from '@/features/theme/ui/theme-toggle';
import { LanguageSwitcher } from '@/features/i18n/ui/language-switcher';
import { MAIN_NAVIGATION } from '@/shared/config/navigation';

export function SiteHeader() {
  return (
    <header 
      className="sticky top-0 z-40 w-full border-b-4 border-brand-accent bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 shadow-sm transition-colors duration-300"
      aria-label="Main Site Header"
    >
      {/* Top Utility Bar (Date, e-Paper, Live etc.) */}
      <TopUtilityBar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between gap-4 md:h-20">
          
          {/* Left Side: Mobile Menu Hamburger & Logo */}
          <div className="flex items-center gap-3 md:gap-6">
            <div className="block lg:hidden">
              <MobileMenuTrigger>
                {MAIN_NAVIGATION.map((nav) => (
                  <Link 
                    key={nav.href}
                    href={nav.href} 
                    className="block px-4 py-3 text-lg font-bold text-ink hover:bg-soft rounded-md transition-colors"
                  >
                    {nav.title}
                  </Link>
                ))}
              </MobileMenuTrigger>
            </div>
            
            <div className="shrink-0 flex items-center">
              <BrandLogo />
            </div>
          </div>

          {/* Middle: Desktop Main Navigation (Categories) */}
          <div className="hidden lg:flex flex-1 justify-center px-6">
            <MainNavigation />
          </div>

          {/* Right Side: Toggles & Search */}
          <div className="flex items-center justify-end gap-2 md:gap-4 shrink-0">
            <div className="hidden sm:flex items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
            <SearchTrigger />
          </div>
          
        </div>
      </div>
    </header>
  );
}