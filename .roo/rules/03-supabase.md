# Supabase Integration
- Cliente separado por ambiente: src/lib/supabase/client.ts
- Nunca acesse Supabase diretamente em componentes para lógica complexa; use Edge Functions
- Habilite RLS e Supabase Auth desde o primeiro dia
- Chaves secretas apenas em variáveis de ambiente (.env / .env.local)
- Use chave anon apenas no client-side; service_role somente em Edge Functions
- Valide todas as entradas nas Edge Functions com zod
- Retorne apenas os campos estritamente necessários do banco
- Use auth.uid() ou request.auth nas regras RLS