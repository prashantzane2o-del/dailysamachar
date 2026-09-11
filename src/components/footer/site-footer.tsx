import { Facebook, Twitter, Youtube, type LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { FOOTER_NAVIGATION } from "@/shared/config/navigation";
import { BrandLogo } from "@/shared/ui/brand-logo";

const socialIcons: Record<string, LucideIcon> = {
  Twitter,
  YouTube: Youtube,
  Facebook,
};

const footerLinks = [...FOOTER_NAVIGATION.company, ...FOOTER_NAVIGATION.legal];

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer aria-labelledby="footer-heading" className="bg-ink mt-20 text-white">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.3fr_.7fr_.9fr]">
          <div>
            <Link href="/" className="inline-block rounded-xl focus-visible:ring-2 focus-visible:ring-red-400">
              <BrandLogo noLink className="h-auto w-64 max-w-full" />
            </Link>
            <h2 id="footer-heading" className="sr-only">
              DailySamachar.org
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              सच खबर, सही दिशा — independent journalism for an India in motion. Clear, factual, and always worth your
              time.
            </p>
            <div className="mt-6 flex gap-3" aria-label="Social media">
              {FOOTER_NAVIGATION.social.map(({ title, href, isExternal }) => {
                const Icon = socialIcons[title];
                return (
                  <a
                    href={href}
                    aria-label={title}
                    key={title}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="rounded-full border border-slate-700 p-2 hover:border-red-400 hover:text-red-400"
                  >
                    {Icon && <Icon size={16} aria-hidden="true" />}
                  </a>
                );
              })}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest text-red-400">INFORMATION</p>
            <nav aria-label="Footer" className="mt-4 grid gap-2">
              {footerLinks.map(({ title, href }) => (
                <Link className="text-sm text-slate-300 hover:text-white" href={href} key={href}>
                  {title}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest text-red-400">THE DAILY BRIEF</p>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Your calm, curated read of what matters. In your inbox every morning.
            </p>
            <Link
              href="/newsletters"
              className="bg-signal mt-4 inline-flex rounded-lg px-4 py-2 text-sm font-bold text-white transition hover:bg-red-800"
            >
              Join the Daily Brief
            </Link>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-700 pt-5 text-xs text-slate-500">
          © {currentYear} DailySamachar Media. Made for the curious.
        </div>
      </div>
    </footer>
  );
}
