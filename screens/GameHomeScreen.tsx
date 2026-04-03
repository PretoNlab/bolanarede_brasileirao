import React from 'react';
import { Globe, History, Play, Trophy } from 'lucide-react';

interface Props {
  onStart: () => void;
  onContinue: () => void;
  onWorldCup: () => void;
  hasSave: boolean;
  onBackHome: () => void;
}

export default function GameHomeScreen({ onStart, onContinue, onWorldCup, hasSave, onBackHome }: Props) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-between overflow-hidden bg-background p-8 text-white relative">
      <div className="absolute top-[-10%] right-[-10%] h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />

      <div className="z-10 flex w-full justify-between text-[11px] font-black uppercase tracking-[0.18em] text-white/45">
        <button onClick={onBackHome} className="transition-opacity hover:opacity-80">
          Voltar ao site
        </button>
        <span>Alpha Mobile</span>
      </div>

      <div className="z-10 flex flex-1 flex-col items-center justify-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-to-tr from-primary to-blue-600 shadow-2xl shadow-primary/20 border border-white/10">
          <Trophy className="h-10 w-10 text-white" />
        </div>
        <h1 className="font-editorial text-5xl font-bold tracking-[-0.08em] text-white">Bola na Rede</h1>
        <p className="mt-3 rounded-full border border-white/8 bg-surface px-4 py-1.5 text-sm font-bold uppercase tracking-[0.2em] text-secondary">
          Manager 2026
        </p>
      </div>

      <div className="z-10 mb-12 w-full max-w-sm space-y-4">
        {hasSave ? (
          <button
            onClick={onContinue}
            className="w-full rounded-2xl bg-primary py-5 px-8 text-white font-black flex items-center justify-between shadow-xl shadow-primary/20 transition-all hover:bg-primary/90"
          >
            <div className="flex items-center gap-3">
              <History size={20} className="text-white" />
              <span>CONTINUAR ÚLTIMO SAVE</span>
            </div>
          </button>
        ) : (
          <button
            onClick={onStart}
            className="w-full rounded-2xl bg-primary py-5 text-white font-black flex items-center justify-center gap-3 shadow-xl shadow-primary/20 transition-all hover:bg-primary/90"
          >
            <Play size={20} fill="currentColor" />
            INICIAR JOGO
          </button>
        )}

        <button
          onClick={onWorldCup}
          className="w-full rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-600 py-5 text-black font-black flex items-center justify-center gap-3 shadow-xl shadow-yellow-500/20 transition-all hover:from-yellow-400 hover:to-amber-500"
        >
          <Globe size={20} />
          COPA DO MUNDO 2026
        </button>

        {hasSave && (
          <button
            onClick={onStart}
            className="w-full rounded-2xl bg-surface py-5 px-8 text-white font-black flex items-center justify-between border border-white/5 transition-all hover:bg-surface/80"
          >
            <div className="flex items-center gap-3">
              <Play size={20} className="text-secondary" fill="currentColor" />
              <span>NOVA CARREIRA</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
