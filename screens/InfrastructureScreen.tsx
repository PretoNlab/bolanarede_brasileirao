import React from 'react';
import { Infrastructure, InfrastructureType } from '../types';
import { ArrowLeft, Building2, Dumbbell, Stethoscope, Eye, ArrowUpCircle, Sparkles, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import toast from 'react-hot-toast';

interface Props {
   infrastructure: Infrastructure;
   funds: number;
   onUpgrade: (type: InfrastructureType, cost: number) => void;
   onBack: () => void;
}

const UPGRADE_COSTS = [0, 150000, 450000, 1200000]; // Lvl 0, 1, 2, 3
const MAX_LVL = 3;

export default function InfrastructureScreen({ infrastructure, funds, onUpgrade, onBack }: Props) {
   const formatMoney = (val: number) => {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
   };

   const facilities = [
      {
         id: 'ct' as InfrastructureType,
         name: 'Centro de Treinamento',
         icon: <Dumbbell size={24} />,
         color: 'text-primary',
         glow: 'shadow-primary/20',
         description: 'Otimiza o ganho de atributos e evolução tática.',
         benefits: [
            'Básico: Desenvolvimento comum.',
            'Apanhado: +15% de eficácia nos treinos.',
            'Elite: +35% bônus e evolução de talentos.'
         ]
      },
      {
         id: 'dm' as InfrastructureType,
         name: 'Departamento Médico',
         icon: <Stethoscope size={24} />,
         color: 'text-secondary',
         glow: 'shadow-secondary/20',
         description: 'Recuperação de energia e prevenção de lesões.',
         benefits: [
            'Básico: Recuperação pós-jogo lenta.',
            'Avançado: +20% taxa de recuperação.',
            'Excelência: Cura rápida e prevenção ativa.'
         ]
      },
      {
         id: 'scout' as InfrastructureType,
         name: 'Escritório de Scout',
         icon: <Eye size={24} />,
         color: 'text-amber-400',
         glow: 'shadow-amber-400/20',
         description: 'Essencial para detectar promessas mundiais.',
         benefits: [
            'Básico: Relatórios de base limitados.',
            'Avançado: Descoberta de jovens promessas.',
            'Inviolável: Revelação mensal de craques.'
         ]
      }
   ];

   const handleUpgrade = (type: InfrastructureType, currentLvl: number) => {
      if (currentLvl >= MAX_LVL) {
         toast.error("Nível máximo atingido!");
         return;
      }
      const cost = UPGRADE_COSTS[currentLvl + 1];
      if (funds < cost) {
         toast.error("Saldo insuficiente!");
         return;
      }
      onUpgrade(type, cost);
   };

   return (
      <div className="flex flex-col h-screen bg-background text-white font-sans overflow-hidden">
         <header className="p-6 flex items-center justify-between bg-background/60 backdrop-blur-2xl border-b border-white/5 pt-safe shrink-0">
            <motion.button whileTap={{ scale: 0.9 }} onClick={onBack} className="w-10 h-10 rounded-xl bg-surface-low/80 flex items-center justify-center border border-white/10">
               <ArrowLeft size={18} />
            </motion.button>
            <div className="flex flex-col items-center">
               <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-0.5 glow-text">PATRIMÔNIO DO CLUBE</h1>
               <span className="text-sm font-black uppercase tracking-tight font-display italic text-on-surface-variant">INFRAESTRUTURA</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-surface-low flex items-center justify-center border border-white/5 text-primary shadow-lg shadow-primary/5">
               <Building2 size={18} />
            </div>
         </header>

         <main className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto p-6 space-y-8 no-scrollbar pb-32">
            
            <div className="glass-vibrant rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden group shadow-2xl">
               <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
               <div className="flex items-center justify-between relative z-10">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-2">ORÇAMENTO PARA OBRAS</span>
                     <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-white font-display tabular italic">{formatMoney(funds)}</span>
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest">DISPONÍVEL</span>
                     </div>
                  </div>
                  <div className="p-4 bg-primary/20 rounded-[1.5rem] border border-primary/20 text-primary shadow-inner">
                     <Sparkles size={24} className="animate-pulse" />
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {facilities.map((fac) => {
                  const currentLvl = infrastructure[fac.id as keyof Infrastructure] || 1;
                  const nextCost = UPGRADE_COSTS[currentLvl + 1];
                  const isMax = currentLvl >= MAX_LVL;

                  return (
                     <div key={fac.id} className="glass-panel p-8 relative overflow-hidden group flex flex-col border border-white/5">
                        <div className="absolute top-6 right-8 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3">
                           <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">NÍVEL</span>
                           <span className={clsx("text-2xl font-black font-display italic tabular", fac.color)}>{currentLvl}</span>
                        </div>

                        <div className="flex items-center gap-5 mb-8">
                           <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 shrink-0 shadow-2xl", fac.color, "bg-background/40 backdrop-blur-md")}>
                              {fac.icon}
                           </div>
                           <div className="flex flex-col pr-16">
                              <h3 className="text-lg font-black font-display uppercase italic tracking-tight text-white">{fac.name}</h3>
                              <div className="flex gap-1.5 mt-2">
                                 {[1, 2, 3].map(i => (
                                    <div key={i} className={clsx(
                                       "h-1.5 w-6 rounded-full transition-all duration-500",
                                       currentLvl >= i ? `bg-primary shadow-[0_0_8px_rgba(31,177,133,0.5)]` : "bg-white/5"
                                    )} />
                                 ))}
                              </div>
                           </div>
                        </div>

                        <p className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest leading-[1.6] mb-8 min-h-[40px]">
                           {fac.description}
                        </p>

                        <div className="flex-1 space-y-3 mb-10">
                           {fac.benefits.map((b, i) => (
                              <div key={i} className={clsx(
                                 "flex items-center gap-4 p-3 rounded-xl border transition-all text-[10px] font-black uppercase tracking-wider",
                                 currentLvl >= i + 1 ? "bg-primary/10 border-primary/20 text-primary" : "bg-white/5 border-transparent text-white/20"
                              )}>
                                 <div className={clsx("w-1.5 h-1.5 rounded-full shrink-0", currentLvl >= i + 1 ? "bg-primary shadow-[0_0_5px_rgba(31,177,133,1)]" : "bg-white/10")} />
                                 {b}
                              </div>
                           ))}
                        </div>

                        <motion.button
                           whileTap={{ scale: 0.95 }}
                           disabled={isMax || funds < nextCost}
                           onClick={() => handleUpgrade(fac.id, currentLvl)}
                           className={clsx(
                              "w-full py-5 rounded-[2rem] flex flex-col items-center justify-center transition-all font-display border group",
                              isMax ? "bg-black/40 text-on-surface-variant opacity-40 border-white/5 cursor-not-allowed" :
                              funds >= nextCost 
                                ? "bg-primary text-secondary border-primary shadow-[0_0_30px_rgba(31,177,133,0.3)] hover:scale-[1.02]" 
                                : "bg-surface-low text-on-surface-variant opacity-50 border-white/10"
                           )}
                        >
                           {isMax ? (
                              <span className="text-[11px] font-black tracking-[0.3em]">NÍVEL MÁXIMO</span>
                           ) : (
                              <>
                                 <div className="flex items-center gap-3">
                                    <ArrowUpCircle size={18} className="group-hover:translate-y-[-2px] transition-transform" />
                                    <span className="text-sm font-black tracking-[0.2em]">EFETUAR UPGRADE</span>
                                 </div>
                                 <span className="text-[10px] font-bold opacity-60">INVESTIMENTO: {formatMoney(nextCost)}</span>
                              </>
                           )}
                        </motion.button>
                     </div>
                  );
               })}
            </div>
         </main>
      </div>
   );
}
