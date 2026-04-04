import React from 'react';
import { motion } from 'framer-motion';
import { WorldCupGameState } from '../types';
import { Trophy, Home, XCircle } from 'lucide-react';

interface Props {
  wcState: WorldCupGameState;
  onQuit: () => void;
}

export const WorldCupEliminatedScreen: React.FC<Props> = ({ wcState, onQuit }) => {
  const userTeam = wcState.teams.find(t => t.id === wcState.userTeamId);
  
  return (
    <div className="min-h-screen bg-[#F5F2ED] text-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
         <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-red-500 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-red-900 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 text-center border border-slate-100 relative z-10"
      >
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <XCircle size={48} className="text-red-500" strokeWidth={1.5} />
        </div>

        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 mb-2">
          Eliminação Amarga
        </h1>
        <p className="text-slate-500 font-medium mb-8">
          O sonho do hexa para {userTeam?.name} termina aqui. O torneio continua, mas sem o seu comando.
        </p>

        <div className="space-y-4 mb-10">
          <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fase alcançada</span>
            <span className="text-sm font-black text-slate-900">{getPhaseLabel(wcState.currentPhase)}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-slate-50 rounded-2xl flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Jogos</span>
                <span className="text-xl font-black text-slate-900">{wcState.matchHistory.length}</span>
             </div>
             <div className="p-4 bg-slate-50 rounded-2xl flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Gols</span>
                <span className="text-xl font-black text-slate-900">
                  {wcState.matchHistory.reduce((acc, m) => acc + (m.homeTeamName === userTeam?.name ? m.homeScore : m.awayTeamName === userTeam?.name ? m.awayScore : 0), 0)}
                </span>
             </div>
          </div>
        </div>

        <button
          onClick={onQuit}
          className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <Home size={16} />
          Voltar ao Início
        </button>
      </motion.div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400"
      >
        Bananinha Manager • World Cup 2026
      </motion.p>
    </div>
  );
};

function getPhaseLabel(phase: string) {
  const labels: Record<string, string> = {
    'GROUP': 'Fase de Grupos',
    'ROUND_OF_32': 'Dezesseis-avos',
    'ROUND_OF_16': 'Oitavas de Final',
    'QUARTER': 'Quartas de Final',
    'SEMI': 'Semifinal',
    'THIRD_PLACE': 'Terceiro Lugar',
    'FINAL': 'Grande Final'
  };
  return labels[phase] || phase;
}
