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
    <div className="flex h-screen w-full flex-col items-center justify-between overflow-hidden bg-[#050505] p-8 text-white relative">
      <div className="absolute top-[-10%] right-[-10%] h-64 w-64 rounded-full bg-[#1FB185]/10 blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] h-64 w-64 rounded-full bg-[#1FB185]/5 blur-[120px]" />

      <div className="z-10 flex w-full justify-between text-[11px] font-black uppercase tracking-[0.18em] text-white/45">
        <button onClick={onBackHome} className="transition-opacity hover:opacity-80">
          Voltar ao site
        </button>
        <span>Alpha Mobile</span>
      </div>

      <div className="z-10 flex flex-1 flex-col items-center justify-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[32px] bg-white/[0.03] shadow-2xl border border-white/5 relative">
          <div className="absolute inset-0 bg-[#1FB185] blur-3xl opacity-20" />
          <img src="/logo.svg" alt="BNR" className="h-14 w-14 relative z-10 animate-float" />
        </div>
        <div className="flex flex-col items-center">
          <div className="font-editorial text-5xl font-bold tracking-[-0.08em] text-white italic">BNR <span className="opacity-20">Manager</span></div>
          <p className="mt-4 rounded-full border border-[#1FB185]/20 bg-[#1FB185]/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-[#1FB185]">
            Professional Series 2026
          </p>
        </div>
      </div>

      <div className="z-10 mb-12 w-full max-w-sm space-y-4">
        {hasSave ? (
          <button
            onClick={onContinue}
            className="w-full rounded-[24px] bg-white text-black py-5 px-8 font-black flex items-center justify-between shadow-2xl transition-all hover:scale-[1.02] active:scale-95"
          >
            <div className="flex items-center gap-4">
              <History size={18} />
              <span className="text-[12px] uppercase tracking-[0.14em]">Continuar projeto</span>
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
          className="w-full rounded-[24px] bg-[#1FB185] py-5 text-black font-black flex items-center justify-center gap-4 shadow-[0_0_40px_rgba(31,177,133,0.3)] transition-all hover:scale-[1.02] active:scale-95"
        >
          <Globe size={18} />
          <span className="text-[12px] uppercase tracking-[0.14em]">World Cup 2026</span>
        </button>

        {hasSave && (
          <button
            onClick={onStart}
            className="w-full rounded-[24px] bg-white/5 py-5 px-8 text-white font-black flex items-center justify-between border border-white/5 transition-all hover:bg-white/10 active:scale-98"
          >
            <div className="flex items-center gap-4">
              <Play size={18} className="text-[#1FB185]" fill="currentColor" />
              <span className="text-[12px] uppercase tracking-[0.14em]">Iniciar Nova Carreira</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
