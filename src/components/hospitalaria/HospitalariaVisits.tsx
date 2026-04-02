import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useHospitalarVisits, useHospitalarCases, useHospitalarMutation, VISIT_TYPES } from '@/hooks/useHospitalaria';
import { useProfiles } from '@/hooks/useProfiles';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const HospitalariaVisits: React.FC = () => {
  const { data: visits = [], isLoading } = useHospitalarVisits();
  const { data: cases = [] } = useHospitalarCases();
  const { profiles } = useProfiles();
  const { insert, update, remove } = useHospitalarMutation('hospitalar_visits', 'hospitalar_visits');
  const [dialog, setDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});

  const openNew = () => { setForm({ visit_type: 'Presencial', visit_date: new Date().toISOString().slice(0, 16) }); setEditingId(null); setDialog(true); };
  const openEdit = (v: any) => { setForm({ ...v, visit_date: v.visit_date?.slice(0, 16) }); setEditingId(v.id); setDialog(true); };

  const save = async () => {
    const payload = { profile_id: form.profile_id, case_id: form.case_id || null, visit_date: form.visit_date, visit_type: form.visit_type, report: form.report || null, needs_identified: form.needs_identified || null, actions_taken: form.actions_taken || null, next_visit_date: form.next_visit_date || null, updated_situation: form.updated_situation || null };
    if (editingId) await update.mutateAsync({ id: editingId, ...payload });
    else await insert.mutateAsync(payload);
    setDialog(false);
  };

  const del = async (id: string) => { if (confirm('Excluir esta visita?')) await remove.mutateAsync(id); };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Registro de Visitas</CardTitle>
          <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" />Nova Visita</Button>
        </CardHeader>
        <CardContent>
          {isLoading ? <p className="text-center py-8">Carregando...</p> : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Obreiro</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Relato</TableHead>
                      <TableHead>Próxima Visita</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visits.length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhuma visita registrada</TableCell></TableRow>
                    ) : visits.map(v => (
                      <TableRow key={v.id}>
                        <TableCell className="font-medium">{v.profiles?.full_name || '-'}</TableCell>
                        <TableCell>{format(new Date(v.visit_date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</TableCell>
                        <TableCell><Badge variant="secondary">{v.visit_type}</Badge></TableCell>
                        <TableCell className="max-w-[200px] truncate">{v.report || '-'}</TableCell>
                        <TableCell>{v.next_visit_date ? format(new Date(v.next_visit_date), 'dd/MM/yyyy', { locale: ptBR }) : '-'}</TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(v)}><Edit className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => del(v.id)}><Trash2 className="w-4 h-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="md:hidden space-y-3">
                {visits.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhuma visita registrada</p>
                ) : visits.map(v => (
                  <Card key={v.id} className="shadow-soft">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{v.profiles?.full_name || '-'}</p>
                          <p className="text-sm text-muted-foreground">{format(new Date(v.visit_date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
                        </div>
                        <Badge variant="secondary">{v.visit_type}</Badge>
                      </div>
                      {v.report && <p className="text-sm text-muted-foreground line-clamp-2">{v.report}</p>}
                      {v.next_visit_date && <p className="text-sm text-muted-foreground"><strong>Próxima:</strong> {format(new Date(v.next_visit_date), 'dd/MM/yyyy', { locale: ptBR })}</p>}
                      <div className="flex gap-2 pt-2 border-t">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(v)}><Edit className="w-4 h-4 mr-1" />Editar</Button>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => del(v.id)}><Trash2 className="w-4 h-4 mr-1" />Excluir</Button>
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
          <DialogHeader><DialogTitle>{editingId ? 'Editar' : 'Nova'} Visita</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Obreiro *</Label>
              <Select value={form.profile_id || ''} onValueChange={v => setForm({ ...form, profile_id: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{profiles.map(p => <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Caso vinculado (opcional)</Label>
              <Select value={form.case_id || ''} onValueChange={v => setForm({ ...form, case_id: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{cases.map(c => <SelectItem key={c.id} value={c.id}>{c.profiles?.full_name} — {c.situation_type}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Data e Hora *</Label>
                <Input type="datetime-local" value={form.visit_date || ''} onChange={e => setForm({ ...form, visit_date: e.target.value })} />
              </div>
              <div>
                <Label>Tipo</Label>
                <Select value={form.visit_type || 'Presencial'} onValueChange={v => setForm({ ...form, visit_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{VISIT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Relato da Visita</Label>
              <Textarea value={form.report || ''} onChange={e => setForm({ ...form, report: e.target.value })} rows={3} />
            </div>
            <div>
              <Label>Necessidades Identificadas</Label>
              <Textarea value={form.needs_identified || ''} onChange={e => setForm({ ...form, needs_identified: e.target.value })} rows={2} />
            </div>
            <div>
              <Label>Ações Tomadas</Label>
              <Textarea value={form.actions_taken || ''} onChange={e => setForm({ ...form, actions_taken: e.target.value })} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Próxima Visita</Label>
                <Input type="date" value={form.next_visit_date || ''} onChange={e => setForm({ ...form, next_visit_date: e.target.value })} />
              </div>
              <div>
                <Label>Situação Atualizada</Label>
                <Input value={form.updated_situation || ''} onChange={e => setForm({ ...form, updated_situation: e.target.value })} />
              </div>
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

export default HospitalariaVisits;
