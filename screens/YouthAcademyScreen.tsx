
import React, { useState } from 'react';
import { Player, Team, Infrastructure } from '../types';
import { TeamLogo } from '../components/TeamLogo';
import { Header } from '../components/Header';
import { Star, UserPlus, Info, TrendingUp, Trophy, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
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
  'GOL': 'text-amber-400 bg-amber-400/10 border-amber-400/20 shadow-amber-400/10',
  'ZAG': 'text-blue-400 bg-blue-400/10 border-blue-400/20 shadow-blue-400/10',
  'LAT': 'text-blue-400 bg-blue-400/10 border-blue-400/20 shadow-blue-400/10',
  'VOL': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10',
  'MEI': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20 shadow-emerald-400/10',
  'ATA': 'text-rose-400 bg-rose-400/10 border-rose-400/20 shadow-rose-400/10',
};

export default function YouthAcademyScreen({ userTeam, roster, funds, infrastructure, onPromote, onBack }: Props) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  const scoutLvl = infrastructure.scout || 1;

  return (
    <div className="flex flex-col h-screen bg-background text-white selection:bg-primary/30 overflow-hidden">
      <Header 
        title="Categorias de Base"
        subtitle="Centro de Formação de Talentos"
        onBack={onBack}
        rightAction={
            <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
                <ShieldCheck size={14} />
                <span className="font-black text-[10px] uppercase tracking-widest italic">{userTeam.name} Sub-20</span>
            </div>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-10 no-scrollbar pb-32">
        
        {/* Advanced Academy Status Card */}
        <section className="ui-card-premium p-10 relative overflow-hidden group shadow-2xl border-white/5 bg-white/[0.01]">
          <div className="absolute -right-20 -top-20 opacity-[0.05] group-hover:opacity-[0.1] transition-all duration-1000">
            <Trophy size={280} className="rotate-[-12deg] group-hover:rotate-0 transition-transform" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-start">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 block mb-3">Banco de Talentos</span>
            <div className="flex items-center gap-5">
              <span className="text-7xl font-black text-white italic tracking-tighter leading-none">{roster.length}</span>
              <div className="flex flex-col">
                <span className="text-lg font-black text-emerald-500 uppercase italic tracking-widest leading-none mb-1">Revelações</span>
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Monitoramento Ativo</span>
              </div>
            </div>
            
            <div className="mt-10 flex items-center gap-4">
              <div className="flex items-center gap-3 bg-zinc-900 px-5 py-2.5 rounded-2xl border border-white/5 shadow-2xl">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(31,177,133,1)]" />
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest leading-none pt-0.5">Infraestrutura Lvl {infrastructure.ct}</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2.5 rounded-2xl border border-emerald-500/20">
                <Sparkles size={12} className="text-emerald-400" />
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest italic pt-0.5">Olheiro: {scoutLvl === 3 ? 'Elite' : scoutLvl === 2 ? 'Avançado' : 'Básico'}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(31,177,133,0.5)]" />
            <h3 className="text-sm font-black uppercase tracking-[0.25em] text-white/90 italic">Elenco Sub-20</h3>
          </div>

          {roster.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center text-white/10 gap-6 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
              <div className="w-24 h-24 rounded-full border-2 border-white/5 flex items-center justify-center mb-2">
                 <UserPlus size={48} strokeWidth={1} className="opacity-20 animate-pulse" />
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-center max-w-[280px] leading-relaxed opacity-30">Nenhum talento detectado pelo scout nesta rodada.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {roster.map((player) => (
                <motion.div
                  key={player.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPlayer(player)}
                  className="ui-card-premium p-8 flex items-center justify-between group cursor-pointer transition-all duration-500 hover:bg-white/[0.06] border-white/5 relative overflow-hidden"
                >
                  <div className="flex items-center gap-6 relative z-10">
                    <div className={clsx(
                      "w-16 h-16 rounded-[1.75rem] flex items-center justify-center font-black text-sm border-2 shadow-2xl transition-all duration-500 group-hover:scale-110 italic bg-zinc-900",
                      POS_COLORS[player.position as keyof typeof POS_COLORS] || "bg-white/5 text-white/40 border-white/10"
                    )}>
                      {player.position}
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2 group-hover:text-emerald-400 transition-colors">{player.name}</h4>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                            <span className="text-[10px] font-black text-emerald-400 italic">OVR {player.overall}</span>
                        </div>
                        <span className="text-[10px] font-black text-white/20 tracking-wider uppercase">{player.age} anos</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-zinc-900 p-4 rounded-2xl border border-white/5 text-white/20 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 relative z-10 shadow-2xl">
                    <UserPlus size={20} />
                  </div>
                  
                  {/* Background Accents */}
                  <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-700">
                    <TrendingUp size={120} />
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedPlayer(null)} 
              className="absolute inset-0" 
            />
            
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              className="w-full max-w-xl ui-card-premium border-white/10 p-12 relative z-10 shadow-[0_60px_120px_rgba(0,0,0,1)] overflow-hidden"
            >
              <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
              
              <div className="flex flex-col items-center text-center gap-10 relative z-10">
                <div className={clsx(
                  "w-28 h-28 rounded-[2.5rem] flex items-center justify-center text-4xl font-black border-2 shadow-2xl relative italic bg-zinc-900",
                  POS_COLORS[selectedPlayer.position as keyof typeof POS_COLORS]
                )}>
                  {selectedPlayer.position}
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-emerald-500 rounded-2xl border-4 border-zinc-900 flex items-center justify-center text-white shadow-2xl rotate-12">
                    <Star size={20} fill="currentColor" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none pt-2">{selectedPlayer.name}</h3>
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20">{selectedPlayer.position}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20">{selectedPlayer.age} ANOS</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 w-full">
                  <div className="rounded-[2.5rem] border border-white/5 bg-zinc-900 p-8 flex flex-col items-center shadow-inner group-hover:bg-white/[0.04] transition-all">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3">Overal Atual</span>
                    <span className="text-6xl font-black text-emerald-500 italic tracking-tighter leading-none">{selectedPlayer.overall}</span>
                  </div>
                  <div className="rounded-[2.5rem] border border-white/5 bg-zinc-900 p-8 flex flex-col items-center shadow-inner group-hover:bg-white/[0.04] transition-all">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3">Potencial Máx.</span>
                    <span className="text-6xl font-black text-white/40 italic tracking-tighter leading-none">{selectedPlayer.potential}</span>
                  </div>
                </div>

                <div className="w-full space-y-8 pt-10 border-t border-white/5">
                  <div className="p-6 bg-emerald-500/5 rounded-[2rem] border border-emerald-500/10 flex items-start gap-5 text-left shadow-2xl">
                    <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-500">
                        <Info size={24} />
                    </div>
                    <p className="text-[11px] text-white/40 font-black leading-relaxed uppercase tracking-[0.2em]">
                      Ao promover <span className="text-white">{selectedPlayer.name}</span>, ele assinará um contrato profissional de <span className="text-emerald-500">10 rodadas</span> com bônus de performance integrado.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        onPromote(selectedPlayer);
                        setSelectedPlayer(null);
                        toast.success(`${selectedPlayer.name} promovido ao profissional!`);
                      }}
                      className="w-full py-8 bg-emerald-500 text-white rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[12px] shadow-[0_20px_40px_rgba(31,177,133,0.3)] relative overflow-hidden group/btn"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                      <span className="relative z-10 flex items-center justify-center gap-4 italic">
                        Promover Profissional <ArrowRight size={18} />
                      </span>
                    </motion.button>
                    
                    <button
                      onClick={() => setSelectedPlayer(null)}
                      className="w-full py-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[10px] text-white/20 hover:text-white/60 hover:bg-white/[0.05] transition-all duration-500"
                    >
                      Manter na Base
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
