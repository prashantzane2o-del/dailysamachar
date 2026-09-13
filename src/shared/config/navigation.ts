// src/shared/config/navigation.ts

export interface NavItem {
  title: string;
  href: string;
  isExternal?: boolean;
}

export interface FooterNavGroups {
  company: NavItem[];
  legal: NavItem[];
  social: NavItem[];
}

// Main Header Navigation
export const MAIN_NAVIGATION: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Politics", href: "/category/politics" },
  { title: "Markets", href: "/markets" },
  { title: "Sports", href: "/category/sports" },
  { title: "Opinion", href: "/opinion" },
  { title: "Live", href: "/live" },
  { title: "Weather", href: "/weather" },
  // ADDED: Tools & Calculators in main navigation for desktop & mobile sync
  { title: "Tools", href: "/tools" },
];

// Footer Navigation Grouped by Categories
export const FOOTER_NAVIGATION: FooterNavGroups = {
  company: [
    { title: "About Us", href: "/about" },
    { title: "Careers", href: "/careers" },
    { title: "Contact", href: "/contact" },
    { title: "Advertise", href: "/advertise" },
  ],
  legal: [
    { title: "Privacy Policy", href: "/privacy-policy" },
    { title: "Terms of Service", href: "/terms" },
    { title: "Editorial Policy", href: "/editorial-policy" },
    { title: "Corrections Policy", href: "/corrections-policy" },
    { title: "Fact Check", href: "/fact-check" },
  ],
  social: [
    { title: "Twitter", href: "https://twitter.com/dailysamachar", isExternal: true },
    { title: "YouTube", href: "https://youtube.com/dailysamachar", isExternal: true },
    { title: "Facebook", href: "https://facebook.com/dailysamachar", isExternal: true },
  ],
};
