import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { MessageCircle } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import {
  WhatsAppSummaryCards,
  WhatsAppTrendChart,
  WhatsAppCategoriesChart,
  WhatsAppTopSenders,
  WhatsAppMessagesTable,
} from '@/components/whatsapp';
import type { WhatsAppMensagem, WhatsAppResumo } from '@/types/whatsapp';

const WhatsApp = () => {
  const { data: resumo, isLoading: loadingResumo } = useQuery({
    queryKey: ['whatsapp-resumo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fpobserva_vw_whatsapp_resumo')
        .select('*')
        .limit(1)
        .single();
      if (error) throw error;
      return data as WhatsAppResumo;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: mensagens = [], isLoading: loadingMensagens } = useQuery({
    queryKey: ['whatsapp-mensagens'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fpobserva_whatsapp_mensagens')
        .select('*')
        .order('data_recebimento', { ascending: false });
      if (error) throw error;
      return data as WhatsAppMensagem[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const loading = loadingResumo || loadingMensagens;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <MessageCircle className="h-8 w-8 text-green-400" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">WhatsApp</h1>
            <p className="text-muted-foreground">
              Análise das mensagens recebidas de eleitores e cidadãos
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <WhatsAppSummaryCards resumo={resumo} loading={loading} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WhatsAppTrendChart mensagens={mensagens} loading={loadingMensagens} />
          <WhatsAppCategoriesChart mensagens={mensagens} loading={loadingMensagens} />
        </div>

        {/* Top Senders + Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <WhatsAppTopSenders mensagens={mensagens} loading={loadingMensagens} />
          </div>
          <div className="lg:col-span-2">
            <WhatsAppMessagesTable mensagens={mensagens} loading={loadingMensagens} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default WhatsApp;
