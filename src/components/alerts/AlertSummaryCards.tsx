import { Card, CardContent } from '@/components/ui/card';
import { Bell, BellRing, BellDot } from 'lucide-react';
import { AlertSummary } from '@/types/alerts';

interface AlertSummaryCardsProps {
  summary: AlertSummary;
  loading?: boolean;
}

export const AlertSummaryCards = ({ summary, loading }: AlertSummaryCardsProps) => {
  const cards = [
    {
      title: 'Alertas Ativos',
      value: summary.alertasAtivos,
      icon: Bell,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Disparados (7 dias)',
      value: summary.alertasDisparados,
      icon: BellRing,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'Não Visualizados',
      value: summary.naoVisualizados,
      icon: BellDot,
      color: summary.naoVisualizados > 0 ? 'text-[#C4A000]' : 'text-muted-foreground',
      bgColor: summary.naoVisualizados > 0 ? 'bg-[#C4A000]/10' : 'bg-muted/10',
      highlight: summary.naoVisualizados > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card 
          key={card.title} 
          className={`bg-card border-border ${card.highlight ? 'border-[#C4A000]/50' : ''}`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className={`text-3xl font-bold mt-1 ${card.highlight ? 'text-[#C4A000]' : 'text-foreground'}`}>
                  {loading ? '-' : summary ? card.value.toLocaleString('pt-BR') : '0'}
                </p>
              </div>
              <div className={`p-3 rounded-full ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.color} ${card.highlight ? 'animate-bounce' : ''}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
