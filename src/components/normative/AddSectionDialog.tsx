import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, ChevronRight, ChevronDown, FileText, BookOpen, Layers } from "lucide-react";
import { SectionType, Normative } from "@/types/normative";

interface AddSectionDialogProps {
  onAdd: (type: SectionType, parentId?: string, customName?: string) => void;
  availableParents: Array<{ id: string; name: string; type: string }>;
  normative: Normative;
}

export const AddSectionDialog = ({ onAdd, availableParents, normative }: AddSectionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<SectionType>("chapter");
  const [selectedParent, setSelectedParent] = useState<string>("root");
  const [customName, setCustomName] = useState("");
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  const handleAdd = () => {
    const name = selectedType === "custom" && customName ? customName : undefined;
    onAdd(selectedType, selectedParent === "root" ? undefined : selectedParent, name);
    setOpen(false);
    setSelectedType("chapter");
    setSelectedParent("root");
    setCustomName("");
  };

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "chapter": return <BookOpen className="h-4 w-4 text-primary" />;
      case "title": return <Layers className="h-4 w-4 text-secondary" />;
      case "article": return <FileText className="h-4 w-4 text-muted-foreground" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const isSelected = (id: string) => selectedParent === id;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Agregar Sección
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Sección</DialogTitle>
          <DialogDescription>
            Selecciona el tipo de sección, dónde deseas agregarla y visualiza la estructura.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6 py-4">
          {/* Left side: Form */}
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="section-type">Tipo de Sección</Label>
              <Select
                value={selectedType}
                onValueChange={(value) => setSelectedType(value as SectionType)}
              >
                <SelectTrigger id="section-type">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="chapter">Capítulo</SelectItem>
                  <SelectItem value="title">Título</SelectItem>
                  <SelectItem value="article">Artículo</SelectItem>
                  <SelectItem value="section">Sección</SelectItem>
                  <SelectItem value="part">Parte</SelectItem>
                  <SelectItem value="book">Libro</SelectItem>
                  <SelectItem value="custom">Personalizada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedType === "custom" && (
              <div className="grid gap-2">
                <Label htmlFor="custom-name">Nombre de la Sección</Label>
                <Input
                  id="custom-name"
                  placeholder="Ej: Disposición Transitoria, Anexo, etc."
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="parent-location">Ubicación</Label>
              <Select
                value={selectedParent}
                onValueChange={setSelectedParent}
              >
                <SelectTrigger id="parent-location">
                  <SelectValue placeholder="Selecciona ubicación" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="root">Nivel raíz</SelectItem>
                  {availableParents.map((parent) => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.type}: {parent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right side: Tree view */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <h4 className="text-sm font-semibold mb-3 text-foreground">Estructura de la Normativa</h4>
            <ScrollArea className="h-[300px]">
              <div className="space-y-1">
                {/* Root level */}
                <div
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                    isSelected("root") ? "bg-primary/20 text-primary font-medium" : "hover:bg-muted"
                  }`}
                  onClick={() => setSelectedParent("root")}
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm">Raíz - {normative.name}</span>
                </div>

                {/* Chapters */}
                {normative.chapters.map((chapter) => (
                  <div key={chapter.id} className="ml-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleChapter(chapter.id)}
                        className="p-1 hover:bg-muted rounded"
                      >
                        {expandedChapters.has(chapter.id) ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </button>
                      <div
                        className={`flex items-center gap-2 p-2 rounded flex-1 cursor-pointer transition-colors ${
                          isSelected(chapter.id) ? "bg-primary/20 text-primary font-medium" : "hover:bg-muted"
                        }`}
                        onClick={() => setSelectedParent(chapter.id)}
                      >
                        {getIcon("chapter")}
                        <span className="text-sm truncate">{chapter.name}</span>
                      </div>
                    </div>

                    {/* Titles */}
                    {expandedChapters.has(chapter.id) && chapter.titles.map((title) => (
                      <div
                        key={title.id}
                        className={`flex items-center gap-2 p-2 ml-8 rounded cursor-pointer transition-colors ${
                          isSelected(title.id) ? "bg-primary/20 text-primary font-medium" : "hover:bg-muted"
                        }`}
                        onClick={() => setSelectedParent(title.id)}
                      >
                        {getIcon("title")}
                        <span className="text-sm truncate">{title.name}</span>
                      </div>
                    ))}

                    {/* Chapter Articles */}
                    {expandedChapters.has(chapter.id) && chapter.articles.map((article) => (
                      <div
                        key={article.id}
                        className={`flex items-center gap-2 p-2 ml-8 rounded cursor-pointer transition-colors ${
                          isSelected(article.id) ? "bg-primary/20 text-primary font-medium" : "hover:bg-muted"
                        }`}
                        onClick={() => setSelectedParent(article.id)}
                      >
                        {getIcon("article")}
                        <span className="text-sm truncate">{article.number}</span>
                      </div>
                    ))}
                  </div>
                ))}

                {/* Standalone Articles */}
                {normative.articles.length > 0 && (
                  <div className="ml-2 mt-2 pt-2 border-t">
                    <div className="text-xs font-medium text-muted-foreground mb-1 px-2">
                      Artículos Independientes
                    </div>
                    {normative.articles.map((article) => (
                      <div
                        key={article.id}
                        className={`flex items-center gap-2 p-2 ml-4 rounded cursor-pointer transition-colors ${
                          isSelected(article.id) ? "bg-primary/20 text-primary font-medium" : "hover:bg-muted"
                        }`}
                        onClick={() => setSelectedParent(article.id)}
                      >
                        {getIcon("article")}
                        <span className="text-sm truncate">{article.number}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button 
            type="button" 
            onClick={handleAdd}
            disabled={selectedType === "custom" && !customName.trim()}
          >
            Agregar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
