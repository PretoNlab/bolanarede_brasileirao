import React, { useMemo, useState } from 'react';
import { TeamLogo } from '../components/TeamLogo';
import { Player, Team, TransferLog, TransferOffer } from '../types';
import {
  ArrowLeft,
  Briefcase,
  CalendarDays,
  DollarSign,
  History,
  Search,
  ShieldAlert,
  Tags,
  TrendingUp,
  X
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

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
    <div className="rounded-[2rem] border border-white/8 bg-surface/70 p-6 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
        <ShieldAlert size={20} className="text-secondary" />
      </div>
      <h3 className="text-lg font-black tracking-tight text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-[13px] leading-6 text-white/60">{copy}</p>
    </div>
  );

  return (
    <div className="relative flex h-screen flex-col bg-background font-sans text-white">
      <header className="fixed left-0 top-0 z-40 w-full border-b border-white/5 bg-background/92 pt-safe backdrop-blur-xl">
        <div className="px-6 pb-5 pt-6">
          <div className="mb-5 flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 transition-all active:scale-95"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Mercado</p>
              <p className="mt-1 text-xl font-black tracking-tight text-emerald-400">{formatMoney(funds)}</p>
            </div>

            <div
              className={clsx(
                'rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em]',
                isWindowOpen ? 'bg-emerald-500/15 text-emerald-300' : 'bg-blue-500/15 text-blue-300'
              )}
            >
              {isWindowOpen ? 'Janela aberta' : 'Janela fechada'}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/8 bg-surface/80 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Pulso da janela</p>
                <h1 className="mt-2 text-2xl font-black tracking-tight text-white">{marketPulse.title}</h1>
                <p className="mt-2 max-w-xl text-[13px] leading-6 text-white/65">{marketPulse.copy}</p>
              </div>
              <div
                className={clsx(
                  'rounded-2xl px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em]',
                  marketPulse.tone === 'green' && 'bg-emerald-500/15 text-emerald-300',
                  marketPulse.tone === 'amber' && 'bg-amber-500/15 text-amber-200',
                  marketPulse.tone === 'red' && 'bg-rose-500/15 text-rose-200',
                  marketPulse.tone === 'blue' && 'bg-blue-500/15 text-blue-300'
                )}
              >
                {offers.length > 0 ? 'Responder propostas' : isWindowOpen ? 'Momento de agir' : 'Planejamento'}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/6 bg-background/60 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-secondary">Agentes livres</p>
                <p className="mt-2 text-lg font-black tracking-tight text-white">{freeAgentsCount}</p>
              </div>
              <div className="rounded-2xl border border-white/6 bg-background/60 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-secondary">Alvos viáveis</p>
                <p className="mt-2 text-lg font-black tracking-tight text-white">{affordableTargets.length}</p>
              </div>
              <div className="rounded-2xl border border-white/6 bg-background/60 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-secondary">Média do elenco</p>
                <p className="mt-2 text-lg font-black tracking-tight text-white">{squadAverage}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex gap-3 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'EXPLORE', label: 'Explorar', icon: <Search size={16} /> },
              { id: 'OFFERS', label: 'Propostas', icon: <Tags size={16} />, badge: offers.length },
              { id: 'HISTORY', label: 'Histórico', icon: <History size={16} />, badge: logs.length },
              { id: 'LISTED', label: 'Meu elenco', icon: <Briefcase size={16} />, badge: listedPlayers.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as MarketTab)}
                className={clsx(
                  'flex shrink-0 items-center gap-3 rounded-2xl px-5 py-3 text-[11px] font-black uppercase tracking-[0.16em] transition-all',
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'border border-white/6 bg-white/5 text-secondary'
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge ? (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] text-white">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-6 overflow-y-auto px-6 pb-28 pt-[290px] no-scrollbar">
        {activeTab === 'EXPLORE' && (
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/8 bg-surface/70 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Busca dirigida</p>
                  <h2 className="mt-2 text-xl font-black tracking-tight text-white">Encontre reforços pelo contexto certo</h2>
                  <p className="mt-2 text-[13px] leading-6 text-white/60">
                    Procure por nome, posição ou clube. Se o caixa estiver apertado, reduza o escopo para alvos viáveis.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-background/50 px-3 py-2 text-right">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-secondary">Resultados</p>
                  <p className="mt-1 text-lg font-black tracking-tight text-white">{availablePlayers.length}</p>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                  <input
                    type="text"
                    placeholder="Buscar jogador, posição ou clube..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full rounded-[20px] border border-white/5 bg-background/60 py-4 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-primary/30 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setOnlyFreeAgents((value) => !value)}
                  className={clsx(
                    'rounded-full px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.16em] transition-all',
                    onlyFreeAgents ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'border border-white/8 bg-white/5 text-secondary'
                  )}
                >
                  Só agentes livres
                </button>
                <button
                  onClick={() => setOnlyAffordable((value) => !value)}
                  className={clsx(
                    'rounded-full px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.16em] transition-all',
                    onlyAffordable ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'border border-white/8 bg-white/5 text-secondary'
                  )}
                >
                  Cabe no caixa
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {availablePlayers.length === 0 && renderEmptyState(
                'Nenhum alvo encontrado',
                'Tente limpar os filtros ou buscar por outro nome. Se a janela estiver fechada, use esta etapa só para mapeamento.'
              )}

              {availablePlayers.slice(0, 80).map(({ p, t }) => {
                const isFreeAgent = t.id === 'free_agent';
                const canAfford = p.marketValue <= funds;
                const trendTone =
                  p.valueTrend === 'up' ? 'text-amber-300' : p.valueTrend === 'down' ? 'text-emerald-300' : 'text-blue-300';

                return (
                  <div
                    key={p.id}
                    className="rounded-[2rem] border border-white/8 bg-surface/70 p-5 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/6 bg-background/70 text-xs font-black text-primary">
                          {p.position}
                        </div>
                        {!isFreeAgent && <TeamLogo team={t} size="md" />}
                        <div>
                          <h3 className="text-lg font-black tracking-tight text-white">{p.name}</h3>
                          <p className="mt-1 text-[11px] font-black uppercase tracking-[0.16em] text-secondary">
                            OVR {p.overall} • {p.age} anos • {isFreeAgent ? 'Agente livre' : t.shortName}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-secondary">Valor</p>
                        <p className="mt-1 text-base font-black tracking-tight text-emerald-400">{formatMoney(p.marketValue)}</p>
                        <p className={clsx('mt-1 text-[10px] font-black uppercase tracking-[0.14em]', trendTone)}>
                          {p.valueTrend === 'up' ? 'Valorizando' : p.valueTrend === 'down' ? 'Desvalorizando' : 'Estável'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div className="rounded-2xl border border-white/6 bg-background/55 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-secondary">Potencial</p>
                        <p className="mt-1 text-sm font-black text-white">{p.potential}</p>
                      </div>
                      <div className="rounded-2xl border border-white/6 bg-background/55 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-secondary">Contrato</p>
                        <p className="mt-1 text-sm font-black text-white">{p.contractRounds} rod.</p>
                      </div>
                      <div className="rounded-2xl border border-white/6 bg-background/55 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-secondary">Situação</p>
                        <p className="mt-1 text-sm font-black text-white">{canAfford ? 'Viável' : 'Acima do caixa'}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => handleStartNegotiation(p, t)}
                        disabled={!isWindowOpen}
                        className="flex-1 rounded-2xl bg-primary px-4 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-white shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-35"
                      >
                        {isFreeAgent ? 'Tentar contratar' : 'Fazer proposta'}
                      </button>
                      <div
                        className={clsx(
                          'rounded-2xl border px-4 py-3 text-[11px] font-black uppercase tracking-[0.16em]',
                          canAfford ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : 'border-white/8 bg-white/5 text-secondary'
                        )}
                      >
                        {canAfford ? 'Cabe no caixa' : 'Exige venda'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'OFFERS' && (
          <div className="space-y-4">
            <div className="rounded-[2rem] border border-white/8 bg-surface/70 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Entradas pendentes</p>
              <h2 className="mt-2 text-xl font-black tracking-tight text-white">Decisões que mexem no caixa e no elenco</h2>
              <p className="mt-2 text-[13px] leading-6 text-white/60">
                Responda primeiro o que já está em cima da mesa. Depois disso, volte a explorar reforços.
              </p>
            </div>

            {offers.length === 0 && renderEmptyState(
              'Nenhuma proposta recebida',
              'Quando outros clubes se movimentarem pelo seu elenco, as ofertas aparecem aqui com valor e ação direta.'
            )}

            {offers.map((offer) => {
              const offeringTeam = allTeams.find((team) => team.id === offer.offeringTeamId);

              return (
                <div key={offer.id} className="rounded-[2rem] border border-primary/20 bg-surface/75 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {offeringTeam ? <TeamLogo team={offeringTeam} size="sm" /> : null}
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">Interesse formal</p>
                        <h3 className="mt-1 text-lg font-black tracking-tight text-white">{offer.playerName}</h3>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-background/60 px-3 py-2 text-right">
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-secondary">Oferta</p>
                      <p className="mt-1 text-base font-black text-emerald-400">{formatMoney(offer.value)}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/6 bg-background/50 p-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-secondary">Clube interessado</p>
                      <p className="mt-1 text-sm font-black text-white">{offer.offeringTeamName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-secondary">Rodada</p>
                      <p className="mt-1 text-sm font-black text-white">{offer.round}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => onAcceptOffer(offer)}
                      className="rounded-2xl bg-emerald-500 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-white transition-all active:scale-[0.98]"
                    >
                      Aceitar
                    </button>
                    <button
                      onClick={() => onDeclineOffer(offer.id)}
                      className="rounded-2xl border border-white/8 bg-white/5 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-white transition-all active:scale-[0.98]"
                    >
                      Recusar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'HISTORY' && (
          <div className="space-y-4">
            <div className="rounded-[2rem] border border-white/8 bg-surface/70 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Leitura de mercado</p>
              <h2 className="mt-2 text-xl font-black tracking-tight text-white">Movimentações recentes</h2>
              <p className="mt-2 text-[13px] leading-6 text-white/60">
                Use o histórico para entender o nível de agressividade da janela e calibrar o preço dos seus alvos.
              </p>
            </div>

            {logs.length === 0 && renderEmptyState(
              'Sem movimentações registradas',
              'Quando compras, vendas ou empréstimos acontecerem, este histórico ajuda a ler o ritmo da janela.'
            )}

            {logs.map((log) => (
              <div key={log.id} className="rounded-[2rem] border border-white/8 bg-surface/70 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-secondary">Rodada {log.round}</p>
                    <h3 className="mt-1 text-lg font-black tracking-tight text-white">{log.playerName}</h3>
                    <p className="mt-2 text-[13px] leading-6 text-white/60">
                      {log.fromTeamName} {log.type === 'loan' ? 'emprestou' : 'negociou'} com {log.toTeamName}.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-background/60 px-3 py-2 text-right">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-secondary">Valor</p>
                    <p className="mt-1 text-base font-black text-emerald-400">{formatMoney(log.value)}</p>
                  </div>
                </div>

                <div className="mt-4 inline-flex rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white/70">
                  {log.type === 'buy' ? 'Compra concluída' : log.type === 'sell' ? 'Venda concluída' : 'Empréstimo'}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'LISTED' && (
          <div className="space-y-4">
            <div className="rounded-[2rem] border border-white/8 bg-surface/70 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Saídas do elenco</p>
              <h2 className="mt-2 text-xl font-black tracking-tight text-white">Vitrine e empréstimos</h2>
              <p className="mt-2 text-[13px] leading-6 text-white/60">
                Coloque jogadores no mercado quando precisar abrir caixa, reduzir folha ou destravar espaço para reforços.
              </p>
            </div>

            {userTeam.roster.map((player) => (
              <div key={player.id} className="rounded-[2rem] border border-white/8 bg-surface/70 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/6 bg-background/70 text-xs font-black text-primary">
                      {player.position}
                    </div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight text-white">{player.name}</h3>
                      <p className="mt-1 text-[11px] font-black uppercase tracking-[0.16em] text-secondary">
                        OVR {player.overall} • {player.age} anos • {formatMoney(player.marketValue)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {player.isForSale ? (
                      <span className="rounded-full bg-amber-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-200">
                        À venda
                      </span>
                    ) : null}
                    {player.isListedForLoan ? (
                      <span className="rounded-full bg-blue-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-blue-200">
                        Para empréstimo
                      </span>
                    ) : null}
                    {!player.isForSale && !player.isListedForLoan ? (
                      <span className="rounded-full bg-white/8 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/55">
                        Não listado
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-white/6 bg-background/55 p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-secondary">Energia</p>
                    <p className="mt-1 text-sm font-black text-white">{player.energy}</p>
                  </div>
                  <div className="rounded-2xl border border-white/6 bg-background/55 p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-secondary">Potencial</p>
                    <p className="mt-1 text-sm font-black text-white">{player.potential}</p>
                  </div>
                  <div className="rounded-2xl border border-white/6 bg-background/55 p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-secondary">Contrato</p>
                    <p className="mt-1 text-sm font-black text-white">{player.contractRounds} rod.</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleListForSale(player)}
                    disabled={!isWindowOpen}
                    className="rounded-2xl border border-amber-500/20 bg-amber-500/10 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-amber-200 transition-all active:scale-[0.98] disabled:opacity-35"
                  >
                    Colocar à venda
                  </button>
                  <button
                    onClick={() => handleListForLoan(player)}
                    disabled={!isWindowOpen}
                    className="rounded-2xl border border-blue-500/20 bg-blue-500/10 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-blue-200 transition-all active:scale-[0.98] disabled:opacity-35"
                  >
                    Oferecer empréstimo
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {negotiatingPlayer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/92 p-6 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[2rem] border border-white/10 bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Negociação ativa</p>
                <h3 className="mt-2 text-lg font-black tracking-tight text-white">Defina sua proposta</h3>
              </div>
              <button
                onClick={() => setNegotiatingPlayer(null)}
                className="rounded-full bg-white/5 p-2"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-white/8 bg-background/50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/6 bg-primary/10 font-black text-primary">
                {negotiatingPlayer.p.position}
              </div>
              <div>
                <p className="font-black text-white">{negotiatingPlayer.p.name}</p>
                <p className="mt-1 text-[11px] font-black uppercase tracking-[0.14em] text-secondary">
                  {negotiatingPlayer.t.name} • OVR {negotiatingPlayer.p.overall}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/8 bg-background/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-secondary">Oferta atual</span>
                <span className="text-lg font-black text-emerald-400">{formatMoney(bidValue)}</span>
              </div>
              <input
                type="range"
                min={negotiatingPlayer.p.marketValue * 0.5}
                max={negotiatingPlayer.p.marketValue * 2}
                step={10000}
                value={bidValue}
                onChange={(event) => setBidValue(parseInt(event.target.value))}
                className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-lg bg-background accent-emerald-500"
              />
              <div className="mt-3 flex justify-between text-[10px] font-black uppercase tracking-[0.14em] text-white/45">
                <span>50%</span>
                <span>Mercado {formatMoney(negotiatingPlayer.p.marketValue)}</span>
                <span>200%</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/8 bg-background/50 p-3">
                <div className="flex items-center gap-2 text-secondary">
                  <DollarSign size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.14em]">Caixa</span>
                </div>
                <p className="mt-2 text-sm font-black text-white">{formatMoney(funds)}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-background/50 p-3">
                <div className="flex items-center gap-2 text-secondary">
                  <CalendarDays size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.14em]">Contrato</span>
                </div>
                <p className="mt-2 text-sm font-black text-white">{negotiatingPlayer.p.contractRounds} rod.</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-background/50 p-3">
                <div className="flex items-center gap-2 text-secondary">
                  <TrendingUp size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.14em]">Tendência</span>
                </div>
                <p className="mt-2 text-sm font-black text-white">
                  {negotiatingPlayer.p.valueTrend === 'up' ? 'Alta' : negotiatingPlayer.p.valueTrend === 'down' ? 'Queda' : 'Estável'}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/8 bg-white/5 p-4 text-[12px] leading-6 text-white/65">
              Abaixo de 90% o clube tende a recusar. Entre 90% e 120% a negociação fica viva. Acima disso, você compra velocidade.
            </div>

            <button
              onClick={handleConfirmBid}
              className="mt-6 w-full rounded-2xl bg-emerald-500 py-4 text-[11px] font-black uppercase tracking-[0.16em] text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
            >
              Enviar proposta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
