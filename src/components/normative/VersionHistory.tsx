import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Clock, CheckCircle2 } from "lucide-react";
import { NormativeVersion } from "@/types/normative";

interface VersionHistoryProps {
  versions: NormativeVersion[];
  currentVersion: string;
  onVersionSelect: (versionNumber: string) => void;
  onCreateVersion: () => void;
}

export const VersionHistory = ({
  versions,
  currentVersion,
  onVersionSelect,
  onCreateVersion,
}: VersionHistoryProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Historial de Versiones
        </h3>
        <Button size="sm" onClick={onCreateVersion}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {versions
            .sort(
              (a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((version) => (
              <Card
                key={version.id}
                className={`p-3 cursor-pointer transition-all hover:shadow-card ${
                  version.versionNumber === currentVersion
                    ? "border-primary bg-primary/5"
                    : ""
                }`}
                onClick={() => onVersionSelect(version.versionNumber)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      v{version.versionNumber}
                    </span>
                    {version.versionNumber === currentVersion && (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {version.date}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {version.changes}
                </p>
              </Card>
            ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
