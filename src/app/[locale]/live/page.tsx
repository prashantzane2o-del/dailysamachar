import { cmsApi } from "@/shared/api/cms";
import { Container, Section } from "@/components/layout/layout";
import { BreakingCard, LiveUpdateCard } from "@/components/cards/card-system";
export default async function Live() {
  const articles = await cmsApi.getArticlesByCategory("breaking", 1, 10);

  return (
    <Section>
      <Container className="max-w-4xl">
        <p className="kicker">Live desk</p>
        <h1 className="editorial mt-2 text-5xl font-bold">Live updates</h1>
        <p className="text-muted mt-3 text-sm">
          The live desk is monitored by our editors. New verified updates are added as events develop.
        </p>
        {articles.length > 0 ? (
          <>
            <div className="mt-8">
              <BreakingCard article={articles[0]} />
            </div>
            <div className="border-line mt-8 space-y-7 border-l pl-6">
              {articles.slice(1, 5).map((article) => (
                <LiveUpdateCard key={article.id} article={article} />
              ))}
            </div>
          </>
        ) : (
          <p className="text-muted mt-8 rounded-xl border border-dashed p-10 text-center">
            There are no live updates at the moment. Our editors will publish verified updates here as events develop.
          </p>
        )}
      </Container>
    </Section>
  );
}
