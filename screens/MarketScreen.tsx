import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeamLogo } from '../components/TeamLogo';
import { Header } from '../components/Header';
import { Player, Team, TransferLog, TransferOffer } from '../types';
import {
  Briefcase,
  Search,
  ShieldAlert,
  History,
  Tags,
  DollarSign,
  CalendarDays,
  TrendingUp,
  X,
  Target,
  Users
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { hapticSelection, impactHeavy } from '../haptics';

interface Props {
  userTeam: Team;
  allTeams: Team[];
  funds: number;
  isWindowOpen: boolean;
  offers: TransferOffer[];
  logs: TransferLog[];
  onBack: () => void;
  onBuy: (player: Player, fromTeamId: string, cost: number) => void;
  onLoanPlayer: (player: Player, fromTeamId: string, fee: number) => void;
  onSell: (player: Player, value: number) => void;
  onAcceptOffer: (offer: TransferOffer) => void;
  onDeclineOffer: (offerId: string) => void;
}

type MarketTab = 'EXPLORE' | 'OFFERS' | 'HISTORY' | 'LISTED';

export default function MarketScreen({
  userTeam,
  allTeams,
  funds,
  isWindowOpen,
  offers,
  logs,
  onBack,
  onBuy,
  onLoanPlayer,
  onSell,
  onAcceptOffer,
  onDeclineOffer
}: Props) {
  const [activeTab, setActiveTab] = useState<MarketTab>('EXPLORE');
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyFreeAgents, setOnlyFreeAgents] = useState(false);
  const [onlyAffordable, setOnlyAffordable] = useState(false);
  const [negotiatingPlayer, setNegotiatingPlayer] = useState<{ p: Player; t: Team } | null>(null);
  const [bidValue, setBidValue] = useState<number>(0);

  const formatMoney = (val: number) => `R$ ${(val / 1000).toFixed(0)}k`;
  const squadAverage = Math.round(userTeam.roster.reduce((sum, player) => sum + player.overall, 0) / Math.max(userTeam.roster.length, 1));

  const availablePlayers = useMemo(() => {
    const list: { p: Player; t: Team }[] = [];

    allTeams.forEach((team) => {
      if (team.id === userTeam.id) return;
      if (onlyFreeAgents && team.id !== 'free_agent') return;

      team.roster.forEach((player) => {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        const matchesSearch = !normalizedSearch
          || player.name.toLowerCase().includes(normalizedSearch)
          || team.name.toLowerCase().includes(normalizedSearch)
          || team.shortName.toLowerCase().includes(normalizedSearch)
          || player.position.toLowerCase().includes(normalizedSearch);

        const matchesBudget = !onlyAffordable || player.marketValue <= funds;

        if (matchesSearch && matchesBudget) {
          list.push({ p: player, t: team });
        }
      });
    });

    return list.sort((a, b) => b.p.overall - a.p.overall);
  }, [allTeams, funds, onlyAffordable, onlyFreeAgents, searchTerm, userTeam.id]);

  const freeAgentsCount = useMemo(
    () => allTeams.find((team) => team.id === 'free_agent')?.roster.length ?? 0,
    [allTeams]
  );

  const affordableTargets = useMemo(
    () => availablePlayers.filter(({ p }) => p.marketValue <= funds),
    [availablePlayers, funds]
  );

  const listedPlayers = useMemo(
    () => userTeam.roster.filter((player) => player.isForSale || player.isListedForLoan),
    [userTeam.roster]
  );

  const marketPulse = useMemo(() => {
    if (!isWindowOpen) {
      return {
        title: 'Janela fechada',
        copy: 'Use esta tela para mapear alvos e preparar saídas antes da próxima abertura.',
        tone: 'blue'
      } as const;
    }

    if (offers.length > 0) {
      return {
        title: 'Existem decisões pendentes',
        copy: `Você tem ${offers.length} proposta${offers.length > 1 ? 's' : ''} para responder antes de mexer no resto do elenco.`,
        tone: 'amber'
      } as const;
    }

    if (funds < 250000) {
      return {
        title: 'Caixa curto para compras',
        copy: 'Priorize agentes livres, empréstimos ou vendas antes de abrir disputa por reforços.',
        tone: 'red'
      } as const;
    }

    return {
      title: 'Janela sob controle',
      copy: 'Você tem margem para buscar reforços, mas a prioridade continua sendo encaixe e custo.',
      tone: 'green'
    } as const;
  }, [funds, isWindowOpen, offers.length]);

  const handleStartNegotiation = (player: Player, team: Team) => {
    if (!isWindowOpen) {
      toast.error('A janela está fechada no momento.');
      return;
    }

    setNegotiatingPlayer({ p: player, t: team });
    setBidValue(player.marketValue);
  };

  const handleConfirmBid = () => {
    if (!negotiatingPlayer) return;
    if (bidValue > funds) {
      toast.error('Saldo insuficiente!');
      return;
    }

    const player = negotiatingPlayer.p;
    const ratio = bidValue / player.marketValue;

    if (ratio >= 1.2 || (ratio >= 0.9 && Math.random() > 0.4)) {
      onBuy(player, negotiatingPlayer.t.id, bidValue);
      setNegotiatingPlayer(null);
      return;
    }

    const isFreeAgent = negotiatingPlayer.t.id === 'free_agent';
    const entity = isFreeAgent ? `O agente de ${player.name}` : `O ${negotiatingPlayer.t.shortName}`;
    toast.error(`${entity} recusou sua proposta. ${isFreeAgent ? 'Ele quer' : 'Eles querem'} valorização.`);
  };

  const handleListForSale = (player: Player) => {
    if (!isWindowOpen) {
      toast.error('A janela está fechada no momento.');
      return;
    }

    onSell(player, player.marketValue);
    toast.success(`${player.name} foi colocado na vitrine.`);
  };

  const handleListForLoan = (player: Player) => {
    if (!isWindowOpen) {
      toast.error('A janela está fechada no momento.');
      return;
    }

    onLoanPlayer(player, userTeam.id, Math.max(Math.round(player.marketValue * 0.08), 25000));
    toast.success(`${player.name} foi disponibilizado para empréstimo.`);
  };

  const renderEmptyState = (title: string, copy: string) => (
    <div className="rounded-[2.5rem] border border-white/8 bg-surface/70 p-8 text-center backdrop-blur-md">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/5 border border-white/5">
        <ShieldAlert size={28} className="text-secondary opacity-40" />
      </div>
      <h3 className="text-xl font-black tracking-tight text-white mb-2">{title}</h3>
      <p className="mx-auto max-w-sm text-[13px] leading-relaxed text-white/40">{copy}</p>
    </div>
  );

  return (
    <div className="flex h-screen flex-col bg-background font-sans text-white overflow-hidden">
      <Header 
        title="Mercado"
        subtitle="Transferências"
        onBack={onBack}
        rightAction={<div className="px-3 py-1.5 bg-primary/10 rounded-xl border border-primary/20 text-primary font-black text-xs">{formatMoney(funds)}</div>}
      />

      <main className="flex-1 space-y-6 overflow-y-auto p-6 pb-28 no-scrollbar">
        {/* Market Pulse Card */}
        <section className="ui-card-premium p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 blur-[100px] rounded-full group-hover:bg-primary/10 transition-colors duration-1000" />
          
          <div className="relative z-10 flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <div className={clsx(
                  "w-2 h-2 rounded-full animate-pulse",
                  marketPulse.tone === 'green' && 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
                  marketPulse.tone === 'amber' && 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
                  marketPulse.tone === 'red' && 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]',
                  marketPulse.tone === 'blue' && 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                )} />
                <p className="ui-label-caps opacity-60">Status do Mercado</p>
              </div>
              <h2 className="text-3xl font-black tracking-tighter text-white leading-none mb-3 italic uppercase">{marketPulse.title}</h2>
              <p className="text-[13px] leading-relaxed text-secondary font-medium max-w-md">{marketPulse.copy}</p>
            </div>
            <div
              className={clsx(
                'shrink-0 rounded-2xl px-5 py-4 text-[10px] font-black uppercase tracking-[0.2em] border backdrop-blur-xl shadow-2xl transition-all duration-500',
                marketPulse.tone === 'green' && 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10',
                marketPulse.tone === 'amber' && 'bg-amber-500/10 text-amber-300 border-amber-500/20 shadow-amber-500/10',
                marketPulse.tone === 'red' && 'bg-rose-500/10 text-rose-300 border-rose-500/20 shadow-rose-500/10',
                marketPulse.tone === 'blue' && 'bg-blue-500/10 text-blue-300 border-blue-500/20 shadow-blue-500/10'
              )}
            >
              {isWindowOpen ? 'Janela Aberta' : 'Janela Fechada'}
            </div>
          </div>

          <div className="relative z-10 mt-10 grid grid-cols-3 gap-4">
            {[
              { label: 'Agentes Livres', value: freeAgentsCount, icon: <Users size={12} /> },
              { label: 'Alvos Viáveis', value: affordableTargets.length, icon: <Target size={12} /> },
              { label: 'Média OVR', value: squadAverage, icon: <TrendingUp size={12} /> }
            ].map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/5 bg-black/40 p-5 hover:bg-black/60 transition-colors group/stat">
                <div className="flex items-center gap-2 mb-2 opacity-40 group-hover/stat:opacity-80 transition-opacity">
                  <span className="text-primary">{stat.icon}</span>
                  <p className="ui-label-caps text-[8px]">{stat.label}</p>
                </div>
                <p className="text-2xl font-black tracking-tighter text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar sticky top-0 z-40 -mx-6 px-6 bg-background/80 backdrop-blur-2xl py-4 border-b border-white/5">
          {[
            { id: 'EXPLORE', label: 'Explorar', icon: <Search size={14} /> },
            { id: 'OFFERS', label: 'Propostas', icon: <Tags size={14} />, badge: offers.length },
            { id: 'HISTORY', label: 'Histórico', icon: <History size={14} />, badge: logs.length },
            { id: 'LISTED', label: 'Meu elenco', icon: <Briefcase size={14} />, badge: listedPlayers.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { hapticSelection(); setActiveTab(tab.id as MarketTab); }}
              className={clsx(
                'flex shrink-0 items-center gap-3 rounded-[1.25rem] px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border relative',
                activeTab === tab.id
                  ? 'bg-primary text-white border-primary shadow-[0_0_25px_rgba(var(--primary-rgb),0.3)] scale-105 z-10'
                  : 'bg-white/5 text-secondary border-white/5 hover:bg-white/10 hover:border-white/10'
              )}
            >
              {tab.icon}
              <span className="whitespace-nowrap">{tab.label}</span>
              {tab.badge ? (
                <div className="absolute -top-1.5 -right-1.5 h-6 min-w-[24px] px-1.5 flex items-center justify-center rounded-full bg-emerald-500 border-2 border-background text-[9px] text-white font-black shadow-lg">
                  {tab.badge}
                </div>
              ) : null}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <section className="space-y-6">
          {activeTab === 'EXPLORE' && (
            <div className="space-y-6">
              <div className="ui-card-premium p-8 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full pointer-events-none" />
                
                <div className="flex items-start justify-between gap-4 mb-8">
                  <div className="flex-1">
                    <p className="ui-label-caps text-primary mb-2">Busca Avançada</p>
                    <h3 className="text-2xl font-black tracking-tighter text-white uppercase italic">Qualidade Técnica</h3>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-right group/res hover:border-primary/30 transition-all">
                    <p className="text-[9px] font-black text-secondary uppercase tracking-[0.2em] mb-1 opacity-50">Disponíveis</p>
                    <p className="text-xl font-black text-white tabular-nums tracking-tighter">{availablePlayers.length}</p>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary opacity-40 group-focus-within:opacity-100 transition-all duration-300">
                    <Search className="group-focus-within:scale-110 transition-transform" size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="Filtrar por nome, posição ou clube..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full rounded-[2rem] border border-white/5 bg-black/50 py-6 pl-16 pr-8 text-[15px] font-bold text-white outline-none transition-all focus:border-primary/40 focus:ring-[12px] focus:ring-primary/5 placeholder:text-white/10"
                  />
                </div>

                <div className="mt-8 flex gap-4 overflow-x-auto no-scrollbar">
                  {[
                    { label: 'Só Agentes Livres', active: onlyFreeAgents, toggle: () => setOnlyFreeAgents(!onlyFreeAgents), color: 'emerald' },
                    { label: 'Cabe no Caixa', active: onlyAffordable, toggle: () => setOnlyAffordable(!onlyAffordable), color: 'blue' }
                  ].map((filter) => (
                    <button
                      key={filter.label}
                      onClick={() => { hapticSelection(); filter.toggle(); }}
                      className={clsx(
                        'rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border whitespace-nowrap flex items-center gap-3',
                        filter.active 
                          ? filter.color === 'emerald' ? 'bg-emerald-500 text-white border-emerald-400 shadow-xl shadow-emerald-500/20' : 'bg-blue-500 text-white border-blue-400 shadow-xl shadow-blue-500/20' 
                          : 'bg-white/5 text-secondary border-white/5 hover:bg-white/10'
                      )}
                    >
                      <div className={clsx("w-1.5 h-1.5 rounded-full", filter.active ? "bg-white" : "bg-white/20")} />
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {availablePlayers.length === 0 && renderEmptyState(
                  'Nenhum alvo encontrado',
                  'Ajuste os filtros ou o termo de busca para encontrar atletas para o seu clube.'
                )}

                {availablePlayers.slice(0, 50).map(({ p, t }) => {
                  const isFreeAgent = t.id === 'free_agent';
                  const canAfford = p.marketValue <= funds;
                  const trendTone = p.valueTrend === 'up' ? 'text-amber-400' : p.valueTrend === 'down' ? 'text-emerald-400' : 'text-blue-400';

                  return (
                    <div key={p.id} className="ui-card-premium p-5 group hover:bg-white/[0.12] transition-all cursor-pointer">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={clsx(
                            "flex h-14 w-14 items-center justify-center rounded-[1.25rem] border-2 font-black text-xs shadow-inner",
                            p.position === 'GOL' ? 'border-yellow-500/20 text-yellow-500 bg-yellow-500/5' :
                            ['ZAG', 'LAT'].includes(p.position) ? 'border-blue-500/20 text-blue-500 bg-blue-500/5' :
                            ['VOL', 'MEI'].includes(p.position) ? 'border-green-500/20 text-green-500 bg-green-500/5' :
                            'border-red-500/20 text-red-500 bg-red-500/5'
                          )}>
                            {p.position}
                          </div>
                          <div>
                            <h4 className="text-lg font-black tracking-tight text-white mb-1">{p.name}</h4>
                            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-secondary">
                              OVR {p.overall} • {p.age} anos • {isFreeAgent ? 'Sem clube' : t.shortName}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="ui-label-caps mb-1">Valor</p>
                          <p className="text-lg font-black text-emerald-400 tracking-tight">{formatMoney(p.marketValue)}</p>
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-3">
                        <div className="rounded-2xl border border-white/5 bg-black/30 p-3 text-center">
                          <p className="text-[9px] font-black uppercase text-secondary tracking-widest mb-1">Potencial</p>
                          <p className="text-xs font-black text-white">{p.potential}</p>
                        </div>
                        <div className="rounded-2xl border border-white/5 bg-black/30 p-3 text-center">
                          <p className="text-[9px] font-black uppercase text-secondary tracking-widest mb-1">Tendência</p>
                          <p className={clsx('text-[9px] font-black uppercase', trendTone)}>
                            {p.valueTrend === 'up' ? 'Alta' : p.valueTrend === 'down' ? 'Queda' : 'Estável'}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/5 bg-black/30 p-3 text-center">
                          <p className="text-[9px] font-black uppercase text-secondary tracking-widest mb-1">Energia</p>
                          <p className="text-xs font-black text-white">{p.energy}%</p>
                        </div>
                      </div>

                      <div className="mt-5 flex gap-3">
                        <button
                          onClick={() => handleStartNegotiation(p, t)}
                          disabled={!isWindowOpen}
                          className="flex-1 rounded-[1.25rem] bg-primary py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-20"
                        >
                          {isFreeAgent ? 'Contratar agora' : 'Negociar'}
                        </button>
                        <div className={clsx(
                          "rounded-[1.25rem] border px-4 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center min-w-[100px]",
                          canAfford ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' : 'border-white/5 text-secondary bg-white/5'
                        )}>
                          {canAfford ? 'Viável' : 'Caro'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'OFFERS' && (
            <div className="space-y-6">
              <div className="ui-card-premium p-6">
                <p className="ui-label-caps mb-2">Entradas pendentes</p>
                <h3 className="text-xl font-black tracking-tight text-white mb-2">Propostas recebidas</h3>
                <p className="text-[13px] leading-relaxed text-white/50">Clubes interessados em atletas do seu elenco profissional.</p>
              </div>

              {offers.length === 0 && renderEmptyState(
                'Sem ofertas no momento',
                'Coloque jogadores à venda ou aguarde o interesse natural de outros clubes durante a janela.'
              )}

              <div className="space-y-4">
                {offers.map((offer) => (
                  <div key={offer.id} className="ui-card-premium p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                          <Tags size={20} />
                        </div>
                        <div>
                          <p className="ui-label-caps mb-1 opacity-60">Interesse em</p>
                          <h4 className="text-lg font-black text-white">{offer.playerName}</h4>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="ui-label-caps mb-1">Oferta</p>
                        <p className="text-xl font-black text-emerald-400 tracking-tight">{formatMoney(offer.value)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="rounded-2xl border border-white/5 bg-black/30 p-4">
                        <p className="ui-label-caps mb-1 opacity-40">Proponente</p>
                        <p className="text-sm font-black text-white leading-none">{offer.offeringTeamName}</p>
                      </div>
                      <div className="rounded-2xl border border-white/5 bg-black/30 p-4">
                        <p className="ui-label-caps mb-1 opacity-40">Expira em</p>
                        <p className="text-sm font-black text-white leading-none">2 rodadas</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => onAcceptOffer(offer)}
                        className="flex-1 rounded-2xl bg-emerald-500 py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all"
                      >
                        Aceitar
                      </button>
                      <button
                        onClick={() => onDeclineOffer(offer.id)}
                        className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-4 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/10 active:scale-[0.98] transition-all"
                      >
                        Recusar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'HISTORY' && (
            <div className="space-y-6">
              <div className="ui-card-premium p-6">
                <p className="ui-label-caps mb-2">Monitor de mercado</p>
                <h3 className="text-xl font-black tracking-tight text-white">Últimas transações</h3>
              </div>

              {logs.length === 0 && renderEmptyState(
                'Mercado estagnado',
                'Nenhuma movimentação relevante registrada nas últimas rodadas.'
              )}

              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="ui-card-premium p-4 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={clsx(
                          "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border",
                          log.type === 'buy' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' :
                          log.type === 'sell' ? 'border-amber-500/20 text-amber-400 bg-amber-500/5' :
                          'border-blue-500/20 text-blue-400 bg-blue-500/5'
                        )}>
                          {log.type === 'buy' ? 'Compra' : log.type === 'sell' ? 'Venda' : 'Empréstimo'}
                        </span>
                        <span className="text-[10px] font-black text-secondary uppercase tracking-widest opacity-40">RD {log.round}</span>
                      </div>
                      <h4 className="text-base font-black text-white">{log.playerName}</h4>
                      <p className="text-[11px] text-white/40 leading-relaxed mt-1">
                         {log.fromTeamName} → {log.toTeamName}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                       <p className="text-base font-black text-emerald-400">{formatMoney(log.value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'LISTED' && (
            <div className="space-y-6">
              <div className="ui-card-premium p-6">
                <p className="ui-label-caps mb-2">Planejamento de Saídas</p>
                <h3 className="text-xl font-black tracking-tight text-white">Gestão de Vendas</h3>
              </div>

              <div className="space-y-4">
                {userTeam.roster.map((player) => (
                  <div key={player.id} className="ui-card-premium p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={clsx(
                           "flex h-14 w-14 items-center justify-center rounded-[1.25rem] border font-black text-xs",
                           player.position === 'GOL' ? 'border-yellow-500/20 text-yellow-500 bg-yellow-500/5' :
                           ['ZAG', 'LAT'].includes(player.position) ? 'border-blue-500/20 text-blue-500 bg-blue-500/5' :
                           ['VOL', 'MEI'].includes(player.position) ? 'border-green-500/20 text-green-500 bg-green-500/5' :
                           'border-red-500/20 text-red-500 bg-red-500/5'
                        )}>
                          {player.position}
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-white mb-1">{player.name}</h4>
                          <div className="flex items-center gap-2">
                             <p className="text-[11px] font-black uppercase text-secondary">OVR {player.overall} • {player.age} anos</p>
                             {player.isForSale && <span className="bg-amber-500 text-black text-[8px] font-black uppercase px-1.5 rounded">À Venda</span>}
                             {player.isListedForLoan && <span className="bg-blue-500 text-white text-[8px] font-black uppercase px-1.5 rounded">Empréstimo</span>}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="ui-label-caps mb-0.5">Mercado</p>
                         <p className="text-sm font-black text-white">{formatMoney(player.marketValue)}</p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleListForSale(player)}
                        disabled={!isWindowOpen}
                        className={clsx(
                          "rounded-2xl py-3.5 text-[10px] font-black uppercase tracking-widest transition-all border",
                          player.isForSale ? "bg-amber-500 text-black border-amber-400" : "bg-white/5 text-secondary border-white/5"
                        )}
                      >
                        {player.isForSale ? 'Remover Vitrine' : 'Colocar à Venda'}
                      </button>
                      <button
                        onClick={() => handleListForLoan(player)}
                        disabled={!isWindowOpen}
                        className={clsx(
                          "rounded-2xl py-3.5 text-[10px] font-black uppercase tracking-widest transition-all border",
                          player.isListedForLoan ? "bg-blue-500 text-white border-blue-400" : "bg-white/5 text-secondary border-white/5"
                        )}
                      >
                        {player.isListedForLoan ? 'Remover Empr.' : 'Oferecer Empr.'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Negotiation Modal */}
      <AnimatePresence>
        {negotiatingPlayer && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center bg-black/95 p-0 sm:p-6 backdrop-blur-3xl">
            <motion.div 
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-lg rounded-t-[3.5rem] sm:rounded-[3.5rem] border border-white/10 bg-[#020617] p-10 shadow-[0_-40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden"
            >
              {/* Background ambient light */}
              <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 flex items-center justify-between mb-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <p className="ui-label-caps text-emerald-400">Canal de Negociação</p>
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter text-white uppercase italic leading-none">Efetuar Proposta</h3>
                </div>
                <button
                  onClick={() => { hapticSelection(); setNegotiatingPlayer(null); }}
                  className="w-14 h-14 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all active:scale-90"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="relative z-10 flex items-center gap-6 p-6 rounded-[2.5rem] bg-black/60 border border-white/5 mb-10 group/player">
                <div className="relative">
                  <div className={clsx(
                    "flex h-20 w-20 items-center justify-center rounded-[1.75rem] border-2 font-black text-xl shadow-2xl transition-transform group-hover/player:scale-105",
                    negotiatingPlayer.p.position === 'GOL' ? 'border-yellow-500/20 text-yellow-500 bg-yellow-500/5' :
                    ['ZAG', 'LAT'].includes(negotiatingPlayer.p.position) ? 'border-blue-500/20 text-blue-500 bg-blue-500/5' :
                    ['VOL', 'MEI'].includes(negotiatingPlayer.p.position) ? 'border-green-500/20 text-green-500 bg-green-500/5' :
                    'border-red-500/20 text-red-500 bg-red-500/5'
                  )}>
                    {negotiatingPlayer.p.position}
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-white text-black text-[10px] font-black rounded-full border-4 border-[#020617] flex items-center justify-center shadow-lg">
                    {negotiatingPlayer.p.overall}
                  </div>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white italic tracking-tighter">{negotiatingPlayer.p.name}</h4>
                  <p className="ui-label-caps text-secondary opacity-50 mt-1.5 flex items-center gap-2">
                    {negotiatingPlayer.t.shortName} • {negotiatingPlayer.p.age} Anos
                  </p>
                </div>
              </div>

              <div className="relative z-10 ui-card-premium p-8 bg-black/40 mb-10 border-white/5">
                <div className="flex items-center justify-between mb-8">
                  <span className="ui-label-caps text-secondary opacity-60">Valor Ofertado</span>
                  <motion.span 
                    key={bidValue}
                    initial={{ scale: 1.1, textShadow: '0 0 20px rgba(16,185,129,0.5)' }}
                    animate={{ scale: 1, textShadow: '0 0 0px rgba(16,185,129,0)' }}
                    className="text-4xl font-black text-emerald-400 tracking-tighter tabular-nums"
                  >
                    {formatMoney(bidValue)}
                  </motion.span>
                </div>
                
                <div className="relative h-12 flex items-center mb-8">
                  <input
                    type="range"
                    min={negotiatingPlayer.p.marketValue * 0.5}
                    max={negotiatingPlayer.p.marketValue * 2.5}
                    step={25000}
                    value={bidValue}
                    onChange={(e) => { 
                      const val = parseInt(e.target.value);
                      if (val !== bidValue) hapticSelection();
                      setBidValue(val); 
                    }}
                    className="w-full h-1.5 rounded-full bg-white/10 appearance-none accent-emerald-500 cursor-pointer z-10"
                  />
                  {/* Market Value Marker */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white/30 rounded-full blur-[1px]"
                    style={{ left: `${((negotiatingPlayer.p.marketValue - (negotiatingPlayer.p.marketValue * 0.5)) / (negotiatingPlayer.p.marketValue * 2)) * 100}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[9px] font-black uppercase text-white/20 tracking-[0.3em]">
                  <span className={clsx("transition-colors", bidValue < negotiatingPlayer.p.marketValue && "text-rose-500/50")}>Abaixo</span>
                  <div className="flex items-center gap-2">
                     <div className="w-1 h-1 rounded-full bg-white/20" />
                     <span>Mercado: {formatMoney(negotiatingPlayer.p.marketValue)}</span>
                     <div className="w-1 h-1 rounded-full bg-white/20" />
                  </div>
                  <span className={clsx("transition-colors", bidValue > negotiatingPlayer.p.marketValue && "text-emerald-500/50")}>Acima</span>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-5 mb-10">
                 <div className="rounded-3xl bg-white/5 border border-white/5 p-6 group/funds">
                    <div className="flex items-center gap-3 mb-3 text-secondary opacity-40 group-hover/funds:text-emerald-400 group-hover/funds:opacity-100 transition-all">
                       <DollarSign size={16} />
                       <span className="ui-label-caps text-[9px]">Saldo do Clube</span>
                    </div>
                    <p className="text-xl font-black text-white tracking-tighter tabular-nums">{formatMoney(funds)}</p>
                 </div>
                 <div className="rounded-3xl bg-white/5 border border-white/5 p-6 group/trend">
                    <div className="flex items-center gap-3 mb-3 text-secondary opacity-40 group-hover/trend:text-primary group-hover/trend:opacity-100 transition-all">
                       <TrendingUp size={16} />
                       <span className="ui-label-caps text-[9px]">Análise Técnica</span>
                    </div>
                    <p className={clsx(
                      "text-xl font-black tracking-tighter uppercase italic",
                      negotiatingPlayer.p.valueTrend === 'up' ? 'text-primary' : 'text-white'
                    )}>
                      {negotiatingPlayer.p.valueTrend === 'up' ? 'Elite' : 'Estável'}
                    </p>
                 </div>
              </div>

              <button
                onClick={() => { impactHeavy(); handleConfirmBid(); }}
                className={clsx(
                  "relative z-10 w-full h-20 rounded-3xl flex items-center justify-center text-sm font-black uppercase tracking-[0.3em] transition-all active:scale-95 overflow-hidden group/btn",
                  bidValue > funds ? "bg-white/5 text-secondary border border-white/5 cursor-not-allowed" : "bg-emerald-500 text-white shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:shadow-[0_25px_60px_rgba(16,185,129,0.4)]"
                )}
                disabled={bidValue > funds}
              >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                {bidValue > funds ? 'Saldo Insuficiente' : 'Formalizar Proposta'}
              </button>
              
              <p className="relative z-10 text-center text-[9px] text-white/20 font-bold uppercase tracking-[0.3em] mt-8">
                 A resposta será entregue na próxima rodada
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
