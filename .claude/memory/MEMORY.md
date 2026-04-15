# MEMORY — Loja Amor da Pátria

> Índice de memórias persistentes do projeto. Atualizar a cada sessão com info nova e durável.
> Não repetir o que já consta em `CLAUDE.md`, `docs/prd.md` ou `docs/backlog.md`.

---

## Sessões

- [Sessão 2026-04-15](sessao_atual.md) — Planejamento: geração do CLAUDE.md com 16 seções; Sprint 1 mapeado; zero código alterado

---

## Decisões arquiteturais em aberto

| Decisão | Contexto | Sprint |
|---------|---------|--------|
| Parser OFX: `ofx-js` vs implementação própria | Bundle vs controle; OFX é XML-like com poucos campos necessários | Sprint 5 |
| PDF: `jsPDF` (client) vs Edge Function (server) | Edge garante layout consistente; client é mais simples de deploy | Sprint 5 |
| Virtualização: `react-window` vs `react-virtual` | Benchmark com listas reais da loja antes de decidir | Sprint 3 |

---

## Arquivos críticos do Sprint 1 (ainda não alterados)

| Arquivo | Problema | Story |
|---------|---------|-------|
| `src/pages/CommissionSecretary.tsx` | 6 chamadas `supabase.from()` diretas na View | A-1 |
| `src/components/chancellery/ChancelleryAttendanceReport.tsx` | 4 selects Supabase diretos na View | A-2 |
| `src/pages/UserWorks.tsx` | Mutations diretas na View sem passar pelo hook | A-3 |
| `src/hooks/useFinancialData.ts` | 14 instâncias `as any` | B-1 |
| `src/hooks/useSecretary.ts` | 6 instâncias `as any` | B-2 |
| `src/hooks/useHospitalaria.ts` | 4 instâncias `as any` | B-3 |
| `src/hooks/useAuditLog.ts` | 2 instâncias `as any` | B-3 |
| `src/pages/CommissionVisitors.tsx` linhas 295–408 | Campos de telefone duplicados no formulário | G-4 |
| `src/integrations/supabase/client.ts` | Verificar uso de `import.meta.env.VITE_*` | H-1 |

---

## Preferências do usuário (Ricardo Lopes)

- Respostas sempre em **português brasileiro**
- Tom direto e técnico — sem rodeios, sem emojis, sem resumos prolixos
- Prefere ver ação e código; não quer explicação teórica antes do resultado
- Referências a arquivos como links clicáveis `[arquivo.ts](caminho/arquivo.ts)`
- `pnpm` sempre — nunca `npm` ou `yarn`
