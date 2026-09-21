-- Diretorias históricas da Loja Amor da Pátria nº 1.928 (Bragança Paulista),
-- quinto bloco do quadro impresso: 1952/1953 a 1954/1955.
--
-- O quadro 1951/1952 do impresso já está na base: foi criado a partir da nota
-- de prorrogação do mandato de 1950/1951, e o documento confirma a mesma
-- diretoria. Por isso não é reinserido aqui.
--
-- Grafias normalizadas entre quadros, mesma pessoa:
--   "Andrelino Nicolau Slindvain" e "Andrelino Nicolas Slindvaim"
--                                -> "Andrelino Nicolau Slindvaim"
--   "Raphael Soriano Roldan"     -> "Raphael Soriano Roldão"
--   "Satuirnino Pacitti"         -> "Saturnino Pacitti" (também corrigido
--                                   nas gestões 1950 e 1951 já gravadas)
--
-- worshipful_masters não tem unicidade por ano, então a idempotência vem de
-- NOT EXISTS em vez de ON CONFLICT.

BEGIN;

INSERT INTO public.worshipful_masters
  (name, installation_year, term_start_date, term_end_date, bio, is_active, sort_order)
SELECT v.name, v.installation_year, v.term_start_date, v.term_end_date, NULL, false, v.installation_year
FROM (VALUES
  ('Antonio Sonsin',   1952, DATE '1952-01-01', DATE '1953-01-01'),
  ('Wilson Marcilio',  1953, DATE '1953-01-01', DATE '1954-01-01'),
  ('Orlando Oliveira', 1954, DATE '1954-01-01', DATE '1955-01-01')
) AS v(name, installation_year, term_start_date, term_end_date)
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
  -- 1952/1953
  (1952, 'veneravel',          'Antonio Sonsin',                 0),
  (1952, 'primeiro_vigilante', 'Evangelino Ferreira Basteiro',   1),
  (1952, 'segundo_vigilante',  'Dr. João Marcilio',              2),
  (1952, 'orador',             'Orlando Oliveira',               3),
  (1952, 'secretario',         'Andrelino Nicolau Slindvaim',    4),
  (1952, 'tesoureiro',         'João da Costa Muniz',            5),
  (1952, 'mestre_cerimonias',  'Luiz La Salvia',                12),
  (1952, 'representante',      'Andrelino Nicolau Slindvaim',   15),

  -- 1953/1954
  (1953, 'veneravel',          'Wilson Marcilio',                0),
  (1953, 'primeiro_vigilante', 'Orlando Oliveira',               1),
  (1953, 'segundo_vigilante',  'José Humberto Arico',            2),
  (1953, 'orador',             'Evangelino Ferreira Basteiro',   3),
  (1953, 'secretario',         'Plinio Dll''Ara',                4),
  (1953, 'tesoureiro',         'João da Costa Muniz',            5),
  (1953, 'mestre_cerimonias',  'Raphael Soriano Roldão',        12),
  (1953, 'representante',      'Andrelino Nicolau Slindvaim',   15),

  -- 1954/1955
  (1954, 'veneravel',          'Orlando Oliveira',               0),
  (1954, 'primeiro_vigilante', 'Evangelino Ferreira Basteiro',   1),
  (1954, 'segundo_vigilante',  'José Humberto Arico',            2),
  (1954, 'orador',             'Dr. João Marcilio',              3),
  (1954, 'secretario',         'Wilson Marcilio',                4),
  (1954, 'tesoureiro',         'João da Costa Muniz',            5),
  (1954, 'mestre_cerimonias',  'Saturnino Pacitti',             12),
  (1954, 'representante',      'Andrelino Nicolau Slindvaim',   15)
) AS d(installation_year, position, person_name, sort_order)
JOIN public.worshipful_masters m ON m.installation_year = d.installation_year
ON CONFLICT (master_id, position) DO NOTHING;

-- Correção retroativa: "Satuirnino" é erro do impresso de 1950/1951.
UPDATE public.worshipful_master_officers
   SET person_name = 'Saturnino Pacitti'
 WHERE person_name = 'Satuirnino Pacitti';

COMMIT;
