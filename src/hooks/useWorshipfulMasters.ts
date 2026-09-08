import { useCallback, useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import {
  fetchOfficersByMaster,
  fetchWorshipfulMasters,
} from '@/services/worshipfulMasters.service';
import type { MasterOfficer, WorshipfulMaster } from '@/types/worshipfulMasters.types';

export const useWorshipfulMasters = () => {
  const [masters, setMasters] = useState<WorshipfulMaster[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedMasterId, setSelectedMasterId] = useState<string | null>(null);
  const [officers, setOfficers] = useState<MasterOfficer[]>([]);
  const [loadingOfficers, setLoadingOfficers] = useState(false);

  const loadMasters = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchWorshipfulMasters();
      setMasters(data);
    } catch (error) {
      console.error('Erro ao carregar veneráveis:', error);
      toast({
        title: 'Erro ao carregar dados',
        description: 'Não foi possível carregar o quadro de veneráveis.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOfficers = useCallback(async (masterId: string) => {
    try {
      setLoadingOfficers(true);
      const data = await fetchOfficersByMaster(masterId);
      setOfficers(data);
    } catch (error) {
      console.error('Erro ao carregar diretoria:', error);
      toast({
        title: 'Erro ao carregar diretoria',
        description: 'Não foi possível carregar a diretoria desta administração.',
        variant: 'destructive',
      });
      setOfficers([]);
    } finally {
      setLoadingOfficers(false);
    }
  }, []);

  useEffect(() => {
    loadMasters();
  }, [loadMasters]);

  // A diretoria só é buscada quando uma administração é selecionada
  useEffect(() => {
    if (!selectedMasterId) {
      setOfficers([]);
      return;
    }
    loadOfficers(selectedMasterId);
  }, [selectedMasterId, loadOfficers]);

  const selectedMaster = masters.find((m) => m.id === selectedMasterId) ?? null;

  const selectMaster = (masterId: string) =>
    setSelectedMasterId((current) => (current === masterId ? null : masterId));

  return {
    masters,
    loading,
    selectedMaster,
    selectedMasterId,
    selectMaster,
    officers,
    loadingOfficers,
    reloadOfficers: () => selectedMasterId && loadOfficers(selectedMasterId),
    reloadMasters: loadMasters,
  };
};
