# Quickstart: Visão Holística por Período

**Feature**: 001-holistic-period-view
**Date**: 2026-03-11
**Branch**: `001-holistic-period-view`

---

## Setup Local

```bash
# 1. Garantir branch correto
git checkout 001-holistic-period-view

# 2. Instalar dependências (nenhuma nova é necessária)
bun install

# 3. Verificar variáveis de ambiente
cat .env | grep VITE_SUPABASE_

# 4. Iniciar dev server
bun run dev
# → http://localhost:8080

# 5. Verificar build e lint antes de qualquer commit
bun run lint && bun run build
```

---

## Aplicar as Migrations no Supabase

As 3 novas views precisam ser aplicadas ao banco antes de qualquer teste:

```bash
# Via Supabase CLI (se supabase local rodando)
supabase db push

# Ou aplicar manualmente no Supabase Studio:
# 1. Abrir https://supabase.com/dashboard/project/psvmngqfdoccgsuaijvt/sql
# 2. Colar e executar o conteúdo de:
#    supabase/migrations/<timestamp>_create_period_views.sql
```

---

## Ordem de Implementação Recomendada

```
[P1] Infraestrutura
├── Migration SQL: 3 novas views
├── src/lib/periodSchema.ts          — validação Zod do formato de período
├── src/hooks/useStaleness.ts        — refatorar fonte de dados + 3 severities
├── src/hooks/useAvailablePeriods.ts — query da nova view
├── src/hooks/usePeriodSelection.ts  — URL param read/write
└── src/components/StalenessWarning.tsx — 3 níveis visuais

[US1+US2] Period Selector + Metric Cards
├── src/components/ui/period-selector.tsx  — componente UI (shadcn Select wrapper)
└── src/pages/Dashboard.tsx                — injetar selectedPeriod, trocar fonte de dados

[US3] Gráficos com Click
├── src/components/dashboard/EngagementChart.tsx   — recebe data filtrada; adicionar onWeekClick
├── src/components/dashboard/FollowersChart.tsx    — adicionar onWeekClick
└── src/components/dashboard/HistoricalChart.tsx   — adicionar onWeekClick

[Propagação] Outras páginas
├── src/pages/Perfis.tsx
├── src/pages/Posts.tsx
├── src/pages/Comparativo.tsx
└── src/pages/Inteligencia.tsx
```

---

## Padrões de Implementação

### 1. periodSchema (arquivo base)

```typescript
// src/lib/periodSchema.ts
import { z } from 'zod';

export const periodoSchema = z
  .string()
  .regex(/^\d{4}-W\d{2}$/, 'Formato inválido: use YYYY-WNN');

export type Periodo = z.infer<typeof periodoSchema>;
```

---

### 2. useAvailablePeriods

```typescript
// src/hooks/useAvailablePeriods.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AvailablePeriod } from '@/types/dashboard';

export function useAvailablePeriods() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['available-periods'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fpobserva_vw_semanas_disponiveis')
        .select('*')
        .order('semana_ano', { ascending: false });
      if (error) throw error;
      return data as AvailablePeriod[];
    },
    staleTime: 10 * 60 * 1000,  // períodos mudam raramente
  });

  return {
    periods: data,
    isLoading,
    latestPeriod: data[0]?.semana_ano ?? null,
  };
}
```

---

### 3. usePeriodSelection

```typescript
// src/hooks/usePeriodSelection.ts
import { useSearchParams, useNavigate } from 'react-router-dom';
import { periodoSchema } from '@/lib/periodSchema';

export function usePeriodSelection(availablePeriods: string[]) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const raw = searchParams.get('periodo');
  const parsed = periodoSchema.safeParse(raw);
  const validAndAvailable = parsed.success && availablePeriods.includes(parsed.data);

  // Se param inválido ou fora da lista → usa o mais recente disponível
  const selectedPeriod = validAndAvailable ? parsed.data : (availablePeriods[0] ?? null);

  // Corrigir URL silenciosamente se param era inválido
  React.useEffect(() => {
    if (raw && !validAndAvailable && selectedPeriod) {
      const next = new URLSearchParams(searchParams);
      next.set('periodo', selectedPeriod);
      navigate({ search: next.toString() }, { replace: true });
    }
  }, [raw, validAndAvailable, selectedPeriod]);

  const setPeriod = (period: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('periodo', period);
    navigate({ search: next.toString() }, { replace: true });
  };

  return { selectedPeriod, setPeriod };
}
```

---

### 4. PeriodSelector (componente UI)

```typescript
// src/components/ui/period-selector.tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPeriodLabel } from '@/lib/periodSchema';
import type { AvailablePeriod } from '@/types/dashboard';

interface PeriodSelectorProps {
  periods: AvailablePeriod[];
  selected: string | null;
  onChange: (period: string) => void;
  disabled?: boolean;
}

export const PeriodSelector = ({ periods, selected, onChange, disabled }: PeriodSelectorProps) => (
  <Select value={selected ?? ''} onValueChange={onChange} disabled={disabled || periods.length === 0}>
    <SelectTrigger className="w-[200px]">
      <SelectValue placeholder="Selecionar período...">
        {selected ? `${selected} · ${formatPeriodLabel(selected)}` : 'Selecionar período...'}
      </SelectValue>
    </SelectTrigger>
    <SelectContent>
      {periods.map((p) => (
        <SelectItem key={p.semana_ano} value={p.semana_ano}>
          {p.semana_ano} · {formatPeriodLabel(p.semana_ano)}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
```

---

### 5. formatPeriodLabel (adicionar a periodSchema.ts)

```typescript
// Adicionar em src/lib/periodSchema.ts
import { parse, startOfISOWeek, endOfISOWeek, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatPeriodLabel(semana_ano: string): string {
  try {
    const date = parse(semana_ano, "RRRR-'W'II", new Date());
    const start = startOfISOWeek(date);
    const end   = endOfISOWeek(date);
    return `${format(start, 'dd/MM', { locale: ptBR })} – ${format(end, 'dd/MM', { locale: ptBR })}`;
  } catch {
    return semana_ano;  // fallback gracioso se parsing falhar
  }
}
```

---

### 6. useStaleness refatorado

```typescript
// src/hooks/useStaleness.ts (substituição completa)
import { useQuery } from '@tanstack/react-query';
import { differenceInDays } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

export const STALE_WARNING_DAYS = 7;
export const STALE_CRITICAL_DAYS = 30;
export type StalenessSeverity = 'ok' | 'warning' | 'critical';

export function useStaleness() {
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
    dias > STALE_WARNING_DAYS  ? 'warning' : 'ok';

  return {
    lastUpdate: data ?? null,
    diasDesdeAtualizacao: dias,
    severity,
    isDesatualizado: severity !== 'ok',
  };
}
```

---

### 7. Dashboard.tsx (padrão de injeção do período)

```typescript
// Em Dashboard.tsx: padrão de composição
const { periods, isLoading: loadingPeriods, latestPeriod } = useAvailablePeriods();
const periodIds = React.useMemo(() => periods.map(p => p.semana_ano), [periods]);
const { selectedPeriod, setPeriod } = usePeriodSelection(periodIds);

// Query de métricas filtradas pelo período:
const { data: periodMetrics, isLoading: loadingMetrics } = useQuery({
  queryKey: ['period-metrics', selectedPeriod],
  queryFn: async () => {
    if (!selectedPeriod) return null;
    const { data, error } = await supabase
      .from('fpobserva_vw_metricas_por_semana')
      .select('*')
      .eq('semana_ano', selectedPeriod)
      .maybeSingle();
    if (error) throw error;
    return data as PeriodMetrics | null;
  },
  enabled: !!selectedPeriod,
  staleTime: 5 * 60 * 1000,
});

// Data filtrada para EngagementChart (D-008 fix):
const engagementDataForPeriod = React.useMemo(
  () => weeklySummary?.filter(d => d.semana_ano === selectedPeriod) ?? [],
  [weeklySummary, selectedPeriod]
);

// No JSX do header:
<PeriodSelector
  periods={periods}
  selected={selectedPeriod}
  onChange={setPeriod}
  disabled={loadingPeriods}
/>
```

---

### 8. Recharts Click Handler (US3)

```typescript
// Padrão a aplicar em EngagementChart, FollowersChart, HistoricalChart:
interface Props {
  data: WeeklySummary[];
  loading?: boolean;
  onWeekClick?: (period: string) => void;  // nova prop opcional
}

// No JSX:
<BarChart
  data={chartData}
  onClick={(chartData) => {
    if (chartData?.activeLabel && props.onWeekClick) {
      props.onWeekClick(chartData.activeLabel as string);
    }
  }}
  style={{ cursor: props.onWeekClick ? 'pointer' : 'default' }}
>
```

---

## Verificação Final (antes do PR)

```bash
# 1. Lint
bun run lint
# Должно пройти без erros

# 2. Build
bun run build
# Должно completar sem erros TypeScript

# 3. Verificar bundle size
bun run build 2>&1 | grep "gzip"
# Nenhum chunk deve crescer mais de 5kB

# 4. Teste manual:
# → Abrir /dashboard sem ?periodo → ver última semana com dados
# → Trocar período → cards atualizam sem reload
# → Copiar URL → abrir em aba nova → mesmo período
# → Editar URL com período inválido → redireciona para mais recente
# → Clicar em ponto do HistoricalChart → seletor atualiza
```
