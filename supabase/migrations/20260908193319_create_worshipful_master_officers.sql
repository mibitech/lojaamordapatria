-- Diretoria (corpo de oficiais) por administração de Venerável Mestre.
--
-- Cada linha é um cargo de uma gestão. A pessoa pode vir de duas origens:
--   a) profile_id preenchido  -> membro do quadro; nome e foto saem de profiles
--                                e acompanham qualquer atualização do cadastro
--   b) person_name preenchido -> quem não faz (ou não faz mais) parte do quadro;
--                                nome e foto ficam guardados aqui
-- Exatamente uma das duas origens deve estar preenchida (CHECK abaixo).

BEGIN;

CREATE TYPE public.officer_position AS ENUM (
  'veneravel',
  'primeiro_vigilante',
  'segundo_vigilante',
  'orador',
  'secretario',
  'tesoureiro',
  'chanceler',
  'dep_federal',
  'dep_federal_suplente',
  'dep_estadual',
  'dep_estadual_suplente'
);

CREATE TABLE public.worshipful_master_officers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  master_id   UUID NOT NULL REFERENCES public.worshipful_masters(id) ON DELETE CASCADE,
  position    public.officer_position NOT NULL,
  profile_id  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  person_name TEXT,
  photo_url   TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- ON DELETE SET NULL em profile_id: se o perfil sumir, o cargo histórico
  -- não deve sumir junto. person_name preserva o registro nesse caso.
  CONSTRAINT officer_origem_valida CHECK (
    profile_id IS NOT NULL OR (person_name IS NOT NULL AND btrim(person_name) <> '')
  )
);

-- Um cargo não se repete dentro da mesma gestão.
CREATE UNIQUE INDEX worshipful_master_officers_master_position_unique
  ON public.worshipful_master_officers (master_id, position);

CREATE INDEX worshipful_master_officers_master_idx
  ON public.worshipful_master_officers (master_id);

CREATE INDEX worshipful_master_officers_profile_idx
  ON public.worshipful_master_officers (profile_id)
  WHERE profile_id IS NOT NULL;

ALTER TABLE public.worshipful_master_officers ENABLE ROW LEVEL SECURITY;

-- Mesmo par de policies de worshipful_masters: leitura pública, escrita restrita.
CREATE POLICY "Officers are viewable by everyone"
ON public.worshipful_master_officers
FOR SELECT
USING (true);

CREATE POLICY "Commission members can manage officers"
ON public.worshipful_master_officers
FOR ALL
TO authenticated
USING (public.can_manage_profiles(auth.uid()))
WITH CHECK (public.can_manage_profiles(auth.uid()));

COMMIT;
