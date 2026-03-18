import React, { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { WhatsAppMensagem } from '@/types/whatsapp';

interface WhatsAppTopSendersProps {
  mensagens: WhatsAppMensagem[];
  loading?: boolean;
}

export const WhatsAppTopSenders: React.FC<WhatsAppTopSendersProps> = ({ mensagens, loading }) => {
  const topSenders = useMemo(() => {
    const map = new Map<string, { nome: string; total: number; ultima: string }>();
    mensagens.forEach((m) => {
      const key = m.remetente_telefone;
      const existing = map.get(key);
      if (!existing) {
        map.set(key, { nome: m.remetente_nome, total: 1, ultima: m.data_recebimento });
      } else {
        existing.total += 1;
        if (m.data_recebimento > existing.ultima) existing.ultima = m.data_recebimento;
      }
    });
    return Array.from(map.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [mensagens]);

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-foreground">
          Top Remetentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topSenders.map((sender, i) => (
            <div
              key={sender.nome + i}
              className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-400/10">
                  <User className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{sender.nome}</p>
                  <p className="text-xs text-muted-foreground">
                    Última: {format(parseISO(sender.ultima), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="bg-muted/30 text-foreground">
                {sender.total} msg{sender.total !== 1 ? 's' : ''}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
