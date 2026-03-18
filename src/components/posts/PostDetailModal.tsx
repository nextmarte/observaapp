import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ExternalLink, Heart, MessageCircle, Share2, Eye, Tag, AlertTriangle, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Post, PostComment } from '@/types/posts';
import { cn } from '@/lib/utils';

interface PostDetailModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  comments: PostComment[];
  loadingComments: boolean;
}

const getPlataformaBadgeClass = (plataforma: string) => {
  switch (plataforma.toLowerCase()) {
    case 'facebook':
      return 'bg-blue-600 text-white';
    case 'instagram':
      return 'bg-pink-600 text-white';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getTipoBadgeClass = (tipo: string | null) => {
  switch (tipo?.toLowerCase()) {
    case 'texto':
      return 'bg-gray-600 text-white';
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
      return 'bg-muted text-muted-foreground';
  }
};

const getSentimentoBadgeClass = (sentimento: string | null) => {
  switch (sentimento?.toLowerCase()) {
    case 'positivo':
      return 'bg-green-600 text-white';
    case 'neutro':
      return 'bg-gray-500 text-white';
    case 'negativo':
      return 'bg-red-600 text-white';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getRelevanciaBadgeClass = (relevancia: string | null) => {
  switch (relevancia?.toLowerCase()) {
    case 'alta':
      return 'bg-red-500 text-white';
    case 'media':
    case 'média':
      return 'bg-yellow-500 text-black';
    case 'baixa':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getTipoInformacaoBadgeClass = (tipo: string | null) => {
  switch (tipo?.toLowerCase()) {
    case 'problema':
      return 'bg-red-500 text-white';
    case 'demanda':
      return 'bg-orange-500 text-white';
    case 'critica':
    case 'crítica':
      return 'bg-red-600 text-white';
    case 'elogio':
      return 'bg-green-500 text-white';
    case 'neutro':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getCategoriaBadgeClass = (categoria: string | null) => {
  const cores: Record<string, string> = {
    'Infraestrutura': 'bg-amber-600 text-white',
    'Acessibilidade': 'bg-blue-600 text-white',
    'Orçamento': 'bg-green-600 text-white',
    'Carreira/Trabalho': 'bg-purple-600 text-white',
    'Assistência Estudantil': 'bg-pink-600 text-white',
    'Ensino/Pesquisa/Extensão': 'bg-indigo-600 text-white',
    'HUAP/Saúde': 'bg-red-600 text-white',
    'Gestão/Governança': 'bg-cyan-600 text-white',
    'Político': 'bg-orange-600 text-white',
  };
  return cores[categoria || ''] || 'bg-muted text-muted-foreground';
};

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  isOpen,
  onClose,
  comments,
  loadingComments,
}) => {
  if (!post) return null;

  const hasCampaignInfo = post.categoria_estrategica || post.subcategoria || 
    post.tipo_informacao || post.relevancia_campanha || 
    (post.mencoes && post.mencoes.length > 0) || post.notas_campanha;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {post.perfil?.cor_grafico && (
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: post.perfil.cor_grafico }}
                />
              )}
              <span>{post.perfil?.nome || 'Perfil desconhecido'}</span>
            </div>
            <Badge className={cn(getPlataformaBadgeClass(post.plataforma))}>
              {post.plataforma}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-100px)] px-6 pb-6">
          <div className="space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge className={cn(getTipoBadgeClass(post.tipo))}>
                {post.tipo || 'Sem tipo'}
              </Badge>
              {post.sentimento && (
                <Badge className={cn(getSentimentoBadgeClass(post.sentimento))}>
                  {post.sentimento}
                </Badge>
              )}
              {post.tema && (
                <Badge variant="outline">{post.tema}</Badge>
              )}
              {post.destaque && (
                <Badge className="bg-secondary text-secondary-foreground">
                  Destaque
                </Badge>
              )}
            </div>

            {/* Data */}
            <p className="text-sm text-muted-foreground">
              Publicado em{' '}
              {post.data_publicacao
                ? format(new Date(post.data_publicacao), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })
                : '-'}
            </p>

            {/* Métricas */}
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                <Heart className="h-5 w-5 text-red-500 mb-1" />
                <span className="text-lg font-bold">
                  {post.curtidas?.toLocaleString('pt-BR') || 0}
                </span>
                <span className="text-xs text-muted-foreground">Curtidas</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                <MessageCircle className="h-5 w-5 text-blue-500 mb-1" />
                <span className="text-lg font-bold">
                  {post.comentarios?.toLocaleString('pt-BR') || 0}
                </span>
                <span className="text-xs text-muted-foreground">Comentários</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                <Share2 className="h-5 w-5 text-green-500 mb-1" />
                <span className="text-lg font-bold">
                  {post.compartilhamentos?.toLocaleString('pt-BR') || 0}
                </span>
                <span className="text-xs text-muted-foreground">Compartilh.</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                <Eye className="h-5 w-5 text-purple-500 mb-1" />
                <span className="text-lg font-bold">
                  {post.alcance?.toLocaleString('pt-BR') || '-'}
                </span>
                <span className="text-xs text-muted-foreground">Alcance</span>
              </div>
            </div>

            {/* Engajamento Total */}
            <div className="p-4 bg-secondary/20 rounded-lg text-center">
              <span className="text-sm text-muted-foreground">Engajamento Total</span>
              <p className="text-2xl font-bold text-secondary">
                {post.engajamento_total?.toLocaleString('pt-BR') || 0}
              </p>
            </div>

            {/* Informações de Campanha */}
            {hasCampaignInfo && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Informações de Campanha
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Categoria Estratégica */}
                    {post.categoria_estrategica && (
                      <div>
                        <span className="text-xs text-muted-foreground">Categoria</span>
                        <div className="mt-1">
                          <Badge className={cn(getCategoriaBadgeClass(post.categoria_estrategica))}>
                            {post.categoria_estrategica}
                          </Badge>
                        </div>
                      </div>
                    )}
                    
                    {/* Subcategoria */}
                    {post.subcategoria && (
                      <div>
                        <span className="text-xs text-muted-foreground">Subcategoria</span>
                        <p className="font-medium mt-1">{post.subcategoria}</p>
                      </div>
                    )}
                    
                    {/* Tipo de Informação */}
                    {post.tipo_informacao && (
                      <div>
                        <span className="text-xs text-muted-foreground">Tipo de Informação</span>
                        <div className="mt-1">
                          <Badge className={cn(getTipoInformacaoBadgeClass(post.tipo_informacao))}>
                            {post.tipo_informacao}
                          </Badge>
                        </div>
                      </div>
                    )}
                    
                    {/* Relevância */}
                    {post.relevancia_campanha && (
                      <div>
                        <span className="text-xs text-muted-foreground">Relevância</span>
                        <div className="mt-1">
                          <Badge className={cn(getRelevanciaBadgeClass(post.relevancia_campanha))}>
                            {post.relevancia_campanha}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Menções */}
                  {post.mencoes && post.mencoes.length > 0 && (
                    <div className="mt-4">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        Menções
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {post.mencoes.map((mencao, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            @{mencao}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Notas de Campanha */}
                  {post.notas_campanha && (
                    <div className="mt-4 p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                      <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                        <AlertTriangle className="h-3 w-3" />
                        Notas de Campanha
                      </span>
                      <p className="text-sm">{post.notas_campanha}</p>
                    </div>
                  )}
                </div>
              </>
            )}

            <Separator />

            {/* Conteúdo */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Conteúdo
              </h3>
              <p className="text-foreground whitespace-pre-wrap">
                {post.conteudo_texto || 'Sem conteúdo de texto'}
              </p>
            </div>

            {/* Mídia */}
            {post.url_midia && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                  Mídia
                </h3>
                <img
                  src={post.url_midia}
                  alt="Mídia do post"
                  className="max-w-full h-auto rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Link para post original */}
            {post.url_post && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(post.url_post!, '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Ver post original
              </Button>
            )}

            <Separator />

            {/* Comentários Relevantes */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                Comentários Relevantes
              </h3>
              {loadingComments ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-3 bg-muted/30 rounded-lg">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              ) : comments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum comentário relevante encontrado
                </p>
              ) : (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">
                          {comment.autor || 'Anônimo'}
                        </span>
                        <div className="flex items-center gap-2">
                          {comment.sentimento && (
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-xs',
                                getSentimentoBadgeClass(comment.sentimento)
                              )}
                            >
                              {comment.sentimento}
                            </Badge>
                          )}
                          {comment.curtidas !== null && comment.curtidas > 0 && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {comment.curtidas}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {comment.conteudo}
                      </p>
                      {comment.data_comentario && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(
                            new Date(comment.data_comentario),
                            "dd/MM/yyyy 'às' HH:mm",
                            { locale: ptBR }
                          )}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
