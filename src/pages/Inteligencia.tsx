import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MainLayout } from '@/components/layout/MainLayout';
import { Brain } from 'lucide-react';
import { useLatestReitoriaMentionDateReference } from '@/hooks/useLatestDataReference';
import {
  IntelligenceSkeleton,
  IntelligenceSummaryCards,
  IntelligenceTabs,
  EbserhMonitorCard,
} from '@/components/inteligencia';
import type { IntelligenceSummary, CommentatorsSummary } from '@/types/intelligence';
import { subDays, format } from 'date-fns';

const Inteligencia: React.FC = () => {
  const [ebserhFilter, setEbserhFilter] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const { data: latestReitoriaDate } = useLatestReitoriaMentionDateReference();

  // Fetch summary data
  const { data: summaryData, isLoading } = useQuery({
    queryKey: ['intelligence-summary', latestReitoriaDate],
    queryFn: async () => {
      const referenceDate = latestReitoriaDate
        ? new Date(latestReitoriaDate)
        : new Date();
      const sevenDaysAgo = format(subDays(referenceDate, 7), 'yyyy-MM-dd');
      const referenceDateString = format(referenceDate, 'yyyy-MM-dd');

      // Parallel queries for summary data
      const [mentionsRes, problemsRes, demandsRes, commentersRes, alertsRes] = await Promise.all([
        // Mentions in last 7 days
        supabase
          .from('fpobserva_vw_mencoes_reitoria')
          .select('id', { count: 'planned', head: true })
          .or('menciona_fabio.eq.true,menciona_antonio.eq.true,menciona_reitoria.eq.true')
          .gte('data_publicacao', sevenDaysAgo)
          .lte('data_publicacao', referenceDateString),

        // Problems with high/medium relevance
        supabase
          .from('fpobserva_vw_inteligencia_campanha')
          .select('id', { count: 'planned', head: true })
          .eq('tipo_informacao', 'problema')
          .in('relevancia_campanha', ['alta', 'media']),

        // Demands
        supabase
          .from('fpobserva_vw_inteligencia_campanha')
          .select('id', { count: 'planned', head: true })
          .eq('tipo_informacao', 'demanda'),

        // Commenters summary
        supabase
          .from('fpobserva_vw_comentaristas_resumo')
          .select('*')
          .single(),

        // Active alerts
        supabase
          .from('fpobserva_alertas_config')
          .select('id', { count: 'planned', head: true })
          .eq('ativo', true),
      ]);

      const commentersData = commentersRes.data as CommentatorsSummary | null;

      const summary: IntelligenceSummary = {
        mencoesReitoria: mentionsRes.count || 0,
        problemasIdentificados: problemsRes.count || 0,
        demandasPendentes: demandsRes.count || 0,
        novosComentaristas: commentersData?.novos_ultima_semana || 0,
        alertasAtivos: alertsRes.count || 0,
      };

      return summary;
    },
    staleTime: 5 * 60 * 1000,
  });

  const handleViewEbserhDetails = () => {
    setEbserhFilter(true);
    // Scroll to tabs
    setTimeout(() => {
      tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-secondary/10">
            <Brain className="h-8 w-8 text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Inteligência de Campanha</h1>
            <p className="text-sm text-muted-foreground">
              Monitoramento estratégico e insights para ação
            </p>
          </div>
        </div>

        {/* EBSERH Monitor Card - Always visible at top */}
        <EbserhMonitorCard onViewDetails={handleViewEbserhDetails} />

        {isLoading ? (
          <IntelligenceSkeleton />
        ) : (
          <>
            {/* Summary Cards */}
            <IntelligenceSummaryCards
              data={summaryData || {
                mencoesReitoria: 0,
                problemasIdentificados: 0,
                demandasPendentes: 0,
                novosComentaristas: 0,
                alertasAtivos: 0,
              }}
            />

            {/* Tabs */}
            <div ref={tabsRef}>
              <IntelligenceTabs 
                ebserhFilter={ebserhFilter} 
                onClearEbserhFilter={() => setEbserhFilter(false)} 
              />
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Inteligencia;
