
import React, { useState } from 'react';
import { StaffMember, StaffType } from '../types';
import { 
  UserPlus, UserMinus, Search, Star, Info, TrendingUp, Users, Wallet,
  Activity, Zap, ArrowRight, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header';
import clsx from 'clsx';

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
  const color = level === 'GOLD' ? 'text-amber-400' : level === 'SILVER' ? 'text-primary' : 'text-secondary';
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
      case 'COACH': return 'Performance & Tática';
      case 'PHYSIO': return 'Saúde & Recuperação';
      case 'SCOUT': return 'Análise & Mercado';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-white selection:bg-primary/30 overflow-hidden">
      <Header 
        title="Departamento Técnico"
        subtitle="Gestão de Staff Profissional"
        onBack={onBack}
        rightAction={
            <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
                <Users size={14} />
                <span className="font-black text-[10px] uppercase tracking-widest">{hiredStaff.length}/3 Ativos</span>
            </div>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-40">
        
        {/* Advanced Navigation Tabs */}
        <div className="flex p-1.5 bg-zinc-900 border border-white/5 rounded-[2rem] shadow-2xl backdrop-blur-3xl sticky top-0 z-20">
          {[
            { id: 'MANAGEMENT', label: 'Minha Equipe', icon: ShieldCheck },
            { id: 'MARKET', label: 'Recrutamento', icon: Search }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                "flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.75rem] text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-500 relative overflow-hidden",
                activeTab === tab.id 
                  ? "bg-primary text-white shadow-[0_0_30px_rgba(31,177,133,0.3)] scale-[1.02]" 
                  : "text-white/30 hover:text-white/60"
              )}
            >
              <tab.icon size={16} /> 
              <span className="relative z-10">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              )}
            </button>
          ))}
        </div>

        {/* Financial Context */}
        <section className="ui-card-premium p-10 relative overflow-hidden group border-emerald-500/10 bg-emerald-500/[0.02]">
           <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />
           <div className="flex items-center justify-between relative z-10">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 block mb-3">Saldo p/ Investimentos</span>
                 <div className="flex items-baseline gap-4">
                    <span className="text-5xl font-black text-white italic tracking-tighter leading-none">R$ {(funds / 1000).toFixed(0)}k</span>
                    <span className="text-xs font-black text-emerald-500 uppercase tracking-widest animate-pulse">Fluxo Livre</span>
                 </div>
              </div>
              <div className="p-5 bg-black/40 rounded-[2rem] border border-white/5 text-emerald-500 shadow-2xl">
                 <Wallet size={32} />
              </div>
           </div>
        </section>

        <AnimatePresence mode="wait">
          {activeTab === 'MANAGEMENT' && (
            <motion.div 
              key="mgmt"
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="space-y-8"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(31,177,133,0.5)]" />
                    <h3 className="text-sm font-black uppercase tracking-[0.25em] text-white/90">Corpo Técnico</h3>
                </div>
                
                <div className="space-y-6">
                  {['COACH', 'PHYSIO', 'SCOUT'].map((type) => {
                    const member = hiredStaff.find(s => s.type === type);
                    return (
                      <div key={type} className="ui-card-premium p-8 relative overflow-hidden group transition-all duration-500 border-white/5 hover:bg-white/[0.06]">
                        {member ? (
                          <div className="flex flex-col gap-8">
                            <div className="flex justify-between items-start">
                              <div className="flex gap-6">
                                <div className={clsx(
                                  "w-20 h-20 rounded-[2rem] flex items-center justify-center border shadow-2xl transition-all duration-500 group-hover:scale-110",
                                  member.level === 'GOLD' ? 'bg-amber-400/10 border-amber-400/20 shadow-amber-400/10' : 'bg-primary/10 border-primary/20 shadow-emerald-500/10'
                                )}>
                                  <StaffIcon type={member.type} level={member.level} size={36} />
                                </div>
                                <div className="flex flex-col pt-2">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className={clsx(
                                        "text-[9px] font-black uppercase px-3 py-1 rounded-lg border", 
                                        member.level === 'GOLD' ? 'bg-amber-400 text-black border-amber-500' : 'bg-primary text-white border-emerald-400 shadow-lg shadow-emerald-500/20'
                                    )}>
                                      Nível {member.level}
                                    </span>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{getStaffTypeLabel(member.type)}</span>
                                  </div>
                                  <h4 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">{member.name}</h4>
                                </div>
                              </div>
                              <motion.button 
                                 whileTap={{ scale: 0.9 }}
                                 onClick={() => onFire(member.id)}
                                 className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all shadow-2xl"
                               >
                                 <UserMinus size={22} />
                               </motion.button>
                            </div>
                            
                            <div className="p-6 bg-zinc-900 rounded-[2rem] border border-white/5 flex flex-col gap-6 shadow-inner relative overflow-hidden">
                               <div className="flex items-start gap-4 relative z-10">
                                  <Info size={18} className="text-primary mt-1 shrink-0 opacity-60" />
                                  <p className="text-[11px] text-white/50 font-black uppercase tracking-widest leading-relaxed">{member.description}</p>
                               </div>
                               <div className="h-[1px] bg-white/5 w-full" />
                               <div className="flex justify-between items-end px-1 relative z-10">
                                  <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Custo Semanal</p>
                                    <span className="text-xl font-black text-white italic tracking-tighter leading-none">{formatMoney(member.salary)}</span>
                                  </div>
                                  <div className="text-right">
                                     <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400/40 mb-1">Impacto Ativo</p>
                                     <span className="text-lg font-black text-emerald-400 italic leading-none">+{ (member.bonus * 100).toFixed(0) }%</span>
                                  </div>
                               </div>
                               <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                            </div>
                          </div>
                        ) : (
                          <button 
                            className="py-16 w-full flex flex-col items-center justify-center gap-6 group cursor-pointer border-2 border-dashed border-white/5 rounded-[2.5rem] hover:bg-white/[0.03] transition-all duration-500" 
                            onClick={() => setActiveTab('MARKET')}
                          >
                            <div className="w-20 h-20 rounded-full border-2 border-white/5 flex items-center justify-center text-white/10 transition-all duration-700 group-hover:border-primary/40 group-hover:text-primary group-hover:bg-primary/5 group-hover:scale-110 shadow-inner group-hover:shadow-primary/20">
                               <UserPlus size={40} strokeWidth={1} />
                            </div>
                            <div className="text-center">
                               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">{getStaffTypeLabel(type as StaffType)}</p>
                               <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.25em] group-hover:tracking-[0.4em] transition-all">Contratar Profissional <ArrowRight size={14} className="inline ml-2" /></span>
                            </div>
                          </button>
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
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="space-y-8"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-1.5 h-6 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                    <h3 className="text-sm font-black uppercase tracking-[0.25em] text-white/90">Painel de Recrutamento</h3>
                </div>

                <div className="space-y-6">
                  {staffMarket.map((candidate) => (
                    <div 
                      key={candidate.id} 
                      className="ui-card-premium p-8 flex flex-col gap-8 relative group overflow-hidden hover:bg-white/[0.08] transition-all duration-500 border-white/5"
                    >
                      <div className="flex justify-between items-center relative z-10">
                        <div className="flex items-center gap-6">
                          <div className={clsx(
                            "w-16 h-16 rounded-[1.75rem] flex items-center justify-center border-2 shadow-2xl bg-zinc-900 transition-all duration-500 group-hover:scale-110",
                            candidate.level === 'GOLD' ? 'text-amber-400 border-amber-400/20' : 'text-primary border-primary/20'
                          )}>
                            <StaffIcon type={candidate.type} level={candidate.level} size={32} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                               <span className={clsx(
                                   "text-[8px] font-black uppercase px-2 py-0.5 rounded-md border", 
                                   candidate.level === 'GOLD' ? 'bg-amber-400 text-black border-amber-500' : 'bg-primary text-white border-emerald-400'
                               )}>
                                 {candidate.level}
                               </span>
                               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{getStaffTypeLabel(candidate.type)}</span>
                            </div>
                            <h4 className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">{candidate.name}</h4>
                          </div>
                        </div>
                        
                        <div className="text-right bg-emerald-500/5 px-4 py-2 rounded-2xl border border-emerald-500/10">
                           <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Impacto Estimado</p>
                           <span className="text-lg font-black text-emerald-400 italic">+{ (candidate.bonus * 100).toFixed(0) }%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-8 border-t border-white/5 relative z-10">
                         <div className="flex flex-col">
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">Exigência Salarial</p>
                            <p className="text-2xl font-black text-white italic tracking-tighter leading-none">{formatMoney(candidate.salary)}<span className="text-sm opacity-20">/sem</span></p>
                         </div>
                         <motion.button 
                           whileTap={{ scale: 0.95 }}
                           onClick={() => onHire(candidate)}
                           disabled={funds < candidate.salary}
                           className={clsx(
                             "px-10 py-5 rounded-[2rem] flex items-center gap-3 transition-all duration-500 text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl relative overflow-hidden group",
                             funds < candidate.salary 
                               ? "bg-zinc-900 text-white/10 border-white/5 cursor-not-allowed" 
                               : "bg-primary text-white border-primary-light hover:scale-[1.05] shadow-primary/30"
                           )}
                         >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <span className="relative z-10">Contratar</span>
                         </motion.button>
                      </div>
                      
                      {/* Decorative Background Element */}
                      <div className="absolute -right-12 -bottom-12 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-1000">
                         {candidate.type === 'COACH' ? <TrendingUp size={160} /> : candidate.type === 'PHYSIO' ? <Activity size={160} /> : <Search size={160} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Corporate Warning Section */}
      <footer className="fixed bottom-0 left-0 w-full p-6 pb-12 bg-gradient-to-t from-background via-background/90 to-transparent z-40 pointer-events-none">
         <div className="p-6 rounded-[2.5rem] border border-emerald-500/10 bg-zinc-900/80 backdrop-blur-3xl flex items-start gap-5 shadow-2xl pointer-events-auto">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
                <Zap size={24} className="animate-pulse" />
            </div>
            <p className="text-[11px] leading-relaxed text-white/40 font-black uppercase tracking-widest">
              A contratação de profissionais <span className="text-emerald-400">Nível GOLD</span> garante bônus de elite, mas eleva drasticamente o custo fixo semanal. Recomenda-se possuir saldo em caixa para pelo menos <span className="text-white">4 rodadas</span>.
            </p>
         </div>
      </footer>
    </div>
  );
}
