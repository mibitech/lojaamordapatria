-- Login por CIM/senha: força troca da senha inicial (6 primeiros dígitos do CPF)
-- no primeiro acesso, já que essa senha é derivada de um dado semi-público.

BEGIN;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.profiles.must_change_password IS
  'true quando o membro ainda usa a senha inicial (6 primeiros dígitos do CPF) e precisa trocá-la no próximo acesso.';

COMMIT;
