# Implementation Plan: Visão Holística por Período

**Branch**: `001-holistic-period-view` | **Date**: 2026-03-11 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-holistic-period-view/spec.md`

## Summary

Substituir o modelo "semana mais recente hardcoded" por um **seletor de período global**
que exibe automaticamente a última semana com dados (não a semana corrente do calendário)
e permite navegar por qualquer sem  desatualização da plataforma.

Abordagem técnica (per research.md):
- 3 novas views SQL (`fpobserva_vw_semanas_disponiveis`, `fpobserva_vw_metricas_por_semana`,
  `fpobserva_vw_posts_historico`) via migration versionada.
- 3 novos hooks (`useAvailablePeriods`, `usePeriodSelection`, refatoração de `useStaleness`).
- 1 novo componente UI `PeriodSelector` (shadcn `<Select>` wrapper).
- Período propagado via URL search param `?periodo=YYYY-WNN`.
- Gráficos históricos recebem click handler opcional para navegação por período.

## Technical Context

**Language/Version**: TypeScript 5.8.3 (strict mode ativo)
**Primary Dependencies**: React 18.3.1, React Router v6.30.1, TanStack React Query 5.83.0, Zod 3.25.76, date-fns (já instalado), Recharts 2.15.4, shadcn-ui Select (já instalado)
**Storage**: Supabase PostgreSQL — 3 novas views adicionadas via migration; nenhuma tabela nova
**Testing**: Vitest 3.2.4 + Testing Library React
**Target Platform**: Web (desktop 1280px+, tablet 768px+, dark/light mode)
**Project Type**: Web application — feature transversal em 5 páginas existentes
**Performance Goals**: Troca de período em <2s (SC-002); bundle inicial <150 kB gzip (SC-006)
**Constraints**: Sem novas dependências npm; sem breaking change nas views existentes; `useStaleness` desacoplado do período selecionado
**Scale/Scope**: 5 páginas afetadas; 10+ componentes modificados; 3 novos hooks; 1 migration; ~15 arquivos alterados

## Constitution Check

*Pre-design gate: PASSED ✅ | Post-design re-check: PASSED ✅*

| Princípio | Gate | Status |
|-----------|------|--------|
| I. Inteligência de Campanha em Primeiro Lugar | Personas: Analista + Coordenador. Módulos: Dashboard (P1), Perfis, Posts, Comparativo, Inteligência | ✅ |
| II. Dados-Primeiro | 3 novas views SQL fazem toda a agregação. `EngagementChart` recebe dados pré-filtrados via props (D-008). Nenhum cálculo de KPI no frontend | ✅ |
| III. Frescor dos Dados | `useStaleness` refatorado para `MAX(data_coleta)` de `fpobserva_coletas`; 3 níveis de severidade; `StalenessWarning` permanece em todas as páginas e distingue histórico intencional de desatualização real | ✅ |
| IV. Segurança | Nenhuma nova rota. URL param `?periodo=` validado com Zod (`periodoSchema`) antes de uso em queries. RLS das tables existentes não alterado | ✅ |
| V. Performance | Nenhuma nova rota (sem lazy-loading necessário). `useAvailablePeriods` com `staleTime: 10min`. `usePeriodSelection` é zero-cost (lê URL param). Bundle não cresce (sem nova dependência) | ✅ |
| VI. Consistência Visual | `PeriodSelector` usa shadcn `<Select>` (já instalado). Nenhuma cor inline. `StalenessWarning` usa classes Tailwind + CSS vars | ✅ |
| VII. Simplicidade | 3 hooks novos (usados em 5+ páginas = abstração justificada). Sem `any`. TypeScript strict. Nenhum padrão antecipado | ✅ |

## Project Structure

### Documentation (this feature)

```text
specs/001-holistic-period-view/
├── plan.md              ← este arquivo
├── research.md          ← 8 decisões arquiteturais (Phase 0)
├── data-model.md        ← 3 novas entidades + 3 novas views (Phase 1)
├── quickstart.md        ← setup local + padrões copy-paste (Phase 1)
├── checklists/
│   └── requirements.md  ← checklist de qualidade da spec
└── tasks.md             ← gerado pelo /speckit.tasks (Phase 2)
```

### Source Code (repository root)

```text
supabase/
└── migrations/
    └── <timestamp>_create_period_views.sql   ← NOVO: 3 views

src/
├── lib/
│   └── periodSchema.ts                       ← NOVO: Zod schema + formatPeriodLabel()
├── types/
│   └── dashboard.ts                          ← MODIFICADO: + AvailablePeriod, PeriodMetrics, StalenessSeverity
├── hooks/
│   ├── useStaleness.ts                       ← MODIFICADO: nova fonte de dados + 3 severities
│   ├── useAvailablePeriods.ts               ← NOVO: query fpobserva_vw_semanas_disponiveis
│   └── usePeriodSelection.ts               ← NOVO: URL param read/write + Zod validation
├── components/
│   ├── ui/
│   │   └── period-selector.tsx              ← NOVO: shadcn Select wrapper
│   ├── StalenessWarning.tsx                  ← MODIFICADO: 3 níveis visuais
│   └── dashboard/
│       ├── EngagementChart.tsx              ← MODIFICADO: recebe data filtrada; onWeekClick prop
│       ├── FollowersChart.tsx               ← MODIFICADO: onWeekClick prop
│       ├── HistoricalChart.tsx              ← MODIFICADO: onWeekClick prop
│       ├── WeeklyScoreCard.tsx             ← MODIFICADO: filtro por selectedPeriod
│       └── RecentPostsTable.tsx            ← MODIFICADO: query fpobserva_vw_posts_historico
└── pages/
    ├── Dashboard.tsx                         ← MODIFICADO: inject período + PeriodSelector
    ├── Perfis.tsx                            ← MODIFICADO: inject período + PeriodSelector
    ├── Posts.tsx                             ← MODIFICADO: inject período + PeriodSelector
    ├── Comparativo.tsx                       ← MODIFICADO: inject período + PeriodSelector
    └── Inteligencia.tsx                      ← MODIFICADO: inject período + PeriodSelector

test/
└── (testes existentes — nenhum novo obrigatório nesta feature)
```

**Structure Decision**: Projeto único (monorepo React + Supabase), sem subdivisão backend/frontend
separada. Todas as alterações estão em `src/` e `supabase/migrations/`.

## Complexity Tracking

> Nenhuma violação de constituição identificada — seção não aplicável.

