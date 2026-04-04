import React from 'react';
import { NewsItem } from '../types';
import { Newspaper, DollarSign, Heart, Activity, TrendingUp, ShieldAlert, Check, Sparkles } from 'lucide-react';
import { Header } from '../components/Header';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  news: NewsItem[];
  onBack: () => void;
  onRead: (id: string) => void;
  onChoice: (newsId: string, impact: any) => void;
}

const CATEGORY_MAP: Record<string, { icon: React.ReactNode, color: string, bg: string }> = {
  'FINANCE': { icon: <DollarSign size={16} />, color: 'text-emerald-400 border-emerald-400/20', bg: 'bg-emerald-400/10' },
  'MORAL': { icon: <Heart size={16} />, color: 'text-rose-400 border-rose-400/20', bg: 'bg-rose-400/10' },
  'HEALTH': { icon: <Activity size={16} />, color: 'text-blue-400 border-blue-400/20', bg: 'bg-blue-400/10' },
  'MARKET': { icon: <TrendingUp size={16} />, color: 'text-amber-400 border-amber-400/20', bg: 'bg-amber-400/10' },
  'BOARD': { icon: <ShieldAlert size={16} />, color: 'text-primary border-primary/20', bg: 'bg-primary/10' },
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
    <div className="flex flex-col h-screen bg-background text-white font-sans overflow-hidden">
      <Header 
        title="Bastidores"
        subtitle="Centro de Decisões"
        onBack={onBack}
        rightAction={<div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-xl border border-primary/20 text-primary font-black text-[10px] uppercase tracking-widest">Rod. {latestRound ?? '--'}</div>}
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-32">
        
        {/* Status Hub Card */}
        <section className="ui-card-premium p-8 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <Newspaper size={180} className="rotate-[-10deg] group-hover:rotate-0 transition-transform duration-700" />
          </div>
          
          <div className="relative z-10">
            <span className="ui-label-caps mb-4">Leitura do Ambiente</span>
            <h2 className="text-3xl font-black italic tracking-tighter text-white leading-none mb-3">
              {pendingItems.length > 0 ? 'Decisões Pendentes' : unreadItems.length > 0 ? 'Novas Atualizações' : 'Ambiente Estável'}
            </h2>
            <p className="text-[12px] leading-relaxed text-secondary font-black uppercase tracking-widest max-w-[85%]">
              {pendingItems.length > 0
                ? `Você possui ${pendingItems.length} assunto${pendingItems.length > 1 ? 's' : ''} com impacto direto no clube.`
                : unreadItems.length > 0
                  ? 'Leia o contexto antes de agir em mercado, finanças ou vestiário.'
                  : 'Sem urgências abertas. Todos os setores operando conforme o planejado.'}
            </p>
            
            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/5 bg-black/40 p-4 transition-all hover:bg-black/60">
                <p className="ui-label-caps text-[8px] opacity-40 mb-1">Pendentes</p>
                <p className="text-xl font-black text-amber-200 italic leading-none">{pendingItems.length}</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-black/40 p-4 transition-all hover:bg-black/60">
                <p className="ui-label-caps text-[8px] opacity-40 mb-1">Não lidas</p>
                <p className="text-xl font-black text-white italic leading-none">{unreadItems.length}</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-black/40 p-4 transition-all hover:bg-black/60">
                <p className="ui-label-caps text-[8px] opacity-40 mb-1">Total</p>
                <p className="text-xl font-black text-white italic leading-none">{news.length}</p>
              </div>
            </div>
          </div>
        </section>

        {/* News Feed */}
        <div className="space-y-5">
          {news.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-6 rounded-[3rem] border-2 border-dashed border-white/5 bg-white/2 py-24 text-secondary opacity-20">
              <Newspaper size={64} strokeWidth={1} />
              <p className="ui-label-caps tracking-[0.4em]">Silêncio administrativo</p>
            </div>
          ) : (
            <AnimatePresence>
              {news.map((item) => {
                const config = CATEGORY_MAP[item.category] || CATEGORY_MAP['BOARD'];
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={clsx(
                      "ui-card-premium p-6 space-y-6 transition-all",
                      item.choices
                        ? "border-primary/20 bg-primary/5 shadow-[0_0_40px_rgba(31,177,133,0.05)]"
                        : item.isRead
                          ? "opacity-60 grayscale-[0.5]"
                          : "border-white/10"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className={clsx("flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest", config.color, config.bg)}>
                        {config.icon} {item.category}
                      </div>
                      <div className="flex items-center gap-3">
                        {item.choices && !item.isRead ? (
                          <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                        ) : null}
                        <span className="text-[10px] text-secondary font-black tracking-widest uppercase">Rodada {item.round}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-black italic tracking-tighter text-white leading-tight">{item.title}</h3>
                      <p className="text-[13px] text-secondary font-medium leading-relaxed">{item.body}</p>
                    </div>

                    {item.choices ? (
                      <div className="space-y-3 pt-4 border-t border-white/5">
                        <p className="ui-label-caps text-secondary/40 text-[9px] mb-2">Exige sua decisão pessoal</p>
                        {item.choices.map((choice, idx) => (
                          <motion.button
                            key={idx}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onChoice(item.id, choice.impact)}
                            className="w-full rounded-2xl border border-white/10 bg-black/40 px-6 py-4 text-left transition-all hover:border-primary/40 hover:bg-primary/10 group flex items-center justify-between gap-4"
                          >
                             <span className="text-[11px] font-black uppercase tracking-widest text-white">{choice.label}</span>
                             <div className="h-6 w-6 rounded-lg bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-primary group-hover:text-white transition-all">
                                <Check size={14} />
                             </div>
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-secondary/40 italic">
                          <Check size={12} className={clsx(item.isRead ? "text-primary" : "text-secondary/20")} />
                          {item.isRead ? "Arquivado" : "Aguardando leitura"}
                        </div>
                        {!item.isRead && !item.choices && (
                           <motion.button 
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onRead(item.id)}
                              className="text-[9px] font-black text-primary uppercase underline underline-offset-4"
                           >
                              Marcar como lida
                           </motion.button>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
