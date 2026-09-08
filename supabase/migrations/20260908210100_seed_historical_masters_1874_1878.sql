-- Diretorias históricas da Loja Amor da Pátria nº 1.928 (Bragança Paulista),
-- transcritas do quadro impresso de instalação e das gestões seguintes.
--
-- 1874: instalação da Oficina 'Amor da Pátria' ao Valle de Bragança em
--       22/10/1874. A mesma diretoria conduziu a loja até a regularização
--       em 10/01/1875, daí o term_end_date nessa data.
-- 1876/1877 e 1877/1878: gestões subsequentes do quadro.
--
-- worshipful_masters não tem unicidade por ano, então a idempotência vem de
-- NOT EXISTS em vez de ON CONFLICT.

BEGIN;

INSERT INTO public.worshipful_masters
  (name, installation_year, term_start_date, term_end_date, bio, is_active, sort_order)
SELECT v.name, v.installation_year, v.term_start_date, v.term_end_date, v.bio, false, v.installation_year
FROM (VALUES
  ('Joaquim Vicente da Silva Paranhos', 1874, DATE '1874-10-22', DATE '1875-01-10',
   'Primeiro Venerável Mestre. Instalação da Oficina ''Amor da Pátria'' ao Valle de Bragança em 22 de outubro de 1874; a mesma diretoria conduziu a loja até a regularização, em 10 de janeiro de 1875.'),
  ('Dr. Braulio Timothes Urioste', 1876, DATE '1876-01-01', DATE '1877-01-01', NULL),
  ('Dr. Braulio Timothes Urioste', 1877, DATE '1877-01-01', DATE '1878-01-01', NULL)
) AS v(name, installation_year, term_start_date, term_end_date, bio)
WHERE NOT EXISTS (
  SELECT 1 FROM public.worshipful_masters m
   WHERE m.installation_year = v.installation_year
);

-- Oficiais por gestão. person_name é a origem correta aqui: nenhum destes
-- irmãos consta do quadro atual de membros.
INSERT INTO public.worshipful_master_officers (master_id, position, person_name, sort_order)
SELECT
  m.id,
  d.position::public.officer_position,
  d.person_name,
  d.sort_order
FROM (VALUES
  -- 1874 — instalação
  (1874, 'veneravel',           'Joaquim Vicente da Silva Paranhos',      0),
  (1874, 'primeiro_vigilante',  'Calisto Augusto Marin',                  1),
  (1874, 'segundo_vigilante',   'Frederico Guilherme Christiano',         2),
  (1874, 'orador',              'Raphael Mariano D''Oliveira Ribas',      3),
  (1874, 'secretario',          'José Guilherme Christiano',              4),
  (1874, 'tesoureiro',          'Orlando Lacorte',                        5),
  (1874, 'primeiro_experto',    'Luiz Filippe Villaça',                   6),
  (1874, 'segundo_experto',     'Antonio Nunes Brigagão',                 7),
  (1874, 'primeiro_diacono',    'Frederico Carneiro Pessanha Gacão',      8),
  (1874, 'segundo_diacono',     'Nicolas Asprino',                        9),
  (1874, 'mestre_cerimonias',   'Fortunato Jose Dantas de Vasconcellos', 10),

  -- 1876/1877
  (1876, 'veneravel',           'Dr. Braulio Timothes Urioste',           0),
  (1876, 'primeiro_vigilante',  'José Guilherme Christiano',              1),
  (1876, 'segundo_vigilante',   'Joaquim Antonio',                        2),
  (1876, 'orador',              'Nicola Asprino',                         3),
  (1876, 'secretario',          'Manoel d''Almeida Carneiro',             4),
  (1876, 'tesoureiro',          'José Hortencio de C. R.',                5),
  (1876, 'mestre_cerimonias',   'Maximo Jorge de A.',                    10),

  -- 1877/1878
  (1877, 'veneravel',           'Dr. Braulio Timothes Urioste',           0),
  (1877, 'primeiro_vigilante',  'José Guilherme Christiano',              1),
  (1877, 'segundo_vigilante',   'Jose Candido Furquim de Campos',         2),
  (1877, 'orador',              'Nicola Asprino',                         3),
  (1877, 'secretario',          'Manoel d''Almeida Carneiro',             4),
  (1877, 'tesoureiro',          'Jose Francisco Buenos Ayres',            5),
  (1877, 'mestre_cerimonias',   'Marciano Jorge do Amaral',              10),
  (1877, 'deputado',            'Joaquim Alves dos Santos',              11),
  (1877, 'delegado',            'Francisco Antonio de Souza Paulista',   12)
) AS d(installation_year, position, person_name, sort_order)
JOIN public.worshipful_masters m ON m.installation_year = d.installation_year
ON CONFLICT (master_id, position) DO NOTHING;

COMMIT;
