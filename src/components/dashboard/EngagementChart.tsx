import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from './EmptyState';
import { BarChart3 } from 'lucide-react';
import type { WeeklySummary } from '@/types/dashboard';

interface EngagementChartProps {
  data: WeeklySummary[];
  loading?: boolean;
}

export const EngagementChart: React.FC<EngagementChartProps> = ({
  data,
  loading = false,
}) => {
  const compactProfileName = (name: string) => {
    const [profileName, platform] = name.split(' -').map((part) => part.trim());
    if (!platform) return name;

    const platformShort = platform.toLowerCase().includes('instagram') ? 'IG' : 'FB';
    return `${profileName} (${platformShort})`;
  };

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Use latest collection date only and keep ranking clear (top 8 + "outros")
  const chartData = useMemo(() => {
    if (!data.length) return [];

    const latestDate = data
      .map((item) => item.data_coleta)
      .filter((value): value is string => Boolean(value))
      .sort((a, b) => b.localeCompare(a))[0];

    const latestSnapshot = data
      .filter((item) => item.data_coleta === latestDate && item.perfil_id && item.nome)
      .map((item) => ({
        perfil_id: item.perfil_id as string,
        nome: item.nome as string,
        engajamento: item.engajamento_semana || 0,
        cor: item.cor_grafico || '#C4A000',
      }))
      .sort((a, b) => b.engajamento - a.engajamento);

    if (latestSnapshot.length <= 8) return latestSnapshot;

    const topProfiles = latestSnapshot.slice(0, 8);
    const othersEngagement = latestSnapshot
      .slice(8)
      .reduce((acc, item) => acc + item.engajamento, 0);

    if (othersEngagement === 0) return topProfiles;

    return [
      ...topProfiles,
      {
        perfil_id: 'others',
        nome: 'Outros perfis',
        engajamento: othersEngagement,
        cor: 'hsl(var(--muted-foreground))',
      },
    ];
  }, [data]);

  if (chartData.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground">
            Engajamento por Perfil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState icon={BarChart3} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-foreground">
          Engajamento por Perfil
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 8, right: 18, left: 28, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickFormatter={(value) =>
                value >= 1000 ? `${(value / 1000).toFixed(0)}k` : String(value)
              }
            />
            <YAxis
              type="category"
              dataKey="nome"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              width={150}
              tickFormatter={(value: string) => compactProfileName(value)}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
              }}
              labelFormatter={(label) => compactProfileName(String(label))}
              formatter={(value: number) => [value.toLocaleString('pt-BR'), 'Engajamento']}
            />
            <Bar dataKey="engajamento" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.cor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
