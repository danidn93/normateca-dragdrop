import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Article, Literal } from "@/types/normative";
import { LiteralItem } from "./LiteralItem";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";

interface ArticleSectionProps {
  article: Article;
  onUpdate: (article: Article) => void;
  onDelete: (id: string) => void;
}

export const ArticleSection = ({
  article,
  onUpdate,
  onDelete,
}: ArticleSectionProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: article.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const addLiteral = () => {
    const newLiteral: Literal = {
      id: `l${Date.now()}`,
      content: "",
      order: article.literals.length,
    };
    onUpdate({ ...article, literals: [...article.literals, newLiteral] });
    toast.success("Literal agregado");
  };

  return (
    <Card ref={setNodeRef} style={style} className="border-l-4 border-l-legal-article">
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing touch-none mt-1"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </button>
          <div className="flex-1 space-y-3">
            <Input
              value={article.number}
              onChange={(e) => onUpdate({ ...article, number: e.target.value })}
              className="font-semibold text-legal-article w-32"
              placeholder="Art. 1"
            />
            <Textarea
              value={article.content}
              onChange={(e) => onUpdate({ ...article, content: e.target.value })}
              placeholder="Contenido del artículo..."
              className="min-h-[80px] text-foreground"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(article.id)}
            className="hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Literals */}
        {article.literals.length > 0 && (
          <div className="ml-8 space-y-2 mb-3">
            {article.literals.map((literal, index) => (
              <LiteralItem
                key={literal.id}
                literal={literal}
                index={index}
                onUpdate={(updated) => {
                  const updatedLiterals = article.literals.map((l) =>
                    l.id === updated.id ? updated : l
                  );
                  onUpdate({ ...article, literals: updatedLiterals });
                }}
                onDelete={(id) => {
                  onUpdate({
                    ...article,
                    literals: article.literals.filter((l) => l.id !== id),
                  });
                  toast.success("Literal eliminado");
                }}
              />
            ))}
          </div>
        )}

        <div className="ml-8">
          <Button variant="outline" size="sm" onClick={addLiteral}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Literal
          </Button>
        </div>
      </div>
    </Card>
  );
};
