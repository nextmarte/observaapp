export interface Post {
  id: string;
  perfil_id: string | null;
  plataforma: string;
  data_publicacao: string;
  tipo: string | null;
  conteudo_texto: string | null;
  url_post: string | null;
  url_midia: string | null;
  curtidas: number | null;
  comentarios: number | null;
  compartilhamentos: number | null;
  alcance: number | null;
  engajamento_total: number | null;
  tema: string | null;
  sentimento: string | null;
  destaque: boolean | null;
  coleta_id: string | null;
  created_at: string | null;
  // Novos campos de campanha
  categoria_estrategica: string | null;
  subcategoria: string | null;
  relevancia_campanha: string | null;
  tipo_informacao: string | null;
  mencoes: string[] | null;
  notas_campanha: string | null;
  perfil?: {
    id: string;
    nome: string;
    cor_grafico: string | null;
  };
}

export interface PostComment {
  id: string;
  post_id: string | null;
  autor: string | null;
  conteudo: string;
  data_comentario: string | null;
  curtidas: number | null;
  sentimento: string | null;
  relevante: boolean | null;
}

export interface PostsFiltersState {
  dataInicio: Date | null;
  dataFim: Date | null;
  perfilId: string | null;
  plataforma: string | null;
  tipo: string | null;
  sentimento: string | null;
  // Novos filtros
  categoriaEstrategica: string | null;
  relevancia: string | null;
  tipoInformacao: string | null;
}

export type SortDirection = 'asc' | 'desc';

export interface PostsSortState {
  column: string;
  direction: SortDirection;
}
