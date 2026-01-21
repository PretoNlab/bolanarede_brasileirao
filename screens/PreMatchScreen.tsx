
import React, { useMemo } from 'react';
import { Team, Player } from '../types';
import { ArrowLeft, Play, ShieldAlert, Swords, Users, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

interface Props {
    userTeam: Team;
    opponent: Team;
    onBack: () => void;
    onStartMatch: () => void;
    onTactics: () => void;
    onSquad: () => void;
}

export default function PreMatchScreen({ userTeam, opponent, onBack, onStartMatch, onTactics, onSquad }: Props) {

    // Calculate Team Power
    const userPower = (userTeam.attack + userTeam.defense) / 2;
    const oppPower = (opponent.attack + opponent.defense) / 2;
    const powerDiff = userPower - oppPower;

    // Check for issues in the lineup (Injuries/Suspensions)
    const lineupIssues = useMemo(() => {
        const issues: string[] = [];
        const starters = userTeam.roster.filter(p => userTeam.lineup.includes(p.id));

        if (starters.length !== 11) {
            issues.push(`Você escalou ${starters.length} jogadores. É necessário entrar com 11.`);
        }

        starters.forEach(p => {
            if (p.status === 'injured') {
                issues.push(`${p.name} está lesionado e não pode jogar.`);
            }
            if (p.isSuspended) {
                issues.push(`${p.name} está suspenso.`);
            }
        });

        return issues;
    }, [userTeam]);

    const canStart = lineupIssues.length === 0;

    const TeamCard = ({ team, isUser }: { team: Team, isUser: boolean }) => (
        <div className={clsx(
            "flex flex-col items-center p-6 rounded-3xl border w-full max-w-[160px]",
            isUser ? "bg-primary/10 border-primary/20" : "bg-surface border-white/5"
        )}>
            <div className={clsx(
                "w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-xl",
                "bg-gradient-to-br " + team.logoColor1 + " " + team.logoColor2
            )}>
                <span className="text-2xl font-black text-white">{team.shortName.substring(0, 2)}</span>
            </div>
            <h3 className="text-sm font-black uppercase text-center mb-1">{team.name}</h3>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-secondary uppercase">FORÇA</span>
                <div className="h-1.5 w-12 bg-black/50 rounded-full overflow-hidden">
                    <div
                        className={clsx("h-full", isUser ? "bg-primary" : "bg-rose-500")}
                        style={{ width: `${Math.min(100, (team.attack + team.defense) / 2)}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-screen bg-background text-white">
            {/* Header */}
            <header className="p-4 flex items-center justify-between border-b border-white/5 bg-background/95 backdrop-blur-md sticky top-0 z-40">
                <button onClick={onBack} className="p-2 bg-surface rounded-full">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-sm font-black uppercase tracking-widest">Preparação de Jogo</h1>
                <div className="w-10"></div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center gap-8 pb-32">

                {/* Matchup */}
                <div className="w-full flex items-center justify-center gap-4 animate-in zoom-in duration-500">
                    <TeamCard team={userTeam} isUser={true} />
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl font-black italic text-white/10">VS</span>
                        <div className="px-3 py-1 bg-surface rounded-full text-[10px] font-bold text-secondary border border-white/5 uppercase tracking-widest">
                            {powerDiff > 5 ? "Favorito" : powerDiff < -5 ? "Azarão" : "Equilibrado"}
                        </div>
                    </div>
                    <TeamCard team={opponent} isUser={false} />
                </div>

                {/* Stats Comparison */}
                <div className="w-full bg-surface/50 rounded-[32px] p-6 border border-white/5 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-secondary text-center">Análise de Confronto</h3>

                    <div className="space-y-4">
                        {/* Attack */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold uppercase px-2">
                                <span className="text-primary">Ataque {userTeam.attack}</span>
                                <span className="text-rose-500">Ataque {opponent.attack}</span>
                            </div>
                            <div className="flex gap-1 h-2">
                                <div className="flex-1 bg-black/50 rounded-l-full overflow-hidden flex justify-end">
                                    <div className="h-full bg-primary" style={{ width: `${(userTeam.attack / 100) * 100}%` }}></div>
                                </div>
                                <div className="w-[1px] bg-white/10"></div>
                                <div className="flex-1 bg-black/50 rounded-r-full overflow-hidden flex justify-start">
                                    <div className="h-full bg-rose-500" style={{ width: `${(opponent.attack / 100) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Defense */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold uppercase px-2">
                                <span className="text-primary">Defesa {userTeam.defense}</span>
                                <span className="text-rose-500">Defesa {opponent.defense}</span>
                            </div>
                            <div className="flex gap-1 h-2">
                                <div className="flex-1 bg-black/50 rounded-l-full overflow-hidden flex justify-end">
                                    <div className="h-full bg-primary" style={{ width: `${(userTeam.defense / 100) * 100}%` }}></div>
                                </div>
                                <div className="w-[1px] bg-white/10"></div>
                                <div className="flex-1 bg-black/50 rounded-r-full overflow-hidden flex justify-start">
                                    <div className="h-full bg-rose-500" style={{ width: `${(opponent.defense / 100) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Warnings */}
                {lineupIssues.length > 0 && (
                    <div className="w-full bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 animate-in slide-in-from-bottom">
                        <div className="flex items-center gap-2 mb-2 text-rose-500">
                            <AlertTriangle size={18} />
                            <h4 className="text-xs font-black uppercase">Problemas na Escalação</h4>
                        </div>
                        <ul className="space-y-1">
                            {lineupIssues.map((issue, idx) => (
                                <li key={idx} className="text-xs text-rose-200 flex items-start gap-2">
                                    <span className="mt-1 w-1 h-1 rounded-full bg-rose-500"></span>
                                    {issue}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

            </main>

            {/* Footer Actions */}
            <div className="fixed bottom-0 w-full p-6 bg-surface/90 backdrop-blur-xl border-t border-white/5 flex flex-col gap-3 pb-safe z-50">
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={onTactics} className="py-4 bg-white/5 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase hover:bg-white/10 transition-colors">
                        <Swords size={16} /> Táticas
                    </button>
                    <button onClick={onSquad} className="py-4 bg-white/5 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase hover:bg-white/10 transition-colors">
                        <Users size={16} /> Elenco
                    </button>
                </div>

                <button
                    onClick={onStartMatch}
                    disabled={!canStart}
                    className={clsx(
                        "w-full py-4 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest shadow-xl transition-all active:scale-95",
                        canStart ? "bg-primary text-white shadow-primary/20" : "bg-white/5 text-gray-500 cursor-not-allowed"
                    )}
                >
                    {canStart ? <><Play size={16} fill="currentColor" /> Iniciar Partida</> : "Resolva Pendências"}
                </button>
            </div>
        </div>
    );
}
