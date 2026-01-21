
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Team, MatchEvent, PlayingStyle, FormationType } from '../types';
import { Play, Pause, ArrowRightLeft, Settings2, X, Activity, MessageSquare, Zap, Target, Shield, Info, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface Props {
   homeTeam: Team;
   awayTeam: Team;
   round: number;
   onFinish: (homeScore: number, awayScore: number, events: MatchEvent[]) => void;
}

interface Narration {
   minute: number;
   text: string;
   type: 'neutral' | 'danger' | 'goal' | 'event';
   teamId?: string;
}

export default function MatchScreen({ homeTeam: initialHomeTeam, awayTeam: initialAwayTeam, round, onFinish }: Props) {
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
      momentum: 50 // 0-100 (50 é meio campo)
   });

   const [showTacticsModal, setShowTacticsModal] = useState(false);
   const [showSubModal, setShowSubModal] = useState(false);
   const [selectedSubOut, setSelectedSubOut] = useState<string | null>(null);

   const feedRef = useRef<HTMLDivElement>(null);

   // Auto-scroll para o final do feed
   useEffect(() => {
      if (feedRef.current) {
         feedRef.current.scrollTop = feedRef.current.scrollHeight;
      }
   }, [feed]);

   const addNarration = (text: string, type: Narration['type'] = 'neutral', teamId?: string) => {
      setFeed(prev => [...prev, { minute, text, type, teamId }]);
   };

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

   const pickRandomFromLineup = (team: Team) => {
      const lineupPlayers = team.roster.filter(p => team.lineup.includes(p.id) && p.status === 'fit');
      const pool = lineupPlayers.length ? lineupPlayers : team.roster;
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
         // Chance Real de Gol
         addNarration(dangerScenarios[Math.floor(Math.random() * dangerScenarios.length)], 'danger', attackingTeam.id);
         setStats(s => ({
            ...s,
            homeShots: isHomeAttacking ? s.homeShots + 1 : s.homeShots,
            awayShots: !isHomeAttacking ? s.awayShots + 1 : s.awayShots
         }));

         // Probabilidade de Gol baseada em mentalidade
         let goalProb = 0.2;
         if (isHomeAttacking && currentStyle === 'Ofensivo') goalProb = 0.3;
         if (isHomeAttacking && currentStyle === 'Tudo-ou-Nada') goalProb = 0.45;

         if (Math.random() < goalProb) {
            const scorer = pickRandomLineupPlayer(attackingTeam);
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
            setStats(s => ({ ...s, momentum: 50 })); // Reinicia momentum
         }
      } else {
         // Narração comum
         if (Math.random() < 0.4) {
            addNarration(scenarios[Math.floor(Math.random() * scenarios.length)], 'neutral');
         }
      }
   };

   useEffect(() => {
      let interval: ReturnType<typeof setInterval>;
      // Só roda se não estiver pausado e nem finalizado/intervalo
      if (!isPaused && (gameState === '1H' || gameState === '2H')) {
         const intervalTime = speed === 1 ? 1500 : (speed === 10 ? 300 : 80);
         interval = setInterval(() => {
            setMinute(m => {
               const nextMinute = m + 1;

               // Verificar Fim de Tempo
               if (gameState === '1H' && nextMinute > 45 + stoppageTime) {
                  setGameState('HT');
                  setIsPaused(true);
                  addNarration("FIM DO PRIMEIRO TEMPO! Intervalo.", 'event');
                  return 45;
               }
               if (gameState === '2H' && nextMinute > 90 + stoppageTime) {
                  setGameState('FT');
                  setIsFinished(true);
                  setIsPaused(true);
                  addNarration("APITA O ÁRBITRO! FINAL DE PARTIDA.", 'event');
                  return 90;
               }

               // Lógica de Momentum (Simula o domínio de campo)
               let bias = 0;
               if (currentStyle === 'Ofensivo') bias = 5;
               if (currentStyle === 'Defensivo') bias = -5;
               if (shoutActive === 'Pressionar') bias += 10;

               const shift = (Math.random() * 20 - 10) + bias;
               const newMomentum = Math.min(95, Math.max(5, stats.momentum + shift));

               setStats(prev => ({
                  ...prev,
                  momentum: newMomentum,
                  possession: Math.round(prev.possession * 0.95 + (newMomentum * 0.05))
               }));

               // Gera narração a cada minuto ou a cada 2 minutos
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

   const TeamLogo = ({ team, size = "w-12 h-12" }: { team: Team, size?: string }) => {
      return (
         <div className={`${size} rounded-2xl bg-gradient-to-br ${team.logoColor1} ${team.logoColor2} flex items-center justify-center font-black shadow-lg border border-white/10 text-white`}>
            {team.shortName}
         </div>
      );
   };

   return (
      <div className="flex flex-col h-screen bg-background text-white relative">

         {/* HUD Superior - Placar e Tempo */}
         <header className="bg-surface/50 backdrop-blur-xl border-b border-white/5 p-4 z-20">
            <div className="flex items-center justify-between max-w-lg mx-auto">
               <div className="flex flex-col items-center gap-1 w-20">
                  <TeamLogo team={homeTeam} size="w-12 h-12" />
                  <span className="text-[10px] font-black uppercase text-secondary">Casa</span>
               </div>

               <div className="flex flex-col items-center">
                  <div className="bg-black/40 px-6 py-2 rounded-3xl border border-white/10 flex items-center gap-4 mb-2">
                     <span className="text-4xl font-black italic tabular-nums">{homeScore}</span>
                     <div className="w-[1px] h-8 bg-white/10"></div>
                     <span className="text-4xl font-black italic tabular-nums text-white/40">{awayScore}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-xl font-black italic tabular-nums">{minute}</span>
                     <span className="text-primary animate-pulse font-black text-lg">'</span>
                     {gameState === 'HT' && <span className="ml-2 bg-yellow-500 text-black px-2 py-0.5 rounded text-[10px] font-black uppercase">INT</span>}
                     {stoppageTime > 0 && (gameState === '1H' && minute >= 45 ? <span className="ml-1 text-xs text-emerald-400">+{stoppageTime}</span> : null)}
                     {stoppageTime > 0 && (gameState === '2H' && minute >= 90 ? <span className="ml-1 text-xs text-emerald-400">+{stoppageTime}</span> : null)}
                     <div className="ml-2 bg-white/5 px-2 py-0.5 rounded text-[10px] font-black uppercase text-secondary">Rodada {round}</div>
                  </div>
               </div>

               <div className="flex flex-col items-center gap-1 w-20">
                  <div className="opacity-70">
                     <TeamLogo team={initialAwayTeam} size="w-12 h-12" />
                  </div>
                  <span className="text-[10px] font-black uppercase text-secondary">Fora</span>
               </div>
            </div>
         </header>

         {/* Main Container - Narração e Stats */}
         <main className="flex-1 flex flex-col p-4 space-y-4 overflow-hidden">

            {/* Barra de Momentum (O "Mini-Campo" de dados) */}
            <div className="bg-surface/30 rounded-2xl p-4 border border-white/5">
               <div className="flex justify-between text-[10px] font-black uppercase text-secondary mb-2 tracking-widest px-1">
                  <span>Pressão {homeTeam.shortName}</span>
                  <span>Domínio de Jogo</span>
                  <span>Pressão {initialAwayTeam.shortName}</span>
               </div>
               <div className="h-3 bg-black/40 rounded-full overflow-hidden relative">
                  <div
                     className="absolute inset-y-0 bg-primary transition-all duration-1000 ease-in-out"
                     style={{ left: '0', width: `${stats.momentum}%` }}
                  ></div>
                  <div className="absolute inset-0 flex justify-center items-center">
                     <div className="w-0.5 h-full bg-white/20"></div>
                  </div>
               </div>
               <div className="grid grid-cols-3 mt-4 text-center">
                  <div className="flex flex-col">
                     <span className="text-xs font-black">{stats.possession}%</span>
                     <span className="text-[8px] text-secondary uppercase font-bold tracking-tighter">Posse</span>
                  </div>
                  <div className="flex flex-col border-x border-white/5">
                     <span className="text-xs font-black">{currentStyle}</span>
                     <span className="text-[8px] text-secondary uppercase font-bold tracking-tighter">Mentalidade</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-xs font-black">{stats.homeShots} - {stats.awayShots}</span>
                     <span className="text-[8px] text-secondary uppercase font-bold tracking-tighter">Finalizações</span>
                  </div>
               </div>
            </div>

            {/* Feed de Narração (A Alma do Elifoot) */}
            <div
               ref={feedRef}
               className="flex-1 bg-black/20 rounded-[32px] border border-white/5 overflow-y-auto p-6 space-y-4 no-scrollbar shadow-inner"
            >
               {feed.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-secondary/40 gap-4">
                     <MessageSquare size={48} strokeWidth={1} />
                     <p className="text-sm font-medium italic">O árbitro autoriza o início da partida...</p>
                  </div>
               )}
               {feed.map((msg, i) => (
                  <div
                     key={i}
                     className={clsx(
                        "animate-in fade-in slide-in-from-bottom-2 duration-500",
                        msg.type === 'goal' ? "bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl" :
                           msg.type === 'danger' ? "bg-rose-500/5 border-l-4 border-rose-500 p-3" : ""
                     )}
                  >
                     <div className="flex items-start gap-3">
                        <span className="text-[10px] font-black text-secondary mt-1 tabular-nums">{msg.minute}'</span>
                        <p className={clsx(
                           "text-sm leading-relaxed",
                           msg.type === 'goal' ? "text-emerald-400 font-black italic text-lg" :
                              msg.type === 'danger' ? "text-rose-400 font-bold" :
                                 msg.type === 'event' ? "text-primary font-bold" : "text-gray-300"
                        )}>
                           {msg.text}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         </main>

         {/* Controle de Velocidade e Pausa Flutuante */}
         <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-2 z-10">
            <button onClick={() => setIsPaused(!isPaused)} className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all">
               {isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
            </button>
            <button onClick={() => setSpeed(s => s === 1 ? 10 : (s === 10 ? 100 : 1))} className="w-12 h-12 bg-surface border border-white/10 rounded-full flex items-center justify-center text-[10px] font-black shadow-xl">
               {speed}x
            </button>
         </div>

         {/* Rodapé de Gestão em Tempo Real */}
         {!isFinished && (
            <div className="p-6 bg-surface/90 backdrop-blur-2xl border-t border-white/10 space-y-4 pb-safe z-40">
               <div className="flex gap-2">
                  {['Pressionar', 'Acalmar', 'Explorar Alas'].map(shout => (
                     <button
                        key={shout}
                        onClick={() => {
                           setShoutActive(shout === shoutActive ? null : shout);
                           if (shout !== shoutActive) toast(`Gritando: ${shout.toUpperCase()}!`, { icon: '📣' });
                        }}
                        className={clsx(
                           "flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95",
                           shoutActive === shout ? "bg-primary text-white shadow-lg" : "bg-white/5 text-secondary border border-white/5"
                        )}
                     >
                        {shout}
                     </button>
                  ))}
               </div>
               <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { setIsPaused(true); setShowTacticsModal(true); }} className="bg-surface/50 py-4 rounded-2xl text-[11px] font-black uppercase flex items-center justify-center gap-3 border border-white/5">
                     <Settings2 size={16} className="text-primary" /> MUDAR TÁTICA
                  </button>
                  <button onClick={() => { setIsPaused(true); setShowSubModal(true); }} className="bg-emerald-500/10 text-emerald-500 py-4 rounded-2xl text-[11px] font-black uppercase flex items-center justify-center gap-3 border border-emerald-500/20">
                     <ArrowRightLeft size={16} /> SUBSTITUIR
                  </button>
               </div>
            </div>
         )}

         {gameState === 'HT' && (
            <div className="fixed inset-x-0 bottom-0 p-8 bg-surface z-50 animate-in slide-in-from-bottom pb-safe flex flex-col items-center gap-4 border-t border-white/10">
               <div className="flex items-center gap-3">
                  <h4 className="text-2xl font-black italic tracking-tighter text-yellow-500">VESTIÁRIO (INTERVALO)</h4>
               </div>

               <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                  <button onClick={() => setShowTacticsModal(true)} className="bg-surface/50 py-4 rounded-2xl text-[11px] font-black uppercase flex items-center justify-center gap-3 border border-white/5 hover:bg-white/5 transition-colors">
                     <Settings2 size={16} className="text-primary" /> MUDAR TÁTICA
                  </button>
                  <button onClick={() => setShowSubModal(true)} className="bg-emerald-500/10 text-emerald-500 py-4 rounded-2xl text-[11px] font-black uppercase flex items-center justify-center gap-3 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                     <ArrowRightLeft size={16} /> SUBSTITUIR
                  </button>
               </div>

               <button
                  onClick={() => {
                     setGameState('2H');
                     setMinute(45);
                     setStoppageTime(Math.floor(Math.random() * 5) + 2);
                     setIsPaused(false);
                     addNarration("Começa o Segundo Tempo!", 'event');
                  }}
                  className="w-full max-w-sm h-14 bg-white text-black rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all mt-2"
               >
                  Iniciar 2º Tempo
               </button>
            </div>
         )}

         {isFinished && (
            <div className="fixed inset-x-0 bottom-0 p-8 bg-primary z-50 animate-in slide-in-from-bottom pb-safe flex flex-col items-center gap-4">
               <div className="flex items-center gap-3">
                  <Activity size={24} className="text-white animate-pulse" />
                  <h4 className="text-2xl font-black italic tracking-tighter">PARTIDA ENCERRADA</h4>
               </div>
               <button
                  onClick={() => {
                     const commentary: MatchEvent[] = feed
                        .filter(f => f.type !== 'goal')
                        .slice(-12)
                        .map(f => ({ minute: f.minute, type: 'commentary', description: f.text }));
                     onFinish(homeScore, awayScore, [...matchEvents, ...commentary]);
                  }}
                  className="w-full max-w-sm h-16 bg-white text-primary rounded-3xl font-black uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all"
               >
                  Sair para o CT
               </button>
            </div>
         )}

         {/* Modal Tática */}
         {showTacticsModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
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
                  <button onClick={() => { setShowTacticsModal(false); setIsPaused(false); }} className="w-full py-5 bg-white text-background rounded-3xl font-black uppercase tracking-widest">Confirmar</button>
               </div>
            </div>
         )}

         {/* Modal Substituição */}
         {showSubModal && (
            <div className="fixed inset-0 z-[101] bg-background pt-safe flex flex-col">
               <header className="p-6 border-b border-white/10 flex items-center justify-between">
                  <button onClick={() => { setShowSubModal(false); setIsPaused(false); }} className="p-2"><X size={24} /></button>
                  <h3 className="text-xl font-black italic tracking-tighter">SUBSTITUIÇÕES</h3>
                  <div className="w-10"></div>
               </header>
               <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                  <div className="space-y-2">
                     <h4 className="text-[10px] font-black text-secondary uppercase tracking-widest px-2">Quem sai?</h4>
                     {homeTeam.roster.filter(p => homeTeam.lineup.includes(p.id)).map(player => (
                        <button key={player.id} onClick={() => setSelectedSubOut(player.id)}
                           className={clsx("w-full p-4 rounded-2xl border flex items-center justify-between transition-all", selectedSubOut === player.id ? "bg-rose-500/10 border-rose-500" : "bg-surface border-white/5")}
                        >
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center font-black text-[10px] border border-white/10">{player.position}</div>
                              <div className="text-left">
                                 <p className="text-sm font-bold">{player.name}</p>
                                 <span className="text-[10px] text-secondary">OVR {player.overall} • ⚡ {Math.round(player.energy)}%</span>
                              </div>
                           </div>
                        </button>
                     ))}
                  </div>
                  {selectedSubOut && (
                     <div className="space-y-2 animate-in slide-in-from-bottom">
                        <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest px-2">Quem entra?</h4>
                        {homeTeam.roster.filter(p => !homeTeam.lineup.includes(p.id)).map(player => (
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

