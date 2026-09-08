# scripts/seed-members.mjs

Provisiona usuários do sistema (login por CIM + senha) a partir de
`scripts/seed-members.json`. Roda localmente ou no servidor de deploy —
nunca faz parte do bundle do client.

## Antes de rodar

1. `scripts/seed-members.json` (veja `seed-members.example.json` para o formato)
   contém CPFs reais e **não é versionado** (está no `.gitignore`).
2. Defina as variáveis com a **service_role key** (Project Settings → API).
   Essa chave nunca deve ir para `src/`, `.env.local` do client nem para o repo.

```bash
export SUPABASE_URL="https://SEU_PROJETO.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key"
```

3. Em Authentication → Providers → Email, desligue **"Confirm email"**
   (`mailer_autoconfirm: true`). Sem isso o usuário nasce com login travado,
   já que o e-mail sintético nunca recebe a confirmação.

## Uso

```bash
# 1. Validar os dados sem gravar nada
node scripts/seed-members.mjs --dry-run

# 2. Rodar de fato (mantém usuários existentes)
node scripts/seed-members.mjs

# 3. Apagar TODOS os usuários atuais antes de semear
node scripts/seed-members.mjs --wipe --dry-run   # confira o plano primeiro
node scripts/seed-members.mjs --wipe             # execute
```

**`--wipe` é destrutivo e irreversível sem backup.** A cascata das FKs apaga
junto tudo que estiver vinculado aos usuários: frequência em sessões, datas
comemorativas, casos de hospitalaria, trabalhos, mensagens e empréstimos.
Faça backup antes (`supabase db dump`) e meça o impacto com uma query de
contagem — não confie na estimativa.

## O que o script faz

- Login = CIM (6 dígitos). Senha inicial = 6 primeiros dígitos do CPF.
- CPF pode vir com máscara (`000.000.000-00`) — o script limpa antes de cortar.
- E-mail sintético interno: `{cim}@lojaamordapatria.local`. O domínio `.local`
  nunca resolve em DNS, então nenhum envio real ou bounce é possível. Esse
  e-mail nunca aparece na UI e não se confunde com `profiles.email` (contato).
- Marca `profiles.must_change_password = true` — o app força a troca da senha
  inicial no primeiro acesso.
- Para os CIMs em `ADMIN_CIMS` (topo do script): papel `admin` em `user_roles`
  **e** `profiles.is_director_member = true`. Os dois são necessários: o papel
  libera as permissões, mas quem faz o menu de área restrita aparecer é o
  `is_director_member`.
- Valida antes de gravar: CIM de 6 dígitos, sem duplicidade, CPF com pelo menos
  6 dígitos. Qualquer falha aborta antes de tocar no banco.

## Particularidades desta base

- **Trigger `on_auth_user_created`**: criar um usuário no Auth já cria a linha
  em `profiles` automaticamente (função `handle_new_user`). O script faz
  `UPDATE`, não `INSERT` — um insert colide com `profiles_user_id_key`.
- **`profiles.user_id` não tem FK** para `auth.users`. Apagar usuários **não**
  remove perfis; eles ficam órfãos e precisam ser apagados explicitamente.
- **14 FKs restritivas** apontam para `profiles` (artigos, hospitalaria,
  relatórios de cargo, certificados, documentos, auditoria, transações). Elas
  bloqueiam a exclusão de perfis enquanto houver registros vinculados —
  `--wipe` falha até que esses registros sejam desvinculados ou removidos.
- O trigger grava o e-mail de login em `profiles.email`; o script limpa esse
  campo, que é para o e-mail de **contato** do irmão.
