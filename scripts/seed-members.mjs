// Script de provisionamento único: cria usuários (auth.users + profiles + user_roles)
// a partir de scripts/seed-members.json, usando CIM como login e os 6 primeiros dígitos
// do CPF como senha inicial.
//
// Uso:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-members.mjs
//   node scripts/seed-members.mjs --wipe     (apaga TODOS os usuários atuais antes de semear)
//   node scripts/seed-members.mjs --dry-run  (só valida e imprime o plano, não grava nada)
//
// NUNCA rode com a service_role key fora do seu ambiente local/servidor de deploy.
// Esta chave nunca deve ir para src/ nem para o bundle do client.

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const LOGIN_DOMAIN = 'lojaamordapatria.local';

const ADMIN_CIMS = new Set(['324040']);

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const shouldWipe = args.includes('--wipe');

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente antes de rodar.');
  process.exit(1);
}

const members = JSON.parse(readFileSync(path.join(__dirname, 'seed-members.json'), 'utf-8'));

// --- Validação: falha alto antes de tocar no banco ---
const cimSeen = new Set();
const errors = [];

for (const m of members) {
  if (!/^\d{6}$/.test(m.cim)) {
    errors.push(`CIM inválido para "${m.full_name}": "${m.cim}" (precisa ter exatamente 6 dígitos)`);
    continue;
  }
  if (cimSeen.has(m.cim)) {
    errors.push(`CIM duplicado: ${m.cim} (${m.full_name})`);
  }
  cimSeen.add(m.cim);

  // CPF vem com máscara nesta planilha (000.000.000-00) — limpar antes de medir
  const cpfDigits = (m.cpf || '').replace(/\D/g, '');
  if (cpfDigits.length < 6) {
    errors.push(`CPF muito curto para "${m.full_name}": "${m.cpf}"`);
  }
}

if (errors.length > 0) {
  console.error('Falha na validação dos dados de entrada:');
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}

console.log(`Validação ok: ${members.length} membros, sem duplicidade de CIM.`);

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const buildLoginEmail = (cim) => `${cim}@${LOGIN_DOMAIN}`;
const buildInitialPassword = (cpf) => cpf.replace(/\D/g, '').slice(0, 6);

async function wipeAllUsers() {
  console.log('--wipe: apagando todos os usuários atuais (auth.users)...');
  let totalDeleted = 0;
  const failed = [];

  // Uma passada só: listar e tentar apagar cada um. NÃO relistar em loop —
  // FKs restritivas (financial_transactions.created_by e cia, sem CASCADE)
  // fazem o delete falhar de forma permanente, e relistar giraria para sempre.
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw error;

  for (const u of data.users) {
    if (isDryRun) {
      console.log(`  [dry-run] apagaria ${u.email} (${u.id})`);
      continue;
    }
    const { error: delError } = await supabase.auth.admin.deleteUser(u.id);
    if (delError) {
      console.error(`  FALHA ao apagar ${u.email}: ${delError.message}`);
      failed.push({ email: u.email, id: u.id, motivo: delError.message });
    } else {
      totalDeleted++;
    }
  }

  console.log(`Usuários apagados: ${totalDeleted}`);

  if (failed.length > 0) {
    console.error(`\n${failed.length} usuário(s) NÃO puderam ser apagados:`);
    failed.forEach((f) => console.error(`  - ${f.email}: ${f.motivo}`));
    console.error('\nAbortando antes de semear: apagar parcialmente e criar por cima');
    console.error('deixaria a base num estado misto. Resolva os vínculos e rode de novo.');
    process.exit(1);
  }

  // Perfis órfãos: importados via CSV sem user_id, não somem pela cascata de auth.users
  if (!isDryRun) {
    const { error } = await supabase.from('profiles').delete().is('user_id', null);
    if (error) console.error('  Falha ao limpar perfis órfãos:', error.message);
  }
}

async function seedMember(member) {
  const email = buildLoginEmail(member.cim);
  const password = buildInitialPassword(member.cpf);
  const isAdmin = ADMIN_CIMS.has(member.cim);

  if (isDryRun) {
    console.log(`  [dry-run] criaria ${member.full_name} — CIM ${member.cim} — senha ${password} — ${isAdmin ? 'ADMIN' : 'member'}`);
    return;
  }

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: member.full_name, cim: member.cim },
  });

  if (createError) {
    console.error(`  Falha ao criar usuário para ${member.full_name} (CIM ${member.cim}):`, createError.message);
    return;
  }

  const userId = created.user.id;

  // O trigger on_auth_user_created (handle_new_user) JÁ cria a linha em
  // profiles com full_name e o e-mail de login. Por isso aqui é UPDATE, não
  // INSERT — um insert colide com profiles_user_id_key. Completamos os campos
  // que o trigger não conhece e limpamos o e-mail sintético, que não deve
  // aparecer como e-mail de contato do irmão.
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      cim: member.cim,
      full_name: member.full_name,
      must_change_password: true,
      member_status: 'Ativo',
      email: null,
      // O menu de área restrita depende de is_director_member, não do papel em
      // user_roles — sem isto o admin loga mas não enxerga as telas de comissão.
      is_director_member: isAdmin,
    })
    .eq('user_id', userId);

  if (profileError) {
    console.error(`  Falha ao gravar profile de ${member.full_name}:`, profileError.message);
    return;
  }

  const roles = isAdmin ? ['admin', 'member'] : ['member'];
  for (const role of roles) {
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert({ user_id: userId, role }, { onConflict: 'user_id,role' });
    if (roleError) {
      console.error(`  Falha ao atribuir role "${role}" a ${member.full_name}:`, roleError.message);
    }
  }

  console.log(`  OK: ${member.full_name} — CIM ${member.cim}${isAdmin ? ' — ADMIN' : ''}`);
}

async function main() {
  if (shouldWipe) {
    await wipeAllUsers();
  }

  console.log(`Semeando ${members.length} membros${isDryRun ? ' (dry-run)' : ''}...`);
  for (const member of members) {
    await seedMember(member);
  }
  console.log('Concluído.');
}

main().catch((err) => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
