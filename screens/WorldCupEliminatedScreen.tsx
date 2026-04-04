import React from 'react';
import { motion } from 'framer-motion';
import { WorldCupGameState } from '../types';
import { Trophy, Home, XCircle, ChevronRight, History, Target, AlertCircle } from 'lucide-react';
import { TeamLogo } from '../components/TeamLogo';

interface Props {
  wcState: WorldCupGameState;
  onQuit: () => void;
}

export const WorldCupEliminatedScreen: React.FC<Props> = ({ wcState, onQuit }) => {
  const userTeam = wcState.teams.find(t => t.id === wcState.userTeamId);
  
  const headlines = [
    "O SONHO ACABOU",
    "ADEUS, MUNDIAL",
    "CORAÇÕES PARTIDOS",
    "FIM DA LINHA",
    "NOITE AMARGA"
  ];
  const randomHeadline = headlines[Math.floor(Math.random() * headlines.length)];

  const totalGoals = wcState.matchHistory.reduce((acc, m) => {
    if (m.homeTeamName === userTeam?.name) return acc + m.homeScore;
    if (m.awayTeamName === userTeam?.name) return acc + m.awayScore;
    return acc;
  }, 0);

  return (
    <div className="min-h-screen bg-[#070708] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-red-900/20 rounded-full blur-[140px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-slate-900/40 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-lg w-full bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 p-10 text-center relative z-10 shadow-2xl"
      >
        <div className="w-24 h-24 bg-red-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-red-500/20">
          <AlertCircle size={48} className="text-red-500" strokeWidth={1.5} />
        </div>

        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] mb-4 block"
        >
          Campanha Encerrada
        </motion.span>

        <h1 className="text-5xl font-black uppercase tracking-tighter text-white mb-4 leading-none">
          {randomHeadline}
        </h1>
        
        <p className="text-white/40 font-medium mb-10 text-sm leading-relaxed max-w-xs mx-auto">
          A jornada de <span className="text-white">{userTeam?.name}</span> na Copa do Mundo 2026 chegou ao fim. O mundo assiste, mas seu comando se despede dos gramados norte-americanos.
        </p>

        <div className="space-y-4 mb-12">
          {/* Main Stat */}
          <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                 <History size={20} className="text-blue-400" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest block">Fase Final</span>
                <span className="text-sm font-black text-white">{getPhaseLabel(wcState.currentPhase)}</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-white/10" />
          </div>
          
          {/* Mini Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 flex flex-col items-center">
                <Target size={20} className="text-amber-500 mb-2 opacity-50" />
                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Partidas</span>
                <span className="text-2xl font-black text-white">{wcState.matchHistory.length}</span>
             </div>
             <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 flex flex-col items-center">
                <Trophy size={20} className="text-green-500 mb-2 opacity-50" />
                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Gols Pró</span>
                <span className="text-2xl font-black text-white">{totalGoals}</span>
             </div>
          </div>
        </div>

        <button
          onClick={onQuit}
          className="w-full py-6 bg-white text-black rounded-[32px] font-black uppercase tracking-[0.2em] text-xs shadow-xl active:scale-95 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3"
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
