import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cmsApi } from "@/shared/api/cms";
import { FeatureCard } from "@/components/cards/card-system";
import { Container, ContentGrid, Section } from "@/components/layout/layout";

type TagRouteProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: TagRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await cmsApi.getTagBySlug(slug);
  return tag
    ? { title: tag.name + " News", description: "Latest " + tag.name + " coverage from DailySamachar." }
    : { title: "Topic not found" };
}

export default async function TagRoute({ params }: TagRouteProps) {
  const { slug } = await params;
  const tag = await cmsApi.getTagBySlug(slug);
  if (!tag) notFound();
  const articles = await cmsApi.getArticlesByTag(slug);

  return (
    <Section>
      <Container>
        <p className="kicker">Topic</p>
        <h1 className="editorial text-ink mt-2 text-4xl font-bold dark:text-gray-100">{tag.name}</h1>
        {articles.length === 0 ? (
          <p className="text-muted py-16 text-center text-lg">No articles found for this topic yet.</p>
        ) : (
          <ContentGrid className="mt-8">
            {articles.map((article) => (
              <FeatureCard key={article.id} article={article} />
            ))}
          </ContentGrid>
        )}
      </Container>
    </Section>
  );
}
