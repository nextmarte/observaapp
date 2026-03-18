import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, RefreshCw } from 'lucide-react';
import { clearPersistedQueryCache } from '@/lib/queryClient';

interface HeaderProps {
  showMobileMenuButton?: boolean;
  onOpenMobileMenu?: () => void;
  mobileMenuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  showMobileMenuButton = false,
  onOpenMobileMenu,
  mobileMenuOpen = false,
}) => {
  const { userProfile } = useAuth();
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries();
    clearPersistedQueryCache();
    window.location.reload();
  };

  return (
    <header className="h-16 border-b border-border/70 bg-background/35 px-4 backdrop-blur-md md:px-6">
      <div className="flex h-full items-center justify-between">
        <div className="flex items-center gap-2">
          {showMobileMenuButton && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onOpenMobileMenu}
              aria-label="Abrir menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-sidebar"
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Olá, {userProfile?.nome?.split(' ')[0] || 'Usuário'}
            </h2>
            <p className="text-xs text-muted-foreground">Painel de monitoramento consolidado</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden rounded-full border border-border/70 bg-muted/25 px-3 py-1 text-xs font-medium text-muted-foreground md:block">
            Atualização em tempo real
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="border-border/80 bg-card/30 text-muted-foreground hover:bg-accent/40 hover:text-foreground"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </div>
    </header>
  );
};
