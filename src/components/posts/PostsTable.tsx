import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Post, SortDirection } from '@/types/posts';
import { cn } from '@/lib/utils';

interface PostsTableProps {
  posts: Post[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  sortColumn: string;
  sortDirection: SortDirection;
  onSort: (column: string) => void;
  onPostClick: (post: Post) => void;
}

const PAGE_SIZE = 20;

const getPlataformaBadgeClass = (plataforma: string) => {
  switch (plataforma.toLowerCase()) {
    case 'facebook':
      return 'bg-blue-600 hover:bg-blue-700 text-white';
    case 'instagram':
      return 'bg-pink-600 hover:bg-pink-700 text-white';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getTipoBadgeClass = (tipo: string | null) => {
  switch (tipo?.toLowerCase()) {
    case 'texto':
      return 'bg-gray-600 hover:bg-gray-700 text-white';
    case 'imagem':
      return 'bg-green-600 hover:bg-green-700 text-white';
    case 'video':
      return 'bg-blue-500 hover:bg-blue-600 text-white';
    case 'story':
      return 'bg-purple-600 hover:bg-purple-700 text-white';
    case 'reels':
      return 'bg-pink-500 hover:bg-pink-600 text-white';
    case 'carrossel':
      return 'bg-orange-500 hover:bg-orange-600 text-white';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getSentimentoBadgeClass = (sentimento: string | null) => {
  switch (sentimento?.toLowerCase()) {
    case 'positivo':
      return 'bg-green-600 hover:bg-green-700 text-white';
    case 'neutro':
      return 'bg-gray-500 hover:bg-gray-600 text-white';
    case 'negativo':
      return 'bg-red-600 hover:bg-red-700 text-white';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getCategoriaBadgeClass = (categoria: string | null) => {
  const cores: Record<string, string> = {
    'Infraestrutura': 'bg-amber-600 hover:bg-amber-700 text-white',
    'Acessibilidade': 'bg-blue-600 hover:bg-blue-700 text-white',
    'Orçamento': 'bg-green-600 hover:bg-green-700 text-white',
    'Carreira/Trabalho': 'bg-purple-600 hover:bg-purple-700 text-white',
    'Assistência Estudantil': 'bg-pink-600 hover:bg-pink-700 text-white',
    'Ensino/Pesquisa/Extensão': 'bg-indigo-600 hover:bg-indigo-700 text-white',
    'HUAP/Saúde': 'bg-red-600 hover:bg-red-700 text-white',
    'Gestão/Governança': 'bg-cyan-600 hover:bg-cyan-700 text-white',
    'Político': 'bg-orange-600 hover:bg-orange-700 text-white',
  };
  return cores[categoria || ''] || 'bg-muted text-muted-foreground';
};

const getRelevanciaBadgeClass = (relevancia: string | null) => {
  switch (relevancia?.toLowerCase()) {
    case 'alta':
      return 'bg-red-500 hover:bg-red-600 text-white';
    case 'media':
    case 'média':
      return 'bg-yellow-500 hover:bg-yellow-600 text-black';
    case 'baixa':
      return 'bg-gray-500 hover:bg-gray-600 text-white';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const truncateText = (text: string | null, maxLength: number) => {
  if (!text) return '-';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

interface SortableHeaderProps {
  column: string;
  label: string;
  currentColumn: string;
  direction: SortDirection;
  onSort: (column: string) => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  column,
  label,
  currentColumn,
  direction,
  onSort,
}) => {
  const isActive = column === currentColumn;

  return (
    <TableHead
      className="cursor-pointer hover:bg-muted/50 select-none"
      onClick={() => onSort(column)}
    >
      <div className="flex items-center gap-1">
        {label}
        {isActive ? (
          direction === 'asc' ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )
        ) : (
          <ArrowUpDown className="h-4 w-4 opacity-50" />
        )}
      </div>
    </TableHead>
  );
};

export const PostsTable: React.FC<PostsTableProps> = ({
  posts,
  loading,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  sortColumn,
  sortDirection,
  onSort,
  onPostClick,
}) => {
  const from = (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, totalCount);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({ length: 12 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 12 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <p className="text-muted-foreground">
          Nenhum post encontrado com os filtros selecionados
        </p>
      </div>
    );
  }

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => onPageChange(i)}
            isActive={i === currentPage}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader
                column="perfil"
                label="Perfil"
                currentColumn={sortColumn}
                direction={sortDirection}
                onSort={onSort}
              />
              <SortableHeader
                column="plataforma"
                label="Plataforma"
                currentColumn={sortColumn}
                direction={sortDirection}
                onSort={onSort}
              />
              <SortableHeader
                column="data_publicacao"
                label="Data"
                currentColumn={sortColumn}
                direction={sortDirection}
                onSort={onSort}
              />
              <SortableHeader
                column="tipo"
                label="Tipo"
                currentColumn={sortColumn}
                direction={sortDirection}
                onSort={onSort}
              />
              <TableHead>Conteúdo</TableHead>
              <SortableHeader
                column="categoria_estrategica"
                label="Categoria"
                currentColumn={sortColumn}
                direction={sortDirection}
                onSort={onSort}
              />
              <SortableHeader
                column="relevancia_campanha"
                label="Relevância"
                currentColumn={sortColumn}
                direction={sortDirection}
                onSort={onSort}
              />
              <SortableHeader
                column="curtidas"
                label="Curtidas"
                currentColumn={sortColumn}
                direction={sortDirection}
                onSort={onSort}
              />
              <SortableHeader
                column="comentarios"
                label="Coment."
                currentColumn={sortColumn}
                direction={sortDirection}
                onSort={onSort}
              />
              <SortableHeader
                column="compartilhamentos"
                label="Compart."
                currentColumn={sortColumn}
                direction={sortDirection}
                onSort={onSort}
              />
              <SortableHeader
                column="engajamento_total"
                label="Engaj."
                currentColumn={sortColumn}
                direction={sortDirection}
                onSort={onSort}
              />
              <SortableHeader
                column="sentimento"
                label="Sentimento"
                currentColumn={sortColumn}
                direction={sortDirection}
                onSort={onSort}
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow
                key={post.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onPostClick(post)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {post.perfil?.cor_grafico && (
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: post.perfil.cor_grafico }}
                      />
                    )}
                    <span className="truncate max-w-[100px]">{post.perfil?.nome || '-'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={cn(getPlataformaBadgeClass(post.plataforma))}>
                    {post.plataforma}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {post.data_publicacao
                    ? format(new Date(post.data_publicacao), 'dd/MM/yy HH:mm', {
                        locale: ptBR,
                      })
                    : '-'}
                </TableCell>
                <TableCell>
                  <Badge className={cn(getTipoBadgeClass(post.tipo))}>
                    {post.tipo || '-'}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[150px]">
                  {truncateText(post.conteudo_texto, 60)}
                </TableCell>
                <TableCell>
                  {post.categoria_estrategica ? (
                    <Badge className={cn(getCategoriaBadgeClass(post.categoria_estrategica), 'text-xs')}>
                      {post.categoria_estrategica.length > 12 
                        ? post.categoria_estrategica.substring(0, 12) + '...' 
                        : post.categoria_estrategica}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-xs">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {post.relevancia_campanha ? (
                    <Badge className={cn(getRelevanciaBadgeClass(post.relevancia_campanha))}>
                      {post.relevancia_campanha}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-xs">-</span>
                  )}
                </TableCell>
                <TableCell>{post.curtidas?.toLocaleString('pt-BR') || 0}</TableCell>
                <TableCell>
                  {post.comentarios?.toLocaleString('pt-BR') || 0}
                </TableCell>
                <TableCell>
                  {post.compartilhamentos?.toLocaleString('pt-BR') || 0}
                </TableCell>
                <TableCell className="font-semibold">
                  {post.engajamento_total?.toLocaleString('pt-BR') || 0}
                </TableCell>
                <TableCell>
                  {post.sentimento && (
                    <Badge className={cn(getSentimentoBadgeClass(post.sentimento))}>
                      {post.sentimento}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando {from}-{to} de {totalCount} posts
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                className={cn(
                  'cursor-pointer',
                  currentPage === 1 && 'pointer-events-none opacity-50'
                )}
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                className={cn(
                  'cursor-pointer',
                  currentPage === totalPages && 'pointer-events-none opacity-50'
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
