import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Radar, AlertCircle, Users, Lightbulb } from 'lucide-react';
import { MentionsRadar } from './MentionsRadar';
import { ProblemsTable } from './ProblemsTable';
import { CommentersAnalysis } from './CommentersAnalysis';
import { OpportunitiesList } from './OpportunitiesList';

interface IntelligenceTabsProps {
  ebserhFilter?: boolean;
  onClearEbserhFilter?: () => void;
}

export const IntelligenceTabs: React.FC<IntelligenceTabsProps> = ({ 
  ebserhFilter = false, 
  onClearEbserhFilter 
}) => {
  const [activeTab, setActiveTab] = useState('mentions');

  // When ebserhFilter is activated, switch to mentions tab
  useEffect(() => {
    if (ebserhFilter) {
      setActiveTab('mentions');
    }
  }, [ebserhFilter]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="bg-muted/50 p-1">
        <TabsTrigger value="mentions" className="flex items-center gap-2 data-[state=active]:bg-card">
          <Radar className="h-4 w-4" />
          <span className="hidden sm:inline">Radar de Menções</span>
          <span className="sm:hidden">Menções</span>
        </TabsTrigger>
        <TabsTrigger value="problems" className="flex items-center gap-2 data-[state=active]:bg-card">
          <AlertCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Problemas & Demandas</span>
          <span className="sm:hidden">Problemas</span>
        </TabsTrigger>
        <TabsTrigger value="commenters" className="flex items-center gap-2 data-[state=active]:bg-card">
          <Users className="h-4 w-4" />
          <span>Comentaristas</span>
        </TabsTrigger>
        <TabsTrigger value="opportunities" className="flex items-center gap-2 data-[state=active]:bg-card">
          <Lightbulb className="h-4 w-4" />
          <span>Oportunidades</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="mentions" className="mt-4">
        <MentionsRadar ebserhFilter={ebserhFilter} onClearEbserhFilter={onClearEbserhFilter} />
      </TabsContent>

      <TabsContent value="problems" className="mt-4">
        <ProblemsTable />
      </TabsContent>

      <TabsContent value="commenters" className="mt-4">
        <CommentersAnalysis />
      </TabsContent>

      <TabsContent value="opportunities" className="mt-4">
        <OpportunitiesList />
      </TabsContent>
    </Tabs>
  );
};
