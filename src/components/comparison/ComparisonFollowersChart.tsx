import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface Coleta {
  data_coleta: string;
  semana_ano: string;
  seguidores: number | null;
}

interface ComparisonFollowersChartProps {
  dataA: Coleta[];
  dataB: Coleta[];
  profileAName: string;
  profileBName: string;
  colorA: string;
  colorB: string;
  loading?: boolean;
}

export const ComparisonFollowersChart: React.FC<ComparisonFollowersChartProps> = ({
  dataA,
  dataB,
  profileAName,
  profileBName,
  colorA,
  colorB,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <Skeleton className="h-6 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  // Merge data by semana_ano
  const allWeeks = new Set([
    ...dataA.map(d => d.semana_ano),
    ...dataB.map(d => d.semana_ano),
  ]);

  const rawChartData = Array.from(allWeeks)
    .sort()
    .map(semana => {
      const coletaA = dataA.find(d => d.semana_ano === semana);
      const coletaB = dataB.find(d => d.semana_ano === semana);
      return {
        semana,
        [profileAName]:
          typeof coletaA?.seguidores === 'number' && coletaA.seguidores > 0
            ? coletaA.seguidores
            : null,
        [profileBName]:
          typeof coletaB?.seguidores === 'number' && coletaB.seguidores > 0
            ? coletaB.seguidores
            : null,
      };
    });

  const firstWeekWithData = rawChartData.findIndex((week) => {
    const valueA = week[profileAName as keyof typeof week];
    const valueB = week[profileBName as keyof typeof week];
    return (
      (typeof valueA === 'number' && valueA > 0) ||
      (typeof valueB === 'number' && valueB > 0)
    );
  });

  const lastWeekWithData = rawChartData.reduce((lastIndex, week, index) => {
    const valueA = week[profileAName as keyof typeof week];
    const valueB = week[profileBName as keyof typeof week];
    const hasValidData =
      (typeof valueA === 'number' && valueA > 0) ||
      (typeof valueB === 'number' && valueB > 0);
    return hasValidData ? index : lastIndex;
  }, -1);

  const chartData =
    firstWeekWithData >= 0 && lastWeekWithData >= firstWeekWithData
      ? rawChartData.slice(firstWeekWithData, lastWeekWithData + 1)
      : [];

  const formatNumber = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <TrendingUp className="h-5 w-5 text-secondary" />
          Evolução Comparativa de Seguidores
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Sem dados disponíveis para comparação
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis 
                dataKey="semana" 
                stroke="#6b7280"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <YAxis 
                stroke="#6b7280"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickFormatter={formatNumber}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1f26',
                  border: '1px solid #2d3748',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#f3f4f6' }}
                formatter={(value: number) => [formatNumber(value), '']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={profileAName}
                stroke={colorA}
                strokeWidth={2}
                dot={{ fill: colorA, strokeWidth: 2 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey={profileBName}
                stroke={colorB}
                strokeWidth={2}
                dot={{ fill: colorB, strokeWidth: 2 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
