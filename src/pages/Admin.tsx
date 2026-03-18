import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Settings } from 'lucide-react';

const Admin = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-secondary" />
          <h1 className="text-2xl font-bold text-foreground">Administração</h1>
        </div>
        <div className="bg-card rounded-lg border border-border p-8 text-center">
          <p className="text-muted-foreground">Conteúdo em desenvolvimento</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Admin;
