import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, Calendar, Users, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { ReportConfig } from '@/types/reports';

interface Profile {
  id: string;
  nome: string;
  plataforma: string;
  ativo: boolean | null;
}

interface ReportGeneratorProps {
  profiles: Profile[];
  config: ReportConfig;
  onConfigChange: (config: ReportConfig) => void;
  onGenerate: () => void;
  loading: boolean;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  profiles,
  config,
  onConfigChange,
  onGenerate,
  loading,
}) => {
  const handleProfileToggle = (profileId: string, checked: boolean) => {
    const newIds = checked
      ? [...config.perfilIds, profileId]
      : config.perfilIds.filter(id => id !== profileId);
    onConfigChange({ ...config, perfilIds: newIds });
  };

  const handleSelectAll = (checked: boolean) => {
    onConfigChange({
      ...config,
      perfilIds: checked ? profiles.map(p => p.id) : [],
    });
  };

  const allSelected = profiles.length > 0 && config.perfilIds.length === profiles.length;
  const isValid = config.titulo.trim() !== '' && 
                  config.perfilIds.length > 0 && 
                  config.periodoFim >= config.periodoInicio;

  return (
    <Card className="border-[hsl(var(--accent))]/30 bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <FileText className="h-5 w-5 text-accent" />
          Gerar Novo Relatório
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Título */}
        <div className="space-y-2">
          <Label htmlFor="titulo">Título do Relatório</Label>
          <Input
            id="titulo"
            value={config.titulo}
            onChange={(e) => onConfigChange({ ...config, titulo: e.target.value })}
            placeholder="Ex: Relatório Semanal - 01/01/2024"
            className="bg-muted border-border"
          />
        </div>

        {/* Período */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Data Início</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-muted border-border",
                    !config.periodoInicio && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {config.periodoInicio ? (
                    format(config.periodoInicio, "dd/MM/yyyy", { locale: ptBR })
                  ) : (
                    <span>Selecionar data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={config.periodoInicio}
                  onSelect={(date) => date && onConfigChange({ ...config, periodoInicio: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Data Fim</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-muted border-border",
                    !config.periodoFim && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {config.periodoFim ? (
                    format(config.periodoFim, "dd/MM/yyyy", { locale: ptBR })
                  ) : (
                    <span>Selecionar data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={config.periodoFim}
                  onSelect={(date) => date && onConfigChange({ ...config, periodoFim: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {config.periodoFim < config.periodoInicio && (
              <p className="text-xs text-destructive">Data fim deve ser maior ou igual à data início</p>
            )}
          </div>
        </div>

        {/* Perfis */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Perfis a Incluir
            </Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={allSelected}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all" className="text-sm text-muted-foreground cursor-pointer">
                Selecionar todos
              </Label>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {profiles.map((profile) => (
              <div key={profile.id} className="flex items-center space-x-2">
                <Checkbox
                  id={profile.id}
                  checked={config.perfilIds.includes(profile.id)}
                  onCheckedChange={(checked) => handleProfileToggle(profile.id, checked as boolean)}
                />
                <Label htmlFor={profile.id} className="text-sm cursor-pointer">
                  {profile.nome}
                </Label>
              </div>
            ))}
          </div>
          {config.perfilIds.length === 0 && (
            <p className="text-xs text-destructive">Selecione pelo menos um perfil</p>
          )}
        </div>

        {/* Tipo de Relatório */}
        <div className="space-y-3">
          <Label>Tipo de Relatório</Label>
          <RadioGroup
            value={config.tipo}
            onValueChange={(value) => onConfigChange({ ...config, tipo: value as ReportConfig['tipo'] })}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            <div className="flex items-center space-x-2 bg-muted p-3 rounded-lg border border-border">
              <RadioGroupItem value="resumo" id="resumo" />
              <Label htmlFor="resumo" className="cursor-pointer">
                <span className="font-medium">Resumo Executivo</span>
                <p className="text-xs text-muted-foreground">Métricas principais + comparativo</p>
              </Label>
            </div>
            <div className="flex items-center space-x-2 bg-muted p-3 rounded-lg border border-border">
              <RadioGroupItem value="completo" id="completo" />
              <Label htmlFor="completo" className="cursor-pointer">
                <span className="font-medium">Relatório Completo</span>
                <p className="text-xs text-muted-foreground">Todas métricas + posts + gráficos</p>
              </Label>
            </div>
            <div className="flex items-center space-x-2 bg-muted p-3 rounded-lg border border-border">
              <RadioGroupItem value="comparativo" id="comparativo" />
              <Label htmlFor="comparativo" className="cursor-pointer">
                <span className="font-medium">Comparativo</span>
                <p className="text-xs text-muted-foreground">Foco candidato vs adversário</p>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Botão Gerar */}
        <Button
          onClick={onGenerate}
          disabled={!isValid || loading}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Gerar Relatório
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
