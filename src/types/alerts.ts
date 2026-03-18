export interface AlertConfig {
  id: string;
  perfil_id: string | null;
  tipo_metrica: string;
  operador: string | null;
  threshold: number;
  ativo: boolean | null;
  created_at: string | null;
  perfil?: {
    id: string;
    nome: string;
    plataforma: string;
    cor_grafico: string | null;
  } | null;
}

export interface AlertConfigInput {
  perfil_id: string | null;
  tipo_metrica: string;
  operador: string;
  threshold: number;
  ativo: boolean;
}

export interface AlertHistorico {
  id: string;
  alerta_config_id: string | null;
  mensagem: string;
  valor_detectado: number | null;
  visualizado: boolean | null;
  created_at: string | null;
  config?: {
    id: string;
    tipo_metrica: string;
    perfil?: {
      id: string;
      nome: string;
      cor_grafico: string | null;
    } | null;
  } | null;
}

export interface AlertSummary {
  alertasAtivos: number;
  alertasDisparados: number;
  naoVisualizados: number;
}

export type AlertFilter = 'todos' | 'nao_lidos' | string;

export const TIPOS_METRICA = [
  { value: 'variacao_seguidores', label: 'Variação de seguidores' },
  { value: 'engajamento_post', label: 'Engajamento do post' },
  { value: 'posts_semana', label: 'Quantidade de posts na semana' },
  { value: 'taxa_engajamento', label: 'Taxa de engajamento' },
  { value: 'comentarios_post', label: 'Comentários por post' },
] as const;

export const OPERADORES = [
  { value: 'maior_que', label: 'Maior que', simbolo: '>' },
  { value: 'menor_que', label: 'Menor que', simbolo: '<' },
  { value: 'variacao_maior', label: 'Variação % maior que', simbolo: '+%' },
  { value: 'variacao_menor', label: 'Variação % menor que', simbolo: '-%' },
] as const;

export const getMetricaLabel = (value: string): string => {
  return TIPOS_METRICA.find(t => t.value === value)?.label || value;
};

export const getOperadorLabel = (value: string): string => {
  return OPERADORES.find(o => o.value === value)?.label || value;
};

export const getOperadorSimbolo = (value: string): string => {
  return OPERADORES.find(o => o.value === value)?.simbolo || value;
};
