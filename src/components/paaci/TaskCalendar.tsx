import { useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { AlertTriangle, CalendarClock, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Topic } from "@/types/paaci";
import { flattenTasks, isOverdue, daysUntil, effectiveStatus, type FlatTask } from "@/lib/taskUtils";

interface Props {
  topics: Topic[];
  upcomingDays?: number;
}

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const formatDate = (iso?: string) => {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleDateString("pt-BR"); } catch { return iso; }
};

export function TaskCalendar({ topics, upcomingDays = 7 }: Props) {
  const [selected, setSelected] = useState<Date | undefined>(new Date());

  const tasks = useMemo(() => flattenTasks(topics).filter(t => t.task.dueDate), [topics]);

  const overdue = useMemo(() => tasks.filter(t => isOverdue(t.task)), [tasks]);
  const upcoming = useMemo(() => {
    return tasks
      .filter(t => {
        const d = daysUntil(t.task.dueDate);
        return d !== null && d >= 0 && d <= upcomingDays && t.task.status !== "concluida";
      })
      .sort((a, b) => (a.task.dueDate! < b.task.dueDate! ? -1 : 1));
  }, [tasks, upcomingDays]);

  const tasksOnSelectedDay = useMemo(() => {
    if (!selected) return [];
    return tasks.filter(t => sameDay(new Date(t.task.dueDate!), selected));
  }, [tasks, selected]);

  // Build modifier dates
  const overdueDays = overdue.map(t => new Date(t.task.dueDate!));
  const upcomingDays_ = upcoming.map(t => new Date(t.task.dueDate!));
  const completedDays = tasks
    .filter(t => t.task.status === "concluida")
    .map(t => new Date(t.task.dueDate!));

  return (
    <Card className="p-5 bg-gradient-card shadow-soft border-border/60">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold">Calendário de prazos</h2>
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
          {/* Legenda */}
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-destructive/30 border border-destructive/40" /> Atrasada</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-accent/40 border border-accent/50" /> A vencer ({upcomingDays}d)</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-success/30" /> Concluída</span>
          </div>

          {/* Tarefas do dia selecionado */}
          <Section
            icon={<CalendarClock className="h-4 w-4 text-primary" />}
            title={selected ? `Tarefas em ${selected.toLocaleDateString("pt-BR")}` : "Selecione uma data"}
            empty="Nenhuma tarefa nesta data."
            tasks={tasksOnSelectedDay}
          />

          {/* Atrasadas */}
          <Section
            icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
            title={`Tarefas atrasadas (${overdue.length})`}
            empty="Nenhuma tarefa atrasada. 🎉"
            tasks={overdue}
            tone="destructive"
          />

          {/* A vencer */}
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
