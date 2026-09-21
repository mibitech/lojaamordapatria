-- Diretorias históricas da Loja Amor da Pátria nº 1.928 (Bragança Paulista),
-- sétimo bloco do quadro impresso: 1959/1960 a 1962/1963.
--
-- Grafias normalizadas entre quadros, mesma pessoa:
--   "João da Costa Munis"    -> "João da Costa Muniz"
--   "Saturnino Paccitti"     -> "Saturnino Pacitti"
--   "José Umberto Aricó"     -> "José Humberto Aricó"
--   "Rivail Celeste"         -> "Rivair Celeste"  (corrige 1956 e 1958,
--                               ver UPDATE ao final)
--
-- worshipful_masters não tem unicidade por ano, então a idempotência vem de
-- NOT EXISTS em vez de ON CONFLICT.

BEGIN;

INSERT INTO public.worshipful_masters
  (name, installation_year, term_start_date, term_end_date, bio, is_active, sort_order)
SELECT v.name, v.installation_year, v.term_start_date, v.term_end_date, v.bio, false, v.installation_year
FROM (VALUES
  ('Dr. João Marcilio',             1959, DATE '1959-05-25', DATE '1960-05-25',
   'Posse em 25 de maio de 1959.'),
  ('George Grunnupp',               1960, DATE '1960-05-23', DATE '1961-05-23',
   'Posse em 23 de maio de 1960.'),
  ('George Grunnupp',               1961, DATE '1961-04-10', DATE '1962-04-10',
   'Posse em 10 de abril de 1961.'),
  ('Cícero Bulcão Siqueira Torres', 1962, DATE '1962-06-14', DATE '1963-06-14',
   'Posse em 14 de junho de 1962.')
) AS v(name, installation_year, term_start_date, term_end_date, bio)
WHERE NOT EXISTS (
  SELECT 1 FROM public.worshipful_masters m
   WHERE m.installation_year = v.installation_year
);

-- Oficiais por gestão. person_name é a origem correta aqui: nenhum destes
-- irmãos consta do quadro atual de membros.
-- sort_order acompanha a posição do cargo em OFFICER_POSITIONS.
INSERT INTO public.worshipful_master_officers (master_id, position, person_name, sort_order)
SELECT
  m.id,
  d.position::public.officer_position,
  d.person_name,
  d.sort_order
FROM (VALUES
  -- 1959/1960 — posse em 25/05/1959
  (1959, 'veneravel',          'Dr. João Marcilio',              0),
  (1959, 'primeiro_vigilante', 'Plinio Dall Ara',                1),
  (1959, 'segundo_vigilante',  'George Grunnupp',                2),
  (1959, 'orador',             'Juvenal Silva',                  3),
  (1959, 'secretario',         'Wilson Marcilio',                4),
  (1959, 'tesoureiro',         'Cícero Bulcão Siqueira Torres',  5),
  (1959, 'chanceler',          'Joaquim de Carvalho',            6),
  (1959, 'dep_estadual',       'George Grunnupp',               18),

  -- 1960/1961 — posse em 23/05/1960
  (1960, 'veneravel',          'George Grunnupp',                0),
  (1960, 'primeiro_vigilante', 'Cícero Bulcão Siqueira Torres',  1),
  (1960, 'segundo_vigilante',  'José Humberto Aricó',            2),
  (1960, 'orador',             'Wilson Marcilio',                3),
  (1960, 'secretario',         'Plinio Dall Ara',                4),
  (1960, 'tesoureiro',         'José Benedito Carvalho',         5),
  (1960, 'chanceler',          'João da Costa Muniz',            6),
  (1960, 'dep_estadual',       'Dr. João Marcilio',             18),
  (1960, 'dep_federal',        'George Grunnupp',               16),

  -- 1961/1962 — posse em 10/04/1961
  (1961, 'veneravel',          'George Grunnupp',                0),
  (1961, 'primeiro_vigilante', 'Wilson Marcilio',                1),
  (1961, 'segundo_vigilante',  'Cícero Bulcão Siqueira Torres',  2),
  (1961, 'orador',             'Plinio Dall Ara',                3),
  (1961, 'secretario',         'Juvenal Silva',                  4),
  (1961, 'tesoureiro',         'José Ferreira Machado',          5),
  (1961, 'chanceler',          'João da Costa Muniz',            6),
  (1961, 'dep_estadual',       'Plinio Dall Ara',               18),
  (1961, 'dep_federal',        'George Grunnupp',               16),

  -- 1962/1963 — posse em 14/06/1962
  (1962, 'veneravel',          'Cícero Bulcão Siqueira Torres',  0),
  (1962, 'primeiro_vigilante', 'Plinio Dall Ara',                1),
  (1962, 'segundo_vigilante',  'Saturnino Pacitti',              2),
  (1962, 'orador',             'Juvenal Silva',                  3),
  (1962, 'secretario',         'José Ferreira Machado',          4),
  (1962, 'tesoureiro',         'Rivair Celeste',                 5),
  (1962, 'chanceler',          'João da Costa Muniz',            6),
  (1962, 'dep_estadual',       'João Batista Campos Filho',     18),
  (1962, 'dep_federal',        'George Grunnupp',               16)
) AS d(installation_year, position, person_name, sort_order)
JOIN public.worshipful_masters m ON m.installation_year = d.installation_year
ON CONFLICT (master_id, position) DO NOTHING;

-- Correção retroativa: "Rivair" adotada como forma canônica do nome.
UPDATE public.worshipful_master_officers
   SET person_name = 'Rivair Celeste'
 WHERE person_name = 'Rivail Celeste';

COMMIT;
