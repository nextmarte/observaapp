import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Activity } from 'lucide-react';

interface WeeklyEngagement {
  semana_ano: string;
  engajamento: number;
}

interface ComparisonEngagementChartProps {
  dataA: WeeklyEngagement[];
  dataB: WeeklyEngagement[];
  profileAName: string;
  profileBName: string;
  colorA: string;
  colorB: string;
  loading?: boolean;
}

export const ComparisonEngagementChart: React.FC<ComparisonEngagementChartProps> = ({
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

  const chartData = Array.from(allWeeks)
    .sort()
    .slice(-10) // Last 10 weeks
    .map(semana => {
      const engA = dataA.find(d => d.semana_ano === semana);
      const engB = dataB.find(d => d.semana_ano === semana);
      return {
        semana,
        [profileAName]: engA?.engajamento ?? 0,
        [profileBName]: engB?.engajamento ?? 0,
      };
    });

  const formatNumber = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Activity className="h-5 w-5 text-secondary" />
          Engajamento Semanal Comparativo
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Sem dados disponíveis para comparação
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
              <Bar dataKey={profileAName} fill={colorA} radius={[4, 4, 0, 0]} />
              <Bar dataKey={profileBName} fill={colorB} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
