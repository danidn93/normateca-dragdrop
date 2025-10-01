import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  GripVertical,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
  Heading2,
} from "lucide-react";
import { Chapter, Title, Article } from "@/types/normative";
import { TitleSection } from "./TitleSection";
import { ArticleSection } from "./ArticleSection";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { useDroppable } from "@dnd-kit/core";

interface ChapterSectionProps {
  chapter: Chapter;
  onUpdate: (chapter: Chapter) => void;
  onDelete: (id: string) => void;
}

export const ChapterSection = ({
  chapter,
  onUpdate,
  onDelete,
}: ChapterSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chapter.id });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: chapter.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const addTitle = () => {
    const newTitle: Title = {
      id: `t${Date.now()}`,
      name: "NUEVO TÍTULO",
      articles: [],
      order: chapter.titles.length,
    };
    onUpdate({ ...chapter, titles: [...chapter.titles, newTitle] });
    toast.success("Título agregado");
  };

  const addArticle = () => {
    const newArticle: Article = {
      id: `a${Date.now()}`,
      number: `Art. ${chapter.articles.length + 1}`,
      content: "",
      literals: [],
      order: chapter.articles.length,
    };
    onUpdate({ ...chapter, articles: [...chapter.articles, newArticle] });
    toast.success("Artículo agregado");
  };

  return (
    <Card ref={(node) => {
      setNodeRef(node);
      setDroppableRef(node);
    }} style={style} className="overflow-hidden">
      {/* Chapter Header */}
      <div className="bg-gradient-header p-4">
        <div className="flex items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing touch-none"
          >
            <GripVertical className="h-5 w-5 text-primary-foreground/70" />
          </button>
          <Input
            value={chapter.name}
            onChange={(e) => onUpdate({ ...chapter, name: e.target.value })}
            className="flex-1 text-lg font-bold bg-transparent border-none text-primary-foreground placeholder:text-primary-foreground/70 shadow-none focus-visible:ring-0"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(chapter.id)}
            className="text-primary-foreground hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Chapter Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={addTitle}>
              <Heading2 className="mr-2 h-4 w-4" />
              Agregar Título
            </Button>
            <Button variant="outline" size="sm" onClick={addArticle}>
              <FileText className="mr-2 h-4 w-4" />
              Agregar Artículo
            </Button>
          </div>

          {/* Titles */}
          {chapter.titles.map((title) => (
            <TitleSection
              key={title.id}
              title={title}
              onUpdate={(updated) => {
                const updatedTitles = chapter.titles.map((t) =>
                  t.id === updated.id ? updated : t
                );
                onUpdate({ ...chapter, titles: updatedTitles });
              }}
              onDelete={(id) => {
                onUpdate({
                  ...chapter,
                  titles: chapter.titles.filter((t) => t.id !== id),
                });
                toast.success("Título eliminado");
              }}
            />
          ))}

          {/* Chapter Articles */}
          {chapter.articles.map((article) => (
            <ArticleSection
              key={article.id}
              article={article}
              onUpdate={(updated) => {
                const updatedArticles = chapter.articles.map((a) =>
                  a.id === updated.id ? updated : a
                );
                onUpdate({ ...chapter, articles: updatedArticles });
              }}
              onDelete={(id) => {
                onUpdate({
                  ...chapter,
                  articles: chapter.articles.filter((a) => a.id !== id),
                });
                toast.success("Artículo eliminado");
              }}
            />
          ))}
        </div>
      )}
    </Card>
  );
};
