import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface ComparisonMetricCardProps {
  label: string;
  icon: LucideIcon;
  valueA: number;
  valueB: number;
  colorA: string;
  colorB: string;
  formatValue?: (val: number) => string;
  higherIsBetter?: boolean;
}

export const ComparisonMetricCard: React.FC<ComparisonMetricCardProps> = ({
  label,
  icon: Icon,
  valueA,
  valueB,
  colorA,
  colorB,
  formatValue = (val) => val.toLocaleString('pt-BR'),
  higherIsBetter = true,
}) => {
  const aWins = higherIsBetter ? valueA > valueB : valueA < valueB;
  const bWins = higherIsBetter ? valueB > valueA : valueB < valueA;
  const isTie = valueA === valueB;

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="flex">
        {/* Left border for Profile A */}
        <div className="w-1" style={{ backgroundColor: colorA }} />
        
        <CardContent className="flex-1 p-4">
          <div className="flex items-center justify-between gap-2">
            {/* Profile A Value */}
            <div 
              className="flex-1 text-center p-3 rounded-lg transition-colors"
              style={{ 
                backgroundColor: aWins ? `${colorA}15` : 'transparent',
              }}
            >
              <div className="flex items-center justify-center gap-2">
                {aWins && !isTie && (
                  <Trophy className="h-4 w-4 text-[#C4A000]" />
                )}
                <span className="text-xl font-bold text-foreground">
                  {formatValue(valueA)}
                </span>
              </div>
            </div>

            {/* VS Badge */}
            <div className="flex flex-col items-center gap-1 px-2">
              <div className="bg-muted text-muted-foreground text-xs font-medium px-2 py-1 rounded">
                VS
              </div>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* Profile B Value */}
            <div 
              className="flex-1 text-center p-3 rounded-lg transition-colors"
              style={{ 
                backgroundColor: bWins ? `${colorB}15` : 'transparent',
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl font-bold text-foreground">
                  {formatValue(valueB)}
                </span>
                {bWins && !isTie && (
                  <Trophy className="h-4 w-4 text-[#C4A000]" />
                )}
              </div>
            </div>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-2">
            {label}
          </p>
        </CardContent>

        {/* Right border for Profile B */}
        <div className="w-1" style={{ backgroundColor: colorB }} />
      </div>
    </Card>
  );
};
