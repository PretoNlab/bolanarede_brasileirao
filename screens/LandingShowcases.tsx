import React from 'react';
import { ArrowUpRight, ShieldCheck, Trophy, Zap, Users, TrendingUp } from 'lucide-react';

const standings = [
  { position: 1, team: 'Flamengo', logo: '/logos/landing/flamengo.png', points: 28, active: true },
  { position: 2, team: 'Palmeiras', logo: '/logos/landing/palmeiras.png', points: 26 },
  { position: 3, team: 'Boca Juniors', logo: '/logos/landing/boca.png', points: 24 },
  { position: 4, team: 'Botafogo', logo: '/logos/landing/botafogo.png', points: 23 },
];

const squad = [
  { name: 'Arrascaeta', position: 'MEI', rating: 88 },
  { name: 'Pedro', position: 'ATA', rating: 88 },
  { name: 'Gerson', position: 'VOL', rating: 87 },
];

function TeamLogo({ src, name, size = 'md' }: { src: string; name: string; size?: 'sm' | 'md' | 'lg' }) {
  const dimensions = size === 'lg' ? 'h-12 w-12' : size === 'sm' ? 'h-6 w-6' : 'h-8 w-8';
  return <img src={src} alt={name} className={`${dimensions} shrink-0 object-contain drop-shadow-md`} decoding="async" />;
}

export function HeroShowcase() {
  return (
    <div
      aria-label="Prévia do painel do Bola na Rede Manager"
      className="landing-console mx-auto w-full max-w-[1040px] overflow-hidden rounded-[32px] border border-white/10 bg-[#070d19]/90 shadow-[0_35px_100px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
    >
      {/* Console Bar */}
      <div className="flex h-11 items-center justify-between border-b border-white/10 bg-[#020617]/80 px-5">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="" className="h-6 w-6" />
          <span className="text-xs font-black tracking-wider text-white">BNR MANAGER</span>
          <span className="hidden text-[10px] font-bold uppercase tracking-widest text-emerald-400/70 sm:inline">• SÉRIE A + LIBERTADORES</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          AO VIVO
        </div>
      </div>

      <div className="grid min-h-[380px] grid-cols-1 md:grid-cols-[160px_1fr]">
        {/* Sidebar Nav */}
        <aside className="hidden border-r border-white/10 bg-[#030712] p-4 md:block">
          <div className="mb-6 flex items-center gap-3">
            <TeamLogo src="/logos/landing/flamengo.png" name="Flamengo" />
            <div>
              <div className="text-xs font-black text-white truncate">Flamengo</div>
              <div className="text-[9px] font-bold text-emerald-400/80">Série A • G1</div>
            </div>
          </div>
          {['Painel Principal', 'Elenco Real', 'Tática 4-3-3', 'Mercado Julho', 'Libertadores'].map((item, index) => (
            <div
              key={item}
              className={`mb-1.5 flex h-9 items-center rounded-xl px-3 text-[10px] font-bold transition-all ${
                index === 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              {item}
            </div>
          ))}
        </aside>

        {/* Dashboard Main Content */}
        <div className="bg-[#0b1329] p-4 sm:p-6">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <div className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Rodada 14 • Brasileirão</div>
              <div className="mt-1 text-xl font-black italic tracking-tight text-white">Central de Comando</div>
            </div>
            <div className="hidden text-right sm:block">
              <div className="text-[9px] font-bold uppercase text-slate-400">Próximo Desafio</div>
              <div className="mt-0.5 text-xs font-black text-amber-400">Quarta • Copa Libertadores</div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Match Box */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Confronto Direto</span>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[9px] font-black text-emerald-400">
                  MARACANÃ
                </span>
              </div>
              <div className="mt-6 flex items-center justify-center gap-6 sm:gap-10">
                <div className="text-center">
                  <TeamLogo src="/logos/landing/flamengo.png" name="Flamengo" size="lg" />
                  <div className="mt-2 text-xs font-black text-white">Flamengo</div>
                </div>
                <div className="text-center">
                  <div className="text-[9px] font-bold text-emerald-400">LIBERTADORES</div>
                  <div className="my-1 text-2xl font-black italic text-amber-400">VS</div>
                  <div className="text-[9px] font-bold text-slate-400">Oitavas (Ida)</div>
                </div>
                <div className="text-center">
                  <TeamLogo src="/logos/landing/boca.png" name="Boca Juniors" size="lg" />
                  <div className="mt-2 text-xs font-black text-white">Boca Juniors</div>
                </div>
              </div>
              <button className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-xs font-black uppercase tracking-widest text-black shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                Iniciar partida <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>

            {/* Standings Mini */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tabela de Líderes</span>
                <Trophy className="h-4 w-4 text-amber-400" />
              </div>
              <div className="space-y-1.5">
                {standings.map((team) => (
                  <div
                    key={team.team}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold ${
                      team.active ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300' : 'text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-4 text-[10px] font-black text-slate-400">{team.position}</span>
                      <TeamLogo src={team.logo} name={team.team} size="sm" />
                      <span>{team.team}</span>
                    </div>
                    <span className="font-black text-amber-400">{team.points} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductFacts() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-300">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-emerald-400" /> 40 Clubes (Série A & B)
      </div>
      <div className="flex items-center gap-2">
        <Trophy className="h-4 w-4 text-amber-400" /> Libertadores & Sul-Americana
      </div>
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-emerald-400" /> Elencos Reais de Julho 2026
      </div>
    </div>
  );
}

export function TriplePhoneShowcase() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 backdrop-blur-2xl">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-4">
          <Users className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-black text-white">Elencos Reais Atualizados</h3>
        <p className="mt-2 text-xs font-medium text-slate-400 leading-relaxed">
          Atletas oficiais do futebol brasileiro e sul-americano com idades, posições e atributos de partida revisados.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 backdrop-blur-2xl">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-4">
          <Trophy className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-black text-white">Competições Continentais</h3>
        <p className="mt-2 text-xs font-medium text-slate-400 leading-relaxed">
          Classifique no G-6 do Brasileirão para erguer a Taça da Libertadores contra gigantes como Boca Juniors e River Plate.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 backdrop-blur-2xl">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-4">
          <TrendingUp className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-black text-white">Gestão Rápida e Viciante</h3>
        <p className="mt-2 text-xs font-medium text-slate-400 leading-relaxed">
          Sem burocracia desnecessária. Sessões mobile dinâmicas de 3 a 10 minutos com controle tático em tempo real.
        </p>
      </div>
    </div>
  );
}
