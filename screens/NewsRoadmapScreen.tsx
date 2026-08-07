import React from 'react';
import { Sparkles, Globe, Trophy, Shield, ArrowLeft, Play, Check, Flame, ChevronRight, Zap, Award, Users } from 'lucide-react';

interface Props {
  onBackHome: () => void;
  onStart: () => void;
}

export default function NewsRoadmapScreen({ onBackHome, onStart }: Props) {
  return (
    <div className="min-h-dvh w-full overflow-y-auto overflow-x-hidden bg-[#020617] text-white font-sans selection:bg-emerald-500/30">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 h-16 border-b border-white/10 bg-[#020617]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-full w-full max-w-[1240px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <button onClick={onBackHome} className="flex items-center gap-3 group" title="Voltar para Home">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 blur-md opacity-40 group-hover:opacity-80 transition-opacity" />
              <img src="/logo.svg" alt="BNR" className="h-9 w-9 relative z-10" />
            </div>
            <span className="text-base font-black italic tracking-tight">
              BOLA NA REDE <span className="font-light text-emerald-400">MANAGER</span>
            </span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackHome}
              className="flex h-10 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 text-xs font-bold text-slate-300 transition-all hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 text-emerald-400" />
              <span>Voltar à Home</span>
            </button>

            <button
              onClick={onStart}
              className="flex h-10 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 text-xs font-black uppercase tracking-wider text-black shadow-lg shadow-emerald-500/20 transition-all hover:brightness-110 active:scale-95"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Jogar Agora</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pb-24">
        {/* Hero Section */}
        <section className="relative pt-16 pb-12 border-b border-white/10 bg-gradient-to-b from-emerald-950/20 via-[#020617] to-[#020617]">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[130px]" />

          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-400 shadow-inner">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>Roadmap de Lançamentos &amp; Notas de Versão</span>
            </div>

            <h1 className="mt-6 text-4xl font-black italic tracking-tight text-white sm:text-6xl">
              Novidades do <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400 bg-clip-text text-transparent">Bola Na Rede Manager</span>.
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base font-medium leading-relaxed text-slate-300">
              Acompanhe as últimas notas de atualização da engine tática, melhorias no sistema de simulação e o plano de expansão para as ligas europeias e internacionais.
            </p>
          </div>
        </section>

        {/* Featured Roadmap */}
        <section className="py-16 mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Globe className="h-6 w-6 text-emerald-400" />
            <h2 className="text-2xl font-black italic tracking-tight text-white sm:text-3xl">
              Plano de Expansão Global (Roadmap 2026)
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Card 1: Identidade BNR */}
            <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 via-white/5 to-white/5 p-6 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/50 transition-all">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mb-5">
                <Globe className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Estratégia de Marca</span>
              <h3 className="mt-1 text-xl font-black text-white">BNR Manager: Do Brasil ao Mundo</h3>
              <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                Preserva as raízes do futebol brasileiro enquanto ganha escala para ligas sul-americanas e europeias sem travar no navegador.
              </p>
              <ul className="mt-5 space-y-2.5 text-xs text-slate-300 border-t border-white/10 pt-4">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Interface ultraleve e responsiva</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Sem burocracia ou cadastros demorados</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Save sincronizado em nuvem e offline</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Ligas Europeias */}
            <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 via-white/5 to-white/5 p-6 backdrop-blur-xl relative overflow-hidden group hover:border-amber-500/50 transition-all">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mb-5">
                <Trophy className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Em Desenvolvimento</span>
              <h3 className="mt-1 text-xl font-black text-white">Novas Ligas Europeias</h3>
              <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                Dispute os campeonatos nacionais da Inglaterra, Espanha, Itália, Alemanha e França no mesmo save de carreira.
              </p>
              <div className="mt-5 pt-4 border-t border-white/10 space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Liga Inglesa &amp; Espanhola</span>
                  <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">Em Breve</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Liga dos Campeões Europeus</span>
                  <span className="font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">Fase de Testes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Transferências Globais</span>
                  <span className="font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">Planejado</span>
                </div>
              </div>
            </div>

            {/* Card 3: Torneios & Nomenclatura */}
            <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-b from-teal-500/10 via-white/5 to-white/5 p-6 backdrop-blur-xl relative overflow-hidden group hover:border-teal-500/50 transition-all">
              <div className="h-12 w-12 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center mb-5">
                <Shield className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-400">Segurança de Marca</span>
              <h3 className="mt-1 text-xl font-black text-white">Torneios &amp; Proteção de Marca</h3>
              <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                Competições com nomenclaturas consagradas nos games e 100% protegidas contra direitos autorais.
              </p>
              <div className="mt-5 space-y-2 text-xs border-t border-white/10 pt-4">
                <div className="rounded-xl bg-white/5 p-2.5 flex justify-between items-center text-xs border border-white/5">
                  <span className="font-medium text-slate-200">Liga dos Campeões Europeus</span>
                  <span className="text-xs font-bold text-amber-400">🏆 UEFA</span>
                </div>
                <div className="rounded-xl bg-white/5 p-2.5 flex justify-between items-center text-xs border border-white/5">
                  <span className="font-medium text-slate-200">Liga Europa &amp; Superliga</span>
                  <span className="text-xs font-bold text-emerald-400">⭐ Continental</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Changelog Section */}
        <section className="py-12 mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="flex items-center gap-3 mb-8">
            <Zap className="h-6 w-6 text-amber-400" />
            <h2 className="text-2xl font-black italic tracking-tight text-white sm:text-3xl">
              Notas de Versão (Changelog)
            </h2>
          </div>

          <div className="space-y-6">
            {/* Version 1.2 */}
            <div className="rounded-3xl border border-emerald-500/30 bg-white/5 p-6 backdrop-blur-xl relative">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-black text-emerald-400 border border-emerald-500/30">
                    Versão 1.2 — Atual
                  </span>
                  <span className="text-xs font-bold text-slate-400">Agosto de 2026</span>
                </div>
                <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> Engine Tática Expandida
                </span>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl bg-black/40 p-4 border border-white/5">
                  <h4 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                    <Award className="h-4 w-4" /> Adaptação Posicional
                  </h4>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    Atletas escalados em posições secundárias ou improvisadas ganham **+8% de adaptação por partida** até 100% de rendimento.
                  </p>
                </div>

                <div className="rounded-2xl bg-black/40 p-4 border border-white/5">
                  <h4 className="font-bold text-sm text-teal-400 flex items-center gap-2">
                    <Users className="h-4 w-4" /> Entrosamento Tático (`Cohesion`)
                  </h4>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    Manter a base titular (9+ jogadores) aumenta a coesão do time, gerando bônus de passe e sintonia defensiva.
                  </p>
                </div>

                <div className="rounded-2xl bg-black/40 p-4 border border-white/5">
                  <h4 className="font-bold text-sm text-amber-400 flex items-center gap-2">
                    <Shield className="h-4 w-4" /> SEO &amp; Marca Protegida
                  </h4>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    Nomenclaturas atualizadas para **Bola Na Rede Manager**, garantindo proteção total e alta relevância no Google.
                  </p>
                </div>
              </div>
            </div>

            {/* Version 1.1 */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl relative">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-black text-slate-300 border border-slate-700">
                    Versão 1.1
                  </span>
                  <span className="text-xs font-bold text-slate-400">Julho de 2026</span>
                </div>
              </div>

              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Elencos oficiais das Séries A e B atualizados para a janela de Julho de 2026.</span>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Inclusão da Copa Libertadores e Sul-Americana com fase de grupos e mata-mata.</span>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Implementação do sistema DDA (Dynamic Difficulty Adjustment) para equilíbrio competitivo.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-12 mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/15 to-emerald-950/30 p-10 backdrop-blur-xl">
            <h3 className="text-3xl font-black italic tracking-tight text-white sm:text-4xl">
              Pronto para Liderar Seu Clube?
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Assuma o comando agora no navegador e construa uma campanha inesquecível rumo aos títulos.
            </p>
            <button
              onClick={onStart}
              className="mt-6 inline-flex h-13 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 px-10 text-xs font-black uppercase tracking-widest text-black shadow-2xl shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="h-4 w-4 fill-current" />
              Começar Minha Carreira
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#020617] text-xs text-slate-500">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="BNR" className="h-6 w-6 opacity-80" />
            <span className="font-bold text-slate-300">Bola na Rede Manager</span>
          </div>
          <div>Desenvolvido para apaixonados por futebol brasileiro e internacional.</div>
        </div>
      </footer>
    </div>
  );
}
