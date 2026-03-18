export type WhatsAppCategoria = 'demanda' | 'elogio' | 'duvida' | 'critica' | 'informacao';
export type WhatsAppTema = 'saude' | 'educacao' | 'infraestrutura' | 'seguranca' | 'institucional' | 'outro';
export type WhatsAppSentimento = 'positivo' | 'neutro' | 'negativo';
export type WhatsAppStatus = 'nova' | 'lida' | 'respondida';

export interface WhatsAppMensagem {
  id: string;
  remetente_nome: string;
  remetente_telefone: string;
  mensagem: string;
  categoria: WhatsAppCategoria;
  tema: WhatsAppTema;
  sentimento: WhatsAppSentimento;
  status: WhatsAppStatus;
  data_recebimento: string;
  respondida: boolean;
}

export interface WhatsAppResumo {
  total_mensagens: number;
  novas: number;
  respondidas: number;
  taxa_resposta_pct: number;
  novos_remetentes: number;
  semana_referencia: string;
}

export interface WhatsAppFilters {
  categoria: WhatsAppCategoria | 'all';
  tema: WhatsAppTema | 'all';
  status: WhatsAppStatus | 'all';
}
