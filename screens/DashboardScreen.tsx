import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TeamLogo } from '../components/TeamLogo';
import { Header } from '../components/Header';
import OnboardingModal from '../components/OnboardingModal';
import { Team, NewsItem, TransferOffer } from '../types';
import {
  Play, Users, ArrowLeftRight, Wallet, LayoutDashboard, Trophy, Settings,
  Newspaper, Target, MessageSquare, Heart, BarChart3, ShieldAlert,
  CalendarDays, ChevronRight, Building2, Zap, Home, Shield, Calendar
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
  team,
  nextOpponent,
  round,
  funds,
  isWindowOpen,
  onboardingComplete,
  onCompleteOnboarding,
  onOpenSquad,
  onOpenMarket,
  onOpenFinance,
  onOpenCalendar,
  onOpenLeague,
  onOpenStats,
  onOpenNews,
  onOpenSettings,
  onSimulate,
  onOpenTactics,
  onOpenProfile,
  onOpenTraining,
  onOpenStaff,
  onOpenInfrastructure,
  onOpenYouth,
  onOpenContinental,
  onBackHome,
  news = [],
  offers = []
}: Props) {
  const unreadNewsCount = useMemo(() => news.filter(n => !n.isRead || n.choices).length, [news]);

  const fanReactions = useMemo(() => {
    const reactions = [];
    if (team.moral > 80) reactions.push('O clima no estádio está incrível! #RumoAoTitulo');
    if (team.moral < 40) reactions.push('O time está sem alma em campo... Alguém faça algo!');
    if (funds < 0) reactions.push('Onde está o dinheiro da diretoria? #CriseFinanceira');
    if (team.won > 0) reactions.push('A última vitória deu esperança para a massa!');
    reactions.push(`Próximo jogo contra o ${nextOpponent.shortName || nextOpponent.name} vai ser pedreira.`);
    return reactions;
  }, [team.moral, team.won, funds, nextOpponent.shortName, nextOpponent.name]);

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
      description: `Foco total no duelo contra o ${nextOpponent.shortName || nextOpponent.name}.`,
      cta: 'Ajustar Elenco',
      onClick: onOpenSquad,
      tone: 'primary' as const,
      icon: Users
    };
  }, [funds, nextOpponent.shortName, nextOpponent.name, offers.length, onOpenFinance, onOpenMarket, onOpenSquad, onOpenTactics, team.moral]);

  const quickActions = [
    { label: 'Tática', description: 'Plano de jogo', icon: Target, onClick: onOpenTactics, color: 'text-primary bg-primary/10' },
    { label: 'Elenco', description: 'Gestão de atletas', icon: Users, onClick: onOpenSquad, color: 'text-blue-400 bg-blue-400/10' },
    { label: 'Mercado', description: isWindowOpen ? 'Janela aberta' : 'Janela fechada', icon: ArrowLeftRight, onClick: onOpenMarket, color: isWindowOpen ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10' },
    { label: 'Controle', description: 'Fluxo de caixa', icon: Wallet, onClick: onOpenFinance, color: 'text-amber-400 bg-amber-400/10' },
  ];

  const clubActions = [
    { label: 'Treino', icon: Zap, onClick: onOpenTraining, color: 'text-orange-400 bg-orange-400/10' },
    { label: 'Staff', icon: ShieldAlert, onClick: onOpenStaff, color: 'text-fuchsia-400 bg-fuchsia-400/10' },
    { label: 'Infra', icon: Building2, onClick: onOpenInfrastructure, color: 'text-pink-400 bg-pink-400/10' },
    { label: 'Base', icon: Users, onClick: onOpenYouth, color: 'text-cyan-400 bg-cyan-400/10' },
    { label: 'CONMEBOL', icon: Trophy, onClick: onOpenContinental, color: 'text-yellow-400 bg-yellow-400/10' },
  ];

  const navItems = [
    { icon: LayoutDashboard, label: 'Home', action: () => {}, active: true },
    { icon: Trophy, label: 'Liga', action: onOpenLeague },
    { icon: BarChart3, label: 'Stats', action: onOpenStats },
    { icon: Newspaper, label: 'News', action: onOpenNews, badge: unreadNewsCount },
    { icon: Users, label: 'Perfil', action: onOpenProfile },
    { icon: Settings, label: 'Ajustes', action: onOpenSettings },
  ];

  const fundsLabel = `R$ ${(funds / 1000).toFixed(0)}k`;

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-background font-sans text-white">
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

      <div className="lg:hidden">
        <Header
          title={team.name}
          subtitle={`Rodada ${round}`}
          onBack={onBackHome}
          backIcon={<Home size={20} className="text-secondary" />}
          rightAction={
            <div className="flex items-center gap-2">
              <div className={clsx(
                'rounded-xl border px-3 py-1.5 text-xs font-bold uppercase tracking-wider',
                funds < 0 ? 'border-rose-500/20 bg-rose-500/10 text-rose-400' : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
              )}>
                {fundsLabel}
              </div>
              <TeamLogo team={team} size="sm" />
            </div>
          }
        />
      </div>

      <div className="flex min-h-0 flex-1 lg:mx-auto lg:w-full lg:max-w-7xl lg:px-6 lg:pb-6 lg:pt-6">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 pr-5 lg:flex">
          <div className="mb-6 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-3">
              <TeamLogo team={team} size="md" />
              <div className="min-w-0">
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-primary">Rodada {round}</div>
                <div className="truncate text-lg font-black italic tracking-tight text-white">{team.name}</div>
              </div>
            </div>
            <div className={clsx(
              'mt-4 rounded-2xl border px-3 py-2 text-sm font-black uppercase tracking-wider',
              funds < 0 ? 'border-rose-500/20 bg-rose-500/10 text-rose-400' : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
            )}>
              {fundsLabel}
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => { hapticSelection(); item.action(); }}
                className={clsx(
                  'relative flex min-h-[46px] w-full items-center gap-3 rounded-2xl px-4 text-left text-sm font-bold transition-all',
                  item.active ? 'bg-primary text-white shadow-lg shadow-primary/15' : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
                )}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {item.badge ? (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-black text-white">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>

          <button
            onClick={() => { impactMedium(); onSimulate(); }}
            className="mt-auto flex min-h-[58px] items-center justify-center gap-3 rounded-[1.5rem] bg-primary px-5 text-sm font-black uppercase tracking-[0.12em] text-white shadow-2xl shadow-primary/20 transition-all active:scale-[0.98]"
          >
            <Play size={20} fill="currentColor" />
            Começar Rodada
          </button>
        </aside>

        <main className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain p-4 pb-36 sm:p-6 sm:pb-40 lg:pb-0 lg:pr-0">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
            <div className="space-y-6">
              <section className="ui-card-premium group relative overflow-hidden p-6 shadow-2xl sm:p-8">
                <div className="pointer-events-none absolute -right-10 -top-10 opacity-[0.05] transition-all group-hover:opacity-[0.1]">
                  <priorityAction.icon size={220} className="rotate-[-10deg] transition-transform duration-1000 group-hover:rotate-0" />
                </div>

                <div className="relative z-10">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="ui-label-caps text-secondary opacity-80">Status do Comando</span>
                    <div className="h-[1px] flex-1 bg-white/10" />
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-background/60 px-2.5 py-1">
                      <div className={clsx(
                        'h-2 w-2 animate-pulse rounded-full',
                        priorityAction.tone === 'rose' ? 'bg-rose-500' : priorityAction.tone === 'amber' ? 'bg-amber-400' : 'bg-primary'
                      )} />
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-white/70">Live</span>
                    </div>
                  </div>

                  <h2 className="mb-3 text-2xl font-black italic leading-tight tracking-tighter text-white sm:text-4xl">
                    {priorityAction.title}
                  </h2>
                  <p className="mb-6 max-w-[90%] text-sm font-medium leading-relaxed text-slate-300">
                    {priorityAction.description}
                  </p>

                  <div className="flex gap-3 sm:gap-4">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { impactLight(); priorityAction.onClick(); }}
                      className={clsx(
                        'flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 text-xs font-bold uppercase tracking-wider shadow-2xl transition-all sm:py-4 sm:text-sm',
                        priorityAction.tone === 'rose' ? 'border-rose-400/20 bg-rose-500 text-white shadow-rose-500/20' :
                          priorityAction.tone === 'amber' ? 'border-amber-400/20 bg-amber-500 text-black shadow-amber-500/20' :
                            'border-primary-light/20 bg-primary text-white shadow-primary/20'
                      )}
                    >
                      {priorityAction.cta}
                      <ChevronRight size={18} />
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { impactLight(); onOpenCalendar(); }}
                      className="flex min-h-[44px] w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-secondary shadow-xl transition-all hover:bg-white/10 hover:text-white sm:w-16"
                      aria-label="Abrir Calendário"
                    >
                      <CalendarDays size={20} />
                    </motion.button>
                  </div>
                </div>
              </section>

              <section className="ui-card-premium group relative overflow-hidden border-white/10 p-6 shadow-2xl sm:p-8">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-rose-400/5 opacity-50" />

                <div className="relative z-10 flex items-center justify-between">
                  <div className="ui-label-caps text-slate-300">Duelo da Rodada</div>
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 shadow-inner">
                    <BarChart3 size={14} className="text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white/80">Série {team.division === 2 ? 'B' : 'A'}</span>
                  </div>
                </div>

                <div className="relative z-10 mt-6 flex items-center justify-between px-2 sm:mt-8 sm:px-4">
                  <div className="flex min-w-0 flex-col items-center gap-3">
                    <TeamLogo team={team} size="xl" className="drop-shadow-[0_0_20px_rgba(31,177,133,0.2)]" />
                    <span className="max-w-[120px] truncate text-center text-xs font-black uppercase italic tracking-wider text-white sm:text-sm">{team.shortName || team.name}</span>
                  </div>

                  <div className="flex shrink-0 flex-col items-center gap-2 px-3">
                    <span className="select-none text-4xl font-black italic tracking-tighter text-white/10 drop-shadow-sm sm:text-5xl">VS</span>
                    <div className="h-[2px] w-10 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </div>

                  <div className="flex min-w-0 flex-col items-center gap-3">
                    <TeamLogo team={nextOpponent} size="xl" className="opacity-90 grayscale-[0.3] transition-all group-hover:grayscale-0" />
                    <span className="max-w-[120px] truncate text-center text-xs font-black uppercase italic tracking-wider text-slate-300 sm:text-sm">{nextOpponent.shortName || nextOpponent.name}</span>
                  </div>
                </div>

                <motion.div
                  className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/60 p-3.5 transition-all group-hover:border-primary/20 sm:rounded-3xl sm:p-4"
                  key={currentReactionIdx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner sm:h-10 sm:w-10 sm:rounded-2xl">
                    <MessageSquare size={18} />
                  </div>
                  <p className="text-sm font-medium italic leading-relaxed text-slate-300">
                    "{fanReactions[currentReactionIdx]}"
                  </p>
                </motion.div>
              </section>

              <section className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                <motion.div whileHover={{ y: -2 }} className="ui-card-premium flex flex-col justify-between border-white/10 p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Shield size={18} className="text-primary" />
                      <span className="ui-label-caps text-secondary">Identidade Tática</span>
                    </div>
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-primary">
                      {team.formation}
                    </span>
                  </div>

                  <div className="mb-6 space-y-1">
                    <div className="text-xl font-black uppercase italic tracking-tight text-white">{team.style}</div>
                    <div className="text-sm text-slate-400">Postura definida para o próximo duelo</div>
                  </div>

                  <button
                    onClick={() => { impactLight(); onOpenTactics(); }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-white/10"
                  >
                    <Zap size={14} className="text-amber-400" />
                    <span>Ajustar Tática</span>
                  </button>
                </motion.div>

                <motion.div whileHover={{ y: -2 }} className="ui-card-premium flex flex-col justify-between border-white/10 p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-primary" />
                      <span className="ui-label-caps text-secondary">Próximo Desafio</span>
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Rodada {round}</span>
                  </div>

                  <div className="mb-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl border border-white/5 bg-black/20 p-3">
                    <div className="flex min-w-0 flex-col items-center gap-2 text-center">
                      <TeamLogo team={team} size="md" />
                      <span className="text-xs font-bold text-slate-400">Mandante</span>
                      <span className="text-base font-black uppercase text-white">{team.shortName || team.name}</span>
                    </div>
                    <span className="shrink-0 text-xs font-black italic text-slate-500">VS</span>
                    <div className="flex min-w-0 flex-col items-center gap-2 text-center">
                      <TeamLogo team={nextOpponent} size="md" />
                      <span className="text-xs font-bold text-slate-400">Visitante</span>
                      <span className="text-base font-black uppercase text-white">{nextOpponent.shortName || nextOpponent.name}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => { impactLight(); onOpenCalendar(); }}
                    className="flex w-full items-center justify-center rounded-xl border border-white/5 bg-white/5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-white/10"
                  >
                    Ver Calendário
                  </button>
                </motion.div>
              </section>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
              <section className="grid grid-cols-2 gap-4 lg:grid-cols-1">
                <div className="ui-card-premium flex flex-col gap-3 bg-gradient-to-br from-white/[0.03] to-transparent p-5 sm:p-6">
                  <div className="flex items-center gap-2 opacity-80">
                    <Heart size={16} className={clsx(team.moral > 60 ? 'text-primary' : 'text-rose-500')} />
                    <span className="ui-label-caps text-xs">Confiança</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black italic tracking-tighter text-white sm:text-3xl">{team.moral}%</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Elenco</span>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { impactLight(); onOpenNews(); }}
                  className="ui-card-premium group flex flex-col gap-3 p-5 text-left hover:bg-white/[0.08] sm:p-6"
                >
                  <div className="flex items-center gap-2 opacity-80">
                    <Newspaper size={16} className="text-blue-400" />
                    <span className="ui-label-caps text-xs">Comunicados</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black italic tracking-tighter text-white sm:text-3xl">{unreadNewsCount}</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Avisos</span>
                    </div>
                    {unreadNewsCount > 0 && <div className="h-2.5 w-2.5 animate-ping rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />}
                  </div>
                </motion.button>
              </section>

              <section className="space-y-3">
                <span className="ui-label-caps block px-1 text-secondary">Ações de Gestão</span>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {quickActions.map((action) => (
                    <motion.button
                      key={action.label}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { impactLight(); action.onClick(); }}
                      className="ui-card-premium group flex min-h-[96px] items-center gap-4 border-white/10 p-5 text-left transition-all hover:bg-white/[0.08]"
                    >
                      <div className={clsx('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-xl transition-transform group-hover:scale-110', action.color)}>
                        <action.icon size={24} />
                      </div>
                      <div className="min-w-0">
                        <div className="mb-0.5 text-base font-black uppercase italic tracking-tight text-white">{action.label}</div>
                        <div className="text-xs font-semibold leading-tight text-slate-400">{action.description}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </section>

              <section className="space-y-3">
                <span className="ui-label-caps block px-1 text-secondary">Clube</span>
                <div className="grid grid-cols-2 gap-3">
                  {clubActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => {
                        if (!action.onClick) return;
                        impactLight();
                        action.onClick();
                      }}
                      disabled={!action.onClick}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition-all hover:bg-white/[0.08] disabled:opacity-40"
                    >
                      <div className={clsx('mb-3 flex h-10 w-10 items-center justify-center rounded-xl', action.color)}>
                        <action.icon size={20} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-[0.12em] text-white">{action.label}</span>
                    </button>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </main>
      </div>

      <footer className="fixed bottom-0 left-0 z-50 w-full pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pointer-events-none lg:hidden">
        <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-[var(--color-bg,#020617)] via-[var(--color-bg,#020617)]/95 to-transparent" />

        <div className="relative mx-auto max-w-md px-3 pt-4 pointer-events-auto sm:px-6">
          <nav className="relative flex w-full items-center justify-between rounded-[2rem] border border-white/15 bg-[var(--color-surface,#0f172a)] px-2 py-2 shadow-[0_15px_40px_rgba(0,0,0,0.9)]">
            {navItems.slice(0, 3).map((item) => (
              <button
                key={item.label}
                onClick={() => { hapticSelection(); item.action(); }}
                className={clsx(
                  'relative flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 py-1 transition-all active:scale-90',
                  item.active ? 'text-primary' : 'text-slate-400 hover:text-white'
                )}
              >
                <item.icon size={19} />
                <span className="text-[11px] font-black uppercase tracking-wider">{item.label}</span>
                {item.active && <motion.div layoutId="nav-glow" className="absolute -bottom-1 h-0.5 w-4 rounded-full bg-primary shadow-[0_0_8px_rgba(31,177,133,1)]" />}
              </button>
            ))}

            <div className="relative flex flex-1 shrink-0 flex-col items-center justify-center px-1">
              <motion.button
                whileTap={{ scale: 0.94 }}
                animate={{
                  boxShadow: ['0 0 12px rgba(31,177,133,0.4)', '0 0 26px rgba(31,177,133,0.7)', '0 0 12px rgba(31,177,133,0.4)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
                onClick={() => { impactMedium(); onSimulate(); }}
                aria-label="Começar Rodada"
                title="Começar Rodada"
                className="-mt-6 flex flex-col items-center justify-center transition-all"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-[var(--color-bg,#020617)] bg-primary shadow-2xl">
                  <Play size={24} fill="currentColor" className="ml-0.5 text-white" />
                </div>
                <span className="mt-1 whitespace-nowrap text-center text-[11px] font-black uppercase tracking-wider text-emerald-400 drop-shadow-md">
                  Rodada
                </span>
              </motion.button>
            </div>

            {navItems.slice(3).map((item) => (
              <button
                key={item.label}
                onClick={() => { hapticSelection(); item.action(); }}
                className="relative flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 py-1 text-slate-400 transition-all hover:text-white active:scale-90"
              >
                <item.icon size={19} />
                <span className="text-[11px] font-black uppercase tracking-wider">{item.label}</span>
                {item.badge ? (
                  <div className="absolute right-[10%] top-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[var(--color-surface,#0f172a)] bg-rose-500 text-[10px] font-bold text-white shadow-md">
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
