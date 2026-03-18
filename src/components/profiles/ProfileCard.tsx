import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, FileText, Heart } from 'lucide-react';
import { ProfileWithMetrics } from '@/types/profiles';

interface ProfileCardProps {
  profile: ProfileWithMetrics;
  onClick: () => void;
}

const getPlataformaBadgeClass = (plataforma: string): string => {
  switch (plataforma.toLowerCase()) {
    case 'facebook':
      return 'bg-[#1877F2] text-white hover:bg-[#1877F2]/80';
    case 'instagram':
      return 'bg-[#E4405F] text-white hover:bg-[#E4405F]/80';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getTipoBadgeClass = (tipo: string): string => {
  switch (tipo.toLowerCase()) {
    case 'candidato':
      return 'bg-[#C4A000] text-black hover:bg-[#C4A000]/80';
    case 'adversario':
      return 'bg-[#dc2626] text-white hover:bg-[#dc2626]/80';
    case 'sindicato':
      return 'bg-[#00285F] text-white hover:bg-[#00285F]/80';
    case 'dce':
      return 'bg-[#22c55e] text-white hover:bg-[#22c55e]/80';
    default:
      return 'bg-[#6b7280] text-white hover:bg-[#6b7280]/80';
  }
};

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onClick }) => {
  const isPositiveGrowth = profile.variacaoSeguidores >= 0;
  const TrendIcon = isPositiveGrowth ? TrendingUp : TrendingDown;

  return (
    <Card
      className="bg-card border-border cursor-pointer transition-all hover:shadow-lg hover:border-muted-foreground/50 overflow-hidden"
      onClick={onClick}
      style={{ borderLeftWidth: '4px', borderLeftColor: profile.cor_grafico || '#3b82f6' }}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          {/* Header com nome e badges */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-foreground text-lg truncate" title={profile.nome}>
              {profile.nome}
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge className={getPlataformaBadgeClass(profile.plataforma)}>
                {profile.plataforma}
              </Badge>
              <Badge className={getTipoBadgeClass(profile.tipo)}>
                {profile.tipo}
              </Badge>
            </div>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-2 gap-3 mt-2">
            {/* Seguidores */}
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Seguidores</span>
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-foreground">
                  {profile.seguidoresAtuais.toLocaleString('pt-BR')}
                </span>
                <div className={`flex items-center text-xs ${isPositiveGrowth ? 'text-green-500' : 'text-red-500'}`}>
                  <TrendIcon className="h-3 w-3" />
                  <span>{Math.abs(profile.variacaoSeguidores).toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>

            {/* Posts da semana */}
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Posts (semana)</span>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-lg font-bold text-foreground">
                  {profile.postsSemana}
                </span>
              </div>
            </div>

            {/* Engajamento da semana */}
            <div className="flex flex-col col-span-2">
              <span className="text-xs text-muted-foreground">Engajamento (semana)</span>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-pink-500" />
                <span className="text-lg font-bold text-foreground">
                  {profile.engajamentoSemana.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
