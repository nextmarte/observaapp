import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useLatestPostDateReference = () =>
  useQuery({
    queryKey: ['latest-data-reference', 'fpobserva_posts', 'data_publicacao'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fpobserva_posts')
        .select('data_publicacao')
        .not('data_publicacao', 'is', null)
        .order('data_publicacao', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data?.data_publicacao || null;
    },
    staleTime: 15 * 60 * 1000,
  });

export const useLatestReitoriaMentionDateReference = () =>
  useQuery({
    queryKey: ['latest-data-reference', 'fpobserva_vw_mencoes_reitoria', 'data_publicacao'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fpobserva_vw_mencoes_reitoria')
        .select('data_publicacao')
        .not('data_publicacao', 'is', null)
        .order('data_publicacao', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data?.data_publicacao || null;
    },
    staleTime: 15 * 60 * 1000,
  });

export const useLatestEbserhMentionDateReference = () =>
  useQuery({
    queryKey: ['latest-data-reference', 'fpobserva_vw_mencoes_ebserh', 'data_publicacao'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fpobserva_vw_mencoes_ebserh')
        .select('data_publicacao')
        .not('data_publicacao', 'is', null)
        .order('data_publicacao', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data?.data_publicacao || null;
    },
    staleTime: 15 * 60 * 1000,
  });
