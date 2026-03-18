import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Coleta } from '@/types/profiles';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProfileGrowthChartProps {
  data: Coleta[];
  profileColor: string;
  loading: boolean;
}

export const ProfileGrowthChart: React.FC<ProfileGrowthChartProps> = ({
  data,
  profileColor,
  loading,
}) => {
  if (loading) {
    return <Skeleton className="h-[250px] w-full" />;
  }

  if (data.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-muted-foreground">
        Sem dados de coleta disponíveis
      </div>
    );
  }

  const chartData = data
    .slice()
    .reverse()
    .map((coleta) => ({
      data: format(parseISO(coleta.data_coleta), 'dd/MM', { locale: ptBR }),
      seguidores:
        typeof coleta.seguidores === 'number' && coleta.seguidores > 0
          ? coleta.seguidores
          : null,
    }));

  const firstIndex = chartData.findIndex(
    (point) => typeof point.seguidores === 'number' && point.seguidores > 0
  );
  const lastIndex = chartData.reduce((last, point, index) => {
    const hasData = typeof point.seguidores === 'number' && point.seguidores > 0;
    return hasData ? index : last;
  }, -1);

  const trimmedChartData =
    firstIndex >= 0 && lastIndex >= firstIndex
      ? chartData.slice(firstIndex, lastIndex + 1)
      : [];

  if (trimmedChartData.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-muted-foreground">
        Sem dados válidos de seguidores no período
      </div>
    );
  }

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trimmedChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="data"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <YAxis
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickFormatter={(value) => value.toLocaleString('pt-BR')}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))',
            }}
            labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
            formatter={(value: number) => [value.toLocaleString('pt-BR'), 'Seguidores']}
          />
          <Line
            type="monotone"
            dataKey="seguidores"
            stroke={profileColor}
            strokeWidth={2}
            dot={{ fill: profileColor, strokeWidth: 2 }}
            activeDot={{ r: 6, fill: profileColor }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
