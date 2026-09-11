import { cmsApi } from "@/shared/api/cms";
import { Container, Section } from "@/components/layout/layout";
import { OpinionCard } from "@/components/cards/card-system";
export default async function Opinion() {
  const articles = await cmsApi.getLatestArticles(3);

  return (
    <Section>
      <Container>
        <p className="kicker">Ideas worth considering</p>
        <h1 className="editorial mt-2 text-5xl font-bold">Opinion</h1>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {articles.slice(0, 3).map((article) => (
            <OpinionCard key={article.id} article={article} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
