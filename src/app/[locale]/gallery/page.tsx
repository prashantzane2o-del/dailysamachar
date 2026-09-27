import { cmsApi } from "@/shared/api/cms";
import { Container, Section } from "@/components/layout/layout";
import { GalleryGrid } from "@/features/gallery/components/gallery-grid";
export default async function Gallery() {
  const articles = await cmsApi.getArticlesByCategory("video", 1, 12);

  return (
    <Section>
      <Container>
        <p className="kicker">Photo stories</p>
        <h1 className="editorial mt-2 text-5xl font-bold">Gallery</h1>
        <div className="mt-8">
          {articles.length > 0 ? (
            <GalleryGrid articles={articles} />
          ) : (
            <p className="text-muted rounded-xl border border-dashed p-10 text-center">
              Photo stories are being prepared by our newsroom. Please check back soon.
            </p>
          )}
        </div>
      </Container>
    </Section>
  );
}
