import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, FileText, Clock, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Normative {
  id: string;
  name: string;
  version: string;
  lastModified: string;
  status: "draft" | "published" | "archived";
}

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Demo data
  const normatives: Normative[] = [
    {
      id: "1",
      name: "Reglamento Interno de Trabajo",
      version: "v2.1",
      lastModified: "2024-03-15",
      status: "published",
    },
    {
      id: "2",
      name: "Código de Ética Institucional",
      version: "v1.0",
      lastModified: "2024-03-10",
      status: "draft",
    },
    {
      id: "3",
      name: "Manual de Procedimientos Administrativos",
      version: "v3.2",
      lastModified: "2024-02-28",
      status: "published",
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "published":
        return "default";
      case "draft":
        return "secondary";
      case "archived":
        return "outline";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "published":
        return "Publicado";
      case "draft":
        return "Borrador";
      case "archived":
        return "Archivado";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Sistema de Gestión Normativa
              </h1>
              <p className="text-muted-foreground mt-1">
                Crea, edita y versiona documentos normativos institucionales
              </p>
            </div>
            <Button
              size="lg"
              className="gap-2"
              onClick={() => navigate("/editor/new")}
            >
              <Plus className="h-5 w-5" />
              Nueva Normativa
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar normativas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Normatives List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {normatives.map((normative) => (
            <Card
              key={normative.id}
              className="cursor-pointer transition-all hover:shadow-elevated"
              onClick={() => navigate(`/editor/${normative.id}`)}
            >
              <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <Badge variant={getStatusVariant(normative.status)}>
                        {getStatusLabel(normative.status)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {normative.name}
                </h3>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>{normative.version}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{normative.lastModified}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {normatives.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-6">
              <FileText className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              No hay normativas todavía
            </h3>
            <p className="mb-6 text-muted-foreground">
              Comienza creando tu primera normativa institucional
            </p>
            <Button onClick={() => navigate("/editor/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Crear Primera Normativa
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
