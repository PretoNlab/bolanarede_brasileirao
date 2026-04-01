import React, { useState, useMemo } from 'react';
import { StaffMember, StaffType } from '../types';
import { 
  ArrowLeft, UserPlus, UserMinus, Shield, Activity, 
  Search, Star, Info, TrendingUp, Users, Wallet,
  Zap, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import toast from 'react-hot-toast';

interface Props {
  hiredStaff: StaffMember[];
  staffMarket: StaffMember[];
  funds: number;
  onHire: (staff: StaffMember) => void;
  onFire: (staffId: string) => void;
  onBack: () => void;
}

const formatMoney = (val: number) => `R$ ${(val / 1000).toFixed(0)}k`;

const StaffIcon = ({ type, level, size = 20 }: { type: StaffType, level: string, size?: number }) => {
  const color = level === 'GOLD' ? 'text-secondary' : level === 'SILVER' ? 'text-primary' : 'text-on-surface-variant';
  switch (type) {
    case 'COACH': return <TrendingUp size={size} className={color} />;
    case 'PHYSIO': return <Activity size={size} className={color} />;
    case 'SCOUT': return <Search size={size} className={color} />;
  }
};

export default function StaffScreen({ hiredStaff, staffMarket, funds, onHire, onFire, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<'MANAGEMENT' | 'MARKET'>('MANAGEMENT');

  const getStaffTypeLabel = (type: StaffType) => {
    switch (type) {
      case 'COACH': return 'Auxiliar Técnico';
      case 'PHYSIO': return 'Fisioterapeuta';
      case 'SCOUT': return 'Olheiro';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-white font-sans overflow-hidden">
      {/* Header */}
      <header className="p-6 flex flex-col gap-6 bg-background/60 backdrop-blur-2xl border-b border-white/5 pt-safe shrink-0">
        <div className="flex items-center justify-between">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onBack} className="w-10 h-10 rounded-xl bg-surface-low/80 flex items-center justify-center border border-white/10">
            <ArrowLeft size={18} />
          </motion.button>
          <div className="flex flex-col items-center">
            <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-0.5 glow-text">DEPARTAMENTO TÉCNICO</h1>
            <span className="text-sm font-black uppercase tracking-tight font-display italic text-on-surface-variant">GESTÃO PROFISSIONAL</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-low/80 flex items-center justify-center border border-white/10 text-primary">
            <Users size={18} />
          </div>
        </div>

        <div className="flex gap-2 p-1.5 bg-surface-low/50 rounded-2xl border border-white/5">
          {[
            { id: 'MANAGEMENT', label: 'Minha Equipe', icon: Users },
            { id: 'MARKET', label: 'Contratações', icon: Search }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                "flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all font-display",
                activeTab === tab.id ? "bg-primary text-secondary shadow-lg shadow-primary/20" : "text-on-surface-variant hover:text-white"
              )}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-8 space-y-8 no-scrollbar pb-32">
        {/* Funds Summary */}
        <div className="glass-vibrant rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden group shadow-2xl">
           <div className="flex items-center justify-between relative z-10">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-2">ORÇAMENTO DISPONÍVEL</span>
                 <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white font-display tabular italic">{formatMoney(funds)}</span>
                 </div>
              </div>
              <div className="p-4 bg-primary/20 rounded-[1.5rem] border border-primary/20 text-primary shadow-inner">
                 <Wallet size={24} className="animate-pulse" />
              </div>
           </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'MANAGEMENT' && (
            <motion.div 
              key="mgmt"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">ESTRUTURA DE COMISSÃO</h3>
                   <span className="text-[9px] font-black text-primary font-display uppercase tracking-widest italic">{hiredStaff.length}/3 CONTRATADOS</span>
                </div>
                
                <div className="space-y-5">
                  {['COACH', 'PHYSIO', 'SCOUT'].map((type) => {
                    const member = hiredStaff.find(s => s.type === type);
                    return (
                      <div key={type} className="glass-panel rounded-[2rem] p-6 border border-white/5 relative overflow-hidden group">
                        {member ? (
                          <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-start">
                              <div className="flex gap-5">
                                <div className={clsx(
                                  "w-16 h-16 rounded-2xl flex items-center justify-center border shadow-2xl",
                                  member.level === 'GOLD' ? 'bg-secondary/10 border-secondary/20' : 'bg-primary/10 border-primary/20'
                                )}>
                                  <StaffIcon type={member.type} level={member.level} size={32} />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className={clsx("text-[8px] font-black uppercase px-2 py-0.5 rounded-full", member.level === 'GOLD' ? 'bg-secondary text-background' : 'bg-primary text-secondary')}>
                                      {member.level}
                                    </span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{getStaffTypeLabel(member.type)}</span>
                                  </div>
                                  <h4 className="text-2xl font-black font-display uppercase tracking-tighter italic text-white leading-tight">{member.name}</h4>
                                </div>
                              </div>
                              <motion.button 
                                 whileTap={{ scale: 0.9 }}
                                 onClick={() => onFire(member.id)}
                                 className="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center border border-tertiary/20 hover:bg-tertiary hover:text-white transition-all"
                               >
                                 <UserMinus size={18} />
                               </motion.button>
                            </div>
                            
                            <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-3">
                               <div className="flex items-start gap-3">
                                  <Info size={14} className="text-primary mt-0.5 shrink-0" />
                                  <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-wider leading-relaxed">{member.description}</p>
                               </div>
                               <div className="h-[1px] bg-white/5 w-full" />
                               <div className="flex justify-between items-center px-1">
                                  <span className="text-[9px] font-black text-on-surface-variant/40 uppercase">Salário Semanal</span>
                                  <span className="text-sm font-black text-primary font-display italic tabular">{formatMoney(member.salary)}</span>
                               </div>
                            </div>
                          </div>
                        ) : (
                          <div className="py-12 flex flex-col items-center justify-center gap-4 group cursor-pointer" onClick={() => setActiveTab('MARKET')}>
                            <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-white/5 transition-colors group-hover:border-primary/40 group-hover:text-primary/20">
                               <UserPlus size={28} />
                            </div>
                            <div className="text-center space-y-1">
                               <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em] italic">{getStaffTypeLabel(type as StaffType)} AUSENTE</p>
                               <span className="text-[9px] font-black text-primary uppercase tracking-[0.1em] underline underline-offset-4 decoration-primary/30">ABRIR PROCESSO SELETIVO</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'MARKET' && (
            <motion.div 
              key="market"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">TALENTOS NO MERCADO</h3>
                   <span className="text-[9px] font-black text-secondary font-display uppercase tracking-widest italic">{staffMarket.length} DISPONÍVEIS</span>
                </div>

                <div className="space-y-4">
                  {staffMarket.map((candidate) => (
                    <div 
                      key={candidate.id} 
                      className="glass-panel p-6 rounded-[2rem] border border-white/5 flex flex-col gap-6 relative group overflow-hidden"
                    >
                      {/* Glossy Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="flex justify-between items-center relative z-10">
                        <div className="flex items-center gap-5">
                          <div className={clsx(
                            "w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xl bg-background/40 backdrop-blur-md transition-transform group-hover:scale-105",
                            candidate.level === 'GOLD' ? 'text-secondary border-secondary/20' : 'text-primary border-primary/20'
                          )}>
                            <StaffIcon type={candidate.type} level={candidate.level} size={28} />
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                               <span className={clsx("text-[8px] font-black uppercase px-2 py-0.5 rounded-full", candidate.level === 'GOLD' ? 'bg-secondary text-background' : 'bg-primary text-secondary')}>
                                 {candidate.level}
                               </span>
                               <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{getStaffTypeLabel(candidate.type)}</span>
                            </div>
                            <h4 className="text-xl font-black font-display uppercase tracking-tighter italic text-white mt-1">{candidate.name}</h4>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end">
                           <span className="text-[10px] font-black text-primary font-display italic">+{ (candidate.bonus * 100).toFixed(0) }% EFICÁCIA</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
                         <div className="flex flex-col">
                            <span className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest">Pedido Salarial</span>
                            <span className="text-lg font-black text-white font-display tabular italic">{formatMoney(candidate.salary)}</span>
                         </div>
                         <motion.button 
                           whileTap={{ scale: 0.95 }}
                           onClick={() => onHire(candidate)}
                           disabled={funds < candidate.salary}
                           className={clsx(
                             "px-6 py-3 rounded-xl flex items-center gap-3 transition-all font-display text-[10px] font-black uppercase tracking-widest",
                             funds < candidate.salary 
                               ? "bg-surface-low text-on-surface-variant/30 border border-white/5 opacity-50 cursor-not-allowed" 
                               : "bg-primary text-secondary border border-primary shadow-lg shadow-primary/20 hover:scale-102"
                           )}
                         >
                           <UserPlus size={16} />
                           Contratar
                         </motion.button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Warning Footer */}
      <div className="p-6 pb-12 bg-background/80 backdrop-blur-3xl shrink-0">
         <div className="p-5 rounded-[2rem] border border-primary/20 bg-primary/5 flex items-start gap-4">
           <Zap size={20} className="text-primary mt-0.5 shrink-0 drop-shadow-[0_0_8px_rgba(31,177,133,0.5)]" />
           <p className="text-[10px] leading-relaxed text-on-surface-variant font-black uppercase tracking-wider">
             PROFISSIONAIS <span className="text-primary">GOLD</span> GARANTEM RESULTADOS IMEDIATOS, MAS O CUSTO DE MANUTENÇÃO SEMANAL PODE COMPROMETER A SAÚDE FINANCEIRA DO CLUBE EM LONGO PRAZO.
           </p>
         </div>
      </div>
    </div>
  );
}
