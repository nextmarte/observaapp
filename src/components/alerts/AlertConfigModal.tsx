import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertConfig, AlertConfigInput, TIPOS_METRICA, OPERADORES } from '@/types/alerts';
import { Loader2 } from 'lucide-react';

interface AlertConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AlertConfig | null;
  profiles: { id: string; nome: string }[];
  onSave: (config: AlertConfigInput) => Promise<void>;
  saving: boolean;
}

export const AlertConfigModal = ({
  isOpen,
  onClose,
  config,
  profiles,
  onSave,
  saving,
}: AlertConfigModalProps) => {
  const [perfilId, setPerfilId] = useState<string>('todos');
  const [tipoMetrica, setTipoMetrica] = useState<string>('engajamento_post');
  const [operador, setOperador] = useState<string>('maior_que');
  const [threshold, setThreshold] = useState<string>('100');
  const [ativo, setAtivo] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (config) {
      setPerfilId(config.perfil_id || 'todos');
      setTipoMetrica(config.tipo_metrica);
      setOperador(config.operador || 'maior_que');
      setThreshold(config.threshold.toString());
      setAtivo(config.ativo ?? true);
    } else {
      setPerfilId('todos');
      setTipoMetrica('engajamento_post');
      setOperador('maior_que');
      setThreshold('100');
      setAtivo(true);
    }
    setError('');
  }, [config, isOpen]);

  const handleSubmit = async () => {
    const thresholdNum = parseFloat(threshold);
    if (isNaN(thresholdNum) || thresholdNum <= 0) {
      setError('O threshold deve ser um número positivo');
      return;
    }

    await onSave({
      perfil_id: perfilId === 'todos' ? null : perfilId,
      tipo_metrica: tipoMetrica,
      operador,
      threshold: thresholdNum,
      ativo,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{config ? 'Editar Alerta' : 'Novo Alerta'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="perfil">Perfil</Label>
            <Select value={perfilId} onValueChange={setPerfilId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os perfis</SelectItem>
                {profiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    {profile.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Métrica</Label>
            <Select value={tipoMetrica} onValueChange={setTipoMetrica}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a métrica" />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_METRICA.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="operador">Operador</Label>
            <Select value={operador} onValueChange={setOperador}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o operador" />
              </SelectTrigger>
              <SelectContent>
                {OPERADORES.map((op) => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="threshold">
              Threshold {operador.includes('variacao') ? '(%)' : ''}
            </Label>
            <Input
              id="threshold"
              type="number"
              min="0"
              step="any"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder="Ex: 100"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="ativo">Alerta ativo</Label>
            <Switch id="ativo" checked={ativo} onCheckedChange={setAtivo} />
          </div>

          <div className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg">
            <p className="font-medium mb-1">Exemplo de alerta:</p>
            <p>
              "Alertar se{' '}
              <span className="text-foreground">
                {TIPOS_METRICA.find((t) => t.value === tipoMetrica)?.label.toLowerCase()}
              </span>{' '}
              {OPERADORES.find((o) => o.value === operador)?.label.toLowerCase()}{' '}
              <span className="text-foreground font-mono">
                {threshold}
                {operador.includes('variacao') ? '%' : ''}
              </span>
              {perfilId !== 'todos' && (
                <>
                  {' '}
                  para{' '}
                  <span className="text-foreground">
                    {profiles.find((p) => p.id === perfilId)?.nome}
                  </span>
                </>
              )}
              "
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-[#C4A000] hover:bg-[#A38600] text-black"
          >
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {config ? 'Salvar Alterações' : 'Criar Alerta'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
