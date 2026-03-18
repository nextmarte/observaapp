import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  LayoutDashboard,
  Users,
  FileText,
  Heart,
  TrendingUp,
  Award,
  Clock,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { 
  MetricCard, 
  EngagementChart, 
  FollowersChart, 
  HistoricalChart, 
  RecentPostsTable, 
  DashboardSkeleton,
  StructuredOverviewPanel,
  PostTypeEngagement,
  CommentersDigest,
  MentionsPreview,
} from '@/components/dashboard';
import { supabase } from '@/integrations/supabase/client';
import type { Profile, WeeklySummary, HistoricalEngagement, RecentPost, DashboardResumo } from '@/types/dashboard';

const Dashboard = () => {
  // Fetch dashboard summary from consolidated view
  const { data: dashboardResumo, isLoading: loadingResumo } = useQuery({
    queryKey: ['fpobserva-dashboard-resumo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fpobserva_vw_dashboard_resumo')
        .select('*')
        .limit(1)
        .single();
      if (error) throw error;
      return data as DashboardResumo;
    },
    staleTime: 15 * 60 * 1000,
  });

  // Fetch active profiles count
  const { data: profiles, isLoading: loadingProfiles } = useQuery({
    queryKey: ['fpobserva-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fpobserva_perfis')
        .select('*')
        .eq('ativo', true);
      if (error) throw error;
      return data as Profile[];
    },
    staleTime: 30 * 60 * 1000,
  });

  // Fetch period summary (for top performer and charts)
  const { data: weeklySummary, isLoading: loadingSummary } = useQuery({
    queryKey: ['fpobserva-weekly-summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fpobserva_vw_resumo_semanal')
        .select('*')
        .order('data_coleta', { ascending: false });
      if (error) throw error;
      return data as WeeklySummary[];
    },
    staleTime: 15 * 60 * 1000,
  });

  // Fetch historical engagement
  const { data: historicalData, isLoading: loadingHistorical } = useQuery({
    queryKey: ['fpobserva-historical'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fpobserva_vw_engajamento_historico')
        .select('*')
        .order('data_coleta', { ascending: true });
      if (error) throw error;
      return data as HistoricalEngagement[];
    },
    staleTime: 15 * 60 * 1000,
  });

  // Fetch recent posts
  const { data: recentPosts, isLoading: loadingPosts } = useQuery({
    queryKey: ['fpobserva-recent-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fpobserva_vw_posts_ultima_semana')
        .select('*')
        .order('data_publicacao', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data as RecentPost[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = loadingResumo || loadingProfiles || loadingSummary || loadingHistorical || loadingPosts;

  // Get top performer from latest available cycle
  const topPerformer = React.useMemo(() => {
    if (!weeklySummary || weeklySummary.length === 0) return null;
    const latestWeek = weeklySummary[0]?.semana_ano;
    const currentWeekData = weeklySummary.filter((d) => d.semana_ano === latestWeek);
    return currentWeekData.reduce(
      (best, current) => {
        if ((current.engajamento_semana || 0) > (best?.engajamento_semana || 0)) {
          return current;
        }
        return best;
      },
      currentWeekData[0]
    );
  }, [weeklySummary]);

  if (isLoading) {
    return (
      <MainLayout>
        <DashboardSkeleton />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-8 w-8 text-secondary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Visão Geral</h1>
              <p className="text-muted-foreground">
                Monitoramento das redes sociais da campanha
              </p>
            </div>
          </div>
          {dashboardResumo?.semana_referencia && (
            <p className="text-xs text-muted-foreground">
              Referência: {format(new Date(dashboardResumo.semana_referencia), "dd/MM/yyyy")}
            </p>
          )}
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard
            title="Perfis Monitorados"
            value={profiles?.length || 0}
            icon={Users}
            subtitle="ativos"
          />
          <MetricCard
            title="Posts no Período"
            value={dashboardResumo?.posts_semana || 0}
            icon={FileText}
          />
          <MetricCard
            title="Engajamento Total"
            value={(dashboardResumo?.engajamento_total || 0).toLocaleString('pt-BR')}
            icon={Heart}
          />
          <MetricCard
            title="Média por Post"
            value={(dashboardResumo?.media_por_post || 0).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}
            icon={TrendingUp}
            subtitle="engajamento"
          />
          <MetricCard
            title="Top Perfil"
            value={topPerformer?.nome || '-'}
            icon={Award}
            subtitle="mais engajado"
          />
          <MetricCard
            title="Posts Hoje"
            value={dashboardResumo?.posts_hoje || 0}
            icon={Clock}
            subtitle={format(new Date(), "dd/MM")}
          />
        </div>

        {/* Structured Overview */}
        <StructuredOverviewPanel
          dashboardResumo={dashboardResumo}
          weeklySummary={weeklySummary || []}
          profilesCount={profiles?.length || 0}
        />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EngagementChart data={weeklySummary || []} loading={loadingSummary} />
          <FollowersChart data={weeklySummary || []} loading={loadingSummary} />
        </div>

        {/* Historical Chart - Full Width */}
        <HistoricalChart data={historicalData || []} loading={loadingHistorical} />

        {/* PostType Engagement + Commenters Digest - NEW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PostTypeEngagement />
          <CommentersDigest />
        </div>

        {/* Mentions Preview - NEW */}
        <MentionsPreview />

        {/* Recent Posts Table */}
        <RecentPostsTable data={recentPosts || []} loading={loadingPosts} />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
