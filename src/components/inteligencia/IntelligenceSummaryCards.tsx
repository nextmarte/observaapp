import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AtSign, AlertTriangle, ClipboardList, UserPlus, Bell } from 'lucide-react';
import type { IntelligenceSummary } from '@/types/intelligence';

interface IntelligenceSummaryCardsProps {
  data: IntelligenceSummary;
  isLoading?: boolean;
}

export const IntelligenceSummaryCards: React.FC<IntelligenceSummaryCardsProps> = ({
  data,
  isLoading = false,
}) => {
  const cards = [
    {
      title: 'Menções à Reitoria',
      value: data.mencoesReitoria,
      subtitle: 'Últimos 7 dias',
      icon: AtSign,
      iconClass: 'text-blue-400',
      bgClass: 'bg-blue-500/10',
    },
    {
      title: 'Problemas Identificados',
      value: data.problemasIdentificados,
      subtitle: 'Relevância alta/média',
      icon: AlertTriangle,
      iconClass: 'text-red-400',
      bgClass: 'bg-red-500/10',
    },
    {
      title: 'Demandas Pendentes',
      value: data.demandasPendentes,
      subtitle: 'Aguardando ação',
      icon: ClipboardList,
      iconClass: 'text-amber-400',
      bgClass: 'bg-amber-500/10',
    },
    {
      title: 'Novos Comentaristas',
      value: data.novosComentaristas,
      subtitle: 'Última semana',
      icon: UserPlus,
      iconClass: 'text-green-400',
      bgClass: 'bg-green-500/10',
    },
    {
      title: 'Alertas Ativos',
      value: data.alertasAtivos,
      subtitle: 'Configurados',
      icon: Bell,
      iconClass: 'text-secondary',
      bgClass: 'bg-secondary/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgClass}`}>
              <card.icon className={`h-4 w-4 ${card.iconClass}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {isLoading ? '...' : card.value.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
