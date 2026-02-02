
import React, { useState, useMemo, useEffect } from 'react';
import { Team, NewsItem, TransferOffer } from '../types';
import { Play, Users, ArrowLeftRight, Wallet, LayoutDashboard, Trophy, Settings, Newspaper, Target, Lock, Unlock, MessageSquare, Heart, BarChart3 } from 'lucide-react';
import clsx from 'clsx';

interface Props {
   team: Team;
   nextOpponent: Team;
   standings: Team[];
   round: number;
   funds: number;
   onboardingComplete: boolean;
   isWindowOpen: boolean;
   onCompleteOnboarding: () => void;
   onOpenSquad: () => void;
   onOpenMarket: () => void;
   onOpenFinance: () => void;
   onOpenCalendar: () => void;
   onOpenLeague: () => void;
   onOpenStats: () => void;
   onOpenNews: () => void;
   onOpenSettings: () => void;
   onSimulate: () => void;
   onOpenTactics: () => void;
   onOpenProfile: () => void;
   news?: NewsItem[];
   offers?: TransferOffer[];
}

const TeamLogo = ({ team, size = "w-12 h-12" }: { team: Team, size?: string }) => {
   return (
      <div className={`${size} rounded-full bg-gradient-to-br ${team.logoColor1} ${team.logoColor2} flex items-center justify-center`}>
         <span className="font-black text-white">{team.shortName.substring(0, 3)}</span>
      </div>
   );
};

export default function DashboardScreen({
   team, nextOpponent, round, funds, isWindowOpen,
   onOpenSquad, onOpenMarket, onOpenFinance, onOpenCalendar,
   onOpenLeague, onOpenStats, onOpenNews, onOpenSettings, onSimulate, onOpenTactics, onOpenProfile,
   news = [], offers = []
}: Props) {

   const fanReactions = useMemo(() => {
      const reactions = [];
      if (team.moral > 80) reactions.push("O clima no estádio está incrível! #RumoAoTitulo");
      if (team.moral < 40) reactions.push("O time está sem alma em campo... Alguém faça algo!");
      if (funds < 0) reactions.push("Onde está o dinheiro da diretoria? #CriseFinanceira");
      if (team.won > 0) reactions.push("A última vitória deu esperança para a massa!");
      if (team.division === 2) reactions.push("Série B não é nosso lugar, vamos subir!");
      reactions.push("O próximo jogo contra o " + nextOpponent.shortName + " vai ser pedreira.");
      return reactions;
   }, [team, nextOpponent, funds]);

   const [currentReactionIdx, setCurrentReactionIdx] = useState(0);

   useEffect(() => {
      const timer = setInterval(() => {
         setCurrentReactionIdx(prev => (prev + 1) % fanReactions.length);
      }, 4000);
      return () => clearInterval(timer);
   }, [fanReactions]);

   const unreadNewsCount = useMemo(() => news.filter(n => !n.isRead || n.choices).length, [news]);

   return (
      <div className="flex flex-col h-screen bg-background text-white relative font-sans">
         <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-2xl border-b border-white/5 p-5 flex items-center justify-between pt-safe">
            <div className="flex items-center gap-4">
               <TeamLogo team={team} size="w-11 h-11" />
               <div className="flex flex-col">
                  <h1 className="text-sm font-black italic tracking-tighter leading-none mb-1 uppercase text-white/90">{team.name}</h1>
                  <span className={clsx("text-[9px] font-black uppercase flex items-center gap-1.5", isWindowOpen ? 'text-emerald-400' : 'text-rose-400')}>
                     {isWindowOpen ? <Unlock size={10} /> : <Lock size={10} />}
                     Janela {isWindowOpen ? 'Aberta' : 'Fechada'}
                  </span>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <button
                  onClick={onSimulate}
                  className="bg-primary px-5 py-2.5 rounded-2xl text-[11px] font-black flex items-center gap-2.5 shadow-xl shadow-primary/30 active:scale-95 transition-all uppercase tracking-widest border border-white/10"
               >
                  <Play size={14} fill="currentColor" /> JOGAR
               </button>
            </div>
         </header>

         <main className="flex-1 overflow-y-auto p-6 space-y-6 pb-28 no-scrollbar">
            {/* Fan Reaction Ticker */}
            <div className="bg-surface/40 border border-white/5 p-4 rounded-3xl flex items-center gap-4 overflow-hidden backdrop-blur-sm">
               <div className="bg-primary/20 p-2.5 rounded-xl text-primary shrink-0 shadow-inner">
                  <MessageSquare size={18} />
               </div>
               <p className="text-xs font-bold text-secondary italic animate-in fade-in slide-in-from-right duration-500 truncate mt-0.5" key={currentReactionIdx}>
                  "{fanReactions[currentReactionIdx]}"
               </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-surface/60 border border-white/5 rounded-3xl p-5 flex flex-col gap-1.5 shadow-inner">
                  <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Saldo Atual</p>
                  <p className={clsx("text-2xl font-black tabular-nums tracking-tighter", funds < 0 ? "text-rose-500" : "text-emerald-400")}>
                     R$ {(funds / 1000).toFixed(0)}k
                  </p>
               </div>
               <div className="bg-surface/60 border border-white/5 rounded-3xl p-5 flex flex-col gap-1.5 shadow-inner">
                  <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Confiança</p>
                  <div className="flex items-center gap-2.5">
                     <Heart size={18} className={clsx(team.moral > 70 ? "text-primary" : "text-rose-500")} fill="currentColor" />
                     <p className="text-2xl font-black">{team.moral}%</p>
                  </div>
               </div>
            </div>

            {/* Next Match Focus - Enhanced Hero Card */}
            <div className="bg-gradient-to-br from-surface to-[#111111] border border-white/10 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
               <div className="absolute -right-8 -top-8 w-40 h-40 bg-primary/10 blur-[60px] rounded-full group-hover:bg-primary/20 transition-all duration-1000"></div>
               <div className="flex justify-between items-center mb-8">
                  <span className="text-[10px] font-black text-secondary uppercase tracking-[0.3em]">PROXIMA RODADA ({round})</span>
                  <div className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[9px] font-black text-white/50 uppercase tracking-widest">
                     MANDO DE CAMPO
                  </div>
               </div>
               <div className="flex items-center justify-between px-2">
                  <div className="flex flex-col items-center gap-3">
                     <div className="p-1 bg-white/5 rounded-full shadow-2xl">
                        <TeamLogo team={team} size="w-20 h-20" />
                     </div>
                     <span className="text-[11px] font-black uppercase tracking-wider text-white/90">{team.shortName}</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                     <span className="text-4xl font-black italic text-white/5 tracking-tighter select-none">VS</span>
                     <div className="h-0.5 w-6 bg-white/10 rounded-full" />
                  </div>

                  <div className="flex flex-col items-center gap-3">
                     <div className="p-1 bg-white/5 rounded-full shadow-2xl opacity-80">
                        <TeamLogo team={nextOpponent} size="w-20 h-20" />
                     </div>
                     <span className="text-[11px] font-black uppercase tracking-wider text-white/60">{nextOpponent.shortName}</span>
                  </div>
               </div>
            </div>

            {/* Grid Options - Full Width Symmetry */}
            <div className="grid grid-cols-2 gap-4">
               <button onClick={onOpenTactics} className="bg-surface/50 border border-white/5 p-6 rounded-[32px] flex flex-col gap-4 group active:scale-95 transition-all hover:bg-surface/80">
                  <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                     <Target className="text-primary" size={24} />
                  </div>
                  <span className="text-sm font-black uppercase tracking-tight">Tática</span>
               </button>
               <button onClick={onOpenSquad} className="bg-surface/50 border border-white/5 p-6 rounded-[32px] flex flex-col gap-4 group active:scale-95 transition-all hover:bg-surface/80">
                  <div className="bg-blue-400/10 w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Users className="text-blue-400" size={24} />
                  </div>
                  <span className="text-sm font-black uppercase tracking-tight">Elenco</span>
               </button>
               <button onClick={onOpenMarket} className="bg-surface/50 border border-white/5 p-6 rounded-[32px] flex flex-col gap-4 group active:scale-95 transition-all relative hover:bg-surface/80">
                  <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center transition-all", isWindowOpen ? "bg-emerald-400/10" : "bg-rose-500/10")}>
                     <ArrowLeftRight className={isWindowOpen ? "text-emerald-400" : "text-rose-500"} size={24} />
                  </div>
                  <span className="text-sm font-black uppercase tracking-tight">Mercado</span>
                  {offers.length > 0 && <div className="absolute top-6 right-8 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse border-2 border-surface"></div>}
               </button>
               <button onClick={onOpenFinance} className="bg-surface/50 border border-white/5 p-6 rounded-[32px] flex flex-col gap-4 group active:scale-95 transition-all hover:bg-surface/80">
                  <div className="bg-amber-400/10 w-12 h-12 rounded-2xl flex items-center justify-center group-hover:translate-y-[-4px] transition-transform">
                     <Wallet className="text-amber-400" size={24} />
                  </div>
                  <span className="text-sm font-black uppercase tracking-tight">Finanças</span>
               </button>
            </div>
         </main>

         <nav className="fixed bottom-0 left-0 w-full bg-background/60 backdrop-blur-3xl border-t border-white/5 h-24 flex justify-around items-center px-4 pb-safe z-50">
            <button onClick={() => { }} className="flex-1 flex flex-col items-center gap-1.5 text-primary active:opacity-60 transition-all py-2">
               <LayoutDashboard size={20} />
               <span className="text-[8px] font-black uppercase tracking-widest">Home</span>
            </button>
            <button onClick={onOpenLeague} className="flex-1 flex flex-col items-center gap-1.5 text-secondary active:opacity-60 transition-all py-2">
               <Trophy size={20} />
               <span className="text-[8px] font-black uppercase tracking-widest">Liga</span>
            </button>
            <button onClick={onOpenStats} className="flex-1 flex flex-col items-center gap-1.5 text-secondary active:opacity-60 transition-all py-2">
               <BarChart3 size={20} />
               <span className="text-[8px] font-black uppercase tracking-widest">Stats</span>
            </button>
            <button onClick={onOpenNews} className="flex-1 flex flex-col items-center gap-1.5 text-secondary relative active:opacity-60 transition-all py-2">
               <Newspaper size={20} />
               <span className="text-[8px] font-black uppercase tracking-widest">Notícias</span>
               {unreadNewsCount > 0 && (
                  <div className="absolute top-1 right-[20%] flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[7px] font-black text-white border border-background shadow-lg">
                     {unreadNewsCount}
                  </div>
               )}
            </button>
            <button onClick={onOpenProfile} className="flex-1 flex flex-col items-center gap-1.5 text-secondary active:opacity-60 transition-all py-2">
               <Users size={20} />
               <span className="text-[8px] font-black uppercase tracking-widest">Perfil</span>
            </button>
            <button onClick={onOpenSettings} className="flex-1 flex flex-col items-center gap-1.5 text-secondary active:opacity-60 transition-all py-2">
               <Settings size={20} />
               <span className="text-[8px] font-black uppercase tracking-widest">Ajustes</span>
            </button>
         </nav>
      </div>
   );
}
