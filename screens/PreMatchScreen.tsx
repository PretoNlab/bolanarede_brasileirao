import React, { useMemo } from 'react';
import { TeamLogo } from '../components/TeamLogo';
import { Team, Player } from '../types';
import { ArrowLeft, Play, ShieldAlert, Swords, Users, AlertTriangle, ChevronRight, Zap } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { hapticSelection, impactHeavy } from '../haptics';

interface Props {
    userTeam: Team;
    opponent: Team;
    onBack: () => void;
    onStartMatch: () => void;
    onTactics: () => void;
    onSquad: () => void;
}

export default function PreMatchScreen({ userTeam, opponent, onBack, onStartMatch, onTactics, onSquad }: Props) {

    // Calculate Team Power
    const userPower = (userTeam.attack + userTeam.defense) / 2;
    const oppPower = (opponent.attack + opponent.defense) / 2;
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

    const TeamCard = ({ team, isUser }: { team: Team, isUser: boolean }) => (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={clsx(
            "flex flex-col items-center p-8 rounded-[2.5rem] border-2 w-full max-w-[180px] relative overflow-hidden group",
            isUser ? "bg-primary/5 border-primary/20" : "bg-white/5 border-white/10"
          )}
        >
            <div className={clsx(
              "absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity",
              isUser ? "bg-gradient-to-b from-primary to-transparent" : "bg-gradient-to-b from-white to-transparent"
            )} />
            
            <div className="relative z-10 mb-6 transform group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]">
                <TeamLogo team={team} size="lg" />
            </div>
            
            <div className="relative z-10 text-center">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-1">CLUBE</h3>
                <h4 className="text-lg font-black uppercase italic tracking-tighter text-white leading-none mb-4">{team.name}</h4>
                
                <div className="flex flex-col items-center gap-1.5">
                    <div className="flex items-center gap-2">
                        <Zap size={10} className={isUser ? "text-primary" : "text-secondary"} />
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">FORÇA</span>
                    </div>
                    <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (team.attack + team.defense) / 2)}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={clsx("h-full", isUser ? "bg-primary" : "bg-white/40")}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="flex flex-col h-screen bg-background text-white font-sans overflow-hidden">
            {/* Ambient Background Gradient */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-1/4 -left-1/4 w-full h-full bg-primary/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            {/* Header */}
            <header className="p-6 flex items-center justify-between z-40 bg-background/50 backdrop-blur-md">
                <button 
                  onClick={() => { hapticSelection(); onBack(); }} 
                  className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all active:scale-90"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                   <p className="ui-label-caps text-center text-[10px] opacity-40 mb-1">Rodada de Campeonato</p>
                   <h1 className="text-base font-black italic uppercase tracking-tighter text-center">Protocolo de Jogo</h1>
                </div>
                <div className="w-12 h-12 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center opacity-20">
                   <Swords size={20} />
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center gap-10 pb-40 no-scrollbar relative z-10">

                {/* Matchup Visualizer */}
                <div className="w-full relative flex items-center justify-center gap-4">
                    <TeamCard team={userTeam} isUser={true} />
                    
                    <div className="flex flex-col items-center gap-4 py-8 z-10">
                        <div className="relative">
                            <span className="text-6xl font-black italic text-white/[0.03] tracking-tighter select-none">VS</span>
                            <div className="absolute inset-0 flex items-center justify-center">
                               <Swords size={24} className="text-primary opacity-50" />
                            </div>
                        </div>
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={clsx(
                            "px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border backdrop-blur-xl transition-all shadow-2xl italic",
                            powerDiff > 5 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10" : 
                            powerDiff < -5 ? "bg-amber-500/10 text-amber-300 border-amber-500/20 shadow-amber-500/10" : 
                            "bg-white/5 text-white/40 border-white/10"
                          )}
                        >
                            {powerDiff > 5 ? "Amplo Favorito" : powerDiff < -5 ? "Desafio Alto" : "Equilíbrio Total"}
                        </motion.div>
                    </div>

                    <TeamCard team={opponent} isUser={false} />
                </div>

                {/* Stats Comparison Chart */}
                <section className="ui-card-premium w-full p-8 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Zap size={120} className="text-white" />
                    </div>
                    
                    <h3 className="ui-label-caps text-center mb-10 opacity-60">Análise de Potencial</h3>

                    <div className="space-y-10 relative z-10">
                        {/* Power Attributes */}
                        {[
                          { label: 'Poder Ofensivo', userVal: userTeam.attack, oppVal: opponent.attack, icon: <Swords size={12} /> },
                          { label: 'Estabilidade Defensiva', userVal: userTeam.defense, oppVal: opponent.defense, icon: <ShieldAlert size={12} /> }
                        ].map((stat) => (
                          <div key={stat.label} className="space-y-4">
                              <div className="flex justify-between items-end px-1">
                                  <div className="flex flex-col">
                                     <span className="text-2xl font-black italic tabular-nums text-primary leading-none">{stat.userVal}</span>
                                     <span className="text-[8px] font-black uppercase text-primary/40 tracking-wider">Home</span>
                                  </div>
                                  <div className="flex flex-col items-center gap-1.5 pb-1">
                                      <div className="text-white/20">{stat.icon}</div>
                                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic">{stat.label}</span>
                                  </div>
                                  <div className="flex flex-col items-end">
                                     <span className="text-2xl font-black italic tabular-nums text-white leading-none">{stat.oppVal}</span>
                                     <span className="text-[8px] font-black uppercase text-white/20 tracking-wider">Away</span>
                                  </div>
                              </div>
                              <div className="flex gap-2 h-2.5 items-center">
                                  <div className="flex-1 bg-white/5 rounded-l-2xl overflow-hidden flex justify-end group-hover:bg-white/10 transition-colors">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(stat.userVal / 100) * 100}%` }}
                                        className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" 
                                      />
                                  </div>
                                  <div className="w-[2px] h-4 bg-white/10 rounded-full" />
                                  <div className="flex-1 bg-white/5 rounded-r-2xl overflow-hidden flex justify-start group-hover:bg-white/10 transition-colors">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(stat.oppVal / 100) * 100}%` }}
                                        className="h-full bg-white/30" 
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
                      className="w-full bg-rose-500/10 border border-rose-500/20 rounded-[2rem] p-6 backdrop-blur-xl relative overflow-hidden"
                    >
                        <div className="absolute right-0 top-0 p-4 opacity-5">
                            <AlertTriangle size={64} className="text-rose-500" />
                        </div>
                        <div className="flex items-center gap-3 mb-4 text-rose-400">
                            <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center">
                               <AlertTriangle size={16} />
                            </div>
                            <h4 className="text-xs font-black uppercase tracking-widest italic">Restrições de Partida</h4>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {lineupIssues.map((issue, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-rose-500/5 p-3 rounded-xl border border-rose-500/10 group">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                    <span className="text-xs font-medium text-rose-200/80 italic">{issue}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>

            </main>

            {/* Match Initiation Bar */}
            <footer className="fixed bottom-0 w-full p-6 bg-background/80 backdrop-blur-2xl border-t border-white/5 flex flex-col gap-4 pb-safe z-50">
                <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => { hapticSelection(); onTactics(); }} 
                      className="h-16 bg-white/5 rounded-[1.25rem] border border-white/10 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95 text-secondary hover:text-white"
                    >
                        <Swords size={18} className="opacity-50" /> Ajustar Táticas
                    </button>
                    <button 
                      onClick={() => { hapticSelection(); onSquad(); }} 
                      className="h-16 bg-white/5 rounded-[1.25rem] border border-white/10 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95 text-secondary hover:text-white"
                    >
                        <Users size={18} className="opacity-50" /> Gerir Elenco
                    </button>
                </div>

                <button
                    onClick={() => { impactHeavy(); onStartMatch(); }}
                    disabled={!canStart}
                    className={clsx(
                        "relative w-full h-20 rounded-[1.75rem] flex items-center justify-center gap-4 text-sm font-black uppercase tracking-[0.4em] transition-all active:scale-[0.98] overflow-hidden group/init",
                        canStart 
                          ? "bg-primary text-white shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)]" 
                          : "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"
                    )}
                >
                    {canStart && (
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/init:translate-x-full transition-transform duration-1000" />
                    )}
                    {canStart ? (
                      <>
                        <Play size={24} fill="currentColor" className="group-hover/init:scale-110 transition-transform" /> 
                        <span className="italic">Entrar em Campo</span>
                      </>
                    ) : (
                      <span className="opacity-50 italic">Pendências de Escalação</span>
                    )}
                </button>
            </footer>
        </div>
    );
}


