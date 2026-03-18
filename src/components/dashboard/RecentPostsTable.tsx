import React from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Facebook, Instagram, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from './EmptyState';
import type { RecentPost } from '@/types/dashboard';

interface RecentPostsTableProps {
  data: RecentPost[];
  loading?: boolean;
}

const getPostTypeBadgeColor = (tipo: string | null): string => {
  switch (tipo?.toLowerCase()) {
    case 'imagem':
    case 'photo':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'video':
    case 'vídeo':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'carrossel':
    case 'carousel':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'reels':
      return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
    case 'story':
    case 'stories':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'link':
      return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

const PlatformIcon = ({ platform }: { platform: string | null }) => {
  if (platform?.toLowerCase() === 'instagram') {
    return <Instagram className="h-4 w-4 text-pink-500" />;
  }
  return <Facebook className="h-4 w-4 text-blue-500" />;
};

export const RecentPostsTable: React.FC<RecentPostsTableProps> = ({
  data,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground">
            Últimos Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="Nenhum post encontrado"
            description="Os posts aparecerão aqui após as coletas"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-foreground">
          Últimos Posts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Perfil</TableHead>
                <TableHead className="text-muted-foreground">Plataforma</TableHead>
                <TableHead className="text-muted-foreground">Data</TableHead>
                <TableHead className="text-muted-foreground">Tipo</TableHead>
                <TableHead className="text-muted-foreground text-right">Curtidas</TableHead>
                <TableHead className="text-muted-foreground text-right">Comentários</TableHead>
                <TableHead className="text-muted-foreground text-right">Compart.</TableHead>
                <TableHead className="text-muted-foreground text-right">Engajamento</TableHead>
                <TableHead className="text-muted-foreground w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((post) => (
                <TableRow
                  key={post.id}
                  className="border-border hover:bg-muted/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: post.cor_grafico || '#C4A000' }}
                      />
                      <span className="font-medium text-foreground">
                        {post.perfil_nome || 'Desconhecido'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <PlatformIcon platform={post.plataforma} />
                      <span className="text-muted-foreground capitalize">
                        {post.plataforma}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {post.data_publicacao
                      ? format(parseISO(post.data_publicacao), "dd/MM/yyyy", {
                          locale: ptBR,
                        })
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getPostTypeBadgeColor(post.tipo)}
                    >
                      {post.tipo || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-foreground">
                    {(post.curtidas || 0).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right text-foreground">
                    {(post.comentarios || 0).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right text-foreground">
                    {(post.compartilhamentos || 0).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right font-medium text-secondary">
                    {(post.engajamento_total || 0).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {post.url_post && (
                      <a
                        href={post.url_post}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-secondary transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
