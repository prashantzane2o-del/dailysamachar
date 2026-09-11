import Image from "next/image";
import type { Article, Author } from "@/types/news";
import { Container, ContentGrid, Section } from "@/components/layout/layout";
import { FeatureCard } from "@/components/cards/card-system";
import { Chip } from "@/shared/ui/legacy-primitives";
export function AuthorPage({ author, articles }: { author: Author; articles: Article[] }) {
  return (
    <>
      <section className="border-line bg-soft border-b">
        <Container className="flex flex-col gap-6 py-12 sm:flex-row sm:items-center">
          <Image src={author.avatar} alt="" width={128} height={128} className="h-28 w-28 rounded-full object-cover" />
          <div>
            <p className="kicker">{author.role}</p>
            <h1 className="editorial mt-2 text-4xl font-bold">{author.name}</h1>
            <p className="text-muted mt-3 max-w-2xl text-sm leading-6">{author.bio}</p>
            <div className="mt-4 flex gap-2">
              {author.expertise.map((expertise) => (
                <Chip key={expertise}>{expertise}</Chip>
              ))}
            </div>
          </div>
        </Container>
      </section>
      <Section>
        <Container>
          <h2 className="editorial text-3xl font-bold">Latest from {author.name.split(" ")[0]}</h2>
          <ContentGrid className="mt-7">
            {articles.map((article) => (
              <FeatureCard key={article.id} article={article} />
            ))}
          </ContentGrid>
        </Container>
      </Section>
    </>
  );
}
