import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { useSessions } from "@/hooks/useSessions";
import { useAttendances } from "@/hooks/useAttendances";
import { useProfiles } from "@/hooks/useProfiles";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

// Lista de posições maçônicas comuns
const MASONIC_POSITIONS = [
  "Venerável Mestre",
  "1º Vigilante",
  "2º Vigilante",
  "Orador",
  "Secretário",
  "Tesoureiro",
  "Chanceler",
  "Mestre de Cerimônias",
  "Hospitaleiro",
  "1º Diácono",
  "2º Diácono",
  "1º Experto",
  "2º Experto",
  "Porta-Estandarte",
  "Porta-Espada",
  "Mestre de Harmonia",
  "Bibliotecário",
  "Cobrador Interno",
  "Cobrador Externo",
  "Guarda do Templo",
];

const CommissionAttendances: React.FC = () => {
  const { sessions } = useSessions();
  const { profiles } = useProfiles();
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const { attendances, loading, toggleAttendance, updatePosition, removeAttendance, reload } = useAttendances(selectedSessionId);

  const selectedSession = sessions.find(s => s.id === selectedSessionId);

  const handleTogglePresence = async (profileId: string, currentState: boolean) => {
    if (!selectedSessionId) {
      toast.error("Selecione uma sessão primeiro");
      return;
    }
    await toggleAttendance(selectedSessionId, profileId, !currentState);
  };

  const handleRemoveAttendance = async (attendanceId: string) => {
    await removeAttendance(attendanceId);
  };

  const handleUpdatePosition = async (attendanceId: string, position: string) => {
    await updatePosition(attendanceId, position);
  };

  // Get attendance state for a profile
  const getAttendanceState = (profileId: string) => {
    const attendance = attendances.find(a => a.profile_id === profileId);
    return attendance?.is_present || false;
  };

  // Get position for display
  const getDisplayPosition = (profileId: string) => {
    const attendance = attendances.find(a => a.profile_id === profileId);
    if (attendance?.position_override) {
      return attendance.position_override;
    }
    const profile = profiles.find(p => p.id === profileId);
    return profile?.position || "";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Presenças</h2>
        <p className="text-muted-foreground">Gerencie as presenças dos membros nas sessões</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="session">Selecione a Sessão</Label>
            <Select value={selectedSessionId} onValueChange={setSelectedSessionId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma sessão" />
              </SelectTrigger>
              <SelectContent>
                {sessions.map((session) => (
                  <SelectItem key={session.id} value={session.id}>
                    {format(new Date(session.session_datetime), "dd/MM/yyyy HH:mm", { locale: ptBR })} - {session.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSession && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div>
                <span className="font-medium">Data de Início:</span>{" "}
                {format(new Date(selectedSession.session_datetime), "dd/MM/yyyy", { locale: ptBR })}
              </div>
              <div>
                <span className="font-medium">Horário:</span>{" "}
                {format(new Date(selectedSession.session_datetime), "HH:mm", { locale: ptBR })}
              </div>
              <div>
                <span className="font-medium">Grau da Sessão:</span> {selectedSession.session_degree}
              </div>
              <div>
                <span className="font-medium">Título:</span> {selectedSession.title}
              </div>
              {selectedSession.description && (
                <div className="md:col-span-2">
                  <span className="font-medium">Descrição:</span> {selectedSession.description}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedSessionId && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Maçons presentes nesta Sessão:</h3>
            
            {loading ? (
              <div className="text-center py-8">Carregando...</div>
            ) : profiles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum membro cadastrado.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Presente</TableHead>
                      <TableHead>Nome Completo</TableHead>
                      <TableHead>Nome de Tratamento</TableHead>
                      <TableHead className="w-[100px] text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.map((profile) => {
                      const isPresent = getAttendanceState(profile.id);
                      const attendance = attendances.find(a => a.profile_id === profile.id);
                      const displayPosition = getDisplayPosition(profile.id);
                      
                      return (
                        <TableRow key={profile.id}>
                          <TableCell>
                            <Checkbox
                              checked={isPresent}
                              onCheckedChange={() => handleTogglePresence(profile.id, isPresent)}
                            />
                          </TableCell>
                          <TableCell>{profile.full_name || "-"}</TableCell>
                          <TableCell>
                            {attendance ? (
                              <Select
                                value={displayPosition}
                                onValueChange={(value) => handleUpdatePosition(attendance.id, value)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Selecione a posição" />
                                </SelectTrigger>
                                <SelectContent className="bg-background z-50">
                                  {MASONIC_POSITIONS.map((position) => (
                                    <SelectItem key={position} value={position}>
                                      {position}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <span className="text-muted-foreground">{displayPosition || "-"}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {attendance && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveAttendance(attendance.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommissionAttendances;
