import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, Filter, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { PostsFiltersState } from '@/types/posts';

interface Profile {
  id: string;
  nome: string;
}

interface PostsFiltersProps {
  filters: PostsFiltersState;
  onFiltersChange: (filters: PostsFiltersState) => void;
  onApply: () => void;
  onExportCSV: () => void;
  onClearFilters: () => void;
  profiles: Profile[];
  loading?: boolean;
}

const PLATAFORMAS = [
  { value: 'all', label: 'Todas' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
];

const TIPOS = [
  { value: 'all', label: 'Todos' },
  { value: 'texto', label: 'Texto' },
  { value: 'imagem', label: 'Imagem' },
  { value: 'video', label: 'Vídeo' },
  { value: 'story', label: 'Story' },
  { value: 'reels', label: 'Reels' },
  { value: 'carrossel', label: 'Carrossel' },
];

const SENTIMENTOS = [
  { value: 'all', label: 'Todos' },
  { value: 'positivo', label: 'Positivo' },
  { value: 'neutro', label: 'Neutro' },
  { value: 'negativo', label: 'Negativo' },
];

const CATEGORIAS = [
  { value: 'all', label: 'Todas' },
  { value: 'Infraestrutura', label: 'Infraestrutura' },
  { value: 'Acessibilidade', label: 'Acessibilidade' },
  { value: 'Orçamento', label: 'Orçamento' },
  { value: 'Carreira/Trabalho', label: 'Carreira/Trabalho' },
  { value: 'Assistência Estudantil', label: 'Assist. Estudantil' },
  { value: 'Ensino/Pesquisa/Extensão', label: 'Ensino/Pesq./Ext.' },
  { value: 'HUAP/Saúde', label: 'HUAP/Saúde' },
  { value: 'Gestão/Governança', label: 'Gestão/Governança' },
  { value: 'Político', label: 'Político' },
];

const RELEVANCIAS = [
  { value: 'all', label: 'Todas' },
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Média' },
  { value: 'baixa', label: 'Baixa' },
];

const TIPOS_INFORMACAO = [
  { value: 'all', label: 'Todos' },
  { value: 'problema', label: 'Problema' },
  { value: 'demanda', label: 'Demanda' },
  { value: 'critica', label: 'Crítica' },
  { value: 'elogio', label: 'Elogio' },
  { value: 'neutro', label: 'Neutro' },
];

export const PostsFilters: React.FC<PostsFiltersProps> = ({
  filters,
  onFiltersChange,
  onApply,
  onExportCSV,
  onClearFilters,
  profiles,
  loading,
}) => {
  const updateFilter = <K extends keyof PostsFiltersState>(
    key: K,
    value: PostsFiltersState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex flex-wrap items-end gap-4">
        {/* Data Início */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">Data Início</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-[140px] justify-start text-left font-normal',
                  !filters.dataInicio && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dataInicio ? (
                  format(filters.dataInicio, 'dd/MM/yyyy', { locale: ptBR })
                ) : (
                  <span>Selecionar</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dataInicio || undefined}
                onSelect={(date) => updateFilter('dataInicio', date || null)}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Data Fim */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">Data Fim</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-[140px] justify-start text-left font-normal',
                  !filters.dataFim && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dataFim ? (
                  format(filters.dataFim, 'dd/MM/yyyy', { locale: ptBR })
                ) : (
                  <span>Selecionar</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dataFim || undefined}
                onSelect={(date) => updateFilter('dataFim', date || null)}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Perfil */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">Perfil</label>
          <Select
            value={filters.perfilId || 'all'}
            onValueChange={(value) =>
              updateFilter('perfilId', value === 'all' ? null : value)
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {profiles.map((profile) => (
                <SelectItem key={profile.id} value={profile.id}>
                  {profile.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Plataforma */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">Plataforma</label>
          <Select
            value={filters.plataforma || 'all'}
            onValueChange={(value) =>
              updateFilter('plataforma', value === 'all' ? null : value)
            }
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              {PLATAFORMAS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tipo */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">Tipo</label>
          <Select
            value={filters.tipo || 'all'}
            onValueChange={(value) =>
              updateFilter('tipo', value === 'all' ? null : value)
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              {TIPOS.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sentimento */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">Sentimento</label>
          <Select
            value={filters.sentimento || 'all'}
            onValueChange={(value) =>
              updateFilter('sentimento', value === 'all' ? null : value)
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              {SENTIMENTOS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Segunda linha de filtros */}
      <div className="flex flex-wrap items-end gap-4 mt-4">
        {/* Categoria Estratégica */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">Categoria</label>
          <Select
            value={filters.categoriaEstrategica || 'all'}
            onValueChange={(value) =>
              updateFilter('categoriaEstrategica', value === 'all' ? null : value)
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIAS.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Relevância */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">Relevância</label>
          <Select
            value={filters.relevancia || 'all'}
            onValueChange={(value) =>
              updateFilter('relevancia', value === 'all' ? null : value)
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              {RELEVANCIAS.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tipo de Informação */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">Tipo Info</label>
          <Select
            value={filters.tipoInformacao || 'all'}
            onValueChange={(value) =>
              updateFilter('tipoInformacao', value === 'all' ? null : value)
            }
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              {TIPOS_INFORMACAO.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Botões */}
        <div className="flex gap-2 ml-auto">
          <Button
            onClick={onApply}
            disabled={loading}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            <Filter className="mr-2 h-4 w-4" />
            Aplicar
          </Button>
          <Button
            variant="outline"
            onClick={onClearFilters}
            disabled={loading}
          >
            <X className="mr-2 h-4 w-4" />
            Limpar
          </Button>
          <Button variant="outline" onClick={onExportCSV} disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            CSV
          </Button>
        </div>
      </div>
    </div>
  );
};
