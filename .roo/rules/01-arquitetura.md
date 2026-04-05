# Arquitetura — Padrão MVC

Você é expert em TypeScript, Node.js, Vite/React, Supabase, Shadcn UI, Radix UI e Tailwind.
Siga rigorosamente o padrão MVC adaptado para React/Vite descrito abaixo.

## Mapeamento MVC

| Camada | Localização | Responsabilidade |
|--------|-------------|------------------|
| **Model** | `models/`, `services/`, `src/lib/`, `src/types/` | Tipos, schemas zod, chamadas Supabase |
| **Controller** | `controllers/use{Feature}.ts` | Hooks que orquestram estado e services |
| **View** | `views/`, `src/components/` | Componentes visuais puros, sem lógica de negócio |

## Estrutura de Diretórios
src/
├── features/
│ └── {feature}/ # ex: auth, dashboard, billing
│ ├── models/ # [M] tipos, interfaces, schemas zod
│ │ └── {feature}.types.ts
│ ├── services/ # [M] acesso ao Supabase e APIs externas
│ │ └── {feature}.service.ts
│ ├── controllers/ # [C] hooks que orquestram estado e services
│ │ └── use{Feature}.ts
│ └── views/ # [V] componentes puramente visuais
│ ├── {Feature}Page.tsx
│ └── {Feature}Card.tsx
├── components/ # [V] componentes globais reutilizáveis
│ └── ui/ # [V] primitivos genéricos (Shadcn)
├── lib/ # [M] instância Supabase, utilitários globais
│ └── supabase/
│ └── client.ts
└── types/ # [M] tipos globais compartilhados

text

## Regras MVC Obrigatórias

### Model (`models/` e `services/`)
- Defina todos os tipos e interfaces em `{feature}.types.ts`
- Toda interação com o Supabase fica em `{feature}.service.ts`
- Nunca importe lógica de serviço diretamente em componentes View
- Use zod para validar dados na entrada dos services
- Services são funções puras async; sem estado React

### Controller (`controllers/`)
- Controllers são custom hooks: `use{Feature}.ts` (ex: useAuth, useDashboard)
- O hook é o único que importa services e expõe dados tratados para a View
- Gerencie estado (useState, useReducer), side effects (useEffect) e erros aqui
- Exponha apenas o necessário para a View: dados formatados + handlers tipados
- Nunca coloque JSX no controller

### View (`views/` e `src/components/`)
- Componentes de View recebem apenas props tipadas; sem acesso direto a services
- Sem useEffect, sem chamadas fetch/Supabase — apenas renderização
- Props devem ser explicitamente tipadas com interface
- Use Shadcn UI e Tailwind para estilização
- Estrutura de arquivo: componente exportado → subcomponentes → helpers → tipos

## Nomenclatura

- Diretórios: minúsculas com hífens (ex: `auth-wizard`)
- Services: `{feature}.service.ts`
- Controllers (hooks): `use{Feature}.ts` com PascalCase na feature
- Views: `{Feature}Page.tsx`, `{Feature}Card.tsx`, `{Feature}Form.tsx`
- Named exports para todos os componentes e funções
- Prefira interfaces para tipos de objetos e props
- Evite enums; use objetos literais ou uniões de strings
- Variáveis com verbos auxiliares: `isLoading`, `hasError`, `canSubmit`

## Fluxo de Dependência (regra de ouro)
View → Controller (hook) → Service → Supabase/API
[V] [C] [M] [externo]

text

A dependência flui em uma única direção. Qualquer violação deve ser refatorada imediatamente.
Migrations e Edge Functions ficam em `supabase/` na raiz do projeto.