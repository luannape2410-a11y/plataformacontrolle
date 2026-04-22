import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet, FileType2 } from "lucide-react";
import { exportPDF, exportDOC, exportCSV } from "@/lib/exporters";
import { toast } from "sonner";
import type { Topic } from "@/types/paaci";

export function ExportMenu({ topics }: { topics: Topic[] }) {
  const wrap = (fn: () => void, label: string) => () => {
    try {
      fn();
      toast.success(`Relatório ${label} gerado`, {
        description: `Arquivo baixado em ${new Date().toLocaleString("pt-BR")}`,
      });
    } catch (e) {
      toast.error("Falha ao gerar relatório");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-soft">
          <Download className="h-4 w-4 mr-2" /> Gerar relatório
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Exportar PAACI</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={wrap(() => exportPDF(topics), "PDF")}>
          <FileType2 className="h-4 w-4 mr-2 text-destructive" /> PDF (.pdf)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={wrap(() => exportDOC(topics), "Word")}>
          <FileText className="h-4 w-4 mr-2 text-primary" /> Word (.doc)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={wrap(() => exportCSV(topics), "CSV")}>
          <FileSpreadsheet className="h-4 w-4 mr-2 text-success" /> Planilha (.csv)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
