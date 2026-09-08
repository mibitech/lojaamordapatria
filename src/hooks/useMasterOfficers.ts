import { useCallback, useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import {
  deleteOfficer,
  fetchOfficersByMaster,
  upsertOfficer,
  uploadOfficerPhoto,
} from '@/services/worshipfulMasters.service';
import type { MasterOfficer, OfficerPosition } from '@/types/worshipfulMasters.types';

export interface OfficerDraft {
  /** id da linha existente; ausente quando o cargo ainda não foi gravado */
  id?: string;
  profileId: string | null;
  name: string;
  photoUrl: string | null;
  /** foto nova escolhida no formulário, ainda não enviada */
  photoFile?: File | null;
}

export type OfficerDraftMap = Partial<Record<OfficerPosition, OfficerDraft>>;

const toDraft = (officer: MasterOfficer): OfficerDraft => ({
  id: officer.id,
  profileId: officer.profile_id ?? null,
  name: officer.profile?.full_name ?? officer.person_name ?? '',
  photoUrl: officer.profile?.photo_url ?? officer.photo_url ?? null,
});

export const useMasterOfficers = (masterId: string | null) => {
  const [drafts, setDrafts] = useState<OfficerDraftMap>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!masterId) {
      setDrafts({});
      return;
    }

    try {
      setLoading(true);
      const officers = await fetchOfficersByMaster(masterId);
      const map: OfficerDraftMap = {};
      officers.forEach((officer) => {
        map[officer.position] = toDraft(officer);
      });
      setDrafts(map);
    } catch (error) {
      console.error('Erro ao carregar diretoria:', error);
      toast({
        title: 'Erro ao carregar diretoria',
        description: 'Não foi possível carregar os cargos desta gestão.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [masterId]);

  useEffect(() => {
    load();
  }, [load]);

  const setDraft = (position: OfficerPosition, patch: Partial<OfficerDraft>) =>
    setDrafts((current) => ({
      ...current,
      [position]: {
        profileId: null,
        name: '',
        photoUrl: null,
        ...current[position],
        ...patch,
      },
    }));

  const clearDraft = (position: OfficerPosition) =>
    setDrafts((current) => {
      const next = { ...current };
      delete next[position];
      return next;
    });

  const save = async () => {
    if (!masterId) return false;

    try {
      setSaving(true);
      const positions = Object.keys(drafts) as OfficerPosition[];

      for (const position of positions) {
        const draft = drafts[position];
        if (!draft) continue;

        const hasPerson = Boolean(draft.profileId) || Boolean(draft.name.trim());

        // Cargo esvaziado: remove a linha se ela já existia
        if (!hasPerson) {
          if (draft.id) await deleteOfficer(draft.id);
          continue;
        }

        let photoUrl = draft.photoUrl;
        if (draft.photoFile) {
          photoUrl = await uploadOfficerPhoto(masterId, position, draft.photoFile);
        }

        await upsertOfficer({
          master_id: masterId,
          position,
          profile_id: draft.profileId,
          // Quando vem do cadastro, o nome sai de profiles — não duplicar aqui
          person_name: draft.profileId ? null : draft.name.trim(),
          photo_url: draft.profileId ? null : photoUrl,
        });
      }

      // Remove cargos que existiam no banco e sumiram do formulário
      const existing = await fetchOfficersByMaster(masterId);
      for (const officer of existing) {
        if (!drafts[officer.position]) {
          await deleteOfficer(officer.id);
        }
      }

      toast({
        title: 'Diretoria salva',
        description: 'Os cargos desta gestão foram atualizados.',
      });

      await load();
      return true;
    } catch (error) {
      console.error('Erro ao salvar diretoria:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar a diretoria.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { drafts, loading, saving, setDraft, clearDraft, save, reload: load };
};
