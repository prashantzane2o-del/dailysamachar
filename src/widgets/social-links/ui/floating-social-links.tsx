import { Facebook, Send, Twitter } from "lucide-react";

const SOCIAL_LINKS = [
  { label: "DailySamachar on Telegram", href: "https://t.me/Dailysamachar56", icon: Send, hover: "hover:bg-sky-500" },
  {
    label: "DailySamachar on Facebook",
    href: "https://www.facebook.com/profile.php?id=61590137490131",
    icon: Facebook,
    hover: "hover:bg-blue-600",
  },
  { label: "DailySamachar on X", href: "https://x.com/Dailysamachar56", icon: Twitter, hover: "hover:bg-slate-900" },
] as const;

export function FloatingSocialLinks() {
  return (
    <aside
      aria-label="DailySamachar social links"
      className="fixed top-1/2 left-3 z-30 hidden -translate-y-1/2 flex-col gap-2 rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-lg backdrop-blur sm:flex"
    >
      {SOCIAL_LINKS.map(({ label, href, icon: Icon, hover }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:outline-none ${hover}`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </a>
      ))}
    </aside>
  );
}
