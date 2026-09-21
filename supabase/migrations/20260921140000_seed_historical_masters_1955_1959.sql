-- Diretorias históricas da Loja Amor da Pátria nº 1.928 (Bragança Paulista),
-- sexto bloco do quadro impresso: 1955/1956 a 1958/1959.
--
-- Primeiros quadros com Deputado Estadual e Deputado Federal, cargos que já
-- existiam no enum (dep_estadual, dep_federal).
--
-- Grafias normalizadas entre quadros, mesma pessoa. A forma canônica é a já
-- gravada na base, exceto onde o impresso atual é mais correto — nesses casos
-- os registros anteriores são corrigidos pelos UPDATEs ao final:
--   "Andrelino Nicolau Shindivain" -> "Andrelino Nicolau Slindvaim"
--   "João da Costa Munis"          -> "João da Costa Muniz"
--   "Saturnino Paccitti"           -> "Saturnino Pacitti"
--   "Evengelino Ferreira Basteiro" -> "Evangelino Ferreira Basteiro"
--   "Antônio Sonsin"               -> "Antonio Sonsin"
--   "José Humberto Arico"          -> "José Humberto Aricó"   (corrige 1953/1954)
--   "Plinio Dll'Ara"               -> "Plinio Dall Ara"       (corrige 1953)
--
-- worshipful_masters não tem unicidade por ano, então a idempotência vem de
-- NOT EXISTS em vez de ON CONFLICT.

BEGIN;

INSERT INTO public.worshipful_masters
  (name, installation_year, term_start_date, term_end_date, bio, is_active, sort_order)
SELECT v.name, v.installation_year, v.term_start_date, v.term_end_date, v.bio, false, v.installation_year
FROM (VALUES
  ('Dr. João Marcilio', 1955, DATE '1955-06-25', DATE '1956-06-25',
   'Posse em 25 de junho de 1955.'),
  ('Dr. João Marcilio', 1956, DATE '1956-01-01', DATE '1957-01-01', NULL),
  ('Antonio Sonsin',    1957, DATE '1957-05-20', DATE '1958-05-20',
   'Posse em 20 de maio de 1957.'),
  ('Dr. João Marcilio', 1958, DATE '1958-05-26', DATE '1959-05-26',
   'Posse em 26 de maio de 1958.')
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
  -- 1955/1956 — posse em 25/06/1955
  (1955, 'veneravel',          'Dr. João Marcilio',              0),
  (1955, 'primeiro_vigilante', 'Wilson Marcilio',                1),
  (1955, 'segundo_vigilante',  'Helvetio Poletti',               2),
  (1955, 'orador',             'Plinio Dall Ara',                3),
  (1955, 'secretario',         'Floriano Milanez',               4),
  (1955, 'tesoureiro',         'Luiz Catuzzi',                   5),
  (1955, 'chanceler',          'José Humberto Aricó',            6),
  (1955, 'mestre_cerimonias',  'Vicente Manoel Aricó',          12),
  (1955, 'dep_estadual',       'Andrelino Nicolau Slindvaim',   18),
  (1955, 'dep_federal',        'Arlino João Kleim',             16),

  -- 1956/1957
  (1956, 'veneravel',          'Dr. João Marcilio',              0),
  (1956, 'primeiro_vigilante', 'Wilson Marcilio',                1),
  (1956, 'segundo_vigilante',  'Rivail Celeste',                 2),
  (1956, 'orador',             'Evangelino Ferreira Basteiro',   3),
  (1956, 'secretario',         'Cícero Bulcão Siqueira Torres',  4),
  (1956, 'tesoureiro',         'Luiz Catuzzi',                   5),
  (1956, 'chanceler',          'Plinio Dall Ara',                6),
  (1956, 'mestre_cerimonias',  'Saturnino Pacitti',             12),
  (1956, 'dep_estadual',       'Andrelino Nicolau Slindvaim',   18),
  (1956, 'dep_federal',        'Adauto Rodrigues Seixas',       16),

  -- 1957/1958 — posse em 20/05/1957
  (1957, 'veneravel',          'Antonio Sonsin',                 0),
  (1957, 'primeiro_vigilante', 'Artemio Salvia Dorsa',           1),
  (1957, 'segundo_vigilante',  'Plinio Dall Ara',                2),
  (1957, 'orador',             'Helvetio Poletti',               3),
  (1957, 'secretario',         'Cícero Bulcão Siqueira Torres',  4),
  (1957, 'tesoureiro',         'Nicolau Sando',                  5),
  (1957, 'chanceler',          'Wilson Marcilio',                6),
  (1957, 'mestre_cerimonias',  'Saturnino Pacitti',             12),
  (1957, 'dep_estadual',       'João da Costa Muniz',           18),

  -- 1958/1959 — posse em 26/05/1958
  (1958, 'veneravel',          'Dr. João Marcilio',              0),
  (1958, 'primeiro_vigilante', 'Cícero Bulcão Siqueira Torres',  1),
  (1958, 'segundo_vigilante',  'Rivail Celeste',                 2),
  (1958, 'orador',             'Plinio Dall Ara',                3),
  (1958, 'secretario',         'Juvenal Silva',                  4),
  (1958, 'tesoureiro',         'João da Costa Muniz',            5),
  (1958, 'chanceler',          'Nicolau Sando',                  6),
  (1958, 'mestre_cerimonias',  'Wilson Marcilio',               12),
  (1958, 'dep_estadual',       'Juvenal Silva',                 18)
) AS d(installation_year, position, person_name, sort_order)
JOIN public.worshipful_masters m ON m.installation_year = d.installation_year
ON CONFLICT (master_id, position) DO NOTHING;

-- Correções retroativas: grafias que este impresso mostra de forma mais correta.
UPDATE public.worshipful_master_officers
   SET person_name = 'Plinio Dall Ara'
 WHERE person_name = 'Plinio Dll''Ara';

-- Cobre também "Jose Humberto Arico" (1935), sem acento em nenhum dos dois nomes.
UPDATE public.worshipful_master_officers
   SET person_name = 'José Humberto Aricó'
 WHERE person_name IN ('José Humberto Arico', 'Jose Humberto Arico');

COMMIT;
