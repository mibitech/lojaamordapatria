-- Cria public.can_manage_profiles, usada pelas policies de user_roles e profiles.
-- Criado em: 20260810220620
--
-- Contexto: esta função nunca foi criada por nenhuma migration local com
-- CREATE (só há CREATE OR REPLACE em migrations posteriores) — existia
-- apenas porque foi criada direto no dashboard do Supabase.
--
-- Nesta posição da timeline a coluna ainda se chama is_commission_member;
-- rename_is_commission_member.sql reaplica a função com is_director_member.

BEGIN;

CREATE OR REPLACE FUNCTION public.can_manage_profiles(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND ur.role IN ('admin', 'commission_member')
  ) OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = _user_id
      AND p.is_commission_member = true
  );
$$;

REVOKE EXECUTE ON FUNCTION public.can_manage_profiles(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_manage_profiles(UUID) TO authenticated;

COMMIT;
