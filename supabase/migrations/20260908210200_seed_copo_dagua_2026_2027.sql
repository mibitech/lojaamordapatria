-- Calendário Copo D'água 2026/2027 (importado da planilha oficial da Loja)
-- Idempotente: remove o intervalo antes de inserir para permitir reexecução.
-- Feriado do GOB-BR (17/06) e suspensão da Copa (24/06) ficam de fora: não têm
-- grupo de copo d'água, e o importador CSV da tela já descarta linhas com 'X'.

DELETE FROM public.copo_dagua_calendar
WHERE event_date BETWEEN '2026-06-10' AND '2026-10-14';

INSERT INTO public.copo_dagua_calendar
  (event_date, month, day_of_week, session_type, session_degree, study_time, start_time, water_glass_group)
VALUES
  ('2026-06-10', 'junho',    'quarta-feira', 'Magna de Instalação de Posse',                'Aprendiz',                          NULL,                                                  '20h', 'Encomendado pela Loja'),
  ('2026-07-01', 'julho',    'quarta-feira', 'Ordinária',                                   'Aprendiz',                          'São João Batista (João José Marques)',                '20h', 'Grupo 11 - Rubinho, Thamiel, Eduardo Pigiani, Ricardo Lopes, Luciano Siqueira'),
  ('2026-07-08', 'julho',    'quarta-feira', 'Ordinária',                                   'Aprendiz',                          'Revolução Constitucionalista de 1932 (Luciano Siqueira)', '20h', 'Grupo 02 - Marcos Moura, Paulo Abdalla, Sergio André, Jorge Carneiro'),
  ('2026-07-15', 'julho',    'quarta-feira', 'Ordinária',                                   'Aprendiz',                          'Trabalho da Hospitalaria (João José Marques)',         '20h', 'Grupo 01 - Valmir Honório, João Marques, João Bardy, André Pantuzzi'),
  ('2026-07-22', 'julho',    'quarta-feira', 'Ordinária',                                   'Aprendiz',                          'Trabalho (Eduardo Gianotti)',                         '20h', 'Grupo 05 - Everton, Pablo Sanches, Mustafa, Stanley Rangel'),
  ('2026-07-29', 'julho',    'quarta-feira', 'Magna de Exaltação (Jaques e Leandro)',       'Mestre',                            NULL,                                                  '20h', 'Encomendado pela Loja'),
  ('2026-08-05', 'agosto',   'quarta-feira', 'Ordinária - Dia dos Pais',                    'Aprendiz',                          'Dia dos Pais - Entrega das Comendas',                 '20h', 'Encomendado pela loja'),
  ('2026-08-12', 'agosto',   'quarta-feira', 'Ordinária',                                   'Aprendiz / Mestre',                 '1ª e 2ª Instrução de Mestre (Jaques e Catanzaro)',    '20h', 'Grupo 10 - Sergio Fugimoto, Sócrates, Claudio Alvarez, Joaquim'),
  ('2026-08-19', 'agosto',   'quarta-feira', 'Magna de Elevação (Everton)',                 'Companheiro',                       NULL,                                                  '20h', 'Encomendado pela Loja'),
  ('2026-08-26', 'agosto',   'quarta-feira', 'Ordinária',                                   'Aprendiz / Companheiro',            'Aprovação das contas - 1ª e 2ª Instruções de Comp∴ (Everton)', '20h', 'Grupo 07 - Eduado Gianotti, Rafael Consolin, Toni, Leandro Catanzaro'),
  ('2026-09-02', 'setembro', 'quarta-feira', 'Ordinária',                                   'Aprendiz / Companheiro',            '3ª Instrução de Comp∴ (Everton)',                     '20h', 'Grupo 06 - Everton, Pablo Sanches, Mustafa, Stanley Rangel'),
  ('2026-09-09', 'setembro', 'quarta-feira', 'Magna Conjunta de Proclamação da Independência', 'Aprendiz (Luz do Interior/Waldemar)', 'Palestra (Gerson Magdaleno)',                     '20h', 'Encomendado pela Loja'),
  ('2026-09-16', 'setembro', 'quarta-feira', 'Ordinária',                                   'Aprendiz',                          'Sentido sobre ser Maçom (Correa)',                    '20h', 'Grupo 09 - Bruno Vieira, Jaques, José Teixeira, Francisco Labadeça'),
  ('2026-09-23', 'setembro', 'quarta-feira', 'Ordinária',                                   'Aprendiz',                          'Prancha de Estudos (Bardy)',                          '20h', 'Grupo 03 - Bruno Massani, José Roberto, Correa, Wesley'),
  ('2026-09-30', 'setembro', 'quarta-feira', 'Ordinária',                                   'Mestre',                            'Grau de Mestre (Jaques)',                             '20h', 'Grupo 04 - Edvaldo, André Carlini, Diogo, Bruno Silveira'),
  ('2026-10-07', 'outubro',  'quarta-feira', 'Ordinária',                                   'Aprendiz',                          'Pranchas de Estudos (Thamiel)',                        '20h', 'Grupo 08 - Gerson Bertolini, Marcio Bello, Eduardo Sigoli, Eduardo Pigiani'),
  ('2026-10-14', 'outubro',  'quarta-feira', 'Ordinária',                                   'Aprendiz',                          'A Lenda de Hiram (Catanzaro)',                        '20h', 'Grupo 11 - Rubinho, Thamiel, Eduardo Pigiani, Ricardo, Luciano');
