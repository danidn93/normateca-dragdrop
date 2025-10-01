import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Save,
  FileDown,
  Upload,
  Plus,
  History,
  BookOpen,
} from "lucide-react";
import { NormativeToolbar } from "@/components/normative/NormativeToolbar";
import { ChapterSection } from "@/components/normative/ChapterSection";
import { ArticleSection } from "@/components/normative/ArticleSection";
import { VersionHistory } from "@/components/normative/VersionHistory";
import { Normative, Chapter, Article } from "@/types/normative";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { toast } from "sonner";

const NormativeEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Demo normative data
  const [normative, setNormative] = useState<Normative>({
    id: id || "new",
    name: "Reglamento Interno de Trabajo",
    description: "Normativa que regula las relaciones laborales internas",
    chapters: [
      {
        id: "ch1",
        name: "CAPÍTULO I - DISPOSICIONES GENERALES",
        order: 0,
        titles: [
          {
            id: "t1",
            name: "TÍTULO I - Objeto y Ámbito de Aplicación",
            order: 0,
            articles: [
              {
                id: "a1",
                number: "Art. 1",
                content: "El presente reglamento tiene por objeto establecer las normas...",
                literals: [
                  { id: "l1", content: "Aplicable a todo el personal de la institución", order: 0 },
                  { id: "l2", content: "Incluye personal permanente y temporal", order: 1 },
                ],
                order: 0,
              },
            ],
          },
        ],
        articles: [],
      },
    ],
    articles: [
      {
        id: "a-standalone",
        number: "Art. 15",
        content: "Artículo independiente sin capítulo ni título",
        literals: [],
        order: 0,
      },
    ],
    versions: [
      { id: "v1", versionNumber: "1.0", date: "2024-01-15", changes: "Versión inicial" },
      { id: "v2", versionNumber: "2.0", date: "2024-03-15", changes: "Actualización de artículos laborales" },
    ],
    currentVersion: "2.0",
    createdAt: "2024-01-15",
    updatedAt: "2024-03-15",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    // Handle reordering logic here
    toast.success("Elemento reordenado correctamente");
  };

  const addChapter = () => {
    const newChapter: Chapter = {
      id: `ch${Date.now()}`,
      name: "NUEVO CAPÍTULO",
      titles: [],
      articles: [],
      order: normative.chapters.length,
    };
    setNormative({ ...normative, chapters: [...normative.chapters, newChapter] });
    toast.success("Capítulo agregado");
  };

  const addStandaloneArticle = () => {
    const newArticle: Article = {
      id: `a${Date.now()}`,
      number: `Art. ${normative.articles.length + 1}`,
      content: "",
      literals: [],
      order: normative.articles.length,
    };
    setNormative({ ...normative, articles: [...normative.articles, newArticle] });
    toast.success("Artículo agregado");
  };

  const handleExportPDF = () => {
    toast.info("Generando PDF...");
    // PDF export logic would go here
  };

  const handleImportPDF = () => {
    toast.info("Función de importación PDF");
    // PDF import logic would go here
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <Input
                  value={normative.name}
                  onChange={(e) =>
                    setNormative({ ...normative, name: e.target.value })
                  }
                  className="text-xl font-bold border-none shadow-none p-0 h-auto focus-visible:ring-0"
                />
                <p className="text-sm text-muted-foreground">
                  Versión {normative.currentVersion}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleImportPDF}>
                <Upload className="mr-2 h-4 w-4" />
                Importar PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <FileDown className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowVersionHistory(!showVersionHistory)}
              >
                <History className="mr-2 h-4 w-4" />
                Versiones
              </Button>
              <Button size="sm">
                <Save className="mr-2 h-4 w-4" />
                Guardar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-3">
            {/* Description */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-foreground mb-2">
                Descripción
              </label>
              <Textarea
                value={normative.description}
                onChange={(e) =>
                  setNormative({ ...normative, description: e.target.value })
                }
                placeholder="Descripción general de la normativa..."
                className="min-h-[80px]"
              />
            </div>

            {/* Toolbar */}
            <NormativeToolbar
              onAddChapter={addChapter}
              onAddArticle={addStandaloneArticle}
            />

            {/* Document Content */}
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="space-y-6 mt-6">
                {/* Chapters */}
                <SortableContext items={normative.chapters.map((ch) => ch.id)}>
                  {normative.chapters.map((chapter) => (
                    <ChapterSection
                      key={chapter.id}
                      chapter={chapter}
                      onUpdate={(updated) => {
                        const updatedChapters = normative.chapters.map((ch) =>
                          ch.id === updated.id ? updated : ch
                        );
                        setNormative({ ...normative, chapters: updatedChapters });
                      }}
                      onDelete={(id) => {
                        setNormative({
                          ...normative,
                          chapters: normative.chapters.filter((ch) => ch.id !== id),
                        });
                        toast.success("Capítulo eliminado");
                      }}
                    />
                  ))}
                </SortableContext>

                {/* Standalone Articles */}
                {normative.articles.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-legal-article flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Artículos Independientes
                    </h3>
                    <SortableContext items={normative.articles.map((a) => a.id)}>
                      {normative.articles.map((article) => (
                        <ArticleSection
                          key={article.id}
                          article={article}
                          onUpdate={(updated) => {
                            const updatedArticles = normative.articles.map((a) =>
                              a.id === updated.id ? updated : a
                            );
                            setNormative({ ...normative, articles: updatedArticles });
                          }}
                          onDelete={(id) => {
                            setNormative({
                              ...normative,
                              articles: normative.articles.filter((a) => a.id !== id),
                            });
                            toast.success("Artículo eliminado");
                          }}
                        />
                      ))}
                    </SortableContext>
                  </div>
                )}
              </div>

              <DragOverlay>
                {activeId ? (
                  <div className="bg-card p-4 rounded-lg shadow-elevated border border-border">
                    Arrastrando elemento...
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {showVersionHistory && (
              <VersionHistory
                versions={normative.versions}
                currentVersion={normative.currentVersion}
                onVersionSelect={(version) => {
                  toast.info(`Cargando versión ${version}`);
                }}
                onCreateVersion={() => {
                  toast.info("Crear nueva versión");
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NormativeEditor;
