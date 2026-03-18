import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star, Heart, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Post {
  id: string;
  data_publicacao: string;
  tipo: string | null;
  engajamento_total: number | null;
  curtidas: number | null;
  comentarios: number | null;
}

interface ComparisonTopPostsProps {
  postsA: Post[];
  postsB: Post[];
  profileAName: string;
  profileBName: string;
  colorA: string;
  colorB: string;
  loading?: boolean;
}

const getTypeBadgeColor = (tipo: string | null) => {
  switch (tipo?.toLowerCase()) {
    case 'imagem':
    case 'photo':
      return 'bg-blue-600 text-white';
    case 'video':
      return 'bg-purple-600 text-white';
    case 'reels':
      return 'bg-pink-600 text-white';
    case 'carrossel':
    case 'carousel':
      return 'bg-green-600 text-white';
    default:
      return 'bg-gray-600 text-white';
  }
};

export const ComparisonTopPosts: React.FC<ComparisonTopPostsProps> = ({
  postsA,
  postsB,
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
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatNumber = (value: number | null) => {
    if (value === null) return '0';
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  const renderPostsList = (posts: Post[], name: string, color: string) => (
    <div 
      className="rounded-lg border border-border overflow-hidden"
      style={{ borderTopColor: color, borderTopWidth: '3px' }}
    >
      <div className="bg-muted/50 p-3">
        <h4 className="text-sm font-medium text-foreground">{name}</h4>
      </div>
      <ScrollArea className="h-[280px]">
        {posts.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            Sem posts disponíveis
          </div>
        ) : (
          <div className="divide-y divide-border">
            {posts.slice(0, 5).map((post, index) => (
              <div key={post.id} className="p-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium">
                      #{index + 1}
                    </span>
                    <Badge className={`text-xs ${getTypeBadgeColor(post.tipo)}`}>
                      {post.tipo || 'post'}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(post.data_publicacao), 'dd/MM/yy', { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Heart className="h-3 w-3" />
                    {formatNumber(post.curtidas)}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageCircle className="h-3 w-3" />
                    {formatNumber(post.comentarios)}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-foreground ml-auto">
                    <Star className="h-3 w-3 text-[#C4A000]" />
                    {formatNumber(post.engajamento_total)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Star className="h-5 w-5 text-secondary" />
          Top Posts por Engajamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderPostsList(postsA, profileAName, colorA)}
          {renderPostsList(postsB, profileBName, colorB)}
        </div>
      </CardContent>
    </Card>
  );
};
