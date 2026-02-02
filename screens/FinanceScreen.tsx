
import React from 'react';
import { Team } from '../types';
import { ArrowLeft, Wallet, TrendingUp, Building, Users, Home, ArrowUpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
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

export default function FinanceScreen({ team, funds, ticketPrice, onUpdateTicketPrice, onBack, onLoan, onExpandStadium }: Props) {
   const formatMoney = (val: number) => {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
   };

   const stadiumUpgradeCost = team.stadiumCapacity * 20; // R$ 20 por lugar novo
   const stadiumUpgradeGain = 5000;

   return (
      <div className="flex flex-col h-screen bg-background text-white font-sans">
         <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-white/5 p-6 flex items-center justify-between pt-safe">
            <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center active:scale-95 transition-all">
               <ArrowLeft size={20} />
            </button>
            <h1 className="text-base font-black italic tracking-tighter uppercase">Gestão Financeira</h1>
            <div className="w-12"></div>
         </header>

         <main className="flex-1 overflow-y-auto p-6 space-y-6 pb-28 no-scrollbar">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-surface to-[#0a0a0a] border border-white/5 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                  <Wallet size={160} />
               </div>
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0" />

               <p className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-2 opacity-60">Saldo Consolidado</p>
               <h2 className={clsx(
                  "text-4xl font-black tabular-nums tracking-tighter",
                  funds >= 0 ? "text-white" : "text-rose-500"
               )}>{formatMoney(funds)}</h2>

               <div className="mt-6 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Conta Verificada</span>
               </div>
            </div>

            {/* Stadium Info */}
            <div className="bg-surface rounded-2xl p-6 border border-white/5 space-y-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <Home size={18} className="text-amber-500" />
                     <h3 className="text-sm font-bold uppercase">Meu Estádio</h3>
                  </div>
                  <span className="text-sm font-black text-white">{team.stadiumCapacity.toLocaleString()} lugares</span>
               </div>

               <button
                  onClick={() => onExpandStadium(stadiumUpgradeCost, stadiumUpgradeGain)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-background font-black py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
               >
                  <ArrowUpCircle size={18} />
                  EXPANDIR (+5.000 Lugares) - {formatMoney(stadiumUpgradeCost)}
               </button>
            </div>

            {/* Ticket Price Control */}
            <div className="bg-surface rounded-2xl p-6 border border-white/5 space-y-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <Users size={18} className="text-primary" />
                     <h3 className="text-sm font-bold uppercase">Preço do Ingresso</h3>
                  </div>
                  <span className="text-xl font-black text-primary">{formatMoney(ticketPrice)}</span>
               </div>

               <input
                  type="range" min="10" max="200" step="5"
                  value={ticketPrice}
                  onChange={(e) => onUpdateTicketPrice(parseInt(e.target.value))}
                  className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
               />

               <p className="text-[10px] text-center text-secondary leading-relaxed">
                  Lembre-se: Preços altos espantam o público. O estádio cheio melhora o moral do time!
               </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
               <button
                  onClick={() => onLoan(500000)}
                  className="w-full flex items-center justify-between p-4 bg-surface rounded-xl border border-white/5 active:scale-[0.98] transition-all"
               >
                  <div className="flex items-center gap-3">
                     <div className="bg-primary/20 p-2 rounded-lg text-primary"><Building size={20} /></div>
                     <span className="font-bold text-sm">Empréstimo Bancário</span>
                  </div>
                  <div className="bg-primary px-3 py-1 rounded text-xs font-bold text-white">+ 500k</div>
               </button>
            </div>
         </main>
      </div>
   );
}
