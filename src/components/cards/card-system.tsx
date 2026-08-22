import Image from "next/image";
import { Camera, CirclePlay, Radio } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Article } from "@/types/news";
import type { Article as DomainArticle } from "@/entities/article/model/types";
import { SanitizedHtml } from "@/shared/ui/sanitized-html";
import { cn } from "@/lib/utils";
import { Avatar, Badge } from "@/components/ui/primitives";

type CardSize = "sm" | "md" | "lg";

function CmsImage({ src, alt, className, sizes }: { src?: string; alt: string; className?: string; sizes: string }) {
  return src ? <Image src={src} alt={alt} fill sizes={sizes} className={cn("image-zoom object-cover", className)} /> : <div className="grid h-full place-items-center text-muted"><span className="text-xs font-bold uppercase tracking-widest">DailySamachar</span></div>;
}

export function FeatureCard({ article, size = "md" }: { article: Article; size?: CardSize }) {
  return (
    <article className="group">
      <Link href={"/news/" + article.slug} className="block">
        <div className={cn("relative overflow-hidden rounded-xl bg-soft dark:bg-gray-900", size === "lg" ? "aspect-[16/10]" : "aspect-[4/3]")}>
          <CmsImage src={article.image} alt={article.imageAlt || article.title} sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
        <div className="pt-4">
          <p className="kicker">{article.category}</p>
          <h3 className={cn("editorial mt-2 font-bold leading-tight tracking-tight text-ink group-hover:text-signal dark:text-gray-100", size === "lg" ? "text-3xl" : "text-xl")}><SanitizedHtml as="span" html={article.title} /></h3>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-muted">{article.author} · {article.readTime || "—"}</p>
        </div>
      </Link>
    </article>
  );
}

export const HeroCard = FeatureCard;
export const VerticalCard = FeatureCard;

export function HorizontalCard({ article, compact = false }: { article: Article; compact?: boolean }) {
  return (
    <article className="group flex gap-4 border-b border-line py-4 last:border-0 dark:border-gray-800">
      <Link href={"/news/" + article.slug} className={cn("relative shrink-0 overflow-hidden rounded-lg bg-soft dark:bg-gray-900", compact ? "h-20 w-24" : "h-28 w-40")} aria-label={article.title}>
        <CmsImage src={article.image} alt={article.imageAlt || article.title} sizes="160px" />
      </Link>
      <div className="min-w-0">
        <p className="kicker">{article.category}</p>
        <h3 className={cn("editorial mt-1 font-bold leading-tight text-ink group-hover:text-signal dark:text-gray-100", compact ? "text-base" : "text-xl")}><Link href={"/news/" + article.slug}><SanitizedHtml as="span" html={article.title} /></Link></h3>
        <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-muted">{article.publishedAt} · {article.readTime || "—"}</p>
      </div>
    </article>
  );
}

export const CompactCard = ({ article }: { article: Article }) => <HorizontalCard article={article} compact />;
export const SidebarCard = CompactCard;

export function BreakingCard({ article }: { article: Article }) {
  return <article className="rounded-xl bg-ink p-5 text-white dark:bg-gray-900"><div className="flex items-center gap-2"><Radio size={14} className="text-red-400" /><Badge className="bg-red-500/20 text-red-300">LIVE</Badge></div><h3 className="editorial mt-3 text-xl font-bold leading-tight"><SanitizedHtml as="span" html={article.title} /></h3><p className="mt-3 text-xs text-slate-400">Updated {article.publishedAt}</p></article>;
}

export function VideoCard({ article }: { article: Article | DomainArticle }) {
  const image = "image" in article ? article.image : article.featuredImage?.url;
  const category = typeof article.category === "string" ? article.category : article.category.name;
  const slug = article.slug;

  return (
    <article className="group">
      <Link href={"/news/" + slug} className="block">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-soft dark:bg-gray-900">
          <CmsImage src={image} alt={article.title} sizes="(max-width: 768px) 100vw, 50vw" />
          <span className="absolute inset-0 grid place-items-center"><CirclePlay className="fill-white text-ink" size={45} /></span>
        </div>
        <p className="kicker mt-4">Video · {category}</p>
        <h3 className="editorial mt-1 text-xl font-bold leading-tight text-ink dark:text-gray-100"><SanitizedHtml as="span" html={article.title} /></h3>
      </Link>
    </article>
  );
}

export function OpinionCard({ article }: { article: Article }) {
  return <article className="border-l-2 border-signal pl-4"><p className="kicker">Opinion</p><h3 className="editorial mt-2 text-2xl font-bold leading-tight text-ink dark:text-gray-100"><SanitizedHtml as="span" html={article.title} /></h3><div className="mt-4 flex items-center gap-2"><Avatar name={article.author} size="sm" /><p className="text-xs font-bold">{article.author}</p></div></article>;
}

export function LiveUpdateCard({ article }: { article: Article }) {
  return <article className="relative border-l border-line pl-5 before:absolute before:-left-1 before:top-1 before:h-2 before:w-2 before:rounded-full before:bg-signal"><p className="text-xs font-bold text-signal">LIVE · {article.publishedAt}</p><h3 className="editorial mt-1 text-lg font-bold text-ink dark:text-gray-100"><SanitizedHtml as="span" html={article.title} /></h3></article>;
}

export function GalleryCard({ article }: { article: Article }) {
  return <article className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-ink"><CmsImage src={article.image} alt={article.imageAlt || article.title} sizes="(max-width: 768px) 100vw, 25vw" className="opacity-80" /><div className="absolute inset-x-0 bottom-0 p-4 text-white"><Camera size={17} /><h3 className="editorial mt-2 text-xl font-bold leading-tight"><SanitizedHtml as="span" html={article.title} /></h3></div></article>;
}

export function AuthorCard({ name, role }: { name: string; role: string }) {
  return <article className="flex items-center gap-3 rounded-xl border border-line p-4 dark:border-gray-800"><Avatar name={name} size="lg" /><div><p className="font-bold">{name}</p><p className="text-xs text-muted">{role}</p></div></article>;
}

export function CategoryCard({ name, count, image }: { name: string; count: string; image: string }) {
  return <a href="#category" className="group relative block aspect-[3/2] overflow-hidden rounded-xl bg-ink"><CmsImage src={image} alt="" sizes="(max-width: 768px) 50vw, 20vw" className="opacity-65" /><div className="absolute inset-0 flex flex-col justify-end p-4 text-white"><p className="editorial text-xl font-bold">{name}</p><p className="text-xs text-slate-200">{count} stories</p></div></a>;
}

export function TrendingCard({ rank, article }: { rank: number; article: Article }) {
  return <article className="flex gap-3 border-b border-line py-4 dark:border-gray-800"><span className="editorial text-4xl font-bold text-slate-300">0{rank}</span><div><p className="kicker">{article.category}</p><h3 className="editorial mt-1 text-lg font-bold leading-tight text-ink dark:text-gray-100"><SanitizedHtml as="span" html={article.title} /></h3></div></article>;
}

export const RelatedCard = CompactCard;
export function AdvertisementCard() { return <div className="grid min-h-52 place-items-center rounded-xl border border-dashed bg-soft text-[10px] font-bold uppercase tracking-[.2em] text-muted">Advertisement</div>; }
