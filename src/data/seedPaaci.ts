import type { Topic } from "@/types/paaci";

// Atividades extraídas do PAACI 2026 - Prefeitura de Vazante-MG
export const seedTopics: Topic[] = [
  {
    id: "t1",
    code: "5.1",
    title: "Consultoria e Apoio à Gestão",
    description: "Ações de orientação, padronização de procedimentos e apoio às áreas finalísticas.",
    activities: [
      {
        id: "a1-1",
        title: "Eventos orientativos sobre o papel do Controle Interno",
        objective: "Esclarecer responsabilidades dos gestores e fortalecer a cultura de controle.",
        period: "Ao longo de 2026",
        tasks: [],
      },
      {
        id: "a1-2",
        title: "Atendimento a consultas das secretarias",
        objective: "Apoiar gestores em dúvidas técnicas relacionadas a controle interno.",
        period: "Atividade contínua",
        tasks: [],
      },
      {
        id: "a1-3",
        title: "Revisão e proposição de normativos internos",
        objective: "Alinhar normativos às boas práticas e às orientações do TCE-MG.",
        period: "Ao longo de 2026",
        tasks: [],
      },
    ],
  },
  {
    id: "t2",
    code: "5.2",
    title: "Auditoria Interna (Avaliação)",
    description: "Trabalhos de avaliação independente em áreas de maior risco.",
    activities: [
      {
        id: "a2-1",
        title: "Auditoria em Contratações Públicas",
        objective: "Avaliar regularidade de processos licitatórios, dispensas e inexigibilidades.",
        period: "abril a julho/2026",
        tasks: [],
      },
      {
        id: "a2-2",
        title: "Auditoria em Obras Públicas",
        objective: "Verificar planejamento, execução, medições e fiscalização das obras.",
        period: "agosto a outubro/2026",
        tasks: [],
      },
      {
        id: "a2-3",
        title: "Auditoria na Gestão de Pessoal e Folha de Pagamento",
        objective: "Avaliar admissões, vantagens, jornada e conformidade legal.",
        period: "2º semestre",
        tasks: [],
      },
    ],
  },
  {
    id: "t3",
    code: "5.3",
    title: "Monitoramento",
    description: "Acompanhamento contínuo de limites legais, LRF e recomendações.",
    activities: [
      {
        id: "a3-1",
        title: "Monitoramento dos limites da LRF",
        objective: "Acompanhar despesa com pessoal e endividamento.",
        period: "Quadrimestral",
        tasks: [],
      },
      {
        id: "a3-2",
        title: "Acompanhamento dos índices constitucionais (saúde e educação)",
        objective: "Garantir o cumprimento dos pisos constitucionais.",
        period: "Trimestral",
        tasks: [],
      },
      {
        id: "a3-3",
        title: "Monitoramento das recomendações da Auditoria Interna nº 001/2025",
        objective: "Reduzir reincidência de falhas e consolidar melhorias.",
        period: "Trimestral",
        tasks: [],
      },
    ],
  },
  {
    id: "t4",
    code: "5.4",
    title: "Apoio ao Controle Externo",
    description: "Suporte às demandas do TCE-MG e à prestação de contas anual.",
    activities: [
      {
        id: "a4-1",
        title: "Apoio à elaboração da Prestação de Contas Anual",
        objective: "Cumprir exigências normativas do controle interno na PCA.",
        period: "Durante todo o exercício",
        tasks: [],
      },
      {
        id: "a4-2",
        title: "Atendimento a diligências do TCE-MG",
        objective: "Responder tempestivamente a requisições do Tribunal.",
        period: "Conforme demanda",
        tasks: [],
      },
    ],
  },
  {
    id: "t5",
    code: "5.5",
    title: "Macrofunções do Controle Interno",
    description: "Controladoria, Ouvidoria, Transparência, Integridade e Gestão de Riscos.",
    activities: [
      {
        id: "a5-1",
        title: "Acompanhamento da Ouvidoria Municipal",
        objective: "Avaliar fluxos, prazos de resposta e relatórios.",
        period: "2º e 3º trimestres",
        tasks: [],
      },
      {
        id: "a5-2",
        title: "Avaliação do Portal da Transparência",
        objective: "Verificar conformidade com a LAI e LC 131/2009.",
        period: "Semestral",
        tasks: [],
      },
      {
        id: "a5-3",
        title: "Implantação de rotina de gestão de riscos",
        objective: "Mapear e tratar riscos das áreas-chave da gestão.",
        period: "2º semestre",
        tasks: [],
      },
      {
        id: "a5-4",
        title: "Sistematização de registro e monitoramento de recomendações",
        objective: "Permitir o controle efetivo da execução do PAACI.",
        period: "Atividade contínua",
        tasks: [],
      },
    ],
  },
  {
    id: "t6",
    code: "6",
    title: "Capacitação da Equipe",
    description: "Aperfeiçoamento técnico contínuo da Controladoria.",
    activities: [
      {
        id: "a6-1",
        title: "Curso de Elaboração de Relatório Anual e Prestação de Contas",
        objective: "Capacitar a equipe nas exigências do TCE-MG.",
        period: "1º semestre",
        tasks: [],
      },
      {
        id: "a6-2",
        title: "Curso de Auditoria Interna Governamental",
        objective: "Aperfeiçoar a atuação na terceira linha (avaliação).",
        period: "1º semestre",
        tasks: [],
      },
    ],
  },
  {
    id: "t7",
    code: "7",
    title: "Demandas Extraordinárias",
    description: "Denúncias, representações, requisições do TCE-MG, MP e Câmara.",
    activities: [
      {
        id: "a7-1",
        title: "Apuração de denúncias e representações",
        objective: "Atender demandas externas e internas de forma imediata.",
        period: "Conforme demanda",
        tasks: [],
      },
    ],
  },
];
