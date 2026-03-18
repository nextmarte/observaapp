import React from 'react';
import { ProfileCard } from './ProfileCard';
import { ProfileWithMetrics } from '@/types/profiles';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface ProfileGridProps {
  profiles: ProfileWithMetrics[];
  loading: boolean;
  onProfileClick: (profile: ProfileWithMetrics) => void;
}

export const ProfileGrid: React.FC<ProfileGridProps> = ({
  profiles,
  loading,
  onProfileClick,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full col-span-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Nenhum perfil encontrado
        </h3>
        <p className="text-muted-foreground">
          Não há perfis ativos com os filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          onClick={() => onProfileClick(profile)}
        />
      ))}
    </div>
  );
};
