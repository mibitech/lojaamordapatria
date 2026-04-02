-- Criar perfil para usuário existente (Ricardo Lopes)
INSERT INTO public.profiles (user_id, full_name, role)
VALUES (
  '9f93b39b-a177-4397-9f0f-895bb58f7d82',
  'Ricardo Lopes', 
  'member'
)
ON CONFLICT (user_id) DO NOTHING;