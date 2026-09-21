-- Diretorias históricas da Loja Amor da Pátria nº 1.928 (Bragança Paulista),
-- terceiro bloco do quadro impresso: 1931/1932, 1935/1936, 1936/1937,
-- 1945/1946 e 1946/1947.
--
-- Os anos ausentes (1932-1934 e 1937-1944) não constam no impresso e por isso
-- não são registrados aqui.
--
-- 1945/1946 e 1946/1947 têm mandato de junho a maio, daí as datas de início e
-- término não coincidirem com o ano civil.
--
-- "Evangeno Ferreira Basteiro" (1945/1946 no impresso) foi normalizado para
-- "Evangelino Ferreira Basteiro", forma usada nos quadros de 1935/1936 e
-- 1946/1947 para a mesma pessoa.
--
-- worshipful_masters não tem unicidade por ano, então a idempotência vem de
-- NOT EXISTS em vez de ON CONFLICT.

BEGIN;

INSERT INTO public.worshipful_masters
  (name, installation_year, term_start_date, term_end_date, bio, is_active, sort_order)
SELECT v.name, v.installation_year, v.term_start_date, v.term_end_date, v.bio, false, v.installation_year
FROM (VALUES
  ('Manoel Teodoro Vasconcellos', 1931, DATE '1931-01-01', DATE '1932-01-01', NULL),
  ('Manoel Deodoro Vasconcellos', 1935, DATE '1935-01-01', DATE '1936-01-01', NULL),
  ('Alziro Ferreira Carneiro',    1936, DATE '1936-01-01', DATE '1937-01-01', NULL),
  ('Dr. João Marcilio',           1945, DATE '1945-06-01', DATE '1946-05-31',
   'Mandato de 1º de junho de 1945 a 31 de maio de 1946.'),
  ('Dr. João Marcilio',           1946, DATE '1946-06-01', DATE '1947-05-31',
   'Mandato de 1º de junho de 1946 a 31 de maio de 1947.')
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
  -- 1931/1932
  (1931, 'veneravel',          'Manoel Teodoro Vasconcellos',       0),
  (1931, 'primeiro_vigilante', 'Jose Antonio Sanches',              1),
  (1931, 'segundo_vigilante',  'Vicente Calixto',                   2),
  (1931, 'orador',             'Vitorio Guerra',                    3),
  (1931, 'secretario',         'João Brandão',                      4),
  (1931, 'tesoureiro',         'Capitão Julio Gonçalves da Silva',  5),
  (1931, 'mestre_cerimonias',  'Raphael Soriano',                  12),

  -- 1935/1936
  (1935, 'veneravel',          'Manoel Deodoro Vasconcellos',       0),
  (1935, 'primeiro_vigilante', 'Vicente Calixto',                   1),
  (1935, 'segundo_vigilante',  'Jose Humberto Arico',               2),
  (1935, 'orador',             'Evangelino Ferreira Basteiro',      3),
  (1935, 'secretario',         'Rocini Camargo Guarnieri',          4),
  (1935, 'tesoureiro',         'Francisco Granado',                 5),
  (1935, 'chanceler',          'Nelson Ritton',                     6),

  -- 1936/1937
  (1936, 'veneravel',          'Alziro Ferreira Carneiro',          0),
  (1936, 'primeiro_vigilante', 'Antonio Teles de Freitas',          1),
  (1936, 'segundo_vigilante',  'Mario Grisolli',                    2),
  (1936, 'orador',             'Jose Euzembau',                     3),
  (1936, 'secretario',         'Abrahão Palmeira',                  4),
  (1936, 'tesoureiro',         'Francisco Granado',                 5),
  (1936, 'chanceler',          'Julio Gonçalves da Silva',          6),

  -- 01/06/1945 a 31/05/1946
  (1945, 'veneravel',          'Dr. João Marcilio',                 0),
  (1945, 'primeiro_vigilante', 'Manoel de Vasconcellos',            1),
  (1945, 'segundo_vigilante',  'Jose de Paula Lima',                2),
  (1945, 'orador',             'Alziro Ferreira Carneiro',          3),
  (1945, 'secretario',         'Evangelino Ferreira Basteiro',      4),
  (1945, 'tesoureiro',         'Leoncio Brandão',                   5),

  -- 01/06/1946 a 31/05/1947
  (1946, 'veneravel',          'Dr. João Marcilio',                 0),
  (1946, 'primeiro_vigilante', 'Leoncio Bueno Brandão',             1),
  (1946, 'segundo_vigilante',  'Evangelino Ferreira Basteiro',      2),
  (1946, 'orador',             'Mario Grisoli',                     3),
  (1946, 'secretario',         'Andrelino Nicolau Slindvaim',       4),
  (1946, 'tesoureiro',         'Dario Avelino Oliveira',            5),
  (1946, 'representante',      'Jose de Paula Lima',               15)
) AS d(installation_year, position, person_name, sort_order)
JOIN public.worshipful_masters m ON m.installation_year = d.installation_year
ON CONFLICT (master_id, position) DO NOTHING;

COMMIT;
