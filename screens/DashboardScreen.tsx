
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
      <div className="flex flex-col h-screen bg-background text-white relative">
         <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <TeamLogo team={team} size="w-10 h-10" />
               <div>
                  <h1 className="text-sm font-bold leading-none mb-1">{team.name}</h1>
                  <span className={`text-[9px] font-black uppercase flex items-center gap-1 ${isWindowOpen ? 'text-emerald-500' : 'text-rose-500'}`}>
                     {isWindowOpen ? <Unlock size={8} /> : <Lock size={8} />}
                     Janela {isWindowOpen ? 'Aberta' : 'Fechada'}
                  </span>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <button onClick={onSimulate} className="bg-primary px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-xl shadow-primary/20 active:scale-95 transition-all">
                  <Play size={14} fill="currentColor" /> JOGAR
               </button>
            </div>
         </header>

         <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 no-scrollbar">
            {/* Fan Reaction Ticker */}
            <div className="bg-surface/50 border border-white/5 p-3 rounded-2xl flex items-center gap-3 overflow-hidden">
               <div className="bg-primary/20 p-2 rounded-lg text-primary shrink-0">
                  <MessageSquare size={16} />
               </div>
               <p className="text-[10px] font-bold text-secondary italic animate-in fade-in slide-in-from-right duration-500 truncate" key={currentReactionIdx}>
                  "{fanReactions[currentReactionIdx]}"
               </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-surface border border-white/5 rounded-2xl p-4 flex flex-col gap-1 shadow-inner">
                  <p className="text-[8px] font-black text-secondary uppercase tracking-widest">Saldo Atual</p>
                  <p className={clsx("text-lg font-black", funds < 0 ? "text-rose-500" : "text-emerald-400")}>R$ {(funds / 1000).toFixed(0)}k</p>
               </div>
               <div className="bg-surface border border-white/5 rounded-2xl p-4 flex flex-col gap-1 shadow-inner">
                  <p className="text-[8px] font-black text-secondary uppercase tracking-widest">Confiança</p>
                  <div className="flex items-center gap-2">
                     <Heart size={14} className={clsx(team.moral > 70 ? "text-primary" : "text-rose-500")} fill="currentColor" />
                     <p className="text-lg font-black">{team.moral}%</p>
                  </div>
               </div>
            </div>

            {/* Next Match Focus */}
            <div className="bg-gradient-to-br from-surface to-background border border-white/10 rounded-[32px] p-6 shadow-2xl relative overflow-hidden group">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-all"></div>
               <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Rodada {round}</span>
                  <div className="px-2 py-1 bg-primary/10 rounded-lg text-[8px] font-black text-primary uppercase">Mando de Campo</div>
               </div>
               <div className="flex items-center justify-around">
                  <div className="flex flex-col items-center">
                     <div className="mb-3">
                        <TeamLogo team={team} size="w-16 h-16" />
                     </div>
                     <span className="text-[10px] font-black uppercase text-center">{team.name}</span>
                  </div>
                  <div className="flex flex-col items-center">
                     <span className="text-2xl font-black italic text-white/10">VS</span>
                  </div>
                  <div className="flex flex-col items-center">
                     <div className="mb-3 opacity-60">
                        <TeamLogo team={nextOpponent} size="w-16 h-16" />
                     </div>
                     <span className="text-[10px] font-black uppercase text-center">{nextOpponent.name}</span>
                  </div>
               </div>
            </div>

            {/* Grid Options */}
            <div className="grid grid-cols-2 gap-3">
               <button onClick={onOpenTactics} className="bg-surface/80 border border-white/5 p-5 rounded-3xl flex flex-col gap-3 group active:scale-95 transition-all">
                  <Target className="text-primary group-hover:rotate-45 transition-transform" size={24} />
                  <span className="text-sm font-black uppercase tracking-tighter">Tática</span>
               </button>
               <button onClick={onOpenSquad} className="bg-surface/80 border border-white/5 p-5 rounded-3xl flex flex-col gap-3 group active:scale-95 transition-all">
                  <Users className="text-blue-400 group-hover:scale-110 transition-transform" size={24} />
                  <span className="text-sm font-black uppercase tracking-tighter">Elenco</span>
               </button>
               <button onClick={onOpenMarket} className="bg-surface/80 border border-white/5 p-5 rounded-3xl flex flex-col gap-3 group active:scale-95 transition-all relative">
                  <ArrowLeftRight className={clsx("transition-all", isWindowOpen ? "text-emerald-400" : "text-rose-500")} size={24} />
                  <span className="text-sm font-black uppercase tracking-tighter">Mercado</span>
                  {offers.length > 0 && <div className="absolute top-4 right-4 w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>}
               </button>
               <button onClick={onOpenFinance} className="bg-surface/80 border border-white/5 p-5 rounded-3xl flex flex-col gap-3 group active:scale-95 transition-all">
                  <Wallet className="text-amber-400 group-hover:translate-y-[-2px] transition-transform" size={24} />
                  <span className="text-sm font-black uppercase tracking-tighter">Finanças</span>
               </button>
            </div>
         </main>

         <nav className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-xl border-t border-white/5 h-20 flex justify-around items-center px-6 pb-safe z-50">
            <button onClick={() => { }} className="flex flex-col items-center gap-1 text-primary">
               <LayoutDashboard size={20} />
               <span className="text-[9px] font-black uppercase">Home</span>
            </button>
            <button onClick={onOpenLeague} className="flex flex-col items-center gap-1 text-secondary">
               <Trophy size={20} />
               <span className="text-[9px] font-black uppercase">Liga</span>
            </button>
            <button onClick={onOpenStats} className="flex flex-col items-center gap-1 text-secondary">
               <BarChart3 size={20} />
               <span className="text-[9px] font-black uppercase">Stats</span>
            </button>
            <button onClick={onOpenNews} className="flex flex-col items-center gap-1 text-secondary relative">
               <Newspaper size={20} />
               <span className="text-[9px] font-black uppercase">Notícias</span>
               {unreadNewsCount > 0 && (
                  <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-black text-white">
                     {unreadNewsCount}
                  </div>
               )}
            </button>
            <button onClick={onOpenProfile} className="flex flex-col items-center gap-1 text-secondary">
               <Users size={20} />
               <span className="text-[9px] font-black uppercase">Perfil</span>
            </button>
            <button onClick={onOpenSettings} className="flex flex-col items-center gap-1 text-secondary">
               <Settings size={20} />
               <span className="text-[9px] font-black uppercase">Ajustes</span>
            </button>
         </nav>
      </div>
   );
}
