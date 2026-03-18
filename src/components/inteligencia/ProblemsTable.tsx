import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, AlertCircle, FileWarning, Lightbulb, ClipboardList } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { IntelligenceItem, ProblemsFiltersState } from '@/types/intelligence';

export const ProblemsTable: React.FC = () => {
  const [filters, setFilters] = useState<ProblemsFiltersState>({
    categoriaEstrategica: null,
    relevancia: null,
    tipoInformacao: null,
    perfil: null,
  });
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const { data: items, isLoading } = useQuery({
    queryKey: ['problems-demands', filters],
    queryFn: async () => {
      let query = supabase
        .from('fpobserva_vw_inteligencia_campanha')
        .select('*')
        .order('data_publicacao', { ascending: false });

      if (filters.categoriaEstrategica) {
        query = query.eq('categoria_estrategica', filters.categoriaEstrategica);
      }
      if (filters.relevancia) {
        query = query.eq('relevancia_campanha', filters.relevancia);
      }
      if (filters.tipoInformacao) {
        query = query.eq('tipo_informacao', filters.tipoInformacao);
      }
      if (filters.perfil) {
        query = query.eq('perfil', filters.perfil);
      }

      const { data, error } = await query.limit(100);
      if (error) throw error;
      return data as IntelligenceItem[];
    },
  });

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
  });

  // Get unique categories and types from data
  const { categories, types } = useMemo(() => {
    if (!items) return { categories: [], types: [] };
    const cats = [...new Set(items.filter(i => i.categoria_estrategica).map(i => i.categoria_estrategica!))];
    const typs = [...new Set(items.filter(i => i.tipo_informacao).map(i => i.tipo_informacao!))];
    return { categories: cats, types: typs };
  }, [items]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getRelevanceBadge = (relevancia: string | null) => {
    switch (relevancia) {
      case 'alta':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Alta</Badge>;
      case 'media':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Média</Badge>;
      case 'baixa':
        return <Badge className="bg-muted/20 text-muted-foreground border-muted/30">Baixa</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const getTypeIcon = (tipo: string | null) => {
    switch (tipo?.toLowerCase()) {
      case 'problema':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'demanda':
        return <ClipboardList className="h-4 w-4 text-amber-400" />;
      case 'oportunidade':
        return <Lightbulb className="h-4 w-4 text-green-400" />;
      default:
        return <FileWarning className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSuggestedAction = (item: IntelligenceItem) => {
    if (item.tipo_informacao === 'problema') {
      return 'Preparar resposta ou posicionamento';
    }
    if (item.tipo_informacao === 'demanda') {
      return 'Incluir na pauta de compromissos';
    }
    if (item.tipo_informacao === 'oportunidade') {
      return 'Desenvolver conteúdo relacionado';
    }
    return 'Analisar e monitorar';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-40" />
          ))}
        </div>
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select
          value={filters.categoriaEstrategica || 'todos'}
          onValueChange={(value) =>
            setFilters((f) => ({ ...f, categoriaEstrategica: value === 'todos' ? null : value }))
          }
        >
          <SelectTrigger className="w-[200px] bg-card border-border">
            <SelectValue placeholder="Categoria Estratégica" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas as Categorias</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.relevancia || 'todos'}
          onValueChange={(value) =>
            setFilters((f) => ({ ...f, relevancia: value === 'todos' ? null : value }))
          }
        >
          <SelectTrigger className="w-[150px] bg-card border-border">
            <SelectValue placeholder="Relevância" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="baixa">Baixa</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.tipoInformacao || 'todos'}
          onValueChange={(value) =>
            setFilters((f) => ({ ...f, tipoInformacao: value === 'todos' ? null : value }))
          }
        >
          <SelectTrigger className="w-[180px] bg-card border-border">
            <SelectValue placeholder="Tipo de Informação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Tipos</SelectItem>
            {types.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.perfil || 'todos'}
          onValueChange={(value) =>
            setFilters((f) => ({ ...f, perfil: value === 'todos' ? null : value }))
          }
        >
          <SelectTrigger className="w-[200px] bg-card border-border">
            <SelectValue placeholder="Perfil" />
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
      </div>

      {/* Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">
            Problemas e Demandas Identificados ({items?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!items || items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileWarning className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum problema ou demanda identificado com os filtros selecionados</p>
            </div>
          ) : (
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="w-10"></TableHead>
                    <TableHead className="w-24">Data</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Subcategoria</TableHead>
                    <TableHead className="w-20">Tipo</TableHead>
                    <TableHead className="w-24">Relevância</TableHead>
                    <TableHead>Ação Sugerida</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <Collapsible key={item.id} asChild open={expandedRows.has(item.id || '')}>
                      <>
                        <CollapsibleTrigger asChild>
                          <TableRow
                            className="cursor-pointer hover:bg-muted/20"
                            onClick={() => item.id && toggleRow(item.id)}
                          >
                            <TableCell>
                              {expandedRows.has(item.id || '') ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </TableCell>
                            <TableCell className="text-sm">
                              {item.data_publicacao && format(parseISO(item.data_publicacao), 'dd/MM/yy', { locale: ptBR })}
                            </TableCell>
                            <TableCell className="font-medium">{item.perfil || '-'}</TableCell>
                            <TableCell>{item.categoria_estrategica || '-'}</TableCell>
                            <TableCell>{item.subcategoria || '-'}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {getTypeIcon(item.tipo_informacao)}
                              </div>
                            </TableCell>
                            <TableCell>{getRelevanceBadge(item.relevancia_campanha)}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {getSuggestedAction(item)}
                            </TableCell>
                          </TableRow>
                        </CollapsibleTrigger>
                        <CollapsibleContent asChild>
                          <TableRow className="bg-muted/10 hover:bg-muted/10">
                            <TableCell colSpan={8} className="p-4">
                              <div className="space-y-3">
                                <div>
                                  <p className="text-sm font-medium text-foreground mb-1">Conteúdo:</p>
                                  <p className="text-sm text-muted-foreground">
                                    {item.conteudo_texto || 'Sem conteúdo disponível'}
                                  </p>
                                </div>
                                {item.notas_campanha && (
                                  <div>
                                    <p className="text-sm font-medium text-foreground mb-1">Notas de Campanha:</p>
                                    <p className="text-sm text-secondary">{item.notas_campanha}</p>
                                  </div>
                                )}
                                {item.mencoes && item.mencoes.length > 0 && (
                                  <div>
                                    <p className="text-sm font-medium text-foreground mb-1">Menções:</p>
                                    <div className="flex gap-1 flex-wrap">
                                      {item.mencoes.map((m, i) => (
                                        <Badge key={i} variant="outline" className="text-xs">
                                          {m}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span>Engajamento: {item.engajamento?.toLocaleString('pt-BR') || 0}</span>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        </CollapsibleContent>
                      </>
                    </Collapsible>
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
