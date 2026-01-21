
import React from 'react';
import { Team, SeasonHistory } from '../types';
import { Trophy, RotateCcw, TrendingUp, TrendingDown, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import clsx from 'clsx';

interface Props {
   champion: Team;
   userTeam: Team;
   onNewSeason: () => void;
   onQuit: () => void;
   teams: Team[];
   pastSeasons: SeasonHistory[];
}

export default function ChampionScreen({ champion, userTeam, onNewSeason, onQuit, teams, pastSeasons }: Props) {
   const isUserChampion = champion.id === userTeam.id;

   const standingsA = [...teams].filter(t => t.division === 1).sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga));
   const standingsB = [...teams].filter(t => t.division === 2).sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga));

   const relegated = standingsA.slice(-4);
   const promoted = standingsB.slice(0, 4);

   return (
      <div className="relative flex flex-col h-screen w-full bg-background overflow-hidden">
         <div className={clsx(
            "absolute inset-0 bg-gradient-to-b opacity-40 z-0",
            isUserChampion ? "from-yellow-500/20 via-background to-background" : "from-blue-500/20 via-background to-background"
         )}></div>

         <main className="relative z-10 flex-1 flex flex-col items-center p-6 text-center overflow-y-auto no-scrollbar">
            <div className="my-8 animate-bounce">
               <Trophy size={80} className={isUserChampion ? "text-yellow-400" : "text-secondary"} />
            </div>

            <div className="space-y-2 mb-8">
               <p className="text-sm font-bold tracking-widest uppercase text-secondary">Temporada Finalizada</p>
               <h1 className="text-4xl font-black text-white">{champion.name} Campeão!</h1>
            </div>

            {/* Resumo da Temporada */}
            <div className="w-full max-w-sm space-y-4 mb-10">
               <div className="bg-surface/50 border border-white/10 rounded-3xl p-6 space-y-6">
                  <div className="space-y-3">
                     <div className="flex items-center gap-2 text-emerald-400">
                        <ArrowUpCircle size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Subiram para a Série A</span>
                     </div>
                     <div className="grid grid-cols-2 gap-2">
                        {promoted.map(t => (
                           <div key={t.id} className="bg-background/50 p-3 rounded-xl border border-emerald-500/20 text-xs font-bold truncate">
                              {t.name}
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-3">
                     <div className="flex items-center gap-2 text-rose-400">
                        <ArrowDownCircle size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Caíram para a Série B</span>
                     </div>
                     <div className="grid grid-cols-2 gap-2">
                        {relegated.map(t => (
                           <div key={t.id} className="bg-background/50 p-3 rounded-xl border border-rose-500/20 text-xs font-bold truncate">
                              {t.name}
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4">
                  <p className="text-[10px] text-primary font-bold leading-relaxed">
                     {userTeam.division === 1 && relegated.some(r => r.id === userTeam.id)
                        ? "Sinto muito! Seu time não aguentou a pressão da elite e foi rebaixado."
                        : userTeam.division === 2 && promoted.some(p => p.id === userTeam.id)
                           ? "PARABÉNS! Você conquistou o acesso e jogará contra os grandes no próximo ano!"
                           : "Objetivo cumprido. Seu time permanece na divisão atual para o próximo desafio."}
                  </p>
               </div>
            </div>

            {/* Galeria de Campeões (Histórico) */}
            {pastSeasons.length > 0 && (
               <div className="w-full max-w-sm mb-10 text-left">
                  <h3 className="text-secondary text-xs font-black uppercase tracking-widest mb-3">Galeria de Lendas</h3>
                  <div className="space-y-2">
                     {pastSeasons.map(h => (
                        <div key={h.year} className="bg-surface/30 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-secondary">{h.year}</span>
                              <span className="text-sm font-black text-yellow-400">{h.championName}</span>
                           </div>
                           <div className="text-right">
                              <p className="text-[10px] text-emerald-400 font-bold">Artilheiro: {h.topScorer.name}</p>
                              <p className="text-[9px] text-secondary">{h.topScorer.goals} gols</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            <div className="flex flex-col w-full max-w-xs gap-3 pb-12">
               <button
                  onClick={onNewSeason}
                  className="w-full py-5 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
               >
                  <RotateCcw size={20} />
                  <span>INICIAR PRÓXIMA TEMPORADA</span>
               </button>
               <button
                  onClick={onQuit}
                  className="text-secondary font-bold text-sm uppercase tracking-widest p-4"
               >
                  Sair para o Menu
               </button>
            </div>
         </main>
      </div>
   );
}
