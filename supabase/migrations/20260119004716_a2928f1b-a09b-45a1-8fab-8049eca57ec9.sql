-- Enable RLS on all fpobserva tables that are missing it
ALTER TABLE fpobserva_alertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE fpobserva_comentarios_detalhados ENABLE ROW LEVEL SECURITY;
ALTER TABLE fpobserva_comentaristas ENABLE ROW LEVEL SECURITY;
ALTER TABLE fpobserva_posicionamentos_ebserh ENABLE ROW LEVEL SECURITY;
ALTER TABLE fpobserva_scores_semanais ENABLE ROW LEVEL SECURITY;
ALTER TABLE fpobserva_temperatura_ebserh ENABLE ROW LEVEL SECURITY;

-- Policies for fpobserva_alertas (alerts visible to authorized users)
CREATE POLICY "Usuarios autorizados podem ler alertas"
  ON fpobserva_alertas FOR SELECT
  USING (is_fpobserva_user());

CREATE POLICY "Admin pode gerenciar alertas"
  ON fpobserva_alertas FOR ALL
  USING (is_fpobserva_admin())
  WITH CHECK (is_fpobserva_admin());

-- Policies for fpobserva_comentarios_detalhados (detailed comments)
CREATE POLICY "Usuarios autorizados podem ler comentarios detalhados"
  ON fpobserva_comentarios_detalhados FOR SELECT
  USING (is_fpobserva_user());

CREATE POLICY "Admin pode gerenciar comentarios detalhados"
  ON fpobserva_comentarios_detalhados FOR ALL
  USING (is_fpobserva_admin())
  WITH CHECK (is_fpobserva_admin());

-- Policies for fpobserva_comentaristas (commenters - contains sensitive data)
CREATE POLICY "Usuarios autorizados podem ler comentaristas"
  ON fpobserva_comentaristas FOR SELECT
  USING (is_fpobserva_user());

CREATE POLICY "Admin pode gerenciar comentaristas"
  ON fpobserva_comentaristas FOR ALL
  USING (is_fpobserva_admin())
  WITH CHECK (is_fpobserva_admin());

-- Policies for fpobserva_posicionamentos_ebserh (EBSERH positions)
CREATE POLICY "Usuarios autorizados podem ler posicionamentos"
  ON fpobserva_posicionamentos_ebserh FOR SELECT
  USING (is_fpobserva_user());

CREATE POLICY "Admin pode gerenciar posicionamentos"
  ON fpobserva_posicionamentos_ebserh FOR ALL
  USING (is_fpobserva_admin())
  WITH CHECK (is_fpobserva_admin());

-- Policies for fpobserva_scores_semanais (weekly scores)
CREATE POLICY "Usuarios autorizados podem ler scores"
  ON fpobserva_scores_semanais FOR SELECT
  USING (is_fpobserva_user());

CREATE POLICY "Admin pode gerenciar scores"
  ON fpobserva_scores_semanais FOR ALL
  USING (is_fpobserva_admin())
  WITH CHECK (is_fpobserva_admin());

-- Policies for fpobserva_temperatura_ebserh (EBSERH temperature)
CREATE POLICY "Usuarios autorizados podem ler temperatura"
  ON fpobserva_temperatura_ebserh FOR SELECT
  USING (is_fpobserva_user());

CREATE POLICY "Admin pode gerenciar temperatura"
  ON fpobserva_temperatura_ebserh FOR ALL
  USING (is_fpobserva_admin())
  WITH CHECK (is_fpobserva_admin());