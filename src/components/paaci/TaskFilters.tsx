import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import type { Topic, TaskStatus } from "@/types/paaci";

export interface FilterState {
  status: TaskStatus | "all";
  topicId: string | "all";
  activityId: string | "all";
}

interface Props {
  topics: Topic[];
  filters: FilterState;
  onChange: (next: FilterState) => void;
}

const statusOptions: { value: TaskStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos os status" },
  { value: "pendente", label: "Pendente" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "concluida", label: "Concluída" },
  { value: "atrasada", label: "Atrasada" },
];

export function TaskFilters({ topics, filters, onChange }: Props) {
  const selectedTopic = topics.find(t => t.id === filters.topicId);
  const activities = selectedTopic?.activities ?? [];
  const hasActive = filters.status !== "all" || filters.topicId !== "all" || filters.activityId !== "all";

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg border border-border bg-card shadow-soft">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground pr-2">
        <Filter className="h-4 w-4" /> Filtros
      </div>

      <Select value={filters.status} onValueChange={(v) => onChange({ ...filters, status: v as FilterState["status"] })}>
        <SelectTrigger className="w-[180px] h-9"><SelectValue /></SelectTrigger>
        <SelectContent>
          {statusOptions.map(o => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}
        </SelectContent>
      </Select>

      <Select
        value={filters.topicId}
        onValueChange={(v) => onChange({ ...filters, topicId: v, activityId: "all" })}
      >
        <SelectTrigger className="w-[220px] h-9"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os tópicos</SelectItem>
          {topics.map(t => (<SelectItem key={t.id} value={t.id}>{t.code} — {t.title}</SelectItem>))}
        </SelectContent>
      </Select>

      <Select
        value={filters.activityId}
        onValueChange={(v) => onChange({ ...filters, activityId: v })}
        disabled={filters.topicId === "all"}
      >
        <SelectTrigger className="w-[240px] h-9"><SelectValue placeholder="Todas as atividades" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as atividades</SelectItem>
          {activities.map(a => (<SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>))}
        </SelectContent>
      </Select>

      {hasActive && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange({ status: "all", topicId: "all", activityId: "all" })}
        >
          <X className="h-4 w-4 mr-1" /> Limpar
        </Button>
      )}
    </div>
  );
}
