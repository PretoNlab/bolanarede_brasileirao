import React, { useEffect, useState } from 'react';
import { Team, WorldCupGameState, MatchResult } from '../types';
import { Trophy, Globe, Star, ArrowLeft, Users, Zap, Medal } from 'lucide-react';
import { getTournamentStats } from '../engine/worldCupEngine';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { TeamLogo } from '../components/TeamLogo';

interface Props {
  wcState: WorldCupGameState;
  onQuit: () => void;
}

export default function WorldCupChampionScreen({ wcState, onQuit }: Props) {
  const { bracket, teams, userTeamId, matchHistory } = wcState;

  // Encontrar o campeão (vencedor da final)
  const finalMatch = bracket.find(m => m.id === 'FINAL');
  const championId = finalMatch?.winnerId;
  const champion = championId ? teams.find(t => t.id === championId) : null;

  // Encontrar o vice (perdedor da final)
  const runnerUpId = finalMatch ? (finalMatch.team1Id === championId ? finalMatch.team2Id : finalMatch.team1Id) : null;
  const runnerUp = runnerUpId ? teams.find(t => t.id === runnerUpId) : null;

  // Terceiro lugar
  const thirdMatch = bracket.find(m => m.id === 'THIRD');
  const thirdPlaceId = thirdMatch?.winnerId;
  const thirdPlace = thirdPlaceId ? teams.find(t => t.id === thirdPlaceId) : null;

  const isUserChampion = championId === userTeamId;
  const { topScorers, topAssisters } = getTournamentStats(matchHistory);
  const topScorer = topScorers[0];
  const topAssister = topAssisters[0];

  const userMatches = matchHistory.filter(m => m.isUserMatch);

  return (
    <div className={clsx(
      "flex flex-col h-screen text-white font-sans overflow-y-auto no-scrollbar relative",
      isUserChampion
        ? "bg-[#0a0a0c]"
        : "bg-[#0a0a0c]"
    )}>
      {/* Background Cinematic Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={clsx(
          "absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-20 animate-pulse",
          isUserChampion ? "bg-yellow-500" : "bg-blue-500"
        )} />
        <div className={clsx(
          "absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] opacity-10",
          isUserChampion ? "bg-amber-600" : "bg-indigo-600"
        )} />
      </div>

      <div className="px-5 pt-16 pb-12 flex flex-col items-center relative z-10 w-full max-w-2xl mx-auto">
        
        {/* Animated Trophy Header */}
        <motion.div
           initial={{ y: -50, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ duration: 0.8, type: 'spring' }}
           className="flex flex-col items-center mb-10"
        >
          <div className={clsx(
            "w-32 h-32 rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-6 relative group",
            isUserChampion
              ? "bg-gradient-to-tr from-yellow-400 via-amber-500 to-yellow-600 shadow-yellow-500/40"
              : "bg-gradient-to-tr from-slate-700 via-slate-800 to-slate-900 shadow-white/5"
          )}>
            <Trophy className="w-16 h-16 text-white group-hover:scale-110 transition-transform duration-500" />
            {isUserChampion && (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-8px] border-2 border-dashed border-yellow-400/30 rounded-[3rem]"
              />
            )}
          </div>

          <span className="text-[11px] font-black tracking-[0.4em] text-yellow-500 uppercase mb-3">FIFA World Cup 2026™</span>
          <h1 className="text-5xl font-black text-center leading-[0.9] tracking-tighter">
            {isUserChampion ? (
              <>
                O MUNDO É <br/>
                <span className="text-yellow-400 bg-clip-text">SEU!</span>
              </>
            ) : (
              <>TORNEIO<br/>CONCLUÍDO</>
            )}
          </h1>
        </motion.div>

        {/* Champion Spotlight Card */}
        {champion && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-full bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-8 shadow-2xl relative overflow-hidden mb-8"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Globe size={120} />
            </div>

            <div className="flex flex-col items-center text-center relative z-10">
              <TeamLogo team={champion} size="xl" className="mb-4 shadow-xl border-4 border-yellow-500/20" />
              <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-1">Grande Campeão</span>
              <h2 className="text-4xl font-black mb-2">{champion.name}</h2>
              {champion.managerName && (
                <div className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-wider">
                  <Users size={12} />
                  Sob o comando de {champion.managerName}
                </div>
              )}

              {finalMatch && (
                <div className="mt-8 pt-6 border-t border-white/5 w-full">
                  <div className="flex items-center justify-between px-4">
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <TeamLogo team={teams.find(t => t.id === finalMatch.team1Id)!} size="sm" />
                      <span className="text-[10px] font-black text-white/40 uppercase">{teams.find(t => t.id === finalMatch.team1Id)?.shortName}</span>
                    </div>
                    
                    <div className="px-6 py-2 bg-white/5 rounded-full flex flex-col items-center">
                       <span className="text-3xl font-black text-yellow-400 tabular-nums">
                         {finalMatch.score1} - {finalMatch.score2}
                       </span>
                       {finalMatch.penalties1 !== undefined && (
                         <span className="text-[10px] font-bold text-white/40">(Pên. {finalMatch.penalties1}-{finalMatch.penalties2})</span>
                       )}
                    </div>

                    <div className="flex flex-col items-center gap-1 flex-1">
                      <TeamLogo team={teams.find(t => t.id === finalMatch.team2Id)!} size="sm" />
                      <span className="text-[10px] font-black text-white/40 uppercase">{teams.find(t => t.id === finalMatch.team2Id)?.shortName}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Podium Row */}
        <div className="grid grid-cols-3 gap-4 w-full mb-8">
           <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="bg-white/5 backdrop-blur-md rounded-3xl p-4 flex flex-col items-center border border-white/5">
              <div className="w-8 h-8 rounded-full bg-slate-400/20 flex items-center justify-center mb-3">
                 <span className="text-[10px] font-black text-slate-400">2º</span>
              </div>
              {runnerUp ? <TeamLogo team={runnerUp} size="sm" className="mb-2" /> : <div className="mb-2 h-6 w-6 rounded-full bg-white/10" />}
              <span className="text-[10px] font-black uppercase text-white/60 text-center">{runnerUp?.shortName}</span>
           </motion.div>

           <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }} className="bg-yellow-500/10 backdrop-blur-md rounded-3xl p-4 flex flex-col items-center border border-yellow-500/20 -mt-6">
              <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center mb-3">
                 <Medal className="w-4 h-4 text-yellow-400" />
              </div>
              {champion ? <TeamLogo team={champion} size="md" className="mb-2" /> : <div className="mb-2 h-10 w-10 rounded-full bg-white/10" />}
              <span className="text-[10px] font-black uppercase text-yellow-400 text-center">{champion?.shortName}</span>
           </motion.div>

           <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }} className="bg-white/5 backdrop-blur-md rounded-3xl p-4 flex flex-col items-center border border-white/5">
              <div className="w-8 h-8 rounded-full bg-orange-700/20 flex items-center justify-center mb-3">
                 <span className="text-[10px] font-black text-orange-400">3º</span>
              </div>
              {thirdPlace ? <TeamLogo team={thirdPlace} size="sm" className="mb-2" /> : <div className="mb-2 h-6 w-6 rounded-full bg-white/10" />}
              <span className="text-[10px] font-black uppercase text-white/60 text-center">{thirdPlace?.shortName}</span>
           </motion.div>
        </div>

        {/* Individual Awards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8">
           <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.9 }} className="bg-white/5 rounded-3xl p-5 border border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center">
                 <Zap className="text-yellow-500" />
              </div>
              <div>
                 <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block">Chuteira de Ouro</span>
                 <span className="text-sm font-black block">{topScorer?.name}</span>
                 <span className="text-[10px] font-bold text-yellow-500">{topScorer?.value} gols</span>
              </div>
           </motion.div>

           <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.0 }} className="bg-white/5 rounded-3xl p-5 border border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                 <Star className="text-blue-500" />
              </div>
              <div>
                 <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block">Líder de Garçom</span>
                 <span className="text-sm font-black block">{topAssister?.name}</span>
                 <span className="text-[10px] font-bold text-blue-500">{topAssister?.value} assistências</span>
              </div>
           </motion.div>
        </div>

        {/* Exit Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          onClick={onQuit}
          className="w-full py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl hover:bg-yellow-400 hover:text-black transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          Finalizar Caminhada
        </motion.button>

        <p className="mt-8 text-[9px] font-black text-white/20 uppercase tracking-[0.5em]">
          Bolanarede Manager • World Cup Series
        </p>
      </div>
    </div>
  );
}
