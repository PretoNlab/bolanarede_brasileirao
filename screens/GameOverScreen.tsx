import React from 'react';
import { Ban, RotateCcw } from 'lucide-react';

interface Props {
  reason: string;
  onRestart: () => void;
}

export default function GameOverScreen({ reason, onRestart }: Props) {
  return (
    <div className="flex flex-col h-dvh w-full bg-background items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Red ambient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-background to-background z-0"></div>

      <div className="z-10 animate-in zoom-in duration-500 flex flex-col items-center">
        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
            <Ban size={48} className="text-red-500" />
        </div>

        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase">Demitido!</h1>
        <p className="text-red-400 font-bold tracking-widest uppercase text-xs mb-8">Fim de Jogo</p>

        <div className="bg-surface border border-white/5 p-6 rounded-2xl max-w-xs mb-8 shadow-xl">
            <h2 className="text-sm font-bold text-gray-300 mb-2 uppercase">Motivo da Rescisão</h2>
            <p className="text-lg font-medium text-white leading-relaxed">
                {reason}
            </p>
        </div>

        <button 
            onClick={onRestart}
            className="group relative w-full max-w-xs h-14 bg-white text-background font-black text-lg rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
            <RotateCcw size={20} className="group-hover:-rotate-180 transition-transform duration-500" />
            <span>Tentar Novamente</span>
        </button>
      </div>
    </div>
  );
}