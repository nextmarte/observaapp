import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, UserPlus, TrendingUp, Heart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfileSummary } from '@/types/profiles';

interface ProfileSummaryCardsProps {
  summary: ProfileSummary | null;
  loading: boolean;
}

export const ProfileSummaryCards: React.FC<ProfileSummaryCardsProps> = ({
  summary,
  loading,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Perfis Ativos',
      value: summary?.totalPerfisAtivos ?? 0,
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: 'Total de Seguidores',
      value: summary?.totalSeguidores?.toLocaleString('pt-BR') ?? '0',
      icon: UserPlus,
      color: 'text-green-500',
    },
    {
      title: 'Maior Crescimento',
      value: summary?.maiorCrescimento?.nome ?? '-',
      subtitle: summary?.maiorCrescimento
        ? `+${summary.maiorCrescimento.variacao.toLocaleString('pt-BR')} seguidores`
        : undefined,
      icon: TrendingUp,
      color: 'text-secondary',
    },
    {
      title: 'Maior Engajamento',
      value: summary?.maiorEngajamento?.nome ?? '-',
      subtitle: summary?.maiorEngajamento
        ? `${summary.maiorEngajamento.engajamento.toLocaleString('pt-BR')} interações`
        : undefined,
      icon: Heart,
      color: 'text-pink-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-xl font-bold text-foreground mt-1 truncate">
                  {card.value}
                </p>
                {card.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {card.subtitle}
                  </p>
                )}
              </div>
              <card.icon className={`h-8 w-8 ${card.color} opacity-80`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
