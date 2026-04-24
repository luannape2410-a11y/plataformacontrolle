export type TaskStatus = "pendente" | "em_andamento" | "concluida" | "atrasada";

export interface Task {
  id: string;
  title: string;
  responsible?: string;
  dueDate?: string;
  status: TaskStatus;
  notes?: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  title: string;
  objective: string;
  period: string;
  custom?: boolean; // true = added by user, false/undefined = from PAACI
  tasks: Task[];
}

export interface Topic {
  id: string;
  code: string; // e.g. "5.1"
  title: string;
  description: string;
  activities: Activity[];
}
