import React, { useState } from 'react';
import { Player, Team, Infrastructure } from '../types';
import { TeamLogo } from '../components/TeamLogo';
import { ArrowLeft, Star, TrendingUp, UserPlus, ShieldPlus, Activity, Zap, Target, Trophy, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import toast from 'react-hot-toast';

interface Props {
   userTeam: Team;
   roster: Player[];
   funds: number;
   infrastructure: Infrastructure;
   onPromote: (player: Player) => void;
   onBack: () => void;
}

const POS_COLORS = {
   'GOL': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
   'ZAG': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
   'LAT': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
   'VOL': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
   'MEI': 'text-primary bg-primary/10 border-primary/20',
   'ATA': 'text-primary-light bg-primary-light/10 border-primary-light/20',
};

export default function YouthAcademyScreen({ userTeam, roster, funds, infrastructure, onPromote, onBack }: Props) {
   const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

   const formatMoney = (val: number) => {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
   };

   // Scout office affects player identification visibility/quality
   const scoutLvl = infrastructure.scout || 1;

   return (
      <div className="flex flex-col h-screen bg-background text-white font-sans overflow-hidden">
         <header className="p-6 flex items-center justify-between bg-background/60 backdrop-blur-2xl border-b border-white/5 pt-safe shrink-0">
            <motion.button whileTap={{ scale: 0.9 }} onClick={onBack} className="w-10 h-10 rounded-xl bg-surface-low/80 flex items-center justify-center border border-white/10">
               <ArrowLeft size={18} />
            </motion.button>
            <div className="flex flex-col items-center">
               <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-0.5 glow-text">CATEGORIAS DE BASE</h1>
               <span className="text-sm font-black uppercase tracking-tight font-display italic text-on-surface-variant">YOUTH ACADEMY</span>
            </div>
            <TeamLogo team={userTeam} size="md" />
         </header>

         <main className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto p-6 space-y-8 no-scrollbar pb-32">
            
            {/* Academy Status Card */}
            <div className="glass-vibrant rounded-[2.5rem] p-10 border border-white/10 relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
                  <Star size={180} className="rotate-[-15deg] group-hover:rotate-0 transition-transform duration-700" />
               </div>
               
               <div className="relative z-10">
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-3 block">TALENTOS EM OBSERVAÇÃO</span>
                  <div className="flex items-baseline gap-3">
                     <span className="text-6xl font-black text-white font-display tabular italic">{roster.length}</span>
                     <span className="text-lg font-black text-primary uppercase italic tracking-tighter">Promessas</span>
                  </div>
                  
                  <div className="mt-8 flex items-center gap-4">
                     <div className="flex items-center gap-2 bg-background/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[8px] font-black text-white/60 uppercase tracking-[0.2em]">CT NÍVEL {infrastructure.ct}</span>
                     </div>
                     <span className="text-[9px] font-black text-secondary uppercase tracking-widest italic">OLHEIRO: {scoutLvl === 3 ? 'ELITE' : scoutLvl === 2 ? 'AVANÇADO' : 'BÁSICO'}</span>
                  </div>
               </div>
            </div>

            <section className="space-y-4">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">ELENCO SUB-20</h3>
               </div>

               {roster.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center text-on-surface-variant/10 gap-6 border-2 border-dashed border-white/5 rounded-[2.5rem]">
                     <UserPlus size={60} strokeWidth={1} className="animate-pulse" />
                     <p className="text-[9px] font-black uppercase tracking-[0.5em] text-center max-w-[200px] leading-relaxed">AGUARDANDO NOVOS TALENTOS...</p>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                     {roster.map((player) => (
                        <motion.div
                           key={player.id}
                           whileHover={{ scale: 1.02 }}
                           whileTap={{ scale: 0.98 }}
                           onClick={() => setSelectedPlayer(player)}
                           className="glass-panel p-6 rounded-[2rem] border border-white/5 flex items-center justify-between group cursor-pointer transition-all hover:bg-white/[0.03]"
                        >
                           <div className="flex items-center gap-5">
                              <div className={clsx(
                                 "w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xs border shadow-inner transition-transform group-hover:scale-105 italic font-display",
                                 POS_COLORS[player.position] || "bg-surface-highest text-white/40 border-white/10"
                              )}>
                                 {player.position}
                              </div>
                              <div className="flex flex-col gap-1">
                                 <h4 className="text-lg font-black text-white uppercase font-display italic tracking-tight">{player.name}</h4>
                                 <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-primary font-display uppercase italic">OVR {player.overall}</span>
                                    <div className="w-1 h-1 rounded-full bg-white/20" />
                                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{player.age} ANOS</span>
                                 </div>
                              </div>
                           </div>
                           <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-primary group-hover:bg-primary group-hover:text-secondary group-hover:rotate-12 transition-all">
                              <UserPlus size={18} />
                           </div>
                        </motion.div>
                     ))}
                  </div>
               )}
            </section>
         </main>

         {/* Player Details Modal */}
         <AnimatePresence>
            {selectedPlayer && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                  <motion.div 
                     initial={{ opacity: 0 }} 
                     animate={{ opacity: 1 }} 
                     exit={{ opacity: 0 }} 
                     onClick={() => setSelectedPlayer(null)} 
                     className="absolute inset-0 bg-background/90 backdrop-blur-2xl" 
                  />
                  
                  <motion.div
                     initial={{ scale: 0.9, y: 50, opacity: 0 }}
                     animate={{ scale: 1, y: 0, opacity: 1 }}
                     exit={{ scale: 0.9, y: 50, opacity: 0 }}
                     className="w-full max-w-lg glass-vibrant border border-white/10 rounded-[3rem] p-10 relative z-10 shadow-[0_50px_100px_rgba(0,0,0,1)]"
                  >
                     <div className="flex flex-col items-center text-center gap-6">
                        <div className={clsx(
                           "w-24 h-24 rounded-[2rem] flex items-center justify-center text-3xl font-black border shadow-2xl relative font-display italic",
                           POS_COLORS[selectedPlayer.position]
                        )}>
                           {selectedPlayer.position}
                           <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary rounded-full border-4 border-background flex items-center justify-center text-secondary text-xs">
                              <Star size={16} fill="currentColor" />
                           </div>
                        </div>
                        
                        <div className="space-y-2">
                           <h3 className="text-4xl font-black text-white italic font-display uppercase tracking-tighter leading-none">{selectedPlayer.name}</h3>
                           <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.4em]">{selectedPlayer.position} • {selectedPlayer.age} ANOS</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full mt-4">
                           <div className="glass-panel p-6 rounded-[2rem] border border-white/5 flex flex-col items-center">
                              <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-1">ATUAL</span>
                              <span className="text-4xl font-black text-primary font-display italic leading-none">{selectedPlayer.overall}</span>
                           </div>
                           <div className="glass-panel p-6 rounded-[2rem] border border-white/5 flex flex-col items-center">
                              <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-1">POTENCIAL</span>
                              <span className="text-4xl font-black text-secondary font-display italic leading-none">{selectedPlayer.potential}</span>
                           </div>
                        </div>

                        <div className="w-full space-y-4 pt-6">
                           <div className="p-5 bg-primary/5 rounded-[1.5rem] border border-primary/10 flex items-start gap-4 text-left">
                              <Info size={18} className="text-primary mt-0.5 shrink-0" />
                              <p className="text-[10px] text-on-surface-variant font-black leading-relaxed uppercase tracking-wider">
                                 AO PROMOVER ESTE ATLETA, ELE RECEBERÁ UM CONTRATO DE <span className="text-primary">10 RODADAS</span> E UM SALÁRIO BASE.
                              </p>
                           </div>

                           <div className="grid grid-cols-1 gap-4">
                              <motion.button
                                 whileTap={{ scale: 0.95 }}
                                 onClick={() => {
                                    onPromote(selectedPlayer);
                                    setSelectedPlayer(null);
                                    toast.success(`${selectedPlayer.name} promovido ao profissional!`);
                                 }}
                                 className="w-full py-6 bg-primary text-secondary rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-[0_20px_40px_rgba(31,177,133,0.3)] border-b-4 border-emerald-700"
                              >
                                 PROMOVER AO ELENCO
                              </motion.button>
                              <button
                                 onClick={() => setSelectedPlayer(null)}
                                 className="w-full py-6 glass-panel border border-white/10 rounded-[2rem] font-black uppercase tracking-widest text-[10px] text-on-surface-variant hover:bg-white/5"
                              >
                                 AVALIAR DEPOIS
                              </button>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
      </div>
   );
}
