import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Calendar, Target, ListChecks, Sparkles } from "lucide-react";
import { ActivityDialog } from "./ActivityDialog";
import { TaskDialog } from "./TaskDialog";
import { StatusBadge } from "./StatusBadge";
import type { Topic } from "@/types/paaci";
import { usePaaci } from "@/hooks/usePaaci";

interface Props {
  topic: Topic;
  api: ReturnType<typeof usePaaci>;
}

const formatDate = (iso?: string) => {
  if (!iso) return "Sem prazo";
  try { return new Date(iso).toLocaleDateString("pt-BR"); } catch { return iso; }
};

export function TopicCard({ topic, api }: Props) {
  const totalTasks = topic.activities.reduce((s, a) => s + a.tasks.length, 0);
  const done = topic.activities.reduce((s, a) => s + a.tasks.filter(t => t.status === "concluida").length, 0);
  const pct = totalTasks ? Math.round((done / totalTasks) * 100) : 0;

  return (
    <Card className="overflow-hidden bg-gradient-card shadow-soft border-border/60 animate-fade-in">
      <div className="bg-gradient-hero p-5 text-primary-foreground">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-80">
              <span className="px-2 py-0.5 rounded bg-accent text-accent-foreground font-bold">{topic.code}</span>
              <span>Tópico do PAACI</span>
            </div>
            <h2 className="text-2xl font-bold mt-2">{topic.title}</h2>
            <p className="text-sm opacity-90 mt-1 max-w-2xl">{topic.description}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{topic.activities.length}</div>
            <div className="text-xs uppercase opacity-80">atividades</div>
            {totalTasks > 0 && (
              <div className="mt-2 text-xs opacity-90">{done}/{totalTasks} tarefas · {pct}%</div>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 space-y-3">
        <div className="flex justify-end">
          <ActivityDialog
            topicId={topic.id}
            onSubmit={(data) => api.addActivity(topic.id, data)}
          />
        </div>

        {topic.activities.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm">Nenhuma atividade cadastrada.</p>
        ) : (
          <Accordion type="multiple" className="space-y-2">
            {topic.activities.map(activity => (
              <AccordionItem
                key={activity.id}
                value={activity.id}
                className="border border-border rounded-lg px-3 bg-card data-[state=open]:shadow-soft transition-base"
              >
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex-1 text-left flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-foreground">{activity.title}</span>
                        {activity.custom && (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent/20 text-accent-foreground">
                            <Sparkles className="h-3 w-3" /> adicionada
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-3 flex-wrap">
                        <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{activity.period}</span>
                        <span className="inline-flex items-center gap-1"><ListChecks className="h-3 w-3" />{activity.tasks.length} tarefa(s)</span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/40 p-3 rounded-md">
                      <Target className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                      <span><strong className="text-foreground">Objetivo:</strong> {activity.objective}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Tarefas</h4>
                      <div className="flex gap-2">
                        <TaskDialog onSubmit={(data) => api.addTask(topic.id, activity.id, data)} />
                        <ActivityDialog
                          topicId={topic.id}
                          activity={activity}
                          onSubmit={(data) => api.updateActivity(topic.id, activity.id, data)}
                          trigger={<Button size="sm" variant="ghost"><Pencil className="h-4 w-4" /></Button>}
                        />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir atividade?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação removerá a atividade e todas as suas tarefas. Não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => api.deleteActivity(topic.id, activity.id)}>
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    {activity.tasks.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">Nenhuma tarefa cadastrada para esta atividade.</p>
                    ) : (
                      <div className="space-y-2">
                        {activity.tasks.map(task => (
                          <div key={task.id} className="flex items-start gap-3 p-3 rounded-md border border-border bg-background hover:border-primary/40 transition-base">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-sm">{task.title}</span>
                                <StatusBadge status={task.status} />
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3 flex-wrap">
                                {task.responsible && <span>👤 {task.responsible}</span>}
                                <span>📅 {formatDate(task.dueDate)}</span>
                                <span className="opacity-70">criada {formatDate(task.createdAt)}</span>
                              </div>
                              {task.notes && <p className="text-xs text-muted-foreground mt-1.5">{task.notes}</p>}
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <TaskDialog
                                task={task}
                                onSubmit={(data) => api.updateTask(topic.id, activity.id, task.id, data)}
                                trigger={<Button size="icon" variant="ghost" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>}
                              />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive">
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Excluir tarefa?</AlertDialogTitle>
                                    <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => api.deleteTask(topic.id, activity.id, task.id)}>
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </Card>
  );
}
