
import React from 'react';
import { Infrastructure, InfrastructureType } from '../types';
import { Header } from '../components/Header';
import { Building2, Dumbbell, Stethoscope, Eye, ArrowUpCircle, Sparkles, TrendingUp } from 'lucide-react';
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
      icon: <Dumbbell size={28} />,
      color: 'text-emerald-400',
      bgGlow: 'bg-emerald-500/10',
      description: 'Otimiza o ganho de atributos e evolução tática do elenco principal.',
      benefits: [
        'Básico: Metodologia Standard.',
        'Apanhado: +15% de eficácia nos treinos.',
        'Elite: +35% bônus e evolução de talentos.'
      ]
    },
    {
      id: 'dm' as InfrastructureType,
      name: 'Medicina Esportiva',
      icon: <Stethoscope size={28} />,
      color: 'text-blue-400',
      bgGlow: 'bg-blue-500/10',
      description: 'Gestão de carga, recuperação de energia e prevenção de lesões.',
      benefits: [
        'Básico: Recuperação Lenta.',
        'Avançado: +20% taxa de recuperação.',
        'Excelência: Cura rápida e prevenção ativa.'
      ]
    },
    {
      id: 'scout' as InfrastructureType,
      name: 'Inteligência de Mercado',
      icon: <Eye size={28} />,
      color: 'text-amber-400',
      bgGlow: 'bg-amber-500/10',
      description: 'Essencial para detectar promessas e monitorar o mercado mundial.',
      benefits: [
        'Básico: Relatórios Locais.',
        'Avançado: Descoberta de Jovens Talentos.',
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
    toast.success("Upgrade solicitado com sucesso!");
  };

  const totalLevel = Object.values(infrastructure).reduce((a, b) => (a as number) + (b as number), 0);

  return (
    <div className="flex flex-col h-screen bg-background text-white selection:bg-primary/30 overflow-hidden">
      <Header 
        title="Patrimônio do Clube"
        subtitle="Gestão de Infraestrutura"
        onBack={onBack}
        rightAction={
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/10 text-secondary">
                <Building2 size={14} className="text-primary" />
                <span className="font-black text-[10px] uppercase tracking-widest italic">Complexo Lvl {totalLevel}</span>
            </div>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-10 no-scrollbar pb-32">
        
        {/* Orçamento Header */}
        <section className="ui-card-premium p-10 relative overflow-hidden group border-white/5 bg-white/[0.02]">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 block mb-3">Orçamento para Obras</span>
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-black text-white italic tracking-tighter leading-none">{formatMoney(funds)}</span>
                <span className="text-xs font-black text-emerald-500 uppercase tracking-widest animate-pulse">Disponível</span>
              </div>
            </div>
            <div className="p-5 bg-black/40 rounded-[2rem] border border-white/5 text-primary shadow-2xl relative">
              <Sparkles size={32} className="animate-pulse" />
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((fac) => {
            const currentLvl = infrastructure[fac.id as keyof Infrastructure] || 1;
            const nextCost = UPGRADE_COSTS[currentLvl + 1];
            const isMax = currentLvl >= MAX_LVL;

            return (
              <div key={fac.id} className="ui-card-premium p-8 relative overflow-hidden group flex flex-col border-white/5 hover:bg-white/[0.06] transition-all duration-500">
                {/* Level Indicator Top Right */}
                <div className="absolute top-8 right-8 bg-zinc-900 px-4 py-2 rounded-2xl border border-white/5 flex items-center gap-3 shadow-2xl">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Nível</span>
                  <span className={clsx("text-2xl font-black italic tabular leading-none", fac.color)}>{currentLvl}</span>
                </div>

                <div className="flex items-center gap-6 mb-10">
                  <div className={clsx("w-20 h-20 rounded-[2rem] flex items-center justify-center border transition-all duration-500 group-hover:scale-110 shrink-0 shadow-2xl bg-zinc-900", fac.color, "border-white/10")}>
                    {fac.icon}
                  </div>
                  <div className="flex flex-col pr-12">
                    <h3 className="text-xl font-black italic tracking-tighter text-white uppercase mb-3 leading-none">{fac.name}</h3>
                    <div className="flex gap-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className={clsx(
                          "h-1.5 w-10 rounded-full transition-all duration-700",
                          currentLvl >= i ? `bg-primary shadow-[0_0_12px_rgba(31,177,133,0.6)]` : "bg-white/5"
                        )} />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-[11px] font-black text-white/30 leading-relaxed uppercase tracking-[0.15em] mb-10 min-h-[44px]">
                  {fac.description}
                </p>

                <div className="flex-1 space-y-3 mb-10">
                  {fac.benefits.map((b, i) => (
                    <div key={i} className={clsx(
                      "flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-[10px] font-black uppercase tracking-widest leading-none",
                      currentLvl >= i + 1 
                        ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400" 
                        : "bg-white/[0.02] border-transparent text-white/10"
                    )}>
                      <div className={clsx("w-2 h-2 rounded-full shrink-0", currentLvl >= i + 1 ? "bg-emerald-500 shadow-[0_0_8px_rgba(31,177,133,1)]" : "bg-white/5")} />
                      <span className="flex-1 leading-snug">{b}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  disabled={isMax || funds < nextCost}
                  onClick={() => handleUpgrade(fac.id, currentLvl)}
                  className={clsx(
                    "w-full py-7 rounded-[2.5rem] flex flex-col items-center justify-center transition-all border-2 relative overflow-hidden group shadow-2xl",
                    isMax ? "bg-zinc-900 text-white/10 border-white/5 cursor-not-allowed" :
                    funds >= nextCost 
                      ? "bg-primary border-primary text-white hover:scale-[1.02]" 
                      : "bg-white/5 text-white/20 border-white/10 opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  
                  {isMax ? (
                    <span className="text-[12px] font-black tracking-[0.4em] italic relative z-10">CAPACIDADE MÁXIMA</span>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-1 relative z-10">
                        <ArrowUpCircle size={20} className="group-hover:translate-y-[-2px] transition-transform duration-500" />
                        <span className="text-[13px] font-black tracking-[0.25em] italic">EFETUAR UPGRADE</span>
                      </div>
                      <span className={clsx("text-[9px] font-black tracking-widest relative z-10", funds >= nextCost ? "text-white/60" : "text-rose-400")}>
                        {formatMoney(nextCost)} • EXIGIDO
                      </span>
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
