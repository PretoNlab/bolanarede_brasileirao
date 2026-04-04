import React from 'react';
import { Team } from '../types';
import { Header } from '../components/Header';
import {
  ArrowUpCircle,
  Building,
  Home,
  ShieldAlert,
  TrendingUp,
  Users,
  Wallet,
  DollarSign
} from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { hapticSelection, impactHeavy } from '../haptics';

interface Props {
  team: Team;
  funds: number;
  ticketPrice: number;
  onUpdateTicketPrice: (price: number) => void;
  onBack: () => void;
  onLoan: (amount: number) => void;
  onExpandStadium: (cost: number, gain: number) => void;
}

export default function FinanceScreen({
  team,
  funds,
  ticketPrice,
  onUpdateTicketPrice,
  onBack,
  onLoan,
  onExpandStadium
}: Props) {
  const formatMoney = (val: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);

  const stadiumUpgradeCost = team.stadiumCapacity * 20;
  const stadiumUpgradeGain = 5000;
  const projectedDemand = Math.max(20, Math.min(95, Math.round((0.25 + (team.moral / 200) - (ticketPrice - 45) / 250) * 100)));
  const projectedMatchRevenue = Math.round(team.stadiumCapacity * (projectedDemand / 100) * ticketPrice);
  const expansionAffordable = funds >= stadiumUpgradeCost;

  const financePulse = funds < 0
    ? {
        title: 'Caixa em Alerta',
        copy: 'O clube precisa proteger liquidez agora. Evite custo estrutural e use ingresso ou empréstimo para atravessar a pressão.',
        tone: 'red'
      }
    : funds < 500000
      ? {
          title: 'Margem Curta',
          copy: 'Existe espaço para gerir o curto prazo, mas qualquer investimento precisa de retorno rápido.',
          tone: 'amber'
        }
      : {
          title: 'Saúde Financeira',
          copy: 'O clube tem caixa para ajustar preço, pensar em estádio e absorver alguma turbulência de mercado.',
          tone: 'green'
        };

  const ticketStrategy = ticketPrice <= 35
    ? 'Preço popular. A chance de casa cheia sobe, mas a arrecadação por assento cai.'
    : ticketPrice <= 70
      ? 'Faixa equilibrada. Mistura boa entre ocupação e receita por partida.'
      : 'Preço agressivo. Você arrecada mais por assento, mas aumenta o risco de queda de público.';

  const expansionStrategy = expansionAffordable
    ? `Ampliação viável: custa ${formatMoney(stadiumUpgradeCost)} e adiciona ${stadiumUpgradeGain.toLocaleString()} lugares.`
    : `Ampliação indisponível no momento: faltam ${formatMoney(stadiumUpgradeCost - funds)} para executar a obra.`;

  return (
    <div className="flex h-screen flex-col bg-background font-sans text-white overflow-hidden">
      <Header 
        title="Controle do Clube"
        subtitle="Finanças"
        onBack={onBack}
        variant="default"
        rightAction={<div className="px-3 py-1.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 font-black text-xs tabular-nums">{formatMoney(funds)}</div>}
      />

      <main className="flex-1 space-y-8 overflow-y-auto p-6 pb-28 no-scrollbar">
        {/* Finance Pulse Card */}
        <section className="ui-card-premium p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 blur-[100px] rounded-full group-hover:bg-primary/10 transition-colors duration-1000" />
          
          <div className="relative z-10 flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <div className={clsx(
                  "w-2 h-2 rounded-full animate-pulse",
                  financePulse.tone === 'green' && 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
                  financePulse.tone === 'amber' && 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
                  financePulse.tone === 'red' && 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                )} />
                <p className="ui-label-caps opacity-60">Status do Caixa</p>
              </div>
              <h2 className="text-3xl font-black tracking-tighter text-white leading-none mb-3 italic uppercase">{financePulse.title}</h2>
              <p className="text-[13px] leading-relaxed text-secondary font-medium max-w-md">{financePulse.copy}</p>
            </div>
            <div
              className={clsx(
                'shrink-0 rounded-2xl px-5 py-4 text-[10px] font-black uppercase tracking-[0.2em] border backdrop-blur-xl shadow-2xl transition-all duration-500',
                financePulse.tone === 'green' && 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10',
                financePulse.tone === 'amber' && 'bg-amber-500/10 text-amber-300 border-amber-500/20 shadow-amber-500/10',
                financePulse.tone === 'red' && 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/10'
              )}
            >
              {funds >= 0 ? 'Operação Ativa' : 'Correção Urgente'}
            </div>
          </div>

          <div className="relative z-10 mt-10 grid grid-cols-3 gap-4">
            {[
              { label: 'Saldo Atual', value: formatMoney(funds), icon: <Wallet size={12} />, trend: funds >= 0 ? 'up' : 'down' },
              { label: 'Ocupação Proj.', value: `${projectedDemand}%`, icon: <Users size={12} />, trend: projectedDemand > 70 ? 'up' : 'down' },
              { label: 'Receita Proj.', value: formatMoney(projectedMatchRevenue), icon: <TrendingUp size={12} />, trend: 'up' }
            ].map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/5 bg-black/40 p-5 hover:bg-black/60 transition-colors group/stat">
                <div className="flex items-center gap-2 mb-2 opacity-40 group-hover/stat:opacity-80 transition-opacity">
                  <span className="text-primary">{stat.icon}</span>
                  <p className="ui-label-caps text-[8px]">{stat.label}</p>
                </div>
                <p className={clsx(
                  "text-xl font-black tracking-tighter tabular-nums",
                  stat.label === 'Saldo Atual' && funds < 0 ? 'text-rose-400' : 'text-white'
                )}>{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Ticket Management */}
        <section className="ui-card-premium p-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 rounded-[1.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Users size={24} />
            </div>
            <div>
              <p className="ui-label-caps text-primary text-[10px] mb-1">Bilheteria</p>
              <h3 className="text-2xl font-black tracking-tighter text-white uppercase italic">Preço do Ingresso</h3>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white/5 bg-black/40 p-8 mb-6 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary opacity-50 mb-3">Valor por Assento</p>
                <div className="flex items-end gap-2">
                   <motion.p 
                     key={ticketPrice}
                     initial={{ scale: 1.1, textShadow: '0 0 20px rgba(var(--primary-rgb),0.5)' }}
                     animate={{ scale: 1, textShadow: '0 0 0px rgba(var(--primary-rgb),0)' }}
                     className="text-5xl font-black text-white italic tracking-tighter tabular-nums leading-none"
                   >
                     {formatMoney(ticketPrice)}
                   </motion.p>
                   <span className="text-[10px] font-black uppercase text-secondary opacity-30 mb-1 tracking-widest italic">/ jogo</span>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-right">
                <p className="text-[9px] font-black text-secondary uppercase tracking-[0.2em] mb-1 opacity-50">Moral do Clube</p>
                <p className="text-xl font-black text-white tabular-nums tracking-tighter italic">{team.moral}</p>
              </div>
            </div>

            <div className="relative h-12 flex items-center mb-8">
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={ticketPrice}
                onChange={(event) => {
                  const val = parseInt(event.target.value);
                  if (val !== ticketPrice) hapticSelection();
                  onUpdateTicketPrice(val);
                }}
                className="w-full h-2 rounded-full bg-white/10 appearance-none accent-primary cursor-pointer z-10"
              />
            </div>

            <div className="flex justify-between items-center text-[9px] font-black uppercase text-white/20 tracking-[0.3em] italic">
               <span className={clsx("transition-colors", ticketPrice < 40 && "text-emerald-500/50")}>Popular</span>
               <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  <span>Equilibrado</span>
                  <div className="w-1 h-1 rounded-full bg-white/20" />
               </div>
               <span className={clsx("transition-colors", ticketPrice > 120 && "text-rose-500/50")}>Premium</span>
            </div>
          </div>

          <div className="rounded-3xl bg-white/5 border border-white/5 p-6 border-l-primary border-l-4">
            <div className="flex gap-4 items-start">
               <div className="shrink-0 text-primary mt-1"><TrendingUp size={16} /></div>
               <p className="text-[13px] leading-relaxed text-secondary font-medium italic">{ticketStrategy}</p>
            </div>
          </div>
        </section>

        {/* Stadium Expansion */}
        <section className="ui-card-premium p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/5 blur-[60px] rounded-full pointer-events-none" />
          
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 rounded-[1.5rem] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Home size={24} />
            </div>
            <div>
              <p className="ui-label-caps text-amber-500 text-[10px] mb-1">Infraestrutura</p>
              <h3 className="text-2xl font-black tracking-tighter text-white uppercase italic">Expansão da Arena</h3>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Capacidade', value: team.stadiumCapacity.toLocaleString(), icon: <Users size={12} />, color: 'text-white' },
              { label: 'Custo Obra', value: formatMoney(stadiumUpgradeCost), icon: <DollarSign size={12} />, color: expansionAffordable ? 'text-white' : 'text-rose-400' },
              { label: 'Ganho Assentos', value: `+${stadiumUpgradeGain.toLocaleString()}`, icon: <ArrowUpCircle size={12} />, color: 'text-amber-500' }
            ].map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/5 bg-black/40 p-5 group/est">
                <div className="flex items-center gap-2 mb-2 opacity-40">
                  <span className="text-amber-500/60">{stat.icon}</span>
                  <p className="ui-label-caps text-[8px]">{stat.label}</p>
                </div>
                <p className={clsx("text-lg font-black tracking-tighter tabular-nums italic", stat.color)}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl bg-white/5 border border-white/5 p-6 border-l-amber-500/50 border-l-4 mb-8">
            <p className="text-[12px] leading-relaxed text-secondary font-medium">{expansionStrategy}</p>
          </div>

          <button
            onClick={() => { impactHeavy(); onExpandStadium(stadiumUpgradeCost, stadiumUpgradeGain); }}
            disabled={!expansionAffordable}
            className={clsx(
              "relative w-full h-20 rounded-[1.75rem] flex items-center justify-center gap-4 text-sm font-black uppercase tracking-[0.3em] transition-all active:scale-95 overflow-hidden group/exp",
              !expansionAffordable ? "bg-white/5 text-secondary border border-white/5 cursor-not-allowed" : "bg-amber-500 text-background shadow-[0_20px_50px_rgba(245,158,11,0.3)]"
            )}
          >
             <ArrowUpCircle size={20} className="group-hover/exp:scale-110 transition-transform" />
             <span>Confirmar Ampliação</span>
          </button>
        </section>

        {/* Bank Loan */}
        <section className="ui-card-premium p-8 relative overflow-hidden bg-gradient-to-br from-interface to-background">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 rounded-[1.5rem] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Building size={24} />
            </div>
            <div>
              <p className="ui-label-caps text-blue-400 text-[10px] mb-1">Mercado Financeiro</p>
              <h3 className="text-2xl font-black tracking-tighter text-white uppercase italic">Crédito de Emergência</h3>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white/5 bg-black/40 p-10 mb-8 relative">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary opacity-50 mb-3">Valor Liberado</p>
                  <p className="text-4xl font-black text-white tracking-tighter italic tabular-nums leading-none">{formatMoney(500000)}</p>
               </div>
               <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 px-5 py-3 text-right">
                <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Perfil</p>
                <p className="text-sm font-black text-white italic tracking-tighter uppercase whitespace-nowrap">Curto Prazo</p>
              </div>
            </div>

            <div className="rounded-3xl border border-rose-500/10 bg-rose-500/5 p-6 border-l-rose-500 border-l-4">
              <div className="flex gap-4 items-start">
                <ShieldAlert size={18} className="text-rose-400 shrink-0 mt-1" />
                <p className="text-[12px] leading-relaxed text-secondary font-medium">
                   O empréstimo é uma injeção de liquidez imediata, não patrimônio. Recomendado para cobrir rombos de folha ou contratações estratégicas urgentes.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => { impactHeavy(); onLoan(500000); }}
            className="group/loan relative w-full h-20 rounded-[1.75rem] bg-blue-500 text-white flex items-center justify-center gap-4 text-sm font-black uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(59,130,246,0.3)] transition-all active:scale-95"
          >
            <Wallet size={20} className="group-hover/loan:rotate-12 transition-transform" />
            <span>Formalizar Empréstimo</span>
          </button>
        </section>

        {/* Tips Footer */}
        <section className="grid grid-cols-2 gap-4 pb-12">
          <div className="rounded-3xl border border-white/5 bg-interface/50 p-6 hover:bg-interface transition-colors group">
            <div className="flex items-center gap-3 text-emerald-400 mb-4 opacity-50 group-hover:opacity-100 transition-opacity">
              <TrendingUp size={16} />
              <p className="ui-label-caps text-[9px]">Otimização</p>
            </div>
            <p className="text-[12px] leading-relaxed text-secondary font-medium">
              Priorize melhorias que gerem receita recorrente (ingressos, estádio) antes de tapar buracos triviais.
            </p>
          </div>

          <div className="rounded-3xl border border-white/5 bg-interface/50 p-6 hover:bg-interface transition-colors group">
            <div className="flex items-center gap-3 text-amber-500 mb-4 opacity-50 group-hover:opacity-100 transition-opacity">
              <ShieldAlert size={16} />
              <p className="ui-label-caps text-[9px]">Sinal de Risco</p>
            </div>
            <p className="text-[12px] leading-relaxed text-secondary font-medium">
              Ingressos caros com moral baixa tendem a esvaziar o estádio e reduzir a pressão da torcida.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

