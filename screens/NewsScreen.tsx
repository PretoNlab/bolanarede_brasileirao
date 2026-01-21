
import React from 'react';
import { NewsItem } from '../types';
import { ArrowLeft, Newspaper, DollarSign, Heart, Activity, TrendingUp, ShieldAlert, Check } from 'lucide-react';
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

   return (
      <div className="flex flex-col h-screen bg-background text-white">
         <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-surface"><ArrowLeft size={20} /></button>
            <h1 className="text-sm font-black uppercase tracking-widest">Centro de Decisões</h1>
            <div className="w-10"></div>
         </header>

         <main className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
            {news.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-20 text-secondary gap-4 opacity-50">
                  <Newspaper size={48} />
                  <p className="text-sm font-bold">Tudo calmo nos bastidores.</p>
               </div>
            ) : (
               news.map((item) => {
                  const config = CATEGORY_MAP[item.category];
                  return (
                     <div key={item.id} className={clsx("bg-surface rounded-3xl border p-5 space-y-4", item.choices ? "border-primary shadow-2xl shadow-primary/10" : "border-white/5")}>
                        <div className="flex items-center justify-between">
                           <div className={clsx("flex items-center gap-2 text-[10px] font-black uppercase tracking-widest", config.color)}>
                              {config.icon} {item.category}
                           </div>
                           <span className="text-[10px] text-secondary font-bold">Rod. {item.round}</span>
                        </div>

                        <h3 className="text-lg font-black leading-tight">{item.title}</h3>
                        <p className="text-sm text-secondary leading-relaxed">{item.body}</p>

                        {item.choices ? (
                           <div className="grid grid-cols-1 gap-2 pt-2">
                              {item.choices.map((choice, idx) => (
                                 <button
                                    key={idx}
                                    onClick={() => onChoice(item.id, choice.impact)}
                                    className="w-full py-4 bg-background border border-white/5 rounded-2xl text-[10px] font-black uppercase hover:bg-primary/10 hover:border-primary/30 transition-all flex items-center justify-between px-6"
                                 >
                                    {choice.label}
                                    <Check size={14} className="text-emerald-500" />
                                 </button>
                              ))}
                           </div>
                        ) : (
                           <div className="text-[10px] text-secondary font-bold uppercase pt-4 border-t border-white/5 flex items-center gap-2">
                              <Check size={12} className={clsx(item.isRead ? "text-emerald-500" : "text-secondary")} /> {item.isRead ? "Visto" : "Nova"}
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
