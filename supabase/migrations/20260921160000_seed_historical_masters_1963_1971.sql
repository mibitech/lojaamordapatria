-- Diretorias históricas da Loja Amor da Pátria nº 1.928 (Bragança Paulista),
-- oitavo bloco do quadro impresso: 1963/1965 a 1969/1971.
--
-- Os biênios do impresso (1963/1965, 1967/1969 e 1969/1971) são desdobrados em
-- gestões anuais com a mesma diretoria, mesmo critério aplicado a 1878/1880 e
-- 1929/1931. A gestão 1966/1967 não consta no documento e por isso não é
-- registrada.
--
-- Grafias normalizadas entre quadros, mesma pessoa:
--   "Saturnino Paccitti" -> "Saturnino Pacitti"
--   "Cicero Bulcão ..."  -> "Cícero Bulcão Siqueira Torres"
--
-- worshipful_masters não tem unicidade por ano, então a idempotência vem de
-- NOT EXISTS em vez de ON CONFLICT.

BEGIN;

INSERT INTO public.worshipful_masters
  (name, installation_year, term_start_date, term_end_date, bio, is_active, sort_order)
SELECT v.name, v.installation_year, v.term_start_date, v.term_end_date, v.bio, false, v.installation_year
FROM (VALUES
  ('Plinio Dall Ara', 1963, DATE '1963-06-17', DATE '1964-06-17',
   'Biênio 1963/1965, com posse em 17 de junho de 1963.'),
  ('Plinio Dall Ara', 1964, DATE '1964-06-17', DATE '1965-06-17',
   'Biênio 1963/1965, com posse em 17 de junho de 1963.'),
  ('Nicolau Sando',   1965, DATE '1965-01-01', DATE '1966-01-01', NULL),
  ('Darcy Capeleti',  1967, DATE '1967-01-01', DATE '1968-01-01',
   'Biênio 1967/1969.'),
  ('Darcy Capeleti',  1968, DATE '1968-01-01', DATE '1969-01-01',
   'Biênio 1967/1969.'),
  ('Darcy Capeleti',  1969, DATE '1969-01-01', DATE '1970-01-01',
   'Biênio 1969/1971.'),
  ('Darcy Capeleti',  1970, DATE '1970-01-01', DATE '1971-01-01',
   'Biênio 1969/1971.')
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
  -- 1963/1965 — posse em 17/06/1963, mesma diretoria nos dois anos
  (1963, 'veneravel',          'Plinio Dall Ara',                0),
  (1963, 'primeiro_vigilante', 'Cícero Bulcão Siqueira Torres',  1),
  (1963, 'segundo_vigilante',  'Saturnino Pacitti',              2),
  (1963, 'orador',             'Juvenal Silva',                  3),
  (1963, 'secretario',         'Wilson Marcilio',                4),
  (1963, 'tesoureiro',         'Rivair Celeste',                 5),
  (1963, 'chanceler',          'João da Costa Muniz',            6),

  (1964, 'veneravel',          'Plinio Dall Ara',                0),
  (1964, 'primeiro_vigilante', 'Cícero Bulcão Siqueira Torres',  1),
  (1964, 'segundo_vigilante',  'Saturnino Pacitti',              2),
  (1964, 'orador',             'Juvenal Silva',                  3),
  (1964, 'secretario',         'Wilson Marcilio',                4),
  (1964, 'tesoureiro',         'Rivair Celeste',                 5),
  (1964, 'chanceler',          'João da Costa Muniz',            6),

  -- 1965/1966
  (1965, 'veneravel',          'Nicolau Sando',                  0),
  (1965, 'primeiro_vigilante', 'Cícero Bulcão Siqueira Torres',  1),
  (1965, 'segundo_vigilante',  'Saturnino Pacitti',              2),
  (1965, 'orador',             'Wilson Marcilio',                3),
  (1965, 'secretario',         'Juvenal Silva',                  4),
  (1965, 'tesoureiro',         'Rivair Celeste',                 5),
  (1965, 'chanceler',          'João da Costa Muniz',            6),

  -- 1967/1969 — mesma diretoria nos dois anos
  (1967, 'veneravel',          'Darcy Capeleti',                 0),
  (1967, 'primeiro_vigilante', 'André Valareli',                 1),
  (1967, 'segundo_vigilante',  'Leopold Herman Willins Gropp',   2),
  (1967, 'orador',             'João da Costa Muniz',            3),
  (1967, 'secretario',         'Antonio Dias Affonso Júnior',    4),
  (1967, 'tesoureiro',         'Nelson Carlini',                 5),
  (1967, 'chanceler',          'Wilson Marcilio',                6),

  (1968, 'veneravel',          'Darcy Capeleti',                 0),
  (1968, 'primeiro_vigilante', 'André Valareli',                 1),
  (1968, 'segundo_vigilante',  'Leopold Herman Willins Gropp',   2),
  (1968, 'orador',             'João da Costa Muniz',            3),
  (1968, 'secretario',         'Antonio Dias Affonso Júnior',    4),
  (1968, 'tesoureiro',         'Nelson Carlini',                 5),
  (1968, 'chanceler',          'Wilson Marcilio',                6),

  -- 1969/1971 — mesma diretoria nos dois anos
  (1969, 'veneravel',          'Darcy Capeleti',                 0),
  (1969, 'primeiro_vigilante', 'João da Costa Muniz',            1),
  (1969, 'segundo_vigilante',  'Antonio Dias Affonso Júnior',    2),
  (1969, 'orador',             'Armando Mangolim',               3),
  (1969, 'secretario',         'Darci dos Santos Guedes',        4),
  (1969, 'tesoureiro',         'Nelson Carlini',                 5),
  (1969, 'chanceler',          'Hercílio Conceição Rodrigues',   6),
  (1969, 'dep_estadual',       'Jairo Feliciano Canella',       18),
  (1969, 'dep_federal',        'André Valareli',                16),

  (1970, 'veneravel',          'Darcy Capeleti',                 0),
  (1970, 'primeiro_vigilante', 'João da Costa Muniz',            1),
  (1970, 'segundo_vigilante',  'Antonio Dias Affonso Júnior',    2),
  (1970, 'orador',             'Armando Mangolim',               3),
  (1970, 'secretario',         'Darci dos Santos Guedes',        4),
  (1970, 'tesoureiro',         'Nelson Carlini',                 5),
  (1970, 'chanceler',          'Hercílio Conceição Rodrigues',   6),
  (1970, 'dep_estadual',       'Jairo Feliciano Canella',       18),
  (1970, 'dep_federal',        'André Valareli',                16)
) AS d(installation_year, position, person_name, sort_order)
JOIN public.worshipful_masters m ON m.installation_year = d.installation_year
ON CONFLICT (master_id, position) DO NOTHING;

COMMIT;
