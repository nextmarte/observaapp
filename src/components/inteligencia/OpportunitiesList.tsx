import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, ExternalLink, TrendingUp, MessageSquare, Target, Megaphone } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { IntelligenceItem } from '@/types/intelligence';

export const OpportunitiesList: React.FC = () => {
  const { data: opportunities, isLoading } = useQuery({
    queryKey: ['opportunities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fpobserva_vw_inteligencia_campanha')
        .select('*')
        .eq('relevancia_campanha', 'alta')
        .order('engajamento', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data as IntelligenceItem[];
    },
  });

  const getSuggestedAction = (item: IntelligenceItem) => {
    const actions = [];

    if (item.tipo_informacao === 'oportunidade') {
      actions.push({
        icon: Megaphone,
        text: 'Criar conteúdo sobre o tema',
        color: 'text-green-400',
      });
    }

    if (item.categoria_estrategica?.toLowerCase().includes('demanda')) {
      actions.push({
        icon: Target,
        text: 'Incluir na pauta de compromissos',
        color: 'text-amber-400',
      });
    }

    if (item.engajamento && item.engajamento > 1000) {
      actions.push({
        icon: TrendingUp,
        text: 'Tema com alto engajamento - priorizar',
        color: 'text-blue-400',
      });
    }

    if (item.mencoes && item.mencoes.length > 0) {
      actions.push({
        icon: MessageSquare,
        text: 'Responder menções diretamente',
        color: 'text-purple-400',
      });
    }

    if (actions.length === 0) {
      actions.push({
        icon: Lightbulb,
        text: 'Analisar para definir estratégia',
        color: 'text-secondary',
      });
    }

    return actions;
  };

  const getThemeSuggestions = (item: IntelligenceItem) => {
    const suggestions: string[] = [];

    if (item.categoria_estrategica) {
      suggestions.push(`Abordar tema: ${item.categoria_estrategica}`);
    }

    if (item.subcategoria) {
      suggestions.push(`Foco em: ${item.subcategoria}`);
    }

    if (item.notas_campanha) {
      suggestions.push(item.notas_campanha);
    }

    return suggestions;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    );
  }

  if (!opportunities || opportunities.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Nenhuma oportunidade de alta relevância no momento</p>
            <p className="text-sm">Continue monitorando os perfis para identificar novas oportunidades</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Oportunidades Identificadas</h3>
          <p className="text-sm text-muted-foreground">
            Posts com alta relevância para a campanha
          </p>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          {opportunities.length} oportunidades
        </Badge>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {opportunities.map((item) => {
          const actions = getSuggestedAction(item);
          const themes = getThemeSuggestions(item);

          return (
            <Card key={item.id} className="bg-card border-border hover:border-green-500/50 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Lightbulb className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{item.perfil || 'Perfil desconhecido'}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {item.data_publicacao &&
                          format(parseISO(item.data_publicacao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  {item.categoria_estrategica && (
                    <Badge variant="outline" className="text-xs">
                      {item.categoria_estrategica}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Content Preview */}
                <p className="text-sm text-foreground/90 line-clamp-3">
                  {item.conteudo_texto || 'Sem conteúdo disponível'}
                </p>

                {/* Engagement */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Engajamento: {item.engajamento?.toLocaleString('pt-BR') || 0}
                  </span>
                  {item.subcategoria && <span>• {item.subcategoria}</span>}
                </div>

                {/* Suggested Actions */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Ações Sugeridas:</p>
                  <div className="space-y-1">
                    {actions.map((action, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <action.icon className={`h-3 w-3 ${action.color}`} />
                        <span className="text-sm">{action.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Theme Suggestions */}
                {themes.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Temas para Incorporar ao Discurso:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {themes.map((theme, i) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-secondary/20">
                          {theme}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
