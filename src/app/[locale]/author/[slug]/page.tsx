import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAuthorBySlug, getArticlesByAuthor } from "@/services/authors";
import { AuthorPage } from "@/features/author/components/author-page";

type AuthorRouteProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: AuthorRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  return author ? { title: author.name, description: author.bio || "Stories by " + author.name } : { title: "Author not found" };
}

export default async function AuthorRoute({ params }: AuthorRouteProps) {
  const { slug } = await params;
  const [author, articles] = await Promise.all([getAuthorBySlug(slug), getArticlesByAuthor(slug)]);
  if (!author) notFound();
  return <AuthorPage author={author} articles={articles} />;
}
