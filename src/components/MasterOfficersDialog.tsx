import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Upload, X, UserCheck } from 'lucide-react';
import { MemberNameCombobox } from '@/components/MemberNameCombobox';
import { useMasterOfficers } from '@/hooks/useMasterOfficers';
import {
  POSITION_LABELS,
  POSITION_ORDER,
  formatTerm,
  type OfficerPosition,
} from '@/types/worshipfulMasters.types';

interface MasterOfficersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  masterId: string | null;
  masterName: string;
  installationYear: number;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

export const MasterOfficersDialog: React.FC<MasterOfficersDialogProps> = ({
  open,
  onOpenChange,
  masterId,
  masterName,
  installationYear,
}) => {
  const { drafts, loading, saving, setDraft, clearDraft, save } = useMasterOfficers(
    open ? masterId : null
  );

  const handleSave = async () => {
    const ok = await save();
    if (ok) onOpenChange(false);
  };

  const renderRow = (position: OfficerPosition) => {
    const draft = drafts[position];
    const label = POSITION_LABELS[position];
    const name = draft?.name ?? '';
    const isMember = Boolean(draft?.profileId);
    const previewPhoto = draft?.photoFile
      ? URL.createObjectURL(draft.photoFile)
      : draft?.photoUrl ?? undefined;

    return (
      <div
        key={position}
        className="grid grid-cols-[auto_1fr] items-start gap-3 rounded-lg border p-3 sm:grid-cols-[auto_1fr_auto]"
      >
        <Avatar className="h-11 w-11 border">
          <AvatarImage src={previewPhoto} alt={name} />
          <AvatarFallback className="bg-muted text-xs">
            {name ? getInitials(name) : '—'}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <Label htmlFor={`officer-${position}`} className="text-sm font-medium">
              {label.full}
            </Label>
            <Badge variant="secondary" className="font-mono text-[10px]">
              {label.short}
            </Badge>
            {isMember && (
              <Badge variant="outline" className="gap-1 text-[10px]">
                <UserCheck className="h-3 w-3" />
                foto do cadastro
              </Badge>
            )}
          </div>

          <MemberNameCombobox
            id={`officer-${position}`}
            value={name}
            onChange={(newName) => setDraft(position, { name: newName })}
            onSelectMember={(member) =>
              setDraft(position, {
                profileId: member?.id ?? null,
                name: member?.full_name ?? name,
                // Foto do cadastro substitui qualquer upload anterior
                ...(member ? { photoUrl: null, photoFile: null } : {}),
              })
            }
            placeholder="Vazio — cargo não preenchido"
          />

          {/* Upload só faz sentido para quem não vem do cadastro */}
          {!isMember && name.trim() && (
            <div className="mt-2 flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => document.getElementById(`photo-${position}`)?.click()}
              >
                <Upload className="mr-1 h-3 w-3" />
                {previewPhoto ? 'Trocar foto' : 'Enviar foto'}
              </Button>
              <input
                id={`photo-${position}`}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setDraft(position, { photoFile: file });
                }}
              />
              {previewPhoto && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-muted-foreground"
                  onClick={() => setDraft(position, { photoFile: null, photoUrl: null })}
                >
                  Remover foto
                </Button>
              )}
            </div>
          )}
        </div>

        {name.trim() && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => clearDraft(position)}
            aria-label={`Limpar ${label.full}`}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Diretoria {formatTerm(installationYear)}</DialogTitle>
          <DialogDescription>
            Gestão de {masterName}. Escolha um irmão do cadastro — a foto vem junto — ou
            digite o nome de quem não faz parte do quadro e envie a foto. Deixe em branco
            os cargos que não existiram nesta gestão.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-3">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">{POSITION_ORDER.map(renderRow)}</div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave} disabled={saving || loading}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Diretoria
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
