import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLatestEbserhMentionDateReference } from '@/hooks/useLatestDataReference';
import { Hospital, AlertTriangle, ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { EbserhMention, EbserhSummary } from '@/types/intelligence';

interface EbserhMonitorCardProps {
  onViewDetails: () => void;
}

export const EbserhMonitorCard: React.FC<EbserhMonitorCardProps> = ({ onViewDetails }) => {
  const { data: latestEbserhDate } = useLatestEbserhMentionDateReference();

  const { data: ebserhData, isLoading } = useQuery({
    queryKey: ['ebserh-monitor', latestEbserhDate],
    queryFn: async () => {
      if (!latestEbserhDate) return [];

      const referenceDate = new Date(latestEbserhDate);
      const thirtyDaysAgo = format(subDays(referenceDate, 30), 'yyyy-MM-dd');
      const referenceDateString = format(referenceDate, 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('fpobserva_vw_mencoes_ebserh')
        .select('*')
        .gte('data_publicacao', thirtyDaysAgo)
        .lte('data_publicacao', referenceDateString)
        .order('data_publicacao', { ascending: false });
      
      if (error) throw error;
      return data as EbserhMention[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const summary: EbserhSummary | null = useMemo(() => {
    if (!ebserhData || ebserhData.length === 0) {
      return null;
    }

    const sentimentos = {
      positivo: ebserhData.filter(m => m.sentimento?.toLowerCase() === 'positivo').length,
      neutro: ebserhData.filter(m => m.sentimento?.toLowerCase() === 'neutro' || !m.sentimento).length,
      negativo: ebserhData.filter(m => m.sentimento?.toLowerCase() === 'negativo').length,
    };

    const entries = Object.entries(sentimentos) as [string, number][];
    const sentimentoPredominante = entries.sort(([, a], [, b]) => b - a)[0][0];

    const ultimaMencao = ebserhData[0];

    return {
      totalMencoes: ebserhData.length,
      sentimentoPredominante,
      ultimaMencao: ultimaMencao ? {
        data: ultimaMencao.data_publicacao,
        perfil: ultimaMencao.perfil_nome,
        conteudo: ultimaMencao.conteudo_texto,
      } : null,
      distribuicaoSentimento: sentimentos,
    };
  }, [ebserhData]);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positivo':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negativo':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positivo':
        return 'Positivo';
      case 'negativo':
        return 'Negativo';
      default:
        return 'Neutro';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positivo':
        return 'bg-green-500';
      case 'negativo':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const totalSentimentos = summary
    ? summary.distribuicaoSentimento.positivo + summary.distribuicaoSentimento.neutro + summary.distribuicaoSentimento.negativo
    : 0;

  if (isLoading) {
    return (
      <Card className="border-2 border-amber-500 bg-gradient-to-r from-amber-500/10 to-red-500/10">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div>
                <Skeleton className="h-5 w-40 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-6 w-28" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card className="border-2 border-gray-300 bg-muted/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 opacity-50">
            <div className="p-2 rounded-lg bg-gray-200">
              <Hospital className="h-6 w-6 text-gray-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-muted-foreground">Monitor EBSERH/HUAP</h2>
              <p className="text-sm text-muted-foreground">Nenhuma menção nos últimos 30 dias</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-amber-500 bg-gradient-to-r from-amber-500/10 to-red-500/10 shadow-lg">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-red-500">
              <Hospital className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                Monitor EBSERH/HUAP
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </h2>
              <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
            </div>
          </div>
          <Badge className="bg-red-500 text-white hover:bg-red-600">
            Tema Prioritário
          </Badge>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Total Menções */}
          <div className="bg-background/60 rounded-lg p-4">
            <p className="text-3xl font-bold text-foreground">{summary.totalMencoes}</p>
            <p className="text-sm text-muted-foreground">Menções</p>
          </div>

          {/* Sentimento Predominante */}
          <div className="bg-background/60 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              {getSentimentIcon(summary.sentimentoPredominante)}
              <p className="text-lg font-semibold text-foreground">
                {getSentimentLabel(summary.sentimentoPredominante)}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">Sentimento Predominante</p>
          </div>

          {/* Última Menção */}
          <div className="bg-background/60 rounded-lg p-4">
            {summary.ultimaMencao && (
              <>
                <p className="text-sm font-medium text-foreground">
                  {summary.ultimaMencao.data
                    ? format(new Date(summary.ultimaMencao.data), 'dd/MM/yyyy', { locale: ptBR })
                    : '-'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  por {summary.ultimaMencao.perfil || 'Desconhecido'}
                </p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  "{summary.ultimaMencao.conteudo?.substring(0, 50) || '...'}..."
                </p>
              </>
            )}
            <p className="text-xs text-muted-foreground mt-1">Última Menção</p>
          </div>
        </div>

        {/* Distribution Bar */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">Distribuição de Sentimento</p>
          <div className="h-3 rounded-full overflow-hidden flex bg-muted">
            {summary.distribuicaoSentimento.positivo > 0 && (
              <div
                className="bg-green-500 h-full transition-all"
                style={{ width: `${(summary.distribuicaoSentimento.positivo / totalSentimentos) * 100}%` }}
                title={`Positivo: ${summary.distribuicaoSentimento.positivo}`}
              />
            )}
            {summary.distribuicaoSentimento.neutro > 0 && (
              <div
                className="bg-gray-400 h-full transition-all"
                style={{ width: `${(summary.distribuicaoSentimento.neutro / totalSentimentos) * 100}%` }}
                title={`Neutro: ${summary.distribuicaoSentimento.neutro}`}
              />
            )}
            {summary.distribuicaoSentimento.negativo > 0 && (
              <div
                className="bg-red-500 h-full transition-all"
                style={{ width: `${(summary.distribuicaoSentimento.negativo / totalSentimentos) * 100}%` }}
                title={`Negativo: ${summary.distribuicaoSentimento.negativo}`}
              />
            )}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Positivo ({summary.distribuicaoSentimento.positivo})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              Neutro ({summary.distribuicaoSentimento.neutro})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Negativo ({summary.distribuicaoSentimento.negativo})
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <Button
            onClick={onViewDetails}
            variant="outline"
            className="border-amber-500 text-amber-700 hover:bg-amber-500/10"
          >
            Ver detalhes
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
