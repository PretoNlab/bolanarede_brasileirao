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

const proofItems = ['Campanhas de clube', 'Torneio curto', 'Mercado e finanças', '100% offline'];

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
    <div className="h-screen w-full overflow-y-auto overflow-x-hidden bg-[#f3efe7] text-[#111111] no-scrollbar">
      <div className="mx-auto min-h-screen w-full max-w-[1320px] px-5 pb-24 pt-5 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#111111] text-white">
              <Trophy className="h-4 w-4" />
            </div>
            <div className="font-editorial text-sm font-bold tracking-[-0.04em]">Bola na Rede Manager</div>
          </div>

          <nav className="hidden items-center gap-8 text-[13px] font-semibold text-black/72 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.target)}
                className="transition-colors hover:text-[#111111]"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={onWorldCup}
              className="hidden h-11 items-center justify-center rounded-full border border-black/18 bg-white px-4 text-[12px] font-black uppercase tracking-[0.14em] text-[#111111] shadow-[0_10px_22px_rgba(17,17,17,0.06)] sm:flex"
            >
              Jogar Copa do Mundo
            </button>
            <button
              onClick={onStart}
              className="flex h-11 items-center justify-center rounded-full bg-[#111111] px-5 text-[12px] font-black uppercase tracking-[0.14em] text-white shadow-[0_14px_30px_rgba(17,17,17,0.18)]"
            >
              Começar carreira
            </button>
          </div>
        </header>

        <main className="relative flex flex-col items-center pt-14 sm:pt-18">
          <section className="relative flex w-full flex-col items-center overflow-hidden rounded-[42px] border border-black/10 bg-[radial-gradient(circle_at_top,rgba(161,193,167,0.22),transparent_40%),linear-gradient(180deg,#fcfaf6_0%,#eee8de_100%)] px-6 pb-10 pt-10 shadow-[0_24px_70px_rgba(17,17,17,0.08)] sm:px-10 sm:pt-14">
            <div className="max-w-4xl text-center">
              <div className="inline-flex rounded-full border border-[#0f6b47]/14 bg-white/92 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#0f6b47] shadow-[0_8px_20px_rgba(15,107,71,0.08)]">
                Sem DRM. Sem microtransações. 100% offline.
              </div>

              <h1 className="font-editorial mt-6 text-[3.2rem] font-bold leading-[0.9] tracking-[-0.08em] text-[#111111] sm:text-[4.6rem] lg:text-[5rem]">
                Escale, ajuste, negocie e sustente sua campanha até o topo.
              </h1>

              <p className="mx-auto mt-5 max-w-3xl text-[16px] font-semibold leading-8 text-black/72">
                Monte o elenco, leia o jogo e sustente o projeto quando a pressão subir.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {['Modo carreira', 'Clubes e torneios', 'Mercado e bastidores', 'Torneios decisivos'].map((item) => (
                  <div
                    key={item}
                    className="rounded-[18px] border border-black/12 bg-white/92 px-4 py-4 text-[12px] font-black uppercase tracking-[0.12em] text-[#111111] shadow-[0_10px_22px_rgba(17,17,17,0.05)]"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {hasSave ? (
                  <button
                    onClick={onContinue}
                    className="flex h-12 items-center justify-center gap-3 rounded-full bg-[#111111] px-6 text-[12px] font-black uppercase tracking-[0.14em] text-white shadow-[0_16px_34px_rgba(17,17,17,0.18)]"
                  >
                    <History className="h-4 w-4" />
                    Continuar último save
                  </button>
                ) : (
                  <button
                    onClick={onStart}
                    className="flex h-12 items-center justify-center gap-3 rounded-full bg-[#111111] px-6 text-[12px] font-black uppercase tracking-[0.14em] text-white shadow-[0_16px_34px_rgba(17,17,17,0.18)]"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Começar carreira
                  </button>
                )}
                <button
                  onClick={onWorldCup}
                  className="flex h-12 items-center justify-center gap-3 rounded-full border border-black/16 bg-white px-6 text-[12px] font-black uppercase tracking-[0.14em] text-[#111111] shadow-[0_10px_22px_rgba(17,17,17,0.06)]"
                >
                  <Globe className="h-4 w-4" />
                  Jogar Copa do Mundo
                </button>
                {hasSave && (
                  <button
                    onClick={onStart}
                    className="flex h-12 items-center justify-center gap-2 rounded-full px-4 text-[12px] font-black uppercase tracking-[0.14em] text-black/74"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Nova carreira
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="relative mt-10 flex w-full justify-center pb-2 pt-0">
              {floatingCards.map((card) => (
                <div
                  key={card.title}
                  className={`absolute z-10 w-[216px] items-start gap-3 rounded-[18px] border border-black/12 bg-white/96 px-4 py-3 shadow-[0_18px_34px_rgba(17,17,17,0.1)] backdrop-blur-xl ${card.className}`}
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e7f3eb] text-[10px] font-black text-[#0f6b47]">
                    •
                  </div>
                  <div>
                    <div className="text-[13px] font-black leading-tight text-[#111111]">{card.title}</div>
                    <div className="mt-1 text-[12px] font-medium leading-5 text-black/70">{card.text}</div>
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

          <section id="proof" className="mx-auto mt-24 max-w-6xl">
            <div className="rounded-[34px] border border-black/10 bg-white/90 p-7 shadow-[0_18px_40px_rgba(17,17,17,0.06)] sm:p-9">
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                <div className="max-w-4xl">
                  <div className="text-[11px] font-black uppercase tracking-[0.24em] text-[#0f6b47]">Produto jogável</div>
                  <h2 className="font-editorial mt-4 text-[2.4rem] font-bold leading-[0.92] tracking-[-0.08em] text-[#111111] sm:text-[3.3rem]">
                    Um football manager para quem quer decisão com consequência.
                  </h2>
                  <p className="mt-4 max-w-3xl text-[15px] font-semibold leading-7 text-black/72">
                    A landing mostra o jogo como ele é: gestão, mercado, tabela, caixa e pressão correndo ao mesmo tempo.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {['Telas reais do jogo', 'Entrada instantânea', 'Sem microtransações'].map((item) => (
                    <div key={item} className="rounded-[20px] border border-black/12 bg-[#f7f2ea] px-4 py-4 text-[12px] font-black uppercase tracking-[0.12em] text-[#111111]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto mt-20 max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.24em] text-[#0f6b47]">Universo do football manager</div>
                <h2 className="font-editorial mt-4 text-[2.4rem] font-bold leading-[0.92] tracking-[-0.08em] text-[#111111] sm:text-[3.2rem]">
                  Clubes, tabela, mercado e pressão para a temporada ganhar peso real.
                </h2>
                <p className="mt-4 max-w-xl text-[15px] font-semibold leading-7 text-black/72">
                  Elenco, calendário, metas e contexto empurrando a campanha o tempo todo.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                {featuredClubs.map((club, index) => (
                  <div
                    key={club.name}
                    className={`flex h-[106px] flex-col items-center justify-center rounded-[24px] border border-black/12 bg-white shadow-[0_14px_30px_rgba(17,17,17,0.07)] ${index === 1 || index === 5 ? 'sm:-translate-y-3' : ''}`}
                  >
                    <img src={club.logo} alt={club.name} loading="lazy" decoding="async" className="h-11 w-11 object-contain" />
                    <div className="mt-3 text-[10px] font-black uppercase tracking-[0.1em] text-black/60">{club.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="features" className="mx-auto mt-24 max-w-6xl">
            <div className="rounded-[30px] border border-black/10 bg-white/90 px-6 py-6">
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#0f6b47]">O que já está em campo</div>
              <p className="mt-3 max-w-3xl text-[15px] font-semibold leading-7 text-black/72">
                Nada de promessa vazia. Você já entra com campanha, gestão e torneios prontos para jogar.
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {proofItems.map((item) => (
                  <div key={item} className="rounded-[22px] border border-black/12 bg-[#faf7f2] px-5 py-5">
                    <div className="font-editorial text-[1.8rem] font-bold tracking-[-0.06em] text-[#111111]">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="modes" className="mx-auto mt-24 max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.24em] text-[#0f6b47]">Da primeira rodada ao jogo que muda tudo</div>
                <h2 className="font-editorial mt-4 text-[2.4rem] font-bold leading-[0.92] tracking-[-0.08em] text-[#111111] sm:text-[3.2rem]">
                  Toda campanha começa sob pressão. As maiores histórias vão além de uma temporada.
                </h2>
                <p className="mt-4 max-w-xl text-[15px] font-semibold leading-7 text-black/72">
                  Você começa pressionado. Depois, cada rodada cobra mais.
                </p>
              </div>

              <div className="grid gap-4">
                {seasonActs.map((act) => (
                  <div key={act.step} className="grid gap-4 rounded-[28px] border border-black/10 bg-white/92 p-6 shadow-[0_12px_28px_rgba(17,17,17,0.05)] sm:grid-cols-[72px_1fr]">
                    <div className="font-editorial text-[2.1rem] font-bold leading-none tracking-[-0.08em] text-black/24">{act.step}</div>
                    <div>
                      <h3 className="font-editorial text-[1.6rem] font-bold leading-[0.95] tracking-[-0.06em] text-[#111111]">{act.title}</h3>
                      <p className="mt-3 text-[15px] font-semibold leading-7 text-black/70">{act.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="faq" className="mx-auto mt-24 max-w-6xl">
            <div className="max-w-3xl">
              <div className="text-[11px] font-black uppercase tracking-[0.24em] text-[#0f6b47]">Mais do que escalar um time</div>
              <h2 className="font-editorial mt-4 text-[2.4rem] font-bold leading-[0.92] tracking-[-0.08em] text-[#111111] sm:text-[3.2rem]">
                Um manager feito para transformar decisões em trajetória.
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] font-semibold leading-7 text-black/72">
                Cada sistema existe para fazer a decisão bater no campo e fora dele.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featureCards.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`rounded-[28px] border p-6 shadow-[0_12px_28px_rgba(17,17,17,0.05)] ${index === 0 ? 'border-[#0f6b47]/18 bg-[#eff8f1]' : 'border-black/10 bg-white/92'}`}
                >
                  <h3 className="font-editorial text-[1.8rem] font-bold leading-[0.95] tracking-[-0.06em] text-[#111111]">{feature.title}</h3>
                  <p className="mt-3 text-[15px] font-semibold leading-7 text-black/70">{feature.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={onStart}
                className="flex h-12 items-center justify-center gap-3 rounded-full bg-[#111111] px-6 text-[12px] font-black uppercase tracking-[0.14em] text-white shadow-[0_16px_34px_rgba(17,17,17,0.18)]"
              >
                <Play className="h-4 w-4 fill-current" />
                Começar carreira
              </button>
              <button
                onClick={onWorldCup}
                className="flex h-12 items-center justify-center gap-3 rounded-full border border-black/16 bg-white px-6 text-[12px] font-black uppercase tracking-[0.14em] text-[#111111] shadow-[0_10px_22px_rgba(17,17,17,0.06)]"
              >
                <Globe className="h-4 w-4" />
                Jogar Copa do Mundo
              </button>
            </div>
          </section>

          <section className="mx-auto mt-24 max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.24em] text-[#0f6b47]">Duas formas de viver a pressão</div>
                <h2 className="font-editorial mt-4 text-[2.4rem] font-bold leading-[0.92] tracking-[-0.08em] text-[#111111] sm:text-[3.2rem]">
                  Construa no longo prazo ou decida tudo em poucos jogos.
                </h2>
                <p className="mt-4 max-w-xl text-[15px] font-semibold leading-7 text-black/72">
                  Um modo entrega progressão. O outro entrega urgência.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {modeCards.map((card) => (
                  <div
                    key={card.title}
                    className={`rounded-[30px] border p-6 shadow-[0_18px_38px_rgba(17,17,17,0.06)] ${card.dark ? 'border-black/10 bg-[#111111] text-white' : 'border-black/10 bg-white text-[#111111]'}`}
                  >
                    <div className={`text-[11px] font-black uppercase tracking-[0.2em] ${card.dark ? 'text-white/42' : 'text-black/40'}`}>{card.kicker}</div>
                    <h3 className="font-editorial mt-4 text-[2.2rem] font-bold leading-[0.92] tracking-[-0.07em]">{card.title}</h3>
                    <p className={`mt-4 text-[15px] font-semibold leading-7 ${card.dark ? 'text-white/82' : 'text-black/72'}`}>{card.text}</p>
                    <button
                      onClick={card.dark ? onWorldCup : onStart}
                      className={`mt-6 flex h-11 items-center justify-center rounded-full px-5 text-[12px] font-black uppercase tracking-[0.14em] ${card.dark ? 'bg-white text-[#111111]' : 'bg-[#111111] text-white'}`}
                    >
                      {card.cta}
                    </button>
                    <div className={`mt-3 text-[12px] font-semibold ${card.dark ? 'text-white/56' : 'text-black/54'}`}>
                      {card.dark ? 'Partidas diretas e peso imediato.' : 'Evolução, contexto e campanha longa.'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mx-auto mt-24 max-w-6xl">
            <div className="rounded-[36px] bg-[#111111] px-7 py-8 text-white shadow-[0_24px_60px_rgba(17,17,17,0.16)] sm:px-10">
              <div className="max-w-4xl">
                <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/38">Visão de futuro</div>
                <h2 className="font-editorial mt-4 text-[2.7rem] font-bold leading-[0.92] tracking-[-0.08em] sm:text-[3.5rem]">
                  Identidade forte. Ambição global.
                </h2>
                <p className="mt-4 max-w-3xl text-[15px] font-semibold leading-7 text-white/78">
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
                <div className="text-[11px] font-black uppercase tracking-[0.24em] text-[#0f6b47]">Perguntas frequentes</div>
                <h2 className="font-editorial mt-4 text-[2.4rem] font-bold leading-[0.92] tracking-[-0.08em] text-[#111111] sm:text-[3.2rem]">
                  O essencial antes de entrar no jogo.
                </h2>
                <p className="mt-4 max-w-xl text-[15px] font-semibold leading-7 text-black/72">
                  O básico, sem enrolação.
                </p>
              </div>

              <div className="space-y-4">
                {faqs.map((item) => (
                  <div key={item.q} className="rounded-[26px] border border-black/10 bg-white/92 p-6 shadow-[0_12px_28px_rgba(17,17,17,0.05)]">
                    <div className="text-[15px] font-black text-[#111111]">{item.q}</div>
                    <div className="mt-2 text-[15px] font-semibold leading-7 text-black/70">{item.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mx-auto mt-24 max-w-6xl pb-safe">
            <div className="rounded-[36px] bg-[#111111] px-7 py-8 text-white shadow-[0_24px_60px_rgba(17,17,17,0.12)] sm:px-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/38">Pronto para começar?</div>
                  <h2 className="font-editorial mt-4 max-w-4xl text-[2.8rem] font-bold leading-[0.92] tracking-[-0.08em] sm:text-[3.6rem]">
                    Comece a campanha. Aguente a pressão.
                  </h2>
                  <p className="mt-4 max-w-3xl text-[15px] font-semibold leading-7 text-white/78">
                    Escolha seu modo, entre no jogo e faça as decisões aguentarem noventa minutos e uma temporada inteira.
                  </p>

                  <div className="mt-6 grid gap-2 sm:grid-cols-2">
                    {closingMoments.map((moment) => (
                      <div key={moment} className="rounded-[18px] border border-white/14 bg-white/10 px-4 py-3 text-[13px] font-semibold text-white/88">
                        {moment}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 lg:w-[300px]">
                  <button
                    onClick={onStart}
                    className="flex h-12 items-center justify-center gap-3 rounded-full bg-white px-6 text-[12px] font-black uppercase tracking-[0.14em] text-[#111111] shadow-[0_16px_34px_rgba(255,255,255,0.12)]"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Começar carreira
                  </button>
                  <div className="text-center text-[12px] font-semibold text-white/56">Campanha longa e progressão.</div>
                  <button
                    onClick={onWorldCup}
                    className="flex h-12 items-center justify-center gap-3 rounded-full border border-white/18 bg-white/10 px-6 text-[12px] font-black uppercase tracking-[0.14em] text-white"
                  >
                    <Globe className="h-4 w-4" />
                    Jogar Copa do Mundo
                  </button>
                  <div className="text-center text-[12px] font-semibold text-white/56">Torneio curto e decisão imediata.</div>
                  {hasSave && (
                    <button
                      onClick={onContinue}
                      className="flex h-12 items-center justify-center gap-2 rounded-full px-4 text-[12px] font-black uppercase tracking-[0.14em] text-white/82"
                    >
                      <History className="h-4 w-4" />
                      Continuar save
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          <footer className="mx-auto mt-10 flex w-full max-w-6xl flex-col gap-6 border-t border-black/10 py-8 text-black/68 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-editorial text-lg font-bold tracking-[-0.05em] text-[#111111]">Bola na Rede Manager</div>
              <div className="mt-1 text-[13px] font-medium">Football manager offline com foco em campanha, mercado e decisões com consequência.</div>
            </div>

            <div className="flex flex-wrap gap-4 text-[13px] font-semibold">
              {navItems.map((item) => (
                <button
                  key={`footer-${item.label}`}
                  onClick={() => scrollToSection(item.target)}
                  className="transition-colors hover:text-[#111111]"
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
