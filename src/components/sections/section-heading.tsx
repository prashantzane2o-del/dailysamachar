import Link from "next/link";

export function SectionHeading({
  title,
  link = "View all",
  href = "/search",
}: {
  title: string;
  link?: string;
  href?: string;
}) {
  return (
    <div className="border-line mb-6 flex items-center justify-between border-b pb-3">
      <h2 className="editorial flex items-center gap-3 text-2xl font-bold tracking-tight">
        <span className="bg-signal h-5 w-1.5" aria-hidden="true" />{title}
      </h2>
      <Link href={href} className="text-signal hover:text-ink inline-flex items-center gap-1 text-xs font-bold uppercase transition-colors">
        {link} <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
