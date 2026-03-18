# Data Model: Visão Holística por Período

**Feature**: 001-holistic-period-view
**Date**: 2026-03-11
**Input**: spec.md + research.md

---

## Entidades Novas

### AvailablePeriod

Representa uma semana disponível para seleção no seletor de período.

```typescript
// src/types/dashboard.ts (adição)
export interface AvailablePeriod {
  semana_ano: string;           // "2026-W05" — chave primária do seletor
  data_inicio_coleta: string;   // "2026-01-26" — primeira data de coleta da semana (ISO 8601)
  total_coletas: number;        // número de perfis com coleta nesta semana
}
```

**Fonte**: `fpobserva_vw_semanas_disponiveis` (nova view, migration D-004)
**Validation**: `z.string().regex(/^\d{4}-W\d{2}$/)` ao ler do URL param

---

### PeriodMetrics

Totalizadores do dashboard para uma semana específica.

```typescript
// src/types/dashboard.ts (adição)
export interface PeriodMetrics {
  semana_ano: string;                   // "2026-W05"
  total_posts: number | null;           // soma de posts de todos os perfis na semana
  engajamento_total: number | null;     // soma de engajamento de todos os perfis
  media_por_post: number | null;        // engajamento_total / total_posts
  top_perfil_id: string | null;         // id do perfil com maior engajamento_semana
  top_perfil_nome: string | null;       // nome do perfil com maior engajamento_semana
}
```

**Fonte**: `fpobserva_vw_metricas_por_semana` (nova view, migration D-002)
**Replaces**: `DashboardResumo` nos metric cards (mantida para outros usos)

---

### StalenessSeverity

Nível de severidade do aviso de dados desatualizados.

```typescript
// src/hooks/useStaleness.ts (update)
export type StalenessSeverity = 'ok' | 'warning' | 'critical';

// Thresholds nomeados (Princípio III)
export const STALE_WARNING_DAYS = 7;
export const STALE_CRITICAL_DAYS = 30;
```

---

## Entidades Modificadas

### DashboardResumo (mantida, mas uso reduzido)

`fpobserva_vw_dashboard_resumo` permanece inalterada. Mantida para outras
referências e para compatibilidade retroativa do `useStaleness` legado.
O Dashboard.tsx deixa de usá-la para os metric cards, que passam para
`PeriodMetrics`.

---

### WeeklySummary (sem mudança de tipo)

`fpobserva_vw_resumo_semanal` já retorna todos os períodos. O frontend agora
filtra por `selectedPeriod` antes de passar ao `EngagementChart` (D-008).
Nenhuma mudança de tipo necessária.

---

## Novas Views (migrations)

### fpobserva_vw_semanas_disponiveis
```sql
-- Arquivo: supabase/migrations/<timestamp>_create_period_views.sql
CREATE VIEW fpobserva_vw_semanas_disponiveis AS
SELECT
  semana_ano,
  MIN(data_coleta)    AS data_inicio_coleta,
  COUNT(DISTINCT id)  AS total_coletas
FROM fpobserva_coletas
WHERE semana_ano IS NOT NULL
GROUP BY semana_ano
ORDER BY semana_ano DESC;
```

### fpobserva_vw_metricas_por_semana
```sql
CREATE VIEW fpobserva_vw_metricas_por_semana AS
SELECT
  base.semana_ano,
  SUM(base.posts_semana)         AS total_posts,
  SUM(base.engajamento_semana)   AS engajamento_total,
  CASE WHEN SUM(base.posts_semana) > 0
    THEN ROUND(SUM(base.engajamento_semana)::numeric / SUM(base.posts_semana), 1)
    ELSE 0
  END                             AS media_por_post,
  top.perfil_id                   AS top_perfil_id,
  top.nome                        AS top_perfil_nome
FROM fpobserva_vw_resumo_semanal base
LEFT JOIN LATERAL (
  SELECT perfil_id, nome
  FROM fpobserva_vw_resumo_semanal r2
  WHERE r2.semana_ano = base.semana_ano
  ORDER BY engajamento_semana DESC NULLS LAST
  LIMIT 1
) top ON true
GROUP BY base.semana_ano, top.perfil_id, top.nome
ORDER BY base.semana_ano DESC;
```

### fpobserva_vw_posts_historico
```sql
CREATE VIEW fpobserva_vw_posts_historico AS
SELECT
  po.id,
  po.perfil_id,
  p.nome                                           AS perfil_nome,
  p.tipo                                           AS perfil_tipo,
  p.cor_grafico,
  po.coleta_id,
  po.plataforma,
  po.tipo,
  po.data_publicacao,
  po.conteudo_texto,
  po.curtidas,
  po.comentarios,
  po.compartilhamentos,
  po.engajamento_total,
  po.sentimento,
  po.tema,
  po.url_post,
  po.url_midia,
  po.alcance,
  po.destaque,
  po.created_at,
  to_char(po.data_publicacao, 'IYYY-"W"IW')         AS semana_ano
FROM fpobserva_posts po
JOIN fpobserva_perfis p ON po.perfil_id = p.id
ORDER BY po.data_publicacao DESC;
```

---

## Estado de UI

### Período Selecionado (URL State)

```
URL: /dashboard?periodo=2026-W05
     /perfis?periodo=2026-W05
     /posts?periodo=2026-W05
     /comparativo?periodo=2026-W05
     /inteligencia?periodo=2026-W05
```

```typescript
// Derivado de useSearchParams
type SelectedPeriod = string | null;  // null = carregando lista de períodos disponíveis
// Quando null: mostrar skeleton nos metric cards, não zeros
```

### Regras de Transição de Estado

| Estado | Condição | Comportamento |
|--------|----------|---------------|
| Loading | `availablePeriods === undefined` | Skeleton nos cards, seletor desabilitado |
| Empty | `availablePeriods.length === 0` | Cards com "Nenhum dado disponível" |
| No URL param | `?periodo` ausente ou inválido | Default = `availablePeriods[0]` (mais recente) |
| URL param inválido (Zod fail) | `?periodo=abc` | Fallback para `availablePeriods[0]` silenciosamente; nav replace |
| URL param válido mas fora da lista | `?periodo=2020-W01` | Fallback para `availablePeriods[0]` silenciosamente; nav replace |
| Período selecionado sem posts | `totalPosts === 0` | Cards mostram "0 posts" COM contexto de semana — não fica zerado de forma enganosa |

---

## Componentes Novos

### `PeriodSelector`

```typescript
// src/components/ui/period-selector.tsx
interface PeriodSelectorProps {
  periods: AvailablePeriod[];
  selected: string | null;
  onChange: (period: string) => void;
  disabled?: boolean;
}
```

### Atualização de `useStaleness`

```typescript
// src/hooks/useStaleness.ts (novo retorno)
interface StalenessResult {
  lastUpdate: string | null;       // ISO date string da última entrada em fpobserva_coletas
  diasDesdeAtualizacao: number | null;
  severity: StalenessSeverity;
  isDesatualizado: boolean;        // severity !== 'ok'
}
```

### Hook `useAvailablePeriods`

```typescript
// src/hooks/useAvailablePeriods.ts
interface UseAvailablePeriodsResult {
  periods: AvailablePeriod[];
  isLoading: boolean;
  latestPeriod: string | null;  // periods[0]?.semana_ano ?? null
}
```

---

## Validação de Dados

### Schema Zod para período

```typescript
// src/lib/periodSchema.ts (novo arquivo pequeno)
import { z } from 'zod';

export const periodoSchema = z
  .string()
  .regex(/^\d{4}-W\d{2}$/, 'Formato inválido: use YYYY-WNN (ex: 2026-W05)');

export type Periodo = z.infer<typeof periodoSchema>;
```

---

## Regras de Null Handling

| Campo | Origem | Fallback de Display |
|-------|--------|---------------------|
| `total_posts` | `fpobserva_vw_metricas_por_semana` | "0" + subtítulo de semana |
| `engajamento_total` | idem | "0" + subtítulo de semana |
| `media_por_post` | idem | "0,0" |
| `top_perfil_nome` | idem | "—" (em-dash) |
| `semana_ano` em posts | `fpobserva_vw_posts_historico` | filtrar out no PeriodSelector |
| `data_inicio_coleta` | `fpobserva_vw_semanas_disponiveis` | não exibir no label se null |
| `lastUpdate` (useStaleness) | `fpobserva_coletas.data_coleta` | null → não exibir StalenessWarning |
