// ============================================================
// ObservaApp — Mock Data
// Todos os dados são fictícios para fins de demonstração.
// ============================================================

import { addDays, subDays, subWeeks, format } from 'date-fns';

// --------------- helpers ---------------
const today = new Date('2026-03-01');
const fmt = (d: Date) => format(d, "yyyy-MM-dd'T'HH:mm:ss");
const fmtDate = (d: Date) => format(d, 'yyyy-MM-dd');

// --------------- perfis ---------------
export const mockPerfis = [
  { id: 'p1', nome: 'Carlos Mendes - Facebook',   plataforma: 'facebook',  tipo: 'politico',  cor_grafico: '#3b82f6', ativo: true, url_perfil: null, created_at: '2025-01-01' },
  { id: 'p2', nome: 'Carlos Mendes - Instagram',  plataforma: 'instagram', tipo: 'politico',  cor_grafico: '#8b5cf6', ativo: true, url_perfil: null, created_at: '2025-01-01' },
  { id: 'p3', nome: 'Ana Ribeiro - Facebook',     plataforma: 'facebook',  tipo: 'politico',  cor_grafico: '#ef4444', ativo: true, url_perfil: null, created_at: '2025-01-01' },
  { id: 'p4', nome: 'Ana Ribeiro - Instagram',    plataforma: 'instagram', tipo: 'politico',  cor_grafico: '#f97316', ativo: true, url_perfil: null, created_at: '2025-01-01' },
  { id: 'p5', nome: 'Lucas Ferreira - Facebook',  plataforma: 'facebook',  tipo: 'oposicao',  cor_grafico: '#22c55e', ativo: true, url_perfil: null, created_at: '2025-01-01' },
  { id: 'p6', nome: 'Lucas Ferreira - Instagram', plataforma: 'instagram', tipo: 'oposicao',  cor_grafico: '#14b8a6', ativo: true, url_perfil: null, created_at: '2025-01-01' },
];

// --------------- coletas (followers over time) ---------------
function generateColetas(perfilId: string, baseSeguidores: number, semanas = 12) {
  const rows = [];
  for (let i = semanas; i >= 0; i--) {
    const weekDate = subWeeks(today, i);
    const semana_ano = `${weekDate.getFullYear()}-W${String(Math.ceil(weekDate.getDate() / 7)).padStart(2, '0')}`;
    const seguidores = baseSeguidores + Math.round((Math.random() - 0.3) * 200 * (semanas - i + 1));
    rows.push({
      id: `col-${perfilId}-${i}`,
      perfil_id: perfilId,
      data_coleta: fmtDate(weekDate),
      semana_ano,
      seguidores: Math.max(seguidores, baseSeguidores),
    });
  }
  return rows;
}

export const mockColetas = [
  ...generateColetas('p1', 48000, 12),
  ...generateColetas('p2', 22000, 12),
  ...generateColetas('p3', 31000, 12),
  ...generateColetas('p4', 15000, 12),
  ...generateColetas('p5', 27000, 12),
  ...generateColetas('p6', 12000, 12),
];

// --------------- posts ---------------
const postTexts = [
  'Trabalhamos juntos por uma cidade melhor e mais justa para todos os cidadãos.',
  'Participamos hoje de uma importante reunião sobre saúde pública e infraestrutura.',
  'Acompanhe ao vivo nossa sessão extraordinária sobre orçamento e investimentos.',
  'Visitamos a comunidade do bairro central e ouvimos as demandas da população.',
  'Apresentamos hoje nosso relatório de transparência com os dados do trimestre.',
  'Parabéns a todos os servidores pelo comprometimento e dedicação ao serviço público.',
  'Inauguramos o novo posto de saúde que vai atender milhares de famílias.',
  'Debatemos com lideranças comunitárias os projetos prioritários para o próximo semestre.',
  'Nosso mandato segue firme na defesa dos direitos fundamentais de cada cidadão.',
  'Aprovamos hoje o projeto de lei que garante mais recursos para a educação básica.',
  'Participei da abertura do novo centro cultural com grande alegria.',
  'Atualizando vocês sobre o andamento das obras de pavimentação na região.',
  'Reunião produtiva com a secretaria de obras para avançar nos projetos em andamento.',
  'Obrigado a todos que estiveram conosco no evento de ontem. Foi especial!',
  'Vamos continuar trabalhando com transparência e responsabilidade.',
];

const sentimentos = ['positivo', 'neutro', 'negativo'];
const tipos = ['foto', 'video', 'texto', 'link'];

function generatePosts(perfilId: string, perfilNome: string, plataforma: string, count = 20) {
  const rows = [];
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const date = subDays(today, daysAgo);
    const curtidas = Math.floor(Math.random() * 800) + 10;
    const comentarios = Math.floor(Math.random() * 120) + 1;
    const compartilhamentos = Math.floor(Math.random() * 60) + 0;
    rows.push({
      id: `post-${perfilId}-${i}`,
      perfil_id: perfilId,
      perfil_nome: perfilNome,
      perfil_tipo: mockPerfis.find(p => p.id === perfilId)?.tipo || 'politico',
      cor_grafico: mockPerfis.find(p => p.id === perfilId)?.cor_grafico || '#3b82f6',
      plataforma,
      data_publicacao: fmt(date),
      tipo: tipos[Math.floor(Math.random() * tipos.length)],
      conteudo_texto: postTexts[i % postTexts.length],
      curtidas,
      comentarios,
      compartilhamentos,
      engajamento_total: curtidas + comentarios + compartilhamentos,
      url_post: null,
      url_midia: null,
      destaque: i < 3,
      sentimento: sentimentos[Math.floor(Math.random() * sentimentos.length)],
      tema: i % 5 === 0 ? 'saude' : i % 5 === 1 ? 'educacao' : i % 5 === 2 ? 'infraestrutura' : 'institucional',
    });
  }
  return rows;
}

export const mockPosts = [
  ...generatePosts('p1', 'Carlos Mendes - Facebook',   'facebook',  22),
  ...generatePosts('p2', 'Carlos Mendes - Instagram',  'instagram', 18),
  ...generatePosts('p3', 'Ana Ribeiro - Facebook',     'facebook',  20),
  ...generatePosts('p4', 'Ana Ribeiro - Instagram',    'instagram', 16),
  ...generatePosts('p5', 'Lucas Ferreira - Facebook',  'facebook',  20),
  ...generatePosts('p6', 'Lucas Ferreira - Instagram', 'instagram', 15),
];

// --------------- mentions (reitoria/diretoria view) ---------------
const mentionTexts = [
  'Carlos Mendes apresentou proposta importante sobre saúde pública na sessão de hoje.',
  'Ana Ribeiro questionou os gastos administrativos da Diretoria em reunião aberta.',
  'A gestão da Diretoria foi pauta central no debate desta semana.',
  'Carlos Mendes parabenizou a Diretoria pelo novo acordo institucional firmado.',
  'Discussão acalorada envolvendo Ana Ribeiro e representantes da Diretoria.',
  'Proposta de Carlos Mendes para reforma do setor administrativo ganha apoio.',
  'Ana Ribeiro defende mais transparência nas decisões da Diretoria.',
  'Reunião com a Diretoria resultou em acordo sobre novos investimentos.',
  'Carlos Mendes e Ana Ribeiro cobram posicionamento da Diretoria sobre o tema.',
  'Nota da Diretoria esclarece as dúvidas levantadas pelos gestores.',
];

export const mockMencoes = mentionTexts.map((texto, i) => {
  const daysAgo = Math.floor(Math.random() * 45);
  const date = subDays(today, daysAgo);
  const perfilIndex = i % 4;
  const perfil = mockPerfis[perfilIndex];
  const menciona_carlos = texto.includes('Carlos');
  const menciona_ana = texto.includes('Ana');
  const menciona_diretoria = texto.includes('Diretoria');
  return {
    id: `men-${i}`,
    perfil_id: perfil.id,
    perfil_nome: perfil.nome,
    perfil_tipo: perfil.tipo,
    plataforma: perfil.plataforma,
    data_publicacao: fmt(date),
    conteudo_texto: texto,
    url_post: null,
    url_midia: null,
    engajamento_total: Math.floor(Math.random() * 300) + 5,
    curtidas: Math.floor(Math.random() * 200) + 2,
    comentarios: Math.floor(Math.random() * 80) + 1,
    compartilhamentos: Math.floor(Math.random() * 40) + 0,
    sentimento: sentimentos[i % 3],
    menciona_carlos,
    menciona_ana,
    menciona_diretoria,
    mencoes: [
      ...(menciona_carlos ? ['Carlos Mendes'] : []),
      ...(menciona_ana ? ['Ana Ribeiro'] : []),
      ...(menciona_diretoria ? ['Diretoria'] : []),
    ],
    categoria_estrategica: i % 3 === 0 ? 'institucional' : i % 3 === 1 ? 'politico' : 'administrativo',
    relevancia_campanha: i % 3 === 0 ? 'alta' : i % 3 === 1 ? 'media' : 'baixa',
    tema: i % 4 === 0 ? 'saude' : i % 4 === 1 ? 'educacao' : i % 4 === 2 ? 'infraestrutura' : 'institucional',
    // Legacy field aliases kept for backward compat in components updated separately
    menciona_fabio: menciona_carlos,
    menciona_antonio: menciona_ana,
    menciona_reitoria: menciona_diretoria,
  };
});

// --------------- INSMED/HU mentions ---------------
const insmedTexts = [
  'INSMED/HU registra aumento significativo no número de atendimentos este mês.',
  'Gestores debatem a situação do INSMED/HU em audiência pública.',
  'Novo equipamento foi entregue ao INSMED/HU após campanha de arrecadação.',
  'Carlos Mendes cobra melhorias nas condições de trabalho do INSMED/HU.',
  'Funcionários do INSMED/HU realizam manifestação por reajuste salarial.',
  'Ana Ribeiro visita o INSMED/HU e ouve relatos de pacientes e servidores.',
  'INSMED/HU anuncia novo programa de atendimento especializado à população.',
  'Relatório aponta defasagem no orçamento destinado ao INSMED/HU.',
];

export const mockMencoesInsmed = insmedTexts.map((texto, i) => {
  const daysAgo = Math.floor(Math.random() * 40);
  const date = subDays(today, daysAgo);
  const perfil = mockPerfis[i % 4];
  return {
    id: `insmed-${i}`,
    perfil_id: perfil.id,
    perfil_nome: perfil.nome,
    perfil_tipo: perfil.tipo,
    plataforma: perfil.plataforma,
    data_publicacao: fmt(date),
    conteudo_texto: texto,
    engajamento_total: Math.floor(Math.random() * 250) + 10,
    curtidas: Math.floor(Math.random() * 180) + 5,
    comentarios: Math.floor(Math.random() * 60) + 1,
    compartilhamentos: Math.floor(Math.random() * 30) + 0,
    sentimento: sentimentos[i % 3],
    relevancia_campanha: i % 2 === 0 ? 'alta' : 'media',
    tipo_mencao_insmed: i % 2 === 0 ? 'critica' : 'informativa',
    // kept for backward compat with existing component references
    tipo_mencao_ebserh: i % 2 === 0 ? 'critica' : 'informativa',
    tom_insmed: i % 3 === 0 ? 'critico' : i % 3 === 1 ? 'favoravel' : 'neutro',
    tom_ebserh: i % 3 === 0 ? 'critico' : i % 3 === 1 ? 'favoravel' : 'neutro',
    notas_campanha: null,
  };
});

// --------------- commenters summary ---------------
export const mockCommentariosResumo = {
  total_comentaristas: 342,
  comentaristas_fieis: 89,
  comentam_multiplos_perfis: 47,
  aliados: 198,
  adversarios: 54,
  neutros: 90,
  indefinidos: 0,
  novos_ultima_semana: 23,
};

// --------------- top commenters ---------------
const commentatorNames = [
  'joaosilva88', 'mariasouza', 'pedroalves', 'anapaulacosta', 'fernandorocha',
  'carloshenrique', 'lucianecarvalho', 'marcelovieira', 'julianabatista', 'ricardolima',
];
export const mockTopComentaristas = commentatorNames.map((nome, i) => ({
  nome_perfil: nome,
  plataforma: i % 2 === 0 ? 'facebook' : 'instagram',
  total_comentarios: Math.floor(Math.random() * 80) + 5,
  primeira_aparicao: fmtDate(subDays(today, 120 - i * 10)),
  ultima_aparicao: fmtDate(subDays(today, i * 2)),
  perfis_comentados: i % 2 === 0 ? ['Carlos Mendes - Facebook'] : ['Carlos Mendes - Facebook', 'Ana Ribeiro - Facebook'],
  classificacao: i < 6 ? 'aliado' : i < 8 ? 'adversario' : 'neutro',
  dias_ativo: 120 - i * 10,
}));

// --------------- renewal by week ---------------
function generateRenewal(perfil: string, semanas = 8) {
  const rows = [];
  for (let i = semanas; i >= 0; i--) {
    const weekDate = subWeeks(today, i);
    const semana = fmtDate(weekDate);
    rows.push({
      perfil,
      semana,
      total_comentaristas: 280 + Math.floor(Math.random() * 80),
      novos_comentaristas: 15 + Math.floor(Math.random() * 20),
      recorrentes: 60 + Math.floor(Math.random() * 40),
      taxa_renovacao_pct: 20 + Math.floor(Math.random() * 30),
    });
  }
  return rows;
}

export const mockRenovacao = [
  ...generateRenewal('Carlos Mendes - Facebook'),
  ...generateRenewal('Ana Ribeiro - Facebook'),
  ...generateRenewal('Lucas Ferreira - Facebook'),
];

// --------------- weekly score ---------------
function generateScoreSemanal(perfil: string, perfilTipo: string, semanas = 8) {
  const rows = [];
  for (let i = semanas; i >= 0; i--) {
    const weekDate = subWeeks(today, i);
    const semana = fmtDate(weekDate);
    const total_posts = Math.floor(Math.random() * 8) + 2;
    const engajamento_total = Math.floor(Math.random() * 3000) + 200;
    rows.push({
      perfil,
      perfil_tipo: perfilTipo,
      semana,
      total_posts,
      engajamento_total,
      engajamento_medio: Math.round(engajamento_total / total_posts),
    });
  }
  return rows;
}

export const mockScoreSemanal = [
  ...generateScoreSemanal('Carlos Mendes - Facebook', 'politico'),
  ...generateScoreSemanal('Carlos Mendes - Instagram', 'politico'),
  ...generateScoreSemanal('Ana Ribeiro - Facebook', 'politico'),
  ...generateScoreSemanal('Lucas Ferreira - Facebook', 'oposicao'),
];

// --------------- engagement by type ---------------
export const mockEngajamentoPorTipo = [
  { perfil: 'Carlos Mendes - Facebook', tipo: 'foto',  total_posts: 14, engajamento_total: 8200, engajamento_medio: 586 },
  { perfil: 'Carlos Mendes - Facebook', tipo: 'video', total_posts: 6,  engajamento_total: 7100, engajamento_medio: 1183 },
  { perfil: 'Carlos Mendes - Facebook', tipo: 'texto', total_posts: 4,  engajamento_total: 1400, engajamento_medio: 350 },
  { perfil: 'Ana Ribeiro - Facebook',   tipo: 'foto',  total_posts: 11, engajamento_total: 5300, engajamento_medio: 482 },
  { perfil: 'Ana Ribeiro - Facebook',   tipo: 'video', total_posts: 5,  engajamento_total: 4800, engajamento_medio: 960 },
  { perfil: 'Lucas Ferreira - Facebook',tipo: 'foto',  total_posts: 9,  engajamento_total: 3900, engajamento_medio: 433 },
  { perfil: 'Lucas Ferreira - Facebook',tipo: 'video', total_posts: 4,  engajamento_total: 3100, engajamento_medio: 775 },
];

// --------------- intelligence (campanha) ---------------
const intelligenceItems = [
  { categoria: 'Oportunidade', subcategoria: 'Agenda positiva', tipo: 'destaque', relevancia: 'alta',   nota: 'Post com alto engajamento sobre inauguração.' },
  { categoria: 'Risco',        subcategoria: 'Crítica institucional', tipo: 'alerta',   relevancia: 'alta',   nota: 'Menção negativa ao tema saúde pública.' },
  { categoria: 'Neutro',       subcategoria: 'Informativo',       tipo: 'informacao', relevancia: 'media',  nota: 'Publicação de agenda semanal.' },
  { categoria: 'Oportunidade', subcategoria: 'Aliado ativo',      tipo: 'destaque',   relevancia: 'media',  nota: 'Comentarista aliado amplificou post.' },
  { categoria: 'Risco',        subcategoria: 'Desinformação',     tipo: 'alerta',     relevancia: 'alta',   nota: 'Compartilhamento de informação incorreta detectado.' },
];

export const mockInteligencia = intelligenceItems.map((item, i) => ({
  id: `intel-${i}`,
  perfil: mockPerfis[i % 4].nome,
  data_publicacao: fmt(subDays(today, i * 5)),
  conteudo_texto: postTexts[i % postTexts.length],
  categoria_estrategica: item.categoria,
  subcategoria: item.subcategoria,
  tipo_informacao: item.tipo,
  relevancia_campanha: item.relevancia,
  mencoes: ['Carlos Mendes', 'Diretoria'].slice(0, (i % 2) + 1),
  notas_campanha: item.nota,
  engajamento: Math.floor(Math.random() * 500) + 50,
}));

// --------------- dashboard resumo ---------------
export const mockDashboardResumo = {
  posts_semana: 18,
  engajamento_total: 12480,
  media_por_post: 693,
  posts_hoje: 3,
  semana_referencia: fmtDate(today),
};

// --------------- alertas ---------------
export const mockAlertas = [
  {
    id: 'alerta-1',
    titulo: 'Engajamento baixo',
    descricao: 'Carlos Mendes - Facebook ficou 3 dias sem postar',
    nivel: 'aviso',
    ativo: true,
    disparado: true,
    disparado_em: fmt(subDays(today, 2)),
    created_at: fmt(subDays(today, 30)),
  },
  {
    id: 'alerta-2',
    titulo: 'Pico de engajamento',
    descricao: 'Post de Ana Ribeiro atingiu mais de 500 curtidas',
    nivel: 'info',
    ativo: true,
    disparado: true,
    disparado_em: fmt(subDays(today, 1)),
    created_at: fmt(subDays(today, 20)),
  },
  {
    id: 'alerta-3',
    titulo: 'Menção crítica INSMED/HU',
    descricao: 'Detectada menção negativa ao INSMED/HU com alto engajamento',
    nivel: 'critico',
    ativo: true,
    disparado: true,
    disparado_em: fmt(subDays(today, 0)),
    created_at: fmt(subDays(today, 10)),
  },
];

export const mockAlertasConfig = [
  {
    id: 'config-1',
    nome: 'Dias sem postar',
    descricao: 'Alertar se perfil ficar mais de N dias sem postar',
    tipo: 'inatividade',
    threshold: 3,
    perfil_id: 'p1',
    ativo: true,
    created_at: fmt(subDays(today, 30)),
  },
  {
    id: 'config-2',
    nome: 'Engajamento alto',
    descricao: 'Alertar se um post atingir mais de 500 curtidas',
    tipo: 'engajamento',
    threshold: 500,
    perfil_id: null,
    ativo: true,
    created_at: fmt(subDays(today, 20)),
  },
];

// --------------- relatorios ---------------
export const mockRelatorios = [
  {
    id: 'rel-1',
    titulo: 'Relatório Semanal - Semana 08/2026',
    periodo_inicio: fmtDate(subDays(today, 14)),
    periodo_fim: fmtDate(subDays(today, 7)),
    gerado_por: 'admin@observaapp.com',
    created_at: fmt(subDays(today, 7)),
    url_arquivo: null,
  },
  {
    id: 'rel-2',
    titulo: 'Comparativo Fevereiro 2026',
    periodo_inicio: fmtDate(subDays(today, 45)),
    periodo_fim: fmtDate(subDays(today, 15)),
    gerado_por: 'admin@observaapp.com',
    created_at: fmt(subDays(today, 15)),
    url_arquivo: null,
  },
];

// --------------- resumo semanal (fpobserva_vw_resumo_semanal) ---------------
function generateResumoSemanal(
  perfilId: string,
  perfilNome: string,
  perfilTipo: string,
  corGrafico: string,
  baseSeguidores: number,
  semanas = 12
) {
  const rows = [];
  let prevSeguidores = baseSeguidores;
  for (let i = semanas; i >= 0; i--) {
    const weekDate = subWeeks(today, i);
    const semana_ano = `${weekDate.getFullYear()}-W${String(Math.ceil(weekDate.getDate() / 7)).padStart(2, '0')}`;
    const seguidores = Math.max(
      baseSeguidores + Math.round((Math.random() - 0.3) * 200 * (semanas - i + 1)),
      baseSeguidores
    );
    const posts_semana = Math.floor(Math.random() * 7) + 1;
    const engajamento_semana = Math.floor(Math.random() * 3000) + 200;
    rows.push({
      perfil_id: perfilId,
      nome: perfilNome,
      tipo: perfilTipo,
      cor_grafico: corGrafico,
      semana_ano,
      data_coleta: fmtDate(weekDate),
      seguidores,
      seguidores_anterior: prevSeguidores,
      variacao_seguidores: seguidores - prevSeguidores,
      posts_semana,
      engajamento_semana,
    });
    prevSeguidores = seguidores;
  }
  return rows;
}

export const mockResumoSemanal = [
  ...generateResumoSemanal('p1', 'Carlos Mendes - Facebook',   'politico',  '#3b82f6', 48000),
  ...generateResumoSemanal('p2', 'Carlos Mendes - Instagram',  'politico',  '#8b5cf6', 22000),
  ...generateResumoSemanal('p3', 'Ana Ribeiro - Facebook',     'politico',  '#ef4444', 31000),
  ...generateResumoSemanal('p4', 'Ana Ribeiro - Instagram',    'politico',  '#f97316', 15000),
  ...generateResumoSemanal('p5', 'Lucas Ferreira - Facebook',  'oposicao',  '#22c55e', 27000),
  ...generateResumoSemanal('p6', 'Lucas Ferreira - Instagram', 'oposicao',  '#14b8a6', 12000),
];

// --------------- engajamento histórico (fpobserva_vw_engajamento_historico) ---------------
function generateEngajamentoHistorico(
  perfilId: string,
  perfilNome: string,
  perfilTipo: string,
  corGrafico: string,
  baseAcumulado: number,
  semanas = 12
) {
  const rows = [];
  let acumulado = baseAcumulado;
  for (let i = semanas; i >= 0; i--) {
    const weekDate = subWeeks(today, i);
    const semana_ano = `${weekDate.getFullYear()}-W${String(Math.ceil(weekDate.getDate() / 7)).padStart(2, '0')}`;
    acumulado += Math.floor(Math.random() * 3000) + 200;
    rows.push({
      perfil_id: perfilId,
      nome: perfilNome,
      tipo: perfilTipo,
      cor_grafico: corGrafico,
      semana_ano,
      data_coleta: fmtDate(weekDate),
      engajamento_acumulado: acumulado,
    });
  }
  return rows;
}

export const mockEngajamentoHistorico = [
  ...generateEngajamentoHistorico('p1', 'Carlos Mendes - Facebook',   'politico',  '#3b82f6', 12000),
  ...generateEngajamentoHistorico('p2', 'Carlos Mendes - Instagram',  'politico',  '#8b5cf6', 7000),
  ...generateEngajamentoHistorico('p3', 'Ana Ribeiro - Facebook',     'politico',  '#ef4444', 9000),
  ...generateEngajamentoHistorico('p4', 'Ana Ribeiro - Instagram',    'politico',  '#f97316', 5000),
  ...generateEngajamentoHistorico('p5', 'Lucas Ferreira - Facebook',  'oposicao',  '#22c55e', 8000),
  ...generateEngajamentoHistorico('p6', 'Lucas Ferreira - Instagram', 'oposicao',  '#14b8a6', 4000),
];

// --------------- whatsapp mensagens ---------------
const waRemetentes = [
  { nome: 'Maria S.', telefone: '+55 (86) 9****-1234' },
  { nome: 'João P.', telefone: '+55 (86) 9****-5678' },
  { nome: 'Ana C.', telefone: '+55 (89) 9****-2345' },
  { nome: 'Carlos M.', telefone: '+55 (86) 9****-3456' },
  { nome: 'Francisca L.', telefone: '+55 (89) 9****-4567' },
  { nome: 'Raimundo F.', telefone: '+55 (86) 9****-5679' },
  { nome: 'Antônia B.', telefone: '+55 (86) 9****-6780' },
  { nome: 'José R.', telefone: '+55 (89) 9****-7891' },
  { nome: 'Luciana O.', telefone: '+55 (86) 9****-8902' },
  { nome: 'Pedro A.', telefone: '+55 (86) 9****-9013' },
  { nome: 'Conceição D.', telefone: '+55 (89) 9****-0124' },
  { nome: 'Manoel T.', telefone: '+55 (86) 9****-1235' },
];

const waMensagens = [
  'Bom dia! Quando vão resolver o buraco na Rua das Flores? Já faz meses que tá assim.',
  'Parabéns pelo trabalho que vocês estão fazendo pelo nosso bairro!',
  'Preciso de informação sobre o posto de saúde. Quando vai ter médico de família?',
  'A creche do bairro tá com problema sério, falta professor toda semana.',
  'Gostaria de saber quando vai ter audiência pública sobre o novo projeto de lei.',
  'O asfalto da avenida principal ficou ótimo, obrigado pela atenção!',
  'Minha rua ainda não tem iluminação pública. Isso é um absurdo!',
  'Queria agradecer pela reforma da praça, ficou muito bonita.',
  'Tem como agendar uma reunião para falar sobre o projeto do parque?',
  'A água tá faltando há três dias no conjunto habitacional. Urgente!',
  'Precisamos de mais segurança no entorno da escola municipal.',
  'O ônibus da linha 23 parou de passar. Isso tá afetando muito trabalhador.',
  'Vocês sabem quando abre o cadastro para o programa de habitação?',
  'O médico do posto de saúde atendeu muito bem minha mãe, parabéns!',
  'Tem muita dengue no bairro e não vejo fumacê passando.',
];

const waCategorias = ['demanda', 'elogio', 'duvida', 'critica', 'informacao'] as const;
const waTemas = ['saude', 'educacao', 'infraestrutura', 'seguranca', 'institucional', 'outro'] as const;
const waSentimentos = ['positivo', 'neutro', 'negativo'] as const;
const waStatus = ['nova', 'lida', 'respondida'] as const;

export const mockWhatsappMensagens = Array.from({ length: 60 }, (_, i) => {
  const daysAgo = Math.floor(Math.random() * 56); // até 8 semanas
  const date = subDays(today, daysAgo);
  const remetente = waRemetentes[i % waRemetentes.length];
  const categoria = waCategorias[i % waCategorias.length];
  const tema = waTemas[i % waTemas.length];
  const sentimento =
    categoria === 'elogio' ? 'positivo'
    : categoria === 'critica' ? 'negativo'
    : waSentimentos[i % 3];
  const status = waStatus[Math.floor(Math.random() * 3)];
  return {
    id: `wa-${i + 1}`,
    remetente_nome: remetente.nome,
    remetente_telefone: remetente.telefone,
    mensagem: waMensagens[i % waMensagens.length],
    categoria,
    tema,
    sentimento,
    status,
    data_recebimento: fmt(date),
    respondida: status === 'respondida',
  };
});

export const mockWhatsappResumo = {
  total_mensagens: 60,
  novas: mockWhatsappMensagens.filter((m) => m.status === 'nova').length,
  respondidas: mockWhatsappMensagens.filter((m) => m.respondida).length,
  taxa_resposta_pct: Math.round(
    (mockWhatsappMensagens.filter((m) => m.respondida).length / 60) * 100
  ),
  novos_remetentes: 8,
  semana_referencia: fmtDate(today),
};

// --------------- usuarios ---------------
export const mockUsuarios = [
  {
    id: 'usr-1',
    user_id: 'mock-user-id',
    nome: 'Administrador Demo',
    email: 'admin@observaapp.com',
    role: 'admin',
    ativo: true,
    created_at: fmt(subDays(today, 90)),
  },
];
