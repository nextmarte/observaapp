import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProfileFiltersState } from '@/types/profiles';

const PLATAFORMAS = [
  { value: 'all', label: 'Todas as plataformas' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
];

const TIPOS = [
  { value: 'all', label: 'Todos os tipos' },
  { value: 'candidato', label: 'Candidato' },
  { value: 'adversario', label: 'Adversário' },
  { value: 'sindicato', label: 'Sindicato' },
  { value: 'dce', label: 'DCE' },
  { value: 'outro', label: 'Outro' },
];

const ORDENAR_POR = [
  { value: 'nome', label: 'Nome' },
  { value: 'seguidores', label: 'Seguidores' },
  { value: 'engajamento', label: 'Engajamento' },
];

interface ProfileFiltersProps {
  filters: ProfileFiltersState;
  onFiltersChange: (filters: ProfileFiltersState) => void;
}

export const ProfileFilters: React.FC<ProfileFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const updateFilter = <K extends keyof ProfileFiltersState>(
    key: K,
    value: ProfileFiltersState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Plataforma:</span>
          <Select
            value={filters.plataforma}
            onValueChange={(value) => updateFilter('plataforma', value)}
          >
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {PLATAFORMAS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Tipo:</span>
          <Select
            value={filters.tipo}
            onValueChange={(value) => updateFilter('tipo', value)}
          >
            <SelectTrigger className="w-[160px] bg-background">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {TIPOS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Ordenar por:</span>
          <Select
            value={filters.ordenarPor}
            onValueChange={(value) => updateFilter('ordenarPor', value as ProfileFiltersState['ordenarPor'])}
          >
            <SelectTrigger className="w-[160px] bg-background">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {ORDENAR_POR.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
