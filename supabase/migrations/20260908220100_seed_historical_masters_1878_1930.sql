-- Diretorias históricas da Loja Amor da Pátria nº 1.928 (Bragança Paulista),
-- segundo bloco do quadro impresso: 1878/1880 e 1928/1930.
--
-- 1878/1879-19/09/1880: um único quadro no impresso, cobrindo até 19/09/1880.
--                       Registrado como três gestões anuais (1878, 1879, 1880)
--                       com a mesma diretoria, conforme a leitura do documento.
-- 15/05/1928:           o impresso repete o mesmo quadro em dois blocos, com
--                       divergências apenas de grafia; é uma só gestão.
-- 1929/1931:            biênio registrado como duas gestões anuais (1929, 1930)
--                       com a mesma diretoria.
--
-- worshipful_masters não tem unicidade por ano, então a idempotência vem de
-- NOT EXISTS em vez de ON CONFLICT.

BEGIN;

INSERT INTO public.worshipful_masters
  (name, installation_year, term_start_date, term_end_date, bio, is_active, sort_order)
SELECT v.name, v.installation_year, v.term_start_date, v.term_end_date, v.bio, false, v.installation_year
FROM (VALUES
  ('Manoel d''Almeida Carneiro', 1878, DATE '1878-01-01', DATE '1879-01-01',
   'Quadro registrado no impresso como 1878/1879 até 19 de setembro de 1880.'),
  ('Manoel d''Almeida Carneiro', 1879, DATE '1879-01-01', DATE '1880-01-01',
   'Quadro registrado no impresso como 1878/1879 até 19 de setembro de 1880.'),
  ('Manoel d''Almeida Carneiro', 1880, DATE '1880-01-01', DATE '1880-09-19',
   'Quadro registrado no impresso como 1878/1879 até 19 de setembro de 1880.'),
  ('Raphael Molinari', 1928, DATE '1928-05-15', DATE '1929-05-15',
   'Instalado em 15 de maio de 1928.'),
  ('Benedito Rodrigues Moreira', 1929, DATE '1929-01-01', DATE '1930-01-01',
   'Quadro registrado no impresso como biênio 1929/1931.'),
  ('Benedito Rodrigues Moreira', 1930, DATE '1930-01-01', DATE '1931-01-01',
   'Quadro registrado no impresso como biênio 1929/1931.')
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
  -- 1878 / 1879 / 1880 — mesma diretoria nos três anos
  (1878, 'veneravel',          'Manoel d''Almeida Carneiro',        0),
  (1878, 'primeiro_vigilante', 'Calixto Augusto Marin',             1),
  (1878, 'segundo_vigilante',  'Antonio Gonçalves d''Oliveira',     2),
  (1878, 'orador',             'Carlos Alvarez da Cruz',            3),
  (1878, 'secretario',         'Francisco de Assis Burnos Ayres',   4),
  (1878, 'tesoureiro',         'José Francisco Bueno Ayres',        5),
  (1878, 'mestre_cerimonias',  'José Guilherme Christiano',        10),
  (1878, 'deputado',           'Joaquim Alves dos Santos',         11),
  (1878, 'delegado',           'Manoel Cardoso da Silva',          12),

  (1879, 'veneravel',          'Manoel d''Almeida Carneiro',        0),
  (1879, 'primeiro_vigilante', 'Calixto Augusto Marin',             1),
  (1879, 'segundo_vigilante',  'Antonio Gonçalves d''Oliveira',     2),
  (1879, 'orador',             'Carlos Alvarez da Cruz',            3),
  (1879, 'secretario',         'Francisco de Assis Burnos Ayres',   4),
  (1879, 'tesoureiro',         'José Francisco Bueno Ayres',        5),
  (1879, 'mestre_cerimonias',  'José Guilherme Christiano',        10),
  (1879, 'deputado',           'Joaquim Alves dos Santos',         11),
  (1879, 'delegado',           'Manoel Cardoso da Silva',          12),

  (1880, 'veneravel',          'Manoel d''Almeida Carneiro',        0),
  (1880, 'primeiro_vigilante', 'Calixto Augusto Marin',             1),
  (1880, 'segundo_vigilante',  'Antonio Gonçalves d''Oliveira',     2),
  (1880, 'orador',             'Carlos Alvarez da Cruz',            3),
  (1880, 'secretario',         'Francisco de Assis Burnos Ayres',   4),
  (1880, 'tesoureiro',         'José Francisco Bueno Ayres',        5),
  (1880, 'mestre_cerimonias',  'José Guilherme Christiano',        10),
  (1880, 'deputado',           'Joaquim Alves dos Santos',         11),
  (1880, 'delegado',           'Manoel Cardoso da Silva',          12),

  -- 1928 — grafias divergentes entre os dois blocos do impresso resolvidas
  -- pela forma que aparece consistentemente nos demais quadros
  (1928, 'veneravel',          'Raphael Molinari',                  0),
  (1928, 'primeiro_vigilante', 'João Antonio Sanches',              1),
  (1928, 'segundo_vigilante',  'Osorio Ramalho de Oliveira',        2),
  (1928, 'orador',             'Francisco Gonzalez',                3),
  (1928, 'secretario',         'Jose La Salvia',                    4),
  (1928, 'tesoureiro',         'Francisco da Silva Villaça',        5),
  (1928, 'hospitaleiro',       'Olyntho Gualano',                   6),
  (1928, 'mestre_cerimonias',  'Roque Iarussi',                    10),

  -- 1929 / 1930 — mesma diretoria nos dois anos
  (1929, 'veneravel',          'Benedito Rodrigues Moreira',        0),
  (1929, 'primeiro_vigilante', 'João Antonio Sanches',              1),
  (1929, 'segundo_vigilante',  'Vicente Calixto',                   2),
  (1929, 'orador',             'Genesio Amaral',                    3),
  (1929, 'secretario',         'Benedito Mendes',                   4),
  (1929, 'tesoureiro',         'Julio Gonçalves',                   5),
  (1929, 'hospitaleiro',       'Francisco Villaça',                 6),
  (1929, 'mestre_cerimonias',  'Raphael Soriano',                  10),

  (1930, 'veneravel',          'Benedito Rodrigues Moreira',        0),
  (1930, 'primeiro_vigilante', 'João Antonio Sanches',              1),
  (1930, 'segundo_vigilante',  'Vicente Calixto',                   2),
  (1930, 'orador',             'Genesio Amaral',                    3),
  (1930, 'secretario',         'Benedito Mendes',                   4),
  (1930, 'tesoureiro',         'Julio Gonçalves',                   5),
  (1930, 'hospitaleiro',       'Francisco Villaça',                 6),
  (1930, 'mestre_cerimonias',  'Raphael Soriano',                  10)
) AS d(installation_year, position, person_name, sort_order)
JOIN public.worshipful_masters m ON m.installation_year = d.installation_year
ON CONFLICT (master_id, position) DO NOTHING;

COMMIT;
