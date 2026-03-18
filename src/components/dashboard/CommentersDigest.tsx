import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, UserPlus, ArrowRight, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { CommentersRenewal } from '@/types/dashboard';

interface CommentatorsSummary {
  total_comentaristas: number | null;
  novos_ultima_semana: number | null;
  comentaristas_fieis: number | null;
  aliados: number | null;
  adversarios: number | null;
}

export const CommentersDigest: React.FC = () => {
  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ['commenters-digest-summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fpobserva_vw_comentaristas_resumo')
        .select('*')
        .maybeSingle();
      if (error) throw error;
      return data as CommentatorsSummary | null;
    },
  });

  const { data: renewal, isLoading: loadingRenewal } = useQuery({
    queryKey: ['commenters-digest-renewal'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fpobserva_vw_renovacao_comentaristas')
        .select('*')
        .order('semana', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data as CommentersRenewal[];
    },
  });

  const isLoading = loadingSummary || loadingRenewal;

  // Get latest week renewal rates
  const latestWeek = renewal?.[0]?.semana;
  const currentRenewal = renewal?.filter(r => r.semana === latestWeek) || [];
  const fpRenewal = currentRenewal.find(r => r.perfil?.toLowerCase().includes('carlos'));
  const rsRenewal = currentRenewal.filter(r => !r.perfil?.toLowerCase().includes('carlos'));
  const avgRsRenewal = rsRenewal.length > 0 
    ? Math.round(rsRenewal.reduce((sum, r) => sum + (r.taxa_renovacao_pct || 0), 0) / rsRenewal.length)
    : 0;

  // Calculate "bubble" indicator (% of exclusive commenters)
  const fieis = summary?.comentaristas_fieis || 0;
  const total = summary?.total_comentaristas || 1;
  const bubblePercent = Math.round((fieis / total) * 100);

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Diagnóstico de Comentaristas
          </CardTitle>
          <Link 
            to="/inteligencia" 
            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
          >
            Ver completo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mini Cards */}
        <div className="grid grid-cols-3 gap-3">
          {/* Novos */}
          <div className="bg-green-500/10 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
              <UserPlus className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold text-green-400">
              +{summary?.novos_ultima_semana || 0}
            </div>
            <div className="text-xs text-muted-foreground">Novos esta semana</div>
          </div>

          {/* Renovação CM */}
          <div className="bg-blue-500/10 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
              <RefreshCw className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {Math.round(fpRenewal?.taxa_renovacao_pct || 0)}%
            </div>
            <div className="text-xs text-muted-foreground">Renovação CM</div>
          </div>

          {/* Renovação LF */}
          <div className="bg-red-500/10 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
              <RefreshCw className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold text-red-400">
              {avgRsRenewal}%
            </div>
            <div className="text-xs text-muted-foreground">Renovação LF</div>
          </div>
        </div>

        {/* Bubble Indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Indicador de Bolha</span>
            <span className="font-medium">{bubblePercent}% exclusivos</span>
          </div>
          <Progress 
            value={bubblePercent} 
            className="h-2"
          />
          <div className="text-xs text-muted-foreground text-center">
            {bubblePercent < 30 ? '🟢 Baixa bolha' : bubblePercent < 60 ? '🟡 Bolha moderada' : '🔴 Alta bolha'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
