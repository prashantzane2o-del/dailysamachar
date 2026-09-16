import Image from "next/image";
import { CheckCircle2, Clock3, Headphones, Eye } from "lucide-react";
import type { Article, Author } from "@/types/news";
import { Container, Section, SidebarLayout } from "@/components/layout/layout";
import { Badge, Chip } from "@/shared/ui/legacy-primitives";
import { FeatureCard, TrendingCard } from "@/components/cards/card-system";
import { AdPlaceholder, NewsletterCard, ShareButtons } from "@/components/widgets/widgets";

export function ArticlePage({ article, author, related }: { article: Article; author?: Author; related: Article[] }) {
  const content =
    typeof article.content === "string"
      ? [{ type: "paragraph" as const, value: article.content }]
      : (article.content ?? [
          {
            type: "paragraph" as const,
            value: article.excerpt ?? "Reporting and analysis from the DailySamachar newsroom.",
          },
        ]);
  return (
    <>
      <section className="border-line border-b">
        <Container className="max-w-5xl py-10 sm:py-16">
          <div className="mx-auto max-w-4xl">
            <Badge>{article.category}</Badge>
            <h1 className="editorial mt-4 text-4xl leading-[.98] font-bold tracking-tight sm:text-6xl">
              {article.title}
            </h1>
            <p className="text-muted mt-5 max-w-3xl text-lg leading-8">{article.excerpt}</p>
            <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-y py-4">
              <div className="flex items-center gap-3">
                <div>
                  {author && <Image src={author.avatar} alt="" width={42} height={42} className="rounded-full" />}
                </div>
                <div>
                  <p className="flex items-center gap-1 text-sm font-bold">
                    {article.author}
                    <CheckCircle2 size={14} className="text-signal" />
                  </p>
                  <p className="text-muted text-xs">
                    {article.publishedAt} · Updated {article.updatedAt ?? article.publishedAt}
                  </p>
                </div>
              </div>
              <div className="text-muted flex gap-4 text-xs font-bold">
                <span className="flex items-center gap-1">
                  <Clock3 size={14} />
                  {article.readTime}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={14} />
                  {article.views ?? "—"}
                </span>
                <span className="flex items-center gap-1">
                  <Headphones size={14} />4 min listen
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <Container className="py-8">
        <div className="relative mx-auto max-w-6xl">
          <div className="relative aspect-video overflow-hidden rounded-2xl">
            <Image
              src={article.image}
              alt=""
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1100px"
              className="bg-black object-contain sm:object-cover"
            />
          </div>
          <p className="text-muted mt-2 text-xs">{article.caption}</p>
        </div>
      </Container>
      <Section>
        <Container>
          <SidebarLayout
            sidebar={
              <div className="space-y-6">
                <ShareButtons />
                <AdPlaceholder />
                <div>
                  <p className="kicker">Trending</p>
                  {related.map((story, index) => (
                    <TrendingCard key={story.id} rank={index + 1} article={story} />
                  ))}
                </div>
              </div>
            }
          >
            <article className="mx-auto max-w-2xl">
              <div className="border-signal bg-soft mb-8 rounded-xl border-l-2 p-5">
                <p className="text-signal text-xs font-bold">IN BRIEF</p>
                <p className="mt-2 text-sm leading-6">{article.excerpt}</p>
              </div>
              {content.map((block, index) => {
                if (block.type === "heading")
                  return (
                    <h2 key={index} className="editorial mt-10 text-3xl font-bold">
                      {block.value}
                    </h2>
                  );
                if (block.type === "quote")
                  return (
                    <blockquote
                      key={index}
                      className="editorial border-signal my-9 border-l-2 pl-5 text-3xl leading-tight font-medium"
                    >
                      “{block.value}”
                    </blockquote>
                  );
                return (
                  <p key={index} className="mt-6 text-[1.08rem] leading-8 text-slate-700">
                    {block.value}
                  </p>
                );
              })}
              <AdPlaceholder label="Advertisement · Article" />
              <div className="mt-10 rounded-xl border p-5">
                <p className="kicker">Fact check</p>
                <p className="mt-2 text-sm leading-6">
                  Claims in this report were reviewed against official public records and interviews with named sources.
                </p>
              </div>
              <div className="mt-10">
                <p className="kicker">Sources & references</p>
                <ol className="text-muted mt-3 list-decimal space-y-2 pl-5 text-sm">
                  <li>Publicly available government and civic data.</li>
                  <li>Interviews conducted by DailySamachar reporters.</li>
                </ol>
              </div>
              <div className="mt-10 flex flex-wrap gap-2">
                {article.tags?.map((tag) => (
                  <Chip key={tag}>{tag}</Chip>
                ))}
              </div>
              {author && (
                <div className="bg-soft mt-10 rounded-2xl p-6">
                  <div className="flex gap-4">
                    <Image
                      src={author.avatar}
                      alt=""
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold">{author.name}</p>
                      <p className="text-muted text-xs">{author.role}</p>
                      <p className="mt-2 text-sm leading-6">{author.bio}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-10">
                <NewsletterCard />
              </div>
            </article>
          </SidebarLayout>
        </Container>
      </Section>
      <Section className="border-line bg-soft border-t">
        <Container>
          <h2 className="editorial text-3xl font-bold">Continue reading</h2>
          <div className="mt-6 grid gap-7 md:grid-cols-3">
            {related.map((story) => (
              <FeatureCard key={story.id} article={story} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
