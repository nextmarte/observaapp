import React from 'react';
import { FileText, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Post } from '@/types/posts';

interface PostsSummaryCardsProps {
  posts: Post[];
  totalCount: number;
  loading?: boolean;
}

export const PostsSummaryCards: React.FC<PostsSummaryCardsProps> = ({
  posts,
  totalCount,
  loading,
}) => {
  const totalCurtidas = posts.reduce((sum, p) => sum + (p.curtidas || 0), 0);
  const totalComentarios = posts.reduce((sum, p) => sum + (p.comentarios || 0), 0);
  const totalCompartilhamentos = posts.reduce(
    (sum, p) => sum + (p.compartilhamentos || 0),
    0
  );

  const cards = [
    {
      title: 'Total de Posts',
      value: totalCount,
      icon: FileText,
    },
    {
      title: 'Total de Curtidas',
      value: totalCurtidas.toLocaleString('pt-BR'),
      icon: Heart,
    },
    {
      title: 'Total de Comentários',
      value: totalComentarios.toLocaleString('pt-BR'),
      icon: MessageCircle,
    },
    {
      title: 'Total de Compartilhamentos',
      value: totalCompartilhamentos.toLocaleString('pt-BR'),
      icon: Share2,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="bg-card border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{card.title}</p>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
            </div>
            <card.icon className="h-8 w-8 text-secondary" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
