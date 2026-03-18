import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AtSign, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import type { MentionPreview } from '@/types/dashboard';

export const MentionsPreview: React.FC = () => {
  const { data: mentions, isLoading } = useQuery({
    queryKey: ['mentions-preview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fpobserva_vw_mencoes_reitoria')
        .select('id, perfil_nome, data_publicacao, conteudo_texto, sentimento, menciona_fabio, menciona_antonio, menciona_reitoria')
        .order('data_publicacao', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data as MentionPreview[];
    },
  });

  const getMentionBadge = (mention: MentionPreview) => {
    if (mention.menciona_fabio || mention.menciona_carlos) {
      return <Badge className="bg-blue-500/20 text-blue-400 border-none text-xs">CM</Badge>;
    }
    if (mention.menciona_antonio || mention.menciona_ana) {
      return <Badge className="bg-red-500/20 text-red-400 border-none text-xs">AR</Badge>;
    }
    if (mention.menciona_reitoria || mention.menciona_diretoria) {
      return <Badge className="bg-secondary/20 text-secondary border-none text-xs">Diretoria</Badge>;
    }
    return null;
  };

  const getSentimentBadge = (sentimento: string | null) => {
    if (!sentimento) return null;
    const lower = sentimento.toLowerCase();
    
    if (lower === 'positivo' || lower === 'positive') {
      return <Badge className="bg-green-500/20 text-green-400 border-none text-xs">Pos</Badge>;
    }
    if (lower === 'negativo' || lower === 'negative') {
      return <Badge className="bg-red-500/20 text-red-400 border-none text-xs">Neg</Badge>;
    }
    return <Badge className="bg-gray-500/20 text-gray-400 border-none text-xs">Neu</Badge>;
  };

  const formatRelativeTime = (date: string | null) => {
    if (!date) return '';
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
    } catch {
      return '';
    }
  };

  const truncateText = (text: string | null, maxLength = 80) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-6 w-10" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!mentions || mentions.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AtSign className="h-5 w-5 text-secondary" />
              Últimas Menções Monitoradas
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            Nenhuma menção encontrada
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <AtSign className="h-5 w-5 text-secondary" />
            Últimas Menções Monitoradas
          </CardTitle>
          <Link 
            to="/inteligencia" 
            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
          >
            Ver radar <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {mentions.map((mention) => (
            <div 
              key={mention.id} 
              className="flex items-center gap-3 py-2 px-3 rounded-lg bg-muted/5 hover:bg-muted/10 transition-colors"
            >
              {getMentionBadge(mention)}
              <div className="flex-1 min-w-0">
                <span className="text-xs text-muted-foreground">@{mention.perfil_nome}</span>
                <p className="text-sm text-foreground truncate">
                  {truncateText(mention.conteudo_texto)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {getSentimentBadge(mention.sentimento)}
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatRelativeTime(mention.data_publicacao)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
