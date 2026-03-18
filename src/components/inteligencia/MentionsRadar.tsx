import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  useLatestEbserhMentionDateReference,
  useLatestReitoriaMentionDateReference,
} from '@/hooks/useLatestDataReference';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, User, Heart, MessageCircle, Share2, AtSign, X, Hospital } from 'lucide-react';
import { format, subDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { MentionPost, MentionsFiltersState } from '@/types/intelligence';

interface MentionsRadarProps {
  ebserhFilter?: boolean;
  onClearEbserhFilter?: () => void;
}

export const MentionsRadar: React.FC<MentionsRadarProps> = ({ 
  ebserhFilter = false, 
  onClearEbserhFilter 
}) => {
  const [filters, setFilters] = useState<MentionsFiltersState>({
    dataInicio: null,
    dataFim: null,
    tipoMencao: 'todos',
    perfilOrigem: null,
    sentimento: null,
  });

  // Reset to EBSERH filter when activated
  useEffect(() => {
    if (ebserhFilter) {
      // When EBSERH filter is on, we'll show data from the EBSERH view
      setFilters((f) => ({ ...f, tipoMencao: 'todos', perfilOrigem: null, sentimento: null }));
    }
  }, [ebserhFilter]);

  const { data: latestRegularDate } = useLatestReitoriaMentionDateReference();
  const { data: latestEbserhDate } = useLatestEbserhMentionDateReference();

  // Keep 30-day window anchored to the latest available date in each dataset.
  useEffect(() => {
    const sourceDate = ebserhFilter ? latestEbserhDate : latestRegularDate;
    if (!sourceDate) return;

    const endDate = parseISO(sourceDate);
    setFilters((current) => ({
      ...current,
      dataFim: endDate,
      dataInicio: subDays(endDate, 30),
    }));
  }, [ebserhFilter, latestRegularDate, latestEbserhDate]);

  // Query for EBSERH mentions when filter is active
  const { data: ebserhMentions, isLoading: isLoadingEbserh } = useQuery({
    queryKey: ['ebserh-mentions-radar', filters],
    queryFn: async () => {
      let query = supabase
        .from('fpobserva_vw_mencoes_ebserh')
        .select('*')
        .order('data_publicacao', { ascending: false });

      if (filters.dataInicio) {
        query = query.gte('data_publicacao', format(filters.dataInicio, 'yyyy-MM-dd'));
      }
      if (filters.dataFim) {
        query = query.lte('data_publicacao', format(filters.dataFim, 'yyyy-MM-dd'));
      }
      if (filters.perfilOrigem) {
        query = query.eq('perfil_nome', filters.perfilOrigem);
      }
      if (filters.sentimento) {
        query = query.eq('sentimento', filters.sentimento);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: ebserhFilter,
    staleTime: 5 * 60 * 1000,
  });

  // Query for regular mentions when EBSERH filter is NOT active
  const { data: mentions, isLoading: isLoadingMentions } = useQuery({
    queryKey: ['mentions-radar', filters],
    queryFn: async () => {
      let query = supabase
        .from('fpobserva_vw_mencoes_reitoria')
        .select('*')
        .order('data_publicacao', { ascending: false });

      if (filters.dataInicio) {
        query = query.gte('data_publicacao', format(filters.dataInicio, 'yyyy-MM-dd'));
      }
      if (filters.dataFim) {
        query = query.lte('data_publicacao', format(filters.dataFim, 'yyyy-MM-dd'));
      }
      if (filters.perfilOrigem) {
        query = query.eq('perfil_nome', filters.perfilOrigem);
      }
      if (filters.sentimento) {
        query = query.eq('sentimento', filters.sentimento);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MentionPost[];
    },
    enabled: !ebserhFilter,
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = ebserhFilter ? isLoadingEbserh : isLoadingMentions;

  const { data: profiles } = useQuery({
    queryKey: ['profiles-filter'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fpobserva_perfis')
        .select('nome')
        .eq('ativo', true)
        .order('nome');
      if (error) throw error;
      return data;
    },
    staleTime: 30 * 60 * 1000,
  });

  const filteredMentions = useMemo(() => {
    if (!mentions) return [];
    return mentions.filter((m) => {
      if (filters.tipoMencao === 'fp') return m.menciona_fabio;
      if (filters.tipoMencao === 'acn') return m.menciona_antonio;
      if (filters.tipoMencao === 'reitoria') return m.menciona_reitoria;
      return true;
    });
  }, [mentions, filters.tipoMencao]);

  // Chart data - group by date
  const chartData = useMemo(() => {
    if (!filteredMentions.length) return [];
    const grouped = filteredMentions.reduce((acc, m) => {
      const date = m.data_publicacao?.split('T')[0] || 'unknown';
      if (!acc[date]) {
        acc[date] = { date, fp: 0, acn: 0, reitoria: 0 };
      }
      if (m.menciona_fabio) acc[date].fp++;
      if (m.menciona_antonio) acc[date].acn++;
      if (m.menciona_reitoria) acc[date].reitoria++;
      return acc;
    }, {} as Record<string, { date: string; fp: number; acn: number; reitoria: number }>);

    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredMentions]);

  // Summary counts
  const summary = useMemo(() => {
    if (!mentions) return { fp: 0, acn: 0, reitoria: 0 };
    return {
      fp: mentions.filter((m) => m.menciona_fabio).length,
      acn: mentions.filter((m) => m.menciona_antonio).length,
      reitoria: mentions.filter((m) => m.menciona_reitoria).length,
    };
  }, [mentions]);

  const getMentionBadges = (post: MentionPost) => {
    const badges = [];
    if (post.menciona_fabio) {
      badges.push(
        <Badge key="fp" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          FP
        </Badge>
      );
    }
    if (post.menciona_antonio) {
      badges.push(
        <Badge key="acn" className="bg-red-500/20 text-red-400 border-red-500/30">
          ACN
        </Badge>
      );
    }
    if (post.menciona_reitoria) {
      badges.push(
        <Badge key="reitoria" className="bg-secondary/20 text-secondary border-secondary/30">
          Reitoria
        </Badge>
      );
    }
    return badges;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-40" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Current active data based on filter
  const activeData = ebserhFilter ? ebserhMentions : filteredMentions;
  const activeCount = activeData?.length || 0;

  return (
    <div className="space-y-6">
      {/* EBSERH Filter Badge */}
      {ebserhFilter && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/50">
          <Hospital className="h-5 w-5 text-amber-500" />
          <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
            Filtrando: EBSERH/HUAP
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearEbserhFilter}
            className="ml-auto h-7 px-2 text-amber-700 hover:text-amber-900 hover:bg-amber-500/20"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar filtro
          </Button>
        </div>
      )}

      {/* Filters - hide tipo_mencao when EBSERH filter is active */}
      <div className="flex flex-wrap gap-4">
        {!ebserhFilter && (
          <Select
            value={filters.tipoMencao}
            onValueChange={(value) =>
              setFilters((f) => ({ ...f, tipoMencao: value as MentionsFiltersState['tipoMencao'] }))
            }
          >
            <SelectTrigger className="w-[180px] bg-card border-border">
              <SelectValue placeholder="Tipo de Menção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas as Menções</SelectItem>
              <SelectItem value="fp">Fábio Passos</SelectItem>
              <SelectItem value="acn">Antônio Claudio</SelectItem>
              <SelectItem value="reitoria">Reitoria</SelectItem>
            </SelectContent>
          </Select>
        )}

        <Select
          value={filters.perfilOrigem || 'todos'}
          onValueChange={(value) =>
            setFilters((f) => ({ ...f, perfilOrigem: value === 'todos' ? null : value }))
          }
        >
          <SelectTrigger className="w-[200px] bg-card border-border">
            <SelectValue placeholder="Perfil de Origem" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Perfis</SelectItem>
            {profiles?.map((p) => (
              <SelectItem key={p.nome} value={p.nome}>
                {p.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.sentimento || 'todos'}
          onValueChange={(value) =>
            setFilters((f) => ({ ...f, sentimento: value === 'todos' ? null : value }))
          }
        >
          <SelectTrigger className="w-[150px] bg-card border-border">
            <SelectValue placeholder="Sentimento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="positivo">Positivo</SelectItem>
            <SelectItem value="neutro">Neutro</SelectItem>
            <SelectItem value="negativo">Negativo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards - only show when NOT in EBSERH mode */}
      {!ebserhFilter && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-500/10 border-blue-500/30">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Fábio Passos</p>
                  <p className="text-2xl font-bold text-blue-400">{summary.fp}</p>
                </div>
                <AtSign className="h-8 w-8 text-blue-400/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-red-500/10 border-red-500/30">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Antônio Claudio</p>
                  <p className="text-2xl font-bold text-red-400">{summary.acn}</p>
                </div>
                <AtSign className="h-8 w-8 text-red-400/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-secondary/10 border-secondary/30">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Reitoria</p>
                  <p className="text-2xl font-bold text-secondary">{summary.reitoria}</p>
                </div>
                <AtSign className="h-8 w-8 text-secondary/50" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* EBSERH Summary Card when in EBSERH mode */}
      {ebserhFilter && (
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Menções EBSERH/HUAP</p>
                <p className="text-2xl font-bold text-amber-500">{activeCount}</p>
              </div>
              <Hospital className="h-8 w-8 text-amber-500/50" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chart - only show when NOT in EBSERH mode */}
      {!ebserhFilter && chartData.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Menções ao Longo do Tempo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => format(parseISO(value), 'dd/MM', { locale: ptBR })}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    labelFormatter={(value) => format(parseISO(value as string), "dd 'de' MMMM", { locale: ptBR })}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="fp" name="Fábio Passos" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="acn" name="Antônio Claudio" stroke="#ef4444" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="reitoria" name="Reitoria" stroke="hsl(var(--secondary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts List */}
      <Card className={`bg-card border-border ${ebserhFilter ? 'border-amber-500/50' : ''}`}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {ebserhFilter && <Hospital className="h-5 w-5 text-amber-500" />}
            {ebserhFilter ? 'Menções EBSERH/HUAP' : 'Posts com Menções'} ({activeCount})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeCount === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {ebserhFilter ? (
                <Hospital className="h-12 w-12 mx-auto mb-4 opacity-50" />
              ) : (
                <AtSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              )}
              <p>Nenhuma menção encontrada com os filtros selecionados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(activeData || []).slice(0, 20).map((post: any) => (
                <div
                  key={post.id}
                  className={`p-4 rounded-lg bg-muted/30 border transition-colors ${
                    ebserhFilter 
                      ? 'border-amber-500/30 hover:border-amber-500/50' 
                      : 'border-border hover:border-secondary/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{post.perfil_nome}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {post.data_publicacao && format(parseISO(post.data_publicacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </span>
                        {ebserhFilter ? (
                          <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">
                            EBSERH
                          </Badge>
                        ) : (
                          getMentionBadges(post)
                        )}
                        {ebserhFilter && post.tom_ebserh && (
                          <Badge 
                            variant="outline"
                            className={
                              post.tom_ebserh === 'favoravel'
                                ? 'text-green-400 border-green-400/30'
                                : post.tom_ebserh === 'critico'
                                ? 'text-red-400 border-red-400/30'
                                : 'text-muted-foreground'
                            }
                          >
                            {post.tom_ebserh}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-foreground/90 line-clamp-3">
                        {post.conteudo_texto || 'Sem texto'}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" /> {post.curtidas || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" /> {post.comentarios || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 className="h-3 w-3" /> {post.compartilhamentos || 0}
                        </span>
                        {post.sentimento && (
                          <Badge
                            variant="outline"
                            className={
                              post.sentimento === 'positivo'
                                ? 'text-green-400 border-green-400/30'
                                : post.sentimento === 'negativo'
                                ? 'text-red-400 border-red-400/30'
                                : 'text-muted-foreground'
                            }
                          >
                            {post.sentimento}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {post.url_post && (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={post.url_post} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
