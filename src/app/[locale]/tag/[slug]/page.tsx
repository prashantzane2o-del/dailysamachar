import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cmsClient } from "@/shared/api/cms";
import { FeatureCard } from "@/components/cards/card-system";
import { Container, ContentGrid, Section } from "@/components/layout/layout";

type TagRouteProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: TagRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await cmsClient.getTagBySlug(slug);
  return tag ? { title: tag.name + " News", description: "Latest " + tag.name + " coverage from DailySamachar." } : { title: "Topic not found" };
}

export default async function TagRoute({ params }: TagRouteProps) {
  const { slug } = await params;
  const tag = await cmsClient.getTagBySlug(slug);
  if (!tag) notFound();
  const result = await cmsClient.getPostsByTag(slug);

  return (
    <Section>
      <Container>
        <p className="kicker">Topic</p>
        <h1 className="editorial mt-2 text-4xl font-bold text-ink dark:text-gray-100">{tag.name}</h1>
        {result.data.length === 0 ? (
          <p className="py-16 text-center text-lg text-muted">No articles found for this topic yet.</p>
        ) : (
          <ContentGrid className="mt-8">{result.data.map((article) => <FeatureCard key={article.id} article={article} />)}</ContentGrid>
        )}
      </Container>
    </Section>
  );
}
