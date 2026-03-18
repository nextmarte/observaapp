import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/MainLayout';
import { Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  ProfileFilters,
  ProfileSummaryCards,
  ProfileGrid,
  ProfileDetailModal,
  ProfileSkeleton,
} from '@/components/profiles';
import {
  ProfileFiltersState,
  ProfileWithMetrics,
  ProfileSummary,
  Coleta,
  WeeklyEngagement,
} from '@/types/profiles';
import { Post } from '@/types/posts';

const Perfis = () => {
  const navigate = useNavigate();
  
  // Estado dos filtros
  const [filters, setFilters] = useState<ProfileFiltersState>({
    plataforma: 'all',
    tipo: 'all',
    ordenarPor: 'nome',
  });

  // Estado do modal
  const [selectedProfile, setSelectedProfile] = useState<ProfileWithMetrics | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Query para buscar perfis ativos
  const { data: profiles, isLoading: loadingProfiles } = useQuery({
    queryKey: ['profiles-active'],
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

  // Query para buscar coletas (última e penúltima de cada perfil)
  const { data: coletas, isLoading: loadingColetas } = useQuery({
    queryKey: ['profiles-coletas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fpobserva_coletas')
        .select('*')
        .order('data_coleta', { ascending: false });

      if (error) throw error;
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });

  // Query para buscar posts da última semana
  const { data: postsLastWeek, isLoading: loadingPostsWeek } = useQuery({
    queryKey: ['profiles-posts-week'],
    queryFn: async () => {
      const { data: latestPost, error: latestError } = await supabase
        .from('fpobserva_posts')
        .select('data_publicacao')
        .not('data_publicacao', 'is', null)
        .order('data_publicacao', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestError) throw latestError;
      if (!latestPost?.data_publicacao) return [];

      const windowEnd = new Date(latestPost.data_publicacao);
      const windowStart = new Date(windowEnd);
      windowStart.setDate(windowStart.getDate() - 7);

      const { data, error } = await supabase
        .from('fpobserva_posts')
        .select('perfil_id, engajamento_total, data_publicacao')
        .not('data_publicacao', 'is', null)
        .gte('data_publicacao', windowStart.toISOString())
        .lte('data_publicacao', windowEnd.toISOString());

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Calcular métricas para cada perfil
  const profilesWithMetrics: ProfileWithMetrics[] = useMemo(() => {
    if (!profiles || !coletas || !postsLastWeek) return [];

    return profiles.map((profile) => {
      // Coletas válidas deste perfil (evita usar snapshot zerado como "atual")
      const profileColetas = coletas.filter(
        (c) => c.perfil_id === profile.id && (c.seguidores ?? 0) > 0
      );

      const ultimaColeta = profileColetas[0];
      const penultimaColeta = profileColetas[1];

      const seguidoresAtuais = ultimaColeta?.seguidores ?? 0;
      const seguidoresAnteriores = penultimaColeta?.seguidores ?? seguidoresAtuais;
      const variacaoSeguidores = seguidoresAtuais - seguidoresAnteriores;

      // Posts da semana deste perfil
      const profilePosts = postsLastWeek.filter((p) => p.perfil_id === profile.id);
      const postsSemana = profilePosts.length;
      const engajamentoSemana = profilePosts.reduce(
        (sum, p) => sum + (p.engajamento_total ?? 0),
        0
      );

      return {
        ...profile,
        seguidoresAtuais,
        seguidoresAnteriores,
        variacaoSeguidores,
        postsSemana,
        engajamentoSemana,
      };
    });
  }, [profiles, coletas, postsLastWeek]);

  // Calcular resumo geral
  const summary: ProfileSummary | null = useMemo(() => {
    if (profilesWithMetrics.length === 0) return null;

    const totalPerfisAtivos = profilesWithMetrics.length;
    const totalSeguidores = profilesWithMetrics.reduce(
      (sum, p) => sum + p.seguidoresAtuais,
      0
    );

    // Maior crescimento
    const sortedByCrescimento = [...profilesWithMetrics].sort(
      (a, b) => b.variacaoSeguidores - a.variacaoSeguidores
    );
    const maiorCrescimento = sortedByCrescimento[0]?.variacaoSeguidores > 0
      ? {
          nome: sortedByCrescimento[0].nome,
          variacao: sortedByCrescimento[0].variacaoSeguidores,
        }
      : null;

    // Maior engajamento
    const sortedByEngajamento = [...profilesWithMetrics].sort(
      (a, b) => b.engajamentoSemana - a.engajamentoSemana
    );
    const maiorEngajamento = sortedByEngajamento[0]?.engajamentoSemana > 0
      ? {
          nome: sortedByEngajamento[0].nome,
          engajamento: sortedByEngajamento[0].engajamentoSemana,
        }
      : null;

    return {
      totalPerfisAtivos,
      totalSeguidores,
      maiorCrescimento,
      maiorEngajamento,
    };
  }, [profilesWithMetrics]);

  // Filtrar e ordenar perfis
  const filteredProfiles = useMemo(() => {
    let result = [...profilesWithMetrics];

    if (filters.plataforma && filters.plataforma !== 'all') {
      result = result.filter(
        (p) => p.plataforma.toLowerCase() === filters.plataforma.toLowerCase()
      );
    }

    if (filters.tipo && filters.tipo !== 'all') {
      result = result.filter(
        (p) => p.tipo.toLowerCase() === filters.tipo.toLowerCase()
      );
    }

    result.sort((a, b) => {
      switch (filters.ordenarPor) {
        case 'nome':
          return a.nome.localeCompare(b.nome);
        case 'seguidores':
          return b.seguidoresAtuais - a.seguidoresAtuais;
        case 'engajamento':
          return b.engajamentoSemana - a.engajamentoSemana;
        default:
          return 0;
      }
    });

    return result;
  }, [profilesWithMetrics, filters]);

  // Query para coletas do perfil selecionado (modal)
  const { data: profileColetas, isLoading: loadingProfileColetas } = useQuery({
    queryKey: ['profile-coletas', selectedProfile?.id],
    queryFn: async () => {
      if (!selectedProfile) return [];

      const { data, error } = await supabase
        .from('fpobserva_coletas')
        .select('*')
        .eq('perfil_id', selectedProfile.id)
        .order('data_coleta', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Coleta[];
    },
    enabled: !!selectedProfile,
    staleTime: 10 * 60 * 1000,
  });

  // Query para engajamento semanal do perfil selecionado (modal)
  const { data: profileEngagement, isLoading: loadingProfileEngagement } = useQuery({
    queryKey: ['profile-engagement', selectedProfile?.id],
    queryFn: async () => {
      if (!selectedProfile) return [];

      const { data, error } = await supabase
        .from('fpobserva_vw_engajamento_historico')
        .select('semana_ano, engajamento_acumulado')
        .eq('perfil_id', selectedProfile.id)
        .order('semana_ano', { ascending: true })
        .limit(10);

      if (error) throw error;
      
      return (data || []).map((d) => ({
        semana_ano: d.semana_ano || '',
        engajamento: Number(d.engajamento_acumulado) || 0,
      })) as WeeklyEngagement[];
    },
    enabled: !!selectedProfile,
    staleTime: 10 * 60 * 1000,
  });

  // Query para últimos posts do perfil selecionado (modal)
  const { data: profilePosts, isLoading: loadingProfilePosts } = useQuery({
    queryKey: ['profile-posts', selectedProfile?.id],
    queryFn: async () => {
      if (!selectedProfile) return [];

      const { data, error } = await supabase
        .from('fpobserva_posts')
        .select('*')
        .eq('perfil_id', selectedProfile.id)
        .order('data_publicacao', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as Post[];
    },
    enabled: !!selectedProfile,
    staleTime: 5 * 60 * 1000,
  });

  // Handlers
  const handleProfileClick = (profile: ProfileWithMetrics) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
  };

  const handleViewAllPosts = (perfilId: string) => {
    navigate(`/posts?perfil=${perfilId}`);
  };

  const isLoading = loadingProfiles || loadingColetas || loadingPostsWeek;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-secondary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Perfis Monitorados</h1>
            <p className="text-muted-foreground">
              Acompanhamento dos perfis nas redes sociais
            </p>
          </div>
        </div>

        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          <>
            {/* Cards de Resumo */}
            <ProfileSummaryCards summary={summary} loading={false} />

            {/* Filtros */}
            <ProfileFilters filters={filters} onFiltersChange={setFilters} />

            {/* Grid de Perfis */}
            <ProfileGrid
              profiles={filteredProfiles}
              loading={false}
              onProfileClick={handleProfileClick}
            />
          </>
        )}

        {/* Modal de Detalhes */}
        <ProfileDetailModal
          profile={selectedProfile}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onViewAllPosts={handleViewAllPosts}
          coletas={profileColetas || []}
          weeklyEngagement={profileEngagement || []}
          recentPosts={profilePosts || []}
          loadingColetas={loadingProfileColetas}
          loadingEngagement={loadingProfileEngagement}
          loadingPosts={loadingProfilePosts}
        />
      </div>
    </MainLayout>
  );
};

export default Perfis;
