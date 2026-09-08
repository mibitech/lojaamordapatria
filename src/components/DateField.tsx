import React, { useEffect, useState } from 'react';
import { format, isValid, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateFieldProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  id?: string;
  /** Primeiro ano oferecido no seletor. Padrão: 1950 */
  fromYear?: number;
  /** Último ano oferecido no seletor. Padrão: ano atual + 5 */
  toYear?: number;
}

const DATE_MASK = 'dd/MM/yyyy';

const applyMask = (raw: string) => {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

/**
 * Campo de data que aceita digitação direta (dd/MM/aaaa) e mantém o
 * calendário como alternativa. Datas antigas deixam de exigir navegação
 * mês a mês: dá para digitar, ou usar os seletores de mês/ano.
 */
export const DateField: React.FC<DateFieldProps> = ({
  value,
  onChange,
  placeholder = 'dd/mm/aaaa',
  id,
  fromYear = 1950,
  toYear = new Date().getFullYear() + 5,
}) => {
  const [text, setText] = useState(value ? format(value, DATE_MASK) : '');
  const [open, setOpen] = useState(false);

  // Reflete mudanças vindas de fora (reset do formulário, edição de outro registro)
  useEffect(() => {
    setText(value ? format(value, DATE_MASK) : '');
  }, [value]);

  const commitText = (raw: string) => {
    if (!raw.trim()) {
      onChange(undefined);
      return;
    }

    const parsed = parse(raw, DATE_MASK, new Date());
    if (isValid(parsed) && raw.length === DATE_MASK.length) {
      onChange(parsed);
    } else {
      // Entrada incompleta ou inválida: volta ao último valor aceito
      setText(value ? format(value, DATE_MASK) : '');
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        id={id}
        value={text}
        onChange={(e) => {
          const masked = applyMask(e.target.value);
          setText(masked);
          if (masked.length === DATE_MASK.length) {
            const parsed = parse(masked, DATE_MASK, new Date());
            if (isValid(parsed)) onChange(parsed);
          }
        }}
        onBlur={(e) => commitText(e.target.value)}
        placeholder={placeholder}
        inputMode="numeric"
        maxLength={10}
        className="flex-1"
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn('shrink-0', !value && 'text-muted-foreground')}
            aria-label="Abrir calendário"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={value}
            defaultMonth={value}
            captionLayout="dropdown-buttons"
            fromYear={fromYear}
            toYear={toYear}
            locale={ptBR}
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
