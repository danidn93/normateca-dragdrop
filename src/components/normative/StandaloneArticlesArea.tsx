import { BookOpen } from "lucide-react";
import { Article } from "@/types/normative";
import { ArticleSection } from "./ArticleSection";
import { useDroppable } from "@dnd-kit/core";

interface StandaloneArticlesAreaProps {
  articles: Article[];
  onUpdate: (article: Article) => void;
  onDelete: (id: string) => void;
}

export const StandaloneArticlesArea = ({
  articles,
  onUpdate,
  onDelete,
}: StandaloneArticlesAreaProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: "standalone-articles-area",
  });

  return (
    <div
      ref={setNodeRef}
      className={`space-y-4 min-h-[100px] border-2 border-dashed rounded-lg p-4 transition-colors ${
        isOver ? "border-primary bg-primary/5" : "border-border"
      }`}
    >
      <h3 className="text-lg font-semibold text-legal-article flex items-center gap-2">
        <BookOpen className="h-5 w-5" />
        Artículos Independientes
      </h3>
      <div className="space-y-3">
        {articles.map((article) => (
          <ArticleSection
            key={article.id}
            article={article}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
        {articles.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Arrastra artículos aquí para hacerlos independientes
          </p>
        )}
      </div>
    </div>
  );
};
