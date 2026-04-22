import { useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "./StatusBadge";
import { AlertTriangle, CalendarClock, CalendarDays, Filter, X, Download, FileType2, FileText, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Topic, TaskStatus } from "@/types/paaci";
import { flattenTasks, isOverdue, daysUntil, effectiveStatus, type FlatTask } from "@/lib/taskUtils";
import { exportTasksPDF, exportTasksDOC, exportTasksCSV } from "@/lib/exporters";
import { toast } from "sonner";

interface Props {
  topics: Topic[];
  upcomingDays?: number;
}

type StatusFilter = TaskStatus | "all";

const STATUS_LABEL: Record<TaskStatus, string> = {
  pendente: "Pendente",
  em_andamento: "Em andamento",
  concluida: "Concluída",
  atrasada: "Atrasada",
};

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const formatDate = (iso?: string) => {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleDateString("pt-BR"); } catch { return iso; }
};

const toMidnight = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };

export function TaskCalendar({ topics, upcomingDays = 7 }: Props) {
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const allTasks = useMemo(() => flattenTasks(topics).filter(t => t.task.dueDate), [topics]);

  const hasFilters = statusFilter !== "all" || dateFrom !== "" || dateTo !== "";

  const filteredTasks = useMemo(() => {
    const from = dateFrom ? toMidnight(new Date(dateFrom)) : null;
    const to = dateTo ? toMidnight(new Date(dateTo)) : null;
    return allTasks.filter(t => {
      if (statusFilter !== "all" && effectiveStatus(t.task) !== statusFilter) return false;
      if (from || to) {
        const d = toMidnight(new Date(t.task.dueDate!));
        if (from && d.getTime() < from.getTime()) return false;
        if (to && d.getTime() > to.getTime()) return false;
      }
      return true;
    });
  }, [allTasks, statusFilter, dateFrom, dateTo]);

  const overdue = useMemo(() => filteredTasks.filter(t => isOverdue(t.task)), [filteredTasks]);
  const upcoming = useMemo(() => {
    return filteredTasks
      .filter(t => {
        const d = daysUntil(t.task.dueDate);
        return d !== null && d >= 0 && d <= upcomingDays && t.task.status !== "concluida";
      })
      .sort((a, b) => (a.task.dueDate! < b.task.dueDate! ? -1 : 1));
  }, [filteredTasks, upcomingDays]);

  const tasksOnSelectedDay = useMemo(() => {
    if (!selected) return [];
    return filteredTasks.filter(t => sameDay(new Date(t.task.dueDate!), selected));
  }, [filteredTasks, selected]);

  const overdueDays = overdue.map(t => new Date(t.task.dueDate!));
  const upcomingDays_ = upcoming.map(t => new Date(t.task.dueDate!));
  const completedDays = filteredTasks
    .filter(t => t.task.status === "concluida")
    .map(t => new Date(t.task.dueDate!));

  const filtersLabel = useMemo(() => {
    const parts: string[] = [];
    if (statusFilter !== "all") parts.push(`Status: ${STATUS_LABEL[statusFilter]}`);
    if (dateFrom) parts.push(`De: ${formatDate(dateFrom)}`);
    if (dateTo) parts.push(`Até: ${formatDate(dateTo)}`);
    return parts.length ? parts.join(" · ") : "Sem filtros (todas as tarefas com prazo)";
  }, [statusFilter, dateFrom, dateTo]);

  const clearFilters = () => { setStatusFilter("all"); setDateFrom(""); setDateTo(""); };

  const handleExport = (fn: (tasks: FlatTask[], meta: { title: string; filtersLabel: string }) => void, label: string) => () => {
    try {
      fn(filteredTasks, { title: "PAACI 2026 — Calendário de prazos", filtersLabel });
      toast.success(`Relatório ${label} gerado`, {
        description: `${filteredTasks.length} tarefa(s) exportada(s) em ${new Date().toLocaleString("pt-BR")}`,
      });
    } catch {
      toast.error("Falha ao gerar relatório");
    }
  };

  return (
    <Card className="p-5 bg-gradient-card shadow-soft border-border/60">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold">Calendário de prazos</h2>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-soft">
              <Download className="h-4 w-4 mr-2" /> Exportar filtrado ({filteredTasks.length})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Exportar tarefas filtradas</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleExport(exportTasksPDF, "PDF")}>
              <FileType2 className="h-4 w-4 mr-2 text-destructive" /> PDF (.pdf)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExport(exportTasksDOC, "Word")}>
              <FileText className="h-4 w-4 mr-2 text-primary" /> Word (.doc)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExport(exportTasksCSV, "CSV")}>
              <FileSpreadsheet className="h-4 w-4 mr-2 text-success" /> Planilha (.csv)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-end gap-3 p-3 mb-5 rounded-lg border border-border bg-background/60">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground pr-1 self-center">
          <Filter className="h-4 w-4" /> Filtros
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="cal-status" className="text-xs">Status</Label>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <SelectTrigger id="cal-status" className="w-[180px] h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="em_andamento">Em andamento</SelectItem>
              <SelectItem value="concluida">Concluída</SelectItem>
              <SelectItem value="atrasada">Atrasada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="cal-from" className="text-xs">Prazo de</Label>
          <Input id="cal-from" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-9 w-[160px]" />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="cal-to" className="text-xs">Prazo até</Label>
          <Input id="cal-to" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-9 w-[160px]" />
        </div>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
            <X className="h-4 w-4 mr-1" /> Limpar
          </Button>
        )}

        <div className="ml-auto text-xs text-muted-foreground self-center">
          {filteredTasks.length} tarefa(s) · {filtersLabel}
        </div>
      </div>

      <div className="grid lg:grid-cols-[auto,1fr] gap-6">
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={setSelected}
            className={cn("p-3 pointer-events-auto rounded-md border border-border bg-background")}
            modifiers={{
              overdue: overdueDays,
              upcoming: upcomingDays_,
              completed: completedDays,
            }}
            modifiersClassNames={{
              overdue: "bg-destructive/15 text-destructive font-bold border border-destructive/40",
              upcoming: "bg-accent/30 text-accent-foreground font-semibold border border-accent/50",
              completed: "bg-success/15 text-success font-medium",
            }}
          />
        </div>

        <div className="space-y-4 min-w-0">
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-destructive/30 border border-destructive/40" /> Atrasada</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-accent/40 border border-accent/50" /> A vencer ({upcomingDays}d)</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-success/30" /> Concluída</span>
          </div>

          <Section
            icon={<CalendarClock className="h-4 w-4 text-primary" />}
            title={selected ? `Tarefas em ${selected.toLocaleDateString("pt-BR")}` : "Selecione uma data"}
            empty="Nenhuma tarefa nesta data."
            tasks={tasksOnSelectedDay}
          />

          <Section
            icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
            title={`Tarefas atrasadas (${overdue.length})`}
            empty="Nenhuma tarefa atrasada. 🎉"
            tasks={overdue}
            tone="destructive"
          />

          <Section
            icon={<CalendarClock className="h-4 w-4 text-accent" />}
            title={`A vencer nos próximos ${upcomingDays} dias (${upcoming.length})`}
            empty="Nenhuma tarefa a vencer no período."
            tasks={upcoming}
            showDaysLeft
          />
        </div>
      </div>
    </Card>
  );
}

function Section({
  icon, title, empty, tasks, tone, showDaysLeft,
}: {
  icon: React.ReactNode;
  title: string;
  empty: string;
  tasks: FlatTask[];
  tone?: "destructive";
  showDaysLeft?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
      </div>
      {tasks.length === 0 ? (
        <p className="text-xs text-muted-foreground italic pl-6">{empty}</p>
      ) : (
        <ul className="space-y-2 max-h-56 overflow-auto pr-1">
          {tasks.map(t => {
            const d = daysUntil(t.task.dueDate);
            return (
              <li
                key={t.task.id}
                className={cn(
                  "p-3 rounded-md border bg-background text-sm",
                  tone === "destructive" ? "border-destructive/30" : "border-border",
                )}
              >
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{t.task.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {t.topicCode} · {t.activityTitle}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      📅 {formatDate(t.task.dueDate)}
                      {showDaysLeft && d !== null && (
                        <span className="ml-2">
                          {d === 0 ? "vence hoje" : d === 1 ? "vence amanhã" : `em ${d} dias`}
                        </span>
                      )}
                      {t.task.responsible && <span className="ml-2">👤 {t.task.responsible}</span>}
                    </div>
                  </div>
                  <StatusBadge status={effectiveStatus(t.task)} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
