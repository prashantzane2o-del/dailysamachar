import type { Article } from "@/entities/article/model/types";
import { ArticleCard } from "@/entities/article/ui/article-card";

interface NewsGridWidgetProps {
  articles: Article[];
}

export function NewsGridWidget({ articles }: NewsGridWidgetProps) {
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}