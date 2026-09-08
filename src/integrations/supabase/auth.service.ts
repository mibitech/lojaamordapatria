import { supabase } from '@/integrations/supabase/client';

// Domínio .local de propósito: nunca resolve em DNS, então nenhum e-mail
// sintético pode gerar envio real ou bounce no domínio da loja.
const CIM_LOGIN_DOMAIN = 'lojaamordapatria.local';

/**
 * Monta o e-mail sintético usado internamente pelo Supabase Auth.
 * O usuário nunca vê ou digita esse e-mail — o login é feito só com CIM.
 */
export const buildCimLoginEmail = (cim: string) => `${cim}@${CIM_LOGIN_DOMAIN}`;

export const signInWithCim = async (cim: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: buildCimLoginEmail(cim),
    password,
  });
  return { data, error };
};

export const changePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return { error };
};
