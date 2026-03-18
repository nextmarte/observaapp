export interface ProfileFiltersState {
  plataforma: string;
  tipo: string;
  ordenarPor: 'nome' | 'seguidores' | 'engajamento';
}

export interface ProfileWithMetrics {
  id: string;
  nome: string;
  plataforma: string;
  tipo: string;
  cor_grafico: string | null;
  url_perfil: string | null;
  ativo: boolean | null;
  created_at: string | null;
  // Métricas calculadas
  seguidoresAtuais: number;
  seguidoresAnteriores: number;
  variacaoSeguidores: number;
  postsSemana: number;
  engajamentoSemana: number;
}

export interface Coleta {
  id: string;
  perfil_id: string | null;
  data_coleta: string;
  semana_ano: string;
  seguidores: number | null;
  seguindo: number | null;
  total_posts: number | null;
  created_at: string | null;
}

export interface WeeklyEngagement {
  semana_ano: string;
  engajamento: number;
}

export interface ProfileSummary {
  totalPerfisAtivos: number;
  totalSeguidores: number;
  maiorCrescimento: {
    nome: string;
    variacao: number;
  } | null;
  maiorEngajamento: {
    nome: string;
    engajamento: number;
  } | null;
}
