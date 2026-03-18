import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ReportConfig, ReportData } from '@/types/reports';

interface PrintableReportProps {
  config: ReportConfig;
  data: ReportData;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({ config, data }) => {
  const formatNumber = (num: number) => num.toLocaleString('pt-BR');
  const formatPercent = (num: number) => `${num.toFixed(2)}%`;

  const generateConclusions = (): string[] => {
    const conclusions: string[] = [];
    
    if (data.comparativo.fabio && data.comparativo.roberto) {
      const { fabio, roberto } = data.comparativo;
      
      if (fabio.seguidores > roberto.seguidores) {
        const diff = ((fabio.seguidores - roberto.seguidores) / roberto.seguidores * 100).toFixed(1);
        conclusions.push(`Fábio Passos tem ${diff}% mais seguidores que Roberto Sales.`);
      } else if (roberto.seguidores > fabio.seguidores) {
        const diff = ((roberto.seguidores - fabio.seguidores) / fabio.seguidores * 100).toFixed(1);
        conclusions.push(`Roberto Sales tem ${diff}% mais seguidores que Fábio Passos.`);
      }
      
      if (fabio.taxaEngajamento > roberto.taxaEngajamento) {
        conclusions.push(`Fábio Passos apresenta taxa de engajamento superior (${formatPercent(fabio.taxaEngajamento)} vs ${formatPercent(roberto.taxaEngajamento)}).`);
      } else if (roberto.taxaEngajamento > fabio.taxaEngajamento) {
        conclusions.push(`Roberto Sales apresenta taxa de engajamento superior (${formatPercent(roberto.taxaEngajamento)} vs ${formatPercent(fabio.taxaEngajamento)}).`);
      }

      if (fabio.totalPosts > roberto.totalPosts) {
        conclusions.push(`Fábio Passos publicou mais conteúdo no período (${fabio.totalPosts} posts vs ${roberto.totalPosts}).`);
      } else if (roberto.totalPosts > fabio.totalPosts) {
        conclusions.push(`Roberto Sales publicou mais conteúdo no período (${roberto.totalPosts} posts vs ${fabio.totalPosts}).`);
      }
    }
    
    const bestProfile = [...data.perfis].sort((a, b) => b.engajamento - a.engajamento)[0];
    if (bestProfile) {
      conclusions.push(`${bestProfile.nome} teve o melhor engajamento no período com ${formatNumber(bestProfile.engajamento)} interações totais.`);
    }
    
    return conclusions;
  };

  const conclusions = generateConclusions();
  const showMetricsTable = config.tipo === 'completo';
  const showTopPosts = config.tipo === 'completo' || config.tipo === 'comparativo';
  const showWeeklyData = (config.tipo === 'completo' || config.tipo === 'comparativo') && data.weeklyData.length > 1;
  const postsToShow = config.tipo === 'comparativo' ? 5 : 10;

  return (
    <div className="print-content bg-white text-black p-6 md:p-8 space-y-6">
      {/* Cabeçalho */}
      <header className="border-b-2 border-[#00285F] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00285F] rounded flex items-center justify-center">
            <span className="text-white font-bold text-lg">FP</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#00285F]">FP OBSERVA</h1>
            <p className="text-xs text-gray-500">Sistema de Monitoramento</p>
          </div>
        </div>
        <h2 className="text-lg font-semibold mt-3 text-gray-800">{config.titulo}</h2>
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
          <span>
            <strong>Período:</strong> {format(config.periodoInicio, "dd/MM/yyyy", { locale: ptBR })} a {format(config.periodoFim, "dd/MM/yyyy", { locale: ptBR })}
          </span>
          <span>
            <strong>Tipo:</strong> {config.tipo === 'resumo' ? 'Resumo Executivo' : config.tipo === 'completo' ? 'Completo' : 'Comparativo'}
          </span>
          <span>
            <strong>Gerado em:</strong> {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </span>
        </div>
      </header>

      {/* Seção 1: Resumo Executivo */}
      <section>
        <h3 className="text-base font-bold text-[#00285F] border-b border-gray-300 pb-2 mb-4">
          1. Resumo Executivo
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <p className="text-xs text-gray-600">Total de Posts</p>
            <p className="text-xl font-bold text-gray-900">{formatNumber(data.totais.posts)}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <p className="text-xs text-gray-600">Total de Curtidas</p>
            <p className="text-xl font-bold text-gray-900">{formatNumber(data.totais.curtidas)}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <p className="text-xs text-gray-600">Total de Comentários</p>
            <p className="text-xl font-bold text-gray-900">{formatNumber(data.totais.comentarios)}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <p className="text-xs text-gray-600">Engajamento Total</p>
            <p className="text-xl font-bold text-[#00285F]">{formatNumber(data.totais.engajamento)}</p>
          </div>
        </div>

        {/* Comparativo Rápido */}
        {data.comparativo.fabio && data.comparativo.roberto && (
          <div className="mt-5">
            <h4 className="font-semibold mb-3 text-gray-800">Comparativo: Fábio Passos vs Roberto Sales</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#00285F]">
                    <th className="p-2 text-left text-white font-medium">Métrica</th>
                    <th className="p-2 text-right text-white font-medium">Fábio Passos</th>
                    <th className="p-2 text-right text-white font-medium">Roberto Sales</th>
                    <th className="p-2 text-center text-white font-medium">Vencedor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="p-2 text-gray-700">Seguidores</td>
                    <td className="p-2 text-right font-medium text-gray-900">{formatNumber(data.comparativo.fabio.seguidores)}</td>
                    <td className="p-2 text-right font-medium text-gray-900">{formatNumber(data.comparativo.roberto.seguidores)}</td>
                    <td className="p-2 text-center">
                      {data.comparativo.fabio.seguidores > data.comparativo.roberto.seguidores ? '🏆 FP' : 
                       data.comparativo.fabio.seguidores < data.comparativo.roberto.seguidores ? '🏆 RS' : '—'}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="p-2 text-gray-700">Posts no Período</td>
                    <td className="p-2 text-right font-medium text-gray-900">{formatNumber(data.comparativo.fabio.totalPosts)}</td>
                    <td className="p-2 text-right font-medium text-gray-900">{formatNumber(data.comparativo.roberto.totalPosts)}</td>
                    <td className="p-2 text-center">
                      {data.comparativo.fabio.totalPosts > data.comparativo.roberto.totalPosts ? '🏆 FP' : 
                       data.comparativo.fabio.totalPosts < data.comparativo.roberto.totalPosts ? '🏆 RS' : '—'}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-2 text-gray-700">Engajamento Total</td>
                    <td className="p-2 text-right font-medium text-gray-900">{formatNumber(data.comparativo.fabio.engajamento)}</td>
                    <td className="p-2 text-right font-medium text-gray-900">{formatNumber(data.comparativo.roberto.engajamento)}</td>
                    <td className="p-2 text-center">
                      {data.comparativo.fabio.engajamento > data.comparativo.roberto.engajamento ? '🏆 FP' : 
                       data.comparativo.fabio.engajamento < data.comparativo.roberto.engajamento ? '🏆 RS' : '—'}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="p-2 text-gray-700">Taxa de Engajamento</td>
                    <td className="p-2 text-right font-medium text-gray-900">{formatPercent(data.comparativo.fabio.taxaEngajamento)}</td>
                    <td className="p-2 text-right font-medium text-gray-900">{formatPercent(data.comparativo.roberto.taxaEngajamento)}</td>
                    <td className="p-2 text-center">
                      {data.comparativo.fabio.taxaEngajamento > data.comparativo.roberto.taxaEngajamento ? '🏆 FP' : 
                       data.comparativo.fabio.taxaEngajamento < data.comparativo.roberto.taxaEngajamento ? '🏆 RS' : '—'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Seção 2: Métricas por Perfil (apenas Completo) */}
      {showMetricsTable && (
        <section>
          <h3 className="text-base font-bold text-[#00285F] border-b border-gray-300 pb-2 mb-4">
            2. Métricas por Perfil
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#00285F]">
                  <th className="p-2 text-left text-white font-medium">Perfil</th>
                  <th className="p-2 text-right text-white font-medium">Seguidores</th>
                  <th className="p-2 text-right text-white font-medium">Posts</th>
                  <th className="p-2 text-right text-white font-medium">Curtidas</th>
                  <th className="p-2 text-right text-white font-medium">Comentários</th>
                  <th className="p-2 text-right text-white font-medium">Engajamento</th>
                  <th className="p-2 text-right text-white font-medium">Taxa</th>
                </tr>
              </thead>
              <tbody>
                {data.perfis.map((perfil, index) => (
                  <tr key={perfil.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="p-2 font-medium text-gray-900">{perfil.nome}</td>
                    <td className="p-2 text-right text-gray-700">{formatNumber(perfil.seguidores)}</td>
                    <td className="p-2 text-right text-gray-700">{formatNumber(perfil.totalPosts)}</td>
                    <td className="p-2 text-right text-gray-700">{formatNumber(perfil.curtidas)}</td>
                    <td className="p-2 text-right text-gray-700">{formatNumber(perfil.comentarios)}</td>
                    <td className="p-2 text-right font-medium text-gray-900">{formatNumber(perfil.engajamento)}</td>
                    <td className="p-2 text-right text-gray-700">{formatPercent(perfil.taxaEngajamento)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Seção 3: Top Posts */}
      {showTopPosts && data.topPosts.length > 0 && (
        <section>
          <h3 className="text-base font-bold text-[#00285F] border-b border-gray-300 pb-2 mb-4">
            {showMetricsTable ? '3.' : '2.'} Top {postsToShow} Posts do Período
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#00285F]">
                  <th className="p-2 text-center text-white font-medium w-8">#</th>
                  <th className="p-2 text-left text-white font-medium">Perfil</th>
                  <th className="p-2 text-left text-white font-medium">Data</th>
                  <th className="p-2 text-left text-white font-medium">Tipo</th>
                  <th className="p-2 text-right text-white font-medium">Curtidas</th>
                  <th className="p-2 text-right text-white font-medium">Coment.</th>
                  <th className="p-2 text-right text-white font-medium">Engaj.</th>
                </tr>
              </thead>
              <tbody>
                {data.topPosts.slice(0, postsToShow).map((post, index) => (
                  <tr key={post.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="p-2 text-center font-bold text-[#00285F]">{index + 1}</td>
                    <td className="p-2 text-gray-900">{post.perfil_nome || '-'}</td>
                    <td className="p-2 text-gray-700">{format(new Date(post.data_publicacao), "dd/MM/yyyy", { locale: ptBR })}</td>
                    <td className="p-2 capitalize text-gray-700">{post.tipo || '-'}</td>
                    <td className="p-2 text-right text-gray-700">{formatNumber(post.curtidas || 0)}</td>
                    <td className="p-2 text-right text-gray-700">{formatNumber(post.comentarios || 0)}</td>
                    <td className="p-2 text-right font-medium text-gray-900">{formatNumber(post.engajamento_total || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Seção 4: Evolução Semanal */}
      {showWeeklyData && (
        <section>
          <h3 className="text-base font-bold text-[#00285F] border-b border-gray-300 pb-2 mb-4">
            {showMetricsTable ? '4.' : '3.'} Evolução Semanal
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#00285F]">
                  <th className="p-2 text-left text-white font-medium">Semana</th>
                  <th className="p-2 text-right text-white font-medium">Posts</th>
                  <th className="p-2 text-right text-white font-medium">Engajamento</th>
                </tr>
              </thead>
              <tbody>
                {data.weeklyData.map((week, index) => (
                  <tr key={week.semana} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="p-2 text-gray-900">{week.semana}</td>
                    <td className="p-2 text-right text-gray-700">{formatNumber(week.posts)}</td>
                    <td className="p-2 text-right font-medium text-gray-900">{formatNumber(week.engajamento)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Seção 5: Conclusões */}
      {conclusions.length > 0 && (
        <section>
          <h3 className="text-base font-bold text-[#00285F] border-b border-gray-300 pb-2 mb-4">
            {showMetricsTable ? (showWeeklyData ? '5.' : '4.') : (showWeeklyData ? '4.' : '3.')} Conclusões e Destaques
          </h3>
          <ul className="space-y-2">
            {conclusions.map((conclusion, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-[#00285F] font-bold mt-0.5">•</span>
                <span className="text-gray-700">{conclusion}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Rodapé */}
      <footer className="border-t-2 border-[#00285F] pt-4 mt-6">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <div>
            <p className="font-medium text-[#00285F]">FP OBSERVA</p>
            <p>Sistema de Monitoramento de Redes Sociais</p>
          </div>
          <div className="text-right">
            <p>Relatório gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
            <p>Período: {format(config.periodoInicio, "dd/MM/yyyy", { locale: ptBR })} - {format(config.periodoFim, "dd/MM/yyyy", { locale: ptBR })}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
