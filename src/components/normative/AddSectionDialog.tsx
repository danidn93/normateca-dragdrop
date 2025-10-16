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
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { SectionType } from "@/types/normative";

interface AddSectionDialogProps {
  onAdd: (type: SectionType, parentId?: string) => void;
  availableParents: Array<{ id: string; name: string; type: string }>;
}

export const AddSectionDialog = ({ onAdd, availableParents }: AddSectionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<SectionType>("chapter");
  const [selectedParent, setSelectedParent] = useState<string>("root");

  const handleAdd = () => {
    onAdd(selectedType, selectedParent === "root" ? undefined : selectedParent);
    setOpen(false);
    setSelectedType("chapter");
    setSelectedParent("root");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Agregar Sección
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Sección</DialogTitle>
          <DialogDescription>
            Selecciona el tipo de sección y dónde deseas agregarla.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="section-type">Tipo de Sección</Label>
            <Select
              value={selectedType}
              onValueChange={(value) => setSelectedType(value as SectionType)}
            >
              <SelectTrigger id="section-type">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
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
          <div className="grid gap-2">
            <Label htmlFor="parent-location">Ubicación</Label>
            <Select
              value={selectedParent}
              onValueChange={setSelectedParent}
            >
              <SelectTrigger id="parent-location">
                <SelectValue placeholder="Selecciona ubicación" />
              </SelectTrigger>
              <SelectContent>
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
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleAdd}>
            Agregar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
