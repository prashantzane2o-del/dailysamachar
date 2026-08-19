import Image from "next/image";
import type { Article } from "@/types/news";

export function NewsCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return <article className={`group ${featured ? "md:col-span-2" : ""}`}><a href="#story" className="block"><div className={`relative overflow-hidden rounded-xl bg-slate-200 ${featured ? "aspect-[16/9]" : "aspect-[4/3]"}`}><Image src={article.image} alt="" fill sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"} className="image-zoom object-cover"/></div><div className="pt-4"><p className="kicker">{article.category}</p><h3 className={`editorial mt-2 font-bold leading-[1.08] tracking-[-.025em] ${featured ? "text-3xl sm:text-4xl" : "text-xl"}`}>{article.title}</h3>{article.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{article.excerpt}</p>}<p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{article.author} <span className="mx-1">·</span> {article.publishedAt} <span className="mx-1">·</span> {article.readTime}</p></div></a></article>;
}
