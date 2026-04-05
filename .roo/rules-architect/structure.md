# Decisões Arquiteturais
- Documente decisões importantes no README.md ou em docs/
- Prefira Edge Functions do Supabase para lógica de backend sensível
- Evite bibliotecas de estado complexas sem necessidade comprovada
- Separe configurações de ambiente explicitamente

## Validação MVC em Code Reviews
- Verifique se nenhum componente View importa diretamente de services/
- Verifique se controllers (hooks) não contêm JSX
- Verifique se models/types não importam de controllers ou views
- A dependência deve fluir em uma direção: View → Controller → Service → Supabase
Fluxo de dependência (regra de ouro)
text
View  →  Controller (hook)  →  Service  →  Supabase/API
 [V]           [C]               [M]           [externo]
Nunca o sentido inverso. Qualquer violação (ex: fetch dentro de um componente View) deve ser refatorada para o controller correspondente.