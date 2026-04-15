# Sessão — 2026-04-15

## ✅ O que foi feito hoje

1. **Leitura e análise completa de `docs/prd.md` e `docs/backlog.md`**
   - PRD: 8 épicos, 25+ rotas, 40+ tabelas Supabase, regras de negócio por papel
   - Backlog: 11 épicos (A–K), 69 user stories, 6 sprints planejados, tag alvo `v1.1.0`

2. **Geração do `CLAUDE.md` completo na raiz** com 16 seções:
   - Cabeçalho + referências obrigatórias
   - Objetivo do Sprint 1 com critérios de aceite
   - Roadmap de 6 sprints com tags e status
   - Contexto de negócio, OKRs, público-alvo
   - Regras globais (commits, segurança, QA, agentes)
   - Status do projeto (concluído / bloqueantes / decisões / próximos)
   - Chaves e configuração
   - Stack técnica + princípios MVC em tabela
   - MCPs disponíveis com exemplos
   - Próximas ações do Sprint 1 com checkboxes por ID de US
   - Comunicação, boas práticas, modelagem de dados
   - Gatilhos de atualização e status da sessão

3. **Criação de memórias persistentes** em `C:\Users\rlcun\.claude\projects\...\memory\`:
   - `user_profile.md` — perfil e preferências do Ricardo
   - `project_sprint1.md` — arquivos críticos do Sprint 1
   - `feedback_communication.md` — estilo PT-BR, direto, sem emojis

---

## ❌ O que ficou pendente

Nenhuma task de código foi executada nesta sessão — foi sessão de planejamento e documentação.

### Sprint 1 — todas as tasks ainda abertas:
| ID | Task | Arquivo |
|----|------|---------|
| A-1 | Extrair 6 chamadas Supabase → `useSecretary.ts` | `CommissionSecretary.tsx` |
| A-2 | Criar `useChancellery.ts` com 4 selects | `ChancelleryAttendanceReport.tsx` |
| A-3 | Mover mutations → `useUserWorks.ts` | `UserWorks.tsx` |
| A-4 | Criar camada `services/` com funções async puras | Novo |
| A-5 | Auditar 38 arquivos em `src/pages/` para violações MVC | `src/pages/` |
| B-1 | Tipar `useFinancialData.ts` — 14x `as any` | `src/hooks/useFinancialData.ts` |
| B-2 | Interfaces para `useSecretary.ts` — 6x `as any` | `src/hooks/useSecretary.ts` |
| B-3 | Tipar `useHospitalaria.ts` (4) e `useAuditLog.ts` (2) | `src/hooks/` |
| G-4 | Corrigir campos duplicados de telefone | `CommissionVisitors.tsx` linhas 295–408 |
| H-1 | Verificar `import.meta.env.VITE_*` no client | `src/integrations/supabase/client.ts` |

---

## 🎯 Próximo passo exato

**Iniciar com H-1** (menor risco, menor escopo — validação em 5 minutos):

```bash
# 1. Ler o arquivo
src/integrations/supabase/client.ts

# 2. Verificar se usa apenas import.meta.env.VITE_*
# 3. Se ok → marcar H-1 ✅ e partir para G-4 (bug de UX, ~1h)
# 4. Depois A-1 → leia CommissionSecretary.tsx antes de editar
```

Ordem recomendada para próxima sessão:
`H-1` → `G-4` → `A-1` → `A-2` → `A-3` → `B-1` → `B-2` → `B-3`

---

## 💡 Decisões arquiteturais

| Decisão | Justificativa | Registrar em |
|---------|--------------|-------------|
| Ordem MVC: types → service → hook → page | Evitar dependências circulares e manter camadas isoladas | `.claude/rules/architecture.md` (já documentado) |
| Conciliação bancária (Sprint 5): `ofx-js` vs implementação própria | OFX é XML-like — avaliar tamanho do bundle antes de decidir | `docs/decisions/` quando Sprint 5 iniciar |
| Geração de PDF: `jsPDF` vs Edge Function | Edge Function garante consistência de layout; client-side é mais simples | `docs/decisions/` quando Sprint 5 iniciar |
| Virtualização: `react-window` vs `react-virtual` | Decidir no Sprint 3 baseado no benchmark de listas reais da loja | `docs/decisions/` quando Sprint 3 iniciar |
