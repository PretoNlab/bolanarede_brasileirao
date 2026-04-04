import React, { Suspense, lazy } from 'react';
import { ChevronRight, Globe, History, Play, Trophy } from 'lucide-react';

interface Props {
  onStart: () => void;
  onContinue: () => void;
  onWorldCup: () => void;
  hasSave: boolean;
}

const LazyHeroShowcase = lazy(() => import('./LandingShowcases').then((m) => ({ default: m.HeroShowcase })));
const LazyTriplePhoneShowcase = lazy(() =>
  import('./LandingShowcases').then((m) => ({ default: m.TriplePhoneShowcase }))
);

const floatingCards = [
  {
    className: 'left-[11%] top-[12%] hidden xl:flex',
    title: 'O mercado abriu uma chance',
    text: 'Um atacante livre pode resolver a rodada ou estourar o caixa.',
  },
  {
    className: 'left-[9%] top-[44%] hidden lg:flex',
    title: 'A cobrança já começou',
    text: 'A diretoria cobra agora. A tabela não espera.',
  },
  {
    className: 'right-[11%] top-[14%] hidden xl:flex',
    title: 'Hoje é jogo grande',
    text: 'Moral, desgaste e contexto pesam junto com a escalação.',
  },
  {
    className: 'right-[9%] top-[46%] hidden lg:flex',
    title: 'O jogo pede leitura',
    text: 'Uma troca certa no momento certo pode salvar a campanha.',
  },
];

const proofItems = ['Modo Carreira', 'Clubes Originais', 'Mercado Dinâmico'];

const featuredClubs = [
  { name: 'Bahia', logo: '/logos/bahia.png' },
  { name: 'Palmeiras', logo: '/logos/palmeiras.png' },
  { name: 'Flamengo', logo: '/logos/flamengo.png' },
  { name: 'Corinthians', logo: '/logos/corinthians.png' },
  { name: 'Santos', logo: '/logos/santos.png' },
  { name: 'Cruzeiro', logo: '/logos/cruzeiro.png' },
  { name: 'Grêmio', logo: '/logos/gremio.png' },
  { name: 'Vitória', logo: '/logos/vitoria.png' },
];

const seasonActs = [
  {
    step: '01',
    title: 'Assuma com contexto real',
    text: 'Elenco curto, caixa apertado e pressão antes do tempo de trabalho.',
  },
  {
    step: '02',
    title: 'Responda rodada por rodada',
    text: 'Cada rodada muda moral, ambiente e o peso da próxima decisão.',
  },
  {
    step: '03',
    title: 'Administre mais do que o campo',
    text: 'Mercado, caixa, staff e estrutura pesam o tempo todo.',
  },
  {
    step: '04',
    title: 'Cresça para novos palcos',
    text: 'A jornada começa no clube e pode crescer para competições e torneios maiores.',
  },
];

const featureCards = [
  {
    title: 'Campanhas de clube',
    text: 'Assuma um time, cumpra metas e sustente um projeto sob pressão.',
  },
  {
    title: 'Partidas com intervenção',
    text: 'Leia o jogo, mude a postura e altere o rumo da partida.',
  },
  {
    title: 'Mercado e elenco',
    text: 'Contrate, venda e reorganize o grupo sem perder a ideia de jogo.',
  },
  {
    title: 'Caixa e estrutura',
    text: 'Receita, folha e estrutura definem até onde sua ambição vai.',
  },
  {
    title: 'Staff e desenvolvimento',
    text: 'Comissão, ambiente e evolução do elenco sustentam a campanha.',
  },
  {
    title: 'Clubes, competições e torneios',
    text: 'Alterne entre campanhas longas e torneios curtos de alta pressão.',
  },
];

const modeCards = [
  {
    title: 'Carreira',
    kicker: 'Para quem quer construir',
    text: 'Monte elenco, responda à tabela e sustente uma temporada inteira.',
    cta: 'Entrar na carreira',
    dark: false,
  },
  {
    title: 'Copa do Mundo',
    kicker: 'Para quem quer tensão imediata',
    text: 'Entre direto em partidas que pesam mais e cobram rápido.',
    cta: 'Entrar na Copa',
    dark: true,
  },
];

const faqs = [
  {
    q: 'O jogo fica preso a um único cenário?',
    a: 'Não. A proposta é expandir o universo do jogo com novas ligas, competições, contextos e camadas de gestão.',
  },
  {
    q: 'Já existem modos além da carreira?',
    a: 'Sim. Além da carreira, o jogo também inclui torneios curtos com tensão imediata e decisões de alto peso.',
  },
  {
    q: 'O foco é carreira longa ou torneio curto?',
    a: 'Os dois. Você pode construir uma trajetória em clubes ao longo do tempo ou entrar direto em modos mais intensos, em que cada partida tem peso imediato.',
  },
];

const closingMoments = [
  'Ganhar jogo grande mexendo certo.',
  'Encontrar valor antes do mercado reagir.',
  'Segurar o projeto quando a pressão sobe.',
  'Chegar a decisões com algo real construído.',
];

const navItems = [
  { label: 'Carreira', target: 'modes' },
  { label: 'Copa do Mundo', target: 'modes' },
  { label: 'Mercado', target: 'features' },
  { label: 'Estatísticas', target: 'proof' },
  { label: 'Ajuda', target: 'faq' },
];

function ShowcaseFallback({ hero = false }: { hero?: boolean }) {
  return (
    <div className={hero ? 'h-[610px] w-[286px]' : 'h-[420px] w-[196px]'}>
      <div className="flex h-full w-full items-center justify-center rounded-[42px] bg-[#171717] shadow-[0_40px_90px_rgba(17,17,17,0.14)]">
        <div className="h-[92%] w-[90%] rounded-[32px] bg-[linear-gradient(180deg,#e7f3eb_0%,#fbf8f3_54%,#fbf8f3_100%)]" />
      </div>
    </div>
  );
}

export default function SplashScreen({ onStart, onContinue, onWorldCup, hasSave }: Props) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="h-screen w-full overflow-y-auto overflow-x-hidden bg-[#f4ecde] text-[#2f2418] no-scrollbar">
      <div className="mx-auto min-h-screen w-full max-w-[1320px] px-5 pb-24 pt-5 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo.svg" alt="BNR" className="h-10 w-10" />
            <div className="font-editorial text-lg font-bold tracking-[-0.04em] text-[#2f2418]">BNR <span className="opacity-35">Manager</span></div>
          </div>

          <nav className="hidden items-center gap-8 text-[13px] font-semibold text-[#6e6251] lg:flex">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.target)}
                className="transition-colors hover:text-[#2f2418]"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={onWorldCup}
              className="hidden h-11 items-center justify-center rounded-full border border-[#d1c2ab] bg-[#fbf7ef] px-4 text-[11px] font-black uppercase tracking-[0.14em] text-[#5f5446] shadow-sm sm:flex"
            >
              Copa do Mundo
            </button>
            <button
              onClick={onStart}
              className="flex h-11 items-center justify-center rounded-full bg-emerald-700 px-5 text-[11px] font-black uppercase tracking-[0.14em] text-white shadow-lg shadow-emerald-900/20"
            >
              Começar Carreira
            </button>
          </div>
        </header>

        <main className="relative flex flex-col items-center pt-14 sm:pt-18">
          <section className="relative flex w-full flex-col items-center overflow-hidden rounded-[42px] border border-[#dacbb4] bg-[#efe4d2]/90 px-6 pb-10 pt-10 shadow-[0_30px_80px_rgba(95,72,43,0.12)] sm:px-10 sm:pt-14">
            <div className="absolute top-0 right-0 h-full w-full bg-[radial-gradient(circle_at_top,rgba(79,111,82,0.12),transparent_58%)]" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,transparent,rgba(255,248,238,0.55))]" />
            <div className="max-w-4xl text-center relative z-10">

              <h1 className="font-editorial mt-6 text-[3.2rem] font-bold leading-[0.9] tracking-[-0.08em] text-[#2f2418] sm:text-[4.6rem] lg:text-[5rem] italic">
                Escale, ajuste, negocie e sustente sua campanha até o topo.
              </h1>

              <p className="mx-auto mt-5 max-w-3xl text-[16px] font-semibold leading-8 text-[#6f6253]">
                Monte o elenco, leia o jogo e sustente o projeto quando a pressão subir.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={onStart}
                  className="flex h-12 items-center justify-center gap-3 rounded-full bg-emerald-600 px-8 text-[12px] font-black uppercase tracking-[0.14em] text-white shadow-[0_16px_34px_rgba(31,177,133,0.2)]"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Começar Carreira
                </button>
                <button
                  onClick={onWorldCup}
                  className="flex h-12 items-center justify-center gap-3 rounded-full border border-[#d2c4af] bg-[#fbf7ef] px-8 text-[12px] font-black uppercase tracking-[0.14em] text-[#5a4d40] shadow-[0_10px_22px_rgba(80,61,34,0.08)]"
                >
                  <Globe className="h-4 w-4" />
                  Jogar Copa do Mundo
                </button>
              </div>
            </div>

            <div className="relative mt-10 flex w-full justify-center pb-2 pt-0">
              {floatingCards.map((card) => (
                <div
                  key={card.title}
                  className={`absolute z-10 w-[216px] items-start gap-3 rounded-[22px] border border-[#d7c8b1] bg-[#fbf6ee]/92 px-4 py-4 shadow-[0_24px_40px_rgba(93,72,44,0.08)] ${card.className}`}
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-700/10 text-[10px] font-black text-emerald-700">
                    •
                  </div>
                  <div>
                    <div className="text-[13px] font-black leading-tight text-[#2f2418]">{card.title}</div>
                    <div className="mt-1 text-[12px] font-medium leading-5 text-[#6e6252]">{card.text}</div>
                  </div>
                </div>
              ))}

              <Suspense fallback={<ShowcaseFallback hero />}>
                <div className="-translate-y-3 scale-[1.18] origin-top sm:-translate-y-5 sm:scale-[1.22]">
                  <LazyHeroShowcase />
                </div>
              </Suspense>
            </div>
          </section>

          <section id="proof" className="mx-auto mt-24 max-w-6xl w-full">
            <div className="rounded-[42px] border border-[#ddcfba] bg-[#fbf7f0] p-8 shadow-[0_24px_60px_rgba(95,72,43,0.07)] sm:p-12">
              <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <div className="max-w-4xl">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700">Engine Realista</div>
                  <h2 className="font-editorial mt-6 text-[2.4rem] font-bold leading-[0.9] tracking-[-0.06em] text-[#2f2418] sm:text-[3.6rem] italic">
                    Um Simulador para quem não aceita roteiros prontos.
                  </h2>
                  <p className="mt-6 max-w-3xl text-[17px] font-medium leading-8 text-[#6d6254]">
                    BNR Series foi construído para quem busca profundidade técnica. Cada decisão no mercado ou no gramado reverbera na trajetória do clube.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                  {['Telas reais do jogo', 'Sem Pay-to-win', 'Dados Autênticos'].map((item) => (
                    <div key={item} className="rounded-[24px] border border-[#dfd1bc] bg-[#f5ecdf] px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-[#6a5f51] text-center">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto mt-24 max-w-6xl w-full">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700">Conexão Global</div>
                <h2 className="font-editorial mt-6 text-[2.4rem] font-bold leading-[0.9] tracking-[-0.06em] text-[#2f2418] sm:text-[3.4rem] italic">
                  O ecossistema oficial da Série A e B.
                </h2>
                <p className="mt-6 max-w-xl text-[17px] font-medium leading-8 text-[#6d6254]">
                  Assuma o controle dos clubes brasileiros com elencos atualizados e contexto de mercado realista.
                </p>
              </div>

              <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                {featuredClubs.map((club, index) => (
                  <div
                    key={club.name}
                    className={`flex h-[120px] flex-col items-center justify-center rounded-[32px] border border-[#e1d4c0] bg-[#fbf7f0] shadow-[0_18px_35px_rgba(95,72,43,0.06)] transition-transform hover:scale-105 ${index % 2 === 1 ? 'sm:-translate-y-4' : ''}`}
                  >
                    <img src={club.logo} alt={club.name} loading="lazy" decoding="async" className="h-12 w-12 object-contain" />
                    <div className="mt-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#796d5e]">{club.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="features" className="mx-auto mt-24 max-w-6xl w-full">
            <div className="rounded-[42px] border border-[#ddcfba] bg-[#fbf7f0] px-8 py-10 shadow-[0_24px_60px_rgba(95,72,43,0.07)]">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700">Deep Systems</div>
              <p className="mt-4 max-w-3xl text-[17px] font-medium leading-8 text-[#716555]">
                BNR Series não é sobre simular resultados, é sobre <span className="text-[#2f2418]">sustentar processos sob pressão.</span>
              </p>
              <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {proofItems.map((item) => (
                  <div key={item} className="rounded-[28px] border border-[#e0d3c0] bg-[#f6eee2] px-6 py-8 shadow-sm">
                    <div className="font-editorial text-[1.8rem] font-bold tracking-[-0.05em] text-[#2f2418] italic">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="modes" className="mx-auto mt-24 max-w-6xl w-full">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700">Escalabilidade</div>
                <h2 className="font-editorial mt-6 text-[2.4rem] font-bold leading-[0.9] tracking-[-0.06em] text-[#2f2418] sm:text-[3.4rem] italic">
                  A jornada define o gestor.
                </h2>
                <p className="mt-6 max-w-xl text-[17px] font-medium leading-8 text-[#6d6254]">
                  Comece onde a pressão é maior e prove que seu método sobrevive ao calendário brasileiro.
                </p>
              </div>

              <div className="grid gap-4">
                {seasonActs.map((act) => (
                  <div key={act.step} className="grid gap-6 rounded-[32px] border border-[#e0d3c0] bg-[#fbf7f0] p-8 shadow-sm sm:grid-cols-[80px_1fr]">
                    <div className="font-editorial text-[2.4rem] font-bold leading-none tracking-[-0.08em] text-[#c8b79e] italic">{act.step}</div>
                    <div>
                      <h3 className="font-editorial text-[1.8rem] font-bold leading-[1] tracking-[-0.05em] text-[#2f2418] italic">{act.title}</h3>
                      <p className="mt-4 text-[16px] font-medium leading-7 text-[#6d6254]">{act.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="faq" className="mx-auto mt-32 max-w-6xl w-full">
            <div className="max-w-3xl">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700">Controle Absoluto</div>
              <h2 className="font-editorial mt-6 text-[2.4rem] font-bold leading-[0.9] tracking-[-0.06em] text-[#2f2418] sm:text-[3.4rem] italic">
                Ferramentas para quem domina o caos.
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featureCards.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`rounded-[32px] border p-8 shadow-sm transition-all hover:bg-[#f8f0e5] ${index === 0 ? 'border-emerald-700/20 bg-emerald-700/5' : 'border-[#ddd0bc] bg-[#fbf7f0]'}`}
                >
                  <h3 className="font-editorial text-[1.8rem] font-bold leading-[1] tracking-[-0.05em] text-[#2f2418] italic">{feature.title}</h3>
                  <p className="mt-4 text-[16px] font-medium leading-7 text-[#6d6254]">{feature.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={onStart}
                className="flex h-12 items-center justify-center gap-3 rounded-full bg-emerald-600 px-8 text-[11px] font-black uppercase tracking-[0.15em] text-white shadow-lg"
              >
                Inaugurar Carreira
              </button>
              <button
                onClick={onWorldCup}
                className="flex h-12 items-center justify-center gap-3 rounded-full border border-[#d1c2ab] bg-[#fbf7ef] px-8 text-[11px] font-black uppercase tracking-[0.15em] text-[#5f5446]"
              >
                Copa do Mundo
              </button>
            </div>
          </section>

          <section className="mx-auto mt-32 max-w-6xl w-full">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700">Diferentes Intensidades</div>
                <h2 className="font-editorial mt-6 text-[2.4rem] font-bold leading-[0.9] tracking-[-0.06em] text-[#2f2418] sm:text-[3.4rem] italic">
                  Escolha seu campo de batalha.
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {modeCards.map((card) => (
                  <div
                    key={card.title}
                    className={`rounded-[40px] border p-8 shadow-sm transition-all hover:scale-[1.02] ${card.dark ? 'border-emerald-700/20 bg-[#eef3eb]' : 'border-[#ddd0bc] bg-[#fbf7f0]'}`}
                  >
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#847767]">{card.kicker}</div>
                    <h3 className="font-editorial mt-6 text-[2.2rem] font-bold leading-[1] tracking-[-0.05em] text-[#2f2418] italic">{card.title}</h3>
                    <p className="mt-4 text-[16px] font-medium leading-7 text-[#6d6254]">{card.text}</p>
                    <button
                      onClick={card.dark ? onWorldCup : onStart}
                      className={`mt-8 flex h-12 w-full items-center justify-center rounded-full px-6 text-[11px] font-black uppercase tracking-[0.15em] ${card.dark ? 'bg-emerald-700 text-white' : 'border border-[#d3c4ad] bg-[#f5ecde] text-[#5f5446]'}`}
                    >
                      {card.cta}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mx-auto mt-24 max-w-6xl">
            <div className="rounded-[36px] border border-[#ddd0bc] bg-[#f0e5d2] px-7 py-8 text-[#2f2418] shadow-[0_24px_60px_rgba(95,72,43,0.10)] sm:px-10">
              <div className="max-w-4xl">
                <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8b7b67]">Visão de futuro</div>
                <h2 className="font-editorial mt-4 text-[2.7rem] font-bold leading-[0.92] tracking-[-0.08em] sm:text-[3.5rem]">
                  Identidade forte. Ambição global.
                </h2>
                <p className="mt-4 max-w-3xl text-[15px] font-semibold leading-7 text-[#6d6254]">
                  A base é forte. O próximo passo é abrir espaço para mais contextos, ligas, competições e torneios.
                </p>
              </div>

              <Suspense
                fallback={
                  <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:items-start">
                    <div className="flex justify-center lg:justify-start">
                      <ShowcaseFallback />
                    </div>
                    <div className="flex justify-center">
                      <ShowcaseFallback />
                    </div>
                    <div className="flex justify-center lg:justify-end">
                      <ShowcaseFallback />
                    </div>
                  </div>
                }
              >
                <div className="mt-12">
                  <LazyTriplePhoneShowcase />
                </div>
              </Suspense>
            </div>
          </section>

          <section className="mx-auto mt-24 max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr]">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.24em] text-emerald-700">Perguntas frequentes</div>
                <h2 className="font-editorial mt-4 text-[2.4rem] font-bold leading-[0.92] tracking-[-0.08em] text-[#2f2418] sm:text-[3.2rem]">
                  O essencial antes de entrar no jogo.
                </h2>
                <p className="mt-4 max-w-xl text-[15px] font-semibold leading-7 text-[#6d6254]">
                  O básico, sem enrolação.
                </p>
              </div>

              <div className="space-y-4">
                {faqs.map((item) => (
                  <div key={item.q} className="rounded-[26px] border border-[#ddd0bc] bg-[#fbf7f0] p-6 shadow-sm">
                    <div className="text-[15px] font-black text-[#2f2418]">{item.q}</div>
                    <div className="mt-2 text-[15px] font-semibold leading-7 text-[#6d6254]">{item.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mx-auto mt-40 max-w-6xl w-full pb-safe">
            <div className="relative overflow-hidden rounded-[48px] bg-[linear-gradient(135deg,#d9c1a1_0%,#ead9c2_45%,#f4ebdd_100%)] px-8 py-16 text-[#2f2418] shadow-[0_34px_90px_rgba(95,72,43,0.14)]">
              <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-white/30 blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-emerald-900/10 blur-3xl -translate-x-1/3 translate-y-1/3" />
              <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center relative z-10">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6b5f4f]">Final de Temporada</div>
                  <h2 className="font-editorial mt-6 max-w-4xl text-[3rem] font-bold leading-[0.85] tracking-[-0.06em] sm:text-[4.2rem] italic">
                    Assuma o controle.<br />Escale sua história.
                  </h2>
                  <p className="mt-8 max-w-xl text-[18px] font-bold leading-8 text-[#5f5446] italic">
                    BNR Manager: Onde cada tática é um risco e cada vitória é real.
                  </p>
                </div>

                <div className="flex flex-col gap-4 lg:w-[320px]">
                  <button
                    onClick={onStart}
                    className="flex h-14 items-center justify-center gap-3 rounded-full bg-white px-8 text-[12px] font-black uppercase tracking-[0.15em] text-black shadow-2xl transition-transform hover:scale-105"
                  >
                    Novo Projeto
                  </button>
                  <button
                    onClick={onWorldCup}
                    className="flex h-14 items-center justify-center gap-3 rounded-full border-2 border-[#cab79a] bg-[#fff8ef] px-8 text-[12px] font-black uppercase tracking-[0.15em] text-[#5b5044]"
                  >
                    World Cup 2026
                  </button>
                </div>
              </div>
            </div>
          </section>

          <footer className="mx-auto mt-20 flex w-full max-w-6xl flex-col gap-10 border-t border-[#ddcfba] py-12 text-[#746858] sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-sm">
              <div className="flex items-center gap-4">
                <div className="font-editorial text-xl font-bold tracking-[-0.05em] text-[#2f2418] italic">BNR <span className="opacity-20">Manager</span></div>
              </div>
              <div className="mt-4 text-[14px] font-medium leading-7">
                A próxima geração de simulação esportiva focada em narrativa, contexto e trajetória real de clubes.
              </div>
            </div>

            <div className="flex flex-wrap gap-8 text-[12px] font-black uppercase tracking-[0.15em]">
              {navItems.map((item) => (
                <button
                  key={`footer-${item.label}`}
                  onClick={() => scrollToSection(item.target)}
                  className="transition-colors hover:text-[#2f2418]"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
