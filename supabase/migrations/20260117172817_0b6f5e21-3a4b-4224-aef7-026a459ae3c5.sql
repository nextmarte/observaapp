-- Add CHECK constraints to fpobserva_alertas_config for server-side input validation

-- 1. Add constraint to ensure threshold is positive and within reasonable bounds
ALTER TABLE public.fpobserva_alertas_config 
ADD CONSTRAINT threshold_positive CHECK (threshold > 0 AND threshold < 1000000);

-- 2. Add constraint to ensure operador has valid values
ALTER TABLE public.fpobserva_alertas_config
ADD CONSTRAINT operador_valid CHECK (operador IS NULL OR operador IN ('maior_que', 'menor_que', 'igual_a', 'variacao_positiva', 'variacao_negativa'));

-- 3. Add constraint to ensure tipo_metrica has valid values
ALTER TABLE public.fpobserva_alertas_config
ADD CONSTRAINT tipo_metrica_valid CHECK (tipo_metrica IN ('engajamento_post', 'curtidas', 'comentarios', 'compartilhamentos', 'seguidores', 'posts_dia'));