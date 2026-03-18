export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      fpobserva_alertas: {
        Row: {
          acao_sugerida: string | null
          created_at: string | null
          data_alerta: string
          descricao: string | null
          fonte: string | null
          id: string
          nivel: string
          resolvido: boolean | null
          semana_ano: string
          tipo_alerta: string
          titulo: string
        }
        Insert: {
          acao_sugerida?: string | null
          created_at?: string | null
          data_alerta: string
          descricao?: string | null
          fonte?: string | null
          id?: string
          nivel: string
          resolvido?: boolean | null
          semana_ano: string
          tipo_alerta: string
          titulo: string
        }
        Update: {
          acao_sugerida?: string | null
          created_at?: string | null
          data_alerta?: string
          descricao?: string | null
          fonte?: string | null
          id?: string
          nivel?: string
          resolvido?: boolean | null
          semana_ano?: string
          tipo_alerta?: string
          titulo?: string
        }
        Relationships: []
      }
      fpobserva_alertas_config: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          id: string
          operador: string | null
          perfil_id: string | null
          threshold: number
          tipo_metrica: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          operador?: string | null
          perfil_id?: string | null
          threshold: number
          tipo_metrica: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          operador?: string | null
          perfil_id?: string | null
          threshold?: number
          tipo_metrica?: string
        }
        Relationships: [
          {
            foreignKeyName: "fpobserva_alertas_config_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fpobserva_alertas_config_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_vw_engajamento_historico"
            referencedColumns: ["perfil_id"]
          },
          {
            foreignKeyName: "fpobserva_alertas_config_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_vw_resumo_semanal"
            referencedColumns: ["perfil_id"]
          },
        ]
      }
      fpobserva_alertas_historico: {
        Row: {
          alerta_config_id: string | null
          created_at: string | null
          id: string
          mensagem: string
          valor_detectado: number | null
          visualizado: boolean | null
        }
        Insert: {
          alerta_config_id?: string | null
          created_at?: string | null
          id?: string
          mensagem: string
          valor_detectado?: number | null
          visualizado?: boolean | null
        }
        Update: {
          alerta_config_id?: string | null
          created_at?: string | null
          id?: string
          mensagem?: string
          valor_detectado?: number | null
          visualizado?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "fpobserva_alertas_historico_alerta_config_id_fkey"
            columns: ["alerta_config_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_alertas_config"
            referencedColumns: ["id"]
          },
        ]
      }
      fpobserva_coletas: {
        Row: {
          created_at: string | null
          data_coleta: string
          id: string
          perfil_id: string | null
          seguidores: number | null
          seguindo: number | null
          semana_ano: string
          total_posts: number | null
        }
        Insert: {
          created_at?: string | null
          data_coleta: string
          id?: string
          perfil_id?: string | null
          seguidores?: number | null
          seguindo?: number | null
          semana_ano: string
          total_posts?: number | null
        }
        Update: {
          created_at?: string | null
          data_coleta?: string
          id?: string
          perfil_id?: string | null
          seguidores?: number | null
          seguindo?: number | null
          semana_ano?: string
          total_posts?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fpobserva_coletas_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fpobserva_coletas_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_vw_engajamento_historico"
            referencedColumns: ["perfil_id"]
          },
          {
            foreignKeyName: "fpobserva_coletas_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_vw_resumo_semanal"
            referencedColumns: ["perfil_id"]
          },
        ]
      }
      fpobserva_comentarios: {
        Row: {
          autor: string | null
          conteudo: string
          created_at: string | null
          curtidas: number | null
          data_comentario: string | null
          id: string
          post_id: string | null
          relevante: boolean | null
          sentimento: string | null
        }
        Insert: {
          autor?: string | null
          conteudo: string
          created_at?: string | null
          curtidas?: number | null
          data_comentario?: string | null
          id?: string
          post_id?: string | null
          relevante?: boolean | null
          sentimento?: string | null
        }
        Update: {
          autor?: string | null
          conteudo?: string
          created_at?: string | null
          curtidas?: number | null
          data_comentario?: string | null
          id?: string
          post_id?: string | null
          relevante?: boolean | null
          sentimento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fpobserva_comentarios_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fpobserva_comentarios_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_vw_inteligencia_campanha"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fpobserva_comentarios_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_vw_mencoes_ebserh"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fpobserva_comentarios_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_vw_mencoes_reitoria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fpobserva_comentarios_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_vw_posts_ultima_semana"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fpobserva_comentarios_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_vw_ranking_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      fpobserva_comentarios_detalhados: {
        Row: {
          comentarista_id: string | null
          conteudo: string | null
          created_at: string | null
          curtidas: number | null
          data_comentario: string | null
          id: string
          post_id: string | null
          relevante: boolean | null
          sentimento: string | null
        }
        Insert: {
          comentarista_id?: string | null
          conteudo?: string | null
          created_at?: string | null
          curtidas?: number | null
          data_comentario?: string | null
          id?: string
          post_id?: string | null
          relevante?: boolean | null
          sentimento?: string | null
        }
        Update: {
          comentarista_id?: string | null
          conteudo?: string | null
          created_at?: string | null
          curtidas?: number | null
          data_comentario?: string | null
          id?: string
          post_id?: string | null
          relevante?: boolean | null
          sentimento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fpobserva_comentarios_detalhados_comentarista_id_fkey"
            columns: ["comentarista_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_comentaristas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fpobserva_comentarios_detalhados_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fpobserva_comentarios_detalhados_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_vw_inteligencia_campanha"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fpobserva_comentarios_detalhados_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_vw_mencoes_ebserh"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fpobserva_comentarios_detalhados_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_vw_mencoes_reitoria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fpobserva_comentarios_detalhados_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_vw_posts_ultima_semana"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fpobserva_comentarios_detalhados_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_vw_ranking_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      fpobserva_comentaristas: {
        Row: {
          classificacao: string | null
          created_at: string | null
          id: string
          nome_perfil: string
          notas: string | null
          perfis_comentados: string[] | null
          plataforma: string
          posicao_ebserh: string | null
          primeira_aparicao: string | null
          total_comentarios: number | null
          ultima_aparicao: string | null
          updated_at: string | null
          url_perfil: string | null
        }
        Insert: {
          classificacao?: string | null
          created_at?: string | null
          id?: string
          nome_perfil: string
          notas?: string | null
          perfis_comentados?: string[] | null
          plataforma: string
          posicao_ebserh?: string | null
          primeira_aparicao?: string | null
          total_comentarios?: number | null
          ultima_aparicao?: string | null
          updated_at?: string | null
          url_perfil?: string | null
        }
        Update: {
          classificacao?: string | null
          created_at?: string | null
          id?: string
          nome_perfil?: string
          notas?: string | null
          perfis_comentados?: string[] | null
          plataforma?: string
          posicao_ebserh?: string | null
          primeira_aparicao?: string | null
          total_comentarios?: number | null
          ultima_aparicao?: string | null
          updated_at?: string | null
          url_perfil?: string | null
        }
        Relationships: []
      }
      fpobserva_perfis: {
        Row: {
          ativo: boolean | null
          cor_grafico: string | null
          created_at: string | null
          id: string
          nome: string
          plataforma: string
          tipo: string
          url_perfil: string | null
        }
        Insert: {
          ativo?: boolean | null
          cor_grafico?: string | null
          created_at?: string | null
          id?: string
          nome: string
          plataforma: string
          tipo: string
          url_perfil?: string | null
        }
        Update: {
          ativo?: boolean | null
          cor_grafico?: string | null
          created_at?: string | null
          id?: string
          nome?: string
          plataforma?: string
          tipo?: string
          url_perfil?: string | null
        }
        Relationships: []
      }
      fpobserva_posicionamentos_ebserh: {
        Row: {
          created_at: string | null
          entidade: string
          evidencias: string | null
          id: string
          posicao: string
          semana_ano: string
          tom_predominante: string | null
          total_posts: number | null
        }
        Insert: {
          created_at?: string | null
          entidade: string
          evidencias?: string | null
          id?: string
          posicao: string
          semana_ano: string
          tom_predominante?: string | null
          total_posts?: number | null
        }
        Update: {
          created_at?: string | null
          entidade?: string
          evidencias?: string | null
          id?: string
          posicao?: string
          semana_ano?: string
          tom_predominante?: string | null
          total_posts?: number | null
        }
        Relationships: []
      }
      fpobserva_posts: {
        Row: {
          alcance: number | null
          categoria_estrategica: string | null
          coleta_id: string | null
          comentarios: number | null
          compartilhamentos: number | null
          conteudo_texto: string | null
          created_at: string | null
          curtidas: number | null
          data_publicacao: string
          destaque: boolean | null
          engajamento_total: number | null
          id: string
          mencao_ebserh: boolean | null
          mencao_reitoria: boolean | null
          mencoes: string[] | null
          notas_campanha: string | null
          perfil_id: string | null
          plataforma: string
          relevancia_campanha: string | null
          sentimento: string | null
          subcategoria: string | null
          tema: string | null
          tipo: string | null
          tipo_informacao: string | null
          tom_ebserh: string | null
          url_midia: string | null
          url_post: string | null
          visualizacoes: number | null
        }
        Insert: {
          alcance?: number | null
          categoria_estrategica?: string | null
          coleta_id?: string | null
          comentarios?: number | null
          compartilhamentos?: number | null
          conteudo_texto?: string | null
          created_at?: string | null
          curtidas?: number | null
          data_publicacao: string
          destaque?: boolean | null
          engajamento_total?: number | null
          id?: string
          mencao_ebserh?: boolean | null
          mencao_reitoria?: boolean | null
          mencoes?: string[] | null
          notas_campanha?: string | null
          perfil_id?: string | null
          plataforma: string
          relevancia_campanha?: string | null
          sentimento?: string | null
          subcategoria?: string | null
          tema?: string | null
          tipo?: string | null
          tipo_informacao?: string | null
          tom_ebserh?: string | null
          url_midia?: string | null
          url_post?: string | null
          visualizacoes?: number | null
        }
        Update: {
          alcance?: number | null
          categoria_estrategica?: string | null
          coleta_id?: string | null
          comentarios?: number | null
          compartilhamentos?: number | null
          conteudo_texto?: string | null
          created_at?: string | null
          curtidas?: number | null
          data_publicacao?: string
          destaque?: boolean | null
          engajamento_total?: number | null
          id?: string
          mencao_ebserh?: boolean | null
          mencao_reitoria?: boolean | null
          mencoes?: string[] | null
          notas_campanha?: string | null
          perfil_id?: string | null
          plataforma?: string
          relevancia_campanha?: string | null
          sentimento?: string | null
          subcategoria?: string | null
          tema?: string | null
          tipo?: string | null
          tipo_informacao?: string | null
          tom_ebserh?: string | null
          url_midia?: string | null
          url_post?: string | null
          visualizacoes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fpobserva_posts_coleta_id_fkey"
            columns: ["coleta_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_coletas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fpobserva_posts_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fpobserva_posts_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_vw_engajamento_historico"
            referencedColumns: ["perfil_id"]
          },
          {
            foreignKeyName: "fpobserva_posts_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_vw_resumo_semanal"
            referencedColumns: ["perfil_id"]
          },
        ]
      }
      fpobserva_relatorios: {
        Row: {
          created_at: string | null
          gerado_por: string | null
          id: string
          periodo_fim: string | null
          periodo_inicio: string | null
          titulo: string
          url_arquivo: string | null
        }
        Insert: {
          created_at?: string | null
          gerado_por?: string | null
          id?: string
          periodo_fim?: string | null
          periodo_inicio?: string | null
          titulo: string
          url_arquivo?: string | null
        }
        Update: {
          created_at?: string | null
          gerado_por?: string | null
          id?: string
          periodo_fim?: string | null
          periodo_inicio?: string | null
          titulo?: string
          url_arquivo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fpobserva_relatorios_gerado_por_fkey"
            columns: ["gerado_por"]
            isOneToOne: false
            referencedRelation: "fpobserva_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      fpobserva_scores_semanais: {
        Row: {
          candidato: string
          comentarios_articulados: number | null
          comentaristas_unicos: number | null
          compartilhamentos: number | null
          created_at: string | null
          engajamento_medio: number | null
          engajamento_total: number | null
          id: string
          posts_total: number | null
          score_calculado: number | null
          semana_ano: string
          vencedor_semana: boolean | null
        }
        Insert: {
          candidato: string
          comentarios_articulados?: number | null
          comentaristas_unicos?: number | null
          compartilhamentos?: number | null
          created_at?: string | null
          engajamento_medio?: number | null
          engajamento_total?: number | null
          id?: string
          posts_total?: number | null
          score_calculado?: number | null
          semana_ano: string
          vencedor_semana?: boolean | null
        }
        Update: {
          candidato?: string
          comentarios_articulados?: number | null
          comentaristas_unicos?: number | null
          compartilhamentos?: number | null
          created_at?: string | null
          engajamento_medio?: number | null
          engajamento_total?: number | null
          id?: string
          posts_total?: number | null
          score_calculado?: number | null
          semana_ano?: string
          vencedor_semana?: boolean | null
        }
        Relationships: []
      }
      fpobserva_temperatura_ebserh: {
        Row: {
          acao_requerida: boolean | null
          created_at: string | null
          data_avaliacao: string
          engajamento_total: number | null
          id: string
          nivel: string
          notas: string | null
          risco_campanha: string | null
          semana_ano: string
          tendencia: string | null
          total_comentarios: number | null
          total_posts: number | null
        }
        Insert: {
          acao_requerida?: boolean | null
          created_at?: string | null
          data_avaliacao: string
          engajamento_total?: number | null
          id?: string
          nivel: string
          notas?: string | null
          risco_campanha?: string | null
          semana_ano: string
          tendencia?: string | null
          total_comentarios?: number | null
          total_posts?: number | null
        }
        Update: {
          acao_requerida?: boolean | null
          created_at?: string | null
          data_avaliacao?: string
          engajamento_total?: number | null
          id?: string
          nivel?: string
          notas?: string | null
          risco_campanha?: string | null
          semana_ano?: string
          tendencia?: string | null
          total_comentarios?: number | null
          total_posts?: number | null
        }
        Relationships: []
      }
      fpobserva_usuarios: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          email: string
          id: string
          nome: string
          role: string
          user_id: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          email: string
          id?: string
          nome: string
          role?: string
          user_id?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
      jequiia_aluno_conquistas: {
        Row: {
          aluno_id: string
          conquista_id: string
          conquistado_em: string | null
          id: string
        }
        Insert: {
          aluno_id: string
          conquista_id: string
          conquistado_em?: string | null
          id?: string
        }
        Update: {
          aluno_id?: string
          conquista_id?: string
          conquistado_em?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jequiia_aluno_conquistas_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "jequiia_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jequiia_aluno_conquistas_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "jequiia_v_progresso_materia"
            referencedColumns: ["aluno_id"]
          },
          {
            foreignKeyName: "jequiia_aluno_conquistas_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "jequiia_v_ranking_semanal"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jequiia_aluno_conquistas_conquista_id_fkey"
            columns: ["conquista_id"]
            isOneToOne: false
            referencedRelation: "jequiia_conquistas"
            referencedColumns: ["id"]
          },
        ]
      }
      jequiia_audit_log: {
        Row: {
          acao: string
          created_at: string | null
          dados_anteriores: Json | null
          dados_novos: Json | null
          id: string
          ip_address: string | null
          registro_id: string | null
          tabela: string | null
          user_id: string | null
        }
        Insert: {
          acao: string
          created_at?: string | null
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          id?: string
          ip_address?: string | null
          registro_id?: string | null
          tabela?: string | null
          user_id?: string | null
        }
        Update: {
          acao?: string
          created_at?: string | null
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          id?: string
          ip_address?: string | null
          registro_id?: string | null
          tabela?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      jequiia_chat_limite: {
        Row: {
          aluno_id: string
          data: string
          id: string
          limite_maximo: number | null
          mensagens_enviadas: number | null
        }
        Insert: {
          aluno_id: string
          data?: string
          id?: string
          limite_maximo?: number | null
          mensagens_enviadas?: number | null
        }
        Update: {
          aluno_id?: string
          data?: string
          id?: string
          limite_maximo?: number | null
          mensagens_enviadas?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "jequiia_chat_limite_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "jequiia_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jequiia_chat_limite_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "jequiia_v_progresso_materia"
            referencedColumns: ["aluno_id"]
          },
          {
            foreignKeyName: "jequiia_chat_limite_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "jequiia_v_ranking_semanal"
            referencedColumns: ["id"]
          },
        ]
      }
      jequiia_chat_mensagens: {
        Row: {
          aluno_id: string
          audio_url: string | null
          conteudo: string
          created_at: string | null
          doc_ids_citados: string[] | null
          id: string
          role: string
          sessao_id: string
          tokens_usados: number | null
        }
        Insert: {
          aluno_id: string
          audio_url?: string | null
          conteudo: string
          created_at?: string | null
          doc_ids_citados?: string[] | null
          id?: string
          role: string
          sessao_id: string
          tokens_usados?: number | null
        }
        Update: {
          aluno_id?: string
          audio_url?: string | null
          conteudo?: string
          created_at?: string | null
          doc_ids_citados?: string[] | null
          id?: string
          role?: string
          sessao_id?: string
          tokens_usados?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "jequiia_chat_mensagens_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "jequiia_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jequiia_chat_mensagens_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "jequiia_v_progresso_materia"
            referencedColumns: ["aluno_id"]
          },
          {
            foreignKeyName: "jequiia_chat_mensagens_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "jequiia_v_ranking_semanal"
            referencedColumns: ["id"]
          },
        ]
      }
      jequiia_conquistas: {
        Row: {
          categoria: string | null
          codigo: string
          condicao: Json
          descricao: string | null
          icone: string | null
          id: string
          nome: string
          ordem: number | null
          xp_bonus: number | null
        }
        Insert: {
          categoria?: string | null
          codigo: string
          condicao: Json
          descricao?: string | null
          icone?: string | null
          id?: string
          nome: string
          ordem?: number | null
          xp_bonus?: number | null
        }
        Update: {
          categoria?: string | null
          codigo?: string
          condicao?: Json
          descricao?: string | null
          icone?: string | null
          id?: string
          nome?: string
          ordem?: number | null
          xp_bonus?: number | null
        }
        Relationships: []
      }
      jequiia_desafio_diario: {
        Row: {
          created_at: string | null
          data: string
          id: string
          materias_incluidas: string[] | null
          questoes: Json
        }
        Insert: {
          created_at?: string | null
          data?: string
          id?: string
          materias_incluidas?: string[] | null
          questoes: Json
        }
        Update: {
          created_at?: string | null
          data?: string
          id?: string
          materias_incluidas?: string[] | null
          questoes?: Json
        }
        Relationships: []
      }
      jequiia_desafio_respostas: {
        Row: {
          acertos: number
          aluno_id: string
          completado_em: string | null
          desafio_id: string
          id: string
          tempo_segundos: number | null
          xp_ganho: number | null
        }
        Insert: {
          acertos: number
          aluno_id: string
          completado_em?: string | null
          desafio_id: string
          id?: string
          tempo_segundos?: number | null
          xp_ganho?: number | null
        }
        Update: {
          acertos?: number
          aluno_id?: string
          completado_em?: string | null
          desafio_id?: string
          id?: string
          tempo_segundos?: number | null
          xp_ganho?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "jequiia_desafio_respostas_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "jequiia_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jequiia_desafio_respostas_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "jequiia_v_progresso_materia"
            referencedColumns: ["aluno_id"]
          },
          {
            foreignKeyName: "jequiia_desafio_respostas_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "jequiia_v_ranking_semanal"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jequiia_desafio_respostas_desafio_id_fkey"
            columns: ["desafio_id"]
            isOneToOne: false
            referencedRelation: "jequiia_desafio_diario"
            referencedColumns: ["id"]
          },
        ]
      }
      jequiia_escolas: {
        Row: {
          ativa: boolean | null
          cidade: string | null
          codigo_inep: string | null
          created_at: string | null
          id: string
          nome: string
          uf: string | null
        }
        Insert: {
          ativa?: boolean | null
          cidade?: string | null
          codigo_inep?: string | null
          created_at?: string | null
          id?: string
          nome: string
          uf?: string | null
        }
        Update: {
          ativa?: boolean | null
          cidade?: string | null
          codigo_inep?: string | null
          created_at?: string | null
          id?: string
          nome?: string
          uf?: string | null
        }
        Relationships: []
      }
      jequiia_materias: {
        Row: {
          ativa: boolean | null
          cor_tema: string | null
          icone: string | null
          id: string
          nome: string
          ordem: number | null
          slug: string
        }
        Insert: {
          ativa?: boolean | null
          cor_tema?: string | null
          icone?: string | null
          id?: string
          nome: string
          ordem?: number | null
          slug: string
        }
        Update: {
          ativa?: boolean | null
          cor_tema?: string | null
          icone?: string | null
          id?: string
          nome?: string
          ordem?: number | null
          slug?: string
        }
        Relationships: []
      }
      jequiia_niveis: {
        Row: {
          beneficio: string | null
          nivel: number
          nome: string
          xp_maximo: number
          xp_minimo: number
        }
        Insert: {
          beneficio?: string | null
          nivel: number
          nome: string
          xp_maximo: number
          xp_minimo: number
        }
        Update: {
          beneficio?: string | null
          nivel?: number
          nome?: string
          xp_maximo?: number
          xp_minimo?: number
        }
        Relationships: []
      }
      jequiia_profiles: {
        Row: {
          avatar_config: Json | null
          consentimento_data: string | null
          consentimento_responsavel: boolean | null
          created_at: string | null
          email_responsavel: string | null
          escola_id: string | null
          id: string
          nivel: number | null
          nome: string
          streak_atual: number | null
          streak_max: number | null
          tipo: string
          turma: string | null
          ultima_atividade: string | null
          updated_at: string | null
          xp_total: number | null
        }
        Insert: {
          avatar_config?: Json | null
          consentimento_data?: string | null
          consentimento_responsavel?: boolean | null
          created_at?: string | null
          email_responsavel?: string | null
          escola_id?: string | null
          id: string
          nivel?: number | null
          nome: string
          streak_atual?: number | null
          streak_max?: number | null
          tipo: string
          turma?: string | null
          ultima_atividade?: string | null
          updated_at?: string | null
          xp_total?: number | null
        }
        Update: {
          avatar_config?: Json | null
          consentimento_data?: string | null
          consentimento_responsavel?: boolean | null
          created_at?: string | null
          email_responsavel?: string | null
          escola_id?: string | null
          id?: string
          nivel?: number | null
          nome?: string
          streak_atual?: number | null
          streak_max?: number | null
          tipo?: string
          turma?: string | null
          ultima_atividade?: string | null
          updated_at?: string | null
          xp_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "jequiia_profiles_escola_id_fkey"
            columns: ["escola_id"]
            isOneToOne: false
            referencedRelation: "jequiia_escolas"
            referencedColumns: ["id"]
          },
        ]
      }
      jequiia_progresso: {
        Row: {
          acertos_total: number | null
          aluno_id: string
          concluida: boolean | null
          id: string
          percentual_acerto: number | null
          questoes_total: number | null
          quizzes_feitos: number | null
          ultima_atividade: string | null
          unidade_id: string
        }
        Insert: {
          acertos_total?: number | null
          aluno_id: string
          concluida?: boolean | null
          id?: string
          percentual_acerto?: number | null
          questoes_total?: number | null
          quizzes_feitos?: number | null
          ultima_atividade?: string | null
          unidade_id: string
        }
        Update: {
          acertos_total?: number | null
          aluno_id?: string
          concluida?: boolean | null
          id?: string
          percentual_acerto?: number | null
          questoes_total?: number | null
          quizzes_feitos?: number | null
          ultima_atividade?: string | null
          unidade_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jequiia_progresso_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "jequiia_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jequiia_progresso_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "jequiia_v_progresso_materia"
            referencedColumns: ["aluno_id"]
          },
          {
            foreignKeyName: "jequiia_progresso_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "jequiia_v_ranking_semanal"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jequiia_progresso_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "jequiia_unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      jequiia_quizzes: {
        Row: {
          acertos: number | null
          aluno_id: string
          created_at: string | null
          dificuldade_media: number | null
          finalizado: boolean | null
          id: string
          questoes: Json
          questoes_respondidas: number | null
          tempo_fim: string | null
          tempo_inicio: string | null
          tipo: string | null
          total_questoes: number
          unidade_id: string
          xp_ganho: number | null
        }
        Insert: {
          acertos?: number | null
          aluno_id: string
          created_at?: string | null
          dificuldade_media?: number | null
          finalizado?: boolean | null
          id?: string
          questoes: Json
          questoes_respondidas?: number | null
          tempo_fim?: string | null
          tempo_inicio?: string | null
          tipo?: string | null
          total_questoes: number
          unidade_id: string
          xp_ganho?: number | null
        }
        Update: {
          acertos?: number | null
          aluno_id?: string
          created_at?: string | null
          dificuldade_media?: number | null
          finalizado?: boolean | null
          id?: string
          questoes?: Json
          questoes_respondidas?: number | null
          tempo_fim?: string | null
          tempo_inicio?: string | null
          tipo?: string | null
          total_questoes?: number
          unidade_id?: string
          xp_ganho?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "jequiia_quizzes_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "jequiia_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jequiia_quizzes_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "jequiia_v_progresso_materia"
            referencedColumns: ["aluno_id"]
          },
          {
            foreignKeyName: "jequiia_quizzes_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "jequiia_v_ranking_semanal"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jequiia_quizzes_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "jequiia_unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      jequiia_respostas: {
        Row: {
          acertou: boolean
          alternativas: Json | null
          aluno_id: string
          bncc_habilidade: string | null
          created_at: string | null
          doc_id_fonte: string | null
          id: string
          questao_index: number
          questao_texto: string
          quiz_id: string
          resposta_aluno: string | null
          resposta_correta: string | null
          tags: string[] | null
          tempo_resposta_segundos: number | null
        }
        Insert: {
          acertou: boolean
          alternativas?: Json | null
          aluno_id: string
          bncc_habilidade?: string | null
          created_at?: string | null
          doc_id_fonte?: string | null
          id?: string
          questao_index: number
          questao_texto: string
          quiz_id: string
          resposta_aluno?: string | null
          resposta_correta?: string | null
          tags?: string[] | null
          tempo_resposta_segundos?: number | null
        }
        Update: {
          acertou?: boolean
          alternativas?: Json | null
          aluno_id?: string
          bncc_habilidade?: string | null
          created_at?: string | null
          doc_id_fonte?: string | null
          id?: string
          questao_index?: number
          questao_texto?: string
          quiz_id?: string
          resposta_aluno?: string | null
          resposta_correta?: string | null
          tags?: string[] | null
          tempo_resposta_segundos?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "jequiia_respostas_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "jequiia_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jequiia_respostas_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "jequiia_v_progresso_materia"
            referencedColumns: ["aluno_id"]
          },
          {
            foreignKeyName: "jequiia_respostas_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "jequiia_v_ranking_semanal"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jequiia_respostas_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "jequiia_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      jequiia_revisao: {
        Row: {
          aluno_id: string
          bncc_habilidade: string | null
          created_at: string | null
          data_revisao: string
          doc_id: string | null
          id: string
          resposta_errada_id: string
          revisada: boolean | null
        }
        Insert: {
          aluno_id: string
          bncc_habilidade?: string | null
          created_at?: string | null
          data_revisao: string
          doc_id?: string | null
          id?: string
          resposta_errada_id: string
          revisada?: boolean | null
        }
        Update: {
          aluno_id?: string
          bncc_habilidade?: string | null
          created_at?: string | null
          data_revisao?: string
          doc_id?: string | null
          id?: string
          resposta_errada_id?: string
          revisada?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "jequiia_revisao_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "jequiia_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jequiia_revisao_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "jequiia_v_progresso_materia"
            referencedColumns: ["aluno_id"]
          },
          {
            foreignKeyName: "jequiia_revisao_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "jequiia_v_ranking_semanal"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jequiia_revisao_resposta_errada_id_fkey"
            columns: ["resposta_errada_id"]
            isOneToOne: false
            referencedRelation: "jequiia_respostas"
            referencedColumns: ["id"]
          },
        ]
      }
      jequiia_unidades: {
        Row: {
          ativa: boolean | null
          bncc_codigo: string | null
          descricao: string | null
          doc_ids_vector_store: string[] | null
          id: string
          materia_id: string
          nome: string
          ordem: number | null
          slug: string
        }
        Insert: {
          ativa?: boolean | null
          bncc_codigo?: string | null
          descricao?: string | null
          doc_ids_vector_store?: string[] | null
          id?: string
          materia_id: string
          nome: string
          ordem?: number | null
          slug: string
        }
        Update: {
          ativa?: boolean | null
          bncc_codigo?: string | null
          descricao?: string | null
          doc_ids_vector_store?: string[] | null
          id?: string
          materia_id?: string
          nome?: string
          ordem?: number | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "jequiia_unidades_materia_id_fkey"
            columns: ["materia_id"]
            isOneToOne: false
            referencedRelation: "jequiia_materias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jequiia_unidades_materia_id_fkey"
            columns: ["materia_id"]
            isOneToOne: false
            referencedRelation: "jequiia_v_progresso_materia"
            referencedColumns: ["materia_id"]
          },
        ]
      }
      mila_debates_historico_chats: {
        Row: {
          created_at: string | null
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      mila_debates_interacoes: {
        Row: {
          avaliacao_justificativa: string | null
          created_at: string | null
          id: string
          nota_qualidade: number | null
          pergunta: string
          phone: string
          resposta: string
          tipo_mensagem: string | null
          usuario_id: string | null
        }
        Insert: {
          avaliacao_justificativa?: string | null
          created_at?: string | null
          id?: string
          nota_qualidade?: number | null
          pergunta: string
          phone: string
          resposta: string
          tipo_mensagem?: string | null
          usuario_id?: string | null
        }
        Update: {
          avaliacao_justificativa?: string | null
          created_at?: string | null
          id?: string
          nota_qualidade?: number | null
          pergunta?: string
          phone?: string
          resposta?: string
          tipo_mensagem?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interacoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "mila_debates_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      mila_debates_usuarios: {
        Row: {
          created_at: string | null
          id: string
          phone: string
          push_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          phone: string
          push_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          phone?: string
          push_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sibem_chat_histories: {
        Row: {
          created_at: string | null
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      sibem_gestores: {
        Row: {
          ativo: boolean | null
          cargo: string | null
          created_at: string | null
          email: string
          id: string
          nome: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ativo?: boolean | null
          cargo?: string | null
          created_at?: string | null
          email: string
          id?: string
          nome: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ativo?: boolean | null
          cargo?: string | null
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      sibem_interacoes: {
        Row: {
          avaliacao_justificativa: string | null
          categoria: string | null
          created_at: string | null
          id: string
          nota_qualidade: number | null
          pergunta: string
          phone: string
          resposta: string
          tipo_mensagem: string | null
          usuario_id: string | null
        }
        Insert: {
          avaliacao_justificativa?: string | null
          categoria?: string | null
          created_at?: string | null
          id?: string
          nota_qualidade?: number | null
          pergunta: string
          phone: string
          resposta: string
          tipo_mensagem?: string | null
          usuario_id?: string | null
        }
        Update: {
          avaliacao_justificativa?: string | null
          categoria?: string | null
          created_at?: string | null
          id?: string
          nota_qualidade?: number | null
          pergunta?: string
          phone?: string
          resposta?: string
          tipo_mensagem?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sibem_interacoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "sibem_usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sibem_interacoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "sibem_vw_usuarios_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      sibem_usuarios: {
        Row: {
          created_at: string | null
          id: string
          phone: string
          push_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          phone: string
          push_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          phone?: string
          push_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      fpobserva_vw_comentaristas_multiplos: {
        Row: {
          classificacao: string | null
          nome_perfil: string | null
          perfis_comentados: string[] | null
          plataforma: string | null
          qtd_perfis: number | null
          total_comentarios: number | null
        }
        Insert: {
          classificacao?: string | null
          nome_perfil?: string | null
          perfis_comentados?: string[] | null
          plataforma?: string | null
          qtd_perfis?: never
          total_comentarios?: number | null
        }
        Update: {
          classificacao?: string | null
          nome_perfil?: string | null
          perfis_comentados?: string[] | null
          plataforma?: string | null
          qtd_perfis?: never
          total_comentarios?: number | null
        }
        Relationships: []
      }
      fpobserva_vw_comentaristas_novos: {
        Row: {
          nomes: string[] | null
          novos_comentaristas: number | null
          plataforma: string | null
          semana_primeira_aparicao: string | null
        }
        Relationships: []
      }
      fpobserva_vw_comentaristas_por_perfil: {
        Row: {
          comentaristas_ultima_semana: number | null
          perfil_monitorado: string | null
          total_comentaristas: number | null
        }
        Relationships: []
      }
      fpobserva_vw_comentaristas_resumo: {
        Row: {
          adversarios: number | null
          aliados: number | null
          comentam_multiplos_perfis: number | null
          comentaristas_fieis: number | null
          indefinidos: number | null
          neutros: number | null
          novos_ultima_semana: number | null
          total_comentaristas: number | null
        }
        Relationships: []
      }
      fpobserva_vw_dashboard_resumo: {
        Row: {
          engajamento_total: number | null
          media_por_post: number | null
          posts_hoje: number | null
          posts_semana: number | null
          semana_referencia: string | null
        }
        Relationships: []
      }
      fpobserva_vw_engajamento_historico: {
        Row: {
          cor_grafico: string | null
          data_coleta: string | null
          engajamento_acumulado: number | null
          nome: string | null
          perfil_id: string | null
          semana_ano: string | null
          tipo: string | null
        }
        Relationships: []
      }
      fpobserva_vw_engajamento_por_tema: {
        Row: {
          engajamento_medio: number | null
          perfil: string | null
          tema: string | null
          total_posts: number | null
        }
        Relationships: []
      }
      fpobserva_vw_engajamento_por_tipo: {
        Row: {
          engajamento_medio: number | null
          engajamento_total: number | null
          perfil: string | null
          tipo: string | null
          total_posts: number | null
        }
        Relationships: []
      }
      fpobserva_vw_frequencia_postagem: {
        Row: {
          dia_numero: number | null
          dia_semana: string | null
          engajamento_medio: number | null
          perfil: string | null
          total_posts: number | null
        }
        Relationships: []
      }
      fpobserva_vw_inteligencia_campanha: {
        Row: {
          categoria_estrategica: string | null
          conteudo_texto: string | null
          data_publicacao: string | null
          engajamento: number | null
          id: string | null
          mencoes: string[] | null
          notas_campanha: string | null
          perfil: string | null
          relevancia_campanha: string | null
          subcategoria: string | null
          tipo_informacao: string | null
        }
        Relationships: []
      }
      fpobserva_vw_mencoes_ebserh: {
        Row: {
          categoria_estrategica: string | null
          comentarios: number | null
          compartilhamentos: number | null
          conteudo_texto: string | null
          curtidas: number | null
          data_publicacao: string | null
          engajamento_total: number | null
          id: string | null
          notas_campanha: string | null
          perfil_id: string | null
          perfil_nome: string | null
          perfil_tipo: string | null
          plataforma: string | null
          relevancia_campanha: string | null
          sentimento: string | null
          subcategoria: string | null
          tipo_mencao_ebserh: string | null
          tipo_post: string | null
          tom_ebserh: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fpobserva_posts_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fpobserva_posts_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_vw_engajamento_historico"
            referencedColumns: ["perfil_id"]
          },
          {
            foreignKeyName: "fpobserva_posts_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_vw_resumo_semanal"
            referencedColumns: ["perfil_id"]
          },
        ]
      }
      fpobserva_vw_mencoes_reitoria: {
        Row: {
          alcance: number | null
          categoria_estrategica: string | null
          coleta_id: string | null
          comentarios: number | null
          compartilhamentos: number | null
          conteudo_texto: string | null
          created_at: string | null
          curtidas: number | null
          data_publicacao: string | null
          destaque: boolean | null
          engajamento_total: number | null
          id: string | null
          menciona_antonio: boolean | null
          menciona_fabio: boolean | null
          menciona_reitoria: boolean | null
          mencoes: string[] | null
          notas_campanha: string | null
          perfil_id: string | null
          perfil_nome: string | null
          perfil_tipo: string | null
          plataforma: string | null
          relevancia_campanha: string | null
          sentimento: string | null
          subcategoria: string | null
          tema: string | null
          tipo: string | null
          tipo_informacao: string | null
          url_midia: string | null
          url_post: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fpobserva_posts_coleta_id_fkey"
            columns: ["coleta_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_coletas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fpobserva_posts_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fpobserva_posts_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_vw_engajamento_historico"
            referencedColumns: ["perfil_id"]
          },
          {
            foreignKeyName: "fpobserva_posts_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_vw_resumo_semanal"
            referencedColumns: ["perfil_id"]
          },
        ]
      }
      fpobserva_vw_posicionamento_ebserh: {
        Row: {
          mencoes_criticas: number | null
          mencoes_favoraveis: number | null
          mencoes_neutras: number | null
          perfil_nome: string | null
          perfil_tipo: string | null
          posicao_predominante: string | null
          total_mencoes: number | null
          ultima_mencao: string | null
        }
        Relationships: []
      }
      fpobserva_vw_posts_ultima_semana: {
        Row: {
          alcance: number | null
          coleta_id: string | null
          comentarios: number | null
          compartilhamentos: number | null
          conteudo_texto: string | null
          cor_grafico: string | null
          created_at: string | null
          curtidas: number | null
          data_publicacao: string | null
          destaque: boolean | null
          engajamento_total: number | null
          id: string | null
          perfil_id: string | null
          perfil_nome: string | null
          perfil_tipo: string | null
          plataforma: string | null
          sentimento: string | null
          tema: string | null
          tipo: string | null
          url_midia: string | null
          url_post: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fpobserva_posts_coleta_id_fkey"
            columns: ["coleta_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_coletas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fpobserva_posts_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fpobserva_posts_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_vw_engajamento_historico"
            referencedColumns: ["perfil_id"]
          },
          {
            foreignKeyName: "fpobserva_posts_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_vw_resumo_semanal"
            referencedColumns: ["perfil_id"]
          },
        ]
      }
      fpobserva_vw_ranking_posts: {
        Row: {
          alcance: number | null
          coleta_id: string | null
          comentarios: number | null
          compartilhamentos: number | null
          conteudo_texto: string | null
          created_at: string | null
          curtidas: number | null
          data_publicacao: string | null
          destaque: boolean | null
          engajamento_total: number | null
          id: string | null
          perfil_id: string | null
          perfil_nome: string | null
          perfil_tipo: string | null
          plataforma: string | null
          ranking: number | null
          sentimento: string | null
          tema: string | null
          tipo: string | null
          url_midia: string | null
          url_post: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fpobserva_posts_coleta_id_fkey"
            columns: ["coleta_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_coletas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fpobserva_posts_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fpobserva_posts_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_vw_engajamento_historico"
            referencedColumns: ["perfil_id"]
          },
          {
            foreignKeyName: "fpobserva_posts_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "fpobserva_vw_resumo_semanal"
            referencedColumns: ["perfil_id"]
          },
        ]
      }
      fpobserva_vw_renovacao_comentaristas: {
        Row: {
          novos_comentaristas: number | null
          perfil: string | null
          recorrentes: number | null
          semana: string | null
          taxa_renovacao_pct: number | null
          total_comentaristas: number | null
        }
        Relationships: []
      }
      fpobserva_vw_resumo_ebserh: {
        Row: {
          engajamento_medio: number | null
          engajamento_total: number | null
          mencoes_contrato: number | null
          mencoes_gestao: number | null
          mencoes_servicos: number | null
          mencoes_trabalhadores: number | null
          semana: string | null
          tom_critico: number | null
          tom_favoravel: number | null
          tom_neutro: number | null
          total_mencoes: number | null
        }
        Relationships: []
      }
      fpobserva_vw_resumo_semanal: {
        Row: {
          cor_grafico: string | null
          data_coleta: string | null
          engajamento_semana: number | null
          nome: string | null
          perfil_id: string | null
          posts_semana: number | null
          seguidores: number | null
          seguidores_anterior: number | null
          semana_ano: string | null
          tipo: string | null
          variacao_seguidores: number | null
        }
        Relationships: []
      }
      fpobserva_vw_score_semanal: {
        Row: {
          engajamento_medio: number | null
          engajamento_total: number | null
          perfil: string | null
          perfil_tipo: string | null
          semana: string | null
          total_posts: number | null
        }
        Relationships: []
      }
      fpobserva_vw_top_comentaristas: {
        Row: {
          classificacao: string | null
          dias_ativo: number | null
          nome_perfil: string | null
          perfis_comentados: string[] | null
          plataforma: string | null
          primeira_aparicao: string | null
          total_comentarios: number | null
          ultima_aparicao: string | null
        }
        Relationships: []
      }
      jequiia_v_dashboard_professor: {
        Row: {
          alunos_ativos_7d: number | null
          alunos_inativos: number | null
          escola_id: string | null
          media_nivel: number | null
          media_streak: number | null
          media_xp: number | null
          total_alunos: number | null
          turma: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jequiia_profiles_escola_id_fkey"
            columns: ["escola_id"]
            isOneToOne: false
            referencedRelation: "jequiia_escolas"
            referencedColumns: ["id"]
          },
        ]
      }
      jequiia_v_progresso_materia: {
        Row: {
          aluno_id: string | null
          cor_tema: string | null
          icone: string | null
          materia_id: string | null
          materia_nome: string | null
          materia_slug: string | null
          media_acerto: number | null
          quizzes_total: number | null
          unidades_iniciadas: number | null
          unidades_total: number | null
        }
        Relationships: []
      }
      jequiia_v_ranking_semanal: {
        Row: {
          avatar_config: Json | null
          escola_id: string | null
          id: string | null
          nivel: number | null
          nome: string | null
          posicao: number | null
          quizzes_semana: number | null
          turma: string | null
          xp_semana: number | null
        }
        Relationships: [
          {
            foreignKeyName: "jequiia_profiles_escola_id_fkey"
            columns: ["escola_id"]
            isOneToOne: false
            referencedRelation: "jequiia_escolas"
            referencedColumns: ["id"]
          },
        ]
      }
      sibem_vw_categorias: {
        Row: {
          categoria: string | null
          percentual: number | null
          total: number | null
        }
        Relationships: []
      }
      sibem_vw_distribuicao_notas: {
        Row: {
          faixa: string | null
          ordem: number | null
          quantidade: number | null
        }
        Relationships: []
      }
      sibem_vw_horarios: {
        Row: {
          dia_semana: number | null
          hora: number | null
          total: number | null
        }
        Relationships: []
      }
      sibem_vw_interacoes_por_dia: {
        Row: {
          data: string | null
          media_nota: number | null
          total: number | null
          total_audio: number | null
          total_imagem: number | null
          total_texto: number | null
          total_texto_ext: number | null
        }
        Relationships: []
      }
      sibem_vw_metricas: {
        Row: {
          interacoes_7dias: number | null
          interacoes_hoje: number | null
          interacoes_nota_baixa: number | null
          media_qualidade: number | null
          total_interacoes: number | null
          total_usuarios: number | null
          usuarios_ativos_7dias: number | null
        }
        Relationships: []
      }
      sibem_vw_tipos_por_dia: {
        Row: {
          audio: number | null
          data: string | null
          imagem: number | null
          texto: number | null
          texto_extendido: number | null
          total: number | null
        }
        Relationships: []
      }
      sibem_vw_usuarios_stats: {
        Row: {
          created_at: string | null
          id: string | null
          media_qualidade: number | null
          phone: string | null
          push_name: string | null
          total_interacoes: number | null
          ultima_interacao: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_active_gestor: { Args: { _user_id: string }; Returns: boolean }
      is_fpobserva_admin: { Args: never; Returns: boolean }
      is_fpobserva_user: { Args: never; Returns: boolean }
      jequiia_atualizar_progresso: {
        Args: {
          p_acertos: number
          p_aluno_id: string
          p_total: number
          p_unidade_id: string
        }
        Returns: undefined
      }
      jequiia_desbloquear_conquista: {
        Args: { p_aluno_id: string; p_conquista_id: string }
        Returns: undefined
      }
      jequiia_incrementar_xp: {
        Args: { aluno_uuid: string; xp_add: number }
        Returns: undefined
      }
      jequiia_registrar_mensagem_chat: {
        Args: { p_aluno_id: string }
        Returns: undefined
      }
      jequiia_verificar_conquistas: {
        Args: { p_aluno_id: string }
        Returns: {
          codigo: string
          conquista_id: string
          icone: string
          nome: string
          xp_bonus: number
        }[]
      }
      sibem_cadastrar_gestor: {
        Args: {
          p_cargo?: string
          p_email: string
          p_nome: string
          p_user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
