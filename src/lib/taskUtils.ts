import type { Topic, Task, TaskStatus } from "@/types/paaci";

export interface FlatTask {
  task: Task;
  topicId: string;
  topicCode: string;
  topicTitle: string;
  activityId: string;
  activityTitle: string;
}

export function flattenTasks(topics: Topic[]): FlatTask[] {
  const out: FlatTask[] = [];
  for (const t of topics) {
    for (const a of t.activities) {
      for (const tk of a.tasks) {
        out.push({
          task: tk,
          topicId: t.id,
          topicCode: t.code,
          topicTitle: t.title,
          activityId: a.id,
          activityTitle: a.title,
        });
      }
    }
  }
  return out;
}

export function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === "concluida") return false;
  const due = new Date(task.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return due.getTime() < today.getTime();
}

export function daysUntil(iso?: string): number | null {
  if (!iso) return null;
  const d = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}

export function effectiveStatus(task: Task): TaskStatus {
  if (task.status !== "concluida" && isOverdue(task)) return "atrasada";
  return task.status;
}

export type PeriodFilter = "all" | "day" | "week" | "month";

function periodRange(period: PeriodFilter): { start: Date; end: Date } | null {
  if (period === "all") return null;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);

  if (period === "day") {
    end.setDate(end.getDate() + 1);
  } else if (period === "week") {
    // Semana atual (segunda a domingo)
    const day = start.getDay(); // 0=Dom..6=Sab
    const diffToMonday = (day + 6) % 7;
    start.setDate(start.getDate() - diffToMonday);
    end.setTime(start.getTime());
    end.setDate(end.getDate() + 7);
  } else if (period === "month") {
    start.setDate(1);
    end.setTime(start.getTime());
    end.setMonth(end.getMonth() + 1);
  }
  return { start, end };
}

function taskInPeriod(task: Task, range: { start: Date; end: Date } | null): boolean {
  if (!range) return true;
  if (!task.dueDate) return false;
  const d = new Date(task.dueDate);
  d.setHours(0, 0, 0, 0);
  return d.getTime() >= range.start.getTime() && d.getTime() < range.end.getTime();
}

export function filterTasks(
  topics: Topic[],
  filters: {
    status: TaskStatus | "all";
    topicId: string | "all";
    activityId: string | "all";
    period: PeriodFilter;
  },
): Topic[] {
  const range = periodRange(filters.period);
  return topics
    .filter(t => filters.topicId === "all" || t.id === filters.topicId)
    .map(t => ({
      ...t,
      activities: t.activities
        .filter(a => filters.activityId === "all" || a.id === filters.activityId)
        .map(a => ({
          ...a,
          tasks: a.tasks.filter(tk =>
            (filters.status === "all" || effectiveStatus(tk) === filters.status) &&
            taskInPeriod(tk, range)
          ),
        })),
    }));
}
