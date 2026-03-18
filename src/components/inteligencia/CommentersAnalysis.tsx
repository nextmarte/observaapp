import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, UserPlus, Heart, Shield, AlertTriangle, HelpCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { CommentatorsSummary, TopCommentator, RenewalData, CommentersFiltersState } from '@/types/intelligence';

export const CommentersAnalysis: React.FC = () => {
  const [filters, setFilters] = useState<CommentersFiltersState>({
    perfilComentado: null,
    classificacao: null,
    plataforma: null,
  });

  // Summary data
  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ['commenters-summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fpobserva_vw_comentaristas_resumo')
        .select('*')
        .single();
      if (error) throw error;
      return data as CommentatorsSummary;
    },
  });

  // Top commenters
  const { data: topCommenters, isLoading: loadingTop } = useQuery({
    queryKey: ['top-commenters', filters],
    queryFn: async () => {
      let query = supabase
        .from('fpobserva_vw_top_comentaristas')
        .select('*')
        .order('total_comentarios', { ascending: false })
        .limit(50);

      if (filters.classificacao) {
        query = query.eq('classificacao', filters.classificacao);
      }
      if (filters.plataforma) {
        query = query.eq('plataforma', filters.plataforma);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as TopCommentator[];
    },
  });

  // Renewal data
  const { data: renewalData, isLoading: loadingRenewal } = useQuery({
    queryKey: ['renewal-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fpobserva_vw_renovacao_comentaristas')
        .select('*')
        .order('semana', { ascending: true });
      if (error) throw error;
      return data as RenewalData[];
    },
  });

  // Chart data - pivot by profile
  const chartData = useMemo(() => {
    if (!renewalData) return [];
    const grouped = renewalData.reduce((acc, r) => {
      if (!r.semana) return acc;
      if (!acc[r.semana]) {
        acc[r.semana] = { semana: r.semana };
      }
      if (r.perfil) {
        acc[r.semana][r.perfil] = r.taxa_renovacao_pct || 0;
      }
      return acc;
    }, {} as Record<string, Record<string, number | string>>);
    return Object.values(grouped);
  }, [renewalData]);

  // Get unique profiles from renewal data for chart
  const profilesInChart = useMemo(() => {
    if (!renewalData) return [];
    return [...new Set(renewalData.filter(r => r.perfil).map(r => r.perfil!))];
  }, [renewalData]);

  // Filter the topCommenters based on perfilComentado
  const filteredCommenters = useMemo(() => {
    if (!topCommenters) return [];
    if (!filters.perfilComentado) return topCommenters;
    return topCommenters.filter(c => 
      c.perfis_comentados?.includes(filters.perfilComentado!)
    );
  }, [topCommenters, filters.perfilComentado]);

  const getClassificationBadge = (classificacao: string | null) => {
    switch (classificacao?.toLowerCase()) {
      case 'aliado':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Aliado</Badge>;
      case 'adversario':
      case 'adversário':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Adversário</Badge>;
      case 'neutro':
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Neutro</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground">Indefinido</Badge>;
    }
  };

  const isLoading = loadingSummary || loadingTop || loadingRenewal;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{summary?.total_comentaristas || 0}</p>
              </div>
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Novos</p>
                <p className="text-2xl font-bold text-green-400">{summary?.novos_ultima_semana || 0}</p>
              </div>
              <UserPlus className="h-6 w-6 text-green-400/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/10 border-secondary/30">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Fiéis</p>
                <p className="text-2xl font-bold text-secondary">{summary?.comentaristas_fieis || 0}</p>
              </div>
              <Heart className="h-6 w-6 text-secondary/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Aliados</p>
                <p className="text-2xl font-bold text-blue-400">{summary?.aliados || 0}</p>
              </div>
              <Shield className="h-6 w-6 text-blue-400/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Adversários</p>
                <p className="text-2xl font-bold text-red-400">{summary?.adversarios || 0}</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-400/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bubble Indicator */}
      {summary && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
              Indicador de "Bolha"
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <p className="text-3xl font-bold text-foreground">
                  {summary.total_comentaristas && summary.comentam_multiplos_perfis
                    ? ((summary.comentam_multiplos_perfis / summary.total_comentaristas) * 100).toFixed(1)
                    : 0}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">Comentam múltiplos perfis</p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <p className="text-3xl font-bold text-foreground">
                  {summary.comentam_multiplos_perfis || 0}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Cruzam candidatos</p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <p className="text-3xl font-bold text-foreground">
                  {summary.total_comentaristas && summary.comentam_multiplos_perfis
                    ? summary.total_comentaristas - summary.comentam_multiplos_perfis
                    : 0}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Exclusivos de um perfil</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Renewal Chart */}
      {chartData.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Taxa de Renovação por Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="semana"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Taxa Renovação']}
                  />
                  <Legend />
                  {profilesInChart.slice(0, 5).map((profile, i) => (
                    <Line
                      key={profile}
                      type="monotone"
                      dataKey={profile}
                      name={profile}
                      stroke={['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6'][i % 5]}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select
          value={filters.classificacao || 'todos'}
          onValueChange={(value) =>
            setFilters((f) => ({ ...f, classificacao: value === 'todos' ? null : value }))
          }
        >
          <SelectTrigger className="w-[180px] bg-card border-border">
            <SelectValue placeholder="Classificação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas</SelectItem>
            <SelectItem value="aliado">Aliado</SelectItem>
            <SelectItem value="adversario">Adversário</SelectItem>
            <SelectItem value="neutro">Neutro</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.plataforma || 'todos'}
          onValueChange={(value) =>
            setFilters((f) => ({ ...f, plataforma: value === 'todos' ? null : value }))
          }
        >
          <SelectTrigger className="w-[150px] bg-card border-border">
            <SelectValue placeholder="Plataforma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Top Commenters Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Top Comentaristas ({filteredCommenters.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCommenters.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum comentarista encontrado com os filtros selecionados</p>
            </div>
          ) : (
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead>Nome</TableHead>
                    <TableHead>Plataforma</TableHead>
                    <TableHead className="text-right">Comentários</TableHead>
                    <TableHead>Primeira Aparição</TableHead>
                    <TableHead>Última Aparição</TableHead>
                    <TableHead className="text-right">Dias Ativo</TableHead>
                    <TableHead>Classificação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCommenters.map((commenter, i) => (
                    <TableRow key={i} className="hover:bg-muted/20">
                      <TableCell className="font-medium">{commenter.nome_perfil}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            commenter.plataforma === 'facebook'
                              ? 'border-blue-500/50 text-blue-400'
                              : 'border-pink-500/50 text-pink-400'
                          }
                        >
                          {commenter.plataforma}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {commenter.total_comentarios?.toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {commenter.primeira_aparicao &&
                          format(parseISO(commenter.primeira_aparicao), 'dd/MM/yy', { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {commenter.ultima_aparicao &&
                          format(parseISO(commenter.ultima_aparicao), 'dd/MM/yy', { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-right">{commenter.dias_ativo}</TableCell>
                      <TableCell>{getClassificationBadge(commenter.classificacao)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
