import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Attendance {
  id: string;
  session_id: string;
  profile_id: string;
  is_present: boolean;
  position_override: string | null;
  created_at: string;
  updated_at: string;
}

export interface AttendanceWithProfile extends Attendance {
  profiles: {
    id: string;
    cim: string | null;
    full_name: string | null;
    position: string | null;
  };
}

export const useAttendances = (sessionId?: string) => {
  const [attendances, setAttendances] = useState<AttendanceWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAttendances = async () => {
    try {
      let query = supabase
        .from("session_attendances")
        .select(`
          *,
          profiles (
            id,
            cim,
            full_name,
            position
          )
        `)
        .order("created_at", { ascending: false });

      if (sessionId) {
        query = query.eq("session_id", sessionId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAttendances(data || []);
    } catch (error) {
      console.error("Error loading attendances:", error);
      toast.error("Erro ao carregar presenças");
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = async (sessionId: string, profileId: string, isPresent: boolean) => {
    try {
      // Check if attendance record exists
      const { data: existing } = await supabase
        .from("session_attendances")
        .select("id")
        .eq("session_id", sessionId)
        .eq("profile_id", profileId)
        .maybeSingle();

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from("session_attendances")
          .update({ is_present: isPresent })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        // Create new record - fetch profile position to use as default
        const { data: profileData } = await supabase
          .from("profiles")
          .select("position")
          .eq("id", profileId)
          .single();

        const { error } = await supabase
          .from("session_attendances")
          .insert({
            session_id: sessionId,
            profile_id: profileId,
            is_present: isPresent,
            position_override: profileData?.position || null,
          });

        if (error) throw error;
      }

      await loadAttendances();
    } catch (error) {
      console.error("Error toggling attendance:", error);
      toast.error("Erro ao atualizar presença");
      throw error;
    }
  };

  const updatePosition = async (id: string, positionOverride: string | null) => {
    try {
      const { error } = await supabase
        .from("session_attendances")
        .update({ position_override: positionOverride })
        .eq("id", id);

      if (error) throw error;
      
      await loadAttendances();
    } catch (error) {
      console.error("Error updating position:", error);
      toast.error("Erro ao atualizar posição");
      throw error;
    }
  };

  const removeAttendance = async (id: string) => {
    try {
      const { error } = await supabase
        .from("session_attendances")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Presença removida com sucesso!");
      await loadAttendances();
    } catch (error) {
      console.error("Error removing attendance:", error);
      toast.error("Erro ao remover presença");
      throw error;
    }
  };

  useEffect(() => {
    loadAttendances();
  }, [sessionId]);

  return {
    attendances,
    loading,
    toggleAttendance,
    updatePosition,
    removeAttendance,
    reload: loadAttendances,
  };
};
