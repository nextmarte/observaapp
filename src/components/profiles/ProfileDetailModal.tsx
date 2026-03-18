import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ExternalLink, Users, FileText, Heart } from 'lucide-react';
import { ProfileWithMetrics, Coleta, WeeklyEngagement } from '@/types/profiles';
import { Post } from '@/types/posts';
import { ProfileGrowthChart } from './ProfileGrowthChart';
import { ProfileEngagementChart } from './ProfileEngagementChart';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileDetailModalProps {
  profile: ProfileWithMetrics | null;
  isOpen: boolean;
  onClose: () => void;
  onViewAllPosts: (perfilId: string) => void;
  coletas: Coleta[];
  weeklyEngagement: WeeklyEngagement[];
  recentPosts: Post[];
  loadingColetas: boolean;
  loadingEngagement: boolean;
  loadingPosts: boolean;
}

const getPlataformaBadgeClass = (plataforma: string): string => {
  switch (plataforma.toLowerCase()) {
    case 'facebook':
      return 'bg-[#1877F2] text-white';
    case 'instagram':
      return 'bg-[#E4405F] text-white';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getTipoBadgeClass = (tipo: string): string => {
  switch (tipo.toLowerCase()) {
    case 'candidato':
      return 'bg-[#C4A000] text-black';
    case 'adversario':
      return 'bg-[#dc2626] text-white';
    case 'sindicato':
      return 'bg-[#00285F] text-white';
    case 'dce':
      return 'bg-[#22c55e] text-white';
    default:
      return 'bg-[#6b7280] text-white';
  }
};

const getTipoBadgeClassPost = (tipo: string | null): string => {
  switch (tipo?.toLowerCase()) {
    case 'imagem':
      return 'bg-green-600 text-white';
    case 'video':
      return 'bg-blue-500 text-white';
    case 'story':
      return 'bg-purple-600 text-white';
    case 'reels':
      return 'bg-pink-500 text-white';
    case 'carrossel':
      return 'bg-orange-500 text-white';
    default:
      return 'bg-gray-600 text-white';
  }
};

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  profile,
  isOpen,
  onClose,
  onViewAllPosts,
  coletas,
  weeklyEngagement,
  recentPosts,
  loadingColetas,
  loadingEngagement,
  loadingPosts,
}) => {
  if (!profile) return null;

  const profileColor = profile.cor_grafico || '#3b82f6';

  // Calcular engajamento médio por post
  const engajamentoMedio = profile.postsSemana > 0
    ? Math.round(profile.engajamentoSemana / profile.postsSemana)
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-card border-border">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader className="mb-6">
              <div className="flex items-center gap-3 flex-wrap">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: profileColor }}
                />
                <DialogTitle className="text-xl font-bold text-foreground">
                  {profile.nome}
                </DialogTitle>
                <Badge className={getPlataformaBadgeClass(profile.plataforma)}>
                  {profile.plataforma}
                </Badge>
                <Badge className={getTipoBadgeClass(profile.tipo)}>
                  {profile.tipo}
                </Badge>
              </div>
              {profile.url_perfil && (
                <a
                  href={profile.url_perfil}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-secondary hover:underline mt-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Ver perfil original
                </a>
              )}
            </DialogHeader>

            {/* Métricas Atuais */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <Card className="bg-background border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Seguidores</p>
                    <p className="text-xl font-bold text-foreground">
                      {profile.seguidoresAtuais.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <FileText className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Posts (semana)</p>
                    <p className="text-xl font-bold text-foreground">
                      {profile.postsSemana}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <Heart className="h-8 w-8 text-pink-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Engaj. médio/post</p>
                    <p className="text-xl font-bold text-foreground">
                      {engajamentoMedio.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-background rounded-lg border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  Evolução de Seguidores
                </h3>
                <ProfileGrowthChart
                  data={coletas}
                  profileColor={profileColor}
                  loading={loadingColetas}
                />
              </div>
              <div className="bg-background rounded-lg border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  Engajamento por Semana
                </h3>
                <ProfileEngagementChart
                  data={weeklyEngagement}
                  profileColor={profileColor}
                  loading={loadingEngagement}
                />
              </div>
            </div>

            {/* Últimos Posts */}
            <div className="bg-background rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Últimos Posts
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewAllPosts(profile.id)}
                >
                  Ver todos os posts
                </Button>
              </div>

              {loadingPosts ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : recentPosts.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum post encontrado
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground">Data</TableHead>
                        <TableHead className="text-muted-foreground">Tipo</TableHead>
                        <TableHead className="text-muted-foreground">Conteúdo</TableHead>
                        <TableHead className="text-muted-foreground text-right">Curtidas</TableHead>
                        <TableHead className="text-muted-foreground text-right">Coment.</TableHead>
                        <TableHead className="text-muted-foreground text-right">Engaj.</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentPosts.map((post) => (
                        <TableRow key={post.id} className="border-border">
                          <TableCell className="text-foreground whitespace-nowrap">
                            {format(parseISO(post.data_publicacao), 'dd/MM/yyyy', { locale: ptBR })}
                          </TableCell>
                          <TableCell>
                            <Badge className={getTipoBadgeClassPost(post.tipo)}>
                              {post.tipo || 'texto'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-foreground max-w-[200px] truncate">
                            {post.conteudo_texto?.slice(0, 80) || '-'}
                          </TableCell>
                          <TableCell className="text-foreground text-right">
                            {(post.curtidas ?? 0).toLocaleString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-foreground text-right">
                            {(post.comentarios ?? 0).toLocaleString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-foreground text-right">
                            {(post.engajamento_total ?? 0).toLocaleString('pt-BR')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
