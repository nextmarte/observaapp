import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from './EmptyState';
import { TrendingUp } from 'lucide-react';
import type { HistoricalEngagement } from '@/types/dashboard';

interface HistoricalChartProps {
  data: HistoricalEngagement[];
  loading?: boolean;
}

export const HistoricalChart: React.FC<HistoricalChartProps> = ({
  data,
  loading = false,
}) => {
  const compactProfileName = (name: string) => {
    const [profileName, platform] = name.split(' -').map((part) => part.trim());
    if (!platform) return name;
    const platformShort = platform.toLowerCase().includes('instagram') ? 'IG' : 'FB';
    return `${profileName} (${platformShort})`;
  };

  const formatWeek = (weekLabel: string) => {
    const match = weekLabel.match(/^(\d{4})-W(\d{2})$/);
    if (!match) return weekLabel;
    return `W${match[2]}/${match[1].slice(-2)}`;
  };

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <Skeleton className="h-5 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Transform data: pivot by week with one column per profile
  const { chartData, profiles } = useMemo(() => {
    const profilesMap = new Map<string, { nome: string; cor: string }>();
    const weeksMap = new Map<string, Record<string, number | string | null>>();

    data.forEach((item) => {
      if (!item.perfil_id || !item.semana_ano) return;

      // Track profiles
      if (!profilesMap.has(item.perfil_id)) {
        profilesMap.set(item.perfil_id, {
          nome: item.nome || 'Desconhecido',
          cor: item.cor_grafico || '#C4A000',
        });
      }

      // Group by week
      if (!weeksMap.has(item.semana_ano)) {
        weeksMap.set(item.semana_ano, { semana: item.semana_ano });
      }

      const weekData = weeksMap.get(item.semana_ano)!;
      const value = item.engajamento_acumulado ?? null;
      weekData[item.perfil_id] = typeof value === 'number' && value <= 0 ? null : value;
    });

    // Sort weeks chronologically
    const sortedWeeks = Array.from(weeksMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, data]) => data);

    const sortedProfiles = Array.from(profilesMap.entries()).map(([id, info]) => ({
      id,
      ...info,
    }));

    const latestWeekData = sortedWeeks[sortedWeeks.length - 1] || {};
    const visibleProfiles = sortedProfiles
      .sort((a, b) => Number(latestWeekData[b.id] || 0) - Number(latestWeekData[a.id] || 0))
      .slice(0, 5);

    const firstWeekWithData = sortedWeeks.findIndex((week) =>
      visibleProfiles.some((profile) => {
        const value = week[profile.id];
        return typeof value === 'number' && !Number.isNaN(value) && value > 0;
      })
    );

    const lastWeekWithData = sortedWeeks.reduce((lastIndex, week, index) => {
      const hasData = visibleProfiles.some((profile) => {
        const value = week[profile.id];
        return typeof value === 'number' && !Number.isNaN(value) && value > 0;
      });
      return hasData ? index : lastIndex;
    }, -1);

    const hasValidRange = firstWeekWithData >= 0 && lastWeekWithData >= firstWeekWithData;
    const trimmedWeeks = hasValidRange
      ? sortedWeeks.slice(firstWeekWithData, lastWeekWithData + 1)
      : sortedWeeks;

    return {
      chartData: trimmedWeeks,
      profiles: visibleProfiles,
    };
  }, [data]);

  if (chartData.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground">
            Engajamento Acumulado Histórico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState icon={TrendingUp} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-foreground">
          Engajamento Acumulado Histórico
        </CardTitle>
        <p className="text-xs text-muted-foreground">Top 5 perfis por acumulado atual</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 20, left: 10, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="semana"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickFormatter={formatWeek}
              minTickGap={18}
              tickLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickFormatter={(value) =>
                value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
              }}
              labelFormatter={(label) => `Semana ${formatWeek(String(label))}`}
              formatter={(value: number) => [value.toLocaleString('pt-BR'), 'Engajamento']}
            />
            <Legend
              iconType="line"
              wrapperStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value) => {
                const profile = profiles.find((p) => p.id === value);
                return compactProfileName(profile?.nome || String(value));
              }}
            />
            {profiles.map((profile) => (
              <Line
                key={profile.id}
                type="monotone"
                dataKey={profile.id}
                name={profile.id}
                stroke={profile.cor}
                strokeWidth={2.2}
                dot={false}
                activeDot={{ r: 4, fill: profile.cor }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
