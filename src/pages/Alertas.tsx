import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import {
  AlertSummaryCards,
  AlertsList,
  AlertConfigList,
  AlertConfigModal,
  AlertTips,
  AlertSkeleton,
} from '@/components/alerts';
import { AlertConfig, AlertConfigInput, AlertHistorico, AlertSummary } from '@/types/alerts';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';
import { subDays } from 'date-fns';

const Alertas = () => {
  const { userProfile } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = userProfile?.role === 'admin';

  const [modalOpen, setModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<AlertConfig | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch profiles for dropdowns
  const { data: profiles = [] } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fpobserva_perfis')
        .select('id, nome, plataforma, cor_grafico')
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch summary counts
  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ['alertSummary'],
    queryFn: async () => {
      const sevenDaysAgo = subDays(new Date(), 7).toISOString();

      const [activeResult, triggeredResult, unreadResult] = await Promise.all([
        supabase
          .from('fpobserva_alertas_config')
          .select('id', { count: 'planned', head: true })
          .eq('ativo', true),
        supabase
          .from('fpobserva_alertas_historico')
          .select('id', { count: 'planned', head: true })
          .gte('created_at', sevenDaysAgo),
        supabase
          .from('fpobserva_alertas_historico')
          .select('id', { count: 'planned', head: true })
          .eq('visualizado', false),
      ]);

      return {
        alertasAtivos: activeResult.count || 0,
        alertasDisparados: triggeredResult.count || 0,
        naoVisualizados: unreadResult.count || 0,
      } as AlertSummary;
    },
    staleTime: 60 * 1000,
  });

  // Fetch alert history
  const { data: alertHistory = [], isLoading: loadingHistory } = useQuery({
    queryKey: ['alertHistory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fpobserva_alertas_historico')
        .select(`
          *,
          config:alerta_config_id (
            id,
            tipo_metrica,
            perfil:perfil_id (
              id,
              nome,
              cor_grafico
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return (data || []) as AlertHistorico[];
    },
    staleTime: 60 * 1000,
  });

  // Fetch alert configs (admin only)
  const { data: alertConfigs = [], isLoading: loadingConfigs } = useQuery({
    queryKey: ['alertConfigs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fpobserva_alertas_config')
        .select(`
          *,
          perfil:perfil_id (
            id,
            nome,
            plataforma,
            cor_grafico
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as AlertConfig[];
    },
    enabled: isAdmin,
    staleTime: 60 * 1000,
  });

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('fpobserva_alertas_historico')
      .update({ visualizado: true })
      .eq('id', id);

    if (error) {
      toast.error('Erro ao marcar alerta como lido');
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['alertHistory'] });
    queryClient.invalidateQueries({ queryKey: ['alertSummary'] });
    toast.success('Alerta marcado como lido');
  };

  const handleNewAlert = () => {
    setEditingConfig(null);
    setModalOpen(true);
  };

  const handleEditAlert = (config: AlertConfig) => {
    setEditingConfig(config);
    setModalOpen(true);
  };

  const handleDeleteAlert = async (id: string) => {
    const confirmed = window.confirm('Tem certeza que deseja excluir este alerta?');
    if (!confirmed) return;

    const { error } = await supabase.from('fpobserva_alertas_config').delete().eq('id', id);

    if (error) {
      toast.error('Erro ao excluir alerta');
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['alertConfigs'] });
    queryClient.invalidateQueries({ queryKey: ['alertSummary'] });
    toast.success('Alerta excluído!');
  };

  const handleToggleActive = async (id: string, ativo: boolean) => {
    const { error } = await supabase
      .from('fpobserva_alertas_config')
      .update({ ativo })
      .eq('id', id);

    if (error) {
      toast.error('Erro ao atualizar alerta');
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['alertConfigs'] });
    queryClient.invalidateQueries({ queryKey: ['alertSummary'] });
    toast.success(ativo ? 'Alerta ativado!' : 'Alerta desativado!');
  };

  const handleSaveConfig = async (input: AlertConfigInput) => {
    setSaving(true);
    try {
      if (editingConfig) {
        const { error } = await supabase
          .from('fpobserva_alertas_config')
          .update(input)
          .eq('id', editingConfig.id);

        if (error) throw error;
        toast.success('Alerta atualizado!');
      } else {
        const { error } = await supabase.from('fpobserva_alertas_config').insert(input);

        if (error) throw error;
        toast.success('Alerta criado!');
      }

      queryClient.invalidateQueries({ queryKey: ['alertConfigs'] });
      queryClient.invalidateQueries({ queryKey: ['alertSummary'] });
      setModalOpen(false);
    } catch (error) {
      toast.error('Erro ao salvar alerta');
    } finally {
      setSaving(false);
    }
  };

  const isLoading = loadingSummary || loadingHistory || (isAdmin && loadingConfigs);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#00285F]/20">
            <Bell className="h-6 w-6 text-[#00285F]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Central de Alertas</h1>
            <p className="text-muted-foreground">
              Configuração e histórico de alertas da campanha
            </p>
          </div>
        </div>

        {isLoading ? (
          <AlertSkeleton />
        ) : (
          <>
            {/* Summary Cards */}
            <AlertSummaryCards
              summary={summary || { alertasAtivos: 0, alertasDisparados: 0, naoVisualizados: 0 }}
              loading={loadingSummary}
            />

            {/* Alerts History */}
            <AlertsList
              alerts={alertHistory}
              loading={loadingHistory}
              onMarkAsRead={markAsRead}
              profiles={profiles}
            />

            {/* Config Section (Admin only) */}
            {isAdmin && (
              <AlertConfigList
                configs={alertConfigs}
                loading={loadingConfigs}
                onEdit={handleEditAlert}
                onDelete={handleDeleteAlert}
                onToggleActive={handleToggleActive}
                onNewAlert={handleNewAlert}
              />
            )}

            {/* Tips */}
            <AlertTips />
          </>
        )}

        {/* Config Modal */}
        <AlertConfigModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          config={editingConfig}
          profiles={profiles}
          onSave={handleSaveConfig}
          saving={saving}
        />
      </div>
    </MainLayout>
  );
};

export default Alertas;
