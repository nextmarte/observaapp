import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import {
  PostsFilters,
  PostsSummaryCards,
  PostsTable,
  PostDetailModal,
} from '@/components/posts';
import { supabase } from '@/integrations/supabase/client';
import { Post, PostComment, PostsFiltersState, SortDirection } from '@/types/posts';

const PAGE_SIZE = 20;

const getDefaultFilters = (): PostsFiltersState => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  return {
    dataInicio: thirtyDaysAgo,
    dataFim: today,
    perfilId: null,
    plataforma: null,
    tipo: null,
    sentimento: null,
    categoriaEstrategica: null,
    relevancia: null,
    tipoInformacao: null,
  };
};

const Posts = () => {
  // Filter states
  const [filters, setFilters] = useState<PostsFiltersState>(getDefaultFilters());
  const [appliedFilters, setAppliedFilters] = useState<PostsFiltersState>(filters);

  // Pagination & sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('data_publicacao');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Modal state
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch profiles for filter dropdown
  const { data: profiles = [] } = useQuery({
    queryKey: ['profiles-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fpobserva_perfis')
        .select('id, nome')
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      return data || [];
    },
  });

  // Build query with filters
  const buildFilteredQuery = (query: any) => {
    if (appliedFilters.dataInicio) {
      query = query.gte('data_publicacao', appliedFilters.dataInicio.toISOString());
    }
    if (appliedFilters.dataFim) {
      const endOfDay = new Date(appliedFilters.dataFim);
      endOfDay.setHours(23, 59, 59, 999);
      query = query.lte('data_publicacao', endOfDay.toISOString());
    }
    if (appliedFilters.perfilId) {
      query = query.eq('perfil_id', appliedFilters.perfilId);
    }
    if (appliedFilters.plataforma) {
      query = query.ilike('plataforma', appliedFilters.plataforma);
    }
    if (appliedFilters.tipo) {
      query = query.eq('tipo', appliedFilters.tipo);
    }
    if (appliedFilters.sentimento) {
      query = query.eq('sentimento', appliedFilters.sentimento);
    }
    // Novos filtros
    if (appliedFilters.categoriaEstrategica) {
      query = query.eq('categoria_estrategica', appliedFilters.categoriaEstrategica);
    }
    if (appliedFilters.relevancia) {
      query = query.ilike('relevancia_campanha', appliedFilters.relevancia);
    }
    if (appliedFilters.tipoInformacao) {
      query = query.ilike('tipo_informacao', appliedFilters.tipoInformacao);
    }
    return query;
  };

  // Fetch posts count
  const { data: totalCount = 0 } = useQuery({
    queryKey: ['posts-count', appliedFilters],
    queryFn: async () => {
      let query = supabase
        .from('fpobserva_posts')
        .select('*', { count: 'exact', head: true });

      query = buildFilteredQuery(query);

      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch posts with pagination
  const {
    data: posts = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['posts', appliedFilters, currentPage, sortColumn, sortDirection],
    queryFn: async () => {
      const from = (currentPage - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from('fpobserva_posts')
        .select('*, perfil:fpobserva_perfis!perfil_id(id, nome, cor_grafico)');

      query = buildFilteredQuery(query);

      // Map sort column for joined fields
      const orderColumn = sortColumn === 'perfil' ? 'perfil_id' : sortColumn;

      const { data, error } = await query
        .order(orderColumn, { ascending: sortDirection === 'asc' })
        .range(from, to);

      if (error) throw error;
      return (data as unknown as Post[]) || [];
    },
  });

  // Fetch comments for selected post
  const { data: comments = [], isLoading: loadingComments } = useQuery({
    queryKey: ['post-comments', selectedPost?.id],
    queryFn: async () => {
      if (!selectedPost?.id) return [];

      const { data, error } = await supabase
        .from('fpobserva_comentarios')
        .select('*')
        .eq('post_id', selectedPost.id)
        .eq('relevante', true)
        .order('curtidas', { ascending: false });

      if (error) throw error;
      return (data as PostComment[]) || [];
    },
    enabled: !!selectedPost?.id,
  });

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    const defaultFilters = getDefaultFilters();
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setCurrentPage(1);
  };

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleExportCSV = async () => {
    // Fetch all posts with current filters (no pagination)
    let query = supabase
      .from('fpobserva_posts')
      .select('*, perfil:fpobserva_perfis!perfil_id(id, nome, cor_grafico)');

    query = buildFilteredQuery(query);

    const { data, error } = await query.order(sortColumn, { ascending: sortDirection === 'asc' });

    if (error || !data) {
      console.error('Error exporting:', error);
      return;
    }

    // Build CSV with new fields
    const headers = [
      'Perfil',
      'Plataforma',
      'Data',
      'Tipo',
      'Conteúdo',
      'Curtidas',
      'Comentários',
      'Compartilhamentos',
      'Engajamento Total',
      'Sentimento',
      'Categoria',
      'Subcategoria',
      'Relevância',
      'Tipo Informação',
      'Menções',
      'Notas Campanha',
    ];

    const rows = (data as unknown as Post[]).map((post) => [
      post.perfil?.nome || '',
      post.plataforma,
      post.data_publicacao,
      post.tipo || '',
      (post.conteudo_texto || '').replace(/"/g, '""'),
      post.curtidas || 0,
      post.comentarios || 0,
      post.compartilhamentos || 0,
      post.engajamento_total || 0,
      post.sentimento || '',
      post.categoria_estrategica || '',
      post.subcategoria || '',
      post.relevancia_campanha || '',
      post.tipo_informacao || '',
      post.mencoes?.join('; ') || '',
      (post.notas_campanha || '').replace(/"/g, '""'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${cell}"`).join(',')
      ),
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `posts_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loading = isLoading || isFetching;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-8 w-8 text-secondary" />
            <h1 className="text-2xl font-bold text-foreground">Posts</h1>
          </div>
          <p className="text-muted-foreground">
            Todos os posts coletados das redes sociais
          </p>
        </div>

        {/* Filters */}
        <PostsFilters
          filters={filters}
          onFiltersChange={setFilters}
          onApply={handleApplyFilters}
          onClearFilters={handleClearFilters}
          onExportCSV={handleExportCSV}
          profiles={profiles}
          loading={loading}
        />

        {/* Summary Cards */}
        <PostsSummaryCards
          posts={posts}
          totalCount={totalCount}
          loading={loading}
        />

        {/* Posts Table */}
        <PostsTable
          posts={posts}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={setCurrentPage}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          onPostClick={handlePostClick}
        />

        {/* Post Detail Modal */}
        <PostDetailModal
          post={selectedPost}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          comments={comments}
          loadingComments={loadingComments}
        />
      </div>
    </MainLayout>
  );
};

export default Posts;
