export interface ComparisonProfile {
  id: string;
  nome: string;
  plataforma: string;
  tipo: string;
  cor_grafico: string | null;
}

export interface ComparisonMetrics {
  seguidores: number;
  totalPosts: number;
  postsUltimaSemana: number;
  totalCurtidas: number;
  totalComentarios: number;
  totalCompartilhamentos: number;
  engajamentoTotal: number;
  taxaEngajamento: number;
  mediaCurtidasPorPost: number;
  mediaComentariosPorPost: number;
}

export interface ComparisonState {
  profileAId: string | null;
  profileBId: string | null;
  includeInstagram: boolean;
}

export interface PostTypeDistribution {
  tipo: string;
  count: number;
  percentage: number;
}
