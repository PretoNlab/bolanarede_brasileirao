import React from 'react';
import { Team, WCGroup, WCBracketMatch, WCPhase, Fixture, WorldCupGameState } from '../types';
import { Play, Users, Target, Globe, Trophy, Swords, ArrowRight, XCircle, LayoutGrid, Home, BarChart3, ShieldCheck, Star } from 'lucide-react';
import { PHASE_LABELS, calculateGroupStandings, findUserNextMatch, getTournamentStats } from '../engine/worldCupEngine';
import { impactLight, impactMedium } from '../haptics';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { TeamLogo } from '../components/TeamLogo';

interface Props {
  wcState: WorldCupGameState;
  userTeam: Team;
  onSimulate: () => void;
  onOpenSquad: () => void;
  onOpenTactics: () => void;
  onOpenGroups: () => void;
  onOpenBracket: () => void;
  onQuit: () => void;
  onBackHome?: () => void;
}

export default function WorldCupDashboardScreen({
  wcState, userTeam, onSimulate, onOpenSquad, onOpenTactics, onOpenGroups, onOpenBracket, onQuit, onBackHome
}: Props) {
  const { currentPhase, currentMatchday, groups, fixtures, bracket, teams, isEliminated } = wcState;
  const nextMatch = findUserNextMatch(wcState);
  const nextMatchPhase = nextMatch?.bracketMatch?.phase || currentPhase;

  // Grupo do usuário
  const userGroup = groups.find(g => g.teamIds.includes(wcState.userTeamId));
  const groupStandings = userGroup ? calculateGroupStandings(userGroup, fixtures) : [];
  const userPosition = groupStandings.findIndex(s => s.teamId === wcState.userTeamId) + 1;

  const getTeam = (id: string) => teams.find(t => t.id === id);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0c] text-white font-sans overflow-hidden relative">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[70%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-yellow-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      </div>

      {/* HEADER */}
      <header className="px-6 pt-14 pb-6 bg-[#0a0a0c]/80 backdrop-blur-md z-20 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {onBackHome && (
              <button 
                onClick={() => { impactLight(); onBackHome(); }} 
                className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all active:scale-90"
              >
                <Home size={20} className="text-secondary" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <Trophy size={12} className="text-yellow-500" />
                <span className="text-[11px] font-black tracking-[0.4em] text-yellow-500 uppercase block">Copa do Mundo™</span>
              </div>
              <h1 className="text-lg font-black tracking-tight text-white/90">EUA • MÉXICO • CANADÁ</h1>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ boxShadow: (isEliminated || currentPhase === 'FINISHED') ? "0 0 0px #000" : ["0 0 0px #eab308", "0 0 20px #eab30844", "0 0 0px #eab308"] }}
            transition={{ duration: 3, repeat: Infinity }}
            onClick={() => { impactMedium(); onSimulate(); }}
            disabled={isEliminated || currentPhase === 'FINISHED'}
            className={clsx(
              "px-8 py-3.5 rounded-2xl text-[12px] font-black flex items-center gap-2 shadow-2xl transition-all uppercase tracking-[0.2em] border",
              (isEliminated || currentPhase === 'FINISHED') 
                ? "bg-white/5 text-gray-600 border-white/5 cursor-not-allowed opacity-50" 
                : "bg-yellow-500 text-black border-yellow-400 shadow-yellow-500/20 active:translate-y-1"
            )}
          >
            <Play size={16} fill="currentColor" /> AVANÇAR
          </motion.button>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-400">
            {PHASE_LABELS[currentPhase]}
          </div>
          {currentPhase === 'GROUP' && (
            <div className="px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-yellow-500">
              Rodada {currentMatchday} de 3
            </div>
          )}
        </div>
      </header>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto p-6 space-y-8 pb-32 no-scrollbar z-10"
      >
        {/* User Team Dynamic Spotlight */}
        <motion.div variants={itemVariants} className="group relative">
          <div className={clsx(
            "absolute inset-0 blur-2xl opacity-10 transition-opacity group-hover:opacity-20",
            isEliminated ? "bg-red-500" : "bg-yellow-500"
          )} />
          <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-6 relative z-10">
              <div className="relative">
                <TeamLogo team={userTeam} size="xl" className="shadow-2xl border-4 border-white/5" />
                {!isEliminated && (
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1 bg-yellow-500 w-5 h-5 rounded-full flex items-center justify-center border-2 border-black"
                  >
                    <Star size={10} className="text-black" fill="currentColor" />
                  </motion.div>
                )}
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tighter uppercase italic leading-[0.8] mb-2">{userTeam.name}</h2>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <Users size={12} className="text-yellow-500/60" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{userTeam.managerName || 'Comissão Técnica'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={clsx(
                      "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border",
                      isEliminated ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-green-500/10 text-green-500 border-green-500/20"
                    )}>
                      {isEliminated ? "Eliminado" : "Em Jogo"}
                    </span>
                    {userGroup && (
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Grupo {userGroup.name} • {userPosition}º</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Globe className="text-white/5 absolute right-[-20px] top-[-20px] w-48 h-48 rotate-12" />
          </div>
        </motion.div>

        {/* PRÓXIMO CONFRONTO - DRAMATIC CARD */}
        {nextMatch && (
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20">Próxima Batalha</h3>
              <span className="text-[10px] font-bold text-yellow-500/50 uppercase">Estádio Nacional</span>
            </div>
            
            <div className="bg-gradient-to-br from-white/10 to-transparent backdrop-blur-lg border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group hover:border-yellow-500/30 transition-all duration-500">
              <div className="flex items-center justify-center gap-10 relative z-10">
                <div className="flex flex-col items-center gap-4 group-hover:translate-x-2 transition-transform duration-500">
                  <TeamLogo team={userTeam} size="lg" className="shadow-2xl" />
                  <span className="text-xs font-black uppercase tracking-[0.2em] italic">{userTeam.shortName}</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-2 border border-white/10">
                    <span className="text-lg font-black italic text-white/20">VS</span>
                  </div>
                  <div className="px-3 py-1 bg-yellow-500 text-black rounded-lg text-[9px] font-black uppercase tracking-widest">
                    {PHASE_LABELS[nextMatchPhase]}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 group-hover:-translate-x-2 transition-transform duration-500">
                  <TeamLogo team={nextMatch.opponent} size="lg" className="shadow-2xl" />
                  <span className="text-xs font-black uppercase tracking-[0.2em] italic">{nextMatch.opponent.shortName}</span>
                </div>
              </div>
              
              {/* Background stats peek */}
              <div className="mt-8 pt-8 border-t border-white/5 flex justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-white/20">
                <div className="flex items-center gap-2">
                   <Target size={12} className="text-red-500/40" />
                   ATK {userTeam.attack} vs {nextMatch.opponent.attack}
                </div>
                <div className="flex items-center gap-2">
                   <ShieldCheck size={12} className="text-blue-500/40" />
                   DEF {userTeam.defense} vs {nextMatch.opponent.defense}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* QUICK STATS & GROUPS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* GROUP STANDINGS MINI */}
          {currentPhase === 'GROUP' && userGroup && (
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20 px-2">Posições • Grupo {userGroup.name}</h3>
              <div className="bg-white/5 rounded-[2rem] border border-white/5 overflow-hidden backdrop-blur-sm">
                 <table className="w-full text-left">
                   <tbody className="divide-y divide-white/5">
                     {groupStandings.map((s, idx) => {
                       const t = getTeam(s.teamId)!;
                       const isUser = s.teamId === wcState.userTeamId;
                       const isQualified = idx < 2;
                       return (
                         <tr key={s.teamId} className={clsx(isUser ? "bg-yellow-500/5" : "hover:bg-white/5 transition-colors")}>
                           <td className="py-4 pl-6 w-8">
                             <div className={clsx(
                               "w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black",
                               isQualified ? "bg-green-500/20 text-green-500" : "bg-white/5 text-white/40"
                             )}>
                               {idx + 1}
                             </div>
                           </td>
                           <td className="py-4 px-3 flex items-center gap-4">
                             <TeamLogo team={t} size="xs" />
                             <span className={clsx("text-[11px] font-black uppercase tracking-tight", isUser ? "text-yellow-500" : "text-white/80")}>
                               {t.name}
                             </span>
                           </td>
                           <td className="py-4 pr-8 text-right font-black italic text-sm">{s.points}</td>
                         </tr>
                       );
                     })}
                   </tbody>
                 </table>
              </div>
            </motion.div>
          )}

          {/* TOP PERFORMERS */}
          {wcState.matchHistory.length > 0 && (() => {
            const { topScorers } = getTournamentStats(wcState.matchHistory);
            return (
              <motion.div variants={itemVariants} className="space-y-4">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20 px-2">Chuteira de Ouro</h3>
                <div className="bg-white/5 rounded-[2rem] border border-white/5 p-6 backdrop-blur-sm">
                   <div className="space-y-4">
                     {topScorers.slice(0, 4).map((stat, i) => (
                       <div key={`scorer-${i}`} className="flex items-center justify-between group">
                         <div className="flex items-center gap-4">
                           <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[11px] font-black text-white/20">
                             {i + 1}
                           </div>
                           <div className="flex flex-col">
                             <span className="text-[11px] font-black uppercase tracking-tight">{stat.name}</span>
                             <span className="text-[9px] font-black text-yellow-500/40 uppercase tracking-widest">{stat.teamShort}</span>
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="text-sm font-black italic text-yellow-500">{stat.value}</span>
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Gols</span>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              </motion.div>
            );
          })()}
        </div>

        {/* NAVIGATION SYSTEM */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
           {[
             { label: 'CALENDÁRIO', icon: LayoutGrid, action: onOpenGroups, color: 'text-blue-400' },
             { label: 'MATA-MATA', icon: Trophy, action: onOpenBracket, color: 'text-yellow-400' },
             { label: 'MINHA TÁTICA', icon: Swords, action: onOpenTactics, color: 'text-green-400' },
             { label: 'CONVOCADOS', icon: Users, action: onOpenSquad, color: 'text-indigo-400' }
           ].map((btn, i) => (
             <button 
               key={i} 
               onClick={() => { impactLight(); btn.action(); }} 
               className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex flex-col gap-4 group active:scale-95 transition-all hover:bg-white/10 hover:border-white/20"
             >
               <div className="bg-white/5 w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                 <btn.icon size={24} className={clsx("opacity-40 group-hover:opacity-100 transition-opacity", btn.color)} />
               </div>
               <span className="text-[11px] font-black uppercase tracking-[0.2em]">{btn.label}</span>
             </button>
           ))}
        </motion.div>

        {/* TERMINATE ACTION */}
        <motion.div variants={itemVariants} className="pt-6 pb-12 flex justify-center">
           <button 
             onClick={() => { impactLight(); onQuit(); }}
             className="flex items-center gap-3 px-8 py-4 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-red-500 hover:border-red-500/30 transition-all active:scale-95 bg-white/[0.02]"
           >
              <XCircle size={16} /> Encerrar Mundial
           </button>
        </motion.div>
      </motion.main>
    </div>
  );
}
