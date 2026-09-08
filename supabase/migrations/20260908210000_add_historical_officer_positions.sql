-- Cargos das diretorias do século XIX (1874-1878), ausentes na estrutura atual.
-- Expertos, Diáconos e Mestre de Cerimônias compõem o quadro ritualístico;
-- Deputado e Delegado são as representações junto ao Grande Oriente, distintas
-- dos deputados federal/estadual do enum moderno.
--
-- ALTER TYPE ... ADD VALUE não pode ser usado na mesma transação em que o novo
-- valor é referenciado, por isso os dados vão numa migration separada.

ALTER TYPE public.officer_position ADD VALUE IF NOT EXISTS 'primeiro_experto';
ALTER TYPE public.officer_position ADD VALUE IF NOT EXISTS 'segundo_experto';
ALTER TYPE public.officer_position ADD VALUE IF NOT EXISTS 'primeiro_diacono';
ALTER TYPE public.officer_position ADD VALUE IF NOT EXISTS 'segundo_diacono';
ALTER TYPE public.officer_position ADD VALUE IF NOT EXISTS 'mestre_cerimonias';
ALTER TYPE public.officer_position ADD VALUE IF NOT EXISTS 'deputado';
ALTER TYPE public.officer_position ADD VALUE IF NOT EXISTS 'delegado';
