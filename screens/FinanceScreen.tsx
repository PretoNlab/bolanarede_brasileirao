import React from 'react';
import { Team } from '../types';
import {
  ArrowLeft,
  ArrowUpCircle,
  Building,
  Home,
  ShieldAlert,
  TrendingUp,
  Users,
  Wallet
} from 'lucide-react';
import clsx from 'clsx';

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
        title: 'Caixa em alerta',
        copy: 'O clube precisa proteger liquidez agora. Evite custo estrutural e use ingresso ou empréstimo para atravessar a pressão.',
        tone: 'red'
      }
    : funds < 500000
      ? {
          title: 'Margem curta de manobra',
          copy: 'Existe espaço para gerir o curto prazo, mas qualquer investimento precisa de retorno rápido.',
          tone: 'amber'
        }
      : {
          title: 'Situação controlada',
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
    <div className="flex h-screen flex-col bg-background font-sans text-white">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-background/92 p-6 pt-safe backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 transition-all active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Finanças</p>
            <h1 className="mt-1 text-base font-black uppercase tracking-tight text-white">Controle do clube</h1>
          </div>

          <div className="w-12" />
        </div>
      </header>

      <main className="flex-1 space-y-6 overflow-y-auto p-6 pb-28 no-scrollbar">
        <section className="rounded-[2.25rem] border border-white/8 bg-surface/80 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Pulso financeiro</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white">{financePulse.title}</h2>
              <p className="mt-2 max-w-xl text-[13px] leading-6 text-white/65">{financePulse.copy}</p>
            </div>
            <div
              className={clsx(
                'rounded-2xl px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em]',
                financePulse.tone === 'green' && 'bg-emerald-500/15 text-emerald-300',
                financePulse.tone === 'amber' && 'bg-amber-500/15 text-amber-200',
                financePulse.tone === 'red' && 'bg-rose-500/15 text-rose-200'
              )}
            >
              {funds >= 0 ? 'Caixa ativo' : 'Correção urgente'}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/6 bg-background/55 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-secondary">Saldo</p>
              <p className={clsx('mt-2 text-lg font-black tracking-tight', funds >= 0 ? 'text-white' : 'text-rose-300')}>
                {formatMoney(funds)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/6 bg-background/55 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-secondary">Ocupação proj.</p>
              <p className="mt-2 text-lg font-black tracking-tight text-white">{projectedDemand}%</p>
            </div>
            <div className="rounded-2xl border border-white/6 bg-background/55 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-secondary">Receita proj.</p>
              <p className="mt-2 text-lg font-black tracking-tight text-emerald-400">{formatMoney(projectedMatchRevenue)}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/8 bg-surface/75 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/12 p-3 text-primary">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-secondary">Bilheteria</p>
              <h3 className="mt-1 text-xl font-black tracking-tight text-white">Preço do ingresso</h3>
            </div>
          </div>

          <div className="mt-5 rounded-[1.75rem] border border-white/6 bg-background/55 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-secondary">Preço atual</p>
                <p className="mt-1 text-2xl font-black tracking-tight text-primary">{formatMoney(ticketPrice)}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/5 px-3 py-2 text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-secondary">Moral do clube</p>
                <p className="mt-1 text-sm font-black text-white">{team.moral}</p>
              </div>
            </div>

            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={ticketPrice}
              onChange={(event) => onUpdateTicketPrice(parseInt(event.target.value))}
              className="mt-5 h-2 w-full cursor-pointer appearance-none rounded-lg bg-background accent-primary"
            />

            <div className="mt-4 flex justify-between text-[10px] font-black uppercase tracking-[0.14em] text-white/45">
              <span>Popular</span>
              <span>Equilibrado</span>
              <span>Premium</span>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/6 bg-white/5 p-4">
            <p className="text-[12px] leading-6 text-white/70">{ticketStrategy}</p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/8 bg-surface/75 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-500/12 p-3 text-amber-300">
              <Home size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-secondary">Infraestrutura</p>
              <h3 className="mt-1 text-xl font-black tracking-tight text-white">Expansão do estádio</h3>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/6 bg-background/55 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-secondary">Capacidade</p>
              <p className="mt-2 text-sm font-black text-white">{team.stadiumCapacity.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-white/6 bg-background/55 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-secondary">Custo</p>
              <p className="mt-2 text-sm font-black text-white">{formatMoney(stadiumUpgradeCost)}</p>
            </div>
            <div className="rounded-2xl border border-white/6 bg-background/55 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-secondary">Ganho</p>
              <p className="mt-2 text-sm font-black text-white">+{stadiumUpgradeGain.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/6 bg-white/5 p-4">
            <p className="text-[12px] leading-6 text-white/70">{expansionStrategy}</p>
          </div>

          <button
            onClick={() => onExpandStadium(stadiumUpgradeCost, stadiumUpgradeGain)}
            disabled={!expansionAffordable}
            className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-amber-500 py-4 text-[11px] font-black uppercase tracking-[0.16em] text-background transition-all active:scale-[0.98] disabled:opacity-35"
          >
            <ArrowUpCircle size={18} />
            Expandir estádio
          </button>
        </section>

        <section className="rounded-[2rem] border border-white/8 bg-surface/75 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-500/12 p-3 text-blue-300">
              <Building size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-secondary">Liquidez</p>
              <h3 className="mt-1 text-xl font-black tracking-tight text-white">Empréstimo bancário</h3>
            </div>
          </div>

          <div className="mt-5 rounded-[1.75rem] border border-white/6 bg-background/55 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-secondary">Entrada imediata</p>
                <p className="mt-1 text-2xl font-black tracking-tight text-white">{formatMoney(500000)}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/5 px-3 py-2">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-secondary">Uso ideal</p>
                <p className="mt-1 text-sm font-black text-white">Curto prazo</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-rose-500/12 bg-rose-500/8 p-4">
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} className="text-rose-300" />
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-rose-200">Leitura prática</p>
              </div>
              <p className="mt-2 text-[12px] leading-6 text-white/70">
                Empréstimo é remédio de caixa, não crescimento. Use quando precisar atravessar pressão imediata ou destravar uma decisão essencial.
              </p>
            </div>
          </div>

          <button
            onClick={() => onLoan(500000)}
            className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-4 text-[11px] font-black uppercase tracking-[0.16em] text-white transition-all active:scale-[0.98]"
          >
            <Wallet size={18} />
            Pegar empréstimo de {formatMoney(500000)}
          </button>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-[1.75rem] border border-white/8 bg-surface/70 p-4">
            <div className="flex items-center gap-2 text-emerald-300">
              <TrendingUp size={16} />
              <p className="text-[10px] font-black uppercase tracking-[0.14em]">Melhor uso do caixa</p>
            </div>
            <p className="mt-3 text-[12px] leading-6 text-white/70">
              Se o caixa estiver sob controle, priorize medidas que aumentem receita recorrente em vez de só tapar buraco.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-white/8 bg-surface/70 p-4">
            <div className="flex items-center gap-2 text-amber-300">
              <ShieldAlert size={16} />
              <p className="text-[10px] font-black uppercase tracking-[0.14em]">Sinal de risco</p>
            </div>
            <p className="mt-3 text-[12px] leading-6 text-white/70">
              Ingresso alto com moral baixa tende a esvaziar o estádio e reduzir a pressão positiva da torcida.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
