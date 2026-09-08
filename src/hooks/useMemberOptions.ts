import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MemberOption {
  id: string;
  full_name: string;
  cim: string | null;
}

/**
 * Lista enxuta de irmãos para preencher seletores de nome.
 * Traz só as colunas necessárias — useProfiles faz select('*') e carrega
 * muito mais do que um combobox precisa.
 */
export const useMemberOptions = () => {
  const [members, setMembers] = useState<MemberOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, cim')
        .not('full_name', 'is', null)
        .order('full_name', { ascending: true });

      if (!active) return;

      if (error) {
        console.error('Erro ao carregar irmãos:', error);
        setMembers([]);
      } else {
        setMembers((data ?? []) as MemberOption[]);
      }
      setLoading(false);
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  return { members, loading };
};
