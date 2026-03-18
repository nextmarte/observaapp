import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, BellOff, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { AlertHistorico, AlertFilter, getMetricaLabel } from '@/types/alerts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AlertsListProps {
  alerts: AlertHistorico[];
  loading?: boolean;
  onMarkAsRead: (id: string) => void;
  profiles: { id: string; nome: string }[];
}

const ITEMS_PER_PAGE = 10;

export const AlertsList = ({ alerts, loading, onMarkAsRead, profiles }: AlertsListProps) => {
  const [filter, setFilter] = useState<AlertFilter>('todos');
  const [page, setPage] = useState(1);

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'todos') return true;
    if (filter === 'nao_lidos') return !alert.visualizado;
    return alert.config?.perfil?.id === filter;
  });

  const totalPages = Math.ceil(filteredAlerts.length / ITEMS_PER_PAGE);
  const paginatedAlerts = filteredAlerts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setPage(1);
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Alertas Recentes</CardTitle>
        <Select value={filter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="nao_lidos">Não lidos</SelectItem>
            {profiles.map((profile) => (
              <SelectItem key={profile.id} value={profile.id}>
                {profile.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-muted/20 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : paginatedAlerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BellOff className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum alerta encontrado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border transition-colors ${
                  !alert.visualizado
                    ? 'bg-[#C4A000]/10 border-[#C4A000]/30'
                    : 'bg-muted/5 border-border'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 ${!alert.visualizado ? 'animate-bounce' : ''}`}>
                    <Bell
                      className={`h-5 w-5 ${
                        !alert.visualizado ? 'text-[#C4A000]' : 'text-muted-foreground'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{alert.mensagem}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {alert.config?.perfil && (
                        <Badge
                          variant="outline"
                          style={{
                            borderColor: alert.config.perfil.cor_grafico || '#6b7280',
                            color: alert.config.perfil.cor_grafico || '#6b7280',
                          }}
                        >
                          {alert.config.perfil.nome}
                        </Badge>
                      )}
                      {alert.config?.tipo_metrica && (
                        <Badge variant="secondary">
                          {getMetricaLabel(alert.config.tipo_metrica)}
                        </Badge>
                      )}
                      {alert.valor_detectado !== null && (
                        <span className="text-sm text-muted-foreground">
                          Valor: {alert.valor_detectado.toLocaleString('pt-BR')}
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {alert.created_at &&
                          format(new Date(alert.created_at), "dd/MM/yyyy 'às' HH:mm", {
                            locale: ptBR,
                          })}
                      </span>
                    </div>
                  </div>
                  {!alert.visualizado && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMarkAsRead(alert.id)}
                      className="shrink-0"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Marcar como lido
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground">
              Página {page} de {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
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
  );
};
