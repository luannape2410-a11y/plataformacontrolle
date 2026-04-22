import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil } from "lucide-react";
import type { Task, TaskStatus } from "@/types/paaci";

interface Props {
  task?: Task;
  trigger?: React.ReactNode;
  onSubmit: (data: Omit<Task, "id" | "createdAt">) => void;
}

export function TaskDialog({ task, trigger, onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task?.title ?? "");
  const [responsible, setResponsible] = useState(task?.responsible ?? "");
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "pendente");
  const [notes, setNotes] = useState(task?.notes ?? "");

  const isEdit = !!task;

  const handleSave = () => {
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), responsible: responsible.trim(), dueDate, status, notes: notes.trim() });
    setOpen(false);
    if (!isEdit) { setTitle(""); setResponsible(""); setDueDate(""); setStatus("pendente"); setNotes(""); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" variant={isEdit ? "ghost" : "outline"}>
            {isEdit ? <Pencil className="h-4 w-4" /> : <><Plus className="h-4 w-4 mr-1" /> Tarefa</>}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar tarefa" : "Nova tarefa"}</DialogTitle>
          <DialogDescription>
            Tarefas detalham as etapas operacionais de uma atividade do PAACI.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="t-title">Título da tarefa</Label>
            <Input id="t-title" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="t-resp">Responsável</Label>
              <Input id="t-resp" value={responsible} onChange={e => setResponsible(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="t-due">Prazo</Label>
              <Input id="t-due" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={v => setStatus(v as TaskStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em_andamento">Em andamento</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
                <SelectItem value="atrasada">Atrasada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="t-notes">Observações</Label>
            <Textarea id="t-notes" rows={3} value={notes} onChange={e => setNotes(e.target.value)} />
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
