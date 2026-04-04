import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeamLogo } from '../components/TeamLogo';
import { Header } from '../components/Header';
import OnboardingModal from '../components/OnboardingModal';
import { Team, NewsItem, TransferOffer } from '../types';
import { 
  Play, Users, ArrowLeftRight, Wallet, LayoutDashboard, Trophy, Settings, 
  Newspaper, Target, MessageSquare, Heart, BarChart3, ShieldAlert, 
  CalendarDays, ChevronRight, Building2, Zap, Sparkles
} from 'lucide-react';
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
}

export default function DashboardScreen({
  team, nextOpponent, round, funds, isWindowOpen, onboardingComplete, onCompleteOnboarding,
  onOpenSquad, onOpenMarket, onOpenFinance, onOpenCalendar,
  onOpenLeague, onOpenStats, onOpenNews, onOpenSettings, onSimulate, onOpenTactics, onOpenProfile,
  onOpenTraining, onOpenStaff, onOpenInfrastructure, onOpenYouth,
  onBackHome,
  news = [], offers = []
}: Props) {

  const unreadNewsCount = useMemo(() => news.filter(n => !n.isRead || n.choices).length, [news]);

  const fanReactions = useMemo(() => {
    const reactions = [];
    if (team.moral > 80) reactions.push("O clima no estádio está incrível! #RumoAoTitulo");
    if (team.moral < 40) reactions.push("O time está sem alma em campo... Alguém faça algo!");
    if (funds < 0) reactions.push("Onde está o dinheiro da diretoria? #CriseFinanceira");
    if (team.won > 0) reactions.push("A última vitória deu esperança para a massa!");
    reactions.push(`Próximo jogo contra o ${nextOpponent.shortName} vai ser pedreira.`);
    return reactions;
  }, [team.moral, team.won, funds, nextOpponent.shortName]);

  const [currentReactionIdx, setCurrentReactionIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReactionIdx(prev => (prev + 1) % fanReactions.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [fanReactions]);

  const priorityAction = useMemo(() => {
    if (offers.length > 0) {
      return {
        title: 'Gestão de Transferências',
        description: `Existem ${offers.length} proposta${offers.length > 1 ? 's' : ''} aguardando sua resposta.`,
        cta: 'Ver Propostas',
        onClick: onOpenMarket,
        tone: 'rose' as const,
        icon: ArrowLeftRight
      };
    }

    if (funds < 0) {
      return {
        title: 'Estabilização de Caixa',
        description: 'O saldo está negativo. Avalie vendas ou patrocinadores imediatamente.',
        cta: 'Ajustar Finanças',
        onClick: onOpenFinance,
        tone: 'rose' as const,
        icon: Wallet
      };
    }

    if (team.moral < 45) {
      return {
        title: 'Crise de Vestiário',
        description: 'A confiança está em queda. Ajustes táticos e diálogo são necessários.',
        cta: 'Resolver Crise',
        onClick: onOpenTactics,
        tone: 'amber' as const,
        icon: Target
      };
    }

    return {
      title: 'Preparação do Jogo',
      description: `Foco total no duelo contra o ${nextOpponent.shortName}.`,
      cta: 'Ajustar Elenco',
      onClick: onOpenSquad,
      tone: 'primary' as const,
      icon: Users
    };
  }, [funds, nextOpponent.shortName, offers.length, onOpenFinance, onOpenMarket, onOpenSquad, onOpenTactics, team.moral]);

  const primaryActions = [
    { label: 'Tática', description: 'Plano de Jogo', icon: Target, onClick: onOpenTactics, color: 'text-primary bg-primary/10' },
    { label: 'Elenco', description: 'Gestão de Atletas', icon: Users, onClick: onOpenSquad, color: 'text-blue-400 bg-blue-400/10' },
    { label: 'Mercado', description: isWindowOpen ? 'Janela Aberta' : 'Janela Fechada', icon: ArrowLeftRight, onClick: onOpenMarket, color: isWindowOpen ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10' },
    { label: 'Controle', description: 'Fluxo de Caixa', icon: Wallet, onClick: onOpenFinance, color: 'text-amber-400 bg-amber-400/10' },
  ];

  const maintenanceActions = [
    { label: 'Treino', icon: Zap, onClick: onOpenTraining, color: 'text-orange-400 bg-orange-400/10' },
    { label: 'Staff', icon: ShieldAlert, onClick: onOpenStaff, color: 'text-fuchsia-400 bg-fuchsia-400/10' },
    { label: 'Infra', icon: Building2, onClick: onOpenInfrastructure, color: 'text-pink-400 bg-pink-400/10' },
    { label: 'Base', icon: Trophy, onClick: onOpenYouth, color: 'text-cyan-400 bg-cyan-400/10' },
  ];

  return (
    <div className="flex flex-col h-screen bg-background text-white font-sans overflow-hidden">
      {!onboardingComplete && (
        <OnboardingModal
          teamName={team.name}
          nextOpponentName={nextOpponent.name}
          onComplete={onCompleteOnboarding}
        />
      )}

      <Header 
        title={team.name}
        subtitle={`Rodada ${round}`}
        onBack={onBackHome}
        rightAction={
          <div className="flex items-center gap-2">
            <div className={clsx(
              "px-3 py-1.5 rounded-xl border font-black text-[9px] uppercase tracking-widest",
              funds < 0 ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            )}>
              R$ {(funds / 1000).toFixed(0)}k
            </div>
            <TeamLogo team={team} size="sm" />
          </div>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-40">
        
        {/* Top Fold: Priority Decision Hub */}
        <section className="ui-card-premium p-8 relative overflow-hidden group shadow-2xl">
          <div className="absolute -right-10 -top-10 opacity-[0.05] group-hover:opacity-[0.1] transition-all">
            <priorityAction.icon size={220} className="rotate-[-10deg] group-hover:rotate-0 transition-transform duration-1000" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="ui-label-caps text-secondary opacity-60">Status do Comando</span>
              <div className="h-[1px] flex-1 bg-white/5" />
              <div className="flex items-center gap-2 px-2 py-0.5 bg-background/60 rounded-full border border-white/5">
                <div className={clsx("w-1.5 h-1.5 rounded-full animate-pulse", 
                  priorityAction.tone === 'rose' ? "bg-rose-500" : 
                  priorityAction.tone === 'amber' ? "bg-amber-400" : "bg-primary"
                )} />
                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Live</span>
              </div>
            </div>

            <h2 className="text-4xl font-black italic tracking-tighter text-white leading-none mb-4">
              {priorityAction.title}
            </h2>
            <p className="text-[13px] leading-relaxed text-secondary font-medium max-w-[85%] mb-8">
              {priorityAction.description}
            </p>

            <div className="flex gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { impactLight(); priorityAction.onClick(); }}
                className={clsx(
                  "flex-1 py-4.5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all border",
                  priorityAction.tone === 'rose' ? "bg-rose-500 text-white shadow-rose-500/20 border-rose-400/20" :
                  priorityAction.tone === 'amber' ? "bg-amber-500 text-black shadow-amber-500/20 border-amber-400/20" :
                  "bg-primary text-white shadow-primary/20 border-primary-light/20"
                )}
              >
                {priorityAction.cta}
                <ChevronRight size={16} />
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { impactLight(); onOpenCalendar(); }}
                className="w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-secondary hover:bg-white/10 hover:text-white transition-all shadow-xl"
              >
                <CalendarDays size={20} />
              </motion.button>
            </div>
          </div>
        </section>

        {/* Club Health Stats */}
        <section className="grid grid-cols-2 gap-4">
           <div className="ui-card-premium p-6 flex flex-col gap-4 bg-gradient-to-br from-white/[0.03] to-transparent">
              <div className="flex items-center gap-3 opacity-40">
                 <Heart size={14} className={clsx(team.moral > 60 ? "text-primary" : "text-rose-500")} />
                 <span className="ui-label-caps text-[9px]">Confiança</span>
              </div>
              <div className="flex items-baseline gap-2">
                 <span className="text-3xl font-black italic tracking-tighter text-white">{team.moral}%</span>
                 <span className="text-[9px] font-bold text-secondary uppercase tracking-widest">Elenco</span>
              </div>
           </div>
           
           <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => { impactLight(); onOpenNews(); }}
              className="ui-card-premium p-6 flex flex-col gap-4 text-left group hover:bg-white/[0.08]"
           >
              <div className="flex items-center gap-3 opacity-40">
                 <Newspaper size={14} className="text-blue-400" />
                 <span className="ui-label-caps text-[9px]">Comunicados</span>
              </div>
              <div className="flex items-center justify-between">
                 <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black italic tracking-tighter text-white">{unreadNewsCount}</span>
                    <span className="text-[9px] font-bold text-secondary uppercase tracking-widest">Avisos</span>
                 </div>
                 {unreadNewsCount > 0 && <div className="h-2 w-2 rounded-full bg-rose-500 animate-ping shadow-[0_0_10px_rgba(244,63,94,0.5)]" />}
              </div>
           </motion.button>
        </section>

        {/* Next Match Showcase */}
        <section className="ui-card-premium p-8 border-white/10 relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-rose-400/5 opacity-50" />
          
          <div className="flex items-center justify-between relative z-10">
             <div className="ui-label-caps text-secondary opacity-60">Duelo da Rodada</div>
             <div className="flex items-center gap-2 px-3 py-1 bg-black/40 rounded-full border border-white/5 shadow-inner">
                <BarChart3 size={12} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">SÉRIE {team.division === 2 ? 'B' : 'A'}</span>
             </div>
          </div>

          <div className="mt-8 flex items-center justify-between relative z-10 px-4">
             <div className="flex flex-col items-center gap-4 group/team">
                <div className="relative">
                   <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover/team:opacity-100 transition-opacity" />
                   <TeamLogo team={team} size="xl" className="relative z-10 drop-shadow-[0_0_20px_rgba(31,177,133,0.2)]" />
                </div>
                <span className="text-[12px] font-black uppercase tracking-[0.2em] text-white italic">{team.shortName}</span>
             </div>

             <div className="flex flex-col items-center gap-2">
                <span className="text-5xl font-black italic tracking-tighter text-white/5 select-none drop-shadow-sm">VS</span>
                <div className="h-[2px] w-10 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
             </div>

             <div className="flex flex-col items-center gap-4 group/opp">
                <div className="relative">
                   <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full opacity-0 group-hover/opp:opacity-100 transition-opacity" />
                   <TeamLogo team={nextOpponent} size="xl" className="relative z-10 grayscale-[0.3] group-hover/opp:grayscale-0 transition-all opacity-80" />
                </div>
                <span className="text-[12px] font-black uppercase tracking-[0.2em] text-secondary italic">{nextOpponent.shortName}</span>
             </div>
          </div>

          <motion.div 
            className="mt-10 flex items-center gap-4 p-4 bg-black/60 rounded-3xl border border-white/5 group-hover:border-primary/20 transition-all"
            key={currentReactionIdx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-inner">
               <MessageSquare size={16} />
            </div>
            <p className="text-[11px] italic font-medium text-secondary/80 leading-relaxed">
              "{fanReactions[currentReactionIdx]}"
            </p>
          </motion.div>
        </section>

        {/* Primary Management Grid */}
        <section className="space-y-5 px-1">
           <h3 className="ui-label-caps text-secondary opacity-40">Departamentos</h3>
           <div className="grid grid-cols-2 gap-4">
              {primaryActions.map((action) => (
                <motion.button
                  key={action.label}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { impactLight(); action.onClick(); }}
                  className="ui-card-premium p-6 text-left hover:bg-white/[0.08] transition-all group border-white/5"
                >
                  <div className={clsx("mb-5 flex h-14 w-14 items-center justify-center rounded-[1.25rem] shadow-2xl transition-transform group-hover:scale-110", action.color)}>
                     <action.icon size={26} />
                  </div>
                  <div className="text-lg font-black italic tracking-tighter text-white uppercase mb-1">{action.label}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-secondary opacity-40 leading-none">{action.description}</div>
                </motion.button>
              ))}
           </div>
        </section>

        {/* Maintenance / Secondary Grid */}
        <section className="ui-card-premium p-6 border-white/5 bg-white/[0.02] shadow-inner">
           <div className="grid grid-cols-4 gap-4">
              {maintenanceActions.map((action) => (
                <motion.button
                  key={action.label}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { impactLight(); action.onClick(); }}
                  className="flex flex-col items-center gap-3 active:opacity-60 group"
                >
                  <div className={clsx("h-14 w-14 flex items-center justify-center rounded-2xl border border-white/5 bg-black/40 shadow-xl transition-all group-hover:border-primary/30 group-hover:bg-primary/5", action.color)}>
                     <action.icon size={22} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-secondary">{action.label}</span>
                </motion.button>
              ))}
           </div>
        </section>
      </main>

      {/* FIXED BOTTOM ACTION BAR */}
      <footer className="fixed bottom-0 left-0 w-full z-50 pointer-events-none">
         <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-background via-background/90 to-transparent" />
         
         <div className="relative p-6 flex flex-col items-center gap-4 pointer-events-auto">
            {/* Play Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: ["0 0 20px rgba(31,177,133,0.2)", "0 0 40px rgba(31,177,133,0.4)", "0 0 20px rgba(31,177,133,0.2)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              onClick={() => { impactMedium(); onSimulate(); }}
              className="w-full max-w-sm h-18 bg-primary rounded-[2.5rem] flex items-center justify-center gap-4 shadow-2xl relative overflow-hidden group"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center text-white">
                  <Play size={20} fill="currentColor" />
               </div>
               <span className="text-sm font-black text-white uppercase tracking-[0.4em] italic drop-shadow-lg">Começar Rodada</span>
               <div className="absolute -right-4 -top-4 opacity-10">
                  <Sparkles size={60} />
               </div>
            </motion.button>

            {/* Bottom Navigation */}
            <nav className="w-full bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] flex justify-around items-center px-2 py-3 shadow-2xl">
              {[
                { icon: LayoutDashboard, label: 'Home', action: () => {}, active: true },
                { icon: Trophy, label: 'Liga', action: onOpenLeague },
                { icon: BarChart3, label: 'Stats', action: onOpenStats },
                { icon: Newspaper, label: 'News', action: onOpenNews, badge: unreadNewsCount },
                { icon: Users, label: 'Perfil', action: onOpenProfile },
                { icon: Settings, label: 'Ajustes', action: onOpenSettings },
              ].map((item, i) => (
                <button 
                  key={i}
                  onClick={() => { hapticSelection(); item.action(); }} 
                  className={clsx(
                    "flex-1 flex flex-col items-center gap-1 transition-all active:scale-90 relative py-1",
                    item.active ? "text-primary" : "text-secondary hover:text-white"
                  )}
                >
                   <item.icon size={19} />
                   <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
                   {item.badge ? (
                      <div className="absolute -top-1 right-[20%] h-3.5 w-3.5 bg-rose-500 rounded-full border-2 border-background flex items-center justify-center text-[7px] font-black text-white">
                        {item.badge}
                      </div>
                   ) : null}
                   {item.active && <motion.div layoutId="nav-glow" className="absolute -bottom-1 w-4 h-0.5 bg-primary rounded-full shadow-[0_0_8px_rgba(31,177,133,1)]" />}
                </button>
              ))}
            </nav>
         </div>
      </footer>
    </div>
  );
}
