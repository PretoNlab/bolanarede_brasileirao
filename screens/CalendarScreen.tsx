import React from 'react';
import { MatchResult } from '../types';
import { ArrowLeft, Calendar as CalendarIcon, Clock, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface Props {
  history: MatchResult[];
  currentRound: number;
  onBack: () => void;
}

export default function CalendarScreen({ history, currentRound, onBack }: Props) {
  // Group history by round
  const historyByRound: Record<number, MatchResult[]> = {};
  history.forEach(match => {
     if (!historyByRound[match.round]) historyByRound[match.round] = [];
     historyByRound[match.round].push(match);
  });

  const rounds = Object.keys(historyByRound).map(Number).sort((a, b) => b - a);

  return (
    <div className="flex flex-col h-screen bg-background text-white font-sans overflow-hidden">
      <header className="p-6 flex items-center justify-between bg-background/40 backdrop-blur-xl pt-safe">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onBack} className="w-10 h-10 rounded-xl bg-surface-low flex items-center justify-center border border-white/5 transition-all">
          <ArrowLeft size={18} />
        </motion.button>
        <div className="flex flex-col items-center">
          <h1 className="text-[9px] font-bold uppercase tracking-widest text-primary font-display mb-1">CENTRO DE COMPETIÇÃO</h1>
          <span className="text-xl font-bold tracking-tighter uppercase font-display italic">Calendário</span>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
         
         {/* Upcoming Round */}
         <div className="bg-surface-container/50 rounded-[2rem] border border-white/5 p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
               <CalendarIcon size={120} strokeWidth={1} />
            </div>
            
            <div className="flex items-center gap-3 mb-6">
               <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Clock size={16} />
               </div>
               <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary font-display">PRÓXIMA JORNADA</h2>
            </div>

            <div className="flex flex-col items-start gap-1">
               <span className="text-3xl font-bold tracking-tighter uppercase font-display italic">Rodada {currentRound}</span>
               <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest opacity-60">Status: Agendada para hoje</p>
            </div>
         </div>

         {/* History */}
         {rounds.map(round => (
            <div key={round} className="space-y-4">
               <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-secondary" />
                     <h2 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-display opacity-60">RESULTADOS JORNADA {round}</h2>
                  </div>
                  <ChevronRight size={14} className="text-on-surface-variant opacity-20" />
               </div>
               
               <div className="bg-surface-low border border-white/5 rounded-[2rem] overflow-hidden shadow-sm">
                  {historyByRound[round].map((match, idx) => (
                     <div key={idx} className={clsx(
                        "flex items-center justify-between p-5 zebra-stripe border-b border-white/5 last:border-0",
                        match.isUserMatch && "bg-primary/5"
                     )}>
                        <span className={clsx(
                           "text-[11px] font-bold uppercase tracking-tight w-[38%] text-right font-display",
                           match.isUserMatch && match.homeScore > match.awayScore ? 'text-primary' : 'text-on-surface-variant'
                        )}>
                           {match.homeTeamName}
                        </span>
                        
                        <div className="bg-surface-container px-4 py-2 rounded-xl text-sm font-bold font-display tabular tracking-tighter mx-3 border border-white/5 shadow-inner">
                           {match.homeScore} <span className="opacity-20 px-1">-</span> {match.awayScore}
                        </div>
                        
                        <span className={clsx(
                           "text-[11px] font-bold uppercase tracking-tight w-[38%] text-left font-display",
                           match.isUserMatch && match.awayScore > match.homeScore ? 'text-primary' : 'text-on-surface-variant'
                        )}>
                           {match.awayTeamName}
                        </span>
                     </div>
                  ))}
               </div>
            </div>
         ))}

         {history.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant/20 gap-4">
               <CalendarIcon size={64} strokeWidth={1} />
               <p className="text-[10px] font-bold uppercase tracking-widest italic font-display">Nenhum resultado registrado</p>
            </div>
         )}
      </main>
    </div>
  );
}