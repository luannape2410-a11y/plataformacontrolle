import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/types/paaci";

const map: Record<TaskStatus, { label: string; className: string }> = {
  pendente: { label: "Pendente", className: "bg-muted text-muted-foreground" },
  em_andamento: { label: "Em andamento", className: "bg-primary/10 text-primary border-primary/30" },
  concluida: { label: "Concluída", className: "bg-success/15 text-success border-success/30" },
  atrasada: { label: "Atrasada", className: "bg-destructive/10 text-destructive border-destructive/30" },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const s = map[status];
  return <Badge variant="outline" className={cn("font-medium", s.className)}>{s.label}</Badge>;
}
