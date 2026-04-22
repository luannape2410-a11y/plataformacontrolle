import { useMemo } from "react";
import { usePaaci } from "@/hooks/usePaaci";
import { TopicCard } from "@/components/paaci/TopicCard";
import { ExportMenu } from "@/components/paaci/ExportMenu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ShieldCheck, ListTodo, CheckCircle2, AlertTriangle, RotateCcw } from "lucide-react";

const Index = () => {
  const api = usePaaci();
  const { topics } = api;

  const stats = useMemo(() => {
    const activities = topics.reduce((s, t) => s + t.activities.length, 0);
    const tasks = topics.reduce((s, t) => s + t.activities.reduce((s2, a) => s2 + a.tasks.length, 0), 0);
    const done = topics.reduce((s, t) => s + t.activities.reduce((s2, a) => s2 + a.tasks.filter(tk => tk.status === "concluida").length, 0), 0);
    const late = topics.reduce((s, t) => s + t.activities.reduce((s2, a) => s2 + a.tasks.filter(tk => tk.status === "atrasada").length, 0), 0);
    return { activities, tasks, done, late, pct: tasks ? Math.round((done / tasks) * 100) : 0 };
  }, [topics]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground border-b-4 border-accent shadow-elegant">
        <div className="container py-8">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] opacity-90">
                <ShieldCheck className="h-4 w-4" />
                Controladoria Geral · Vazante-MG
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mt-2">PAACI 2026</h1>
              <p className="text-lg opacity-90 mt-1 max-w-2xl">
                Painel interativo de acompanhamento do Plano Anual de Atividades de Controle Interno.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
                    <RotateCcw className="h-4 w-4 mr-2" /> Restaurar PAACI
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Restaurar dados originais do PAACI?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Todas as atividades e tarefas adicionadas serão removidas e o painel voltará ao conteúdo original do PAACI 2026.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={api.reset}>Restaurar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <ExportMenu topics={topics} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            <StatCard icon={<ShieldCheck className="h-5 w-5" />} label="Tópicos" value={topics.length} />
            <StatCard icon={<ListTodo className="h-5 w-5" />} label="Atividades" value={stats.activities} />
            <StatCard icon={<CheckCircle2 className="h-5 w-5" />} label="Tarefas concluídas" value={`${stats.done}/${stats.tasks}`} sub={`${stats.pct}%`} />
            <StatCard icon={<AlertTriangle className="h-5 w-5" />} label="Tarefas atrasadas" value={stats.late} highlight={stats.late > 0} />
          </div>
        </div>
      </header>

      {/* Topics */}
      <main className="container py-8 space-y-6">
        {topics.map(topic => (
          <TopicCard key={topic.id} topic={topic} api={api} />
        ))}

        <footer className="text-center text-xs text-muted-foreground pt-8 pb-4">
          Painel construído a partir do PAACI 2026 — Prefeitura Municipal de Vazante-MG.<br />
          Os dados são salvos localmente no navegador. Use "Gerar relatório" para exportar.
        </footer>
      </main>
    </div>
  );
};

function StatCard({ icon, label, value, sub, highlight }: { icon: React.ReactNode; label: string; value: React.ReactNode; sub?: string; highlight?: boolean }) {
  return (
    <Card className={`p-4 bg-primary-foreground/10 border-primary-foreground/20 backdrop-blur ${highlight ? "ring-2 ring-accent" : ""}`}>
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide opacity-90 text-primary-foreground">
        {icon}{label}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-primary-foreground">{value}</span>
        {sub && <span className="text-sm opacity-80 text-primary-foreground">{sub}</span>}
      </div>
    </Card>
  );
}

export default Index;
