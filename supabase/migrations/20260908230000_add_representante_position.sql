-- Representante: cargo genérico para as representações que aparecem nos
-- quadros históricos (ex.: "Rep. PAEL" em 1946/1947). Genérico de propósito,
-- para não amarrar o enum a uma sigla de uso pontual.

ALTER TYPE public.officer_position ADD VALUE IF NOT EXISTS 'representante';
