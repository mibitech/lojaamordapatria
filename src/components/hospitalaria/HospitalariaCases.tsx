import { parseDateSafe } from '@/lib/utils';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useHospitalarCases, useHospitalarMutation, SITUATION_TYPES, CASE_STATUSES, PRIORITIES } from '@/hooks/useHospitalaria';
import { useProfiles } from '@/hooks/useProfiles';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const priorityColor: Record<string, string> = { Alta: 'destructive', Média: 'secondary', Baixa: 'outline' };
const statusColor: Record<string, string> = { Ativo: 'default', Resolvido: 'secondary', Encerrado: 'outline' };

const HospitalariaCases: React.FC = () => {
  const { data: cases = [], isLoading } = useHospitalarCases();
  const { profiles } = useProfiles();
  const { insert, update, remove } = useHospitalarMutation('hospitalar_cases', 'hospitalar_cases');
  const [dialog, setDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});

  const openNew = () => { setForm({ situation_type: 'Outro', status: 'Ativo', priority: 'Média', start_date: new Date().toISOString().split('T')[0] }); setEditingId(null); setDialog(true); };
  const openEdit = (c: any) => { setForm(c); setEditingId(c.id); setDialog(true); };

  const save = async () => {
    const payload = { profile_id: form.profile_id, situation_type: form.situation_type, start_date: form.start_date, responsible_id: form.responsible_id || null, description: form.description || null, status: form.status, priority: form.priority };
    if (editingId) await update.mutateAsync({ id: editingId, ...payload });
    else await insert.mutateAsync(payload);
    setDialog(false);
  };

  const del = async (id: string) => { if (confirm('Excluir este acompanhamento?')) await remove.mutateAsync(id); };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Obreiros em Acompanhamento</CardTitle>
          <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" />Novo</Button>
        </CardHeader>
        <CardContent>
          {isLoading ? <p className="text-center py-8">Carregando...</p> : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Obreiro</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data Início</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cases.length === 0 ? (
                      <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nenhum registro</TableCell></TableRow>
                    ) : cases.map(c => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.profiles?.full_name || '-'}</TableCell>
                        <TableCell>{c.situation_type}</TableCell>
                        <TableCell><Badge variant={priorityColor[c.priority] as any}>{c.priority}</Badge></TableCell>
                        <TableCell><Badge variant={statusColor[c.status] as any}>{c.status}</Badge></TableCell>
                        <TableCell>{format(parseDateSafe(c.start_date), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                        <TableCell>{c.responsible?.full_name || '-'}</TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(c)}><Edit className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => del(c.id)}><Trash2 className="w-4 h-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="md:hidden space-y-3">
                {cases.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhum registro</p>
                ) : cases.map(c => (
                  <Card key={c.id} className="shadow-soft">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{c.profiles?.full_name || '-'}</p>
                          <p className="text-sm text-muted-foreground">{c.situation_type} — {format(parseDateSafe(c.start_date), 'dd/MM/yyyy', { locale: ptBR })}</p>
                        </div>
                        <Badge variant={statusColor[c.status] as any}>{c.status}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={priorityColor[c.priority] as any}>{c.priority}</Badge>
                        {c.responsible?.full_name && <span className="text-sm text-muted-foreground">Resp: {c.responsible.full_name}</span>}
                      </div>
                      <div className="flex gap-2 pt-2 border-t">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(c)}><Edit className="w-4 h-4 mr-1" />Editar</Button>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => del(c.id)}><Trash2 className="w-4 h-4 mr-1" />Excluir</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingId ? 'Editar' : 'Novo'} Acompanhamento</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Obreiro *</Label>
              <Select value={form.profile_id || ''} onValueChange={v => setForm({ ...form, profile_id: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{profiles.map(p => <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo de Situação</Label>
                <Select value={form.situation_type || 'Outro'} onValueChange={v => setForm({ ...form, situation_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{SITUATION_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Data de Início</Label>
                <Input type="date" value={form.start_date || ''} onChange={e => setForm({ ...form, start_date: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Prioridade</Label>
                <Select value={form.priority || 'Média'} onValueChange={v => setForm({ ...form, priority: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status || 'Ativo'} onValueChange={v => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CASE_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Responsável</Label>
              <Select value={form.responsible_id || ''} onValueChange={v => setForm({ ...form, responsible_id: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione (opcional)" /></SelectTrigger>
                <SelectContent>{profiles.map(p => <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Descrição/Observações</Label>
              <Textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialog(false)}>Cancelar</Button>
              <Button onClick={save} disabled={!form.profile_id}>Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HospitalariaCases;
