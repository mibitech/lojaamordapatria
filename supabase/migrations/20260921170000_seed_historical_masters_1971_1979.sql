-- Diretorias históricas da Loja Amor da Pátria nº 1.928 (Bragança Paulista),
-- nono bloco do quadro impresso: 1971/1973 a 1977/1979.
--
-- Os quatro biênios são desdobrados em gestões anuais com a mesma diretoria,
-- mesmo critério aplicado a 1878/1880, 1929/1931 e 1963/1971.
--
-- Grafias normalizadas entre quadros, mesma pessoa:
--   "Vicente Manoel Arico" -> "Vicente Manoel Aricó"
--   "André Vaiareli"       -> "André Valareli"
--
-- worshipful_masters não tem unicidade por ano, então a idempotência vem de
-- NOT EXISTS em vez de ON CONFLICT.

BEGIN;

INSERT INTO public.worshipful_masters
  (name, installation_year, term_start_date, term_end_date, bio, is_active, sort_order)
SELECT v.name, v.installation_year, v.term_start_date, v.term_end_date, v.bio, false, v.installation_year
FROM (VALUES
  ('Armando Mangolim', 1971, DATE '1971-01-01', DATE '1972-01-01', 'Biênio 1971/1973.'),
  ('Armando Mangolim', 1972, DATE '1972-01-01', DATE '1973-01-01', 'Biênio 1971/1973.'),
  ('André Valareli',   1973, DATE '1973-01-01', DATE '1974-01-01', 'Biênio 1973/1975.'),
  ('André Valareli',   1974, DATE '1974-01-01', DATE '1975-01-01', 'Biênio 1973/1975.'),
  ('Nelson Carlini',   1975, DATE '1975-01-01', DATE '1976-01-01', 'Biênio 1975/1977.'),
  ('Nelson Carlini',   1976, DATE '1976-01-01', DATE '1977-01-01', 'Biênio 1975/1977.'),
  ('Darcy Capeleti',   1977, DATE '1977-01-01', DATE '1978-01-01', 'Biênio 1977/1979.'),
  ('Darcy Capeleti',   1978, DATE '1978-01-01', DATE '1979-01-01', 'Biênio 1977/1979.')
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
  -- 1971/1973 — mesma diretoria nos dois anos
  (1971, 'veneravel', 'Armando Mangolim', 0),
  (1971, 'primeiro_vigilante', 'Antonio Dias Affonso Júnior', 1),
  (1971, 'segundo_vigilante', 'Olívio Laerte do Amaral', 2),
  (1971, 'orador', 'Vicente Manoel Aricó', 3),
  (1971, 'secretario', 'Hercílio Conceição Rodrigues', 4),
  (1971, 'tesoureiro', 'Darcy Capeleti', 5),
  (1971, 'chanceler', 'João da Costa Muniz', 6),
  (1971, 'dep_estadual', 'Miguel João Cocicov', 18),
  (1971, 'dep_federal', 'Orlando Pugioli', 16),

  (1972, 'veneravel', 'Armando Mangolim', 0),
  (1972, 'primeiro_vigilante', 'Antonio Dias Affonso Júnior', 1),
  (1972, 'segundo_vigilante', 'Olívio Laerte do Amaral', 2),
  (1972, 'orador', 'Vicente Manoel Aricó', 3),
  (1972, 'secretario', 'Hercílio Conceição Rodrigues', 4),
  (1972, 'tesoureiro', 'Darcy Capeleti', 5),
  (1972, 'chanceler', 'João da Costa Muniz', 6),
  (1972, 'dep_estadual', 'Miguel João Cocicov', 18),
  (1972, 'dep_federal', 'Orlando Pugioli', 16),

  -- 1973/1975 — mesma diretoria nos dois anos
  (1973, 'veneravel', 'André Valareli', 0),
  (1973, 'primeiro_vigilante', 'Nelson Carlini', 1),
  (1973, 'segundo_vigilante', 'Benedito Furtado de Mendonça', 2),
  (1973, 'orador', 'Nelson Carrozzo', 3),
  (1973, 'secretario', 'Waldyr Castro', 4),
  (1973, 'tesoureiro', 'Antônio Barnabé de Mendonça', 5),
  (1973, 'chanceler', 'Vicente Manoel Aricó', 6),
  (1973, 'dep_estadual', 'Miguel João Cocicov', 18),
  (1973, 'dep_federal', 'Orlando Pugioli', 16),

  (1974, 'veneravel', 'André Valareli', 0),
  (1974, 'primeiro_vigilante', 'Nelson Carlini', 1),
  (1974, 'segundo_vigilante', 'Benedito Furtado de Mendonça', 2),
  (1974, 'orador', 'Nelson Carrozzo', 3),
  (1974, 'secretario', 'Waldyr Castro', 4),
  (1974, 'tesoureiro', 'Antônio Barnabé de Mendonça', 5),
  (1974, 'chanceler', 'Vicente Manoel Aricó', 6),
  (1974, 'dep_estadual', 'Miguel João Cocicov', 18),
  (1974, 'dep_federal', 'Orlando Pugioli', 16),

  -- 1975/1977 — mesma diretoria nos dois anos
  (1975, 'veneravel', 'Nelson Carlini', 0),
  (1975, 'primeiro_vigilante', 'Emir Faria', 1),
  (1975, 'segundo_vigilante', 'Antônio Célio Baraldi', 2),
  (1975, 'orador', 'Vicente Manoel Aricó', 3),
  (1975, 'secretario', 'Antônio Barnabé de Mendonça', 4),
  (1975, 'tesoureiro', 'José Carlos Queiroz Rodrigues', 5),
  (1975, 'chanceler', 'Odilon Cândido Alvarenga', 6),
  (1975, 'dep_estadual', 'José Rodrigues Toledo', 18),
  (1975, 'dep_federal', 'Aba Adolpho Pen', 16),

  (1976, 'veneravel', 'Nelson Carlini', 0),
  (1976, 'primeiro_vigilante', 'Emir Faria', 1),
  (1976, 'segundo_vigilante', 'Antônio Célio Baraldi', 2),
  (1976, 'orador', 'Vicente Manoel Aricó', 3),
  (1976, 'secretario', 'Antônio Barnabé de Mendonça', 4),
  (1976, 'tesoureiro', 'José Carlos Queiroz Rodrigues', 5),
  (1976, 'chanceler', 'Odilon Cândido Alvarenga', 6),
  (1976, 'dep_estadual', 'José Rodrigues Toledo', 18),
  (1976, 'dep_federal', 'Aba Adolpho Pen', 16),

  -- 1977/1979 — mesma diretoria nos dois anos
  (1977, 'veneravel', 'Darcy Capeleti', 0),
  (1977, 'primeiro_vigilante', 'Ari Mateus Carvallio', 1),
  (1977, 'segundo_vigilante', 'Antonio D''Ângelo Neto', 2),
  (1977, 'orador', 'Sérgio Franco de Oliveira', 3),
  (1977, 'secretario', 'Waldyr Castro', 4),
  (1977, 'tesoureiro', 'Emir Faria', 5),
  (1977, 'chanceler', 'Odilon Cândido Alvarenga', 6),
  (1977, 'dep_estadual', 'José Rodrigues Toledo', 18),
  (1977, 'dep_federal', 'Aba Adolpho Pen', 16),

  (1978, 'veneravel', 'Darcy Capeleti', 0),
  (1978, 'primeiro_vigilante', 'Ari Mateus Carvallio', 1),
  (1978, 'segundo_vigilante', 'Antonio D''Ângelo Neto', 2),
  (1978, 'orador', 'Sérgio Franco de Oliveira', 3),
  (1978, 'secretario', 'Waldyr Castro', 4),
  (1978, 'tesoureiro', 'Emir Faria', 5),
  (1978, 'chanceler', 'Odilon Cândido Alvarenga', 6),
  (1978, 'dep_estadual', 'José Rodrigues Toledo', 18),
  (1978, 'dep_federal', 'Aba Adolpho Pen', 16)
) AS d(installation_year, position, person_name, sort_order)
JOIN public.worshipful_masters m ON m.installation_year = d.installation_year
ON CONFLICT (master_id, position) DO NOTHING;

COMMIT;
