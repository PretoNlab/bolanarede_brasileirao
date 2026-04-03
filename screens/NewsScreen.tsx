
import React from 'react';
import { NewsItem } from '../types';
import { ArrowLeft, Newspaper, DollarSign, Heart, Activity, TrendingUp, ShieldAlert, Check, Sparkles } from 'lucide-react';
import clsx from 'clsx';

interface Props {
   news: NewsItem[];
   onBack: () => void;
   onRead: (id: string) => void;
   onChoice: (newsId: string, impact: any) => void;
}

const CATEGORY_MAP = {
   'FINANCE': { icon: <DollarSign size={18} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
   'MORAL': { icon: <Heart size={18} />, color: 'text-rose-500', bg: 'bg-rose-500/10' },
   'HEALTH': { icon: <Activity size={18} />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
   'MARKET': { icon: <TrendingUp size={18} />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
   'BOARD': { icon: <ShieldAlert size={18} />, color: 'text-primary', bg: 'bg-primary/10' },
};

export default function NewsScreen({ news, onBack, onRead, onChoice }: Props) {
   React.useEffect(() => {
      news.forEach(item => {
         if (!item.isRead && !item.choices) {
            onRead(item.id);
         }
      });
   }, [news, onRead]);

   const pendingItems = news.filter(item => item.choices && !item.isRead);
   const unreadItems = news.filter(item => !item.isRead);
   const latestRound = news[0]?.round;

   return (
      <div className="flex flex-col h-screen bg-background text-white">
         <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-white/5 p-5 pt-safe">
            <div className="flex items-center justify-between">
               <button onClick={onBack} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 transition-all active:scale-95">
                  <ArrowLeft size={20} />
               </button>
               <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-secondary">Bastidores</p>
                  <h1 className="mt-1 text-sm font-black uppercase tracking-[0.12em]">Centro de decisões</h1>
               </div>
               <div className="w-12"></div>
            </div>
         </header>

         <main className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
            <section className="rounded-[2rem] border border-white/8 bg-surface/75 p-5">
               <div className="flex items-start justify-between gap-4">
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Leitura do ambiente</p>
                     <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
                        {pendingItems.length > 0 ? 'Há decisões esperando resposta' : unreadItems.length > 0 ? 'Existem atualizações novas' : 'Ambiente sob controle'}
                     </h2>
                     <p className="mt-2 text-[13px] leading-6 text-white/65">
                        {pendingItems.length > 0
                           ? `Você tem ${pendingItems.length} assunto${pendingItems.length > 1 ? 's' : ''} com impacto direto em caixa, moral ou estratégia.`
                           : unreadItems.length > 0
                              ? 'Leia o contexto antes de agir em mercado, finanças ou vestiário.'
                              : 'Sem urgências abertas. Use a tela para acompanhar o histórico recente do clube.'}
                     </p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/5 px-3 py-2 text-right">
                     <p className="text-[10px] font-black uppercase tracking-[0.14em] text-secondary">Rodada foco</p>
                     <p className="mt-1 text-base font-black text-white">{latestRound ?? '--'}</p>
                  </div>
               </div>

               <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-white/6 bg-background/55 p-4">
                     <p className="text-[10px] font-black uppercase tracking-[0.14em] text-secondary">Pendentes</p>
                     <p className="mt-2 text-lg font-black text-amber-200">{pendingItems.length}</p>
                  </div>
                  <div className="rounded-2xl border border-white/6 bg-background/55 p-4">
                     <p className="text-[10px] font-black uppercase tracking-[0.14em] text-secondary">Não lidas</p>
                     <p className="mt-2 text-lg font-black text-white">{unreadItems.length}</p>
                  </div>
                  <div className="rounded-2xl border border-white/6 bg-background/55 p-4">
                     <p className="text-[10px] font-black uppercase tracking-[0.14em] text-secondary">Total</p>
                     <p className="mt-2 text-lg font-black text-white">{news.length}</p>
                  </div>
               </div>
            </section>

            {news.length === 0 ? (
               <div className="flex flex-col items-center justify-center gap-4 rounded-[2rem] border border-white/8 bg-surface/60 py-20 text-secondary opacity-70">
                  <Newspaper size={48} />
                  <p className="text-sm font-bold">Tudo calmo nos bastidores.</p>
               </div>
            ) : (
               news.map((item) => {
                  const config = CATEGORY_MAP[item.category];
                  return (
                     <div
                        key={item.id}
                        className={clsx(
                           "rounded-[2rem] border p-5 space-y-4",
                           item.choices
                              ? "border-primary/25 bg-surface shadow-2xl shadow-primary/8"
                              : item.isRead
                                 ? "border-white/6 bg-surface/70"
                                 : "border-white/10 bg-surface/90"
                        )}
                     >
                        <div className="flex items-center justify-between">
                           <div className={clsx("flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em]", config.color)}>
                              {config.icon} {item.category}
                           </div>
                           <div className="flex items-center gap-2">
                              {item.choices ? (
                                 <span className="rounded-full bg-amber-500/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-amber-200">
                                    Decisão
                                 </span>
                              ) : null}
                              {!item.isRead ? (
                                 <span className="rounded-full bg-white/8 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/65">
                                    Nova
                                 </span>
                              ) : null}
                              <span className="text-[10px] text-secondary font-bold">Rod. {item.round}</span>
                           </div>
                        </div>

                        <div className="space-y-2">
                           <h3 className="text-xl font-black leading-tight tracking-tight">{item.title}</h3>
                           <p className="text-[14px] text-white/68 leading-7">{item.body}</p>
                        </div>

                        {item.choices ? (
                           <div className="space-y-3 pt-2">
                              <div className="flex items-center gap-2 text-amber-200">
                                 <Sparkles size={15} />
                                 <p className="text-[10px] font-black uppercase tracking-[0.16em]">Escolha uma resposta</p>
                              </div>
                              {item.choices.map((choice, idx) => (
                                 <button
                                    key={idx}
                                    onClick={() => onChoice(item.id, choice.impact)}
                                    className="w-full rounded-2xl border border-white/8 bg-background/60 px-5 py-4 text-left transition-all hover:border-primary/30 hover:bg-primary/8 active:scale-[0.98]"
                                 >
                                    <div className="flex items-center justify-between gap-4">
                                       <span className="text-[11px] font-black uppercase tracking-[0.12em] text-white">{choice.label}</span>
                                       <Check size={14} className="text-emerald-400 shrink-0" />
                                    </div>
                                 </button>
                              ))}
                           </div>
                        ) : (
                           <div className="text-[10px] text-secondary font-bold uppercase pt-4 border-t border-white/5 flex items-center gap-2 tracking-[0.14em]">
                              <Check size={12} className={clsx(item.isRead ? "text-emerald-400" : "text-secondary")} />
                              {item.isRead ? "Lido e arquivado" : "Nova atualização"}
                           </div>
                        )}
                     </div>
                  );
               })
            )}
         </main>
      </div>
   );
}
