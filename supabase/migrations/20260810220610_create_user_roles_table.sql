-- Cria a tabela public.user_roles (sem policies ainda).
-- Criado em: 20260810220610
--
-- Contexto: assim como public.app_role e public.can_manage_profiles, esta
-- tabela nunca foi criada por nenhuma migration local — existia apenas
-- porque foi criada direto no dashboard do Supabase.
--
-- Ordem importa: precisa existir ANTES de can_manage_profiles (funções
-- LANGUAGE sql validam as tabelas referenciadas no momento da criação) e
-- antes de user_roles_policies.sql, que define RLS e policies sobre ela.

BEGIN;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       public.app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Impede papel duplicado para o mesmo usuário; necessário para o upsert do hook.
CREATE UNIQUE INDEX IF NOT EXISTS user_roles_user_id_role_unique
  ON public.user_roles (user_id, role);

CREATE INDEX IF NOT EXISTS user_roles_user_id_idx ON public.user_roles (user_id);

COMMIT;
