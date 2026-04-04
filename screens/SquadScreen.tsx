
import React, { useState } from 'react';
import { TeamLogo } from '../components/TeamLogo';
import { Header } from '../components/Header';
import { Team, Player, TransferLog } from '../types';
import { PencilLine, Zap, AlertCircle, Target, Trophy, X, ShieldAlert, User, Activity, FileText, ChevronRight, Sparkles, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface Props {
   team: Team;
   onBack: () => void;
   onRenew: (playerId: string) => void;
   transferLogs?: TransferLog[];
}

const POS_COLORS = {
   'GOL': 'text-amber-400 bg-amber-400/10 border-amber-400/20 shadow-amber-400/10',
   'ZAG': 'text-blue-400 bg-blue-400/10 border-blue-400/20 shadow-blue-400/10',
   'LAT': 'text-blue-400 bg-blue-400/10 border-blue-400/20 shadow-blue-400/10',
   'VOL': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10',
   'MEI': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20 shadow-emerald-400/10',
   'ATA': 'text-rose-400 bg-rose-400/10 border-rose-400/20 shadow-rose-400/10',
};

type PositionFilter = 'ALL' | 'GOL' | 'DEF' | 'MID' | 'ATT';

export default function SquadScreen({ team, onBack, onRenew, transferLogs = [] }: Props) {
   const [filter, setFilter] = useState<PositionFilter>('ALL');
   const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
   const [modalTab, setModalTab] = useState<'STATS' | 'BIO'>('STATS');

   const filteredPlayers = team.roster.filter(p => {
      if (filter === 'ALL') return true;
      if (filter === 'GOL') return p.position === 'GOL';
      if (filter === 'DEF') return ['ZAG', 'LAT'].includes(p.position);
      if (filter === 'MID') return ['VOL', 'MEI'].includes(p.position);
      if (filter === 'ATT') return p.position === 'ATA';
      return true;
   });

   const formatCurrency = (val: number) => {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
   };

   return (
      <div className="flex flex-col h-screen bg-background text-white selection:bg-primary/30 overflow-hidden">
         <Header 
            title="Escritório Técnico"
            subtitle="Gestão Integrada do Elenco"
            onBack={onBack}
            rightAction={
                <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/5 rounded-2xl border border-white/5">
                    <Activity size={14} className="text-emerald-500" />
                    <span className="font-black text-[10px] uppercase tracking-widest text-white/40">{team.roster.length} Atletas</span>
                </div>
            }
         />

         {/* Cinematic Tab Navigation */}
         <div className="px-6 py-6 overflow-x-auto no-scrollbar flex items-center gap-2 bg-background/80 backdrop-blur-3xl sticky top-0 z-30 border-b border-white/5">
            {(['ALL', 'GOL', 'DEF', 'MID', 'ATT'] as PositionFilter[]).map((tab) => (
               <button 
                  key={tab} 
                  onClick={() => setFilter(tab)} 
                  className={clsx(
                    "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap italic",
                    filter === tab 
                      ? "bg-emerald-500 text-white shadow-[0_10px_20px_rgba(31,177,133,0.2)] border border-emerald-400/20" 
                      : "bg-white/[0.02] text-white/30 border border-white/5 hover:bg-white/[0.05]"
                  )}
               >
                  {tab === 'ALL' ? 'Geral' : tab}
               </button>
            ))}
         </div>

         <div className="flex-1 overflow-y-auto px-6 pb-32 pt-6 space-y-5 no-scrollbar">
            {filteredPlayers.map((player) => (
               <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => { setSelectedPlayer(player); setModalTab('STATS'); }}
                  className="ui-card-premium p-8 flex items-center justify-between group cursor-pointer transition-all duration-500 hover:bg-white/[0.06] border-white/5 relative overflow-hidden"
               >
                  {player.isSuspended && (
                     <div className="absolute top-0 right-0 px-5 py-2 bg-rose-500/20 text-rose-400 text-[9px] font-black uppercase rounded-bl-[1.5rem] flex items-center gap-2 border-l border-b border-rose-500/20 backdrop-blur-md">
                        <ShieldAlert size={12} /> Suspenso
                     </div>
                  )}

                  <div className="flex items-center gap-6 relative z-10 w-full">
                     <div className={clsx(
                        "w-16 h-16 rounded-[1.75rem] flex items-center justify-center border-2 font-black text-sm shadow-2xl transition-all duration-500 group-hover:scale-110 italic bg-zinc-900 shrink-0", 
                        POS_COLORS[player.position as keyof typeof POS_COLORS]
                     )}>
                        {player.position}
                     </div>
                     <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-xl font-black text-white italic tracking-tighter truncate group-hover:text-emerald-400 transition-colors uppercase">{player.name}</span>
                            {player.energy < 50 && <Activity size={14} className="text-rose-500 animate-pulse" />}
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                                <span className="text-[10px] font-black text-emerald-400 italic">OVR {player.overall}</span>
                            </div>
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{player.age} anos</span>
                        </div>
                     </div>

                     <div className="flex flex-col items-end gap-3 shrink-0">
                        <div className="flex items-center gap-2">
                             <div className="flex items-center gap-1.5 text-[11px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                <Zap size={10} fill="currentColor" /> {player.energy}%
                             </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {player.goals > 0 && (
                                <div className="flex items-center gap-1.5 text-white/20 group-hover:text-emerald-400/60 transition-colors">
                                    <Target size={12} />
                                    <span className="text-[10px] font-black">{player.goals}</span>
                                </div>
                            )}
                            {player.assists > 0 && (
                                <div className="flex items-center gap-1.5 text-white/20 group-hover:text-blue-400/60 transition-colors">
                                    <Trophy size={12} />
                                    <span className="text-[10px] font-black">{player.assists}</span>
                                </div>
                            )}
                            <ChevronRight size={16} className="text-white/10 group-hover:text-emerald-500 transition-all group-hover:translate-x-1" />
                        </div>
                     </div>
                  </div>

                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
               </motion.div>
            ))}
         </div>

         {/* Detalhes do Atleta (Deep Immersive Modal) */}
         <AnimatePresence>
         {selectedPlayer && (
            <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-3xl overflow-hidden">
               <motion.header 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 flex items-center justify-between border-b border-white/5 bg-black/60 pt-safe"
               >
                  <button onClick={() => setSelectedPlayer(null)} className="w-14 h-14 bg-white/[0.03] rounded-2xl flex items-center justify-center hover:bg-white/[0.08] transition-all border border-white/10 active:scale-90"><X size={24} /></button>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-1">Dossiê Técnico</span>
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] italic text-emerald-500">Perfil do Atleta</h2>
                  </div>
                  <div className="w-14"></div>
               </motion.header>

               <main className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar pb-32">
                  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 relative">
                     <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />
                     
                     <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={clsx(
                           "w-48 h-48 rounded-[3.5rem] flex items-center justify-center border-2 font-black text-5xl shadow-[0_40px_80px_rgba(0,0,0,0.5)] relative italic shrink-0 bg-zinc-900", 
                           POS_COLORS[selectedPlayer.position as keyof typeof POS_COLORS]
                        )}
                     >
                        {selectedPlayer.position}
                        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-emerald-500 rounded-[2rem] border-4 border-black flex items-center justify-center text-white shadow-2xl rotate-12">
                           <Sparkles size={32} />
                        </div>
                     </motion.div>

                     <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 pt-4">
                        <div className="space-y-2">
                           <h3 className="text-6xl font-black text-white italic tracking-tighter leading-none uppercase">{selectedPlayer.name}</h3>
                           <div className="flex items-center justify-center lg:justify-start gap-3">
                                <span className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em]">{selectedPlayer.age} ANOS</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                <span className={clsx("text-[11px] font-black uppercase tracking-[0.3em]", selectedPlayer.status === 'fit' ? "text-emerald-500" : "text-rose-500")}>
                                    {selectedPlayer.status === 'fit' ? 'EM CONDIÇÕES' : 'INDISPONÍVEL'}
                                </span>
                           </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                           <div className="bg-emerald-500 px-5 py-2.5 rounded-2xl shadow-[0_10px_30px_rgba(31,177,133,0.3)]">
                                <span className="text-[11px] font-black text-white uppercase italic tracking-widest leading-none">OVR {selectedPlayer.overall}</span>
                           </div>
                           <div className="bg-white/5 border border-white/5 px-5 py-2.5 rounded-2xl backdrop-blur-xl">
                                <span className="text-[11px] font-black text-white/40 uppercase italic tracking-widest leading-none">POT {selectedPlayer.potential}</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                           <div className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(31,177,133,0.5)]" />
                           <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/90 italic">Dados de Desempenho</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           {[
                              { label: 'Gols', val: selectedPlayer.goals, icon: Target, color: 'text-emerald-400' },
                              { label: 'Assistências', val: selectedPlayer.assists, icon: Trophy, color: 'text-blue-400' },
                              { label: 'Amarelos', val: selectedPlayer.yellowCards, icon: ShieldAlert, color: 'text-amber-500' },
                              { label: 'Vermelhos', val: selectedPlayer.redCards, icon: ShieldAlert, color: 'text-rose-500', fill: true },
                           ].map((stat) => (
                              <div key={stat.label} className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 flex flex-col gap-4 group hover:bg-white/[0.04] transition-all">
                                 <div className={clsx("w-10 h-10 rounded-xl bg-black flex items-center justify-center border border-white/5", stat.color)}>
                                    <stat.icon size={20} fill={stat.fill ? "currentColor" : "none"} />
                                 </div>
                                 <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">{stat.label}</p>
                                    <p className="text-4xl font-black italic tracking-tighter text-white">{stat.val}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                           <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                           <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/90 italic">Atributos Técnicos</h3>
                        </div>

                        <div className="ui-card-premium p-10 space-y-8 bg-zinc-900 border-white/5">
                           {selectedPlayer.stats && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                 {[
                                    { label: 'PAC', key: 'pace', color: 'bg-cyan-500' },
                                    { label: 'DRI', key: 'dribbling', color: 'bg-amber-500' },
                                    { label: 'SHO', key: 'shooting', color: 'bg-emerald-500' },
                                    { label: 'DEF', key: 'defending', color: 'bg-rose-500' },
                                    { label: 'PAS', key: 'passing', color: 'bg-blue-500' },
                                    { label: 'PHY', key: 'physical', color: 'bg-purple-500' },
                                 ].map((attr) => (
                                    <div key={attr.label} className="space-y-2">
                                       <div className="flex justify-between items-end mb-1">
                                          <span className="text-[10px] font-black text-white/40 tracking-[0.2em]">{attr.label}</span>
                                          <span className="text-sm font-black italic text-white">{(selectedPlayer.stats as any)[attr.key]}</span>
                                       </div>
                                       <div className="h-1.5 bg-black rounded-full overflow-hidden border border-white/5">
                                          <motion.div 
                                             initial={{ width: 0 }}
                                             animate={{ width: `${(selectedPlayer.stats as any)[attr.key]}%` }}
                                             transition={{ duration: 1, ease: "easeOut" }}
                                             className={clsx("h-full", attr.color)} 
                                          />
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           )}
                           {!selectedPlayer.stats && <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 italic p-10 text-center">Dados analíticos pendentes.</p>}
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                    <div className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-10 flex flex-col gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Valor de Mercado</span>
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-black italic tracking-tighter text-emerald-500">{formatCurrency(selectedPlayer.marketValue)}</span>
                            <TrendingUp size={24} className="text-emerald-500/40" />
                        </div>
                    </div>
                    <div className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-10 flex flex-col gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Vínculo Contratual</span>
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-black italic tracking-tighter text-white">{selectedPlayer.contractRounds} RODADAS</span>
                            <FileText size={24} className="text-white/20" />
                        </div>
                    </div>
                  </div>
               </main>

               <motion.div 
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  className="p-8 bg-black/80 backdrop-blur-3xl border-t border-white/5 pb-safe sticky bottom-0 z-50 flex gap-4"
               >
                  <button
                     onClick={() => onRenew(selectedPlayer.id)}
                     className="flex-1 py-8 bg-emerald-500 text-white rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[12px] shadow-[0_20px_40px_rgba(31,177,133,0.3)] relative overflow-hidden group/btn"
                  >
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                      <span className="relative z-10 flex items-center justify-center gap-4 italic">
                        <PencilLine size={18} /> RENOVAR CONTRATO
                     </span>
                  </button>
               </motion.div>
            </div>
         )}
         </AnimatePresence>
      </div>
   );
}
