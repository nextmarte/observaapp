# Feature Specification: Visão Holística por Período

**Feature Branch**: `001-holistic-period-view`
**Created**: 2026-03-11
**Status**: Draft
**Input**: "precisamos resolver um problema critico da implementacao atual. o sistema foi desenhado pensando que os dados seriam atualizados semanalmente, porem, nao temos dados atualizados semanalmente. queria mudar o approach: mostrar a performance por semana nos graficos e nas outras features, mas com uma visao mais holistica e menos semanal, pq do jeito que esta acabamos com varios graficos e cards zerados por nao termos dados da ultima semana."

---

## Contexto do Problema

O sistema foi construído assumindo que dados chegam toda semana. Na prática, as
coletas são irregulares: pode haver semanas sem dados. Isso provoca **zeros e
cards vazios** nos componentes que filtram por "semana mais recente":

- `fpobserva_vw_dashboard_resumo` → filtra `WHERE date_trunc('week', data_publicacao) = MAX(semana)`; quando a semana mais recente tem poucos dados o card mostra "0 posts".
- `fpobserva_vw_posts_ultima_semana` → só retorna posts daquela semana.
- `WeeklyScoreCard` e `CommentersDigest` pivotam pelo `latestWeek` vindo do banco; se a coleta mais recente é de meses atrás, o card mostra semana genérica.
- Metric cards no Dashboard: "Posts na Semana", "Engajamento Total" — sempre da última semana, que pode ser escassa.

O usuário precisa ver a performance **de cada semana disponível** com a escolha
de qual semana visualizar como referência, e os gráficos históricos devem ser o
caminho natural de navegação.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Seletor de Período Global (Priority: P1)

Um analista abre o Dashboard e, em vez de ver cards zerados da "última semana",
vê automaticamente os dados da **última semana com dados** — com label claro
informando qual período está sendo exibido. Ele pode trocar o período de
referência via um seletor que lista apenas as semanas que têm dados no banco.

**Why this priority**: É o problema central. Sem isso, os outros cards e gráficos
continuam confusos ou zerados.

**Independent Test**: Se implementado isoladamente, o analista pode abrir o
Dashboard, ver o label "Período: 2026-W05 (01–07 fev)" e trocar para outra
semana disponível — sem ver nenhum card com "0" por falta de dados recentes.

**Acceptance Scenarios**:

1. **Given** que há dados nas semanas 2026-W02 e 2026-W05 mas não em 2026-W10 (semana corrente),
   **When** o Dashboard é carregado,
   **Then** o seletor de período exibe "2026-W05 (01–07 fev)" como seleção padrão (última semana com dados).

2. **Given** o seletor mostrando 2026-W05,
   **When** o analista seleciona 2026-W02,
   **Then** todos os metric cards, tabela de posts recentes e scorecard atualizam para refletir os dados de 2026-W02.

3. **Given** apenas uma semana de dados disponível,
   **When** o Dashboard é carregado,
   **Then** o seletor exibe esta única semana e permanece funcional (sem opção de troca mas com label claro).

4. **Given** nenhum dado no banco,
   **When** o Dashboard é carregado,
   **Then** os cards exibem estado vazio con mensagem "Nenhum dado disponível" — sem zeros enganosos.

---

### User Story 2 — Metric Cards Contextualizados (Priority: P1)

Os cards de resumo do Dashboard ("Posts na Semana", "Engajamento Total", "Média
por Post", "Posts no Último Dia") são renomeados e redesenhados para sempre
mostrar o período selecionado como contexto, e nunca mostrar zero por ausência
de dados recentes.

**Why this priority**: Corrige o problema de comunicação imediata — o card vira
um KPI acionável, não uma métrica enganosa.

**Independent Test**: Com o seletor do US1 implementado, qualquer semana
selecionada preenche os cards com dados reais dessa semana; o subtítulo do card
sempre mostra o período ("semana 2026-W05").

**Acceptance Scenarios**:

1. **Given** período selecionado = 2026-W05,
   **When** os metric cards são renderizados,
   **Then** o card "Posts no Período" mostra a contagem de posts da 2026-W05 e o subtítulo mostra "semana 2026-W05".

2. **Given** período selecionado = 2026-W02,
   **When** os metric cards são renderizados,
   **Then** "Top Perfil" mostra o perfil mais engajado de 2026-W02 (não da semana mais recente global).

3. **Given** que o período selecionado tem apenas 3 posts,
   **When** o card "Posts no Período" é exibido,
   **Then** mostra "3" (com contexto explícito), não "0" com sentido de falha.

---

### User Story 3 — Gráficos Históricos como Navegação Principal (Priority: P2)

Os gráficos de linha/área (FollowersChart, HistoricalChart, EngagementChart)
mostram **todo o histórico disponível** por padrão, e ao clicar uma semana
específica no gráfico o seletor de período é atualizado, tornando o gráfico
o ponto de entrada natural para exploração histórica.

**Why this priority**: Incentiva a visão holística — o usuário navega pela
linha do tempo do gráfico, em vez de ficar preso na última semana.

**Independent Test**: Com US1 implementado, clicar em um ponto do FollowersChart
atualiza o seletor e os metric cards para aquela semana, sem navegação de página.

**Acceptance Scenarios**:

1. **Given** dados em 5 semanas distintas,
   **When** o HistoricalChart é exibido,
   **Then** todos os 5 pontos de dados são visíveis no gráfico sem filtro de "última semana".

2. **Given** o usuário clica no ponto da semana 2026-W03 no FollowersChart,
   **When** o evento de clique é processado,
   **Then** o seletor de período atualiza para 2026-W03 e todos os metric cards refletem essa semana.

3. **Given** apenas 1 semana de dados,
   **When** os gráficos são renderizados,
   **Then** exibem o ponto único com label da semana — sem eixo X mostrando semanas fantasma.

---

### User Story 4 — StalenessWarning Atualizado (Priority: P2)

O `StalenessWarning` atual calcula a defasagem com base em `CURRENT_DATE`.
Com a visão holística, o aviso deve mostrar **quando foi a última coleta real**
independente da semana selecionada, indicando "última atualização: X semanas atrás"
em lugar de threshold binário de 7 dias.

**Why this priority**: Mantém consistência com o Princípio III da constituição
(dados frescos). A semana selecionada pode ser histórica intencionalmente — o
aviso deve distinguir "dados históricos visualizados" de "dashboard desatualizado".

**Independent Test**: Com qualquer semana selecionada, o badge sempre mostra a
data da última coleta real no banco, não da semana selecionada.

**Acceptance Scenarios**:

1. **Given** última coleta foi há 15 dias e o período selecionado é uma semana histórica,
   **When** o `StalenessWarning` é exibido,
   **Then** mostra "última atualização: há 15 dias" em âmbar, não vermelho/erro.

2. **Given** última coleta foi ontem e o período selecionado é uma semana de 2 meses atrás,
   **When** o `StalenessWarning` é exibido,
   **Then** não exibe aviso (dados recentes existem, o usuário está vendo histórico por escolha).

3. **Given** última coleta há mais de 30 dias,
   **When** o `StalenessWarning` é exibido,
   **Then** exibe badge vermelho "dados desatualizados há X dias" como alerta crítico.

---

### Edge Cases

- O que acontece quando a view retorna semanas com `NULL` em `semana_ano`? → Filtrar e ignorar na lista do seletor.
- O que acontece se o usuário mantém a URL de uma semana específica nos bookmarks e essa semana é removida do banco? → Fallback para a última semana com dados.
- O que acontece se duas coletas ocorrem na mesma semana ISO? → A view deve agregar; o seletor mostra a semana uma única vez.
- Gráficos com dados dispersos (semanas com gap entre si): → eixo X baseado em semanas reais presentes, não em calendário contínuo.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE listar todas as semanas (formato `YYYY-WNN`) que possuem
  pelo menos um post em `fpobserva_posts` ou uma coleta em `fpobserva_coletas`,
  ordenadas decrescentemente.

- **FR-002**: O sistema DEVE exibir, por padrão, os dados da semana mais recente com
  dados disponíveis — nunca da semana corrente do calendário quando não há dados.

- **FR-003**: O componente `Seletor de Período` DEVE ser acessível em todas as páginas
  que exibem dados temporais (Dashboard, Perfis, Comparativo, Posts, Inteligência).

- **FR-004**: Todos os metric cards DEVEM exibir um subtítulo indicando o período de
  referência dos dados exibidos (ex: "semana 2026-W05").

- **FR-005**: A seleção de período DEVE ser propagada via URL search param (ex:
  `?periodo=2026-W05`) para permitir bookmarking e compartilhamento.

- **FR-006**: Gráficos históricos (FollowersChart, HistoricalChart, EngagementChart)
  DEVEM continuar exibindo todo o histórico disponível, independente do período selecionado.
  O período selecionado serve apenas para os metric cards e tabelas de resumo.

- **FR-007**: O `StalenessWarning` DEVE calcular a defasagem com base na data da
  última coleta real no banco (`MAX(data_coleta)` de `fpobserva_coletas`), independente
  do período selecionado pelo usuário.

- **FR-008**: Quando nenhum dado estiver disponível no banco, todos os módulos de dados
  DEVEM exibir estado vazio explícito ("Nenhum dado disponível") sem zeros enganosos.

- **FR-009**: A view `fpobserva_vw_dashboard_resumo` DEVE aceitar um parâmetro de
  semana para filtrar (ou criar uma view/function equivalente parametrizada) — ou a
  filtragem ocorre no React Query antes de exibir os dados.

- **FR-010**: A tabela "Posts Recentes" DEVE exibir os posts do período selecionado,
  não apenas da última semana do banco.

### Key Entities

- **Período Selecionado**: Semana ISO (`string` no formato `YYYY-WNN`) mantida como
  URL search param; valor padrão = última semana com dados.
- **Semanas Disponíveis**: Lista de semanas únicas com dados, derivada das views existentes
  sem criar nova tabela.
- **Métricas do Período**: Subset de `fpobserva_vw_resumo_semanal` + `fpobserva_vw_score_semanal`
  filtrado pelo período selecionado.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Nenhum metric card do Dashboard exibe "0" por ausência de dados da
  semana corrente do calendário; cards sempre refletem o último período com dados reais.

- **SC-002**: O usuário pode selecionar qualquer semana histórica disponível e ver
  os KPIs correspondentes em menos de 2 segundos (sem recarregar a página).

- **SC-003**: A URL com parâmetro de período pode ser compartilhada e ao abrir
  reproduz exatamente a mesma visualização — 100% das semanas disponíveis funcionam como bookmark.

- **SC-004**: O `StalenessWarning` nunca exibe aviso falso positivo quando o usuário
  intencionalmente navega para um período histórico.

- **SC-005**: Todos os gráficos históricos exibem o número correto de pontos de dados
  — igual ao número de semanas distintas no banco — sem pular semanas fantasma.

- **SC-006**: A implementação mantém o bundle inicial abaixo de 150 kB gzip
  (sem novas dependências pesadas).

---

## Assumptions

- A granularidade de período escolhida é **semanal ISO** (mesma que já existe no banco
  via campo `semana_ano`). Períodos mensais ou customizados estão fora do escopo.
- O seletor de período é um componente **cliente** (Client Component), pois reage a
  interação do usuário e atualiza a URL.
- A filtragem pelo período selecionado ocorre **no React Query** (query parametrizada),
  não via nova view parametrizada no PostgreSQL — para compatibilidade com as views
  existentes e sem necessidade de migrations imediatas.
- Se uma nova view SQL for necessária, segue o padrão de migration versionada
  em `/supabase/migrations/`.
- O comportamento de "clicar no gráfico para selecionar período" (US3) é uma
  **melhoria progressiva** — se o Recharts não oferecer suporte fácil, aceita-se
  apenas atualização via seletor dropdown.

---

## FPObserva — Checklist de Conformidade (Constitution v1.0.0)

- [x] Feature pertence a um módulo do PRD (Dashboard/Perfis/Posts — todos os módulos com dados temporais).
- [x] Dados agregados serão fornecidos por view `fpobserva_vw_*` existentes, com filtragem por período no React Query (FR-009).
- [x] `StalenessWarning` mantido e aprimorado (US4, FR-007).
- [x] Rotas continuam protegidas por `AuthGuard` — nenhuma alteração nas rotas.
- [x] URL search param (`?periodo=`) validado com Zod antes de uso (formato `YYYY-WNN`).
- [x] Nenhum novo lazy-loading necessário — componentes existentes são reutilizados.
- [x] `Seletor de Período` recebe lista de semanas via props (sem fetch interno direto).
- [x] Cores de gráficos não são alteradas — continuam usando CSS variables HSL.
- [x] Nenhuma abstração criada para uso único antecipado.
