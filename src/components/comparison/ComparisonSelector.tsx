import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { GitCompare } from 'lucide-react';

interface Profile {
  id: string;
  nome: string;
  plataforma: string;
}

interface ComparisonSelectorProps {
  profiles: Profile[];
  profileAId: string | null;
  profileBId: string | null;
  includeInstagram: boolean;
  onProfileAChange: (id: string) => void;
  onProfileBChange: (id: string) => void;
  onIncludeInstagramChange: (value: boolean) => void;
  onCompare: () => void;
  loading?: boolean;
}

export const ComparisonSelector: React.FC<ComparisonSelectorProps> = ({
  profiles,
  profileAId,
  profileBId,
  includeInstagram,
  onProfileAChange,
  onProfileBChange,
  onIncludeInstagramChange,
  onCompare,
  loading = false,
}) => {
  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Perfil A</Label>
              <Select value={profileAId || ''} onValueChange={onProfileAChange}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Selecione o perfil A" />
                </SelectTrigger>
                <SelectContent>
                  {profiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Perfil B</Label>
              <Select value={profileBId || ''} onValueChange={onProfileBChange}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Selecione o perfil B" />
                </SelectTrigger>
                <SelectContent>
                  {profiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeInstagram"
                checked={includeInstagram}
                onCheckedChange={(checked) => onIncludeInstagramChange(checked as boolean)}
              />
              <Label
                htmlFor="includeInstagram"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Incluir Instagram (somar FB+IG)
              </Label>
            </div>

            <Button
              onClick={onCompare}
              disabled={!profileAId || !profileBId || loading}
              className="bg-[#C4A000] hover:bg-[#C4A000]/90 text-black font-medium"
            >
              <GitCompare className="h-4 w-4 mr-2" />
              Comparar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
