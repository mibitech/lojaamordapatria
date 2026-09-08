import { supabase } from '@/integrations/supabase/client';
import type {
  MasterOfficer,
  OfficerPosition,
  WorshipfulMaster,
} from '@/types/worshipfulMasters.types';
import { positionRank } from '@/types/worshipfulMasters.types';

const MASTER_COLUMNS =
  'id, name, photo_url, installation_year, term_start_date, term_end_date, bio, achievements, is_active, sort_order';

const OFFICER_COLUMNS =
  'id, master_id, position, profile_id, person_name, photo_url, sort_order, profile:profiles(id, full_name, photo_url, cim)';

export const fetchWorshipfulMasters = async (): Promise<WorshipfulMaster[]> => {
  const { data, error } = await supabase
    .from('worshipful_masters')
    .select(MASTER_COLUMNS)
    .order('installation_year', { ascending: false });

  if (error) throw error;
  return (data ?? []) as WorshipfulMaster[];
};

export const fetchOfficersByMaster = async (masterId: string): Promise<MasterOfficer[]> => {
  const { data, error } = await supabase
    .from('worshipful_master_officers')
    .select(OFFICER_COLUMNS)
    .eq('master_id', masterId);

  if (error) throw error;

  // Ordena pela hierarquia dos cargos, não pela ordem que veio do banco
  return ((data ?? []) as unknown as MasterOfficer[]).sort(
    (a, b) => positionRank(a.position) - positionRank(b.position)
  );
};

export interface UpsertOfficerInput {
  master_id: string;
  position: OfficerPosition;
  profile_id?: string | null;
  person_name?: string | null;
  photo_url?: string | null;
}

export const upsertOfficer = async (input: UpsertOfficerInput) => {
  const { error } = await supabase
    .from('worshipful_master_officers')
    .upsert(
      { ...input, sort_order: positionRank(input.position) },
      { onConflict: 'master_id,position' }
    );

  if (error) throw error;
};

export const deleteOfficer = async (officerId: string) => {
  const { error } = await supabase
    .from('worshipful_master_officers')
    .delete()
    .eq('id', officerId);

  if (error) throw error;
};

/** Sobe a foto de um oficial que não faz parte do quadro de membros. */
export const uploadOfficerPhoto = async (masterId: string, position: OfficerPosition, file: File) => {
  const extension = file.name.split('.').pop();
  const filePath = `officers/${masterId}/${position}-${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from('masters')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from('masters').getPublicUrl(filePath);

  return publicUrl;
};
