export interface Profile {
  id: string;
  nome: string;
  plataforma: string;
  tipo: string;
  cor_grafico: string | null;
  ativo: boolean | null;
  url_perfil: string | null;
  created_at: string | null;
}

export interface WeeklySummary {
  perfil_id: string | null;
  nome: string | null;
  tipo: string | null;
  cor_grafico: string | null;
  semana_ano: string | null;
  data_coleta: string | null;
  seguidores: number | null;
  seguidores_anterior: number | null;
  variacao_seguidores: number | null;
  posts_semana: number | null;
  engajamento_semana: number | null;
}

export interface HistoricalEngagement {
  perfil_id: string | null;
  nome: string | null;
  tipo: string | null;
  cor_grafico: string | null;
  semana_ano: string | null;
  data_coleta: string | null;
  engajamento_acumulado: number | null;
}

export interface RecentPost {
  id: string | null;
  perfil_id: string | null;
  perfil_nome: string | null;
  perfil_tipo: string | null;
  cor_grafico: string | null;
  plataforma: string | null;
  data_publicacao: string | null;
  tipo: string | null;
  conteudo_texto: string | null;
  curtidas: number | null;
  comentarios: number | null;
  compartilhamentos: number | null;
  engajamento_total: number | null;
  url_post: string | null;
  url_midia: string | null;
  destaque: boolean | null;
  sentimento: string | null;
  tema: string | null;
}

export interface MetricCardData {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

// Score semanal da view fpobserva_vw_score_semanal
export interface WeeklyScore {
  perfil: string | null;
  perfil_tipo: string | null;
  semana: string | null;
  total_posts: number | null;
  engajamento_total: number | null;
  engajamento_medio: number | null;
}

// Engajamento por tipo da view fpobserva_vw_engajamento_por_tipo
export interface EngagementByType {
  perfil: string | null;
  tipo: string | null;
  total_posts: number | null;
  engajamento_total: number | null;
  engajamento_medio: number | null;
}

// Renovação comentaristas
export interface CommentersRenewal {
  perfil: string | null;
  semana: string | null;
  total_comentaristas: number | null;
  novos_comentaristas: number | null;
  recorrentes: number | null;
  taxa_renovacao_pct: number | null;
}

// Menção reitoria para preview
export interface MentionPreview {
  id: string | null;
  perfil_nome: string | null;
  data_publicacao: string | null;
  conteudo_texto: string | null;
  sentimento: string | null;
  menciona_fabio: boolean | null;
  menciona_antonio: boolean | null;
  menciona_reitoria: boolean | null;
}

// Resumo consolidado da view fpobserva_vw_dashboard_resumo
export interface DashboardResumo {
  posts_semana: number | null;
  engajamento_total: number | null;
  media_por_post: number | null;
  posts_hoje: number | null;
  semana_referencia: string | null;
}
