import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/MainLayout';
import { GitCompare, Users, FileText, Calendar, Heart, MessageCircle, Share2, Activity, Percent, ThumbsUp, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ComparisonState, ComparisonMetrics, PostTypeDistribution } from '@/types/comparison';
import {
  ComparisonSelector,
  ComparisonMetricCard,
  ComparisonFollowersChart,
  ComparisonEngagementChart,
  ComparisonPostTypesChart,
  ComparisonTopPosts,
  ComparisonSummary,
  ComparisonSkeleton,
} from '@/components/comparison';

// Default profile IDs for initial comparison
const DEFAULT_PROFILES = {
  fabioPassosFB: null as string | null,
  robertoSalesFB: null as string | null,
};

const Comparativo = () => {
  const [state, setState] = useState<ComparisonState>({
    profileAId: null,
    profileBId: null,
    includeInstagram: false,
  });
  const [compareTriggered, setCompareTriggered] = useState(false);

  // Fetch profiles
  const { data: profiles = [], isLoading: loadingProfiles } = useQuery({
    queryKey: ['profiles-comparison'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fpobserva_perfis')
        .select('*')
        .eq('ativo', true)
        .order('nome');
      
      if (error) throw error;
      return data;
    },
    staleTime: 30 * 60 * 1000,
  });

  // Set default profiles once loaded
  useEffect(() => {
    if (profiles.length > 0 && !state.profileAId && !state.profileBId) {
      const fabioFB = profiles.find(
        p => p.nome.toLowerCase().includes('carlos') && p.plataforma === 'facebook'
      );

      const robertoFB = profiles.find(
        p => p.nome.toLowerCase().includes('lucas') && p.plataforma === 'facebook'
      );

      setState(prev => ({
        ...prev,
        profileAId: fabioFB?.id || profiles[0]?.id || null,
        profileBId: robertoFB?.id || profiles[1]?.id || null,
      }));
      setCompareTriggered(true);
    }
  }, [profiles]);

  // Get related Instagram profile ID
  const getRelatedInstagramId = (facebookProfileId: string | null) => {
    if (!facebookProfileId) return null;
    const fbProfile = profiles.find(p => p.id === facebookProfileId);
    if (!fbProfile) return null;
    
    const baseName = fbProfile.nome
      .replace(' - Facebook', '')
      .replace(' - Instagram', '')
      .trim();
    
    const igProfile = profiles.find(
      p => p.nome.includes(baseName) && p.plataforma === 'instagram' && p.id !== facebookProfileId
    );
    return igProfile?.id || null;
  };

  // Get all profile IDs for fetching (including Instagram if needed)
  const profileAIds = useMemo(() => {
    const ids = state.profileAId ? [state.profileAId] : [];
    if (state.includeInstagram && state.profileAId) {
      const igId = getRelatedInstagramId(state.profileAId);
      if (igId) ids.push(igId);
    }
    return ids;
  }, [state.profileAId, state.includeInstagram, profiles]);

  const profileBIds = useMemo(() => {
    const ids = state.profileBId ? [state.profileBId] : [];
    if (state.includeInstagram && state.profileBId) {
      const igId = getRelatedInstagramId(state.profileBId);
      if (igId) ids.push(igId);
    }
    return ids;
  }, [state.profileBId, state.includeInstagram, profiles]);

  const allComparisonProfileIds = useMemo(
    () => Array.from(new Set([...profileAIds, ...profileBIds])),
    [profileAIds, profileBIds]
  );

  // Fetch coletas for both profiles in one call
  const { data: coletasCombined = [], isLoading: loadingColetas } = useQuery({
    queryKey: ['coletas-comparison', allComparisonProfileIds, compareTriggered],
    queryFn: async () => {
      if (allComparisonProfileIds.length === 0) return [];
      const { data, error } = await supabase
        .from('fpobserva_coletas')
        .select('*')
        .in('perfil_id', allComparisonProfileIds)
        .order('data_coleta', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: allComparisonProfileIds.length > 0 && compareTriggered,
    staleTime: 10 * 60 * 1000,
  });

  // Fetch posts for both profiles in one call
  const { data: postsCombined = [], isLoading: loadingPosts } = useQuery({
    queryKey: ['posts-comparison', allComparisonProfileIds, compareTriggered],
    queryFn: async () => {
      if (allComparisonProfileIds.length === 0) return [];
      const { data, error } = await supabase
        .from('fpobserva_posts')
        .select('*')
        .in('perfil_id', allComparisonProfileIds)
        .order('engajamento_total', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: allComparisonProfileIds.length > 0 && compareTriggered,
    staleTime: 5 * 60 * 1000,
  });

  const coletasA = useMemo(
    () => coletasCombined.filter((item) => item.perfil_id && profileAIds.includes(item.perfil_id)),
    [coletasCombined, profileAIds]
  );
  const coletasB = useMemo(
    () => coletasCombined.filter((item) => item.perfil_id && profileBIds.includes(item.perfil_id)),
    [coletasCombined, profileBIds]
  );
  const postsA = useMemo(
    () => postsCombined.filter((item) => item.perfil_id && profileAIds.includes(item.perfil_id)),
    [postsCombined, profileAIds]
  );
  const postsB = useMemo(
    () => postsCombined.filter((item) => item.perfil_id && profileBIds.includes(item.perfil_id)),
    [postsCombined, profileBIds]
  );

  const isLoading = loadingProfiles || loadingColetas || loadingPosts;

  // Calculate metrics
  const calculateMetrics = (posts: typeof postsA, coletas: typeof coletasA): ComparisonMetrics => {
    // Get latest valid (>0) coleta for followers (fallback to latest if all are zero)
    const byProfile = coletas.reduce((acc, c) => {
      if (!c.perfil_id) return acc;
      if (!acc[c.perfil_id]) acc[c.perfil_id] = [];
      acc[c.perfil_id].push(c);
      return acc;
    }, {} as Record<string, typeof coletas>);

    const latestColetas = Object.values(byProfile).map((profileColetas) => {
      const sorted = [...profileColetas].sort(
        (a, b) => new Date(b.data_coleta).getTime() - new Date(a.data_coleta).getTime()
      );
      const latestValid = sorted.find((c) => (c.seguidores ?? 0) > 0);
      return latestValid || sorted[0];
    });
    
    const seguidores = latestColetas.reduce((sum, c) => sum + (c?.seguidores ?? 0), 0);
    
    const totalPosts = posts.length;
    const latestPostDate = posts
      .map((p) => p.data_publicacao)
      .filter((value): value is string => Boolean(value))
      .sort((a, b) => b.localeCompare(a))[0];
    const weekAgo = latestPostDate ? new Date(latestPostDate) : new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const postsUltimaSemana = posts.filter(
      p => p.data_publicacao && new Date(p.data_publicacao) >= weekAgo
    ).length;
    
    const totalCurtidas = posts.reduce((sum, p) => sum + (p.curtidas ?? 0), 0);
    const totalComentarios = posts.reduce((sum, p) => sum + (p.comentarios ?? 0), 0);
    const totalCompartilhamentos = posts.reduce((sum, p) => sum + (p.compartilhamentos ?? 0), 0);
    const engajamentoTotal = totalCurtidas + totalComentarios + totalCompartilhamentos;
    
    const taxaEngajamento = seguidores > 0 
      ? (engajamentoTotal / seguidores) * 100 
      : 0;
    
    const mediaCurtidasPorPost = totalPosts > 0 ? totalCurtidas / totalPosts : 0;
    const mediaComentariosPorPost = totalPosts > 0 ? totalComentarios / totalPosts : 0;
    
    return {
      seguidores,
      totalPosts,
      postsUltimaSemana,
      totalCurtidas,
      totalComentarios,
      totalCompartilhamentos,
      engajamentoTotal,
      taxaEngajamento,
      mediaCurtidasPorPost,
      mediaComentariosPorPost,
    };
  };

  const metricsA = useMemo(() => calculateMetrics(postsA, coletasA), [postsA, coletasA]);
  const metricsB = useMemo(() => calculateMetrics(postsB, coletasB), [postsB, coletasB]);

  // Calculate post type distribution
  const calculatePostTypes = (posts: typeof postsA): PostTypeDistribution[] => {
    const typeCounts: Record<string, number> = {};
    posts.forEach(p => {
      const tipo = p.tipo || 'outro';
      typeCounts[tipo] = (typeCounts[tipo] || 0) + 1;
    });
    
    const total = posts.length;
    return Object.entries(typeCounts).map(([tipo, count]) => ({
      tipo,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }));
  };

  const postTypesA = useMemo(() => calculatePostTypes(postsA), [postsA]);
  const postTypesB = useMemo(() => calculatePostTypes(postsB), [postsB]);

  // Calculate weekly engagement
  const calculateWeeklyEngagement = (posts: typeof postsA) => {
    const weeklyData: Record<string, number> = {};
    
    posts.forEach(post => {
      const date = new Date(post.data_publicacao);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = `${weekStart.getFullYear()}-S${Math.ceil((weekStart.getMonth() * 4.33 + weekStart.getDate()) / 7).toString().padStart(2, '0')}`;
      
      weeklyData[weekKey] = (weeklyData[weekKey] || 0) + (post.engajamento_total ?? 0);
    });
    
    return Object.entries(weeklyData)
      .map(([semana_ano, engajamento]) => ({ semana_ano, engajamento }))
      .sort((a, b) => a.semana_ano.localeCompare(b.semana_ano));
  };

  const weeklyEngagementA = useMemo(() => calculateWeeklyEngagement(postsA), [postsA]);
  const weeklyEngagementB = useMemo(() => calculateWeeklyEngagement(postsB), [postsB]);

  // Get profile details
  const profileA = profiles.find(p => p.id === state.profileAId);
  const profileB = profiles.find(p => p.id === state.profileBId);
  
  const colorA = profileA?.cor_grafico || '#C4A000';
  const colorB = profileB?.cor_grafico || '#00285F';
  
  const profileAName = state.includeInstagram && profileA
    ? profileA.nome.replace(' - Facebook', '').replace(' - Instagram', '')
    : profileA?.nome || 'Perfil A';
  
  const profileBName = state.includeInstagram && profileB
    ? profileB.nome.replace(' - Facebook', '').replace(' - Instagram', '')
    : profileB?.nome || 'Perfil B';

  // Format helpers
  const formatNumber = (val: number) => val.toLocaleString('pt-BR');
  const formatDecimal = (val: number) => val.toFixed(1);
  const formatPercent = (val: number) => `${val.toFixed(2)}%`;

  // Aggregate coletas by week for charts
  const aggregateColetasByWeek = (coletas: typeof coletasA) => {
    const weeklyData: Record<string, { seguidores: number; count: number }> = {};
    
    coletas.forEach(c => {
      if (!weeklyData[c.semana_ano]) {
        weeklyData[c.semana_ano] = { seguidores: 0, count: 0 };
      }
      weeklyData[c.semana_ano].seguidores += c.seguidores ?? 0;
      weeklyData[c.semana_ano].count += 1;
    });
    
    return Object.entries(weeklyData)
      .map(([semana_ano, data]) => ({
        data_coleta: semana_ano,
        semana_ano,
        seguidores: data.seguidores,
      }))
      .sort((a, b) => a.semana_ano.localeCompare(b.semana_ano));
  };

  const chartColetasA = useMemo(() => aggregateColetasByWeek(coletasA), [coletasA]);
  const chartColetasB = useMemo(() => aggregateColetasByWeek(coletasB), [coletasB]);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3">
            <GitCompare className="h-8 w-8 text-secondary" />
            <h1 className="text-2xl font-bold text-foreground">Comparativo</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Análise comparativa entre perfis monitorados
          </p>
        </div>

        {loadingProfiles ? (
          <ComparisonSkeleton />
        ) : (
          <>
            {/* Profile Selector */}
            <ComparisonSelector
              profiles={profiles}
              profileAId={state.profileAId}
              profileBId={state.profileBId}
              includeInstagram={state.includeInstagram}
              onProfileAChange={(id) => setState(prev => ({ ...prev, profileAId: id }))}
              onProfileBChange={(id) => setState(prev => ({ ...prev, profileBId: id }))}
              onIncludeInstagramChange={(value) => setState(prev => ({ ...prev, includeInstagram: value }))}
              onCompare={() => setCompareTriggered(true)}
              loading={isLoading}
            />

            {compareTriggered && isLoading && <ComparisonSkeleton />}

            {compareTriggered && !isLoading && state.profileAId && state.profileBId && (
              <>
                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  <ComparisonMetricCard
                    label="Seguidores"
                    icon={Users}
                    valueA={metricsA.seguidores}
                    valueB={metricsB.seguidores}
                    colorA={colorA}
                    colorB={colorB}
                    formatValue={formatNumber}
                  />
                  <ComparisonMetricCard
                    label="Total de Posts"
                    icon={FileText}
                    valueA={metricsA.totalPosts}
                    valueB={metricsB.totalPosts}
                    colorA={colorA}
                    colorB={colorB}
                    formatValue={formatNumber}
                  />
                  <ComparisonMetricCard
                    label="Posts Última Semana"
                    icon={Calendar}
                    valueA={metricsA.postsUltimaSemana}
                    valueB={metricsB.postsUltimaSemana}
                    colorA={colorA}
                    colorB={colorB}
                    formatValue={formatNumber}
                  />
                  <ComparisonMetricCard
                    label="Total de Curtidas"
                    icon={Heart}
                    valueA={metricsA.totalCurtidas}
                    valueB={metricsB.totalCurtidas}
                    colorA={colorA}
                    colorB={colorB}
                    formatValue={formatNumber}
                  />
                  <ComparisonMetricCard
                    label="Total de Comentários"
                    icon={MessageCircle}
                    valueA={metricsA.totalComentarios}
                    valueB={metricsB.totalComentarios}
                    colorA={colorA}
                    colorB={colorB}
                    formatValue={formatNumber}
                  />
                  <ComparisonMetricCard
                    label="Compartilhamentos"
                    icon={Share2}
                    valueA={metricsA.totalCompartilhamentos}
                    valueB={metricsB.totalCompartilhamentos}
                    colorA={colorA}
                    colorB={colorB}
                    formatValue={formatNumber}
                  />
                  <ComparisonMetricCard
                    label="Engajamento Total"
                    icon={Activity}
                    valueA={metricsA.engajamentoTotal}
                    valueB={metricsB.engajamentoTotal}
                    colorA={colorA}
                    colorB={colorB}
                    formatValue={formatNumber}
                  />
                  <ComparisonMetricCard
                    label="Taxa de Engajamento"
                    icon={Percent}
                    valueA={metricsA.taxaEngajamento}
                    valueB={metricsB.taxaEngajamento}
                    colorA={colorA}
                    colorB={colorB}
                    formatValue={formatPercent}
                  />
                  <ComparisonMetricCard
                    label="Média Curtidas/Post"
                    icon={ThumbsUp}
                    valueA={metricsA.mediaCurtidasPorPost}
                    valueB={metricsB.mediaCurtidasPorPost}
                    colorA={colorA}
                    colorB={colorB}
                    formatValue={formatDecimal}
                  />
                  <ComparisonMetricCard
                    label="Média Comentários/Post"
                    icon={MessageSquare}
                    valueA={metricsA.mediaComentariosPorPost}
                    valueB={metricsB.mediaComentariosPorPost}
                    colorA={colorA}
                    colorB={colorB}
                    formatValue={formatDecimal}
                  />
                </div>

                {/* Followers Evolution Chart */}
                <ComparisonFollowersChart
                  dataA={chartColetasA}
                  dataB={chartColetasB}
                  profileAName={profileAName}
                  profileBName={profileBName}
                  colorA={colorA}
                  colorB={colorB}
                />

                {/* Weekly Engagement Chart */}
                <ComparisonEngagementChart
                  dataA={weeklyEngagementA}
                  dataB={weeklyEngagementB}
                  profileAName={profileAName}
                  profileBName={profileBName}
                  colorA={colorA}
                  colorB={colorB}
                />

                {/* Post Types Distribution */}
                <ComparisonPostTypesChart
                  dataA={postTypesA}
                  dataB={postTypesB}
                  profileAName={profileAName}
                  profileBName={profileBName}
                  colorA={colorA}
                  colorB={colorB}
                />

                {/* Top Posts */}
                <ComparisonTopPosts
                  postsA={postsA}
                  postsB={postsB}
                  profileAName={profileAName}
                  profileBName={profileBName}
                  colorA={colorA}
                  colorB={colorB}
                />

                {/* Executive Summary */}
                <ComparisonSummary
                  profileAName={profileAName}
                  profileBName={profileBName}
                  metricsA={metricsA}
                  metricsB={metricsB}
                  colorA={colorA}
                  colorB={colorB}
                />
              </>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Comparativo;
