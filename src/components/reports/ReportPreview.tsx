import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Printer, Download, Save, X, Loader2, FileSpreadsheet } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PrintableReport } from './PrintableReport';
import { ReportConfig, ReportData } from '@/types/reports';
import { toast } from 'sonner';

interface ReportPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  config: ReportConfig;
  data: ReportData;
  onSaveToHistory: () => Promise<void>;
  saving: boolean;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({
  isOpen,
  onClose,
  config,
  data,
  onSaveToHistory,
  saving,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    // Export posts data with all requested columns
    const headers = [
      'Perfil',
      'Data',
      'Tipo',
      'Conteúdo',
      'Curtidas',
      'Comentários',
      'Compartilhamentos',
      'Engajamento Total'
    ];
    
    const rows = data.posts.map(p => [
      `"${p.perfil_nome || '-'}"`,
      format(new Date(p.data_publicacao), 'dd/MM/yyyy', { locale: ptBR }),
      p.tipo || '-',
      `"${(p.conteudo_texto || '').replace(/"/g, '""').slice(0, 200)}"`,
      p.curtidas || 0,
      p.comentarios || 0,
      p.compartilhamentos || 0,
      p.engajamento_total || 0,
    ]);
    
    const csvContent = [headers.join(';'), ...rows.map(row => row.join(';'))].join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.titulo.replace(/\s/g, '_')}_posts_${format(new Date(), 'yyyyMMdd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('CSV exportado com sucesso!');
  };

  const handleExportMetricsCSV = () => {
    // Export profile metrics
    const headers = [
      'Perfil',
      'Plataforma',
      'Seguidores',
      'Posts',
      'Curtidas',
      'Comentários',
      'Compartilhamentos',
      'Engajamento Total',
      'Taxa Engajamento (%)'
    ];
    
    const rows = data.perfis.map(p => [
      `"${p.nome}"`,
      p.plataforma,
      p.seguidores,
      p.totalPosts,
      p.curtidas,
      p.comentarios,
      p.compartilhamentos,
      p.engajamento,
      p.taxaEngajamento.toFixed(2),
    ]);
    
    const csvContent = [headers.join(';'), ...rows.map(row => row.join(';'))].join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.titulo.replace(/\s/g, '_')}_metricas_${format(new Date(), 'yyyyMMdd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Métricas exportadas com sucesso!');
  };

  const handleSave = async () => {
    await onSaveToHistory();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[900px] max-h-[90vh] p-0 print:max-w-none print:max-h-none print:h-auto print:border-none print:shadow-none">
        <DialogHeader className="p-4 border-b border-border print:hidden">
          <DialogTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-lg">Preview do Relatório</span>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="gap-2"
              >
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Imprimir / PDF</span>
                <span className="sm:hidden">PDF</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Exportar Posts</span>
                <span className="sm:hidden">Posts</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportMetricsCSV}
                className="gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span className="hidden sm:inline">Exportar Métricas</span>
                <span className="sm:hidden">Métricas</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">Salvar no Histórico</span>
                <span className="sm:hidden">Salvar</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="print:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-80px)] print:h-auto print:overflow-visible">
          <div className="print-content">
            <PrintableReport config={config} data={data} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
