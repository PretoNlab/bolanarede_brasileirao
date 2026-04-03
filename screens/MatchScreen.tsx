
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TeamLogo } from '../components/TeamLogo';
import { Team, MatchEvent, PlayingStyle, FormationType } from '../types';
import { Play, Pause, ArrowRightLeft, Settings2, X, Activity, MessageSquare, Zap, Target, Shield, Info, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

// --- DYNAMIC PITCH COMPONENT (JUICE v2) ---
interface PitchProps {
   isDanger: boolean;
   attackingTeamId: string | null;
   homeTeamId: string;
   momentum: number; // 0-100
   isGoalAnimation: boolean;
   shoutActive: string | null;
}

const Pitch2D = ({ isDanger, attackingTeamId, homeTeamId, momentum, isGoalAnimation, shoutActive }: PitchProps) => {
   const isHomeAttacking = attackingTeamId === homeTeamId;

   // Calculate ball position: 5% padding on each side, momentum mapped to 5-95%
   const ballPosition = 5 + (momentum * 0.9);

   return (
      <div className={clsx(
         "relative w-full h-24 bg-emerald-950/40 rounded-2xl border border-emerald-500/20 overflow-hidden backdrop-blur-md mb-2 transition-all duration-500",
         isGoalAnimation && "ring-4 ring-yellow-400 animate-pulse shadow-[0_0_30px_rgba(250,204,21,0.5)]"
      )}>
         {/* Field Grass Texture / Scanning */}
         <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.02)_50%,transparent_100%)] w-[200%] h-full animate-[scan_4s_linear_infinite]" />

         {/* Pressure Zones (Glow) */}
         <div
            className="absolute inset-y-0 left-0 bg-primary/10 blur-3xl transition-all duration-1000"
            style={{ width: `${momentum}%` }}
         />
         <div
            className="absolute inset-y-0 right-0 bg-emerald-500/5 blur-3xl transition-all duration-1000"
            style={{ width: `${100 - momentum}%` }}
         />

         {/* Center Line & Circle */}
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[1px] h-full bg-white/5" />
            <div className="w-12 h-12 rounded-full border border-white/5" />
         </div>

         {/* BALL */}
         <div
            className={clsx(
               "absolute top-1/2 -translate-y-1/2 w-4 h-4 transition-all duration-700 ease-in-out z-10",
               isDanger ? "scale-150" : "scale-100"
            )}
            style={{ left: `${ballPosition}%` }}
         >
            {isDanger && (
               <div className="absolute inset-0 bg-white/30 rounded-full animate-ping scale-150" />
            )}
            <div className={clsx(
               "w-full h-full rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.8)]",
               isDanger ? "bg-white" : "bg-white/80"
            )}>
               <div className="w-1.5 h-1.5 bg-emerald-900 rounded-full opacity-20" />
            </div>
         </div>

         {/* Tactical Shout Indicator */}
         {shoutActive && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 rounded-full border border-white/10 animate-bounce">
               <span className="text-[8px] font-black uppercase tracking-tighter text-primary flex items-center gap-1">
                  <Zap size={8} /> {shoutActive}
               </span>
            </div>
         )}
      </div>
   );
};

interface Props {
   homeTeam: Team;
   awayTeam: Team;
   round: number;
   ddaFactor: number;
   onFinish: (homeScore: number, awayScore: number, events: MatchEvent[]) => void;
   mode?: 'league' | 'worldcup';
   wcPhase?: string;
}

interface Narration {
   minute: number;
   text: string;
   type: 'neutral' | 'danger' | 'goal' | 'event';
   teamId?: string;
}

export default function MatchScreen({ homeTeam: initialHomeTeam, awayTeam: initialAwayTeam, round, ddaFactor, onFinish, mode = 'league', wcPhase }: Props) {
   const [minute, setMinute] = useState(0);
   const [homeScore, setHomeScore] = useState(0);
   const [awayScore, setAwayScore] = useState(0);
   const [isFinished, setIsFinished] = useState(false);
   const [isPaused, setIsPaused] = useState(true);
   const [speed, setSpeed] = useState<1 | 10 | 100>(10);
   const [gameState, setGameState] = useState<'1H' | 'HT' | '2H' | 'FT'>('1H');
   const [stoppageTime, setStoppageTime] = useState(Math.floor(Math.random() * 3) + 1);

   const [homeTeam, setHomeTeam] = useState<Team>({ ...initialHomeTeam });
   const [currentStyle, setCurrentStyle] = useState<PlayingStyle>(initialHomeTeam.style);
   const [currentFormation, setCurrentFormation] = useState<FormationType>(initialHomeTeam.formation);
   const [shoutActive, setShoutActive] = useState<string | null>(null);

   const [feed, setFeed] = useState<Narration[]>([]);
   const [matchEvents, setMatchEvents] = useState<MatchEvent[]>([]);
   const [stats, setStats] = useState({
      homeShots: 0,
      awayShots: 0,
      possession: 50,
      momentum: 50
   });

   const [isDanger, setIsDanger] = useState(false);
   const [dangerTeamId, setDangerTeamId] = useState<string | null>(null);
   const [isGoalAnimation, setIsGoalAnimation] = useState(false);

   const [showTacticsModal, setShowTacticsModal] = useState(false);
   const [showSubModal, setShowSubModal] = useState(false);
   const [selectedSubOut, setSelectedSubOut] = useState<string | null>(null);

   const feedRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (feedRef.current) {
         feedRef.current.scrollTop = feedRef.current.scrollHeight;
      }
   }, [feed]);

   const addNarration = (text: string, type: Narration['type'] = 'neutral', teamId?: string) => {
      setFeed(prev => [...prev, { minute, text, type, teamId }]);
   };

   const matchPulse = useMemo(() => {
      if (isDanger && dangerTeamId === homeTeam.id) {
         return {
            title: `${homeTeam.shortName} pressiona agora`,
            copy: 'Momento de volume ofensivo. Segure o ritmo ou acelere se quiser converter a pressão em gol.',
            tone: 'primary'
         } as const;
      }

      if (isDanger && dangerTeamId === initialAwayTeam.id) {
         return {
            title: `${initialAwayTeam.shortName} cresce na partida`,
            copy: 'Seu time está sob pressão. Ajuste mentalidade ou prepare troca se a energia estiver caindo.',
            tone: 'danger'
         } as const;
      }

      if (stats.momentum >= 62) {
         return {
            title: `${homeTeam.shortName} controla o jogo`,
            copy: 'A posse e o território favorecem o mandante. É um bom momento para sustentar a vantagem.',
            tone: 'primary'
         } as const;
      }

      if (stats.momentum <= 38) {
         return {
            title: `${initialAwayTeam.shortName} dita o ritmo`,
            copy: 'O visitante está confortável. Pense em mudar a partida com tática ou substituição.',
            tone: 'danger'
         } as const;
      }

      return {
         title: 'Partida equilibrada',
         copy: 'O jogo ainda está aberto. Observe energia, momentum e tempo antes de forçar uma decisão.',
         tone: 'neutral'
      } as const;
   }, [dangerTeamId, homeTeam.id, homeTeam.shortName, initialAwayTeam.id, initialAwayTeam.shortName, isDanger, stats.momentum]);

   const pickRandomLineupPlayer = (team: Team) => {
      const lineupPlayers = team.roster.filter(p => team.lineup.includes(p.id));
      const pool = lineupPlayers.length ? lineupPlayers : team.roster;
      return pool[Math.floor(Math.random() * Math.max(1, pool.length))];
   };

   const maybePickAssistant = (team: Team, scorerName?: string) => {
      const lineupPlayers = team.roster.filter(p => team.lineup.includes(p.id));
      const pool = (lineupPlayers.length ? lineupPlayers : team.roster).filter(p => p.name !== scorerName);
      if (!pool.length) return undefined;
      return pool[Math.floor(Math.random() * pool.length)];
   };

   const getStochasticEvent = (momentum: number) => {
      const isHomeAttacking = Math.random() < (momentum / 100);
      const attackingTeam = isHomeAttacking ? homeTeam : initialAwayTeam;
      const defendingTeam = isHomeAttacking ? initialAwayTeam : homeTeam;

      const scenarios = [
         `O ${attackingTeam.shortName} trabalha a bola no meio de campo.`,
         `Troca de passes paciente do ${attackingTeam.shortName}.`,
         `${defendingTeam.shortName} se defende como pode!`,
         `Jogo muito truncado nesta fase da partida.`,
         `O técnico do ${attackingTeam.shortName} pede mais velocidade!`
      ];

      const dangerScenarios = [
         `OLHA O PERIGO! ${attackingTeam.shortName} chega forte pela ala!`,
         `Lançamento longo para o ataque do ${attackingTeam.shortName}...`,
         `QUE CHANCE! O goleiro do ${defendingTeam.shortName} faz uma defesa espetacular!`,
         `SUBIU A BANDEIRA! Impedimento do ${attackingTeam.shortName}.`,
         `A bola sobra na entrada da área...`
      ];

      if (Math.random() < 0.15) {
         addNarration(dangerScenarios[Math.floor(Math.random() * dangerScenarios.length)], 'danger', attackingTeam.id);
         setStats(s => ({
            ...s,
            homeShots: isHomeAttacking ? s.homeShots + 1 : s.homeShots,
            awayShots: !isHomeAttacking ? s.awayShots + 1 : s.awayShots
         }));

         let goalProb = 0.2;
         if (isHomeAttacking && currentStyle === 'Ofensivo') goalProb = 0.3;
         if (isHomeAttacking && currentStyle === 'Tudo-ou-Nada') goalProb = 0.45;

         if (Math.random() < goalProb) {
            const scorer = pickRandomLineupPlayer(attackingTeam);
            if (!scorer) return;
            const assister = maybePickAssistant(attackingTeam, scorer?.name);

            if (isHomeAttacking) setHomeScore(s => s + 1);
            else setAwayScore(s => s + 1);

            const goalText = assister
               ? `GOOOOOOOOOL DO ${attackingTeam.shortName}! ${scorer.name} (assist. ${assister.name})`
               : `GOOOOOOOOOL DO ${attackingTeam.shortName}! ${scorer.name}`;

            addNarration(goalText, 'goal', attackingTeam.id);
            setMatchEvents(prev => [
               ...prev,
               {
                  minute,
                  type: 'goal',
                  teamId: attackingTeam.id,
                  playerName: scorer.name,
                  assistName: assister?.name,
                  description: goalText,
               },
            ]);
            toast.success(`GOL DO ${attackingTeam.shortName}!`, { icon: '⚽' });
            setStats(s => ({ ...s, momentum: 50 })); 

            setIsGoalAnimation(true);
            setTimeout(() => setIsGoalAnimation(false), 3000);

            try { Haptics.notification({ type: NotificationType.Success }); } catch { }
         }
      } else {
         if (Math.random() < 0.4) {
            addNarration(scenarios[Math.floor(Math.random() * scenarios.length)], 'neutral');
         }
      }

      if (Math.random() < 0.15) {
         setIsDanger(true);
         setDangerTeamId(attackingTeam.id);
         try { Haptics.impact({ style: ImpactStyle.Light }); } catch { }
         setTimeout(() => setIsDanger(false), 3000);
      }
   };

   useEffect(() => {
      let interval: ReturnType<typeof setInterval>;
      if (!isPaused && (gameState === '1H' || gameState === '2H')) {
         const intervalTime = speed === 1 ? 1500 : (speed === 10 ? 300 : 80);
         interval = setInterval(() => {
            setMinute(m => {
               const nextMinute = m + 1;

               if (gameState === '1H' && nextMinute > 45 + stoppageTime) {
                  setGameState('HT');
                  setIsPaused(true);
                  addNarration("FIM DO PRIMEIRO TEMPO!", 'event');
                  return 45;
               }
               if (gameState === '2H' && nextMinute > 90 + stoppageTime) {
                  setGameState('FT');
                  setIsFinished(true);
                  setIsPaused(true);
                  addNarration("FINAL DE PARTIDA!", 'event');
                  try { Haptics.notification({ type: NotificationType.Warning }); } catch { }
                  return 90;
               }

               let bias = 0;
               if (currentStyle === 'Ofensivo') bias = 5;
               if (currentStyle === 'Defensivo') bias = -5;
               if (shoutActive === 'Pressionar') bias += 10;
               bias -= (ddaFactor - 1.0) * 25;

               const shift = (Math.random() * 20 - 10) + bias;
               const newMomentum = Math.min(95, Math.max(5, stats.momentum + shift));

               setStats(prev => ({
                  ...prev,
                  momentum: newMomentum,
                  possession: Math.round(prev.possession * 0.95 + (newMomentum * 0.05))
               }));

               getStochasticEvent(newMomentum);

               return nextMinute;
            });
         }, intervalTime);
      }
      return () => clearInterval(interval);
   }, [gameState, isPaused, speed, stats.momentum, currentStyle, shoutActive, stoppageTime]);

   const handleSubstitution = (outId: string, inId: string) => {
      setHomeTeam(prev => ({ ...prev, lineup: prev.lineup.map(id => id === outId ? inId : id) }));
      setShowSubModal(false);
      setSelectedSubOut(null);
      const pIn = homeTeam.roster.find(p => p.id === inId);
      const pOut = homeTeam.roster.find(p => p.id === outId);
      addNarration(`SUBSTITUIÇÃO: Sai ${pOut?.name}, entra ${pIn?.name}.`, 'event', homeTeam.id);
      toast.success("Substituição confirmada!");
   };

   return (
      <div className="flex flex-col h-screen bg-background text-white relative font-sans overflow-hidden">

         {/* 1. INFO HEADER (TV BROADCAST STYLE) */}
         {!showSubModal && !showTacticsModal && (
            <header className="bg-black py-4 px-8 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.22em] border-b border-white/5 z-30 pt-safe">
               <div className="text-white/40 flex items-center gap-4">
                  {mode === 'worldcup' ? (
                     <>
                        <span className="text-primary italic tracking-tight">Copa do Mundo 2026</span>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <span>{wcPhase || `Rodada ${round}`}</span>
                     </>
                  ) : (
                     <>
                        <span className="text-white/60">Brasileiro • D1</span>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <span>Rodada {round}</span>
                     </>
                  )}
               </div>
               <div className="flex items-center gap-4">
                  <span className="text-primary italic text-lg tracking-tighter">{minute}'</span>
                  <div className="w-1 h-1 rounded-full bg-white/10" />
                  <span className="text-white/40">{gameState === '1H' ? '1ºT' : gameState === 'HT' ? 'INT' : '2ºT'}</span>
               </div>
            </header>
         )}

         {/* 2. MODERN HORIZONTAL SCOREBOARD */}
         {!showSubModal && !showTacticsModal && (
            <div className="bg-black/90 backdrop-blur-xl relative overflow-hidden py-4 px-6 flex justify-between items-center border-b border-white/10 shadow-2xl flex-none z-20">
               <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 0.5px, transparent 0)', backgroundSize: '10px 10px' }} />

               {/* Team Home */}
               <div className="flex items-center gap-3 w-1/3">
                  <TeamLogo team={homeTeam} size="md" className="border-primary/40 shadow-primary/20" />
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black uppercase text-white/30 tracking-widest leading-none mb-1">CASA</span>
                     <span className="text-sm font-black italic uppercase tracking-tighter text-white truncate max-w-[80px]">
                       {homeTeam.shortName || homeTeam.name}
                     </span>
                  </div>
                  <div className="ml-auto bg-primary/20 px-3 py-1 rounded-lg border border-primary/30">
                     <span className="text-xl font-black text-white tabular-nums drop-shadow-sm">{homeScore}</span>
                  </div>
               </div>

               {/* Divider */}
               <div className="flex flex-col items-center justify-center px-4">
                  <div className="w-[1px] h-8 bg-white/10" />
               </div>

               {/* Team Away */}
               <div className="flex items-center gap-3 w-1/3 flex-row-reverse text-right">
                  <TeamLogo team={initialAwayTeam} size="md" className="border-emerald-500/40 shadow-emerald-500/20" />
                  <div className="flex flex-col items-end">
                     <span className="text-[9px] font-black uppercase text-white/30 tracking-widest leading-none mb-1">FORA</span>
                     <span className="text-sm font-black italic uppercase tracking-tighter text-white truncate max-w-[80px]">
                       {initialAwayTeam.shortName || initialAwayTeam.name}
                     </span>
                  </div>
                  <div className="mr-auto bg-emerald-500/20 px-3 py-1 rounded-lg border border-emerald-500/30">
                     <span className="text-xl font-black text-white tabular-nums drop-shadow-sm">{awayScore}</span>
                  </div>
               </div>
            </div>
         )}

         {/* 3. LIVE HIGHLIGHT & EVENTS */}
         {!showSubModal && !showTacticsModal && (
            <div className="px-6 py-4 space-y-3 flex-none z-10 bg-black/40 border-b border-white/5">
               <div className={clsx(
                  "rounded-[1.6rem] border px-4 py-3",
                  matchPulse.tone === 'primary' ? "border-primary/20 bg-primary/10" :
                  matchPulse.tone === 'danger' ? "border-rose-500/18 bg-rose-500/10" :
                  "border-white/8 bg-white/5"
               )}>
                  <div className="flex items-start justify-between gap-4">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-secondary">Leitura rápida</p>
                        <h3 className="mt-1 text-[16px] font-black tracking-tight text-white">{matchPulse.title}</h3>
                        <p className="mt-1 text-[12px] leading-5 text-white/68">{matchPulse.copy}</p>
                     </div>
                     <div className={clsx(
                        "rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]",
                        matchPulse.tone === 'primary' ? "bg-primary/18 text-primary-light" :
                        matchPulse.tone === 'danger' ? "bg-rose-500/16 text-rose-200" :
                        "bg-white/8 text-white/55"
                     )}>
                        {isPaused ? 'Pausado' : `${speed}x`}
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  {/* Home Events */}
                  <div className="bg-white/5 rounded-2xl p-3 border border-white/10 min-h-[62px] max-h-[92px] overflow-y-auto no-scrollbar flex flex-col gap-2 shadow-inner">
                     {matchEvents.filter(e => e.teamId === homeTeam.id).length === 0 && (
                        <span className="text-[11px] text-white/18 font-bold uppercase tracking-[0.14em] text-center py-2 opacity-60">Sem lances decisivos</span>
                     )}
                     {matchEvents.filter(e => e.teamId === homeTeam.id).map((event, idx) => (
                        <div key={idx} className="flex items-center gap-2 animate-in slide-in-from-left-2 duration-300">
                           <span className="text-sm">{event.type === 'goal' ? '⚽' : event.type === 'card' ? (event.description.includes('vermelho') ? '🟥' : '🟨') : '🚑'}</span>
                           <span className="text-[12px] font-black text-white/70 truncate tracking-tight">{event.description.split(' - ')[0].replace('GOOOOOOOOOOOL! ', 'GOL! ')}</span>
                           <span className="text-[11px] font-bold text-primary/60 tabular-nums ml-auto">{event.minute}'</span>
                        </div>
                     ))}
                  </div>

                  {/* Away Events */}
                  <div className="bg-white/5 rounded-2xl p-3 border border-white/10 min-h-[62px] max-h-[92px] overflow-y-auto no-scrollbar flex flex-col gap-2 shadow-inner">
                     {matchEvents.filter(e => e.teamId === initialAwayTeam.id).length === 0 && (
                        <span className="text-[11px] text-white/18 font-bold uppercase tracking-[0.14em] text-center py-2 opacity-60">Sem lances decisivos</span>
                     )}
                     {matchEvents.filter(e => e.teamId === initialAwayTeam.id).map((event, idx) => (
                        <div key={idx} className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-300">
                           <span className="text-[11px] font-bold text-emerald-400/60 tabular-nums">{event.minute}'</span>
                           <span className="text-[12px] font-black text-white/70 truncate tracking-tight flex-1 text-right">{event.description.split(' - ')[0].replace('GOOOOOOOOOOOL! ', 'GOL! ')}</span>
                           <span className="text-sm ml-1">{event.type === 'goal' ? '⚽' : event.type === 'card' ? (event.description.includes('vermelho') ? '🟥' : '🟨') : '🚑'}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         )}

         {/* 4. MAIN FEED & STATS */}
         {!showSubModal && !showTacticsModal && (
            <main className="flex-1 flex flex-col p-6 space-y-6 overflow-hidden">

               <Pitch2D isDanger={isDanger} attackingTeamId={dangerTeamId} homeTeamId={homeTeam.id} momentum={stats.momentum} isGoalAnimation={isGoalAnimation} shoutActive={shoutActive} />

               {/* Momentum Strip */}
               <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/10 shadow-2xl">
                  <div className="flex justify-between items-center text-[11px] font-black uppercase text-white/30 mb-3 tracking-[0.14em] px-1">
                     <span className="text-primary/60">{homeTeam.shortName}</span>
                     <span className="opacity-50">Momentum</span>
                     <span className="text-emerald-400/60">{initialAwayTeam.shortName}</span>
                  </div>
                  <div className="h-1.5 bg-black/60 rounded-full overflow-hidden relative shadow-inner">
                     <div
                        className="absolute inset-y-0 bg-gradient-to-r from-primary to-emerald-500 transition-all duration-1000 ease-in-out"
                        style={{ left: '0', width: `${stats.momentum}%` }}
                     ></div>
                  </div>
                  <div className="grid grid-cols-3 mt-5 px-2">
                     <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-black tabular-nums text-white/90">{stats.possession}%</span>
                        <span className="text-[10px] text-white/28 uppercase font-black tracking-[0.14em]">Posse</span>
                     </div>
                     <div className="flex flex-col gap-0.5 border-x border-white/5 text-center">
                        <span className="text-[12px] font-bold uppercase tracking-tight italic text-primary/80">{currentStyle}</span>
                        <span className="text-[10px] text-white/28 uppercase font-black tracking-[0.14em]">Estilo</span>
                     </div>
                     <div className="flex flex-col gap-0.5 text-right">
                        <span className="text-sm font-black tabular-nums text-white/90">{stats.homeShots} - {stats.awayShots}</span>
                        <span className="text-[10px] text-white/28 uppercase font-black tracking-[0.14em]">Finaliz.</span>
                     </div>
                  </div>
               </div>

               {/* Narration Feed */}
               <div
                  ref={feedRef}
                  className="flex-1 bg-black/20 rounded-[40px] border border-white/5 overflow-y-auto p-6 space-y-4 no-scrollbar shadow-inner relative"
               >
                  {feed.length === 0 && (
                     <div className="h-full flex flex-col items-center justify-center text-white/8 gap-6">
                        <MessageSquare size={56} strokeWidth={1} />
                        <p className="text-[11px] font-black uppercase tracking-[0.28em] italic text-center px-10 leading-relaxed">
                           O jogo vai começar...
                        </p>
                     </div>
                  )}
                  {feed.map((msg, i) => (
                     <div key={i} className={clsx(
                        "animate-in fade-in slide-in-from-bottom-4 duration-500",
                        msg.type === 'goal' ? "bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-3xl shadow-xl shadow-emerald-500/5" :
                           msg.type === 'danger' ? "bg-rose-500/10 border-l-4 border-rose-500 px-5 py-3 rounded-r-2xl" :
                           msg.type === 'event' ? "bg-white/4 border border-white/6 px-5 py-3 rounded-2xl" : "px-2"
                     )}>
                        <div className="flex items-start gap-4">
                           <span className="text-[11px] font-black text-white/28 mt-1 tabular-nums tracking-tight">{msg.minute}'</span>
                           <p className={clsx(
                              "leading-relaxed tracking-tight",
                              msg.type === 'goal' ? "text-emerald-300 font-black italic text-[22px]" :
                                 msg.type === 'danger' ? "text-rose-200 font-bold text-[15px]" :
                                    msg.type === 'event' ? "text-primary-light font-black text-[13px] uppercase tracking-[0.12em]" : "text-white/84 font-medium text-[15px]"
                           )}>
                              {msg.text}
                           </p>
                        </div>
                     </div>
                  ))}
               </div>
            </main>
         )}

         {/* Speed controls */}
         {!showSubModal && !showTacticsModal && (
            <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-2 z-10">
               <button onClick={() => setIsPaused(!isPaused)} className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all">
                  {isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
               </button>
               <button onClick={() => setSpeed(s => s === 1 ? 10 : (s === 10 ? 100 : 1))} className="w-12 h-12 bg-surface border border-white/10 rounded-full flex items-center justify-center text-[10px] font-black shadow-xl">
                  {speed}x
               </button>
            </div>
         )}

         {/* Real-time Footer Management */}
         {!isFinished && !showSubModal && !showTacticsModal && (
            <div className="p-6 bg-surface/60 backdrop-blur-3xl border-t border-white/5 space-y-4 pb-safe z-40">
               <div className="flex gap-2.5">
                  {['Pressionar', 'Acalmar', 'Explorar Alas'].map(shout => (
                     <button key={shout} onClick={() => {
                           setShoutActive(shout === shoutActive ? null : shout);
                           if (shout !== shoutActive) toast(`Gritando: ${shout.toUpperCase()}!`, { icon: '📣' });
                        }}
                        className={clsx(
                           "flex-1 py-4.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.14em] transition-all active:scale-95 border",
                           shoutActive === shout ? "bg-primary border-primary text-white shadow-xl shadow-primary/20" : "bg-white/5 text-secondary border-white/5"
                        )}
                     >
                        {shout}
                     </button>
                  ))}
               </div>
               <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { setIsPaused(true); setShowTacticsModal(true); }} className="bg-surface/40 py-4.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.12em] flex items-center justify-center gap-3 border border-white/5 active:bg-white/5 transition-all">
                     <Settings2 size={16} className="text-primary" /> MUDAR TÁTICA
                  </button>
                  <button onClick={() => { setIsPaused(true); setShowSubModal(true); }} className="bg-emerald-500/10 text-emerald-500 py-4.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.12em] flex items-center justify-center gap-3 border border-emerald-500/20 active:bg-emerald-500/20 transition-all">
                     <ArrowRightLeft size={16} /> SUBSTITUIR
                  </button>
               </div>
            </div>
         )}

         {/* MODAL: INTERVALO */}
         {gameState === 'HT' && !showTacticsModal && !showSubModal && (
            <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-2xl animate-in fade-in duration-300 flex items-center justify-center p-8">
               <div className="w-full max-w-sm bg-surface border border-white/10 rounded-[40px] p-8 flex flex-col items-center gap-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
                  <div className="flex flex-col items-center gap-2">
                     <h4 className="text-3xl font-black italic tracking-tighter text-yellow-500 uppercase leading-none">Intervalo</h4>
                     <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Instruções no Vestiário</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full">
                     <button onClick={() => setShowTacticsModal(true)} className="bg-white/5 py-5 rounded-3xl text-[11px] font-black uppercase flex flex-col items-center gap-3 border border-white/5 active:bg-white/10 transition-all group">
                        <Settings2 size={24} className="text-primary group-active:scale-90 transition-transform" />
                        <span>Tática</span>
                     </button>
                     <button onClick={() => setShowSubModal(true)} className="bg-white/5 py-5 rounded-3xl text-[11px] font-black uppercase flex flex-col items-center gap-3 border border-white/5 active:bg-white/10 transition-all group">
                        <ArrowRightLeft size={24} className="text-emerald-500 group-active:scale-90 transition-transform" />
                        <span>Trocas</span>
                     </button>
                  </div>
                  <button onClick={() => {
                        setGameState('2H');
                        setMinute(45);
                        setStoppageTime(Math.floor(Math.random() * 5) + 2);
                        setIsPaused(false);
                        addNarration("Começa o Segundo Tempo!", 'event');
                     }}
                     className="w-full py-5 bg-white text-black rounded-[24px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all text-xs"
                  >
                     Iniciar 2º Tempo
                  </button>
               </div>
            </div>
         )}

         {/* MODAL: FIM DE PARTIDA */}
         {isFinished && !showTacticsModal && !showSubModal && (
            <div className="fixed inset-0 z-[160] bg-slate-950/95 backdrop-blur-3xl animate-in fade-in duration-500 flex items-center justify-center p-8">
               <div className="w-full max-w-sm flex flex-col items-center gap-10">
                  <div className="flex flex-col items-center gap-6 text-center">
                     <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center border border-white/20 animate-pulse">
                        <Activity size={40} className="text-white" />
                     </div>
                     <h4 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">Fim de Jogo</h4>

                     <div className="flex items-center gap-6 mt-4 bg-white/5 p-6 rounded-[40px] border border-white/5">
                        <div className="flex flex-col items-center gap-3">
                           <TeamLogo team={homeTeam} size="lg" />
                           <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{homeTeam.shortName}</span>
                           <span className="text-5xl font-black text-white tabular-nums">{homeScore}</span>
                        </div>
                        <span className="text-3xl font-black text-white/10 mt-10">-</span>
                        <div className="flex flex-col items-center gap-3">
                           <TeamLogo team={initialAwayTeam} size="lg" />
                           <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{initialAwayTeam.shortName}</span>
                           <span className="text-5xl font-black text-white tabular-nums">{awayScore}</span>
                        </div>
                     </div>
                  </div>

                  <button onClick={() => {
                        const commentary: MatchEvent[] = feed
                           .filter(f => f.type !== 'goal')
                           .slice(-12)
                           .map(f => ({ minute: f.minute, type: 'commentary', description: f.text }));
                        onFinish(homeScore, awayScore, [...matchEvents, ...commentary]);
                     }}
                     className="w-full py-5 bg-white text-slate-900 rounded-[32px] font-black uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all text-xs"
                  >
                     {mode === 'worldcup' ? 'Continuar Torneio' : 'Sair para o CT'}
                  </button>
               </div>
            </div>
         )}

         {/* Modal Tactics */}
         {showTacticsModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-md">
               <div className="w-full max-w-sm bg-surface border border-white/10 rounded-[48px] p-10 space-y-8 animate-in zoom-in duration-300">
                  <div className="flex justify-between items-center">
                     <h3 className="text-xl font-black italic tracking-tighter">PRANCHETA</h3>
                     <button onClick={() => setShowTacticsModal(false)}><X size={20} /></button>
                  </div>
                  <div className="space-y-6">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Mentalidade</label>
                        <div className="grid grid-cols-2 gap-2">
                           {['Defensivo', 'Equilibrado', 'Ofensivo', 'Tudo-ou-Nada'].map(s => (
                              <button key={s} onClick={() => setCurrentStyle(s as any)}
                                 className={clsx("py-3 rounded-xl text-[11px] font-black border transition-all", currentStyle === s ? "bg-primary border-primary text-white" : "bg-background border-white/5 text-secondary")}
                              >
                                 {s}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>
                  <button onClick={() => { setShowTacticsModal(false); setIsPaused(false); }} className="w-full py-5 bg-white text-slate-900 rounded-3xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Confirmar</button>
               </div>
            </div>
         )}

         {/* Modal Subs */}
         {showSubModal && (
            <div className="fixed inset-0 z-[200] bg-slate-950 pt-safe flex flex-col">
               <header className="p-6 border-b border-white/10 flex items-center justify-between">
                  <button onClick={() => { setShowSubModal(false); setIsPaused(false); }} className="p-2"><X size={24} /></button>
                  <h3 className="text-xl font-black italic tracking-tighter">SUBSTITUIÇÕES</h3>
                  <div className="w-10"></div>
               </header>
               <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                  <div className="space-y-2">
                     <h4 className="text-[10px] font-black text-secondary uppercase tracking-widest px-2">Quem sai?</h4>
                     {homeTeam.lineup.map(id => homeTeam.roster.find(p => p.id === id)).filter(Boolean).map(player => (
                        <button key={player!.id} onClick={() => setSelectedSubOut(player!.id)}
                           className={clsx("w-full p-4 rounded-2xl border flex items-center justify-between transition-all", selectedSubOut === player!.id ? "bg-rose-500/10 border-rose-500" : "bg-surface border-white/5")}
                        >
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center font-black text-[10px] border border-white/10">{player!.position}</div>
                              <div className="text-left">
                                 <p className="text-sm font-bold">{player!.name}</p>
                                 <span className="text-[10px] text-secondary">⚡ {Math.round(player!.energy)}%</span>
                              </div>
                           </div>
                        </button>
                     ))}
                  </div>
                  {selectedSubOut && (
                     <div className="space-y-2 animate-in slide-in-from-bottom">
                        <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest px-2">Quem entra?</h4>
                        {homeTeam.roster.filter(p => !homeTeam.lineup.includes(p.id) && p.status === 'fit').map(player => (
                           <button key={player.id} onClick={() => handleSubstitution(selectedSubOut, player.id)}
                              className="w-full p-4 bg-surface rounded-2xl border border-emerald-500/20 flex items-center justify-between active:scale-95 transition-all"
                           >
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black text-[10px] border border-emerald-500/20">{player.position}</div>
                                 <div className="text-left">
                                    <p className="text-sm font-bold">{player.name}</p>
                                    <span className="text-[10px] text-secondary">OVR {player.overall}</span>
                                 </div>
                              </div>
                           </button>
                        ))}
                     </div>
                  )}
               </div>
            </div>
         )}
      </div>
   );
}
