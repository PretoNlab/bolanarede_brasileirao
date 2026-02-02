
import React, { useState, useMemo } from 'react';
import { Team, Player, TransferOffer, TransferLog } from '../types';
import { ArrowLeft, DollarSign, Search, Tags, History, Briefcase, TrendingUp, Check, X } from 'lucide-react';
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

export default function MarketScreen({
  userTeam, allTeams, funds, isWindowOpen, offers, logs, onBack,
  onBuy, onLoanPlayer, onSell, onAcceptOffer, onDeclineOffer
}: Props) {
  const [activeTab, setActiveTab] = useState<'EXPLORE' | 'OFFERS' | 'HISTORY' | 'LISTED'>('EXPLORE');
  const [searchTerm, setSearchTerm] = useState('');
  const [negotiatingPlayer, setNegotiatingPlayer] = useState<{ p: Player, t: Team } | null>(null);
  const [bidValue, setBidValue] = useState<number>(0);

  const formatMoney = (val: number) => `R$ ${(val / 1000).toFixed(0)}k`;

  const [onlyFreeAgents, setOnlyFreeAgents] = useState(false);

  const TeamLogo = ({ team, size = "w-8 h-8" }: { team: Team, size?: string }) => {
    return (
      <div className={`${size} rounded-lg bg-gradient-to-br ${team.logoColor1} ${team.logoColor2} flex items-center justify-center`}>
        <span className="text-[8px] font-black text-white">{team.shortName.substring(0, 2)}</span>
      </div>
    );
  };

  const availablePlayers = useMemo(() => {
    const list: { p: Player, t: Team }[] = [];
    allTeams.forEach(t => {
      if (t.id !== userTeam.id) {
        if (onlyFreeAgents && t.id !== 'free_agent') return;

        t.roster.forEach(p => {
          const matchName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
          const matchTeam = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.shortName.toLowerCase().includes(searchTerm.toLowerCase());

          if (matchName || matchTeam) {
            list.push({ p, t });
          }
        });
      }
    });
    return list.sort((a, b) => b.p.overall - a.p.overall);
  }, [allTeams, userTeam.id, searchTerm, onlyFreeAgents]);

  const handleStartNegotiation = (p: Player, t: Team) => {
    setNegotiatingPlayer({ p, t });
    setBidValue(p.marketValue);
  };

  const handleConfirmBid = () => {
    if (!negotiatingPlayer) return;
    if (bidValue > funds) return toast.error("Saldo insuficiente!");

    const p = negotiatingPlayer.p;
    // Lógica da IA para aceitar proposta
    // Se a proposta for >= 120% do valor de mercado, aceita sempre.
    // Entre 90% e 120% tem chance.
    // Abaixo de 90% recusa.
    const ratio = bidValue / p.marketValue;

    if (ratio >= 1.2 || (ratio >= 0.9 && Math.random() > 0.4)) {
      onBuy(p, negotiatingPlayer.t.id, bidValue);
      setNegotiatingPlayer(null);
    } else {
      const isFreeAgent = negotiatingPlayer.t.id === 'free_agent';
      const entity = isFreeAgent ? `O agente de ${p.name}` : `O ${negotiatingPlayer.t.shortName}`;
      toast.error(`${entity} recusou sua proposta. ${isFreeAgent ? 'Ele quer' : 'Eles querem'} valorização.`);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-white relative font-sans">
      <header className="fixed top-0 left-0 w-full z-40 bg-background/90 backdrop-blur-xl border-b border-white/5 pt-safe">
        <div className="p-6 flex items-center justify-between">
          <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center active:scale-95 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-1">Mercado Global</h1>
            <span className="text-xl font-black text-emerald-400 tabular-nums tracking-tighter">{formatMoney(funds)}</span>
          </div>
          <div className="w-12"></div>
        </div>

        <div className="px-6 pb-6 flex gap-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'EXPLORE', label: 'Explorar', icon: <Search size={16} /> },
            { id: 'OFFERS', label: 'Propostas', icon: <Tags size={16} />, badge: offers.length },
            { id: 'HISTORY', label: 'Histórico', icon: <History size={16} /> },
            { id: 'LISTED', label: 'Meu Time', icon: <Briefcase size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                "flex items-center gap-3 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
                activeTab === tab.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white/5 text-secondary border border-white/5"
              )}
            >
              {tab.icon} {tab.label}
              {tab.badge ? <span className="bg-rose-500 text-white px-2 py-0.5 rounded-full text-[9px] ml-1">{tab.badge}</span> : null}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pt-[180px] pb-28 space-y-6 no-scrollbar">
        {activeTab === 'EXPLORE' && (
          <div className="space-y-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                <input
                  type="text" placeholder="Buscar jogador ou time..."
                  className="w-full bg-white/5 border border-white/5 pl-12 pr-4 py-4 rounded-[20px] text-sm outline-none focus:ring-2 ring-primary/50 transition-all font-medium"
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => setOnlyFreeAgents(!onlyFreeAgents)}
                className={clsx("px-6 rounded-[20px] border font-black text-[10px] uppercase tracking-widest transition-all", onlyFreeAgents ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-white/5 border-white/5 text-secondary")}
              >
                Livres
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase text-secondary/60 tracking-[0.2em] px-2 flex items-center justify-between">
                <span>Jogadores Disponíveis</span>
                <span className="bg-white/5 px-2 py-1 rounded text-white/30">{availablePlayers.length} Resultados</span>
              </h3>
              <div className="space-y-3">
                {availablePlayers.slice(0, 100).map(({ p, t }) => (
                  <div key={p.id} className="bg-surface/60 backdrop-blur-sm p-4 rounded-[24px] border border-white/5 flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center font-black text-xs text-primary shadow-inner border border-white/5">{p.position}</div>
                      <TeamLogo team={t} size="w-10 h-10" />
                      <div>
                        <p className="text-base font-black tracking-tight">{p.name}</p>
                        <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">OVR {p.overall} • {t.shortName}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleStartNegotiation(p, t)}
                      disabled={!isWindowOpen}
                      className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-20"
                    >
                      NEGOCIAR
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Propostas Recebidas */}
        {activeTab === 'OFFERS' && (
          <div className="space-y-4">
            {offers.map(offer => (
              <div key={offer.id} className="bg-surface p-6 rounded-3xl border border-primary/20 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-primary uppercase">Interesse do {offer.offeringTeamName}</span>
                </div>
                <h3 className="text-xl font-black">{offer.playerName}</h3>
                <div className="flex items-center justify-between bg-background p-4 rounded-2xl">
                  <span className="text-xs text-secondary font-bold">Oferta</span>
                  <span className="text-lg font-black text-emerald-400">{formatMoney(offer.value)}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => onAcceptOffer(offer)} className="bg-emerald-500 py-4 rounded-2xl font-black text-xs">ACEITAR</button>
                  <button onClick={() => onDeclineOffer(offer.id)} className="bg-white/5 py-4 rounded-2xl font-black text-xs">RECUSAR</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Negociação Ativa */}
      {negotiatingPlayer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/90 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface border border-white/10 rounded-3xl p-6 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black uppercase">Fazer Proposta</h3>
              <button onClick={() => setNegotiatingPlayer(null)} className="p-2 bg-white/5 rounded-full"><X size={16} /></button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-black">{negotiatingPlayer.p.position}</div>
              <div>
                <p className="font-bold">{negotiatingPlayer.p.name}</p>
                <p className="text-xs text-secondary">{negotiatingPlayer.t.name} • OVR {negotiatingPlayer.p.overall}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black text-secondary uppercase">Valor da Oferta</span>
                <span className="text-lg font-black text-emerald-400">{formatMoney(bidValue)}</span>
              </div>
              <input
                type="range" min={negotiatingPlayer.p.marketValue * 0.5} max={negotiatingPlayer.p.marketValue * 2} step={10000}
                value={bidValue}
                onChange={(e) => setBidValue(parseInt(e.target.value))}
                className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[8px] font-black text-secondary uppercase px-1">
                <span>Mínimo</span>
                <span>Mercado: {formatMoney(negotiatingPlayer.p.marketValue)}</span>
                <span>Máximo</span>
              </div>
            </div>

            <button
              onClick={handleConfirmBid}
              className="w-full mt-8 bg-emerald-500 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              ENVIAR PROPOSTA
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
