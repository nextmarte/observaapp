import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { format, parseISO, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { WhatsAppMensagem } from '@/types/whatsapp';

interface WhatsAppTrendChartProps {
  mensagens: WhatsAppMensagem[];
  loading?: boolean;
}

const CATEGORIA_COLORS: Record<string, string> = {
  demanda:    '#f97316',
  elogio:     '#22c55e',
  duvida:     '#3b82f6',
  critica:    '#ef4444',
  informacao: '#8b5cf6',
};

const CATEGORIA_LABELS: Record<string, string> = {
  demanda:    'Demanda',
  elogio:     'Elogio',
  duvida:     'Dúvida',
  critica:    'Crítica',
  informacao: 'Informação',
};

export const WhatsAppTrendChart: React.FC<WhatsAppTrendChartProps> = ({ mensagens, loading }) => {
  const { chartData, categorias } = useMemo(() => {
    const weeksMap = new Map<string, Record<string, number>>();
    const categoriasSet = new Set<string>();

    mensagens.forEach((m) => {
      const weekStart = startOfWeek(parseISO(m.data_recebimento), { weekStartsOn: 1 });
      const weekKey = format(weekStart, 'yyyy-MM-dd');
      categoriasSet.add(m.categoria);

      if (!weeksMap.has(weekKey)) {
        weeksMap.set(weekKey, { semana: weekKey as unknown as number });
      }
      const week = weeksMap.get(weekKey)!;
      week[m.categoria] = (week[m.categoria] || 0) + 1;
    });

    const sorted = Array.from(weeksMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, data]) => data);

    return { chartData: sorted, categorias: Array.from(categoriasSet) };
  }, [mensagens]);

  const formatWeek = (dateStr: string) =>
    format(parseISO(dateStr), "'Sem' dd/MM", { locale: ptBR });

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
          Mensagens por Semana
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="semana"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickFormatter={formatWeek}
              tickLine={false}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
              }}
              labelFormatter={(label) => formatWeek(String(label))}
            />
            <Legend
              iconType="line"
              wrapperStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value) => CATEGORIA_LABELS[value] || value}
            />
            {categorias.map((cat) => (
              <Line
                key={cat}
                type="monotone"
                dataKey={cat}
                name={cat}
                stroke={CATEGORIA_COLORS[cat] || '#888'}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
