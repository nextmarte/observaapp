import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  GitCompare, 
  Brain,
  FileBarChart, 
  Bell, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';

const menuItems = [
  { path: '/dashboard', label: 'Visão Geral', icon: LayoutDashboard },
  { path: '/perfis', label: 'Perfis', icon: Users },
  { path: '/posts', label: 'Posts', icon: FileText },
  { path: '/comparativo', label: 'Comparativo', icon: GitCompare },
  { path: '/inteligencia', label: 'Inteligência', icon: Brain },
  { path: '/relatorios', label: 'Relatórios', icon: FileBarChart },
  { path: '/alertas', label: 'Alertas', icon: Bell },
];

const adminItems = [
  { path: '/admin', label: 'Administração', icon: Settings },
];

interface SidebarContentProps {
  onNavigate?: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ onNavigate }) => {
  const { userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const isAdmin = userProfile?.role === 'admin';

  const handleLogout = async () => {
    await signOut();
    onNavigate?.();
    navigate('/login');
  };

  return (
    <>
      {/* Logo */}
      <div className="border-b border-sidebar-border/80 p-6">
        <div className="rounded-xl border border-sidebar-border/80 bg-white/5 px-4 py-3">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-sidebar-foreground">Observa</span>
            <span className="text-secondary">App</span>
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">Análise estratégica de redes</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                isActive
                  ? "border border-secondary/40 bg-sidebar-accent/80 text-sidebar-foreground shadow-[0_8px_20px_-15px_rgba(0,0,0,0.9)]"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}

        {/* Admin Section */}
        {isAdmin && (
          <>
            <div className="my-4 border-t border-sidebar-border" />
            {adminItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "border border-secondary/40 bg-sidebar-accent/80 text-sidebar-foreground shadow-[0_8px_20px_-15px_rgba(0,0,0,0.9)]"
                      : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User Footer */}
      <div className="border-t border-sidebar-border/80 p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {userProfile?.nome}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {userProfile?.role === 'admin' ? 'Administrador' : 'Usuário'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </>
  );
};

export const Sidebar: React.FC = () => {
  return (
    <aside className="hidden h-screen w-72 flex-col border-r border-sidebar-border/80 bg-sidebar/95 md:flex">
      <SidebarContent />
    </aside>
  );
};

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ open, onOpenChange }) => {
  const location = useLocation();
  const previousPathnameRef = React.useRef(location.pathname);

  React.useEffect(() => {
    const previousPathname = previousPathnameRef.current;
    const pathnameChanged = previousPathname !== location.pathname;

    if (pathnameChanged && open) {
      onOpenChange(false);
    }

    previousPathnameRef.current = location.pathname;
  }, [location.pathname, onOpenChange, open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        id="mobile-sidebar"
        side="left"
        className="w-[85vw] max-w-72 border-r border-sidebar-border/80 bg-sidebar/95 p-0 text-sidebar-foreground"
      >
        <div className="flex h-full flex-col">
          <SidebarContent onNavigate={() => onOpenChange(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
