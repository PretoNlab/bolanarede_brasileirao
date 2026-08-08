import React from 'react';
import { Player, DetailedPosition } from '../types';
import { calculatePlayerFitForPosition } from '../engine/tacticsEngine';
import { X, Check } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  players: Player[];
  targetPosition: DetailedPosition;
  currentLineup: string[];
  onSelect: (playerId: string) => void;
  onClose: () => void;
}

export default function PlayerSelectorDrawer({ players, targetPosition, currentLineup, onSelect, onClose }: Props) {
  // Sort players by their fit for this specific slot
  const sortedPlayers = [...players].sort((a, b) => {
    const fitA = calculatePlayerFitForPosition(a, targetPosition).multiplier;
    const fitB = calculatePlayerFitForPosition(b, targetPosition).multiplier;
    return fitB - fitA; // Best fit first
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Content */}
      <div className="relative mx-auto flex max-h-[85dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[32px] border-t border-white/10 bg-surface shadow-2xl animate-in slide-in-from-bottom duration-300 sm:rounded-t-[40px]">
        <div className="p-5 sm:p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex flex-col">
            <h3 className="text-lg sm:text-xl font-black italic tracking-tight uppercase">Escolher Atleta</h3>
            <p className="text-xs font-bold uppercase text-slate-400">Para a posição de {targetPosition}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 active:scale-90 transition-all text-white" aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain no-scrollbar p-4 sm:p-6 space-y-3">
          {sortedPlayers.map((player) => {
            const fitRoll = calculatePlayerFitForPosition(player, targetPosition);
            const fit = fitRoll.multiplier;
            const isInLineup = currentLineup.includes(player.id);
            
            return (
              <button
                key={player.id}
                onClick={() => onSelect(player.id)}
                className={clsx(
                  "w-full p-3.5 sm:p-4 rounded-2xl border flex items-center gap-3 sm:gap-4 transition-all active:scale-[0.98] min-h-[56px]",
                  isInLineup ? "bg-primary/20 border-primary/40" : "bg-white/5 border-white/10 hover:bg-white/10"
                )}
              >
                <div className={clsx(
                  "w-11 h-11 rounded-xl flex items-center justify-center font-black text-xs border text-white shadow-lg shrink-0",
                  fit >= 0.9 ? "bg-emerald-500 border-emerald-400" :
                  fit >= 0.7 ? "bg-amber-500 border-amber-400" :
                  "bg-rose-500 border-rose-400"
                )}>
                  {player.mainPosition}
                </div>

                <div className="flex-1 flex flex-col items-start gap-0.5 min-w-0">
                  <span className="text-sm font-bold text-white truncate max-w-full">{player.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-300">OVR {player.overall}</span>
                    <span className="text-xs text-white/30">•</span>
                    <span className="text-xs font-bold text-emerald-400">FIT {(fit * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={clsx(
                    "text-xs font-extrabold px-2.5 py-1 rounded-lg bg-black/50 border border-white/10",
                    player.preferredFoot === 'BOTH' ? "text-amber-400" : "text-slate-300"
                  )}>
                    {player.preferredFoot === 'BOTH' ? 'AMB' : player.preferredFoot === 'LEFT' ? 'CAN' : 'DES'}
                  </span>
                  {isInLineup && (
                    <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-white scale-110">
                      <Check size={14} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
