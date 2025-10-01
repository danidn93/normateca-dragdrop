import { Button } from "@/components/ui/button";
import { Plus, BookOpen, FileText } from "lucide-react";

interface NormativeToolbarProps {
  onAddChapter: () => void;
  onAddArticle: () => void;
}

export const NormativeToolbar = ({
  onAddChapter,
  onAddArticle,
}: NormativeToolbarProps) => {
  return (
    <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg shadow-card">
      <span className="text-sm font-medium text-muted-foreground">
        Agregar:
      </span>
      <Button variant="outline" size="sm" onClick={onAddChapter}>
        <BookOpen className="mr-2 h-4 w-4" />
        Capítulo
      </Button>
      <Button variant="outline" size="sm" onClick={onAddArticle}>
        <FileText className="mr-2 h-4 w-4" />
        Artículo
      </Button>
    </div>
  );
};
