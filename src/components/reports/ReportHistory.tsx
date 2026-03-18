import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { History, Search, Calendar, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Report, HistoryFilters } from '@/types/reports';
import { Skeleton } from '@/components/ui/skeleton';

interface ReportHistoryProps {
  reports: Report[];
  loading: boolean;
  onRegenerate: (report: Report) => void;
  filters: HistoryFilters;
  onFiltersChange: (filters: HistoryFilters) => void;
}

export const ReportHistory: React.FC<ReportHistoryProps> = ({
  reports,
  loading,
  onRegenerate,
  filters,
  onFiltersChange,
}) => {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <History className="h-5 w-5 text-secondary" />
          Histórico de Relatórios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título..."
              value={filters.busca}
              onChange={(e) => onFiltersChange({ ...filters, busca: e.target.value })}
              className="pl-9 bg-muted border-border"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal bg-muted border-border w-full sm:w-auto",
                  !filters.dataInicio && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {filters.dataInicio ? (
                  format(filters.dataInicio, "dd/MM/yyyy", { locale: ptBR })
                ) : (
                  "Data início"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={filters.dataInicio || undefined}
                onSelect={(date) => onFiltersChange({ ...filters, dataInicio: date || null })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal bg-muted border-border w-full sm:w-auto",
                  !filters.dataFim && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {filters.dataFim ? (
                  format(filters.dataFim, "dd/MM/yyyy", { locale: ptBR })
                ) : (
                  "Data fim"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={filters.dataFim || undefined}
                onSelect={(date) => onFiltersChange({ ...filters, dataFim: date || null })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {(filters.busca || filters.dataInicio || filters.dataFim) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFiltersChange({ busca: '', dataInicio: null, dataFim: null })}
              className="text-muted-foreground"
            >
              Limpar
            </Button>
          )}
        </div>

        {/* Tabela */}
        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Data de Geração</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Período</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Nenhum relatório encontrado
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      {report.created_at 
                        ? format(new Date(report.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })
                        : '-'
                      }
                    </TableCell>
                    <TableCell className="font-medium">{report.titulo}</TableCell>
                    <TableCell>
                      {report.periodo_inicio && report.periodo_fim
                        ? `${format(new Date(report.periodo_inicio), "dd/MM/yyyy", { locale: ptBR })} - ${format(new Date(report.periodo_fim), "dd/MM/yyyy", { locale: ptBR })}`
                        : '-'
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRegenerate(report)}
                        className="gap-1.5"
                      >
                        <Eye className="h-4 w-4" />
                        Visualizar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
