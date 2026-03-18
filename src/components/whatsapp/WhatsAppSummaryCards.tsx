import React from 'react';
import { MessageCircle, Inbox, CheckCheck, UserPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { WhatsAppResumo } from '@/types/whatsapp';

interface WhatsAppSummaryCardsProps {
  resumo?: WhatsAppResumo | null;
  loading?: boolean;
}

export const WhatsAppSummaryCards: React.FC<WhatsAppSummaryCardsProps> = ({ resumo, loading }) => {
  const cards = [
    {
      title: 'Total de Mensagens',
      value: resumo?.total_mensagens ?? 0,
      icon: MessageCircle,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
    {
      title: 'Mensagens Novas',
      value: resumo?.novas ?? 0,
      icon: Inbox,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
    },
    {
      title: 'Taxa de Resposta',
      value: `${resumo?.taxa_resposta_pct ?? 0}%`,
      icon: CheckCheck,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      title: 'Novos Remetentes',
      value: resumo?.novos_remetentes ?? 0,
      icon: UserPlus,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="p-5">
              <Skeleton className="h-4 w-32 mb-3" />
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="bg-card border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{card.title}</span>
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
