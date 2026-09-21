-- Diretorias históricas da Loja Amor da Pátria nº 1.928 (Bragança Paulista),
-- quarto bloco do quadro impresso: 1947/1948 a 1950/1951.
--
-- 1950/1951 traz nota no impresso: "Foi prorrogado mandado por decisão
-- Assembléia Constituinte e aprovado pela Loja Sessão, realizada em data de
-- 14/05/1.951 - 1951/1952". A prorrogação é registrada como uma segunda
-- gestão (1951) com a mesma diretoria.
--
-- Grafias normalizadas entre quadros, mesma pessoa:
--   "Raphael Soriano Roldan"     -> "Raphael Soriano Roldão"
--   "Dr. Oscar Ralles Almeida"   -> "Oscar Ralles Almeida"
--
-- worshipful_masters não tem unicidade por ano, então a idempotência vem de
-- NOT EXISTS em vez de ON CONFLICT.

BEGIN;

INSERT INTO public.worshipful_masters
  (name, installation_year, term_start_date, term_end_date, bio, is_active, sort_order)
SELECT v.name, v.installation_year, v.term_start_date, v.term_end_date, v.bio, false, v.installation_year
FROM (VALUES
  ('Dr. João Marcilio',            1947, DATE '1947-01-01', DATE '1948-01-01', NULL),
  ('José de Paula Lima',           1948, DATE '1948-01-01', DATE '1949-01-01', NULL),
  ('Evangelino Ferreira Basteiro', 1949, DATE '1949-01-01', DATE '1950-01-01', NULL),
  ('Evangelino Ferreira Basteiro', 1950, DATE '1950-01-01', DATE '1951-01-01',
   'Mandato prorrogado até 1951/1952 por decisão da Assembléia Constituinte, aprovada em sessão da Loja de 14 de maio de 1951.'),
  ('Evangelino Ferreira Basteiro', 1951, DATE '1951-01-01', DATE '1952-01-01',
   'Gestão decorrente da prorrogação do mandato de 1950/1951, aprovada em sessão da Loja de 14 de maio de 1951.')
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
  -- 1947/1948
  (1947, 'veneravel',          'Dr. João Marcilio',              0),
  (1947, 'primeiro_vigilante', 'Manoel Teodoro Fonseca',         1),
  (1947, 'segundo_vigilante',  'Evangelino Ferreira Basteiro',   2),
  (1947, 'orador',             'Antonio Domiciano Pereira Jr.',  3),
  (1947, 'secretario',         'Andrelino Nicolau Slindvaim',    4),
  (1947, 'tesoureiro',         'Raphael Soriano Roldão',         5),
  (1947, 'chanceler',          'Benedito Cardoso',               6),
  (1947, 'representante',      'Alziro Ferreira Carneiro',      15),

  -- 1948/1949
  (1948, 'veneravel',          'José de Paula Lima',             0),
  (1948, 'primeiro_vigilante', 'Evangelino Ferreira Basteiro',   1),
  (1948, 'segundo_vigilante',  'Jose Lang Sobrinho',             2),
  (1948, 'orador',             'Dr. João Marcilio',              3),
  (1948, 'secretario',         'Andrelino Nicolau Slindvaim',    4),
  (1948, 'tesoureiro',         'Antonio Sonsin',                 5),
  (1948, 'mestre_cerimonias',  'Benedito Cardoso',              12),
  (1948, 'representante',      'Oscar Ralles Almeida',          15),

  -- 1949/1950
  (1949, 'veneravel',          'Evangelino Ferreira Basteiro',   0),
  (1949, 'primeiro_vigilante', 'Luiz La Salvia',                 1),
  (1949, 'segundo_vigilante',  'Andrelino Nicolau Slindvaim',    2),
  (1949, 'orador',             'Dr. João Marcilio',              3),
  (1949, 'secretario',         'Wilson Marcilio',                4),
  (1949, 'tesoureiro',         'Raphael Soriano Roldão',         5),
  (1949, 'mestre_cerimonias',  'Benedito Cardoso',              12),
  (1949, 'representante',      'Oscar Ralles Almeida',          15),

  -- 1950/1951 e a prorrogação 1951/1952 — mesma diretoria
  (1950, 'veneravel',          'Evangelino Ferreira Basteiro',   0),
  (1950, 'primeiro_vigilante', 'Luiz La Salvia',                 1),
  (1950, 'segundo_vigilante',  'Antonio Sonsin',                 2),
  (1950, 'orador',             'Orlando Oliveira',               3),
  (1950, 'secretario',         'Andrelino Nicolau Slindvaim',    4),
  (1950, 'tesoureiro',         'João da Costa Muniz',            5),
  (1950, 'mestre_cerimonias',  'Satuirnino Pacitti',            12),
  (1950, 'representante',      'Jose Vieira Campos',            15),

  (1951, 'veneravel',          'Evangelino Ferreira Basteiro',   0),
  (1951, 'primeiro_vigilante', 'Luiz La Salvia',                 1),
  (1951, 'segundo_vigilante',  'Antonio Sonsin',                 2),
  (1951, 'orador',             'Orlando Oliveira',               3),
  (1951, 'secretario',         'Andrelino Nicolau Slindvaim',    4),
  (1951, 'tesoureiro',         'João da Costa Muniz',            5),
  (1951, 'mestre_cerimonias',  'Satuirnino Pacitti',            12),
  (1951, 'representante',      'Jose Vieira Campos',            15)
) AS d(installation_year, position, person_name, sort_order)
JOIN public.worshipful_masters m ON m.installation_year = d.installation_year
ON CONFLICT (master_id, position) DO NOTHING;

COMMIT;
