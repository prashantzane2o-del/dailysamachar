import Image from "next/image";
import { Camera, CirclePlay, Radio } from "lucide-react";
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
    <div className="text-muted grid h-full place-items-center">
      <span className="text-xs font-bold tracking-widest uppercase">DailySamachar</span>
    </div>
  );
}

export function FeatureCard({ article, size = "md" }: { article: Article; size?: CardSize }) {
  return (
    <article className="group">
      <Link href={"/news/" + article.slug} className="block">
        <div
          className={cn(
            "bg-soft relative overflow-hidden rounded-xl dark:bg-gray-900",
            size === "lg" ? "aspect-16/10" : "aspect-4/3",
          )}
        >
          <CmsImage
            src={article.image}
            alt={article.imageAlt || article.title}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="pt-4">
          <p className="kicker">{article.category}</p>
          <h3
            className={cn(
              "editorial text-ink group-hover:text-signal mt-2 leading-tight font-bold tracking-tight dark:text-gray-100",
              size === "lg" ? "text-3xl" : "text-xl",
            )}
          >
            <SanitizedHtml as="span" html={article.title} />
          </h3>
          <p className="text-muted mt-3 text-[11px] font-bold tracking-wider uppercase">
            {article.author} · {article.readTime || "—"}
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
    <article className="group border-line flex gap-4 border-b py-4 last:border-0 dark:border-gray-800">
      <Link
        href={"/news/" + article.slug}
        className={cn(
          "bg-soft relative shrink-0 overflow-hidden rounded-lg dark:bg-gray-900",
          compact ? "h-20 w-24" : "h-28 w-40",
        )}
        aria-label={article.title}
      >
        <CmsImage src={article.image} alt={article.imageAlt || article.title} sizes="160px" />
      </Link>
      <div className="min-w-0">
        <p className="kicker">{article.category}</p>
        <h3
          className={cn(
            "editorial text-ink group-hover:text-signal mt-1 leading-tight font-bold dark:text-gray-100",
            compact ? "text-base" : "text-xl",
          )}
        >
          <Link href={"/news/" + article.slug}>
            <SanitizedHtml as="span" html={article.title} />
          </Link>
        </h3>
        <p className="text-muted mt-2 text-[11px] font-bold tracking-wider uppercase">
          {article.publishedAt} · {article.readTime || "—"}
        </p>
      </div>
    </article>
  );
}

export const CompactCard = ({ article }: { article: Article }) => <HorizontalCard article={article} compact />;
export const SidebarCard = CompactCard;

export function BreakingCard({ article }: { article: Article }) {
  return (
    <article className="bg-ink rounded-xl p-5 text-white dark:bg-gray-900">
      <div className="flex items-center gap-2">
        <Radio size={14} className="text-red-400" />
        <Badge className="bg-red-500/20 text-red-300">LIVE</Badge>
      </div>
      <h3 className="editorial mt-3 text-xl leading-tight font-bold">
        <SanitizedHtml as="span" html={article.title} />
      </h3>
      <p className="mt-3 text-xs text-slate-400">Updated {article.publishedAt}</p>
    </article>
  );
}

export function VideoCard({ article }: { article: Article }) {
  const image = article.image;
  const category = article.category;
  const slug = article.slug;

  return (
    <article className="group">
      <Link href={"/news/" + slug} className="block">
        <div className="bg-soft relative aspect-video overflow-hidden rounded-xl dark:bg-gray-900">
          <CmsImage src={image} alt={article.title} sizes="(max-width: 768px) 100vw, 50vw" />
          <span className="absolute inset-0 grid place-items-center">
            <CirclePlay className="text-ink fill-white" size={45} />
          </span>
        </div>
        <p className="kicker mt-4">Video · {category}</p>
        <h3 className="editorial text-ink mt-1 text-xl leading-tight font-bold dark:text-gray-100">
          <SanitizedHtml as="span" html={article.title} />
        </h3>
      </Link>
    </article>
  );
}

export function OpinionCard({ article }: { article: Article }) {
  return (
    <article className="border-signal border-l-2 pl-4">
      <p className="kicker">Opinion</p>
      <h3 className="editorial text-ink mt-2 text-2xl leading-tight font-bold dark:text-gray-100">
        <SanitizedHtml as="span" html={article.title} />
      </h3>
      <div className="mt-4 flex items-center gap-2">
        <Avatar name={article.author} size="sm" />
        <p className="text-xs font-bold">{article.author}</p>
      </div>
    </article>
  );
}

export function LiveUpdateCard({ article }: { article: Article }) {
  return (
    <article className="border-line before:bg-signal relative border-l pl-5 before:absolute before:top-1 before:-left-1 before:h-2 before:w-2 before:rounded-full">
      <p className="text-signal text-xs font-bold">LIVE · {article.publishedAt}</p>
      <h3 className="editorial text-ink mt-1 text-lg font-bold dark:text-gray-100">
        <SanitizedHtml as="span" html={article.title} />
      </h3>
    </article>
  );
}

export function GalleryCard({ article }: { article: Article }) {
  return (
    <article className="group bg-ink relative aspect-4/5 overflow-hidden rounded-xl">
      <CmsImage
        src={article.image}
        alt={article.imageAlt || article.title}
        sizes="(max-width: 768px) 100vw, 25vw"
        className="opacity-80"
      />
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <Camera size={17} />
        <h3 className="editorial mt-2 text-xl leading-tight font-bold">
          <SanitizedHtml as="span" html={article.title} />
        </h3>
      </div>
    </article>
  );
}

export function AuthorCard({ name, role }: { name: string; role: string }) {
  return (
    <article className="border-line flex items-center gap-3 rounded-xl border p-4 dark:border-gray-800">
      <Avatar name={name} size="lg" />
      <div>
        <p className="font-bold">{name}</p>
        <p className="text-muted text-xs">{role}</p>
      </div>
    </article>
  );
}

export function CategoryCard({
  name,
  count,
  image,
  slug,
}: {
  name: string;
  count: string;
  image: string;
  slug?: string;
}) {
  return (
    <a
      href={slug ? `/category/${encodeURIComponent(slug)}` : "/search"}
      className="group bg-ink relative block aspect-3/2 overflow-hidden rounded-xl"
    >
      <CmsImage src={image} alt="" sizes="(max-width: 768px) 50vw, 20vw" className="opacity-65" />
      <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
        <p className="editorial text-xl font-bold">{name}</p>
        <p className="text-xs text-slate-200">{count} stories</p>
      </div>
    </a>
  );
}

export function TrendingCard({ rank, article }: { rank: number; article: Article }) {
  return (
    <article className="border-line flex gap-3 border-b py-4 dark:border-gray-800">
      <span className="editorial text-4xl font-bold text-slate-300">0{rank}</span>
      <div>
        <p className="kicker">{article.category}</p>
        <h3 className="editorial text-ink mt-1 text-lg leading-tight font-bold dark:text-gray-100">
          <SanitizedHtml as="span" html={article.title} />
        </h3>
      </div>
    </article>
  );
}

export const RelatedCard = CompactCard;
export function AdvertisementCard() {
  return (
    <div className="bg-soft text-muted grid min-h-52 place-items-center rounded-xl border border-dashed text-[10px] font-bold tracking-[.2em] uppercase">
      Advertisement
    </div>
  );
}
