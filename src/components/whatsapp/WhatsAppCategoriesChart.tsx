import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { WhatsAppMensagem } from '@/types/whatsapp';

interface WhatsAppCategoriesChartProps {
  mensagens: WhatsAppMensagem[];
  loading?: boolean;
}

const CATEGORIA_CONFIG: Record<string, { label: string; color: string }> = {
  demanda:    { label: 'Demanda',    color: '#f97316' },
  elogio:     { label: 'Elogio',     color: '#22c55e' },
  duvida:     { label: 'Dúvida',     color: '#3b82f6' },
  critica:    { label: 'Crítica',    color: '#ef4444' },
  informacao: { label: 'Informação', color: '#8b5cf6' },
};

export const WhatsAppCategoriesChart: React.FC<WhatsAppCategoriesChartProps> = ({ mensagens, loading }) => {
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    mensagens.forEach((m) => {
      counts[m.categoria] = (counts[m.categoria] || 0) + 1;
    });
    return Object.entries(CATEGORIA_CONFIG).map(([key, cfg]) => ({
      categoria: cfg.label,
      total: counts[key] || 0,
      color: cfg.color,
    })).sort((a, b) => b.total - a.total);
  }, [mensagens]);

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader><Skeleton className="h-5 w-48" /></CardHeader>
        <CardContent><Skeleton className="h-64 w-full" /></CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-foreground">
          Distribuição por Categoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 8, right: 24, left: 16, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="categoria"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              width={80}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
              }}
              formatter={(value: number) => [value, 'Mensagens']}
            />
            <Bar dataKey="total" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
