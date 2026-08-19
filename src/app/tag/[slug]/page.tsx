import { articles } from "@/services/news/content";
import { Container, ContentGrid, Section } from "@/components/layout/layout";
import { FeatureCard } from "@/components/cards/card-system";
export default async function TagRoute({ params }: { params: Promise<{ slug: string }> }) { const tag = decodeURIComponent((await params).slug); const results = articles.filter(article => article.tags?.some(value => value.toLowerCase() === tag.toLowerCase())); return <Section><Container><p className="kicker">Topic</p><h1 className="editorial mt-2 text-4xl font-bold">{tag}</h1><ContentGrid className="mt-8">{results.map(article => <FeatureCard key={article.id} article={article}/>)}</ContentGrid></Container></Section>; }
