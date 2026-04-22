import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil } from "lucide-react";
import type { Activity } from "@/types/paaci";

interface Props {
  topicId: string;
  activity?: Activity;
  trigger?: React.ReactNode;
  onSubmit: (data: { title: string; objective: string; period: string }) => void;
}

export function ActivityDialog({ activity, trigger, onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(activity?.title ?? "");
  const [objective, setObjective] = useState(activity?.objective ?? "");
  const [period, setPeriod] = useState(activity?.period ?? "");

  const isEdit = !!activity;

  const handleSave = () => {
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), objective: objective.trim(), period: period.trim() });
    setOpen(false);
    if (!isEdit) { setTitle(""); setObjective(""); setPeriod(""); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" variant={isEdit ? "ghost" : "secondary"}>
            {isEdit ? <Pencil className="h-4 w-4" /> : <><Plus className="h-4 w-4 mr-1" /> Atividade</>}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar atividade" : "Nova atividade"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize os dados da atividade." : "Inclua uma atividade adicional ao tópico."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Descrição da atividade</Label>
            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="objective">Objetivo</Label>
            <Textarea id="objective" rows={3} value={objective} onChange={e => setObjective(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="period">Período de execução</Label>
            <Input id="period" placeholder="Ex.: 2º semestre / Trimestral" value={period} onChange={e => setPeriod(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave}>{isEdit ? "Salvar" : "Adicionar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
