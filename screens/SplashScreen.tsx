import React from 'react';
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  History,
  Play,
  Shield,
  Trophy,
  Users,
  Zap,
  Sparkles,
  Flame,
  Globe
} from 'lucide-react';
import { HeroShowcase, ProductFacts, TriplePhoneShowcase } from './LandingShowcases';

interface Props {
  onStart: () => void;
  onContinue: () => void;
  hasSave: boolean;
}

const clubs = [
  { name: 'Flamengo', logo: '/logos/landing/flamengo.png' },
  { name: 'Palmeiras', logo: '/logos/landing/palmeiras.png' },
  { name: 'Corinthians', logo: '/logos/landing/corinthians.png' },
  { name: 'São Paulo', logo: '/logos/landing/saopaulo.png' },
  { name: 'Botafogo', logo: '/logos/landing/botafogo.png' },
  { name: 'Cruzeiro', logo: '/logos/landing/cruzeiro.png' },
  { name: 'Grêmio', logo: '/logos/landing/gremio.png' },
  { name: 'Internacional', logo: '/logos/landing/internacional.png' },
  { name: 'Bahia', logo: '/logos/landing/bahia.png' },
  { name: 'Vasco', logo: '/logos/landing/vasco.png' },
  { name: 'Santos', logo: '/logos/landing/santos.png' },
  { name: 'Vitória', logo: '/logos/landing/vitoria.png' },
];

const journey = [
  {
    number: '01',
    title: 'Assuma o Vestiário',
    text: 'Escolha seu clube na Série A ou B com objetivos, orçamento e pressão de diretoria próprios.',
  },
  {
    number: '02',
    title: 'Defina a Estratégia',
    text: 'Ajuste táticas, gerencie fadiga do elenco e faça contratações cirúrgicas no mercado.',
  },
  {
    number: '03',
    title: 'Conquiste o Continente',
    text: 'Classifique entre os primeiros do Brasileirão e leve seu time ao título da Copa Libertadores.',
  },
];

const pillars = [
  { icon: Users, title: '40 Clubes Oficiais', text: 'Série A e Série B com identidade e cores dos clubes.' },
  { icon: Zap, title: 'Elencos de Julho/2026', text: 'Atletas reais com idades, posições e dados de mercado.' },
  { icon: Trophy, title: 'América do Sul', text: 'Vagas para Copa Libertadores e Sul-Americana.' },
  { icon: CircleDollarSign, title: 'Gestão Inteligente', text: 'Mercado, caixa, staff, treino e categorias de base.' },
];

const faqs = [
  {
    question: 'Preciso criar uma conta para jogar?',
    answer: 'Não! Você pode iniciar sua carreira imediatamente direto no navegador. Seu progresso fica salvo localmente no dispositivo de forma 100% segura e privada.',
  },
  {
    question: 'Quais clubes estão disponíveis?',
    answer: 'Todos os 40 clubes do Campeonato Brasileiro (Série A e Série B), além dos gigantes sul-americanos que disputam os torneios continentais.',
  },
  {
    question: 'Os elencos dos times são reais?',
    answer: 'Sim! Os elencos de todos os clubes utilizam a base oficial de atletas atualizada para a janela de Julho de 2026.',
  },
  {
    question: 'Como funciona a Copa Libertadores no jogo?',
    answer: 'Ao terminar o Brasileirão no G-6, seu clube conquista a vaga para a Copa Libertadores da temporada seguinte, disputando a fase de grupos e o mata-mata contra potências como Boca Juniors e River Plate.',
  },
];

const navItems = [
  { label: 'Visão Geral', target: 'inicio' },
  { label: 'Clubes', target: 'clubes' },
  { label: 'Recursos', target: 'recursos' },
  { label: 'Novidades', target: 'novidades' },
  { label: 'Como Funciona', target: 'jornada' },
  { label: 'Dúvidas', target: 'duvidas' },
];

export default function SplashScreen({ onStart, onContinue, hasSave }: Props) {
  const scrollToSection = (target: string) => {
    if (typeof window === 'undefined') return;
    if (target === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleNavClick = (target: string) => {
    if (target === 'novidades') {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/novidades');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    } else {
      scrollToSection(target);
    }
  };

  return (
    <div className="h-dvh w-full touch-pan-y overflow-y-auto overflow-x-hidden overscroll-contain bg-[#020617] text-white no-scrollbar font-sans selection:bg-emerald-500/30">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 h-16 border-b border-white/10 bg-[#020617]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-full w-full max-w-[1240px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <button onClick={() => handleNavClick('inicio')} className="flex items-center gap-3 group" title="Voltar ao início">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 blur-md opacity-40 group-hover:opacity-80 transition-opacity" />
              <img src="/logo.svg" alt="BNR" className="h-9 w-9 relative z-10" />
            </div>
            <span className="text-base font-black italic tracking-tight">
              BOLA NA REDE <span className="font-light text-emerald-400">MANAGER</span>
            </span>
          </button>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegação principal">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.target)}
                className="text-xs font-bold text-slate-400 transition-colors hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {hasSave && (
              <button
                onClick={onContinue}
                className="flex h-10 items-center justify-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-4 text-xs font-black text-emerald-300 transition-all hover:bg-emerald-500/30"
              >
                <History className="h-4 w-4" />
                <span>Continuar Save</span>
              </button>
            )}
            <button
              onClick={onStart}
              className="flex h-10 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 text-xs font-black uppercase tracking-wider text-black shadow-lg shadow-emerald-500/20 transition-all hover:brightness-110 active:scale-95"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>{hasSave ? 'Novo Jogo' : 'Jogar Agora'}</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="inicio" className="relative overflow-hidden pt-12 sm:pt-16 lg:pt-20 pb-16 border-b border-white/10">
          {/* Ambient Lighting */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="pointer-events-none absolute right-0 top-1/4 h-[300px] w-[400px] rounded-full bg-amber-500/10 blur-[100px]" />

          <div className="relative mx-auto flex w-full max-w-[1240px] flex-col px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[860px] text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-400 shadow-inner">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>Elencos Reais 2026 • Brasileirão &amp; CONMEBOL</span>
              </div>

              {/* Title */}
              <h1 className="mt-6 text-4xl font-black italic tracking-tight leading-[0.95] text-white sm:text-6xl lg:text-7xl">
                Bola Na <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400 bg-clip-text text-transparent">Rede Manager</span>.
              </h1>

              {/* Subtitle */}
              <p className="mx-auto mt-6 max-w-[680px] text-sm font-medium leading-relaxed text-slate-300 sm:text-base">
                Assuma o comando do seu clube de coração, escale astros reais, enfrente a pressão do campeonato nacional e conquiste a glória da América do Sul.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button
                  onClick={onStart}
                  className="flex h-13 w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 px-8 text-xs font-black uppercase tracking-widest text-black shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 sm:w-auto"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Iniciar Minha Carreira
                </button>
                {hasSave && (
                  <button
                    onClick={onContinue}
                    className="flex h-13 w-full items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 text-xs font-black uppercase tracking-widest text-white backdrop-blur-xl transition-all hover:bg-white/10 sm:w-auto"
                  >
                    <History className="h-4 w-4 text-emerald-400" /> Continuar Save
                  </button>
                )}
              </div>

              {/* Live Facts */}
              <div className="mt-8">
                <ProductFacts />
              </div>
            </div>

            {/* Console Preview */}
            <div className="relative mt-12">
              <HeroShowcase />
            </div>
          </div>
        </section>

        {/* Pillars / Numbers Bar */}
        <section className="border-b border-white/10 bg-[#070d19]/60 backdrop-blur-md">
          <div className="mx-auto grid w-full max-w-[1240px] grid-cols-2 gap-4 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
            {pillars.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-xl transition-all hover:border-emerald-500/30"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 mb-3 border border-emerald-500/30">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-sm font-black text-white">{title}</div>
                <div className="mt-1 text-xs text-slate-400 leading-relaxed">{text}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Triple Phone / Feature Showcase */}
        <section id="recursos" className="py-20 border-b border-white/10">
          <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Decisão por Decisão</span>
              <h2 className="text-3xl font-black italic tracking-tight mt-2 sm:text-4xl text-white">
                Sinta o Peso do Vestiário e a Emoção das Copas.
              </h2>
            </div>
            <TriplePhoneShowcase />
          </div>
        </section>

        {/* Club Grid Section */}
        <section id="clubes" className="py-20 border-b border-white/10 bg-[#070d19]/40">
          <div className="mx-auto grid w-full max-w-[1240px] gap-12 px-4 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:px-8">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Série A & Série B</span>
              <h2 className="text-3xl font-black italic tracking-tight mt-2 sm:text-4xl">Seu Clube Está Esperando.</h2>
              <p className="mt-4 text-xs font-medium leading-relaxed text-slate-300">
                Assuma um candidato ao título, resgate um gigante adormecido ou leve um clube da Série B rumo ao topo do continente.
              </p>
              <button
                onClick={onStart}
                className="mt-6 flex items-center gap-2 text-xs font-black text-emerald-400 uppercase tracking-widest hover:text-emerald-300 transition-colors"
              >
                Escolher Meu Clube <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Grid of Club Cards */}
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {clubs.map((club) => (
                <div
                  key={club.name}
                  className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-all hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:scale-105"
                >
                  <img src={club.logo} alt={club.name} loading="lazy" className="h-12 w-12 object-contain drop-shadow-md" />
                  <span className="mt-3 text-[11px] font-black text-slate-200 truncate max-w-full">{club.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Journey Step-by-Step */}
        <section id="jornada" className="py-20 border-b border-white/10">
          <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end mb-12">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Sem Burocracia</span>
                <h2 className="text-3xl font-black italic tracking-tight mt-1 sm:text-4xl">Entre Rápido. Jogue no Seu Ritmo.</h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Clock3 className="h-4 w-4 text-emerald-400" /> Sem cadastro longo ou formulários
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {journey.map((step) => (
                <div
                  key={step.number}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl relative overflow-hidden"
                >
                  <span className="text-3xl font-black text-emerald-500/30 italic">{step.number}</span>
                  <h3 className="mt-3 text-lg font-black text-white">{step.title}</h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Novidades & Expansão Global */}
        <section id="novidades" className="py-20 border-b border-white/10 relative overflow-hidden bg-slate-950/60">
          <div className="pointer-events-none absolute right-0 top-1/2 h-[400px] w-[500px] -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[130px]" />
          
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-emerald-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Roadmap de Lançamentos</span>
                </div>
                <h2 className="text-3xl font-black italic tracking-tight text-white sm:text-4xl mt-3">
                  Novidades &amp; Expansão Global.
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                  O Bola na Rede Manager está evoluindo do futebol brasileiro para uma experiência internacional completa.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Card 1: Identidade BNR */}
              <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-white/10 to-white/5 p-6 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-5">
                  <Globe className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Estratégia de Marca</span>
                <h3 className="mt-1 text-lg font-black text-white">BNR Manager: Do Brasil ao Mundo</h3>
                <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                  Preserva as raízes do futebol brasileiro enquanto ganha escala para ligas sul-americanas e europeias.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Nomenclatura internacional e leve</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Sem burocracia ou cadastros demorados</span>
                  </li>
                </ul>
              </div>

              {/* Card 2: Novas Ligas Europeias */}
              <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-b from-white/10 to-white/5 p-6 backdrop-blur-xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
                <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-5">
                  <Trophy className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Em Breve</span>
                <h3 className="mt-1 text-lg font-black text-white">Novas Ligas Europeias</h3>
                <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                  Dispute campeonatos na Inglaterra, Espanha, Itália, Alemanha e França no mesmo save.
                </p>
                <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Liga Inglesa &amp; Espanhola</span>
                    <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Em Desenvolvimento</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Liga dos Campeões Europeus</span>
                    <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">Fase de Testes</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Nomenclatura Segura & Torneios */}
              <div className="rounded-3xl border border-teal-500/20 bg-gradient-to-b from-white/10 to-white/5 p-6 backdrop-blur-xl relative overflow-hidden group hover:border-teal-500/40 transition-all">
                <div className="h-12 w-12 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/30 flex items-center justify-center mb-5">
                  <Shield className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-teal-400">Segurança &amp; Marca</span>
                <h3 className="mt-1 text-lg font-black text-white">Torneios &amp; Nomenclatura Única</h3>
                <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                  Competições com marcas consagradas nos games e 100% protegidas contra direitos autorais.
                </p>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="rounded-xl bg-white/5 p-2.5 flex justify-between items-center text-[11px] border border-white/5">
                    <span className="font-medium text-slate-300">Liga dos Campeões Europeus</span>
                    <span className="text-xs">🏆</span>
                  </div>
                  <div className="rounded-xl bg-white/5 p-2.5 flex justify-between items-center text-[11px] border border-white/5">
                    <span className="font-medium text-slate-300">Liga Europa &amp; Superliga</span>
                    <span className="text-xs">⭐</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section id="duvidas" className="py-20 border-b border-white/10 bg-[#070d19]/40">
          <div className="mx-auto grid w-full max-w-[1120px] gap-10 px-4 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Tire Suas Dúvidas</span>
              <h2 className="text-3xl font-black italic tracking-tight mt-2 sm:text-4xl">Perguntas Frequentes.</h2>
            </div>
            <div className="space-y-3">
              {faqs.map((item, index) => (
                <details key={item.question} className="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl" open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-sm text-white">
                    {item.question}
                    <ChevronDown className="h-4 w-4 text-emerald-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-xs text-slate-400 leading-relaxed">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="py-24 relative overflow-hidden text-center">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-500/10 via-transparent to-transparent" />
          <div className="relative z-10 mx-auto max-w-[800px] px-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mb-6 shadow-xl shadow-emerald-500/10">
              <Flame className="h-7 w-7" />
            </div>
            <h2 className="text-4xl font-black italic tracking-tight text-white sm:text-5xl">
              Seu Nome na História do Futebol.
            </h2>
            <p className="mt-4 text-sm font-medium text-slate-300 max-w-lg mx-auto leading-relaxed">
              Escolha seu clube de coração e lidere seu elenco rumo aos títulos do Brasileirão e da América do Sul.
            </p>
            <button
              onClick={onStart}
              className="mt-8 inline-flex h-13 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 px-10 text-xs font-black uppercase tracking-widest text-black shadow-2xl shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="h-4 w-4 fill-current" />
              Começar Agora
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
          <div>Desenvolvido para apaixonados por futebol brasileiro e sul-americano.</div>
        </div>
      </footer>
    </div>
  );
}
