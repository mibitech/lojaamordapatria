-- Insert mock activities data into the activities table
INSERT INTO public.activities (
  title, 
  description, 
  content, 
  category, 
  image_url, 
  gallery_images, 
  results, 
  partnerships, 
  event_date, 
  is_featured, 
  is_public, 
  created_at
) VALUES
(
  'Campanha de Arrecadação de Alimentos',
  'Campanha beneficente para arrecadação de alimentos não perecíveis.',
  'Nossa loja promoveu uma grande campanha de arrecadação de alimentos que beneficiou mais de 200 famílias carentes da região.',
  'social',
  '/src/assets/charity-work.jpg',
  ARRAY['/src/assets/charity-work.jpg'],
  'Arrecadadas 2 toneladas de alimentos, beneficiando 200 famílias',
  ARRAY['Casa de Apoio Santa Maria', 'Orfanato São José'],
  '2024-01-15',
  true,
  true,
  '2024-01-15T00:00:00Z'
),
(
  'Palestra Pública: História da Maçonaria',
  'Evento educativo aberto ao público sobre a história da maçonaria no Brasil.',
  'Realizamos uma palestra pública ministrada pelo Ir. João Silva sobre a história da maçonaria no Brasil.',
  'educational',
  '/src/assets/charity-work.jpg',
  ARRAY[]::text[],
  'Mais de 100 pessoas presentes, grande interesse do público',
  ARRAY['Centro Cultural da Cidade'],
  '2024-02-20',
  false,
  true,
  '2024-02-20T00:00:00Z'
),
(
  'Projeto Educação para Todos',
  'Iniciativa educacional para jovens em situação de vulnerabilidade.',
  'Programa de mentoria e apoio educacional para jovens da comunidade.',
  'educational',
  '/src/assets/charity-work.jpg',
  ARRAY[]::text[],
  '50 jovens atendidos, 80% de aprovação escolar',
  ARRAY['Escola Municipal Santos Dumont'],
  '2024-03-10',
  true,
  true,
  '2024-03-10T00:00:00Z'
);