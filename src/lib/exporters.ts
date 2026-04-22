import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import type { Topic, TaskStatus } from "@/types/paaci";
import type { FlatTask } from "./taskUtils";

const STATUS_LABEL: Record<TaskStatus, string> = {
  pendente: "Pendente",
  em_andamento: "Em andamento",
  concluida: "Concluída",
  atrasada: "Atrasada",
};

const formatDate = (iso?: string) => {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleDateString("pt-BR"); } catch { return iso; }
};

const generatedAt = () =>
  new Date().toLocaleString("pt-BR", { dateStyle: "long", timeStyle: "short" });

const fileStamp = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
};

export function exportPDF(topics: Topic[]) {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const created = generatedAt();

  doc.setFillColor(20, 56, 105);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 70, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("PAACI 2026 — Relatório de Acompanhamento", 40, 32);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Prefeitura Municipal de Vazante-MG · Controladoria Geral", 40, 50);
  doc.text(`Gerado em: ${created}`, 40, 62);

  let y = 90;
  doc.setTextColor(20, 30, 50);

  topics.forEach(topic => {
    if (y > 480) { doc.addPage(); y = 60; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(20, 56, 105);
    doc.text(`${topic.code}. ${topic.title}`, 40, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text(topic.description, 40, y, { maxWidth: 760 });
    y += 16;

    if (topic.activities.length === 0) {
      doc.text("(Sem atividades)", 40, y); y += 18; return;
    }

    const body: any[] = [];
    topic.activities.forEach(a => {
      body.push([
        { content: `${a.title}${a.custom ? "  [adicionada]" : ""}`, styles: { fontStyle: "bold" } },
        a.objective,
        a.period,
        `${a.tasks.length} tarefa(s)`,
      ]);
      a.tasks.forEach(tk => {
        body.push([
          { content: `   • ${tk.title}`, styles: { textColor: [60, 60, 60] } },
          tk.responsible || "—",
          formatDate(tk.dueDate),
          STATUS_LABEL[tk.status],
        ]);
      });
    });

    autoTable(doc, {
      startY: y,
      head: [["Atividade / Tarefa", "Responsável / Objetivo", "Prazo / Período", "Status / Tarefas"]],
      body,
      styles: { fontSize: 8.5, cellPadding: 5, valign: "top" },
      headStyles: { fillColor: [20, 56, 105], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 248, 252] },
      margin: { left: 40, right: 40 },
    });
    y = (doc as any).lastAutoTable.finalY + 18;
  });

  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(`Página ${i} de ${total}`, doc.internal.pageSize.getWidth() - 80, doc.internal.pageSize.getHeight() - 20);
  }

  doc.save(`PAACI_2026_Relatorio_${fileStamp()}.pdf`);
}

export function exportDOC(topics: Topic[]) {
  const created = generatedAt();
  const css = `
    body{font-family:Calibri,Arial,sans-serif;color:#1a2540;max-width:900px;margin:auto}
    h1{color:#143869;border-bottom:3px solid #f0b51a;padding-bottom:8px}
    h2{color:#143869;margin-top:24px;border-left:4px solid #f0b51a;padding-left:10px}
    .meta{color:#666;font-size:11pt;margin-bottom:24px}
    table{width:100%;border-collapse:collapse;margin:8px 0 18px;font-size:10pt}
    th{background:#143869;color:#fff;padding:6px;text-align:left}
    td{border:1px solid #ccd;padding:6px;vertical-align:top}
    .desc{color:#555;font-style:italic;margin-bottom:8px}
    .badge{font-size:9pt;color:#a06400}
  `;

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>PAACI 2026</title><style>${css}</style></head><body>
    <h1>PAACI 2026 — Relatório de Acompanhamento</h1>
    <p class="meta">Prefeitura Municipal de Vazante-MG · Controladoria Geral<br/>Gerado em: <strong>${created}</strong></p>
    ${topics.map(t => `
      <h2>${t.code}. ${t.title}</h2>
      <p class="desc">${t.description}</p>
      ${t.activities.length === 0 ? "<p>(Sem atividades)</p>" : t.activities.map(a => `
        <table>
          <tr><th colspan="2">${a.title} ${a.custom ? '<span class="badge">[adicionada]</span>' : ""}</th></tr>
          <tr><td><strong>Objetivo</strong></td><td>${a.objective}</td></tr>
          <tr><td><strong>Período</strong></td><td>${a.period}</td></tr>
          <tr><td colspan="2">
            ${a.tasks.length === 0 ? "<em>Sem tarefas cadastradas.</em>" : `
              <table><tr><th>Tarefa</th><th>Responsável</th><th>Prazo</th><th>Status</th><th>Criada em</th></tr>
              ${a.tasks.map(tk => `<tr>
                <td>${tk.title}${tk.notes ? `<br/><small>${tk.notes}</small>` : ""}</td>
                <td>${tk.responsible || "—"}</td>
                <td>${formatDate(tk.dueDate)}</td>
                <td>${STATUS_LABEL[tk.status]}</td>
                <td>${formatDate(tk.createdAt)}</td>
              </tr>`).join("")}
              </table>`}
          </td></tr>
        </table>
      `).join("")}
    `).join("")}
  </body></html>`;

  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  saveAs(blob, `PAACI_2026_Relatorio_${fileStamp()}.doc`);
}

export function exportCSV(topics: Topic[]) {
  const created = generatedAt();
  const rows: string[][] = [];
  rows.push([`PAACI 2026 — Relatório gerado em ${created}`]);
  rows.push([]);
  rows.push(["Tópico", "Atividade", "Origem", "Objetivo", "Período", "Tarefa", "Responsável", "Prazo", "Status", "Tarefa criada em"]);

  topics.forEach(t => {
    if (t.activities.length === 0) {
      rows.push([`${t.code}. ${t.title}`, "", "", "", "", "", "", "", "", ""]);
    }
    t.activities.forEach(a => {
      const origin = a.custom ? "Adicionada" : "PAACI";
      if (a.tasks.length === 0) {
        rows.push([`${t.code}. ${t.title}`, a.title, origin, a.objective, a.period, "", "", "", "", ""]);
      } else {
        a.tasks.forEach(tk => {
          rows.push([
            `${t.code}. ${t.title}`, a.title, origin, a.objective, a.period,
            tk.title, tk.responsible || "", formatDate(tk.dueDate), STATUS_LABEL[tk.status], formatDate(tk.createdAt),
          ]);
        });
      }
    });
  });

  const escape = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const csv = rows.map(r => r.map(c => escape(String(c))).join(";")).join("\r\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  saveAs(blob, `PAACI_2026_Relatorio_${fileStamp()}.csv`);
}
