import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { GripVertical, Plus, Trash2, FileText } from "lucide-react";
import { Title, Article } from "@/types/normative";
import { ArticleSection } from "./ArticleSection";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { useDroppable } from "@dnd-kit/core";

interface TitleSectionProps {
  title: Title;
  onUpdate: (title: Title) => void;
  onDelete: (id: string) => void;
}

export const TitleSection = ({
  title,
  onUpdate,
  onDelete,
}: TitleSectionProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: title.id });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: title.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const addArticle = () => {
    const newArticle: Article = {
      id: `a${Date.now()}`,
      number: `Art. ${title.articles.length + 1}`,
      content: "",
      literals: [],
      order: title.articles.length,
    };
    onUpdate({ ...title, articles: [...title.articles, newArticle] });
    toast.success("Artículo agregado");
  };

  return (
    <Card ref={(node) => {
      setNodeRef(node);
      setDroppableRef(node);
    }} style={style} className="ml-6 border-l-4 border-l-legal-title">
      <div className="bg-secondary/30 p-3">
        <div className="flex items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing touch-none"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </button>
          <Input
            value={title.name}
            onChange={(e) => onUpdate({ ...title, name: e.target.value })}
            className="flex-1 font-semibold bg-transparent border-none text-legal-title shadow-none focus-visible:ring-0"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(title.id)}
            className="hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <Button variant="outline" size="sm" onClick={addArticle}>
          <FileText className="mr-2 h-4 w-4" />
          Agregar Artículo
        </Button>

        {title.articles.map((article) => (
          <ArticleSection
            key={article.id}
            article={article}
            onUpdate={(updated) => {
              const updatedArticles = title.articles.map((a) =>
                a.id === updated.id ? updated : a
              );
              onUpdate({ ...title, articles: updatedArticles });
            }}
            onDelete={(id) => {
              onUpdate({
                ...title,
                articles: title.articles.filter((a) => a.id !== id),
              });
              toast.success("Artículo eliminado");
            }}
          />
        ))}
      </div>
    </Card>
  );
};
