import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeamLogo } from '../components/TeamLogo';
import { Header } from '../components/Header';
import OnboardingModal from '../components/OnboardingModal';
import { Team, NewsItem, TransferOffer } from '../types';
import { 
  Play, Users, ArrowLeftRight, Wallet, LayoutDashboard, Trophy, Settings, 
  Newspaper, Target, MessageSquare, Heart, BarChart3, ShieldAlert, 
  CalendarDays, ChevronRight, Building2, Zap, Home, Shield, Calendar, ArrowRight
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
  onOpenContinental?: () => void;
  onBackHome?: () => void;
  news?: NewsItem[];
  offers?: TransferOffer[];
}

export default function DashboardScreen({
  team, nextOpponent, round, funds, isWindowOpen, onboardingComplete, onCompleteOnboarding,
  onOpenSquad, onOpenMarket, onOpenFinance, onOpenCalendar,
  onOpenLeague, onOpenStats, onOpenNews, onOpenSettings, onSimulate, onOpenTactics, onOpenProfile,
  onOpenTraining, onOpenStaff, onOpenInfrastructure, onOpenYouth, onOpenContinental,
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

  const quickActions = primaryActions;

  const maintenanceActions = [
    { label: 'Treino', icon: Zap, onClick: onOpenTraining, color: 'text-orange-400 bg-orange-400/10' },
    { label: 'Staff', icon: ShieldAlert, onClick: onOpenStaff, color: 'text-fuchsia-400 bg-fuchsia-400/10' },
    { label: 'Infra', icon: Building2, onClick: onOpenInfrastructure, color: 'text-pink-400 bg-pink-400/10' },
    { label: 'CONMEBOL', icon: Trophy, onClick: onOpenContinental, color: 'text-yellow-400 bg-yellow-400/10' },
  ];

  return (
    <div className="flex flex-col h-dvh bg-background text-white font-sans w-full relative overflow-hidden">
      {!onboardingComplete && (
        <OnboardingModal
          teamName={team.name}
          nextOpponentName={nextOpponent.name}
          onComplete={onCompleteOnboarding}
          onPlay={() => {
            onCompleteOnboarding();
            onSimulate();
          }}
        />
      )}

      <Header 
        title={team.name}
        subtitle={`Rodada ${round}`}
        onBack={onBackHome}
        backIcon={<Home size={20} className="text-secondary" />}
        rightAction={
          <div className="flex items-center gap-2">
            <div className={clsx(
              "px-3 py-1.5 rounded-xl border font-bold text-xs uppercase tracking-wider",
              funds < 0 ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            )}>
              R$ {(funds / 1000).toFixed(0)}k
            </div>
            <TeamLogo team={team} size="sm" />
          </div>
        }
      />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 no-scrollbar pb-52 max-w-4xl mx-auto w-full">
        
        {/* Top Fold: Priority Decision Hub */}
        <section className="ui-card-premium p-6 sm:p-8 relative overflow-hidden group shadow-2xl">
          <div className="absolute -right-10 -top-10 opacity-[0.05] group-hover:opacity-[0.1] transition-all pointer-events-none">
            <priorityAction.icon size={220} className="rotate-[-10deg] group-hover:rotate-0 transition-transform duration-1000" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="ui-label-caps text-secondary opacity-80">Status do Comando</span>
              <div className="h-[1px] flex-1 bg-white/10" />
              <div className="flex items-center gap-2 px-2.5 py-1 bg-background/60 rounded-full border border-white/10">
                <div className={clsx("w-2 h-2 rounded-full animate-pulse", 
                  priorityAction.tone === 'rose' ? "bg-rose-500" : 
                  priorityAction.tone === 'amber' ? "bg-amber-400" : "bg-primary"
                )} />
                <span className="text-[11px] font-extrabold text-white/70 uppercase tracking-wider">Live</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter text-white leading-tight mb-3">
              {priorityAction.title}
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-300 font-medium max-w-[90%] mb-6">
              {priorityAction.description}
            </p>

            <div className="flex gap-3 sm:gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { impactLight(); priorityAction.onClick(); }}
                className={clsx(
                  "flex-1 py-3.5 sm:py-4 px-4 rounded-2xl flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-xs sm:text-sm shadow-2xl transition-all border min-h-[44px]",
                  priorityAction.tone === 'rose' ? "bg-rose-500 text-white shadow-rose-500/20 border-rose-400/20" :
                  priorityAction.tone === 'amber' ? "bg-amber-500 text-black shadow-amber-500/20 border-amber-400/20" :
                  "bg-primary text-white shadow-primary/20 border-primary-light/20"
                )}
              >
                {priorityAction.cta}
                <ChevronRight size={18} />
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { impactLight(); onOpenCalendar(); }}
                className="w-14 sm:w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-secondary hover:bg-white/10 hover:text-white transition-all shadow-xl min-h-[44px]"
                aria-label="Abrir Calendário"
              >
                <CalendarDays size={20} />
              </motion.button>
            </div>
          </div>
        </section>

        {/* Club Health Stats */}
        <section className="grid grid-cols-2 gap-4">
           <div className="ui-card-premium p-5 sm:p-6 flex flex-col gap-3 bg-gradient-to-br from-white/[0.03] to-transparent">
              <div className="flex items-center gap-2 opacity-80">
                 <Heart size={16} className={clsx(team.moral > 60 ? "text-primary" : "text-rose-500")} />
                 <span className="ui-label-caps text-xs">Confiança</span>
              </div>
              <div className="flex items-baseline gap-2">
                 <span className="text-2xl sm:text-3xl font-black italic tracking-tighter text-white">{team.moral}%</span>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Elenco</span>
              </div>
           </div>
           
           <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => { impactLight(); onOpenNews(); }}
              className="ui-card-premium p-5 sm:p-6 flex flex-col gap-3 text-left group hover:bg-white/[0.08]"
           >
              <div className="flex items-center gap-2 opacity-80">
                 <Newspaper size={16} className="text-blue-400" />
                 <span className="ui-label-caps text-xs">Comunicados</span>
              </div>
              <div className="flex items-center justify-between">
                 <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black italic tracking-tighter text-white">{unreadNewsCount}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avisos</span>
                 </div>
                 {unreadNewsCount > 0 && <div className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping shadow-[0_0_10px_rgba(244,63,94,0.5)]" />}
              </div>
           </motion.button>
        </section>

        {/* Next Match Showcase */}
        <section className="ui-card-premium p-6 sm:p-8 border-white/10 relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-rose-400/5 opacity-50 pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10">
             <div className="ui-label-caps text-slate-300">Duelo da Rodada</div>
             <div className="flex items-center gap-2 px-3 py-1 bg-black/40 rounded-full border border-white/10 shadow-inner">
                <BarChart3 size={14} className="text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-white/80">SÉRIE {team.division === 2 ? 'B' : 'A'}</span>
             </div>
          </div>

          <div className="mt-6 sm:mt-8 flex items-center justify-between relative z-10 px-2 sm:px-4">
             <div className="flex flex-col items-center gap-3 group/team">
                <div className="relative">
                   <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover/team:opacity-100 transition-opacity pointer-events-none" />
                   <TeamLogo team={team} size="xl" className="relative z-10 drop-shadow-[0_0_20px_rgba(31,177,133,0.2)]" />
                </div>
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white italic truncate max-w-[100px] text-center">{team.shortName}</span>
             </div>

             <div className="flex flex-col items-center gap-2">
                <span className="text-4xl sm:text-5xl font-black italic tracking-tighter text-white/10 select-none drop-shadow-sm">VS</span>
                <div className="h-[2px] w-10 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
             </div>

             <div className="flex flex-col items-center gap-3 group/opp">
                <div className="relative">
                   <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full opacity-0 group-hover/opp:opacity-100 transition-opacity pointer-events-none" />
                   <TeamLogo team={nextOpponent} size="xl" className="relative z-10 grayscale-[0.3] group-hover/opp:grayscale-0 transition-all opacity-90" />
                </div>
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-300 italic truncate max-w-[100px] text-center">{nextOpponent.shortName}</span>
             </div>
          </div>

          <motion.div 
            className="mt-8 flex items-center gap-3 p-3.5 sm:p-4 bg-black/60 rounded-2xl sm:rounded-3xl border border-white/10 group-hover:border-primary/20 transition-all"
            key={currentReactionIdx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-inner">
               <MessageSquare size={18} />
            </div>
            <p className="text-xs italic font-medium text-slate-300 leading-relaxed">
              "{fanReactions[currentReactionIdx]}"
            </p>
          </motion.div>
        </section>

        {/* Tactical Quick Command */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <motion.div 
            whileHover={{ y: -2 }}
            className="ui-card-premium p-6 border-white/10 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-primary" />
                <span className="ui-label-caps text-secondary">Identidade Tática</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                {team.formation}
              </span>
            </div>

            <div className="space-y-1 mb-6">
              <div className="text-xl font-black italic tracking-tight text-white uppercase">{team.style}</div>
              <div className="text-xs text-slate-400">Postura definida para o próximo duelo</div>
            </div>

            <button
              onClick={() => { impactLight(); onOpenTactics(); }}
              className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-wider border border-white/5 transition-all flex items-center justify-center gap-2"
            >
              <Zap size={14} className="text-amber-400" />
              <span>Ajustar Tática</span>
            </button>
          </motion.div>

          {/* Next Match Context */}
          <motion.div 
            whileHover={{ y: -2 }}
            className="ui-card-premium p-6 border-white/10 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-primary" />
                <span className="ui-label-caps text-secondary">Próximo Desafio</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Rodada {round}
              </span>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TeamLogo team={team} size="md" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400">MANDANTE</span>
                  <span className="text-base font-black text-white">{team.shortName || team.name}</span>
                </div>
              </div>

              <span className="text-xs font-black text-slate-500 italic">VS</span>

              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-slate-400">VISITANTE</span>
                  <span className="text-base font-black text-white">{nextOpponent.shortName || nextOpponent.name}</span>
                </div>
                <TeamLogo team={nextOpponent} size="md" />
              </div>
            </div>

            <button
              onClick={() => { impactLight(); onOpenCalendar(); }}
              className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-wider border border-white/5 transition-all flex items-center justify-center gap-2"
            >
              <span>Ver Calendário</span>
            </button>
          </motion.div>
        </section>

        {/* Quick Management Hub */}
        <section className="space-y-3">
           <div className="flex justify-between items-center px-1">
              <span className="ui-label-caps text-secondary">Ações de Gestão</span>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {quickActions.map((action) => (
                <motion.button
                  key={action.label}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { impactLight(); action.onClick(); }}
                  className="ui-card-premium p-5 text-left hover:bg-white/[0.08] transition-all group border-white/10 min-h-[110px] flex flex-col justify-between"
                >
                  <div className={clsx("mb-3 flex h-12 w-12 items-center justify-center rounded-2xl shadow-xl transition-transform group-hover:scale-110", action.color)}>
                     <action.icon size={24} />
                  </div>
                  <div>
                    <div className="text-base font-black italic tracking-tight text-white uppercase mb-0.5">{action.label}</div>
                    <div className="text-[11px] font-semibold text-slate-400 leading-tight">{action.description}</div>
                  </div>
                </motion.button>
              ))}
           </div>
        </section>
      </main>

      {/* FIXED BOTTOM ACTION BAR — UNIFIED DOCK */}
      <footer className="fixed bottom-0 left-0 w-full z-50 pointer-events-none pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
         <div className="absolute bottom-0 left-0 w-full h-44 bg-gradient-to-t from-[var(--color-bg,#020617)] via-[var(--color-bg,#020617)]/95 to-transparent pointer-events-none" />

         <div className="relative px-3 sm:px-6 pt-4 pointer-events-auto max-w-md md:max-w-lg lg:max-w-xl mx-auto">
            <nav className="relative w-full bg-[var(--color-surface,#0f172a)] border border-white/15 rounded-[2.2rem] flex items-center justify-between px-2 sm:px-4 py-2 shadow-[0_15px_40px_rgba(0,0,0,0.9)]">
              {[
                { icon: LayoutDashboard, label: 'Home', action: () => {}, active: true },
                { icon: Trophy, label: 'Liga', action: onOpenLeague },
                { icon: BarChart3, label: 'Stats', action: onOpenStats },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => { hapticSelection(); item.action(); }}
                  className={clsx(
                    "flex-1 flex flex-col items-center gap-0.5 transition-all active:scale-90 relative py-1 min-h-[44px] justify-center",
                    item.active ? "text-primary" : "text-slate-400 hover:text-white"
                  )}
                >
                   <item.icon size={19} />
                   <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider">{item.label}</span>
                   {item.active && <motion.div layoutId="nav-glow" className="absolute -bottom-1 w-4 h-0.5 bg-primary rounded-full shadow-[0_0_8px_rgba(31,177,133,1)]" />}
                </button>
              ))}

              {/* Central Unified Action: Raised FAB + COMEÇAR RODADA Label */}
              <div className="flex-1 flex flex-col items-center justify-center relative shrink-0 px-1">
                 <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.94 }}
                    animate={{
                      boxShadow: ["0 0 14px rgba(31,177,133,0.4)", "0 0 28px rgba(31,177,133,0.7)", "0 0 14px rgba(31,177,133,0.4)"]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    onClick={() => { impactMedium(); onSimulate(); }}
                    aria-label="Começar Rodada"
                    title="Começar Rodada"
                    className="flex flex-col items-center justify-center -mt-7 group transition-all"
                 >
                    <div className="h-13 w-13 sm:h-14 sm:w-14 bg-primary rounded-2xl border-4 border-[var(--color-bg,#020617)] flex items-center justify-center shadow-2xl transition-transform group-hover:scale-105">
                       <Play size={22} fill="currentColor" className="text-white ml-0.5" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-primary mt-1 text-center whitespace-nowrap drop-shadow-md">
                       Começar Rodada
                    </span>
                 </motion.button>
              </div>

              {[
                { icon: Newspaper, label: 'News', action: onOpenNews, badge: unreadNewsCount },
                { icon: Users, label: 'Perfil', action: onOpenProfile },
                { icon: Settings, label: 'Ajustes', action: onOpenSettings },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => { hapticSelection(); item.action(); }}
                  className="flex-1 flex flex-col items-center gap-0.5 transition-all active:scale-90 relative py-1 text-slate-400 hover:text-white min-h-[44px] justify-center"
                >
                   <item.icon size={19} />
                   <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider">{item.label}</span>
                   {item.badge ? (
                      <div className="absolute top-0 right-[10%] h-4 w-4 bg-rose-500 rounded-full border-2 border-[var(--color-surface,#0f172a)] flex items-center justify-center text-[9px] font-bold text-white shadow-md">
                        {item.badge}
                      </div>
                   ) : null}
                </button>
              ))}
             </nav>
          </div>
       </footer>
    </div>
  );
}
