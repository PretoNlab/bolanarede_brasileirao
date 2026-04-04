
import React from 'react';
import { Team, WCGroup, WCBracketMatch, WCPhase, Fixture, WorldCupGameState } from '../types';
import { Play, Users, Target, Globe, Trophy, Swords, ArrowRight, XCircle, LayoutGrid, Home } from 'lucide-react';
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-white font-sans overflow-hidden">
      {/* HEADER */}
      <header className="px-5 pt-12 pb-4 bg-background z-10 border-b border-white/5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            {onBackHome && (
              <button onClick={() => { impactLight(); onBackHome(); }} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <Home size={18} className="text-secondary" />
              </button>
            )}
            <div>
              <span className="text-[10px] font-black tracking-[0.2em] text-yellow-500 uppercase block">Copa do Mundo 2026</span>
              <span className="text-xs text-secondary font-medium">{PHASE_LABELS[currentPhase]}</span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ boxShadow: ["0 0 0px #eab308", "0 0 20px #eab308", "0 0 0px #eab308"] }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={() => { impactMedium(); onSimulate(); }}
            disabled={isEliminated || currentPhase === 'FINISHED'}
            className={clsx(
              "px-6 py-2.5 rounded-2xl text-[11px] font-black flex items-center gap-2 shadow-xl transition-all uppercase tracking-widest border border-white/10",
              (isEliminated || currentPhase === 'FINISHED') ? "bg-white/5 text-gray-500 cursor-not-allowed" : "bg-yellow-500 text-black shadow-yellow-500/20"
            )}
          >
            <Play size={14} fill="currentColor" /> JOGAR
          </motion.button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-secondary">
            {PHASE_LABELS[currentPhase]}
          </div>
          {currentPhase === 'GROUP' && (
            <div className="rounded-full border border-yellow-500/25 bg-yellow-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-yellow-400">
              Matchday {currentMatchday} de 3
            </div>
          )}
          {currentPhase !== 'GROUP' && currentPhase !== 'FINISHED' && (
            <div className="rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-secondary">
              Mata-mata
            </div>
          )}
        </div>
      </header>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto p-5 space-y-6 pb-24 no-scrollbar"
      >
        {/* User Team Highlight */}
        <motion.div variants={itemVariants} className="bg-surface/50 rounded-[32px] p-6 border border-yellow-500/20 relative overflow-hidden group">
          <div className="flex items-center gap-4 relative z-10">
            <TeamLogo team={userTeam} size="lg" />
            <div>
              <h2 className="text-xl font-black italic tracking-tighter uppercase leading-none">{userTeam.name}</h2>
              {userTeam.managerName && (
                <span className="text-[10px] font-bold text-yellow-500/80 uppercase tracking-widest block mt-0.5">Técnico: {userTeam.managerName}</span>
              )}
              <div className="flex items-center gap-2 mt-1.5">
                <span className={clsx(
                  "px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase",
                  isEliminated ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                )}>
                  {isEliminated ? "Eliminado" : "Em Busca da Taça"}
                </span>
                {userGroup && (
                  <span className="text-[10px] font-bold text-secondary uppercase">Grupo {userGroup.name} • {userPosition}º lugar</span>
                )}
              </div>
            </div>
          </div>
          <Trophy className="absolute -right-4 -bottom-4 text-yellow-500/5 w-32 h-32 rotate-12" />
        </motion.div>

        {/* PRÓXIMO CONFRONTO */}
        {nextMatch && (
          <motion.div variants={itemVariants} className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary px-1">Próximo Jogo</h3>
            <div className="bg-surface/50 border border-white/5 rounded-[32px] p-6 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center gap-2 flex-1">
                  <TeamLogo team={userTeam} size="md" />
                  <span className="text-[10px] font-black uppercase text-secondary">{userTeam.shortName}</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <span className="text-xl font-black italic text-white/10 uppercase">VS</span>
                  <div className="px-2 py-0.5 bg-white/5 rounded-full text-[8px] font-bold text-secondary uppercase mt-1">
                    {PHASE_LABELS[currentPhase]}
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 flex-1">
                  <TeamLogo team={nextMatch.opponent} size="md" />
                  <span className="text-[10px] font-black uppercase text-secondary">{nextMatch.opponent.shortName}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STANDINGS QUICK VIEW */}
        {currentPhase === 'GROUP' && userGroup && (
          <motion.div variants={itemVariants} className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary px-1">Classificação Grupo {userGroup.name}</h3>
            <div className="bg-surface/30 border border-white/5 rounded-[32px] overflow-hidden">
               <table className="w-full text-left text-xs">
                 <thead className="bg-white/5 border-b border-white/5">
                   <tr>
                     <th className="p-4 font-black text-[9px] uppercase text-secondary">Pos</th>
                     <th className="p-4 font-black text-[9px] uppercase text-secondary">Seleção</th>
                     <th className="p-4 font-black text-[9px] uppercase text-secondary text-right">Pts</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {groupStandings.map((s, idx) => {
                     const t = getTeam(s.teamId)!;
                     return (
                       <tr key={s.teamId} className={clsx(s.teamId === wcState.userTeamId ? "bg-yellow-500/5" : "")}>
                         <td className="p-4 font-bold text-secondary">{idx + 1}</td>
                         <td className="p-4 flex items-center gap-3">
                           <TeamLogo team={t} size="sm" />
                           <span className={clsx("font-black uppercase text-[10px]", s.teamId === wcState.userTeamId ? "text-yellow-500" : "text-white/80")}>{t.name}</span>
                         </td>
                         <td className="p-4 text-right font-black italic">{s.points}</td>
                       </tr>
                     );
                   })}
                 </tbody>
               </table>
            </div>
          </motion.div>
        )}

        {/* TOURNAMENT STATS */}
        {wcState.matchHistory.length > 0 && (() => {
          const { topScorers, topAssisters } = getTournamentStats(wcState.matchHistory);
          if (topScorers.length === 0 && topAssisters.length === 0) return null;

          return (
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary px-1">Estatísticas da Copa</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Artilheiros */}
                {topScorers.length > 0 && (
                  <div className="bg-surface/30 border border-white/5 rounded-[32px] p-5 space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <Target size={14} className="text-yellow-500" />
                      <span className="text-[11px] font-black uppercase tracking-tighter">Artilheiros</span>
                    </div>
                    <div className="space-y-3">
                      {topScorers.slice(0, 5).map((stat, i) => (
                        <div key={`scorer-${i}`} className="flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-white/20 w-3">{i + 1}</span>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase tracking-tight line-clamp-1">{stat.name}</span>
                              <span className="text-[8px] font-bold text-secondary uppercase leading-none">{stat.teamShort}</span>
                            </div>
                          </div>
                          <span className="text-xs font-black italic text-yellow-500">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assistências */}
                {topAssisters.length > 0 && (
                  <div className="bg-surface/30 border border-white/5 rounded-[32px] p-5 space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <Users size={14} className="text-blue-400" />
                      <span className="text-[11px] font-black uppercase tracking-tighter">Assistências</span>
                    </div>
                    <div className="space-y-3">
                      {topAssisters.slice(0, 5).map((stat, i) => (
                        <div key={`assister-${i}`} className="flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-white/20 w-3">{i + 1}</span>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase tracking-tight line-clamp-1">{stat.name}</span>
                              <span className="text-[8px] font-bold text-secondary uppercase leading-none">{stat.teamShort}</span>
                            </div>
                          </div>
                          <span className="text-xs font-black italic text-blue-400">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })()}

        {/* BOTTOM ACCESSIBLE GRID */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
          <button onClick={() => { impactLight(); onOpenGroups(); }} className="bg-surface/50 border border-white/5 p-5 rounded-[28px] flex flex-col gap-3 group active:scale-95 transition-all">
            <div className="bg-white/5 w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-yellow-500/10 transition-colors">
              <LayoutGrid size={20} className="text-secondary group-hover:text-yellow-500" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-tight">Grupos</span>
          </button>
          <button onClick={() => { impactLight(); onOpenBracket(); }} className="bg-surface/50 border border-white/5 p-5 rounded-[28px] flex flex-col gap-3 group active:scale-95 transition-all">
            <div className="bg-white/5 w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-yellow-500/10 transition-colors">
              <Trophy size={20} className="text-secondary group-hover:text-yellow-500" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-tight">Mata-Mata</span>
          </button>
          <button onClick={() => { impactLight(); onOpenTactics(); }} className="bg-surface/50 border border-white/5 p-5 rounded-[28px] flex flex-col gap-3 group active:scale-95 transition-all">
            <div className="bg-white/5 w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-yellow-500/10 transition-colors">
              <Swords size={20} className="text-secondary group-hover:text-yellow-500" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-tight">Tática</span>
          </button>
          <button onClick={() => { impactLight(); onOpenSquad(); }} className="bg-surface/50 border border-white/5 p-5 rounded-[28px] flex flex-col gap-3 group active:scale-95 transition-all">
            <div className="bg-white/5 w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-yellow-500/10 transition-colors">
              <Users size={20} className="text-secondary group-hover:text-yellow-500" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-tight">Seleção</span>
          </button>
        </motion.div>

        {/* QUIT ACTION */}
        <motion.div variants={itemVariants} className="pt-4 pb-8">
           <button 
             onClick={() => { impactLight(); onQuit(); }}
             className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-rose-500 transition-colors py-4 border border-white/5 rounded-2xl"
           >
              <XCircle size={14} /> Encerrar Copa do Mundo
           </button>
        </motion.div>
      </motion.main>
    </div>
  );
}
