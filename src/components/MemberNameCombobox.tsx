import React, { useMemo, useState } from 'react';
import { Check, ChevronsUpDown, PenLine, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useMemberOptions } from '@/hooks/useMemberOptions';

interface MemberNameComboboxProps {
  value: string;
  onChange: (name: string) => void;
  /** Recebe o id do perfil escolhido, ou null quando o nome é digitado livremente. */
  onSelectMember?: (member: { id: string; full_name: string } | null) => void;
  placeholder?: string;
  id?: string;
}

/**
 * Campo de nome que oferece os irmãos cadastrados para escolha, mas aceita
 * digitação livre para quem não está (ou não está mais) no quadro.
 */
export const MemberNameCombobox: React.FC<MemberNameComboboxProps> = ({
  value,
  onChange,
  onSelectMember,
  placeholder = 'Digite o nome completo',
  id,
}) => {
  const { members, loading } = useMemberOptions();
  const [open, setOpen] = useState(false);
  const [freeText, setFreeText] = useState(false);

  // Um valor que não corresponde a nenhum membro é, por definição, texto livre
  const matchedMember = useMemo(
    () => members.find((p) => p.full_name === value),
    [members, value]
  );

  // Só decide por texto livre depois que a lista chegou — enquanto carrega,
  // members está vazio e um nome válido seria classificado como livre por engano.
  const isFreeTextMode = freeText || (!loading && Boolean(value) && !matchedMember);

  if (isFreeTextMode) {
    return (
      <div className="space-y-1.5">
        <Input
          id={id}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            // Texto digitado não corresponde a um perfil do cadastro
            onSelectMember?.(null);
          }}
          placeholder={placeholder}
          autoFocus={freeText}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-auto px-1 py-0.5 text-xs text-muted-foreground"
          onClick={() => {
            setFreeText(false);
            onChange('');
            onSelectMember?.(null);
          }}
        >
          <User className="mr-1 h-3 w-3" />
          Escolher da lista de irmãos
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full justify-between font-normal',
              !value && 'text-muted-foreground'
            )}
          >
            {value || (loading ? 'Carregando irmãos...' : placeholder)}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar irmão..." />
            <CommandList>
              <CommandEmpty>
                <p className="py-3 text-sm text-muted-foreground">
                  Nenhum irmão encontrado.
                </p>
              </CommandEmpty>
              <CommandGroup>
                {members.map((profile) => (
                  <CommandItem
                    key={profile.id}
                    value={profile.full_name}
                    onSelect={() => {
                      onChange(profile.full_name);
                      onSelectMember?.({ id: profile.id, full_name: profile.full_name });
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === profile.full_name ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <span className="flex-1">{profile.full_name}</span>
                    {profile.cim && (
                      <span className="ml-2 font-mono text-xs text-muted-foreground">
                        {profile.cim}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-auto px-1 py-0.5 text-xs text-muted-foreground"
        onClick={() => {
          setFreeText(true);
          setOpen(false);
        }}
      >
        <PenLine className="mr-1 h-3 w-3" />
        Não está na lista? Digitar nome
      </Button>
    </div>
  );
};
