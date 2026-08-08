import React, { useMemo } from 'react';
import { TeamLogo } from '../components/TeamLogo';
import { Team, Player } from '../types';
import { ArrowLeft, Play, ShieldAlert, Swords, Users, AlertTriangle, ChevronRight, Zap } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { hapticSelection, impactHeavy } from '../haptics';
import { calculateDynamicTeamStrength } from '../engine/tacticsEngine';

interface Props {
    userTeam: Team;
    opponent: Team;
    onBack: () => void;
    onStartMatch: () => void;
    onTactics: () => void;
    onSquad: () => void;
    onAutoFixLineup?: () => void;
}

export default function PreMatchScreen({ userTeam, opponent, onBack, onStartMatch, onTactics, onSquad, onAutoFixLineup }: Props) {

    // Calculate Team Power
    const userStrength = useMemo(() => calculateDynamicTeamStrength(userTeam), [userTeam]);
    const opponentStrength = useMemo(() => calculateDynamicTeamStrength(opponent), [opponent]);
    const userPower = (userStrength.att + userStrength.def + userStrength.control) / 3;
    const oppPower = (opponentStrength.att + opponentStrength.def + opponentStrength.control) / 3;
    const powerDiff = userPower - oppPower;

    // Check for issues in the lineup (Injuries/Suspensions)
    const lineupIssues = useMemo(() => {
        const issues: string[] = [];
        const starters = userTeam.roster.filter(p => userTeam.lineup.includes(p.id));

        if (starters.length !== 11) {
            issues.push(`Escalação incompleta (${starters.length}/11).`);
        }

        starters.forEach(p => {
            if (p.status === 'injured') {
                issues.push(`${p.name} lesionado.`);
            }
            if (p.isSuspended) {
                issues.push(`${p.name} suspenso.`);
            }
        });

        return issues;
    }, [userTeam]);

    const canStart = lineupIssues.length === 0;

    const TeamCard = ({ team, isUser }: { team: Team, isUser: boolean }) => {
        const strength = isUser ? userStrength : opponentStrength;
        const power = (strength.att + strength.def + strength.control) / 3;
        return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={clsx(
            "flex flex-col items-center p-3 sm:p-6 rounded-2xl sm:rounded-[2.5rem] border-2 flex-1 max-w-[160px] sm:max-w-[180px] relative overflow-hidden group shrink-0",
            isUser ? "bg-primary/5 border-primary/20" : "bg-white/5 border-white/10"
          )}
        >
            <div className={clsx(
              "absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none",
              isUser ? "bg-gradient-to-b from-primary to-transparent" : "bg-gradient-to-b from-white to-transparent"
            )} />
            
            <div className="relative z-10 mb-3 sm:mb-4 transform group-hover:scale-105 transition-transform duration-500">
                <TeamLogo team={team} size="lg" />
            </div>
            
            <div className="relative z-10 text-center w-full">
                <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-white/50 mb-0.5">CLUBE</h3>
                <h4 className="text-xs sm:text-base font-black uppercase italic tracking-tight text-white leading-tight mb-3 truncate max-w-full px-1">{team.name}</h4>
                
                <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1.5">
                        <Zap size={12} className={isUser ? "text-primary" : "text-slate-400"} />
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">FORÇA</span>
                    </div>
                    <div className="h-1.5 w-14 sm:w-16 bg-white/10 rounded-full overflow-hidden border border-white/10">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, power)}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={clsx("h-full", isUser ? "bg-primary" : "bg-white/40")}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
        );
    };

    return (
        <div className="flex flex-col h-dvh bg-background text-white font-sans w-full relative overflow-hidden">
            {/* Ambient Background Gradient */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-1/4 -left-1/4 w-full h-full bg-primary/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            {/* Header */}
            <header className="p-4 sm:p-6 flex items-center justify-between z-40 bg-background/80 backdrop-blur-md sticky top-0 border-b border-white/5 pt-safe">
                <button 
                  onClick={() => { hapticSelection(); onBack(); }} 
                  className="w-11 h-11 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all active:scale-90 text-white shrink-0"
                  aria-label="Voltar"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="text-center px-2 min-w-0 flex-1">
                   <p className="ui-label-caps text-center text-xs opacity-80 mb-0.5">Rodada de Campeonato</p>
                   <h1 className="text-sm sm:text-base font-black italic uppercase tracking-tight text-center truncate">Protocolo de Jogo</h1>
                </div>
                <div className="w-11 h-11 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center opacity-30 shrink-0">
                   <Swords size={20} />
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center gap-6 sm:gap-8 pb-60 no-scrollbar relative z-10 max-w-4xl mx-auto w-full">

                {/* Matchup Visualizer */}
                <div className="w-full relative flex flex-row items-center justify-between sm:justify-center gap-2 sm:gap-6 ui-card-premium p-3 sm:p-6">
                    <TeamCard team={userTeam} isUser={true} />
                    
                    <div className="flex flex-col items-center gap-1.5 sm:gap-3 py-1 sm:py-4 z-10 shrink-0">
                        <div className="relative">
                            <span className="text-3xl sm:text-5xl font-black italic text-white/20 tracking-tighter select-none">VS</span>
                            <div className="absolute inset-0 flex items-center justify-center">
                               <Swords size={20} className="text-primary opacity-70" />
                            </div>
                        </div>
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={clsx(
                            "px-2.5 sm:px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider border backdrop-blur-xl transition-all shadow-xl italic text-center",
                            powerDiff > 5 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10" : 
                            powerDiff < -5 ? "bg-amber-500/10 text-amber-300 border-amber-500/20 shadow-amber-500/10" : 
                            "bg-white/5 text-slate-300 border-white/10"
                          )}
                        >
                            {powerDiff > 5 ? "Favorito" : powerDiff < -5 ? "Desafio" : "Equilíbrio"}
                        </motion.div>
                    </div>

                    <TeamCard team={opponent} isUser={false} />
                </div>

                {/* Stats Comparison Chart */}
                <section className="ui-card-premium w-full p-6 sm:p-8 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Zap size={120} className="text-white" />
                    </div>
                    
                    <h3 className="ui-label-caps text-center mb-8 text-slate-300">Análise de Potencial</h3>

                    <div className="space-y-8 relative z-10">
                        {/* Power Attributes */}
                        {[
                          { label: 'Poder Ofensivo', userVal: Math.round(userStrength.att), oppVal: Math.round(opponentStrength.att), icon: <Swords size={14} /> },
                          { label: 'Estabilidade Defensiva', userVal: Math.round(userStrength.def), oppVal: Math.round(opponentStrength.def), icon: <ShieldAlert size={14} /> }
                        ].map((stat) => (
                          <div key={stat.label} className="space-y-3">
                              <div className="flex justify-between items-end px-1">
                                  <div className="flex flex-col">
                                     <span className="text-xl sm:text-2xl font-black italic tabular-nums text-primary leading-none">{stat.userVal}</span>
                                     <span className="text-[11px] font-bold uppercase text-primary/70 tracking-wider">Casa</span>
                                  </div>
                                  <div className="flex flex-col items-center gap-1 pb-1">
                                      <div className="text-white/40">{stat.icon}</div>
                                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 italic">{stat.label}</span>
                                  </div>
                                  <div className="flex flex-col items-end">
                                     <span className="text-xl sm:text-2xl font-black italic tabular-nums text-white leading-none">{stat.oppVal}</span>
                                     <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Fora</span>
                                  </div>
                              </div>
                              <div className="flex gap-2 h-3 items-center">
                                  <div className="flex-1 bg-white/5 rounded-l-2xl overflow-hidden flex justify-end group-hover:bg-white/10 transition-colors">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(stat.userVal / 100) * 100}%` }}
                                        className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" 
                                      />
                                  </div>
                                  <div className="w-[2px] h-4 bg-white/20 rounded-full" />
                                  <div className="flex-1 bg-white/5 rounded-r-2xl overflow-hidden flex justify-start group-hover:bg-white/10 transition-colors">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(stat.oppVal / 100) * 100}%` }}
                                        className="h-full bg-white/40" 
                                      />
                                  </div>
                              </div>
                          </div>
                        ))}
                    </div>
                </section>

                {/* Pre-flight Warnings */}
                <AnimatePresence>
                {lineupIssues.length > 0 && (
                    <motion.div 
                      key="warnings"
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      className="w-full bg-rose-500/10 border border-rose-500/20 rounded-[2rem] p-5 sm:p-6 backdrop-blur-xl relative overflow-hidden"
                    >
                        <div className="absolute right-0 top-0 p-4 opacity-5 pointer-events-none">
                            <AlertTriangle size={64} className="text-rose-500" />
                        </div>
                        <div className="flex items-center justify-between mb-3 gap-2">
                            <div className="flex items-center gap-3 text-rose-400">
                                <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center">
                                   <AlertTriangle size={16} />
                                </div>
                                <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider italic">Restrições de Partida</h4>
                            </div>
                            {onAutoFixLineup && (
                                <button
                                    onClick={() => { impactHeavy(); onAutoFixLineup(); }}
                                    className="px-3.5 py-1.5 bg-emerald-500 text-slate-950 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 hover:bg-emerald-400 transition-all border border-emerald-400 shrink-0"
                                >
                                    <Zap size={14} className="fill-current" />
                                    <span>Auto-Corrigir</span>
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {lineupIssues.map((issue, idx) => (
                                <div key={idx} className="flex items-center justify-between gap-3 bg-rose-500/10 p-3 rounded-xl border border-rose-500/15 group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                        <span className="text-xs sm:text-sm font-medium text-rose-200 italic">{issue}</span>
                                    </div>
                                    {onAutoFixLineup && (
                                        <button
                                            onClick={() => { impactHeavy(); onAutoFixLineup(); }}
                                            className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 underline"
                                        >
                                            Substituir
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>

            </main>

            {/* Match Initiation Bar */}
            <footer className="fixed bottom-0 w-full p-4 sm:p-6 bg-background/95 backdrop-blur-2xl border-t border-white/10 flex flex-col gap-3 pb-safe z-50">
                <div className="max-w-4xl mx-auto w-full space-y-3">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <button 
                        onClick={() => { hapticSelection(); onTactics(); }} 
                        className="h-14 sm:h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center gap-2 sm:gap-3 text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all active:scale-95 text-slate-300 hover:text-white min-h-[44px]"
                      >
                          <Swords size={18} className="opacity-70" /> Ajustar Táticas
                      </button>
                      <button 
                        onClick={() => { hapticSelection(); onSquad(); }} 
                        className="h-14 sm:h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center gap-2 sm:gap-3 text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all active:scale-95 text-slate-300 hover:text-white min-h-[44px]"
                      >
                          <Users size={18} className="opacity-70" /> Gerir Elenco
                      </button>
                  </div>

                  {!canStart && onAutoFixLineup ? (
                      <button
                          onClick={() => { impactHeavy(); onAutoFixLineup(); }}
                          className="relative w-full h-16 sm:h-20 rounded-2xl sm:rounded-[1.75rem] flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm font-black uppercase tracking-widest transition-all active:scale-[0.98] overflow-hidden bg-emerald-500 text-slate-950 shadow-[0_15px_40px_rgba(16,185,129,0.4)] border border-emerald-400 min-h-[56px] hover:bg-emerald-400"
                      >
                          <Zap size={22} fill="currentColor" className="animate-bounce" /> 
                          <span className="italic">⚡ Resolver Escalação em 1 Clique</span>
                      </button>
                  ) : (
                      <button
                          onClick={() => { impactHeavy(); onStartMatch(); }}
                          disabled={!canStart}
                          className={clsx(
                              "relative w-full h-16 sm:h-20 rounded-2xl sm:rounded-[1.75rem] flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm font-black uppercase tracking-widest transition-all active:scale-[0.98] overflow-hidden group/init min-h-[56px]",
                              canStart 
                                ? "bg-primary text-white shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)]" 
                                : "bg-white/5 text-white/30 border border-white/10 cursor-not-allowed"
                          )}
                      >
                          {canStart && (
                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/init:translate-x-full transition-transform duration-1000" />
                          )}
                          {canStart ? (
                            <>
                              <Play size={22} fill="currentColor" className="group-hover/init:scale-110 transition-transform" /> 
                              <span className="italic">Entrar em Campo</span>
                            </>
                          ) : (
                            <span className="opacity-70 italic">Pendências de Escalação</span>
                          )}
                      </button>
                  )}
                </div>
            </footer>
        </div>
    );
}

