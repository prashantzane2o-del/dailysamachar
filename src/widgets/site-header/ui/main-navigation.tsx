// src/widgets/site-header/ui/main-navigation.tsx
'use client';

import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/navigation';

interface MainNavigationProps {
  // Optional banaya aur default array pass kiya taaki map function crash na ho
  links?: Array<{ title: string; href: string }>; 
}

export function MainNavigation({ links = [] }: MainNavigationProps) {
  const pathname = usePathname();

  // Agar links khali hain, toh kuch bhi render mat karo (app crash hone se bachegi)
  if (!links || links.length === 0) {
    return null; 
  }

  return (
    <nav aria-label="Main Navigation">
      <ul className="flex items-center gap-x-6 lg:gap-x-8">
        {links.map((link) => {
          // Check if current route matches the link
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(`${link.href}/`));
          
          return (
            <li key={link.title}>
              <Link
                href={link.href}
                className={`
                  relative block py-2 text-[15px] font-bold uppercase tracking-wide transition-colors duration-200
                  outline-none focus-visible:ring-4 focus-visible:ring-brand-accent focus-visible:rounded-sm
                  ${
                    isActive
                      ? 'text-brand-accent border-b-2 border-brand-accent'
                      : 'text-ink hover:text-brand-accent dark:hover:text-brand-accent border-b-2 border-transparent'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}