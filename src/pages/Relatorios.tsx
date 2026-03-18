import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileBarChart } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import { useLatestPostDateReference } from '@/hooks/useLatestDataReference';
import { toast } from 'sonner';
import {
  ReportGenerator,
  ReportPreview,
  ReportHistory,
  ReportSkeleton,
} from '@/components/reports';
import {
  ReportConfig,
  ReportData,
  ProfileMetrics,
  WeeklyData,
  Report,
  HistoryFilters,
  Post,
} from '@/types/reports';

const Relatorios = () => {
  const today = new Date();
  const weekAgo = subDays(today, 7);
  const [defaultWindowApplied, setDefaultWindowApplied] = useState(false);

  const [config, setConfig] = useState<ReportConfig>({
    titulo: `Relatório Semanal - ${format(today, 'dd/MM/yyyy', { locale: ptBR })}`,
    periodoInicio: weekAgo,
    periodoFim: today,
    perfilIds: [],
    tipo: 'resumo',
  });

  const [historyFilters, setHistoryFilters] = useState<HistoryFilters>({
    busca: '',
    dataInicio: null,
    dataFim: null,
  });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Reference date for default period (latest available post date)
  const { data: latestPostDate } = useLatestPostDateReference();

  // Fetch profiles
  const { data: profiles = [], isLoading: loadingProfiles } = useQuery({
    queryKey: ['fpobserva-profiles-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fpobserva_perfis')
        .select('id, nome, plataforma, tipo, cor_grafico, ativo')
        .eq('ativo', true)
        .order('nome');
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 30 * 60 * 1000,
  });

  // Set all profiles selected by default
  React.useEffect(() => {
    if (profiles.length > 0 && config.perfilIds.length === 0) {
      setConfig(prev => ({ ...prev, perfilIds: profiles.map(p => p.id) }));
    }
  }, [profiles]);

  // Apply default period based on data freshness (only once)
  React.useEffect(() => {
    if (!latestPostDate || defaultWindowApplied) return;

    const endDate = new Date(latestPostDate);
    const startDate = subDays(endDate, 7);
    setConfig((prev) => ({
      ...prev,
      titulo: `Relatório Semanal - ${format(endDate, 'dd/MM/yyyy', { locale: ptBR })}`,
      periodoInicio: startDate,
      periodoFim: endDate,
    }));
    setDefaultWindowApplied(true);
  }, [latestPostDate, defaultWindowApplied]);

  // Fetch report history
  const { data: reports = [], isLoading: loadingHistory, refetch: refetchHistory } = useQuery({
    queryKey: ['fpobserva-reports-history', historyFilters],
    queryFn: async () => {
      let query = supabase
        .from('fpobserva_relatorios')
        .select('*')
        .order('created_at', { ascending: false });

      if (historyFilters.busca) {
        query = query.ilike('titulo', `%${historyFilters.busca}%`);
      }
      if (historyFilters.dataInicio) {
        query = query.gte('created_at', startOfDay(historyFilters.dataInicio).toISOString());
      }
      if (historyFilters.dataFim) {
        query = query.lte('created_at', endOfDay(historyFilters.dataFim).toISOString());
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      return (data || []) as Report[];
    },
    staleTime: 2 * 60 * 1000,
  });

  const generateReport = async () => {
    setGenerating(true);
    try {
      const startDate = startOfDay(config.periodoInicio).toISOString();
      const endDate = endOfDay(config.periodoFim).toISOString();

      // Fetch posts for the period
      const { data: postsData, error: postsError } = await supabase
        .from('fpobserva_posts')
        .select('*, fpobserva_perfis!inner(nome, cor_grafico)')
        .in('perfil_id', config.perfilIds)
        .gte('data_publicacao', startDate)
        .lte('data_publicacao', endDate)
        .order('engajamento_total', { ascending: false });

      if (postsError) throw postsError;

      // Fetch latest coletas for followers
      const { data: coletasData, error: coletasError } = await supabase
        .from('fpobserva_coletas')
        .select('*')
        .in('perfil_id', config.perfilIds)
        .order('data_coleta', { ascending: false });

      if (coletasError) throw coletasError;

      // Process posts with profile names
      const posts: Post[] = (postsData || []).map(post => ({
        id: post.id,
        perfil_id: post.perfil_id,
        perfil_nome: (post.fpobserva_perfis as any)?.nome || '',
        data_publicacao: post.data_publicacao,
        tipo: post.tipo,
        curtidas: post.curtidas,
        comentarios: post.comentarios,
        compartilhamentos: post.compartilhamentos,
        engajamento_total: post.engajamento_total,
        conteudo_texto: post.conteudo_texto,
      }));

      // Get latest valid coleta per profile (>0), fallback to latest available
      const coletasByProfile = (coletasData || []).reduce((acc, coleta) => {
        if (!coleta.perfil_id) return acc;
        if (!acc[coleta.perfil_id]) acc[coleta.perfil_id] = [];
        acc[coleta.perfil_id].push(coleta);
        return acc;
      }, {} as Record<string, any[]>);

      const latestColetas = new Map<string, any>();
      Object.entries(coletasByProfile).forEach(([perfilId, values]) => {
        const sorted = values.sort(
          (a, b) => new Date(b.data_coleta).getTime() - new Date(a.data_coleta).getTime()
        );
        const valid = sorted.find((item) => (item.seguidores ?? 0) > 0);
        latestColetas.set(perfilId, valid || sorted[0]);
      });

      // Calculate metrics per profile
      const perfisMetrics: ProfileMetrics[] = profiles
        .filter(p => config.perfilIds.includes(p.id))
        .map(profile => {
          const profilePosts = posts.filter(p => p.perfil_id === profile.id);
          const coleta = latestColetas.get(profile.id);
          const seguidores = coleta?.seguidores || 0;

          const curtidas = profilePosts.reduce((sum, p) => sum + (p.curtidas || 0), 0);
          const comentarios = profilePosts.reduce((sum, p) => sum + (p.comentarios || 0), 0);
          const compartilhamentos = profilePosts.reduce((sum, p) => sum + (p.compartilhamentos || 0), 0);
          const engajamento = curtidas + comentarios + compartilhamentos;
          const taxaEngajamento = seguidores > 0 ? (engajamento / seguidores) * 100 : 0;

          return {
            id: profile.id,
            nome: profile.nome,
            plataforma: profile.plataforma,
            tipo: profile.tipo,
            cor_grafico: profile.cor_grafico,
            seguidores,
            totalPosts: profilePosts.length,
            curtidas,
            comentarios,
            compartilhamentos,
            engajamento,
            taxaEngajamento,
          };
        });

      // Calculate totals
      const totais = {
        posts: posts.length,
        curtidas: posts.reduce((sum, p) => sum + (p.curtidas || 0), 0),
        comentarios: posts.reduce((sum, p) => sum + (p.comentarios || 0), 0),
        compartilhamentos: posts.reduce((sum, p) => sum + (p.compartilhamentos || 0), 0),
        engajamento: posts.reduce((sum, p) => sum + (p.engajamento_total || 0), 0),
      };

      // Find Fabio and Roberto for comparison
      const fabioProfile = perfisMetrics.find(p => 
        p.nome.toLowerCase().includes('fábio') || p.nome.toLowerCase().includes('fabio')
      );
      const robertoProfile = perfisMetrics.find(p => 
        p.nome.toLowerCase().includes('roberto')
      );

      // Group by week for weekly data
      const weeklyMap = new Map<string, { posts: number; engajamento: number }>();
      posts.forEach(post => {
        const weekKey = format(new Date(post.data_publicacao), "'Sem' w/yyyy", { locale: ptBR });
        const existing = weeklyMap.get(weekKey) || { posts: 0, engajamento: 0 };
        weeklyMap.set(weekKey, {
          posts: existing.posts + 1,
          engajamento: existing.engajamento + (post.engajamento_total || 0),
        });
      });

      const weeklyData: WeeklyData[] = Array.from(weeklyMap.entries())
        .map(([semana, data]) => ({ semana, ...data }))
        .sort((a, b) => a.semana.localeCompare(b.semana));

      const data: ReportData = {
        perfis: perfisMetrics,
        posts,
        topPosts: posts.slice(0, 10),
        weeklyData,
        totais,
        comparativo: {
          fabio: fabioProfile || null,
          roberto: robertoProfile || null,
        },
      };

      setReportData(data);
      setPreviewOpen(true);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Erro ao gerar relatório');
    } finally {
      setGenerating(false);
    }
  };

  const saveToHistory = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('fpobserva_relatorios')
        .insert({
          titulo: config.titulo,
          periodo_inicio: format(config.periodoInicio, 'yyyy-MM-dd'),
          periodo_fim: format(config.periodoFim, 'yyyy-MM-dd'),
        });

      if (error) throw error;
      
      toast.success('Relatório salvo no histórico');
      refetchHistory();
    } catch (error) {
      console.error('Error saving report:', error);
      toast.error('Erro ao salvar relatório');
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = (report: Report) => {
    if (report.periodo_inicio && report.periodo_fim) {
      setConfig({
        titulo: report.titulo,
        periodoInicio: new Date(report.periodo_inicio),
        periodoFim: new Date(report.periodo_fim),
        perfilIds: profiles.map(p => p.id),
        tipo: 'resumo',
      });
      setTimeout(generateReport, 100);
    }
  };

  if (loadingProfiles) {
    return (
      <MainLayout>
        <ReportSkeleton />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 print:hidden">
        {/* Header */}
        <div className="flex items-center gap-3">
          <FileBarChart className="h-8 w-8 text-secondary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
            <p className="text-sm text-muted-foreground">
              Geração e histórico de relatórios da campanha
            </p>
          </div>
        </div>

        {/* Report Generator */}
        <ReportGenerator
          profiles={profiles}
          config={config}
          onConfigChange={setConfig}
          onGenerate={generateReport}
          loading={generating}
        />

        {/* Report History */}
        <ReportHistory
          reports={reports}
          loading={loadingHistory}
          onRegenerate={handleRegenerate}
          filters={historyFilters}
          onFiltersChange={setHistoryFilters}
        />

        {/* Report Preview Modal */}
        {reportData && (
          <ReportPreview
            isOpen={previewOpen}
            onClose={() => setPreviewOpen(false)}
            config={config}
            data={reportData}
            onSaveToHistory={saveToHistory}
            saving={saving}
          />
        )}
      </div>

      {/* Print-only content */}
      {reportData && previewOpen && (
        <div className="hidden print:block">
          <div className="print-content">
            {/* PrintableReport will be rendered here during print */}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Relatorios;
