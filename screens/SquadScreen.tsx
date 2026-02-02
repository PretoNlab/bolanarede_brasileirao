
import React, { useState } from 'react';
import { Team, Player, TransferLog } from '../types';
import { ArrowLeft, PencilLine, Zap, AlertCircle, Target, Trophy, History, X, ChevronRight, TrendingUp, DollarSign, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';

interface Props {
   team: Team;
   onBack: () => void;
   onRenew: (playerId: string) => void;
   transferLogs?: TransferLog[];
}

const POS_COLORS = {
   'GOL': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
   'ZAG': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
   'LAT': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
   'VOL': 'text-green-500 bg-green-500/10 border-green-500/20',
   'MEI': 'text-green-400 bg-green-400/10 border-green-400/20',
   'ATA': 'text-red-500 bg-red-500/10 border-red-500/20',
};

export default function SquadScreen({ team, onBack, onRenew, transferLogs = [] }: Props) {
   const [filter, setFilter] = useState<'ALL' | 'GOL' | 'DEF' | 'MID' | 'ATT'>('ALL');
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

   const playerHistory = selectedPlayer ? transferLogs.filter(log => log.playerName === selectedPlayer.name) : [];

   return (
      <div className="flex flex-col h-screen bg-background text-white relative font-sans">
         <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-white/5 p-6 flex items-center justify-between pt-safe">
            <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center active:scale-95 transition-all">
               <ArrowLeft size={20} />
            </button>
            <h1 className="text-base font-black italic tracking-tighter uppercase">Elenco Profissional</h1>
            <div className="w-12"></div>
         </header>

         <div className="px-6 py-5 overflow-x-auto no-scrollbar flex gap-3 bg-background/60 backdrop-blur-xl sticky top-[80px] z-30 border-b border-white/5">
            {['ALL', 'GOL', 'DEF', 'MID', 'ATT'].map((tab) => (
               <button key={tab} onClick={() => setFilter(tab as any)} className={clsx("px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap min-w-[70px]", filter === tab ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white/5 text-secondary border border-white/5")}>
                  {tab === 'ALL' ? 'Todos' : tab}
               </button>
            ))}
         </div>

         <div className="flex-1 overflow-y-auto px-6 pb-28 space-y-4 no-scrollbar">
            {filteredPlayers.map((player) => (
               <div
                  key={player.id}
                  onClick={() => { setSelectedPlayer(player); setModalTab('STATS'); }}
                  className="bg-surface/60 backdrop-blur-sm rounded-[32px] p-6 border border-white/5 relative overflow-hidden active:scale-[0.98] transition-all cursor-pointer group hover:bg-surface/80 shadow-inner"
               >
                  {player.isSuspended && (
                     <div className="absolute top-0 right-0 px-4 py-1.5 bg-rose-600 text-[8px] font-black uppercase rounded-bl-2xl flex items-center gap-1.5 shadow-lg">
                        <AlertCircle size={10} /> Suspenso
                     </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-4">
                        <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center border-2 font-black text-xs shadow-inner transition-transform group-hover:scale-105", POS_COLORS[player.position])}>
                           {player.position}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-base font-black tracking-tight">{player.name}</span>
                           <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">OVR {player.overall} • {player.age} anos</span>
                        </div>
                     </div>
                     <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-black uppercase text-emerald-400">
                           <Zap size={10} fill="currentColor" /> {player.energy}%
                        </div>
                        <span className="text-[9px] text-secondary/60 uppercase font-black tracking-widest">Contrato: {player.contractRounds} rod.</span>
                     </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                     <div className="flex items-center gap-2">
                        <div className="flex-1 w-24 h-1 bg-background rounded-full overflow-hidden">
                           <div className={clsx("h-full transition-all", player.energy < 30 ? "bg-rose-500" : player.energy < 70 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${player.energy}%` }}></div>
                        </div>
                     </div>

                     <div className="flex items-center gap-3 text-[10px] font-bold">
                        {(player.goals > 0 || player.assists > 0 || player.yellowCards > 0 || player.redCards > 0) ? (
                           <>
                              {player.goals > 0 && <span className="flex items-center gap-1 text-emerald-400"><Target size={10} /> {player.goals}</span>}
                              {player.assists > 0 && <span className="flex items-center gap-1 text-blue-400"><Trophy size={10} /> {player.assists}</span>}
                              {player.yellowCards > 0 && <span className="flex items-center justify-center w-4 h-5 bg-yellow-500 text-black rounded-sm border border-yellow-600/50 shadow-sm" title="Cartões Amarelos">{player.yellowCards}</span>}
                              {player.redCards > 0 && <span className="flex items-center justify-center w-4 h-5 bg-rose-500 text-white rounded-sm border border-rose-600/50 shadow-sm" title="Cartões Vermelhos">{player.redCards}</span>}
                           </>
                        ) : (
                           <span className="text-secondary/30 italic">Sem estatísticas</span>
                        )}
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {/* Detalhes do Jogador (Modal) */}
         {selectedPlayer && (
            <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col">
               <header className="p-5 flex items-center justify-between border-b border-white/5 pt-safe bg-background/80 backdrop-blur-xl">
                  <button onClick={() => setSelectedPlayer(null)} className="w-10 h-10 bg-surface rounded-2xl flex items-center justify-center active:scale-90 transition-all border border-white/10"><X size={20} /></button>
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] italic text-white/70">Perfil do Atleta</h2>
                  <div className="w-10"></div>
               </header>

               <main className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                  {/* Card de Identificação */}
                  <div className="flex items-center gap-6">
                     <div className={clsx("w-24 h-24 rounded-[32px] flex items-center justify-center border-2 font-black text-2xl shadow-2xl", POS_COLORS[selectedPlayer.position])}>
                        {selectedPlayer.position}
                     </div>
                     <div className="space-y-1">
                        <h3 className="text-2xl font-black">{selectedPlayer.name}</h3>
                        <p className="text-sm text-secondary font-bold uppercase tracking-widest">{selectedPlayer.age} ANOS • {selectedPlayer.status === 'fit' ? 'EM CONDIÇÕES' : 'INDISPONÍVEL'}</p>
                        <div className="flex items-center gap-2 pt-2">
                           <span className="bg-primary text-white text-[10px] font-black px-2 py-1 rounded">OVR {selectedPlayer.overall}</span>
                           <span className="bg-surface text-secondary text-[10px] font-black px-2 py-1 rounded border border-white/5">POT {selectedPlayer.potential}</span>
                        </div>
                     </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-2 p-1 bg-surface rounded-xl border border-white/5 mx-2">
                     <button onClick={() => setModalTab('STATS')} className={clsx("flex-1 py-3 rounded-lg text-xs font-black uppercase transition-all", modalTab === 'STATS' ? "bg-white text-black shadow-lg" : "text-secondary hover:bg-white/5")}>
                        Estatísticas
                     </button>
                     <button onClick={() => setModalTab('BIO')} className={clsx("flex-1 py-3 rounded-lg text-xs font-black uppercase transition-all", modalTab === 'BIO' ? "bg-white text-black shadow-lg" : "text-secondary hover:bg-white/5")}>
                        Biografia
                     </button>
                  </div>

                  {modalTab === 'STATS' && (
                     <div className="space-y-8 animate-in slide-in-from-right duration-300">
                        {/* Grid de Estatísticas de Temporada */}
                        <div className="grid grid-cols-2 gap-3">
                           <div className="bg-surface p-4 rounded-3xl border border-white/5 space-y-2">
                              <div className="flex items-center gap-2 text-emerald-400">
                                 <Target size={14} />
                                 <span className="text-[10px] font-black uppercase">Gols</span>
                              </div>
                              <p className="text-3xl font-black">{selectedPlayer.goals}</p>
                           </div>
                           <div className="bg-surface p-4 rounded-3xl border border-white/5 space-y-2">
                              <div className="flex items-center gap-2 text-blue-400">
                                 <Trophy size={14} />
                                 <span className="text-[10px] font-black uppercase">Assistências</span>
                              </div>
                              <p className="text-3xl font-black">{selectedPlayer.assists}</p>
                           </div>
                           <div className="bg-surface p-4 rounded-3xl border border-white/5 space-y-2">
                              <div className="flex items-center gap-2 text-amber-500">
                                 <ShieldAlert size={14} />
                                 <span className="text-[10px] font-black uppercase">Amarelos</span>
                              </div>
                              <p className="text-3xl font-black">{selectedPlayer.yellowCards}</p>
                           </div>
                           <div className="bg-surface p-4 rounded-3xl border border-white/5 space-y-2">
                              <div className="flex items-center gap-2 text-rose-500">
                                 <ShieldAlert size={14} fill="currentColor" />
                                 <span className="text-[10px] font-black uppercase">Vermelhos</span>
                              </div>
                              <p className="text-3xl font-black">{selectedPlayer.redCards}</p>
                           </div>
                        </div>

                        {/* Detalhes de Atributos */}
                        <div className="bg-surface p-6 rounded-3xl border border-white/5 space-y-4">
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary">Atributos Técnicos</h4>
                           <div className="grid grid-cols-2 gap-4">
                              {selectedPlayer.stats && (
                                 <>
                                    <div className="space-y-1">
                                       <div className="flex justify-between text-xs font-bold font-mono text-secondary"><span>PAC</span> <span className="text-white">{selectedPlayer.stats.pace}</span></div>
                                       <div className="h-1.5 bg-black/50 rounded-full overflow-hidden"><div className="h-full bg-cyan-400" style={{ width: `${selectedPlayer.stats.pace}%` }}></div></div>
                                    </div>
                                    <div className="space-y-1">
                                       <div className="flex justify-between text-xs font-bold font-mono text-secondary"><span>DRI</span> <span className="text-white">{selectedPlayer.stats.dribbling}</span></div>
                                       <div className="h-1.5 bg-black/50 rounded-full overflow-hidden"><div className="h-full bg-amber-400" style={{ width: `${selectedPlayer.stats.dribbling}%` }}></div></div>
                                    </div>
                                    <div className="space-y-1">
                                       <div className="flex justify-between text-xs font-bold font-mono text-secondary"><span>SHO</span> <span className="text-white">{selectedPlayer.stats.shooting}</span></div>
                                       <div className="h-1.5 bg-black/50 rounded-full overflow-hidden"><div className="h-full bg-emerald-400" style={{ width: `${selectedPlayer.stats.shooting}%` }}></div></div>
                                    </div>
                                    <div className="space-y-1">
                                       <div className="flex justify-between text-xs font-bold font-mono text-secondary"><span>DEF</span> <span className="text-white">{selectedPlayer.stats.defending}</span></div>
                                       <div className="h-1.5 bg-black/50 rounded-full overflow-hidden"><div className="h-full bg-rose-400" style={{ width: `${selectedPlayer.stats.defending}%` }}></div></div>
                                    </div>
                                    <div className="space-y-1">
                                       <div className="flex justify-between text-xs font-bold font-mono text-secondary"><span>PAS</span> <span className="text-white">{selectedPlayer.stats.passing}</span></div>
                                       <div className="h-1.5 bg-black/50 rounded-full overflow-hidden"><div className="h-full bg-blue-400" style={{ width: `${selectedPlayer.stats.passing}%` }}></div></div>
                                    </div>
                                    <div className="space-y-1">
                                       <div className="flex justify-between text-xs font-bold font-mono text-secondary"><span>PHY</span> <span className="text-white">{selectedPlayer.stats.physical}</span></div>
                                       <div className="h-1.5 bg-black/50 rounded-full overflow-hidden"><div className="h-full bg-purple-400" style={{ width: `${selectedPlayer.stats.physical}%` }}></div></div>
                                    </div>
                                 </>
                              )}
                              {!selectedPlayer.stats && <p className="text-xs text-secondary italic">Atributos detalhados indisponíveis.</p>}
                           </div>
                        </div>

                        {/* Potencial e Valor */}
                        <div className="bg-surface rounded-3xl p-6 border border-white/5 space-y-6">
                           <div className="space-y-3">
                              <div className="flex justify-between items-center text-[10px] font-black uppercase text-secondary">
                                 <span>Potencial de Evolução</span>
                                 <span>{selectedPlayer.potential}%</span>
                              </div>
                              <div className="h-2 bg-background rounded-full overflow-hidden">
                                 <div className="h-full bg-primary" style={{ width: `${(selectedPlayer.overall / selectedPlayer.potential) * 100}%` }}></div>
                              </div>
                           </div>
                           <div className="grid grid-cols-2 border-t border-white/5 pt-6 gap-6">
                              <div className="space-y-1">
                                 <span className="text-[10px] font-black text-secondary uppercase">Valor de Mercado</span>
                                 <p className="text-sm font-black text-emerald-400">{formatCurrency(selectedPlayer.marketValue)}</p>
                              </div>
                              <div className="space-y-1">
                                 <span className="text-[10px] font-black text-secondary uppercase">Contrato Restante</span>
                                 <p className="text-sm font-black text-white">{selectedPlayer.contractRounds} rodadas</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  )}

                  {modalTab === 'BIO' && (
                     <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        {/* Summary Header */}
                        <div className="bg-gradient-to-br from-surface to-background rounded-3xl p-6 border border-white/5 flex gap-6 items-center">
                           <div className="pl-2 border-l-2 border-white/20">
                              <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Temporada Atual</p>
                              <div className="flex items-baseline gap-1">
                                 <span className="text-2xl font-black text-white">{new Date().getFullYear()}</span>
                              </div>
                           </div>
                           <div className="flex-1 grid grid-cols-3 gap-2 text-center">
                              <div className="bg-black/20 rounded-xl p-2">
                                 <p className="text-[8px] uppercase text-secondary font-black">Jogos</p>
                                 <p className="text-lg font-black text-white">{selectedPlayer.goals > 0 || selectedPlayer.assists > 0 ? "10+" : "0"}</p> {/* Placeholder logic, waiting for improved stats tracking */}
                              </div>
                              <div className="bg-black/20 rounded-xl p-2">
                                 <p className="text-[8px] uppercase text-secondary font-black">Gols</p>
                                 <p className="text-lg font-black text-emerald-400">{selectedPlayer.goals}</p>
                              </div>
                              <div className="bg-black/20 rounded-xl p-2">
                                 <p className="text-[8px] uppercase text-secondary font-black">Assist.</p>
                                 <p className="text-lg font-black text-blue-400">{selectedPlayer.assists}</p>
                              </div>
                           </div>
                        </div>

                        {/* Timeline */}
                        <div className="relative pl-4 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-px before:bg-white/10">
                           {(!selectedPlayer.history || selectedPlayer.history.length === 0) && (
                              <div className="pl-6 py-4">
                                 <p className="text-xs text-secondary italic">Nenhum evento registrado na biografia até o momento.</p>
                              </div>
                           )}

                           {selectedPlayer.history && selectedPlayer.history.map((event, idx) => (
                              <div key={event.id || idx} className="relative pl-6">
                                 <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-surface border border-white/10 flex items-center justify-center text-[10px] z-10 shadow-lg">
                                    {event.icon || (event.type === 'GOAL' ? '⚽' : event.type === 'INJURY' ? '🤕' : event.type === 'RED_CARD' ? '🟥' : event.type === 'YELLOW_CARD' ? '🟨' : '•')}
                                 </div>
                                 <div className="space-y-1">
                                    <div className="flex justify-between items-start">
                                       <span className="text-xs font-black uppercase text-secondary tracking-widest">Rodada {event.round} • {event.season}</span>
                                    </div>
                                    <p className="text-sm font-medium leading-relaxed">{event.description}</p>
                                 </div>
                              </div>
                           ))}

                           {/* Start of Career Marker */}
                           <div className="relative pl-6 opacity-50">
                              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-surface border border-white/10 flex items-center justify-center text-[10px] z-10">
                                 👶
                              </div>
                              <div className="space-y-1">
                                 <span className="text-xs font-black uppercase text-secondary tracking-widest">Início</span>
                                 <p className="text-sm font-medium">Promovido da base para o profissional.</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  )}
               </main>

               <div className="p-6 bg-surface/80 backdrop-blur-3xl border-t border-white/5 pb-safe">
                  <button
                     onClick={() => onRenew(selectedPlayer.id)}
                     className="w-full py-4.5 bg-primary text-white font-black rounded-3xl flex items-center justify-center gap-2.5 active:scale-95 transition-all shadow-2xl shadow-primary/30 border border-white/10 uppercase tracking-widest text-[11px]"
                  >
                     <PencilLine size={16} /> RENOVAR CONTRATO
                  </button>
               </div>
            </div>
         )}
      </div>
   );
}
