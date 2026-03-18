export interface ReportConfig {
  titulo: string;
  periodoInicio: Date;
  periodoFim: Date;
  perfilIds: string[];
  tipo: 'resumo' | 'completo' | 'comparativo';
}

export interface ProfileMetrics {
  id: string;
  nome: string;
  plataforma: string;
  tipo: string;
  cor_grafico: string | null;
  seguidores: number;
  totalPosts: number;
  curtidas: number;
  comentarios: number;
  compartilhamentos: number;
  engajamento: number;
  taxaEngajamento: number;
}

export interface WeeklyData {
  semana: string;
  posts: number;
  engajamento: number;
}

export interface ReportData {
  perfis: ProfileMetrics[];
  posts: Post[];
  topPosts: Post[];
  weeklyData: WeeklyData[];
  totais: {
    posts: number;
    curtidas: number;
    comentarios: number;
    compartilhamentos: number;
    engajamento: number;
  };
  comparativo: {
    fabio: ProfileMetrics | null;
    roberto: ProfileMetrics | null;
  };
}

export interface Post {
  id: string;
  perfil_id: string | null;
  perfil_nome?: string;
  data_publicacao: string;
  tipo: string | null;
  curtidas: number | null;
  comentarios: number | null;
  compartilhamentos: number | null;
  engajamento_total: number | null;
  conteudo_texto: string | null;
}

export interface Report {
  id: string;
  titulo: string;
  periodo_inicio: string | null;
  periodo_fim: string | null;
  gerado_por: string | null;
  created_at: string | null;
  url_arquivo: string | null;
}

export interface HistoryFilters {
  dataInicio: Date | null;
  dataFim: Date | null;
  busca: string;
}
