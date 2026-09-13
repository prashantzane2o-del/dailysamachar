// src/components/cards/card-system.tsx
import Image from "next/image";
import { CirclePlay, Radio } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Article } from "@/types/news";
import { SanitizedHtml } from "@/shared/ui/sanitized-html";
import { cn } from "@/shared/lib/utils";
import { Avatar, Badge } from "@/shared/ui/legacy-primitives";

type CardSize = "sm" | "md" | "lg";

function CmsImage({ src, alt, className, sizes }: { src?: string; alt: string; className?: string; sizes: string }) {
  return src ? (
    <Image src={src} alt={alt} fill sizes={sizes} className={cn("image-zoom object-cover", className)} />
  ) : (
    <div className="text-muted bg-soft grid h-full place-items-center">
      <span className="text-xs font-bold tracking-widest uppercase">DailySamachar</span>
    </div>
  );
}

export function FeatureCard({ article, size = "md" }: { article: Article; size?: CardSize }) {
  return (
    <article className="group relative">
      <Link
        href={"/news/" + article.slug}
        className="focus-visible:ring-signal block outline-none focus-visible:rounded-xl focus-visible:ring-4"
        aria-label={`Read article: ${article.title}`}
      >
        <div
          className={cn("bg-soft relative overflow-hidden rounded-xl", size === "lg" ? "aspect-16/10" : "aspect-4/3")}
        >
          <CmsImage
            src={article.image}
            alt={article.imageAlt || article.title}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="pt-4">
          <p className="kicker text-muted">{article.category}</p>
          <h3
            className={cn(
              "editorial text-ink group-hover:text-signal mt-2 leading-tight font-bold tracking-tight transition-colors",
              size === "lg" ? "text-3xl" : "text-xl",
            )}
          >
            <SanitizedHtml as="span" html={article.title} />
          </h3>
          <p className="text-muted mt-3 text-[11px] font-bold tracking-wider uppercase">
            {article.author} • {article.readTime || "4 Min Read"}
          </p>
        </div>
      </Link>
    </article>
  );
}

export const HeroCard = FeatureCard;
export const VerticalCard = FeatureCard;

export function HorizontalCard({ article, compact = false }: { article: Article; compact?: boolean }) {
  return (
    <article className="group border-line flex gap-4 border-b py-4 last:border-0">
      {/* AAA FIX: Hide image link from screen readers to prevent redundant reading */}
      <Link
        href={"/news/" + article.slug}
        tabIndex={-1}
        aria-hidden="true"
        className={cn("bg-soft relative shrink-0 overflow-hidden rounded-lg", compact ? "h-20 w-24" : "h-28 w-40")}
      >
        <CmsImage src={article.image} alt="" sizes="160px" />
      </Link>
      <div className="flex min-w-0 flex-col">
        <p className="kicker text-muted">{article.category}</p>
        <h3
          className={cn(
            "editorial text-ink group-hover:text-signal mt-1 leading-tight font-bold transition-colors",
            compact ? "text-base" : "text-xl",
          )}
        >
          {/* Only title link is focusable and readable */}
          <Link
            href={"/news/" + article.slug}
            className="focus-visible:ring-signal rounded-sm outline-none focus-visible:ring-2"
          >
            <SanitizedHtml as="span" html={article.title} />
          </Link>
        </h3>
        <p className="text-muted mt-auto pt-2 text-[11px] font-bold tracking-wider uppercase">
          {article.publishedAt} • {article.readTime || "4 Min Read"}
        </p>
      </div>
    </article>
  );
}

export const CompactCard = ({ article }: { article: Article }) => <HorizontalCard article={article} compact />;
export const SidebarCard = CompactCard;
export const RelatedCard = CompactCard;

export function BreakingCard({ article }: { article: Article }) {
  return (
    <article className="bg-ink text-paper relative rounded-xl p-5">
      <Link
        href={"/news/" + article.slug}
        className="focus-visible:ring-signal absolute inset-0 z-10 rounded-xl outline-none focus-visible:ring-4"
      >
        <span className="sr-only">Read breaking news: {article.title}</span>
      </Link>
      <div className="flex items-center gap-2">
        <Radio size={14} className="text-signal" />
        <Badge className="bg-signal/20 text-signal border-signal/30">LIVE</Badge>
      </div>
      <h3 className="editorial hover:text-signal mt-3 text-xl leading-tight font-bold transition-colors">
        <SanitizedHtml as="span" html={article.title} />
      </h3>
      <p className="mt-3 text-xs opacity-70">Updated {article.publishedAt}</p>
    </article>
  );
}

export function VideoCard({ article }: { article: Article }) {
  return (
    <article className="group relative">
      <Link
        href={"/news/" + article.slug}
        className="focus-visible:ring-signal block rounded-xl outline-none focus-visible:ring-4"
        aria-label={`Watch video: ${article.title}`}
      >
        <div className="bg-soft relative aspect-video overflow-hidden rounded-xl">
          <CmsImage src={article.image} alt="" sizes="(max-width: 768px) 100vw, 50vw" />
          <span className="absolute inset-0 grid place-items-center bg-black/20 transition-colors group-hover:bg-black/10">
            <CirclePlay
              className="group-hover:fill-signal fill-black/50 text-white transition-colors"
              size={48}
              aria-hidden="true"
            />
          </span>
        </div>
        <p className="kicker text-muted mt-4">Video • {article.category}</p>
        <h3 className="editorial text-ink group-hover:text-signal mt-1 text-xl leading-tight font-bold transition-colors">
          <SanitizedHtml as="span" html={article.title} />
        </h3>
      </Link>
    </article>
  );
}

export function OpinionCard({ article }: { article: Article }) {
  return (
    <article className="border-signal group relative border-l-4 pl-4">
      <Link
        href={"/news/" + article.slug}
        className="focus-visible:ring-signal absolute inset-0 z-10 rounded-sm outline-none focus-visible:ring-4"
      >
        <span className="sr-only">
          Read opinion by {article.author}: {article.title}
        </span>
      </Link>
      <p className="kicker text-muted">Opinion</p>
      <h3 className="editorial text-ink group-hover:text-signal mt-2 text-2xl leading-tight font-bold transition-colors">
        <SanitizedHtml as="span" html={article.title} />
      </h3>
      <div className="mt-4 flex items-center gap-2">
        <Avatar name={article.author} size="sm" />
        <p className="text-muted text-xs font-bold">{article.author}</p>
      </div>
    </article>
  );
}

export function LiveUpdateCard({ article }: { article: Article }) {
  return (
    <article className="border-line before:bg-signal relative border-l pl-5 before:absolute before:top-1 before:-left-1 before:h-2 before:w-2 before:rounded-full">
      <p className="text-signal text-xs font-bold">LIVE • {article.publishedAt}</p>
      <h3 className="editorial text-ink mt-1 text-lg font-bold">
        <SanitizedHtml as="span" html={article.title} />
      </h3>
    </article>
  );
}

export function TrendingCard({ rank, article }: { rank: number; article: Article }) {
  return (
    <article className="border-line group relative flex gap-3 border-b py-4">
      <Link
        href={"/news/" + article.slug}
        className="focus-visible:ring-signal absolute inset-0 z-10 rounded-sm outline-none focus-visible:ring-4"
      >
        <span className="sr-only">
          Read trending article number {rank}: {article.title}
        </span>
      </Link>
      <div className="editorial text-muted text-4xl font-bold opacity-50">
        <span className="sr-only">Rank {rank}</span>
        <span aria-hidden="true">0{rank}</span>
      </div>
      <div className="pt-1">
        <p className="kicker text-muted">{article.category}</p>
        <h3 className="editorial text-ink group-hover:text-signal mt-1 text-lg leading-tight font-bold transition-colors">
          <SanitizedHtml as="span" html={article.title} />
        </h3>
      </div>
    </article>
  );
}
