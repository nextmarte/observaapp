# PRD — ObservaApp

## Visão Geral

**ObservaApp** é um sistema web de monitoramento e análise de redes sociais voltado para equipes de comunicação, assessorias de imprensa e gestores públicos ou privados que precisam acompanhar a presença digital de pessoas e organizações.

O sistema centraliza dados de múltiplos perfis (Facebook e Instagram), processa métricas de engajamento e gera inteligência estratégica de forma automatizada.

---

## Problema

Equipes de comunicação precisam monitorar diariamente:
- O desempenho de perfis próprios em redes sociais
- Menções a pessoas ou organizações de interesse
- Temas sensíveis que possam exigir resposta rápida
- A evolução da audiência e engajamento ao longo do tempo

Sem uma ferramenta centralizada, esse trabalho é feito manualmente — com planilhas, capturas de tela e análises fragmentadas — o que é lento, sujeito a erros e dificulta a tomada de decisão.

---

## Público-Alvo

- Assessorias de comunicação e imprensa
- Equipes de marketing político ou institucional
- Gestores públicos com mandato ativo
- Analistas de inteligência de comunicação

---

## Funcionalidades Principais

### 1. Dashboard
- Resumo executivo com total de posts, curtidas e engajamento da semana
- Gráficos de engajamento e evolução de seguidores
- Prévia das últimas menções monitoradas
- Diagnóstico de comentaristas (renovação, fidelidade, bolha)

### 2. Radar de Menções
- Listagem de posts que mencionam perfis monitorados (Carlos Mendes, Ana Ribeiro, Diretoria)
- Filtro por tipo de menção, sentimento, perfil de origem e período
- Monitor dedicado para temas prioritários (ex: INSMED/HU)
- Gráfico de evolução das menções ao longo do tempo

### 3. Monitor de Temas Prioritários (INSMED/HU)
- Card de destaque para monitoramento de um tema institucional prioritário
- Contagem de menções, sentimento predominante e última menção
- Distribuição visual de sentimento (positivo / neutro / negativo)

### 4. Análise de Comentaristas
- Tabela de top comentaristas com classificação (aliado / adversário / neutro)
- Métricas de renovação semanal por perfil
- Indicador de bolha (% de comentaristas exclusivos)

### 5. Comparativo entre Perfis
- Seleção de dois perfis para análise lado a lado
- Métricas: seguidores, posts, curtidas, comentários, engajamento, taxa de engajamento
- Gráficos: evolução de seguidores, engajamento semanal, distribuição por tipo de post
- Top posts de cada perfil e resumo executivo comparativo

### 6. Sistema de Alertas
- Criação de alertas configuráveis por métrica (engajamento, seguidores, posts, etc.)
- Notificações de alertas disparados com nível de criticidade
- Dicas de alertas úteis para monitoramento estratégico

### 7. Relatórios
- Geração de relatórios em três formatos: Resumo, Completo e Comparativo
- Seleção de período e perfis incluídos
- Exportação para impressão com tabelas, gráficos e conclusões automáticas
- Histórico de relatórios gerados

### 8. Gestão de Perfis
- Listagem de todos os perfis monitorados
- Detalhamento por perfil: métricas, histórico de seguidores, posts recentes
- Filtros por plataforma e tipo

### 9. Posts
- Tabela completa de todos os posts coletados
- Filtros por perfil, plataforma, data, tipo e sentimento
- Modal de detalhes com engajamento completo e link para post original

---

## Arquitetura Técnica

| Componente | Tecnologia |
|---|---|
| Framework | React 18 + Vite |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS + shadcn/ui |
| Roteamento | React Router DOM v6 |
| Estado / Cache | TanStack React Query v5 |
| Gráficos | Recharts |
| Backend (opcional) | Supabase (PostgreSQL) |
| Build | Vite |
| Testes | Vitest + Testing Library |
| Deploy | Vercel |

---

## Dados Mockados (Demo)

Esta versão de demonstração utiliza **dados locais fictícios** sem conexão com backend. Os perfis monitorados são:

| Nome | Tipo | Plataformas |
|---|---|---|
| Carlos Mendes | Monitorado | Facebook, Instagram |
| Ana Ribeiro | Monitorado | Facebook, Instagram |
| Lucas Ferreira | Oposição | Facebook, Instagram |

**Organização monitorada:** INSMED/HU (Instituto Nacional de Medicina / Hospital Universitário)

---

## Como Rodar Localmente

```bash
# Instalar dependências
npm install

# Rodar em modo de desenvolvimento (dados mockados)
npm run dev

# Build para produção
npm run build
```

### Login para Demonstração

Use qualquer e-mail e senha na tela de login — a autenticação é simulada e o acesso é concedido automaticamente.

---

## Como Conectar a um Backend Real

Para conectar ao seu próprio Supabase:

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Crie o schema baseado nas migrações em `supabase/migrations/`
3. Copie `.env.example` para `.env.local` e preencha com suas credenciais
4. Substitua `src/integrations/supabase/client.ts` pela versão real (consulte os comentários no arquivo)

---

## Roadmap Futuro

- [ ] Coleta automática via integração com APIs das redes sociais
- [ ] Exportação de relatórios em PDF
- [ ] Envio de alertas por e-mail / WhatsApp
- [ ] Painel multi-cliente para agências
- [ ] Análise de sentimento com IA
