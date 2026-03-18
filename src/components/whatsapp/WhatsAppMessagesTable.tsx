import React, { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Phone, Calendar, Tag, Smile } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import type { WhatsAppMensagem, WhatsAppFilters } from '@/types/whatsapp';

interface WhatsAppMessagesTableProps {
  mensagens: WhatsAppMensagem[];
  loading?: boolean;
}

const PAGE_SIZE = 10;

const CATEGORIA_STYLE: Record<string, string> = {
  demanda:    'bg-orange-500/20 text-orange-400 border-orange-500/30',
  elogio:     'bg-green-500/20 text-green-400 border-green-500/30',
  duvida:     'bg-blue-500/20 text-blue-400 border-blue-500/30',
  critica:    'bg-red-500/20 text-red-400 border-red-500/30',
  informacao: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const CATEGORIA_LABEL: Record<string, string> = {
  demanda: 'Demanda', elogio: 'Elogio', duvida: 'Dúvida', critica: 'Crítica', informacao: 'Informação',
};

const SENTIMENTO_STYLE: Record<string, string> = {
  positivo: 'bg-green-500/20 text-green-400 border-green-500/30',
  neutro:   'bg-muted text-muted-foreground border-border',
  negativo: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const STATUS_STYLE: Record<string, string> = {
  nova:       'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  lida:       'bg-muted text-muted-foreground border-border',
  respondida: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

const STATUS_LABEL: Record<string, string> = {
  nova: 'Nova', lida: 'Lida', respondida: 'Respondida',
};

const TEMA_LABEL: Record<string, string> = {
  saude: 'Saúde', educacao: 'Educação', infraestrutura: 'Infraestrutura',
  seguranca: 'Segurança', institucional: 'Institucional', outro: 'Outro',
};

export const WhatsAppMessagesTable: React.FC<WhatsAppMessagesTableProps> = ({ mensagens, loading }) => {
  const [filters, setFilters] = useState<WhatsAppFilters>({
    categoria: 'all',
    tema: 'all',
    status: 'all',
  });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<WhatsAppMensagem | null>(null);

  const filtered = useMemo(() => {
    return mensagens.filter((m) => {
      if (filters.categoria !== 'all' && m.categoria !== filters.categoria) return false;
      if (filters.tema !== 'all' && m.tema !== filters.tema) return false;
      if (filters.status !== 'all' && m.status !== filters.status) return false;
      return true;
    });
  }, [mensagens, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateFilter = (key: keyof WhatsAppFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <CardTitle className="text-lg font-medium text-foreground">
            Mensagens Recebidas
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Select value={filters.categoria} onValueChange={(v) => updateFilter('categoria', v)}>
              <SelectTrigger className="w-[140px] bg-background text-sm">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {Object.entries(CATEGORIA_LABEL).map(([v, l]) => (
                  <SelectItem key={v} value={v}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.tema} onValueChange={(v) => updateFilter('tema', v)}>
              <SelectTrigger className="w-[140px] bg-background text-sm">
                <SelectValue placeholder="Tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {Object.entries(TEMA_LABEL).map(([v, l]) => (
                  <SelectItem key={v} value={v}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={(v) => updateFilter('status', v)}>
              <SelectTrigger className="w-[130px] bg-background text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {Object.entries(STATUS_LABEL).map(([v, l]) => (
                  <SelectItem key={v} value={v}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Remetente</TableHead>
                <TableHead className="text-muted-foreground">Data</TableHead>
                <TableHead className="text-muted-foreground">Categoria</TableHead>
                <TableHead className="text-muted-foreground">Tema</TableHead>
                <TableHead className="text-muted-foreground">Sentimento</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Mensagem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Nenhuma mensagem com os filtros selecionados
                  </TableCell>
                </TableRow>
              ) : (
                paged.map((m) => (
                  <TableRow
                    key={m.id}
                    className="border-border hover:bg-muted/40 cursor-pointer"
                    onClick={() => setSelected(m)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground text-sm">{m.remetente_nome}</p>
                        <p className="text-xs text-muted-foreground">{m.remetente_telefone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                      {format(parseISO(m.data_recebimento), "dd/MM/yy HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={CATEGORIA_STYLE[m.categoria]}>
                        {CATEGORIA_LABEL[m.categoria]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {TEMA_LABEL[m.tema]}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={SENTIMENTO_STYLE[m.sentimento]}>
                        {m.sentimento}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={STATUS_STYLE[m.status]}>
                        {STATUS_LABEL[m.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[280px]">
                      <p className="text-sm text-foreground truncate" title={m.mensagem}>
                        {m.mensagem}
                      </p>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <span className="text-xs text-muted-foreground">
              {filtered.length} mensagens — página {page} de {totalPages}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline" size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline" size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>

    {/* Message detail modal */}

    <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
      <DialogContent className="max-w-lg">
        {selected && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span>{selected.remetente_nome}</span>
                <Badge variant="outline" className={CATEGORIA_STYLE[selected.categoria]}>
                  {CATEGORIA_LABEL[selected.categoria]}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Meta */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{selected.remetente_telefone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>
                    {format(parseISO(selected.data_recebimento), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Tag className="h-4 w-4 shrink-0" />
                  <span>{TEMA_LABEL[selected.tema]}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Smile className="h-4 w-4 shrink-0" />
                  <Badge variant="outline" className={SENTIMENTO_STYLE[selected.sentimento]}>
                    {selected.sentimento}
                  </Badge>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant="outline" className={STATUS_STYLE[selected.status]}>
                  {STATUS_LABEL[selected.status]}
                </Badge>
              </div>

              {/* Message body */}
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-sm text-foreground leading-relaxed">{selected.mensagem}</p>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
};
