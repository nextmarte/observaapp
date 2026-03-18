import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { PieChartIcon } from 'lucide-react';
import { PostTypeDistribution } from '@/types/comparison';

interface ComparisonPostTypesChartProps {
  dataA: PostTypeDistribution[];
  dataB: PostTypeDistribution[];
  profileAName: string;
  profileBName: string;
  colorA: string;
  colorB: string;
  loading?: boolean;
}

const TYPE_COLORS = [
  '#C4A000',
  '#00285F',
  '#22c55e',
  '#E4405F',
  '#1877F2',
  '#6b7280',
  '#8b5cf6',
  '#f59e0b',
];

export const ComparisonPostTypesChart: React.FC<ComparisonPostTypesChartProps> = ({
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-[250px] w-full" />
            <Skeleton className="h-[250px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderPieChart = (
    data: PostTypeDistribution[], 
    name: string, 
    borderColor: string
  ) => (
    <div 
      className="p-4 rounded-lg border-t-4"
      style={{ borderColor }}
    >
      <h4 className="text-sm font-medium text-center text-foreground mb-4">{name}</h4>
      {data.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
          Sem posts
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              dataKey="count"
              nameKey="tipo"
              label={({ tipo, percentage }) => `${tipo} (${percentage.toFixed(0)}%)`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={TYPE_COLORS[index % TYPE_COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1f26',
                border: '1px solid #2d3748',
                borderRadius: '8px',
              }}
              formatter={(value: number, name: string) => [
                `${value} posts`,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <PieChartIcon className="h-5 w-5 text-secondary" />
          Distribuição de Tipos de Post
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderPieChart(dataA, profileAName, colorA)}
          {renderPieChart(dataB, profileBName, colorB)}
        </div>
      </CardContent>
    </Card>
  );
};
