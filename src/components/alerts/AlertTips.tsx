import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

export const AlertTips = () => {
  const tips = [
    'Monitore quando o adversário tiver post com engajamento > 150',
    'Alerte se Fábio Passos ficar 5 dias sem postar',
    'Acompanhe variações de seguidores > 3%',
    'Configure alertas para posts com mais de 50 comentários',
    'Monitore quedas bruscas na taxa de engajamento',
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Lightbulb className="h-5 w-5 text-[#C4A000]" />
          Dicas de Alertas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-[#C4A000] mt-0.5">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
