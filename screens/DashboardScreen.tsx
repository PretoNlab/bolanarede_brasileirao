import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TeamLogo } from '../components/TeamLogo';
import OnboardingModal from '../components/OnboardingModal';
import { Team, NewsItem, TransferOffer } from '../types';
import { Play, Users, ArrowLeftRight, Wallet, LayoutDashboard, Trophy, Settings, Newspaper, Target, Lock, Unlock, MessageSquare, Heart, BarChart3, Home, ShieldAlert, CalendarDays, ChevronRight, Building2 } from 'lucide-react';
import { impactLight, impactMedium, hapticSelection } from '../haptics';
import clsx from 'clsx';

interface Props {
   team: Team;
   nextOpponent: Team;
   standings: Team[];
   round: number;
   funds: number;
   onboardingComplete: boolean;
   isWindowOpen: boolean;
   onCompleteOnboarding: () => void;
   onOpenSquad: () => void;
   onOpenMarket: () => void;
   onOpenFinance: () => void;
   onOpenCalendar: () => void;
   onOpenLeague: () => void;
   onOpenStats: () => void;
   onOpenNews: () => void;
   onOpenSettings: () => void;
   onSimulate: () => void;
   onOpenTactics: () => void;
   onOpenProfile: () => void;
   onOpenTraining: () => void;
   onOpenStaff: () => void;
   onOpenInfrastructure: () => void;
   onOpenYouth: () => void;
   onBackHome?: () => void;
   news?: NewsItem[];
   offers?: TransferOffer[];
   hiredStaff?: any[];
   infrastructure?: any;
}


export default function DashboardScreen({
   team, nextOpponent, round, funds, isWindowOpen, onboardingComplete, onCompleteOnboarding,
   onOpenSquad, onOpenMarket, onOpenFinance, onOpenCalendar,
   onOpenLeague, onOpenStats, onOpenNews, onOpenSettings, onSimulate, onOpenTactics, onOpenProfile,
   onOpenTraining, onOpenStaff, onOpenInfrastructure, onOpenYouth,
   onBackHome,
   news = [], offers = []
}: Props) {

   const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1,
         transition: {
            staggerChildren: 0.05
         }
      }
   };

   const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
   };

   const fanReactions = useMemo(() => {
      const reactions = [];
      if (team.moral > 80) reactions.push("O clima no estádio está incrível! #RumoAoTitulo");
      if (team.moral < 40) reactions.push("O time está sem alma em campo... Alguém faça algo!");
      if (funds < 0) reactions.push("Onde está o dinheiro da diretoria? #CriseFinanceira");
      if (team.won > 0) reactions.push("A última vitória deu esperança para a massa!");
      if (team.division === 2) reactions.push("Série B não é nosso lugar, vamos subir!");
      reactions.push("O próximo jogo contra o " + nextOpponent.shortName + " vai ser pedreira.");
      return reactions;
   }, [team, nextOpponent, funds]);

   const [currentReactionIdx, setCurrentReactionIdx] = useState(0);

   useEffect(() => {
      const timer = setInterval(() => {
         setCurrentReactionIdx(prev => (prev + 1) % fanReactions.length);
      }, 4000);
      return () => clearInterval(timer);
   }, [fanReactions]);

   const unreadNewsCount = useMemo(() => news.filter(n => !n.isRead || n.choices).length, [news]);

   const priorityAction = useMemo(() => {
      if (offers.length > 0) {
         return {
            title: 'Responder propostas recebidas',
            description: `Existem ${offers.length} proposta${offers.length > 1 ? 's' : ''} aguardando decisão no mercado.`,
            cta: 'Abrir mercado',
            onClick: onOpenMarket,
            tone: 'rose' as const,
         };
      }

      if (team.moral < 45) {
         return {
            title: 'Recuperar confiança do elenco',
            description: 'O ambiente está pressionado. Ajustes táticos e gestão de grupo precisam entrar antes da próxima rodada.',
            cta: 'Abrir tática',
            onClick: onOpenTactics,
            tone: 'amber' as const,
         };
      }

      if (funds < 0) {
         return {
            title: 'Estabilizar o caixa do clube',
            description: 'O saldo está negativo. Vale rever ingressos, mercado e despesas antes de ampliar riscos.',
            cta: 'Abrir finanças',
            onClick: onOpenFinance,
            tone: 'rose' as const,
         };
      }

      if (isWindowOpen) {
         return {
            title: 'Aproveitar a janela aberta',
            description: 'A janela está ativa. Este é o melhor momento para corrigir carências e responder oportunidade.',
            cta: 'Explorar mercado',
            onClick: onOpenMarket,
            tone: 'emerald' as const,
         };
      }

      return {
         title: 'Preparar a próxima rodada',
         description: `O jogo contra o ${nextOpponent.shortName} é o próximo ponto de decisão. Ajuste elenco, tática e confiança antes de entrar em campo.`,
         cta: 'Ver elenco',
         onClick: onOpenSquad,
         tone: 'blue' as const,
      };
   }, [funds, isWindowOpen, nextOpponent.shortName, offers.length, onOpenFinance, onOpenMarket, onOpenSquad, onOpenTactics, team.moral]);

   const clubAlerts = useMemo(() => {
      const alerts: { title: string; body: string; tone: 'rose' | 'amber' | 'emerald' | 'blue' }[] = [];

      if (funds < 0) {
         alerts.push({
            title: 'Caixa em risco',
            body: 'O saldo está negativo e já merece ação financeira imediata.',
            tone: 'rose',
         });
      }

      if (team.moral < 45) {
         alerts.push({
            title: 'Vestiário pressionado',
            body: 'A confiança do grupo está baixa e pode contaminar a próxima sequência.',
            tone: 'amber',
         });
      }

      if (offers.length > 0) {
         alerts.push({
            title: 'Mercado pedindo resposta',
            body: `Há ${offers.length} proposta${offers.length > 1 ? 's' : ''} aguardando decisão.`,
            tone: 'blue',
         });
      }

      if (unreadNewsCount > 0) {
         alerts.push({
            title: 'Leituras pendentes',
            body: `${unreadNewsCount} notícia${unreadNewsCount > 1 ? 's' : ''} ainda pode${unreadNewsCount > 1 ? 'm' : ''} mudar seu contexto.`,
            tone: 'emerald',
         });
      }

      if (alerts.length === 0) {
         alerts.push({
            title: 'Quadro estável',
            body: 'Sem alertas críticos agora. Você pode focar na preparação da rodada.',
            tone: 'emerald',
         });
      }

      return alerts.slice(0, 3);
   }, [funds, offers.length, team.moral, unreadNewsCount]);

   const primaryActions = [
      { label: 'Tática', description: 'Ajuste o plano de jogo', icon: Target, onClick: onOpenTactics, color: 'text-primary bg-primary/10' },
      { label: 'Elenco', description: 'Veja energia e opções', icon: Users, onClick: onOpenSquad, color: 'text-blue-400 bg-blue-400/10' },
      { label: 'Mercado', description: isWindowOpen ? 'Janela aberta' : 'Janela fechada', icon: ArrowLeftRight, onClick: onOpenMarket, color: isWindowOpen ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-500 bg-rose-500/10' },
      { label: 'Finanças', description: 'Controle o caixa', icon: Wallet, onClick: onOpenFinance, color: 'text-amber-400 bg-amber-400/10' },
   ];

   const secondaryActions = [
      { label: 'Treino', icon: Target, onClick: onOpenTraining, color: 'text-orange-400 bg-orange-400/10' },
      { label: 'Staff', icon: Users, onClick: onOpenStaff, color: 'text-fuchsia-400 bg-fuchsia-400/10' },
      { label: 'C.T.', icon: Building2, onClick: onOpenInfrastructure, color: 'text-pink-400 bg-pink-400/10' },
      { label: 'Base', icon: Trophy, onClick: onOpenYouth, color: 'text-cyan-400 bg-cyan-400/10' },
   ];

   return (
      <div className="flex flex-col h-screen bg-background text-white relative font-sans">
         {!onboardingComplete && (
            <OnboardingModal
               teamName={team.name}
               nextOpponentName={nextOpponent.name}
               onComplete={onCompleteOnboarding}
            />
         )}

         <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-2xl border-b border-white/5 p-5 flex items-center justify-between pt-safe">
            <div className="flex items-center gap-4">
               {onBackHome && (
                  <button
                     onClick={() => { impactLight(); onBackHome(); }}
                     className="p-2 hover:bg-white/5 rounded-full transition-colors mr-1"
                  >
                     <Home size={18} className="text-secondary" />
                  </button>
               )}
               <TeamLogo team={team} size="md" />
               <div className="flex flex-col">
                  <h1 className="text-sm font-black italic tracking-tighter leading-none mb-1 uppercase text-white/90">{team.name}</h1>
                  <span className={clsx("text-[9px] font-black uppercase flex items-center gap-1.5", isWindowOpen ? 'text-emerald-400' : 'text-rose-400')}>
                     {isWindowOpen ? <Unlock size={10} /> : <Lock size={10} />}
                     Janela {isWindowOpen ? 'Aberta' : 'Fechada'}
                  </span>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                     boxShadow: ["0 0 0px var(--color-primary)", "0 0 20px var(--color-primary)", "0 0 0px var(--color-primary)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  onClick={() => { impactMedium(); onSimulate(); }}
                  className="bg-primary px-5 py-2.5 rounded-2xl text-[11px] font-black flex items-center gap-2.5 shadow-xl shadow-primary/30 transition-all uppercase tracking-widest border border-white/10"
               >
                  <Play size={14} fill="currentColor" /> JOGAR
               </motion.button>
            </div>
         </header>

         <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 overflow-y-auto p-6 space-y-6 pb-28 no-scrollbar"
         >
            <motion.section variants={itemVariants} className="rounded-[36px] border border-white/8 bg-gradient-to-br from-surface to-[#101712] p-6 shadow-2xl relative overflow-hidden">
               <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-[70px]" />
               <div className="flex items-start justify-between gap-4">
                  <div className="max-w-[70%]">
                     <div className="text-[11px] font-black uppercase tracking-[0.24em] text-secondary">Centro de comando</div>
                     <h2 className="mt-3 text-[1.9rem] font-black tracking-[-0.06em] leading-[0.95] text-white">
                        {priorityAction.title}
                     </h2>
                     <p className="mt-3 text-[13px] leading-6 text-white/68">
                        {priorityAction.description}
                     </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
                     <div className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Rodada</div>
                     <div className="mt-1 text-2xl font-black text-white">{round}</div>
                  </div>
               </div>

               <div className="mt-5 flex flex-wrap gap-2">
                  <div className={clsx("rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] border",
                     isWindowOpen ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border-rose-500/20 bg-rose-500/10 text-rose-400"
                  )}>
                     Janela {isWindowOpen ? 'aberta' : 'fechada'}
                  </div>
                  <div className={clsx("rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] border",
                     team.moral >= 60 ? "border-primary/20 bg-primary/10 text-primary" : "border-amber-500/20 bg-amber-500/10 text-amber-400"
                  )}>
                     Confiança {team.moral}%
                  </div>
                  {unreadNewsCount > 0 && (
                     <div className="rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] border border-blue-400/20 bg-blue-400/10 text-blue-300">
                        {unreadNewsCount} notícia{unreadNewsCount > 1 ? 's' : ''} pendente{unreadNewsCount > 1 ? 's' : ''}
                     </div>
                  )}
               </div>

               <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                  <button
                     onClick={() => { impactMedium(); onSimulate(); }}
                     className={clsx(
                        "flex items-center justify-center gap-3 rounded-2xl px-5 py-4 font-black uppercase tracking-[0.14em] shadow-xl transition-all active:scale-95",
                        priorityAction.tone === 'rose' ? "bg-rose-500 text-white shadow-rose-500/20" :
                        priorityAction.tone === 'amber' ? "bg-amber-500 text-black shadow-amber-500/20" :
                        priorityAction.tone === 'blue' ? "bg-blue-500 text-white shadow-blue-500/20" :
                        "bg-primary text-white shadow-primary/20"
                     )}
                  >
                     <Play size={18} fill="currentColor" />
                     Jogar agora
                  </button>
                  <button
                     onClick={() => { impactLight(); priorityAction.onClick(); }}
                     className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-[12px] font-black uppercase tracking-[0.14em] text-white transition-all active:scale-95"
                  >
                     {priorityAction.cta}
                     <ChevronRight size={16} />
                  </button>
                  <button
                     onClick={() => { impactLight(); onOpenCalendar(); }}
                     className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-[12px] font-black uppercase tracking-[0.14em] text-secondary transition-all active:scale-95"
                  >
                     <CalendarDays size={16} />
                     Agenda
                  </button>
               </div>
            </motion.section>

            <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-3">
               <div className="rounded-[28px] border border-white/5 bg-surface/60 p-5 shadow-inner">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-secondary">Saldo atual</p>
                  <p className={clsx("mt-2 text-3xl font-black tabular-nums tracking-tighter", funds < 0 ? "text-rose-500" : "text-emerald-400")}>
                     R$ {(funds / 1000).toFixed(0)}k
                  </p>
                  <p className="mt-2 text-[12px] leading-5 text-white/60">
                     {funds < 0 ? 'Ajuste financeiro recomendado.' : 'Caixa sob controle no momento.'}
                  </p>
               </div>
               <div className="rounded-[28px] border border-white/5 bg-surface/60 p-5 shadow-inner">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-secondary">Confiança</p>
                  <div className="mt-2 flex items-center gap-3">
                     <Heart size={18} className={clsx(team.moral > 70 ? "text-primary" : team.moral > 45 ? "text-amber-400" : "text-rose-500")} fill="currentColor" />
                     <p className="text-3xl font-black tracking-tighter">{team.moral}%</p>
                  </div>
                  <p className="mt-2 text-[12px] leading-5 text-white/60">
                     {team.moral > 70 ? 'Ambiente favorável.' : team.moral > 45 ? 'Clima de atenção.' : 'Vestiário em alerta.'}
                  </p>
               </div>
               <button
                  onClick={() => { impactLight(); onOpenNews(); }}
                  className="rounded-[28px] border border-white/5 bg-surface/60 p-5 text-left shadow-inner transition-all active:scale-[0.98]"
               >
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-secondary">Leituras pendentes</p>
                  <div className="mt-2 flex items-center gap-3">
                     <Newspaper size={18} className="text-blue-300" />
                     <p className="text-3xl font-black tracking-tighter">{unreadNewsCount}</p>
                  </div>
                  <p className="mt-2 text-[12px] leading-5 text-white/60">
                     Abra notícias para contexto, escolhas e consequências.
                  </p>
               </button>
            </motion.div>

            <motion.section variants={itemVariants} className="rounded-[32px] border border-white/5 bg-surface/40 p-5 backdrop-blur-sm">
               <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-primary/10 p-2.5 text-primary">
                     <MessageSquare size={18} />
                  </div>
                  <div>
                     <div className="text-[11px] font-black uppercase tracking-[0.2em] text-secondary">Voz da arquibancada</div>
                     <p className="mt-1 text-[13px] italic leading-6 text-white/72" key={currentReactionIdx}>
                        "{fanReactions[currentReactionIdx]}"
                     </p>
                  </div>
               </div>
            </motion.section>

            <motion.section variants={itemVariants} className="rounded-[36px] border border-white/8 bg-gradient-to-br from-surface to-[#111111] p-6 shadow-2xl relative overflow-hidden">
               <div className="absolute -right-8 -top-8 w-40 h-40 bg-primary/10 blur-[60px] rounded-full" />
               <div className="flex items-center justify-between">
                  <div>
                     <div className="text-[11px] font-black uppercase tracking-[0.24em] text-secondary">Próxima rodada</div>
                     <p className="mt-2 text-[13px] leading-6 text-white/65">
                        Próximo compromisso oficial contra o {nextOpponent.name}.
                     </p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/60">
                     Mando de campo
                  </div>
               </div>

               <div className="mt-7 flex items-center justify-between px-2">
                  <div className="flex flex-col items-center gap-3">
                     <div className="rounded-full bg-white/5 p-1 shadow-2xl">
                        <TeamLogo team={team} size="xl" />
                     </div>
                     <span className="text-[12px] font-black uppercase tracking-[0.16em] text-white/90">{team.shortName}</span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                     <span className="text-4xl font-black italic tracking-tighter text-white/10">VS</span>
                     <div className="h-0.5 w-8 rounded-full bg-white/10" />
                  </div>

                  <div className="flex flex-col items-center gap-3">
                     <div className="rounded-full bg-white/5 p-1 shadow-2xl opacity-80">
                        <TeamLogo team={nextOpponent} size="xl" />
                     </div>
                     <span className="text-[12px] font-black uppercase tracking-[0.16em] text-white/70">{nextOpponent.shortName}</span>
                  </div>
               </div>
            </motion.section>

            <motion.section variants={itemVariants} className="space-y-4">
               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="text-[18px] font-black tracking-[-0.03em] text-white">Alertas do clube</h3>
                     <p className="mt-1 text-[13px] leading-6 text-white/60">Tudo o que merece atenção antes da próxima decisão.</p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/50">
                     {clubAlerts.length} alerta{clubAlerts.length > 1 ? 's' : ''}
                  </div>
               </div>

               <div className="grid gap-3">
                  {clubAlerts.map((alert) => (
                     <div
                        key={alert.title}
                        className={clsx(
                           "rounded-[24px] border p-4",
                           alert.tone === 'rose' ? "border-rose-500/15 bg-rose-500/8" :
                           alert.tone === 'amber' ? "border-amber-500/15 bg-amber-500/8" :
                           alert.tone === 'blue' ? "border-blue-400/15 bg-blue-400/8" :
                           "border-emerald-500/15 bg-emerald-500/8"
                        )}
                     >
                        <div className="flex items-start gap-3">
                           <div className={clsx(
                              "rounded-2xl p-2.5",
                              alert.tone === 'rose' ? "bg-rose-500/12 text-rose-400" :
                              alert.tone === 'amber' ? "bg-amber-500/12 text-amber-400" :
                              alert.tone === 'blue' ? "bg-blue-400/12 text-blue-300" :
                              "bg-emerald-500/12 text-emerald-400"
                           )}>
                              <ShieldAlert size={18} />
                           </div>
                           <div>
                              <div className="text-[13px] font-black uppercase tracking-[0.12em] text-white">{alert.title}</div>
                              <p className="mt-1 text-[13px] leading-6 text-white/68">{alert.body}</p>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </motion.section>

            <motion.section variants={itemVariants} className="space-y-4">
               <div>
                  <h3 className="text-[18px] font-black tracking-[-0.03em] text-white">Gestão principal</h3>
                  <p className="mt-1 text-[13px] leading-6 text-white/60">As áreas que mais influenciam sua rodada agora.</p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  {primaryActions.map((action) => (
                     <button
                        key={action.label}
                        onClick={() => { impactLight(); action.onClick(); }}
                        className="rounded-[28px] border border-white/5 bg-surface/50 p-5 text-left transition-all active:scale-95 hover:bg-surface/80"
                     >
                        <div className={clsx("mb-4 flex h-12 w-12 items-center justify-center rounded-2xl", action.color)}>
                           <action.icon size={22} />
                        </div>
                        <div className="text-[15px] font-black uppercase tracking-tight text-white">{action.label}</div>
                        <div className="mt-1 text-[12px] leading-5 text-white/60">{action.description}</div>
                     </button>
                  ))}
               </div>
            </motion.section>

            <motion.section variants={itemVariants} className="space-y-4">
               <div>
                  <h3 className="text-[18px] font-black tracking-[-0.03em] text-white">Gestão complementar</h3>
                  <p className="mt-1 text-[13px] leading-6 text-white/60">Estrutura, pessoas e crescimento sustentando a campanha.</p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  {secondaryActions.map((action) => (
                     <button
                        key={action.label}
                        onClick={() => { impactLight(); action.onClick(); }}
                        className="rounded-[28px] border border-white/5 bg-surface/35 p-5 text-left transition-all active:scale-95 hover:bg-surface/70"
                     >
                        <div className={clsx("mb-4 flex h-12 w-12 items-center justify-center rounded-2xl", action.color)}>
                           <action.icon size={22} />
                        </div>
                        <div className="text-[15px] font-black uppercase tracking-tight text-white">{action.label}</div>
                     </button>
                  ))}
               </div>
            </motion.section>
         </motion.main>

         <nav className="fixed bottom-0 left-0 w-full bg-background/60 backdrop-blur-3xl border-t border-white/5 h-24 flex justify-around items-center px-4 pb-safe z-50">
            <button onClick={() => { hapticSelection(); }} className="flex-1 flex flex-col items-center gap-1.5 text-primary active:opacity-60 transition-all py-2">
               <LayoutDashboard size={20} />
               <span className="text-[10px] font-black uppercase tracking-[0.14em]">Home</span>
            </button>
            <button onClick={() => { hapticSelection(); onOpenLeague(); }} className="flex-1 flex flex-col items-center gap-1.5 text-secondary active:opacity-60 transition-all py-2">
               <Trophy size={20} />
               <span className="text-[10px] font-black uppercase tracking-[0.14em]">Liga</span>
            </button>
            <button onClick={() => { hapticSelection(); onOpenStats(); }} className="flex-1 flex flex-col items-center gap-1.5 text-secondary active:opacity-60 transition-all py-2">
               <BarChart3 size={20} />
               <span className="text-[10px] font-black uppercase tracking-[0.14em]">Stats</span>
            </button>
            <button onClick={() => { hapticSelection(); onOpenNews(); }} className="flex-1 flex flex-col items-center gap-1.5 text-secondary relative active:opacity-60 transition-all py-2">
               <Newspaper size={20} />
               <span className="text-[10px] font-black uppercase tracking-[0.14em]">Notícias</span>
               {unreadNewsCount > 0 && (
                  <div className="absolute top-1 right-[20%] flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[7px] font-black text-white border border-background shadow-lg">
                     {unreadNewsCount}
                  </div>
               )}
            </button>
            <button onClick={() => { hapticSelection(); onOpenProfile(); }} className="flex-1 flex flex-col items-center gap-1.5 text-secondary active:opacity-60 transition-all py-2">
               <Users size={20} />
               <span className="text-[10px] font-black uppercase tracking-[0.14em]">Perfil</span>
            </button>
            <button onClick={() => { hapticSelection(); onOpenSettings(); }} className="flex-1 flex flex-col items-center gap-1.5 text-secondary active:opacity-60 transition-all py-2">
               <Settings size={20} />
               <span className="text-[10px] font-black uppercase tracking-[0.14em]">Ajustes</span>
            </button>
         </nav>
      </div>
   );
}
