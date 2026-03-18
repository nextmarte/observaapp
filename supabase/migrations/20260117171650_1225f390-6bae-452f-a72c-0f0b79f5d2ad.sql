-- Fix overly permissive RLS policies by adding service_role checks

-- 1. sibem_usuarios - Fix INSERT and UPDATE policies
DROP POLICY IF EXISTS "sibem_service_insert_usuarios" ON public.sibem_usuarios;
CREATE POLICY "sibem_service_insert_usuarios" ON public.sibem_usuarios
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "sibem_service_update_usuarios" ON public.sibem_usuarios;
CREATE POLICY "sibem_service_update_usuarios" ON public.sibem_usuarios
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- 2. mila_debates_usuarios - Fix INSERT and UPDATE policies
DROP POLICY IF EXISTS "service_insert_mila_usuarios" ON public.mila_debates_usuarios;
CREATE POLICY "service_insert_mila_usuarios" ON public.mila_debates_usuarios
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "service_update_mila_usuarios" ON public.mila_debates_usuarios;
CREATE POLICY "service_update_mila_usuarios" ON public.mila_debates_usuarios
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- 3. mila_debates_historico_chats - Fix INSERT policy
DROP POLICY IF EXISTS "service_insert_mila_historico" ON public.mila_debates_historico_chats;
CREATE POLICY "service_insert_mila_historico" ON public.mila_debates_historico_chats
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- 4. sibem_chat_histories - Fix INSERT policy
DROP POLICY IF EXISTS "sibem_service_insert_histories" ON public.sibem_chat_histories;
CREATE POLICY "sibem_service_insert_histories" ON public.sibem_chat_histories
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- 5. sibem_interacoes - Fix INSERT policy
DROP POLICY IF EXISTS "sibem_service_insert_interacoes" ON public.sibem_interacoes;
CREATE POLICY "sibem_service_insert_interacoes" ON public.sibem_interacoes
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- 6. mila_debates_interacoes - Fix INSERT policy
DROP POLICY IF EXISTS "service_insert_mila_interacoes" ON public.mila_debates_interacoes;
CREATE POLICY "service_insert_mila_interacoes" ON public.mila_debates_interacoes
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- 7. jequiia_progresso - Fix ALL operations policy
DROP POLICY IF EXISTS "jequiia_progresso_service_all" ON public.jequiia_progresso;
CREATE POLICY "jequiia_progresso_service_all" ON public.jequiia_progresso
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 8. jequiia_audit_log - Fix INSERT policy
DROP POLICY IF EXISTS "audit_log_service_insert" ON public.jequiia_audit_log;
CREATE POLICY "audit_log_service_insert" ON public.jequiia_audit_log
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');