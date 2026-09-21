-- Hospitaleiro: cargo presente nos quadros a partir de 1928 e ainda existente
-- na estrutura atual da loja (comissão de Hospitalaria).
--
-- Migration separada do seed: ALTER TYPE ... ADD VALUE não pode ser
-- referenciado na mesma transação em que o valor é criado.

ALTER TYPE public.officer_position ADD VALUE IF NOT EXISTS 'hospitaleiro';
