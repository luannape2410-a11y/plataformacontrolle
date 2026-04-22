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

export function filterTasks(
  topics: Topic[],
  filters: { status: TaskStatus | "all"; topicId: string | "all"; activityId: string | "all" },
): Topic[] {
  return topics
    .filter(t => filters.topicId === "all" || t.id === filters.topicId)
    .map(t => ({
      ...t,
      activities: t.activities
        .filter(a => filters.activityId === "all" || a.id === filters.activityId)
        .map(a => ({
          ...a,
          tasks: a.tasks.filter(tk => filters.status === "all" || effectiveStatus(tk) === filters.status),
        })),
    }));
}
