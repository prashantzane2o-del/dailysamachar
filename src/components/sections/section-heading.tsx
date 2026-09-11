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
    <div className="border-ink mb-6 flex items-baseline justify-between border-t-2 pt-3">
      <h2 className="editorial text-2xl font-bold tracking-tight">{title}</h2>
      <Link href={href} className="text-signal text-xs font-bold hover:underline">
        {link} →
      </Link>
    </div>
  );
}
