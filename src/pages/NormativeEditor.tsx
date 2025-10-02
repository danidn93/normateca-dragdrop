import { useState, useMemo } from "react";
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
import { StandaloneArticlesArea } from "@/components/normative/StandaloneArticlesArea";
import { VersionHistory } from "@/components/normative/VersionHistory";
import { SearchBar } from "@/components/normative/SearchBar";
import { NavigationPanel } from "@/components/normative/NavigationPanel";
import { Normative, Chapter, Article } from "@/types/normative";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { toast } from "sonner";

const NormativeEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<"chapter" | "title" | "article" | "literal" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Demo normative data - Normativa completa
  const [normative, setNormative] = useState<Normative>({
    id: id || "new",
    name: "Reglamento Interno de Trabajo",
    description: "Normativa que regula las relaciones laborales internas de la institución",
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
                content: "El presente reglamento tiene por objeto establecer las normas que regirán las relaciones laborales entre la institución y sus trabajadores.",
                literals: [
                  { id: "l1", content: "Aplicable a todo el personal de la institución", order: 0 },
                  { id: "l2", content: "Incluye personal permanente y temporal", order: 1 },
                  { id: "l3", content: "Rige para todas las áreas y departamentos", order: 2 },
                ],
                order: 0,
              },
              {
                id: "a2",
                number: "Art. 2",
                content: "El ámbito de aplicación del presente reglamento abarca todas las instalaciones y dependencias de la institución.",
                literals: [
                  { id: "l4", content: "Oficinas centrales y sucursales", order: 0 },
                  { id: "l5", content: "Instalaciones industriales y administrativas", order: 1 },
                ],
                order: 1,
              },
            ],
          },
          {
            id: "t2",
            name: "TÍTULO II - Definiciones",
            order: 1,
            articles: [
              {
                id: "a3",
                number: "Art. 3",
                content: "Para efectos del presente reglamento se entenderá por:",
                literals: [
                  { id: "l6", content: "Trabajador: Toda persona que preste sus servicios bajo relación de dependencia", order: 0 },
                  { id: "l7", content: "Empleador: La institución contratante", order: 1 },
                  { id: "l8", content: "Jornada laboral: El tiempo durante el cual el trabajador está a disposición del empleador", order: 2 },
                ],
                order: 0,
              },
            ],
          },
        ],
        articles: [],
      },
      {
        id: "ch2",
        name: "CAPÍTULO II - DE LA ADMISIÓN Y CONTRATACIÓN",
        order: 1,
        titles: [
          {
            id: "t3",
            name: "TÍTULO I - Requisitos de Admisión",
            order: 0,
            articles: [
              {
                id: "a4",
                number: "Art. 4",
                content: "Para ser admitido como trabajador de la institución se requiere:",
                literals: [
                  { id: "l9", content: "Ser mayor de edad", order: 0 },
                  { id: "l10", content: "Presentar documentación personal completa", order: 1 },
                  { id: "l11", content: "Aprobar exámenes médicos y psicológicos", order: 2 },
                  { id: "l12", content: "No tener antecedentes penales", order: 3 },
                ],
                order: 0,
              },
              {
                id: "a5",
                number: "Art. 5",
                content: "La documentación requerida para la contratación incluye:",
                literals: [
                  { id: "l13", content: "Cédula de identidad vigente", order: 0 },
                  { id: "l14", content: "Certificados de estudios", order: 1 },
                  { id: "l15", content: "Certificados de trabajo anteriores", order: 2 },
                ],
                order: 1,
              },
            ],
          },
        ],
        articles: [],
      },
      {
        id: "ch3",
        name: "CAPÍTULO III - JORNADA LABORAL Y HORARIOS",
        order: 2,
        titles: [],
        articles: [
          {
            id: "a6",
            number: "Art. 6",
            content: "La jornada ordinaria de trabajo será de ocho horas diarias y cuarenta horas semanales.",
            literals: [],
            order: 0,
          },
          {
            id: "a7",
            number: "Art. 7",
            content: "Los horarios de trabajo serán establecidos por la administración según las necesidades operativas.",
            literals: [
              { id: "l16", content: "Turno mañana: 8:00 a 12:00 y 14:00 a 18:00", order: 0 },
              { id: "l17", content: "Turno tarde: 14:00 a 22:00", order: 1 },
              { id: "l18", content: "Turno noche: 22:00 a 6:00", order: 2 },
            ],
            order: 1,
          },
        ],
      },
      {
        id: "ch4",
        name: "CAPÍTULO IV - DERECHOS Y OBLIGACIONES",
        order: 3,
        titles: [
          {
            id: "t4",
            name: "TÍTULO I - Derechos de los Trabajadores",
            order: 0,
            articles: [
              {
                id: "a8",
                number: "Art. 8",
                content: "Son derechos de los trabajadores:",
                literals: [
                  { id: "l19", content: "Percibir remuneración justa y oportuna", order: 0 },
                  { id: "l20", content: "Gozar de vacaciones anuales pagadas", order: 1 },
                  { id: "l21", content: "Recibir capacitación y formación profesional", order: 2 },
                  { id: "l22", content: "Contar con condiciones de trabajo seguras", order: 3 },
                ],
                order: 0,
              },
            ],
          },
          {
            id: "t5",
            name: "TÍTULO II - Obligaciones de los Trabajadores",
            order: 1,
            articles: [
              {
                id: "a9",
                number: "Art. 9",
                content: "Son obligaciones de los trabajadores:",
                literals: [
                  { id: "l23", content: "Cumplir con la jornada y horarios de trabajo", order: 0 },
                  { id: "l24", content: "Desempeñar sus funciones con eficiencia y diligencia", order: 1 },
                  { id: "l25", content: "Respetar las normas de seguridad y salud ocupacional", order: 2 },
                  { id: "l26", content: "Mantener la confidencialidad de la información institucional", order: 3 },
                ],
                order: 0,
              },
            ],
          },
        ],
        articles: [],
      },
      {
        id: "ch5",
        name: "CAPÍTULO V - RÉGIMEN DISCIPLINARIO",
        order: 4,
        titles: [
          {
            id: "t6",
            name: "TÍTULO I - Faltas y Sanciones",
            order: 0,
            articles: [
              {
                id: "a10",
                number: "Art. 10",
                content: "Las faltas disciplinarias se clasifican en leves, graves y muy graves según su naturaleza y consecuencias.",
                literals: [
                  { id: "l27", content: "Faltas leves: Amonestación verbal o escrita", order: 0 },
                  { id: "l28", content: "Faltas graves: Suspensión temporal sin goce de sueldo", order: 1 },
                  { id: "l29", content: "Faltas muy graves: Despido justificado", order: 2 },
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
        id: "a-standalone1",
        number: "Art. 11",
        content: "Disposición Transitoria Primera: El presente reglamento entrará en vigencia al día siguiente de su aprobación.",
        literals: [],
        order: 0,
      },
      {
        id: "a-standalone2",
        number: "Art. 12",
        content: "Disposición Final: Los casos no previstos en el presente reglamento serán resueltos por la administración en coordinación con el área de recursos humanos.",
        literals: [],
        order: 1,
      },
    ],
    versions: [
      { id: "v1", versionNumber: "1.0", date: "2024-01-15", changes: "Versión inicial del reglamento" },
      { id: "v2", versionNumber: "1.1", date: "2024-03-15", changes: "Actualización de artículos laborales y régimen disciplinario" },
      { id: "v3", versionNumber: "2.0", date: "2025-01-10", changes: "Incorporación de nuevos capítulos y disposiciones transitorias" },
    ],
    currentVersion: "2.0",
    createdAt: "2024-01-15",
    updatedAt: "2025-01-10",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    // Determine type
    const id = active.id as string;
    if (normative.chapters.some(ch => ch.id === id)) {
      setActiveType("chapter");
    } else if (normative.chapters.some(ch => ch.titles.some(t => t.id === id))) {
      setActiveType("title");
    } else {
      setActiveType("article");
    }
  };

  const findArticleLocation = (articleId: string): { 
    chapterIndex: number; 
    titleIndex: number; 
    articleIndex: number;
    type: "standalone" | "chapter" | "title";
  } | null => {
    // Check standalone articles
    const standaloneIndex = normative.articles.findIndex(a => a.id === articleId);
    if (standaloneIndex !== -1) {
      return { chapterIndex: -1, titleIndex: -1, articleIndex: standaloneIndex, type: "standalone" };
    }

    // Check in chapters
    for (let chIdx = 0; chIdx < normative.chapters.length; chIdx++) {
      const chapter = normative.chapters[chIdx];
      
      // Check chapter articles
      const chArticleIdx = chapter.articles.findIndex(a => a.id === articleId);
      if (chArticleIdx !== -1) {
        return { chapterIndex: chIdx, titleIndex: -1, articleIndex: chArticleIdx, type: "chapter" };
      }

      // Check title articles
      for (let tIdx = 0; tIdx < chapter.titles.length; tIdx++) {
        const title = chapter.titles[tIdx];
        const tArticleIdx = title.articles.findIndex(a => a.id === articleId);
        if (tArticleIdx !== -1) {
          return { chapterIndex: chIdx, titleIndex: tIdx, articleIndex: tArticleIdx, type: "title" };
        }
      }
    }

    return null;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveType(null);

    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle chapter reordering
    const activeChapterIndex = normative.chapters.findIndex(ch => ch.id === activeId);
    const overChapterIndex = normative.chapters.findIndex(ch => ch.id === overId);

    if (activeChapterIndex !== -1 && overChapterIndex !== -1) {
      const reorderedChapters = arrayMove(normative.chapters, activeChapterIndex, overChapterIndex);
      setNormative({ ...normative, chapters: reorderedChapters });
      toast.success("Capítulo reordenado");
      return;
    }

    // Handle article movement
    const activeLocation = findArticleLocation(activeId);
    if (activeLocation) {
      let article: Article | null = null;

      // Extract the article from its current location
      const newNormative = { ...normative };
      
      if (activeLocation.type === "standalone") {
        article = newNormative.articles[activeLocation.articleIndex];
        newNormative.articles.splice(activeLocation.articleIndex, 1);
      } else if (activeLocation.type === "chapter") {
        article = newNormative.chapters[activeLocation.chapterIndex].articles[activeLocation.articleIndex];
        newNormative.chapters[activeLocation.chapterIndex].articles.splice(activeLocation.articleIndex, 1);
      } else if (activeLocation.type === "title") {
        article = newNormative.chapters[activeLocation.chapterIndex].titles[activeLocation.titleIndex].articles[activeLocation.articleIndex];
        newNormative.chapters[activeLocation.chapterIndex].titles[activeLocation.titleIndex].articles.splice(activeLocation.articleIndex, 1);
      }

      if (!article) return;

      // Determine where to drop
      // Check if dropping on a chapter
      const targetChapterIndex = newNormative.chapters.findIndex(ch => ch.id === overId);
      if (targetChapterIndex !== -1) {
        newNormative.chapters[targetChapterIndex].articles.push(article);
        setNormative(newNormative);
        toast.success("Artículo movido al capítulo");
        return;
      }

      // Check if dropping on a title
      for (let chIdx = 0; chIdx < newNormative.chapters.length; chIdx++) {
        const titleIndex = newNormative.chapters[chIdx].titles.findIndex(t => t.id === overId);
        if (titleIndex !== -1) {
          newNormative.chapters[chIdx].titles[titleIndex].articles.push(article);
          setNormative(newNormative);
          toast.success("Artículo movido al título");
          return;
        }
      }

      // Check if dropping on standalone articles area
      if (overId === "standalone-articles-area") {
        newNormative.articles.push(article);
        setNormative(newNormative);
        toast.success("Artículo movido a independientes");
        return;
      }

      // If dropping on another article, insert near it
      const targetLocation = findArticleLocation(overId);
      if (targetLocation) {
        if (targetLocation.type === "standalone") {
          newNormative.articles.splice(targetLocation.articleIndex, 0, article);
        } else if (targetLocation.type === "chapter") {
          newNormative.chapters[targetLocation.chapterIndex].articles.splice(targetLocation.articleIndex, 0, article);
        } else if (targetLocation.type === "title") {
          newNormative.chapters[targetLocation.chapterIndex].titles[targetLocation.titleIndex].articles.splice(targetLocation.articleIndex, 0, article);
        }
        setNormative(newNormative);
        toast.success("Artículo reordenado");
      }
    }
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

  const handleNavigate = (id: string, type: "chapter" | "title" | "article") => {
    // Navigation is handled by the NavigationPanel component
  };

  // Filter normative based on search query
  const filteredNormative = useMemo(() => {
    if (!searchQuery.trim()) return normative;

    const query = searchQuery.toLowerCase();
    const filtered = { ...normative };

    filtered.chapters = normative.chapters
      .map((chapter) => {
        const chapterMatch = chapter.name.toLowerCase().includes(query);
        
        const filteredTitles = chapter.titles
          .map((title) => {
            const titleMatch = title.name.toLowerCase().includes(query);
            
            const filteredArticles = title.articles.filter(
              (article) =>
                article.number.toLowerCase().includes(query) ||
                article.content.toLowerCase().includes(query)
            );

            if (titleMatch || filteredArticles.length > 0) {
              return { ...title, articles: titleMatch ? title.articles : filteredArticles };
            }
            return null;
          })
          .filter((t) => t !== null);

        const filteredChapterArticles = chapter.articles.filter(
          (article) =>
            article.number.toLowerCase().includes(query) ||
            article.content.toLowerCase().includes(query)
        );

        if (chapterMatch || filteredTitles.length > 0 || filteredChapterArticles.length > 0) {
          return {
            ...chapter,
            titles: chapterMatch ? chapter.titles : filteredTitles,
            articles: chapterMatch ? chapter.articles : filteredChapterArticles,
          };
        }
        return null;
      })
      .filter((ch) => ch !== null);

    filtered.articles = normative.articles.filter(
      (article) =>
        article.number.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query)
    );

    return filtered;
  }, [normative, searchQuery]);

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
          {/* Sidebar - Navigation Panel */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <NavigationPanel
              chapters={normative.chapters}
              onNavigate={handleNavigate}
            />
          </div>

          {/* Main Editor */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

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
              collisionDetection={closestCenter}
            >
              <div className="space-y-6 mt-6">
                {/* Chapters */}
                {filteredNormative.chapters.map((chapter) => (
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

                {/* Standalone Articles */}
                <StandaloneArticlesArea 
                  articles={filteredNormative.articles}
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
              </div>

              <DragOverlay>
                {activeId ? (
                  <div className="bg-card p-4 rounded-lg shadow-elevated border-2 border-primary">
                    <p className="font-semibold">Arrastrando {activeType}...</p>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>

          {/* Right Sidebar - Version History */}
          <div className="lg:col-span-1 order-3">
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
