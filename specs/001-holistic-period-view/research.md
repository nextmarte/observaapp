# Research: Visão Holística por Período

**Feature**: 001-holistic-period-view
**Date**: 2026-03-11
**Status**: Complete — all NEEDS CLARIFICATION resolved

---

## D-001 · Gerenciamento de Estado do Período Selecionado

**Decision**: URL search param `?periodo=YYYY-WNN` via React Router v6 `useSearchParams` + custom hook `usePeriodSelection`.

**Rationale**:
- FR-005 exige bookmarking e compartilhamento → URL é a única opção que satisfaz isso.
- React Router v6 já está no projeto; `useSearchParams` + `useNavigate` são zero-dependência adicional.
- A alternativa (React Context global) não permite compartilhamento de URL sem trabalho extra.
- `useSearchParams` funciona em qualquer componente filho do RouterProvider já existente em `App.tsx`.

**Alternatives considered**:
- React Context global `PeriodContext`: mais complexo, não suporta bookmarking nativamente.
- `localStorage`: persiste entre sessões mas não é shareable via URL.

**Implementation pattern**:
```typescript
// src/hooks/usePeriodSelection.ts
import { useSearchParams, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const periodoSchema = z.string().regex(/^\d{4}-W\d{2}$/, 'Formato inválido: usar YYYY-WNN');

export function usePeriodSelection(available: string[]) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const raw = searchParams.get('periodo');
  const parsed = periodoSchema.safeParse(raw);
  
  // Default: first available period (most recent)
  const selectedPeriod = parsed.success && available.includes(parsed.data)
    ? parsed.data
    : available[0] ?? null;

  const setPeriod = (period: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('periodo', period);
    navigate({ search: next.toString() }, { replace: true });
  };

  return { selectedPeriod, setPeriod };
}
```

---

## D-002 · Fonte de Dados para Metric Cards do Dashboard

**Decision**: Criar nova view `fpobserva_vw_metricas_por_semana` via migration. Dashboard.tsx deixa de consultar `fpobserva_vw_dashboard_resumo` para os cards e passa a usar a nova view filtrada por `selectedPeriod`.

**Rationale**:
- A `fpobserva_vw_dashboard_resumo` é hardcoded para `MAX(semana)` — não aceita parâmetro.
- Constitution Princípio II exige que agregações estejam em views SQL, não no frontend.
- `fpobserva_vw_resumo_semanal` já tem dados por perfil/semana, mas sem totalizador cross-perfil.
- A nova view soma `posts_semana` e `engajamento_semana` across todos os perfis, por semana.
- Query no frontend: `.from('fpobserva_vw_metricas_por_semana').eq('semana_ano', selectedPeriod).single()`.

**Alternatives considered**:
- Agregar `fpobserva_vw_resumo_semanal` em JavaScript: viola Princípio II.
- Parametrizar `fpobserva_vw_dashboard_resumo` com SQL function: exige `SECURITY DEFINER` no Supabase, mais complexo sem benefício claro.

**View schema**:
```sql
CREATE VIEW fpobserva_vw_metricas_por_semana AS
SELECT
  semana_ano,
  SUM(posts_semana)                   AS total_posts,
  SUM(engajamento_semana)             AS engajamento_total,
  CASE WHEN SUM(posts_semana) > 0
    THEN ROUND(SUM(engajamento_semana)::numeric / SUM(posts_semana), 1)
    ELSE 0
  END                                  AS media_por_post,
  (SELECT perfil_id FROM fpobserva_vw_resumo_semanal r2
   WHERE r2.semana_ano = base.semana_ano
   ORDER BY engajamento_semana DESC NULLS LAST LIMIT 1)  AS top_perfil_id,
  (SELECT nome FROM fpobserva_vw_resumo_semanal r2
   WHERE r2.semana_ano = base.semana_ano
   ORDER BY engajamento_semana DESC NULLS LAST LIMIT 1)  AS top_perfil_nome
FROM fpobserva_vw_resumo_semanal base
GROUP BY semana_ano
ORDER BY semana_ano DESC;
```

---

## D-003 · Fonte de Dados para Tabela de Posts Recentes

**Decision**: Criar `fpobserva_vw_posts_historico` — igual a `fpobserva_vw_posts_ultima_semana` mas sem filtro de semana e com coluna `semana_ano` derivada. Frontend filtra `.eq('semana_ano', selectedPeriod)`.

**Rationale**:
- `fpobserva_vw_posts_ultima_semana` tem `WHERE date_trunc('week', MAX(...))` hardcoded.
- Não podemos modificá-la (retrocompatibilidade com outras partes do sistema).
- Criar nova view permite filtro dinâmico sem migrations destrutivas.
- `semana_ano` derivada: `to_char(data_publicacao, 'IYYY-"W"IW')` — compatível com formato `YYYY-WNN` usado em `fpobserva_coletas`.

**Alternatives considered**:
- Consultar `fpobserva_posts` diretamente com `WHERE to_char(data_publicacao, ...) = $1`: viola Princípio II pois coloca lógica de formatação no frontend (Supabase JS não suporta SQL functions em `.eq()`).
- Modificar `fpobserva_vw_posts_ultima_semana`: breaking change para qualquer consumer atual.

**View schema** (simplificado):
```sql
CREATE VIEW fpobserva_vw_posts_historico AS
SELECT
  po.*,
  p.nome          AS perfil_nome,
  p.tipo          AS perfil_tipo,
  p.cor_grafico,
  to_char(po.data_publicacao, 'IYYY-"W"IW') AS semana_ano
FROM fpobserva_posts po
JOIN fpobserva_perfis p ON po.perfil_id = p.id
ORDER BY po.data_publicacao DESC;
```

---

## D-004 · Lista de Períodos Disponíveis

**Decision**: Criar `fpobserva_vw_semanas_disponiveis` — semanas únicas com dados, vindas de `fpobserva_coletas`. Frontend ordena DESC e usa o primeiro item como período padrão.

**Rationale**:
- `fpobserva_coletas` é a tabela canônica de coletas semanais; `semana_ano` é sempre preenchido aqui.
- `fpobserva_posts` tem `data_publicacao` mas não `semana_ano`; pode haver posts órfãos sem coleta — não queremos listar semanas de posts sem coleta associada como "disponíveis" no seletor.
- UNION com posts adicionaria semanas de dados potencialmente incompletos.

**Alternatives considered**:
- UNION `fpobserva_coletas` + `fpobserva_posts`: mais semanas mas algumas podem ser "fantasma".
- Query direta `SELECT DISTINCT semana_ano FROM fpobserva_coletas`: technicamente equivalente, mas uma view centraliza a definição.

**View schema**:
```sql
CREATE VIEW fpobserva_vw_semanas_disponiveis AS
SELECT
  semana_ano,
  MIN(data_coleta)  AS data_inicio_coleta,
  COUNT(DISTINCT id) AS total_coletas
FROM fpobserva_coletas
WHERE semana_ano IS NOT NULL
GROUP BY semana_ano
ORDER BY semana_ano DESC;
```

---

## D-005 · Refatoração do `useStaleness` e `StalenessWarning`

**Decision**: `useStaleness` passa a consultar `MAX(data_coleta)` de `fpobserva_coletas` diretamente. `StalenessWarning` implementa 3 níveis de severidade (ok / warning / critical) com limites de 7 e 30 dias.

**Rationale**:
- Atualmente, `useStaleness` consulta `fpobserva_vw_dashboard_resumo.semana_referencia` que é `MAX(date_trunc('week', data_publicacao))` — retorna a segunda-feira da última semana com posts, não a data real da coleta.
- Com o período selecionado podendo ser histórico, o aviso deve refletir "quando foi a última entrada no banco", não "quando foi a semana selecionada".
- 3 níveis: `ok` (≤7 dias → sem badge), `warning` (8–30 dias → badge âmbar), `critical` (>30 dias → badge vermelho).
- Constantes nomeadas para os thresholds (Princípio III: "threshold de 7 dias DEVE ser uma constante nomeada").

**Pattern**:
```typescript
const STALE_WARNING_DAYS = 7;
const STALE_CRITICAL_DAYS = 30;

export type StalenessSeverity = 'ok' | 'warning' | 'critical';

export function useStaleness() {
  // Query: SELECT MAX(data_coleta) FROM fpobserva_coletas
  const { data } = useQuery({
    queryKey: ['staleness-last-update'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fpobserva_coletas')
        .select('data_coleta')
        .order('data_coleta', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data?.data_coleta ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });
  
  const dias = data ? differenceInDays(new Date(), new Date(data)) : null;
  const severity: StalenessSeverity = 
    dias === null ? 'ok' :
    dias > STALE_CRITICAL_DAYS ? 'critical' :
    dias > STALE_WARNING_DAYS ? 'warning' : 'ok';
  
  return { lastUpdate: data, diasDesdeAtualizacao: dias, severity, isDesatualizado: severity !== 'ok' };
}
```

---

## D-006 · Formatação de Semana ISO para Display

**Decision**: Usar `date-fns` (já no projeto) com tokens ISO week: `parse(periodo, "RRRR-'W'II", new Date())` → `startOfISOWeek` / `endOfISOWeek` → `format(date, "dd/MM")`.

**Rationale**:
- `date-fns` já importado em 10+ arquivos do projeto (sem nova dependência).
- Tokens `RRRR` (ISO year) e `II` (ISO week number) disponíveis em `date-fns` v2+.
- Projeto usa `date-fns` v2 (verificado via `import { format } from 'date-fns'`).

**Pattern**:
```typescript
import { parse, startOfISOWeek, endOfISOWeek, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatPeriodLabel(semana_ano: string): string {
  // "2026-W05" → "01/02 – 07/02"
  const date = parse(semana_ano, "RRRR-'W'II", new Date());
  const start = startOfISOWeek(date);
  const end   = endOfISOWeek(date);
  return `${format(start, 'dd/MM')} – ${format(end, 'dd/MM')}`;
}
```

**Alternatives considered**:
- `Intl.DateTimeFormat` com `{ week: 'narrow' }`: não suporta parsing de `YYYY-WNN`.
- Parsing manual com RegExp: mais frágil e não usa a lógica de semana ISO corretamente.

---

## D-007 · Recharts Click Handler para Navegação por Período (US3)

**Decision**: Usar o prop `onClick` do container chart (`<BarChart>`, `<LineChart>`, `<AreaChart>`) em Recharts. O payload `data.activeLabel` contém o valor do eixo X (= `semana_ano`). O gráfico recebe `onWeekClick?: (period: string) => void` como prop opcional.

**Rationale**:
- US3 é "melhoria progressiva" — o prop é opcional para não quebrar nenhum uso atual.
- `data.activeLabel` no onClick de Recharts é string quando o dataKey do `<XAxis>` é uma string → garante compatibilidade com o formato `YYYY-WNN`.
- Cursor `pointer` via CSS quando `onWeekClick` está presente, para indicar interatividade.

**Pattern**:
```typescript
// Dentro do componente de gráfico:
interface Props {
  data: WeeklySummary[];
  onWeekClick?: (period: string) => void;
}

// No JSX:
<AreaChart
  onClick={(chartData) => {
    if (chartData?.activeLabel && props.onWeekClick) {
      props.onWeekClick(chartData.activeLabel as string);
    }
  }}
  style={{ cursor: props.onWeekClick ? 'pointer' : 'default' }}
>
```

---

## D-008 · Bug no EngagementChart — Agregação sem Filtro de Período

**Decision**: `EngagementChart` recebe o `data` já filtrado pelo `selectedPeriod` no componente pai (Dashboard.tsx), não recebe toda a `WeeklySummary[]` e depois filtra internamente.

**Rationale**:
- O componente atual faz `data.reduce((acc, item) => { if (!existing) acc.push(...) })` — pega a **primeira ocorrência** de cada perfil sem filtrar por semana. Com dados de múltiplas semanas, o resultado é não-determinístico.
- A correção é passar `data.filter(d => d.semana_ano === selectedPeriod)` do Dashboard antes de entregar ao componente.
- Manter o componente "burro" (recebe dados prontos) é a abordagem correta segundo Princípio V ("dados DEVEM ser passados via props").

**Alternatives considered**:
- Adicionar filtro de semana dentro do `EngagementChart`: acoplamento — componente precisaria saber sobre `selectedPeriod`.
- Nova prop `semanaFiltro?: string` no componente: desnecessário; o pai já tem o dado.
