import { notFound } from "next/navigation";
import { AuthorPage } from "@/features/author/components/author-page";
import { getAuthorBySlug, getArticlesByAuthor } from "@/services/authors";
export default async function AuthorRoute({ params }: { params: Promise<{ slug: string }> }) { const slug = (await params).slug; const [author, articles] = await Promise.all([getAuthorBySlug(slug), getArticlesByAuthor(slug)]); if (!author) notFound(); return <AuthorPage author={author} articles={articles}/>; }
