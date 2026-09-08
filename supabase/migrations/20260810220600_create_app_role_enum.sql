-- Cria o enum public.app_role, usado por user_roles.role.
-- Criado em: 20260810220600
--
-- Contexto: assim como public.user_roles, este enum nunca foi criado por
-- nenhuma migration local — existia apenas porque foi criado direto no
-- dashboard do Supabase. Sem esta migration o schema não é reproduzível:
-- restaurar o projeto ou criar uma base nova falha em user_roles_policies.sql.

BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'member', 'commission_member');
  END IF;
END $$;

COMMIT;
