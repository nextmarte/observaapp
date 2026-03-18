import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ComparisonMetrics } from '@/types/comparison';

interface ComparisonSummaryProps {
  profileAName: string;
  profileBName: string;
  metricsA: ComparisonMetrics;
  metricsB: ComparisonMetrics;
  colorA: string;
  colorB: string;
}

export const ComparisonSummary: React.FC<ComparisonSummaryProps> = ({
  profileAName,
  profileBName,
  metricsA,
  metricsB,
  colorA,
  colorB,
}) => {
  const insights: { text: React.ReactNode; icon: React.ReactNode }[] = [];

  // Followers comparison
  if (metricsA.seguidores !== metricsB.seguidores) {
    const diff = Math.abs(metricsA.seguidores - metricsB.seguidores);
    const percentDiff = metricsB.seguidores > 0 
      ? ((diff / Math.min(metricsA.seguidores, metricsB.seguidores)) * 100).toFixed(1)
      : '0';
    
    if (metricsA.seguidores > metricsB.seguidores) {
      insights.push({
        text: (
          <>
            <span style={{ color: colorA }} className="font-semibold">{profileAName}</span>
            {' '}tem {percentDiff}% mais seguidores que{' '}
            <span style={{ color: colorB }} className="font-semibold">{profileBName}</span>
          </>
        ),
        icon: <TrendingUp className="h-4 w-4 text-green-500" />,
      });
    } else {
      insights.push({
        text: (
          <>
            <span style={{ color: colorB }} className="font-semibold">{profileBName}</span>
            {' '}tem {percentDiff}% mais seguidores que{' '}
            <span style={{ color: colorA }} className="font-semibold">{profileAName}</span>
          </>
        ),
        icon: <TrendingUp className="h-4 w-4 text-green-500" />,
      });
    }
  }

  // Engagement rate comparison
  if (metricsA.taxaEngajamento !== metricsB.taxaEngajamento) {
    const diff = Math.abs(metricsA.taxaEngajamento - metricsB.taxaEngajamento).toFixed(2);
    
    if (metricsA.taxaEngajamento > metricsB.taxaEngajamento) {
      insights.push({
        text: (
          <>
            <span style={{ color: colorA }} className="font-semibold">{profileAName}</span>
            {' '}tem taxa de engajamento {diff}% superior
          </>
        ),
        icon: <TrendingUp className="h-4 w-4 text-green-500" />,
      });
    } else {
      insights.push({
        text: (
          <>
            <span style={{ color: colorB }} className="font-semibold">{profileBName}</span>
            {' '}tem taxa de engajamento {diff}% superior
          </>
        ),
        icon: <TrendingUp className="h-4 w-4 text-green-500" />,
      });
    }
  }

  // Posts last week comparison
  if (metricsA.postsUltimaSemana !== metricsB.postsUltimaSemana) {
    if (metricsA.postsUltimaSemana > metricsB.postsUltimaSemana) {
      const ratio = metricsB.postsUltimaSemana > 0 
        ? (metricsA.postsUltimaSemana / metricsB.postsUltimaSemana).toFixed(1)
        : metricsA.postsUltimaSemana.toString();
      insights.push({
        text: (
          <>
            <span style={{ color: colorA }} className="font-semibold">{profileAName}</span>
            {' '}postou {ratio}x mais na última semana
          </>
        ),
        icon: <TrendingUp className="h-4 w-4 text-blue-500" />,
      });
    } else if (metricsB.postsUltimaSemana > 0) {
      const ratio = metricsA.postsUltimaSemana > 0 
        ? (metricsB.postsUltimaSemana / metricsA.postsUltimaSemana).toFixed(1)
        : metricsB.postsUltimaSemana.toString();
      insights.push({
        text: (
          <>
            <span style={{ color: colorB }} className="font-semibold">{profileBName}</span>
            {' '}postou {ratio}x mais na última semana
          </>
        ),
        icon: <TrendingUp className="h-4 w-4 text-blue-500" />,
      });
    }
  }

  // Total engagement comparison
  if (metricsA.engajamentoTotal !== metricsB.engajamentoTotal) {
    const formatNumber = (val: number) => {
      if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
      if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
      return val.toString();
    };

    if (metricsA.engajamentoTotal > metricsB.engajamentoTotal) {
      insights.push({
        text: (
          <>
            <span style={{ color: colorA }} className="font-semibold">{profileAName}</span>
            {' '}lidera com {formatNumber(metricsA.engajamentoTotal)} interações totais
          </>
        ),
        icon: <TrendingUp className="h-4 w-4 text-[#C4A000]" />,
      });
    } else {
      insights.push({
        text: (
          <>
            <span style={{ color: colorB }} className="font-semibold">{profileBName}</span>
            {' '}lidera com {formatNumber(metricsB.engajamentoTotal)} interações totais
          </>
        ),
        icon: <TrendingUp className="h-4 w-4 text-[#C4A000]" />,
      });
    }
  }

  // Count wins
  let winsA = 0;
  let winsB = 0;
  const metrics = [
    { a: metricsA.seguidores, b: metricsB.seguidores },
    { a: metricsA.totalPosts, b: metricsB.totalPosts },
    { a: metricsA.postsUltimaSemana, b: metricsB.postsUltimaSemana },
    { a: metricsA.totalCurtidas, b: metricsB.totalCurtidas },
    { a: metricsA.totalComentarios, b: metricsB.totalComentarios },
    { a: metricsA.totalCompartilhamentos, b: metricsB.totalCompartilhamentos },
    { a: metricsA.engajamentoTotal, b: metricsB.engajamentoTotal },
    { a: metricsA.taxaEngajamento, b: metricsB.taxaEngajamento },
    { a: metricsA.mediaCurtidasPorPost, b: metricsB.mediaCurtidasPorPost },
    { a: metricsA.mediaComentariosPorPost, b: metricsB.mediaComentariosPorPost },
  ];

  metrics.forEach(m => {
    if (m.a > m.b) winsA++;
    else if (m.b > m.a) winsB++;
  });

  if (winsA !== winsB) {
    const winner = winsA > winsB ? profileAName : profileBName;
    const winnerColor = winsA > winsB ? colorA : colorB;
    const winCount = Math.max(winsA, winsB);
    
    insights.push({
      text: (
        <>
          <span style={{ color: winnerColor }} className="font-semibold">{winner}</span>
          {' '}lidera em {winCount} de 10 métricas
        </>
      ),
      icon: <TrendingUp className="h-4 w-4 text-[#C4A000]" />,
    });
  } else {
    insights.push({
      text: 'Empate técnico: ambos os perfis lideram em 5 métricas cada',
      icon: <Minus className="h-4 w-4 text-muted-foreground" />,
    });
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <FileText className="h-5 w-5 text-secondary" />
          Resumo Executivo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="mt-0.5">{insight.icon}</div>
              <span className="text-foreground">{insight.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
