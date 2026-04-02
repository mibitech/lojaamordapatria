-- Create table for Worshipful Masters (Veneráveis)
CREATE TABLE public.worshipful_masters (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    photo_url TEXT,
    installation_year INTEGER NOT NULL,
    term_start_date DATE,
    term_end_date DATE,
    bio TEXT,
    achievements TEXT,
    is_active BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.worshipful_masters ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to view
CREATE POLICY "Worshipful masters are viewable by authenticated users"
ON public.worshipful_masters
FOR SELECT
USING (auth.role() = 'authenticated'::text);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_worshipful_masters_updated_at
BEFORE UPDATE ON public.worshipful_masters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.worshipful_masters (name, installation_year, term_start_date, term_end_date, bio, achievements, is_active, sort_order) VALUES
('Irmão João Silva', 2024, '2024-01-15', '2024-12-31', 'Venerável Mestre atual da loja, dedicado aos princípios maçônicos há mais de 15 anos.', 'Implementou programa de assistência social, aumentou em 30% a participação em rituais', true, 1),
('Irmão Carlos Santos', 2023, '2023-01-15', '2023-12-31', 'Ex-Venerável com vasta experiência em administração e gestão de recursos.', 'Modernizou a infraestrutura da loja, criou sistema de gestão digital', false, 2),
('Irmão Pedro Oliveira', 2022, '2022-01-15', '2022-12-31', 'Líder reconhecido pela comunidade maçônica, especialista em rituais tradicionais.', 'Organizou 12 palestras públicas, estabeleceu parcerias com 5 instituições', false, 3),
('Irmão Roberto Lima', 2021, '2021-01-15', '2021-12-31', 'Venerável conhecido por sua dedicação à educação maçônica.', 'Criou biblioteca digital, formou 20 novos mestres maçons', false, 4),
('Irmão Antonio Costa', 2020, '2020-01-15', '2020-12-31', 'Líder durante período desafiador da pandemia, manteve união da loja.', 'Adaptou rituais para formato híbrido, manteve 95% de engajamento dos membros', false, 5),
('Irmão Francisco Mendes', 2019, '2019-01-15', '2019-12-31', 'Venerável focado em projetos sociais e beneficentes da comunidade.', 'Arrecadou R$ 50.000 para caridade, organizou 8 campanhas sociais', false, 6);