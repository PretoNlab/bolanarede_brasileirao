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
      <div className="relative w-full bg-surface border-t border-white/10 rounded-t-[40px] max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex flex-col">
            <h3 className="text-xl font-black italic tracking-tighter uppercase">Escolher Atleta</h3>
            <p className="text-[10px] font-black uppercase text-secondary tracking-widest">Para a posição de {targetPosition}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 active:scale-90 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-3">
          {sortedPlayers.map((player) => {
            const fitRoll = calculatePlayerFitForPosition(player, targetPosition);
            const fit = fitRoll.multiplier;
            const isInLineup = currentLineup.includes(player.id);
            
            return (
              <button
                key={player.id}
                onClick={() => onSelect(player.id)}
                className={clsx(
                  "w-full p-4 rounded-3xl border flex items-center gap-4 transition-all active:scale-[0.98]",
                  isInLineup ? "bg-primary/20 border-primary/30" : "bg-white/5 border-white/5 hover:bg-white/10"
                )}
              >
                <div className={clsx(
                  "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs border text-white shadow-lg",
                  fit >= 0.9 ? "bg-emerald-500 border-emerald-400" :
                  fit >= 0.7 ? "bg-amber-500 border-amber-400" :
                  "bg-rose-500 border-rose-400"
                )}>
                  {player.mainPosition}
                </div>

                <div className="flex-1 flex flex-col items-start gap-0.5">
                  <span className="text-sm font-black text-white">{player.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">OVR {player.overall}</span>
                    <span className="text-[10px] text-white/20">•</span>
                    <span className="text-[10px] font-black uppercase text-emerald-400">FIT {(fit * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={clsx(
                    "text-[10px] font-black px-2 py-1 rounded bg-black/40",
                    player.preferredFoot === 'BOTH' ? "text-amber-400" : "text-white/60"
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
