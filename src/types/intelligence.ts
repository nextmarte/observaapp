// Types for the Intelligence page (/inteligencia)

// Menções monitoradas
export interface MentionPost {
  id: string;
  perfil_id: string | null;
  perfil_nome: string | null;
  perfil_tipo: string | null;
  plataforma: string;
  data_publicacao: string | null;
  conteudo_texto: string | null;
  url_post: string | null;
  url_midia: string | null;
  engajamento_total: number | null;
  curtidas: number | null;
  comentarios: number | null;
  compartilhamentos: number | null;
  sentimento: string | null;
  menciona_carlos: boolean | null;
  menciona_ana: boolean | null;
  menciona_diretoria: boolean | null;
  // legacy aliases maintained for backward compat
  menciona_fabio: boolean | null;
  menciona_antonio: boolean | null;
  menciona_reitoria: boolean | null;
  mencoes: string[] | null;
  categoria_estrategica: string | null;
  relevancia_campanha: string | null;
  tema: string | null;
}

// Inteligência da view fpobserva_vw_inteligencia_campanha
export interface IntelligenceItem {
  id: string | null;
  perfil: string | null;
  data_publicacao: string | null;
  conteudo_texto: string | null;
  categoria_estrategica: string | null;
  subcategoria: string | null;
  tipo_informacao: string | null;
  relevancia_campanha: string | null;
  mencoes: string[] | null;
  notas_campanha: string | null;
  engajamento: number | null;
}

// Resumo comentaristas da view fpobserva_vw_comentaristas_resumo
export interface CommentatorsSummary {
  total_comentaristas: number | null;
  comentaristas_fieis: number | null;
  comentam_multiplos_perfis: number | null;
  aliados: number | null;
  adversarios: number | null;
  neutros: number | null;
  indefinidos: number | null;
  novos_ultima_semana: number | null;
}

// Top comentaristas da view fpobserva_vw_top_comentaristas
export interface TopCommentator {
  nome_perfil: string | null;
  plataforma: string | null;
  total_comentarios: number | null;
  primeira_aparicao: string | null;
  ultima_aparicao: string | null;
  perfis_comentados: string[] | null;
  classificacao: string | null;
  dias_ativo: number | null;
}

// Renovação por semana da view fpobserva_vw_renovacao_comentaristas
export interface RenewalData {
  perfil: string | null;
  semana: string | null;
  total_comentaristas: number | null;
  novos_comentaristas: number | null;
  recorrentes: number | null;
  taxa_renovacao_pct: number | null;
}

// Filter states
export interface MentionsFiltersState {
  dataInicio: Date | null;
  dataFim: Date | null;
  tipoMencao: 'todos' | 'cm' | 'ar' | 'diretoria';
  perfilOrigem: string | null;
  sentimento: string | null;
}

export interface ProblemsFiltersState {
  categoriaEstrategica: string | null;
  relevancia: string | null;
  tipoInformacao: string | null;
  perfil: string | null;
}

export interface CommentersFiltersState {
  perfilComentado: string | null;
  classificacao: string | null;
  plataforma: string | null;
}

// Menção INSMED/HU (tema prioritário)
export interface EbserhMention {
  id: string | null;
  perfil_id: string | null;
  perfil_nome: string | null;
  perfil_tipo: string | null;
  plataforma: string | null;
  data_publicacao: string | null;
  conteudo_texto: string | null;
  engajamento_total: number | null;
  curtidas: number | null;
  comentarios: number | null;
  compartilhamentos: number | null;
  sentimento: string | null;
  relevancia_campanha: string | null;
  tipo_mencao_ebserh: string | null;
  tom_ebserh: string | null;
  notas_campanha: string | null;
}

// Resumo INSMED/HU para o card monitor
export interface EbserhSummary {
  totalMencoes: number;
  sentimentoPredominante: string;
  ultimaMencao: {
    data: string | null;
    perfil: string | null;
    conteudo: string | null;
  } | null;
  distribuicaoSentimento: {
    positivo: number;
    neutro: number;
    negativo: number;
  };
}

// Summary card data
export interface IntelligenceSummary {
  mencoesDiretoria: number;
  // legacy alias
  mencoesReitoria: number;
  problemasIdentificados: number;
  demandasPendentes: number;
  novosComentaristas: number;
  alertasAtivos: number;
}
