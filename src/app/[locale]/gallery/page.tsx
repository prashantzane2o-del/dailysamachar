import { cmsApi } from "@/shared/api/cms";
import { Container, Section } from "@/components/layout/layout";
import { GalleryGrid } from "@/features/gallery/components/gallery-grid";
export default async function Gallery() {
  const articles = await cmsApi.getLatestArticles(10);

  return (
    <Section>
      <Container>
        <p className="kicker">Photo stories</p>
        <h1 className="editorial mt-2 text-5xl font-bold">Gallery</h1>
        <div className="mt-8">
          <GalleryGrid articles={[...articles, ...articles]} />
        </div>
      </Container>
    </Section>
  );
}
