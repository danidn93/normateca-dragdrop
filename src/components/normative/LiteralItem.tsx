import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2 } from "lucide-react";
import { Literal } from "@/types/normative";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface LiteralItemProps {
  literal: Literal;
  index: number;
  onUpdate: (literal: Literal) => void;
  onDelete: (id: string) => void;
}

const getLiteralLabel = (index: number): string => {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  return letters[index] || `${index + 1}`;
};

export const LiteralItem = ({
  literal,
  index,
  onUpdate,
  onDelete,
}: LiteralItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: literal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 bg-muted/30 rounded-md"
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <span className="text-sm font-medium text-legal-literal min-w-[20px]">
        {getLiteralLabel(index)})
      </span>
      <Input
        value={literal.content}
        onChange={(e) => onUpdate({ ...literal, content: e.target.value })}
        placeholder="Contenido del literal..."
        className="flex-1 h-8 text-sm bg-background"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(literal.id)}
        className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};
