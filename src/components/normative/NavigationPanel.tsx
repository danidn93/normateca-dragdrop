import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, BookOpen, FileText } from "lucide-react";
import { Chapter } from "@/types/normative";

interface NavigationPanelProps {
  chapters: Chapter[];
  onNavigate: (id: string, type: "chapter" | "title" | "article") => void;
}

export const NavigationPanel = ({ chapters, onNavigate }: NavigationPanelProps) => {
  const [viewMode, setViewMode] = useState<"chapters" | "titles">("chapters");

  const scrollToElement = (id: string, type: "chapter" | "title" | "article") => {
    onNavigate(id, type);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex gap-2 mb-4">
        <Button
          variant={viewMode === "chapters" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("chapters")}
          className="flex-1"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Capítulos
        </Button>
        <Button
          variant={viewMode === "titles" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("titles")}
          className="flex-1"
        >
          <FileText className="h-4 w-4 mr-2" />
          Títulos
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        {viewMode === "chapters" ? (
          <div className="space-y-2">
            {chapters.map((chapter) => (
              <div key={chapter.id}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left hover:bg-muted"
                  onClick={() => scrollToElement(chapter.id, "chapter")}
                >
                  <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate text-sm">{chapter.name}</span>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {chapters.map((chapter) =>
              chapter.titles.map((title) => (
                <Button
                  key={title.id}
                  variant="ghost"
                  className="w-full justify-start text-left hover:bg-muted"
                  onClick={() => scrollToElement(title.id, "title")}
                >
                  <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate text-sm">{title.name}</span>
                </Button>
              ))
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
