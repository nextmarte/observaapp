import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Activity,
  Gauge,
  Radar,
  Users,
  MessageCircle,
  Trophy,
  CalendarClock,
} from 'lucide-react';
import type { DashboardResumo, WeeklySummary } from '@/types/dashboard';

interface StructuredOverviewPanelProps {
  dashboardResumo?: DashboardResumo | null;
  weeklySummary: WeeklySummary[];
  profilesCount: number;
}

export const StructuredOverviewPanel: React.FC<StructuredOverviewPanelProps> = ({
  dashboardResumo,
  weeklySummary,
  profilesCount,
}) => {
  const latestReference = React.useMemo(() => {
    const values = weeklySummary
      .map((item) => item.data_coleta)
      .filter((value): value is string => Boolean(value));
    if (values.length === 0) return null;
    return values.sort((a, b) => b.localeCompare(a))[0];
  }, [weeklySummary]);

  const snapshot = React.useMemo(
    () => weeklySummary.filter((item) => item.data_coleta === latestReference),
    [latestReference, weeklySummary]
  );

  const candidateData = snapshot.filter((item) => item.tipo === 'politico');
  const rivalsData = snapshot.filter((item) => item.tipo === 'oposicao');

  const candidateEngagement = candidateData.reduce((acc, item) => acc + (item.engajamento_semana || 0), 0);
  const rivalsEngagement = rivalsData.reduce((acc, item) => acc + (item.engajamento_semana || 0), 0);
  const totalEngagement = candidateEngagement + rivalsEngagement;
  const candidateShare = totalEngagement > 0 ? (candidateEngagement / totalEngagement) * 100 : 0;

  const candidatePosts = candidateData.reduce((acc, item) => acc + (item.posts_semana || 0), 0);
  const rivalsPosts = rivalsData.reduce((acc, item) => acc + (item.posts_semana || 0), 0);

  const fpEngagementPerPost = candidatePosts > 0 ? candidateEngagement / candidatePosts : 0;
  const rivalsEngagementPerPost = rivalsPosts > 0 ? rivalsEngagement / rivalsPosts : 0;

  const dailyRhythm = dashboardResumo?.posts_semana
    ? Math.round((dashboardResumo.posts_semana / 7) * 10) / 10
    : 0;

  const concentration = React.useMemo(() => {
    if (snapshot.length === 0) return 0;
    const sorted = [...snapshot]
      .map((item) => item.engajamento_semana || 0)
      .sort((a, b) => b - a);
    const topThree = sorted.slice(0, 3).reduce((acc, value) => acc + value, 0);
    const total = sorted.reduce((acc, value) => acc + value, 0);
    if (total === 0) return 0;
    return Math.round((topThree / total) * 100);
  }, [snapshot]);

  const weeklyLoad = dashboardResumo?.posts_semana || 0;
  const weeklyLoadTag = weeklyLoad > 90 ? 'alto' : weeklyLoad > 45 ? 'moderado' : 'leve';

  const formatShortDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card className="border-primary/25 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <Radar className="h-5 w-5 text-secondary" />
          Visão Estruturada do Cenário
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-border/70 bg-background/45 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground/95">
              <CalendarClock className="h-4 w-4 text-secondary" />
              Contexto Atual
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Referência</span>
                <span className="font-medium">{formatShortDate(dashboardResumo?.semana_referencia || latestReference)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Perfis ativos</span>
                <span className="font-medium">{profilesCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ritmo diário</span>
                <span className="font-medium">{dailyRhythm} posts/dia</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Carga do período</span>
                <span className="font-medium capitalize">{weeklyLoadTag}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-background/45 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground/95">
              <Trophy className="h-4 w-4 text-secondary" />
              Competitividade
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Share de engajamento FP</span>
                  <span className="font-semibold">{Math.round(candidateShare)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted/40">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                    style={{ width: `${Math.min(candidateShare, 100)}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
                  <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Activity className="h-3.5 w-3.5" />
                    Eng. FP
                  </div>
                  <div className="text-lg font-semibold">{candidateEngagement.toLocaleString('pt-BR')}</div>
                </div>
                <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
                  <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    Eng. Rivais
                  </div>
                  <div className="text-lg font-semibold">{rivalsEngagement.toLocaleString('pt-BR')}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-background/45 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground/95">
              <Gauge className="h-4 w-4 text-secondary" />
              Qualidade da Tração
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Engajamento/post FP</span>
                <span className="font-medium">{Math.round(fpEngagementPerPost).toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Engajamento/post rivais</span>
                <span className="font-medium">{Math.round(rivalsEngagementPerPost).toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Concentração top 3</span>
                <span className="font-medium">{concentration}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Interações hoje</span>
                <span className="font-medium flex items-center gap-1">
                  <MessageCircle className="h-3.5 w-3.5 text-secondary" />
                  {(dashboardResumo?.posts_hoje || 0).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
