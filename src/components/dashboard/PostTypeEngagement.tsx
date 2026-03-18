import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import type { EngagementByType } from '@/types/dashboard';

const TYPE_COLORS: Record<string, string> = {
  imagem: '#3b82f6',
  image: '#3b82f6',
  photo: '#3b82f6',
  video: '#8b5cf6',
  reels: '#ec4899',
  reel: '#ec4899',
  link: '#22c55e',
  text: '#6b7280',
  texto: '#6b7280',
  carousel: '#f59e0b',
  carrossel: '#f59e0b',
};

export const PostTypeEngagement: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<string>('todos');

  const { data: engagementData, isLoading } = useQuery({
    queryKey: ['engagement-by-type'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fpobserva_vw_engajamento_por_tipo')
        .select('*');
      if (error) throw error;
      return data as EngagementByType[];
    },
  });

  // Get unique profiles for filter
  const profiles = React.useMemo(() => {
    if (!engagementData) return [];
    return [...new Set(engagementData.map(d => d.perfil).filter(Boolean))];
  }, [engagementData]);

  // Filter and aggregate data
  const chartData = React.useMemo(() => {
    if (!engagementData) return [];

    let filtered = engagementData;
    if (selectedProfile !== 'todos') {
      filtered = engagementData.filter(d => d.perfil === selectedProfile);
    }

    // Aggregate by type
    const byType = filtered.reduce((acc, curr) => {
      const tipo = curr.tipo?.toLowerCase() || 'outro';
      if (!acc[tipo]) {
        acc[tipo] = { tipo, total_posts: 0, engajamento_total: 0 };
      }
      acc[tipo].total_posts += curr.total_posts || 0;
      acc[tipo].engajamento_total += curr.engajamento_total || 0;
      return acc;
    }, {} as Record<string, { tipo: string; total_posts: number; engajamento_total: number }>);

    return Object.values(byType)
      .map(item => ({
        ...item,
        engajamento_medio: item.total_posts > 0 
          ? Math.round(item.engajamento_total / item.total_posts)
          : 0,
        nome: item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1),
      }))
      .sort((a, b) => b.engajamento_medio - a.engajamento_medio);
  }, [engagementData, selectedProfile]);

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-9 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Engajamento por Tipo de Post
          </CardTitle>
          <Select value={selectedProfile} onValueChange={setSelectedProfile}>
            <SelectTrigger className="w-36 bg-background">
              <SelectValue placeholder="Filtrar perfil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {profiles.map((profile) => (
                <SelectItem key={profile} value={profile || ''}>
                  {profile}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Nenhum dado disponível
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
              <XAxis type="number" tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
              <YAxis 
                type="category" 
                dataKey="nome" 
                width={80}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) => [
                  value.toLocaleString('pt-BR'),
                  name === 'engajamento_medio' ? 'Média' : 'Total'
                ]}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar dataKey="engajamento_medio" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={TYPE_COLORS[entry.tipo] || '#6b7280'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
