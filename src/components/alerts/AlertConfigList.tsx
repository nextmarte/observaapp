import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Settings, Pencil, Trash2, Plus } from 'lucide-react';
import { AlertConfig, getMetricaLabel, getOperadorSimbolo } from '@/types/alerts';

interface AlertConfigListProps {
  configs: AlertConfig[];
  loading?: boolean;
  onEdit: (config: AlertConfig) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, ativo: boolean) => void;
  onNewAlert: () => void;
}

export const AlertConfigList = ({
  configs,
  loading,
  onEdit,
  onDelete,
  onToggleActive,
  onNewAlert,
}: AlertConfigListProps) => {
  const formatCondition = (config: AlertConfig): string => {
    const operador = config.operador || 'maior_que';
    const simbolo = getOperadorSimbolo(operador);
    const isPercentual = operador.includes('variacao');
    return `${simbolo} ${config.threshold}${isPercentual ? '%' : ''}`;
  };

  return (
    <Card className="bg-card border-[#00285F]/30">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-[#00285F]" />
          <CardTitle className="text-lg font-semibold">Configurar Alertas</CardTitle>
        </div>
        <Button onClick={onNewAlert} className="bg-[#C4A000] hover:bg-[#A38600] text-black">
          <Plus className="h-4 w-4 mr-2" />
          Novo Alerta
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-16 bg-muted/20 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : configs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum alerta configurado</p>
            <p className="text-sm mt-1">Clique em "Novo Alerta" para criar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {configs.map((config) => (
              <div
                key={config.id}
                className={`p-4 rounded-lg border transition-colors ${
                  config.ativo ? 'bg-muted/5 border-border' : 'bg-muted/20 border-border opacity-60'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        style={{
                          borderColor: config.perfil?.cor_grafico || '#6b7280',
                          color: config.perfil?.cor_grafico || '#6b7280',
                        }}
                      >
                        {config.perfil?.nome || 'Todos os perfis'}
                      </Badge>
                      <Badge variant="secondary">{getMetricaLabel(config.tipo_metrica)}</Badge>
                      <span className="font-mono text-sm text-foreground">
                        {formatCondition(config)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {config.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                      <Switch
                        checked={config.ativo ?? false}
                        onCheckedChange={(checked) => onToggleActive(config.id, checked)}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(config)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(config.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
