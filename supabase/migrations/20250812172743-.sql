-- Update sample data with the generated image
UPDATE public.worshipful_masters 
SET photo_url = '/src/assets/venerable-master-portrait.jpg'
WHERE installation_year = 2024;

-- Add more realistic sample data
INSERT INTO public.worshipful_masters (name, installation_year, term_start_date, term_end_date, bio, achievements, is_active, sort_order) VALUES
('Irmão José da Silva', 2018, '2018-01-15', '2018-12-31', 'Líder dedicado com formação em engenharia, focou na modernização dos processos internos da loja.', 'Implementou sistema de gestão digital, reformou salão principal, aumentou participação juvenil em 40%', false, 7),
('Irmão Luiz Fernando', 2017, '2017-01-15', '2017-12-31', 'Professor universitário aposentado, especialista em filosofia e história da maçonaria.', 'Criou programa de educação continuada, estabeleceu biblioteca com 500 volumes, formou 15 mestres', false, 8),
('Irmão Marco Antonio', 2016, '2016-01-15', '2016-12-31', 'Empresário do ramo de construção civil, liderou importantes obras de beneficência.', 'Construiu creche comunitária, reformou escola municipal, coordenou 10 projetos sociais', false, 9)
ON CONFLICT (id) DO NOTHING;